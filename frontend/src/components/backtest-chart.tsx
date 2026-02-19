"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { type BacktestPoint } from "@/data/backtest"

interface BacktestChartProps {
  data: BacktestPoint[]
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string }>; label?: string }) {
  if (!active || !payload) return null
  return (
    <div className="bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-stone-400 text-xs mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className={`text-sm font-mono font-semibold ${p.dataKey === "portfolio" ? "text-amber-400" : "text-stone-400"}`}>
          {p.dataKey === "portfolio" ? "Founder Index" : "S&P 500"}: {p.value > 0 ? "+" : ""}{p.value.toFixed(1)}%
        </p>
      ))}
    </div>
  )
}

export function BacktestChart({ data }: BacktestChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="sp500Gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#78716c" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#78716c" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#292524" />
        <XAxis 
          dataKey="date" 
          stroke="#78716c" 
          fontSize={11} 
          tickLine={false}
          tick={{ fill: "#78716c" }}
          interval="preserveStartEnd"
        />
        <YAxis 
          stroke="#78716c" 
          fontSize={11} 
          tickLine={false}
          tick={{ fill: "#78716c" }}
          tickFormatter={(v: number) => `${v > 0 ? "+" : ""}${v}%`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="sp500"
          stroke="#78716c"
          strokeWidth={2}
          fill="url(#sp500Gradient)"
          dot={false}
        />
        <Area
          type="monotone"
          dataKey="portfolio"
          stroke="#f59e0b"
          strokeWidth={2.5}
          fill="url(#portfolioGradient)"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
