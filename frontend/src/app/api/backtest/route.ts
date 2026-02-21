import { NextResponse } from "next/server";
import { scores } from "@/lib/scores";
import { fetchAllPrices } from "@/lib/yahoo";

export const maxDuration = 60;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const minNetwork = parseInt(searchParams.get("min_network") ?? "0", 10);
  const founderOnly = searchParams.get("founder_only") === "true";
  let years = parseInt(searchParams.get("years") ?? "10", 10);
  if (years <= 0) years = 10;
  const months = years * 12;

  // Filter qualifying stocks + always include SPY
  const qualifying = scores.filter((s) => {
    if (s.symbol === "SPY") return false;
    if (s.network_score < minNetwork) return false;
    if (founderOnly && !s.founder_led) return false;
    return true;
  });

  const allSymbols = ["SPY", ...qualifying.map((s) => s.symbol)];
  const priceMap = await fetchAllPrices(allSymbols);

  const spyPrices = priceMap.get("SPY");
  if (!spyPrices || spyPrices.length === 0) {
    return NextResponse.json(
      { error: "SPY data not loaded yet" },
      { status: 503 }
    );
  }

  const qualifyingSymbols = qualifying
    .map((s) => s.symbol)
    .filter((sym) => priceMap.has(sym));

  if (qualifyingSymbols.length === 0) {
    return NextResponse.json({
      points: [],
      portfolio_return: 0,
      benchmark_return: 0,
      portfolio_cagr: 0,
      benchmark_cagr: 0,
      stock_count: 0,
      symbols: [],
    });
  }

  // Build date→price maps
  const stockDateMaps = new Map<string, Map<string, number>>();
  for (const sym of qualifyingSymbols) {
    const m = new Map<string, number>();
    for (const p of priceMap.get(sym)!) {
      m.set(p.date, p.close);
    }
    stockDateMaps.set(sym, m);
  }

  // SPY slice
  let startIdx = spyPrices.length - months;
  if (startIdx < 0) startIdx = 0;
  const spySlice = spyPrices.slice(startIdx);
  const firstSPY = spySlice[0].close;
  const startDate = spySlice[0].date;

  const points = spySlice.map((sp) => {
    let totalReturn = 0;
    let count = 0;

    for (const sym of qualifyingSymbols) {
      const dm = stockDateMaps.get(sym)!;
      const currentPrice = dm.get(sp.date);
      const startPrice = dm.get(startDate);
      if (currentPrice != null && startPrice != null && startPrice > 0) {
        totalReturn += currentPrice / startPrice;
        count++;
      }
    }

    const portfolioVal = count > 0 ? (100 * totalReturn) / count : 100;
    const benchmarkVal = (100 * sp.close) / firstSPY;

    return {
      date: sp.date,
      portfolio_value: Math.round(portfolioVal * 100) / 100,
      benchmark_value: Math.round(benchmarkVal * 100) / 100,
    };
  });

  let portfolioReturn = 0;
  let benchmarkReturn = 0;
  let portfolioCAGR = 0;
  let benchmarkCAGR = 0;

  if (points.length > 1) {
    const last = points[points.length - 1];
    portfolioReturn = last.portfolio_value - 100;
    benchmarkReturn = last.benchmark_value - 100;
    const yearsActual = (points.length - 1) / 12;
    if (yearsActual > 0) {
      portfolioCAGR =
        (Math.pow(last.portfolio_value / 100, 1 / yearsActual) - 1) * 100;
      benchmarkCAGR =
        (Math.pow(last.benchmark_value / 100, 1 / yearsActual) - 1) * 100;
    }
  }

  return NextResponse.json({
    points,
    portfolio_return: Math.round(portfolioReturn * 100) / 100,
    benchmark_return: Math.round(benchmarkReturn * 100) / 100,
    portfolio_cagr: Math.round(portfolioCAGR * 100) / 100,
    benchmark_cagr: Math.round(benchmarkCAGR * 100) / 100,
    stock_count: qualifyingSymbols.length,
    symbols: qualifyingSymbols,
  });
}
