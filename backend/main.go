package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math"
	"net/http"
	"os"
	"sort"
	"strconv"
	"strings"
	"sync"
	"time"
)

// --- Types ---

type StockScore struct {
	Symbol     string `json:"symbol"`
	Name       string `json:"name"`
	FounderLed bool   `json:"founder_led"`
	NetworkScore int  `json:"network_score"`
	Sector     string `json:"sector"`
}

type MonthlyPrice struct {
	Date  string  `json:"date"`  // YYYY-MM
	Close float64 `json:"close"`
}

type BacktestPoint struct {
	Date          string  `json:"date"`
	PortfolioValue float64 `json:"portfolio_value"`
	BenchmarkValue float64 `json:"benchmark_value"`
}

type BacktestResponse struct {
	Points          []BacktestPoint `json:"points"`
	PortfolioReturn float64         `json:"portfolio_return"`
	BenchmarkReturn float64         `json:"benchmark_return"`
	PortfolioCAGR   float64         `json:"portfolio_cagr"`
	BenchmarkCAGR   float64         `json:"benchmark_cagr"`
	StockCount      int             `json:"stock_count"`
	Symbols         []string        `json:"symbols"`
}

type QuoteResponse struct {
	Symbol       string  `json:"symbol"`
	Name         string  `json:"name"`
	Price        float64 `json:"price"`
	Change       float64 `json:"change"`
	ChangePct    float64 `json:"change_pct"`
	FounderLed   bool    `json:"founder_led"`
	NetworkScore int     `json:"network_score"`
	Sector       string  `json:"sector"`
	Return1Y     float64 `json:"return_1y"`
	Return5Y     float64 `json:"return_5y"`
}

// --- Global State ---

var (
	scores     []StockScore
	priceCache = make(map[string][]MonthlyPrice)
	cacheMu    sync.RWMutex
)

func main() {
	// Load scores
	data, err := os.ReadFile("../data/scores.json")
	if err != nil {
		log.Fatal("Failed to read scores.json:", err)
	}
	if err := json.Unmarshal(data, &scores); err != nil {
		log.Fatal("Failed to parse scores.json:", err)
	}

	// Deduplicate scores by symbol
	seen := make(map[string]bool)
	var unique []StockScore
	for _, s := range scores {
		if !seen[s.Symbol] {
			seen[s.Symbol] = true
			unique = append(unique, s)
		}
	}
	scores = unique

	log.Printf("Loaded %d stock scores", len(scores))

	// Load cached prices from disk if available
	loadPriceCacheFromDisk()

	// Fetch prices for all stocks in background
	go fetchAllPrices()

	// HTTP server
	mux := http.NewServeMux()
	mux.HandleFunc("/api/scores", corsWrap(handleScores))
	mux.HandleFunc("/api/backtest", corsWrap(handleBacktest))
	mux.HandleFunc("/api/quotes", corsWrap(handleQuotes))
	mux.HandleFunc("/api/status", corsWrap(handleStatus))

	port := "8457"
	log.Printf("Starting Founder Index API on :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, mux))
}

func corsWrap(h http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == "OPTIONS" {
			w.WriteHeader(200)
			return
		}
		h(w, r)
	}
}

func handleStatus(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	cacheMu.RLock()
	count := len(priceCache)
	cacheMu.RUnlock()
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":       "ok",
		"stocks_loaded": len(scores),
		"prices_cached": count,
	})
}

func handleScores(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(scores)
}

func handleQuotes(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	minNetwork, _ := strconv.Atoi(r.URL.Query().Get("min_network"))
	founderOnly := r.URL.Query().Get("founder_only") == "true"

	cacheMu.RLock()
	defer cacheMu.RUnlock()

	var results []QuoteResponse
	for _, s := range scores {
		if s.Symbol == "SPY" {
			continue
		}
		if s.NetworkScore < minNetwork {
			continue
		}
		if founderOnly && !s.FounderLed {
			continue
		}

		prices := priceCache[s.Symbol]
		if len(prices) == 0 {
			continue
		}

		current := prices[len(prices)-1].Close
		var return1y, return5y float64

		if idx := len(prices) - 13; idx >= 0 {
			return1y = (current/prices[idx].Close - 1) * 100
		}
		if idx := len(prices) - 61; idx >= 0 {
			return5y = (current/prices[idx].Close - 1) * 100
		}

		results = append(results, QuoteResponse{
			Symbol:       s.Symbol,
			Name:         s.Name,
			Price:        math.Round(current*100) / 100,
			FounderLed:   s.FounderLed,
			NetworkScore: s.NetworkScore,
			Sector:       s.Sector,
			Return1Y:     math.Round(return1y*100) / 100,
			Return5Y:     math.Round(return5y*100) / 100,
		})
	}

	// Sort by network score desc, then return desc
	sort.Slice(results, func(i, j int) bool {
		if results[i].NetworkScore != results[j].NetworkScore {
			return results[i].NetworkScore > results[j].NetworkScore
		}
		return results[i].Return1Y > results[j].Return1Y
	})

	json.NewEncoder(w).Encode(results)
}

