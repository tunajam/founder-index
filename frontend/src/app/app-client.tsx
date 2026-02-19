"use client";

import { useState, useEffect, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const API = process.env.NEXT_PUBLIC_API_URL || "";

interface BacktestPoint {
  date: string;
  portfolio_value: number;
  benchmark_value: number;
}

interface BacktestData {
  points: BacktestPoint[];
  portfolio_return: number;
  benchmark_return: number;
  portfolio_cagr: number;
  benchmark_cagr: number;
  stock_count: number;
  symbols: string[];
}

interface Quote {
  symbol: string;
  name: string;
  price: number;
  founder_led: boolean;
  network_score: number;
  sector: string;
  return_1y: number;
  return_5y: number;
}

export default function AppClient() {
  const [minNetwork, setMinNetwork] = useState(5);
  const [founderOnly, setFounderOnly] = useState(true);
  const [years, setYears] = useState(10);
  const [backtest, setBacktest] = useState<BacktestData | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [btRes, qRes] = await Promise.all([
        fetch(`${API}/api/backtest?min_network=${minNetwork}&founder_only=${founderOnly}&years=${years}`),
        fetch(`${API}/api/quotes?min_network=${minNetwork}&founder_only=${founderOnly}`),
      ]);
      const btData = await btRes.json();
      const qData = await qRes.json();
      setBacktest(btData);
      setQuotes(qData || []);
    } catch (e) {
      console.error("Failed to fetch:", e);
    }
    setLoading(false);
  }, [minNetwork, founderOnly, years]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const outperformance = backtest ? backtest.portfolio_cagr - backtest.benchmark_cagr : 0;

  return (
    <main className="min-h-screen p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">The Founder Index</h1>
        <p className="text-neutral-400 text-lg">
          Founder-led companies with strong network effects crush the market.
          <span className="text-amber-500 font-semibold"> Real data. Real returns.</span>
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-5">
          <label className="block text-sm text-neutral-400 mb-2">Min Network Effects Score</label>
          <div className="flex items-center gap-4">
            <input type="range" min={1} max={10} value={minNetwork}
              onChange={(e) => setMinNetwork(Number(e.target.value))}
              className="flex-1 accent-amber-500" />
            <span className="text-2xl font-bold text-amber-500 w-8 text-right">{minNetwork}</span>
          </div>
        </div>
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-5">
          <label className="block text-sm text-neutral-400 mb-2">Leadership Filter</label>
          <button onClick={() => setFounderOnly(!founderOnly)}
            className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
              founderOnly ? "bg-amber-500 text-black" : "bg-neutral-800 text-neutral-300 border border-neutral-700"
            }`}>
            {founderOnly ? "👑 Founder-Led Only" : "All Companies"}
          </button>
        </div>
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-5">
          <label className="block text-sm text-neutral-400 mb-2">Backtest Period</label>
          <div className="flex gap-2">
            {[1, 5, 10].map((y) => (
              <button key={y} onClick={() => setYears(y)}
                className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${
                  years === y ? "bg-amber-500 text-black" : "bg-neutral-800 text-neutral-300 border border-neutral-700"
                }`}>
                {y}Y
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      {backtest && !loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Portfolio Return"
            value={`${backtest.portfolio_return > 0 ? "+" : ""}${backtest.portfolio_return.toFixed(0)}%`}
            color={backtest.portfolio_return > 0 ? "text-green-400" : "text-red-400"} />
          <StatCard label="S&P 500 Return"
            value={`${backtest.benchmark_return > 0 ? "+" : ""}${backtest.benchmark_return.toFixed(0)}%`}
            color="text-neutral-300" />
          <StatCard label="Portfolio CAGR" value={`${backtest.portfolio_cagr.toFixed(1)}%`} color="text-amber-400" />
          <StatCard label="Outperformance"
            value={`+${outperformance.toFixed(1)}% CAGR`}
            color={outperformance > 0 ? "text-green-400" : "text-red-400"}
            subtitle={`${backtest.stock_count} stocks`} />
        </div>
      )}

      {/* Chart */}
      <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-1">Backtest: $100 Invested</h2>
        <p className="text-sm text-neutral-500 mb-4">
          Equal-weight portfolio, monthly rebalanced • Real Yahoo Finance data
        </p>
        {loading ? (
          <div className="h-[400px] flex items-center justify-center text-neutral-500">Loading real market data...</div>
        ) : backtest && backtest.points.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={backtest.points}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis dataKey="date" stroke="#666" tick={{ fontSize: 12 }}
                tickFormatter={(v) => { const [y, m] = v.split("-"); return m === "01" ? y : ""; }}
                interval="preserveStartEnd" />
              <YAxis stroke="#666" tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
              <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: "8px" }}
                formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, name === "portfolio_value" ? "Founder Index" : "S&P 500"]}
                labelFormatter={(label) => label} />
              <Legend formatter={(value) => value === "portfolio_value" ? "Founder Index" : "S&P 500"} />
              <Line type="monotone" dataKey="portfolio_value" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="benchmark_value" stroke="#666" strokeWidth={1.5} dot={false} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[400px] flex items-center justify-center text-neutral-500">No stocks match these filters</div>
        )}
      </div>

      {/* Stock Cards */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Qualifying Stocks ({quotes.length})</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {quotes.map((q) => (
          <div key={q.symbol} className="bg-[#141414] border border-[#262626] rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">{q.symbol}</span>
                {q.founder_led && (
                  <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">👑 Founder</span>
                )}
                <span className="text-xs bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full">NE: {q.network_score}</span>
              </div>
              <p className="text-sm text-neutral-500 mt-0.5">{q.name}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">${q.price.toFixed(2)}</p>
              <p className={`text-sm font-medium ${q.return_1y > 0 ? "text-green-400" : "text-red-400"}`}>
                {q.return_1y > 0 ? "+" : ""}{q.return_1y.toFixed(1)}% 1Y
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 mb-6 text-center text-neutral-600 text-sm">
        <p>Data from Yahoo Finance • Adjusted close prices • Not financial advice</p>
        <p className="mt-1">Built by <a href="https://tunajam.com" className="text-amber-500 hover:underline">Tunajam</a></p>
      </div>
    </main>
  );
}

function StatCard({ label, value, color, subtitle }: { label: string; value: string; color: string; subtitle?: string }) {
  return (
    <div className="bg-[#141414] border border-[#262626] rounded-xl p-4">
      <p className="text-sm text-neutral-500">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      {subtitle && <p className="text-xs text-neutral-500 mt-0.5">{subtitle}</p>}
    </div>
  );
}
