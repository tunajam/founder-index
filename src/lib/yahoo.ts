export interface MonthlyPrice {
  date: string; // YYYY-MM
  close: number;
}

// In-memory cache with TTL
const priceCache = new Map<string, { prices: MonthlyPrice[]; fetchedAt: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function fetchPrices(symbol: string): Promise<MonthlyPrice[]> {
  const cached = priceCache.get(symbol);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
    return cached.prices;
  }

  const yahooSymbol = symbol.replace(/\./g, "-");
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?range=10y&interval=1mo`;

  try {
    const resp = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
      next: { revalidate: 3600 },
    });

    if (!resp.ok) {
      console.error(`Yahoo returned ${resp.status} for ${symbol}`);
      return cached?.prices ?? [];
    }

    const data = await resp.json();
    const result = data?.chart?.result?.[0];
    if (!result) return cached?.prices ?? [];

    const timestamps: number[] = result.timestamp ?? [];
    const closes: (number | null)[] =
      result.indicators?.adjclose?.[0]?.adjclose ?? [];

    const prices: MonthlyPrice[] = [];
    for (let i = 0; i < timestamps.length && i < closes.length; i++) {
      const c = closes[i];
      if (c == null || c <= 0) continue;
      const d = new Date(timestamps[i] * 1000);
      prices.push({
        date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
        close: Math.round(c * 100) / 100,
      });
    }

    if (prices.length > 0) {
      priceCache.set(symbol, { prices, fetchedAt: Date.now() });
    }
    return prices;
  } catch (e) {
    console.error(`Failed to fetch ${symbol}:`, e);
    return cached?.prices ?? [];
  }
}

export async function fetchAllPrices(
  symbols: string[]
): Promise<Map<string, MonthlyPrice[]>> {
  // Fetch in parallel batches of 5
  const result = new Map<string, MonthlyPrice[]>();
  const batchSize = 5;

  for (let i = 0; i < symbols.length; i += batchSize) {
    const batch = symbols.slice(i, i + batchSize);
    const results = await Promise.all(batch.map((s) => fetchPrices(s)));
    batch.forEach((s, idx) => {
      if (results[idx].length > 0) result.set(s, results[idx]);
    });
  }

  return result;
}
