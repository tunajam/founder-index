package handler

import (
	"context"
	"fmt"
	"math"
	"sort"
	"strings"

	"connectrpc.com/connect"
	founderindexv1 "github.com/tunajam/founder-index/backend/gen/founderindex/v1"
)

type FounderIndexServer struct{}

func New() *FounderIndexServer {
	return &FounderIndexServer{}
}

func (s *FounderIndexServer) ListStocks(
	ctx context.Context,
	req *connect.Request[founderindexv1.ListStocksRequest],
) (*connect.Response[founderindexv1.ListStocksResponse], error) {
	minNE := int(req.Msg.MinNetworkEffects)
	minFL := int(req.Msg.MinFounderLed)
	sector := req.Msg.Sector
	limit := int(req.Msg.Limit)
	offset := int(req.Msg.Offset)

	if minNE < 1 {
		minNE = 1
	}
	if minFL < 1 {
		minFL = 1
	}

	var filtered []*stockData
	for _, st := range allStocks {
		if st.NetworkEffects >= minNE && st.FounderLed >= minFL {
			if sector != "" && !strings.EqualFold(st.Sector, sector) {
				continue
			}
			filtered = append(filtered, st)
		}
	}

	// Sort
	sortBy := req.Msg.SortBy
	if sortBy == "" {
		sortBy = "combined"
	}
	sort.Slice(filtered, func(i, j int) bool {
		var less bool
		switch sortBy {
		case "network_effects":
			less = filtered[i].NetworkEffects > filtered[j].NetworkEffects
		case "founder_led":
			less = filtered[i].FounderLed > filtered[j].FounderLed
		case "ticker":
			less = filtered[i].Ticker < filtered[j].Ticker
		default: // combined
			ci := filtered[i].NetworkEffects + filtered[i].FounderLed
			cj := filtered[j].NetworkEffects + filtered[j].FounderLed
			less = ci > cj
		}
		if req.Msg.Ascending {
			return !less
		}
		return less
	})

	totalCount := len(filtered)

	// Apply offset
	if offset > 0 && offset < len(filtered) {
		filtered = filtered[offset:]
	} else if offset >= len(filtered) {
		filtered = nil
	}

	// Apply limit
	isTruncated := false
	if limit <= 0 {
		limit = 10 // free tier default
	}
	if limit < len(filtered) {
		filtered = filtered[:limit]
		isTruncated = true
	}

	stocks := make([]*founderindexv1.Stock, len(filtered))
	for i, st := range filtered {
		stocks[i] = st.toProto()
	}

	return connect.NewResponse(&founderindexv1.ListStocksResponse{
		Stocks:      stocks,
		TotalCount:  int32(totalCount),
		IsTruncated: isTruncated,
	}), nil
}

func (s *FounderIndexServer) GetStock(
	ctx context.Context,
	req *connect.Request[founderindexv1.GetStockRequest],
) (*connect.Response[founderindexv1.GetStockResponse], error) {
	ticker := strings.ToUpper(req.Msg.Ticker)
	for _, st := range allStocks {
		if st.Ticker == ticker {
			return connect.NewResponse(&founderindexv1.GetStockResponse{
				Stock: st.toProto(),
			}), nil
		}
	}
	return nil, connect.NewError(connect.CodeNotFound, nil)
}

func (s *FounderIndexServer) GetBacktest(
	ctx context.Context,
	req *connect.Request[founderindexv1.GetBacktestRequest],
) (*connect.Response[founderindexv1.GetBacktestResponse], error) {
	period := req.Msg.Period
	if period == "" {
		period = "5Y"
	}

	var years int
	var portfolioCAGR, sp500CAGR float64
	switch period {
	case "1Y":
		years = 1
		portfolioCAGR = 0.29
		sp500CAGR = 0.084
	case "10Y":
		years = 10
		portfolioCAGR = 0.22
		sp500CAGR = 0.095
	default: // 5Y
		years = 5
		portfolioCAGR = 0.25
		sp500CAGR = 0.10
		period = "5Y"
	}

	points := generateBacktest(years, portfolioCAGR, sp500CAGR)
	last := points[len(points)-1]

	protoPoints := make([]*founderindexv1.BacktestPoint, len(points))
	for i, p := range points {
		protoPoints[i] = &founderindexv1.BacktestPoint{
			Date:      p.Date,
			Portfolio: p.Portfolio,
			Sp500:     p.SP500,
		}
	}

	return connect.NewResponse(&founderindexv1.GetBacktestResponse{
		Points:          protoPoints,
		PortfolioReturn: last.Portfolio,
		Sp500Return:     last.SP500,
		Alpha:           math.Round((last.Portfolio-last.SP500)*10) / 10,
		Period:          period,
	}), nil
}

type backtestPoint struct {
	Date      string
	Portfolio float64
	SP500     float64
}

func generateBacktest(years int, portfolioCAGR, sp500CAGR float64) []backtestPoint {
	totalMonths := years * 12
	monthlyP := math.Pow(1+portfolioCAGR, 1.0/12) - 1
	monthlyS := math.Pow(1+sp500CAGR, 1.0/12) - 1

	points := make([]backtestPoint, 0, totalMonths+1)
	for i := 0; i <= totalMonths; i++ {
		fi := float64(i)
		noise1 := 1 + math.Sin(fi*0.7)*0.02 + math.Sin(fi*1.3)*0.015 + math.Cos(fi*0.3)*0.01
		noise2 := 1 + math.Sin(fi*0.5)*0.015 + math.Cos(fi*0.9)*0.01

		drawdown1, drawdown2 := 1.0, 1.0
		monthsFromCovid := float64(totalMonths-i) - 48
		if math.Abs(monthsFromCovid) < 3 {
			drawdown1 = 0.75 + (3-math.Abs(monthsFromCovid))*0.05
			drawdown2 = 0.70 + (3-math.Abs(monthsFromCovid))*0.05
		}
		monthsFrom2022 := float64(totalMonths-i) - 30
		if math.Abs(monthsFrom2022) < 6 {
			drawdown1 = 0.90
			drawdown2 = 0.85
		}

		pReturn := (math.Pow(1+monthlyP, fi)*noise1*drawdown1 - 1) * 100
		sReturn := (math.Pow(1+monthlyS, fi)*noise2*drawdown2 - 1) * 100

		// Approximate date
		monthOffset := totalMonths - i
		year := 2026 - monthOffset/12
		month := 2 - monthOffset%12
		if month <= 0 {
			month += 12
			year--
		}

		points = append(points, backtestPoint{
			Date:      fmt.Sprintf("%04d-%02d", year, month),
			Portfolio: math.Round(pReturn*10) / 10,
			SP500:     math.Round(sReturn*10) / 10,
		})
	}
	return points
}