func handleBacktest(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	minNetwork, _ := strconv.Atoi(r.URL.Query().Get("min_network"))
	founderOnly := r.URL.Query().Get("founder_only") == "true"
	years, _ := strconv.Atoi(r.URL.Query().Get("years"))
	if years <= 0 {
		years = 10
	}

	months := years * 12

	cacheMu.RLock()
	defer cacheMu.RUnlock()

	// Get SPY data for benchmark
	spyPrices := priceCache["SPY"]
	if len(spyPrices) == 0 {
		http.Error(w, "SPY data not loaded yet", http.StatusServiceUnavailable)
		return
	}

	// Filter qualifying stocks
	var qualifying []string
	for _, s := range scores {
		if s.Symbol == "SPY" {
			continue
		}
		if s.NetworkScore < minNetwork {
			continue
		}
		if founderOnly && !s.FounderLed {
			continue
		}
		if len(priceCache[s.Symbol]) > 0 {
			qualifying = append(qualifying, s.Symbol)
		}
	}

	if len(qualifying) == 0 {
		json.NewEncoder(w).Encode(BacktestResponse{
			Points:     []BacktestPoint{},
			StockCount: 0,
		})
		return
	}

	// Build a date index from SPY
	startIdx := len(spyPrices) - months
	if startIdx < 0 {
		startIdx = 0
	}
	spySlice := spyPrices[startIdx:]

	// For each date in SPY, calculate equal-weight portfolio return
	// We need to align dates across all stocks
	type datePrice struct {
		date  string
		close float64
	}

	// Build date→price maps for each qualifying stock
	stockDateMap := make(map[string]map[string]float64)
	for _, sym := range qualifying {
		m := make(map[string]float64)
		for _, p := range priceCache[sym] {
			m[p.Date] = p.Close
		}
		stockDateMap[sym] = m
	}

	spyDateMap := make(map[string]float64)
	for _, p := range spyPrices {
		spyDateMap[p.Date] = p.Close
	}

	// Calculate portfolio: equal-weight, monthly rebalanced
	var points []BacktestPoint
	firstSPY := spySlice[0].Close

	for _, sp := range spySlice {
		date := sp.Date

		// For portfolio: average return from start for each stock that has data at this date AND at start
		var totalReturn float64
		var count int

		for _, sym := range qualifying {
			dm := stockDateMap[sym]
			currentPrice, hasNow := dm[date]
			startPrice, hasStart := dm[spySlice[0].Date]
			if hasNow && hasStart && startPrice > 0 {
				totalReturn += currentPrice / startPrice
				count++
			}
		}

		portfolioVal := 100.0
		if count > 0 {
			portfolioVal = 100.0 * totalReturn / float64(count)
		}
		benchmarkVal := 100.0 * sp.Close / firstSPY

		points = append(points, BacktestPoint{
			Date:          date,
			PortfolioValue: math.Round(portfolioVal*100) / 100,
			BenchmarkValue: math.Round(benchmarkVal*100) / 100,
		})
	}

	var portReturn, benchReturn, portCAGR, benchCAGR float64
	if len(points) > 1 {
		last := points[len(points)-1]
		portReturn = last.PortfolioValue - 100
		benchReturn = last.BenchmarkValue - 100
		yearsActual := float64(len(points)-1) / 12.0
		if yearsActual > 0 {
			portCAGR = (math.Pow(last.PortfolioValue/100, 1.0/yearsActual) - 1) * 100
			benchCAGR = (math.Pow(last.BenchmarkValue/100, 1.0/yearsActual) - 1) * 100
		}
	}

	json.NewEncoder(w).Encode(BacktestResponse{
		Points:          points,
		PortfolioReturn: math.Round(portReturn*100) / 100,
		BenchmarkReturn: math.Round(benchReturn*100) / 100,
		PortfolioCAGR:   math.Round(portCAGR*100) / 100,
		BenchmarkCAGR:   math.Round(benchCAGR*100) / 100,
		StockCount:      len(qualifying),
		Symbols:         qualifying,
	})
}

// --- Yahoo Finance Data Fetching ---

