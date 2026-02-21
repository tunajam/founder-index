import { NextResponse } from "next/server";
import { scores } from "@/lib/scores";
import { fetchAllPrices } from "@/lib/yahoo";

export const maxDuration = 60;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const minNetwork = parseInt(searchParams.get("min_network") ?? "0", 10);
  const founderOnly = searchParams.get("founder_only") === "true";

  // Filter qualifying stocks
  const qualifying = scores.filter((s) => {
    if (s.symbol === "SPY") return false;
    if (s.network_score < minNetwork) return false;
    if (founderOnly && !s.founder_led) return false;
    return true;
  });

  // Fetch prices for qualifying stocks
  const symbols = qualifying.map((s) => s.symbol);
  const priceMap = await fetchAllPrices(symbols);

  const results = qualifying
    .filter((s) => priceMap.has(s.symbol))
    .map((s) => {
      const prices = priceMap.get(s.symbol)!;
      const current = prices[prices.length - 1].close;
      let return1y = 0;
      let return5y = 0;

      const idx1y = prices.length - 13;
      if (idx1y >= 0) {
        return1y = Math.round((current / prices[idx1y].close - 1) * 10000) / 100;
      }
      const idx5y = prices.length - 61;
      if (idx5y >= 0) {
        return5y = Math.round((current / prices[idx5y].close - 1) * 10000) / 100;
      }

      return {
        symbol: s.symbol,
        name: s.name,
        price: Math.round(current * 100) / 100,
        founder_led: s.founder_led,
        network_score: s.network_score,
        sector: s.sector,
        return_1y: return1y,
        return_5y: return5y,
      };
    })
    .sort((a, b) => {
      if (a.network_score !== b.network_score)
        return b.network_score - a.network_score;
      return b.return_1y - a.return_1y;
    });

  return NextResponse.json(results);
}
