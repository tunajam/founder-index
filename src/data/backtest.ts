// Simulated backtest data based on research showing high network effects + founder-led
// stocks outperform. Real implementation would use Yahoo Finance API.

export interface BacktestPoint {
  date: string
  portfolio: number // cumulative return %
  sp500: number // cumulative return %
}

// Generate realistic backtest data
function generateBacktest(years: number, portfolioCAGR: number, sp500CAGR: number): BacktestPoint[] {
  const points: BacktestPoint[] = []
  const totalMonths = years * 12
  const monthlyPortfolio = Math.pow(1 + portfolioCAGR, 1 / 12) - 1
  const monthlySP500 = Math.pow(1 + sp500CAGR, 1 / 12) - 1
  
  const now = new Date()
  
  for (let i = 0; i <= totalMonths; i++) {
    const date = new Date(now)
    date.setMonth(date.getMonth() - (totalMonths - i))
    
    // Add some noise for realism
    const noise1 = 1 + (Math.sin(i * 0.7) * 0.02 + Math.sin(i * 1.3) * 0.015 + Math.cos(i * 0.3) * 0.01)
    const noise2 = 1 + (Math.sin(i * 0.5) * 0.015 + Math.cos(i * 0.9) * 0.01)
    
    // Add drawdown events
    let drawdown1 = 1
    let drawdown2 = 1
    
    // COVID crash (if within range)
    const monthsFromCovid = totalMonths - i - 48 // ~4 years ago
    if (Math.abs(monthsFromCovid) < 3) {
      drawdown1 = 0.75 + (3 - Math.abs(monthsFromCovid)) * 0.05
      drawdown2 = 0.70 + (3 - Math.abs(monthsFromCovid)) * 0.05
    }
    
    // 2022 rate hike correction
    const monthsFrom2022 = totalMonths - i - 30
    if (Math.abs(monthsFrom2022) < 6) {
      drawdown1 = 0.90
      drawdown2 = 0.85
    }
    
    const portfolioReturn = ((Math.pow(1 + monthlyPortfolio, i) * noise1 * drawdown1) - 1) * 100
    const sp500Return = ((Math.pow(1 + monthlySP500, i) * noise2 * drawdown2) - 1) * 100
    
    points.push({
      date: date.toISOString().slice(0, 7), // YYYY-MM
      portfolio: Math.round(portfolioReturn * 10) / 10,
      sp500: Math.round(sp500Return * 10) / 10,
    })
  }
  
  return points
}

// Seeded random for consistency
export const backtest1Y = generateBacktest(1, 0.29, 0.084)
export const backtest5Y = generateBacktest(5, 0.25, 0.10)
export const backtest10Y = generateBacktest(10, 0.22, 0.095)

export function getBacktestData(period: "1Y" | "5Y" | "10Y") {
  switch (period) {
    case "1Y": return backtest1Y
    case "5Y": return backtest5Y
    case "10Y": return backtest10Y
  }
}

export function getBacktestSummary(period: "1Y" | "5Y" | "10Y") {
  const data = getBacktestData(period)
  const last = data[data.length - 1]
  return {
    portfolioReturn: last.portfolio,
    sp500Return: last.sp500,
    outperformance: Math.round((last.portfolio - last.sp500) * 10) / 10,
    period,
  }
}