func fetchAllPrices() {
	symbols := make([]string, len(scores))
	for i, s := range scores {
		symbols[i] = s.Symbol
	}

	// Fetch in batches of 5
	sem := make(chan struct{}, 5)
	var wg sync.WaitGroup

	for _, sym := range symbols {
		cacheMu.RLock()
		_, exists := priceCache[sym]
		cacheMu.RUnlock()
		if exists {
			continue
		}

		wg.Add(1)
		sem <- struct{}{}
		go func(s string) {
			defer wg.Done()
			defer func() { <-sem }()
			fetchPricesForSymbol(s)
			time.Sleep(200 * time.Millisecond) // Rate limit
		}(sym)
	}

	wg.Wait()
	log.Println("All prices fetched!")
	savePriceCacheToDisk()
}

func fetchPricesForSymbol(symbol string) {
	// Yahoo Finance v8 API
	yahooSymbol := strings.ReplaceAll(symbol, ".", "-") // BRK.B becomes BRK-B for Yahoo
	url := fmt.Sprintf("https://query1.finance.yahoo.com/v8/finance/chart/%s?range=10y&interval=1mo", yahooSymbol)

	client := &http.Client{Timeout: 15 * time.Second}
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Printf("Failed to create request for %s: %v", symbol, err)
		return
	}
	req.Header.Set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)")

	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Failed to fetch %s: %v", symbol, err)
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	if resp.StatusCode != 200 {
		log.Printf("Yahoo returned %d for %s", resp.StatusCode, symbol)
		return
	}

	var result struct {
		Chart struct {
			Result []struct {
				Timestamp  []int64 `json:"timestamp"`
				Indicators struct {
					AdjClose []struct {
						AdjClose []interface{} `json:"adjclose"`
					} `json:"adjclose"`
				} `json:"indicators"`
			} `json:"result"`
		} `json:"chart"`
	}

	if err := json.Unmarshal(body, &result); err != nil {
		log.Printf("Failed to parse %s: %v", symbol, err)
		return
	}

	if len(result.Chart.Result) == 0 {
		log.Printf("No data for %s", symbol)
		return
	}

	r := result.Chart.Result[0]
	if len(r.Indicators.AdjClose) == 0 {
		log.Printf("No adjclose for %s", symbol)
		return
	}

	timestamps := r.Timestamp
	closes := r.Indicators.AdjClose[0].AdjClose

	var prices []MonthlyPrice
	for i := 0; i < len(timestamps) && i < len(closes); i++ {
		if closes[i] == nil {
			continue
		}
		var closeVal float64
		switch v := closes[i].(type) {
		case float64:
			closeVal = v
		case json.Number:
			closeVal, _ = v.Float64()
		default:
			continue
		}
		if closeVal <= 0 {
			continue
		}
		t := time.Unix(timestamps[i], 0)
		prices = append(prices, MonthlyPrice{
			Date:  t.Format("2006-01"),
			Close: math.Round(closeVal*100) / 100,
		})
	}

	if len(prices) > 0 {
		cacheMu.Lock()
		priceCache[symbol] = prices
		cacheMu.Unlock()
		log.Printf("Cached %d months for %s (%.2f → %.2f)", len(prices), symbol, prices[0].Close, prices[len(prices)-1].Close)
	}
}

// --- Disk Cache ---

type diskCache struct {
	Prices map[string][]MonthlyPrice `json:"prices"`
	Time   string                    `json:"cached_at"`
}

func savePriceCacheToDisk() {
	cacheMu.RLock()
	dc := diskCache{
		Prices: priceCache,
		Time:   time.Now().Format(time.RFC3339),
	}
	cacheMu.RUnlock()

	data, _ := json.Marshal(dc)
	os.WriteFile("../data/price_cache.json", data, 0644)
	log.Printf("Saved price cache to disk (%d stocks)", len(dc.Prices))
}

func loadPriceCacheFromDisk() {
	data, err := os.ReadFile("../data/price_cache.json")
	if err != nil {
		return
	}
	var dc diskCache
	if err := json.Unmarshal(data, &dc); err != nil {
		return
	}

	// Only use cache if less than 24h old
	cachedAt, err := time.Parse(time.RFC3339, dc.Time)
	if err == nil && time.Since(cachedAt) < 24*time.Hour {
		cacheMu.Lock()
		priceCache = dc.Prices
		cacheMu.Unlock()
		log.Printf("Loaded price cache from disk (%d stocks, cached at %s)", len(dc.Prices), dc.Time)
	} else {
		log.Println("Disk cache expired, will re-fetch")
	}
}
