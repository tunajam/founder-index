import scoresData from "./scores.json";

export interface StockScore {
  symbol: string;
  name: string;
  founder_led: boolean;
  network_score: number;
  sector: string;
}

// Deduplicate by symbol
const seen = new Set<string>();
export const scores: StockScore[] = (scoresData as StockScore[]).filter((s) => {
  if (seen.has(s.symbol)) return false;
  seen.add(s.symbol);
  return true;
});
