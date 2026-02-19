"use client";

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

interface BacktestPoint {
  date: string;
  portfolio_value: number;
  benchmark_value: number;
}

export default function BacktestChart({ points }: { points: BacktestPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={points}>
        <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
        <XAxis
          dataKey="date"
          stroke="#666"
          tick={{ fontSize: 12 }}
          tickFormatter={(v) => {
            const [y, m] = v.split("-");
            return m === "01" ? y : "";
          }}
          interval="preserveStartEnd"
        />
        <YAxis
          stroke="#666"
          tick={{ fontSize: 12 }}
          tickFormatter={(v) => `$${v}`}
        />
        <Tooltip
          contentStyle={{
            background: "#1a1a1a",
            border: "1px solid #333",
            borderRadius: "8px",
          }}
          formatter={(value: number, name: string) => [
            `$${value.toFixed(2)}`,
            name === "portfolio_value" ? "Founder Index" : "S&P 500",
          ]}
          labelFormatter={(label) => label}
        />
        <Legend
          formatter={(value) =>
            value === "portfolio_value" ? "Founder Index" : "S&P 500"
          }
        />
        <Line
          type="monotone"
          dataKey="portfolio_value"
          stroke="#f59e0b"
          strokeWidth={2.5}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="benchmark_value"
          stroke="#666"
          strokeWidth={1.5}
          dot={false}
          strokeDasharray="5 5"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
