"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { BacktestChart } from "@/components/backtest-chart"
import { StockCard } from "@/components/stock-card"
import { ScoreSlider } from "@/components/score-slider"
import { uniqueStocks, type Stock } from "@/data/stocks"
import { getBacktestData, getBacktestSummary, type BacktestPoint } from "@/data/backtest"
import { api } from "@/lib/api"
import { Lightning, Crown, ChartLineUp, Funnel, Lock, ArrowRight, TrendUp, Sparkle } from "@phosphor-icons/react"

const FREE_LIMIT = 10

export default function Home() {
  const [networkMin, setNetworkMin] = useState(7)
  const [founderMin, setFounderMin] = useState(7)
  const [period, setPeriod] = useState<"1Y" | "5Y" | "10Y">("5Y")
  const [isPaid] = useState(false)
  
  // API state — falls back to local data
  const [apiStocks, setApiStocks] = useState<Stock[] | null>(null)
  const [apiBacktest, setApiBacktest] = useState<{ points: BacktestPoint[]; portfolioReturn: number; sp500Return: number; alpha: number } | null>(null)
  const [useApi, setUseApi] = useState(true)

  // Fetch stocks from API
  const fetchStocks = useCallback(async () => {
    if (!useApi) return
    try {
      const res = await api.listStocks({
        minNetworkEffects: networkMin,
        minFounderLed: founderMin,
        limit: isPaid ? 500 : FREE_LIMIT + 10,
        sortBy: "combined",
      })
      const stocks: Stock[] = res.stocks.map(s => ({
        ticker: s.ticker,
        name: s.name,
        sector: s.sector,
        networkEffects: s.networkEffectsScore,
        founderLed: s.founderLedScore,
      }))
      setApiStocks(stocks)
    } catch {
      setUseApi(false) // fall back to local
    }
  }, [networkMin, founderMin, isPaid, useApi])

  // Fetch backtest from API
  const fetchBacktest = useCallback(async () => {
    if (!useApi) return
    try {
      const res = await api.getBacktest({
        period,
        minNetworkEffects: networkMin,
        minFounderLed: founderMin,
      })
      setApiBacktest({
        points: res.points.map(p => ({ date: p.date, portfolio: p.portfolio, sp500: p.sp500 })),
        portfolioReturn: res.portfolioReturn,
        sp500Return: res.sp500Return,
        alpha: res.alpha,
      })
    } catch {
      setUseApi(false)
    }
  }, [period, networkMin, founderMin, useApi])

  useEffect(() => { fetchStocks() }, [fetchStocks])
  useEffect(() => { fetchBacktest() }, [fetchBacktest])

  // Use API data if available, otherwise local
  const filteredStocks = useMemo(() => {
    if (apiStocks) return apiStocks
    return uniqueStocks
      .filter(s => s.networkEffects >= networkMin && s.founderLed >= founderMin)
      .sort((a, b) => (b.networkEffects + b.founderLed) - (a.networkEffects + a.founderLed))
  }, [apiStocks, networkMin, founderMin])

  const backtestData = apiBacktest?.points ?? getBacktestData(period)
  const summary = apiBacktest
    ? { portfolioReturn: apiBacktest.portfolioReturn, sp500Return: apiBacktest.sp500Return, outperformance: apiBacktest.alpha, period }
    : getBacktestSummary(period)

  const visibleStocks = isPaid ? filteredStocks : filteredStocks.slice(0, FREE_LIMIT)
  const lockedCount = isPaid ? 0 : Math.max(0, filteredStocks.length - FREE_LIMIT)

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      {/* Header */}
      <header className="border-b border-stone-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Sparkle size={18} weight="fill" className="text-amber-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Founder Index</h1>
              <p className="text-[11px] text-stone-500 -mt-0.5">Network Effects × Founder-Led</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-stone-700 text-stone-400 text-[10px]">
              {useApi ? "🟢 Live" : "📦 Local"}
            </Badge>
            <Badge variant="outline" className="border-amber-500/30 text-amber-400 text-[10px]">
              {filteredStocks.length} stocks
            </Badge>
            {!isPaid && (
              <Button size="sm" className="bg-amber-500 hover:bg-amber-400 text-stone-900 font-semibold text-xs">
                <Lock size={14} className="mr-1" /> Upgrade
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Hero Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-stone-900/50 border-stone-800 backdrop-blur">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <TrendUp size={16} weight="bold" className="text-amber-400" />
                <span className="text-xs text-stone-500 uppercase tracking-wider">Portfolio Return</span>
              </div>
              <p className="text-3xl font-mono font-bold text-amber-400">
                +{summary.portfolioReturn.toFixed(1)}%
              </p>
              <p className="text-xs text-stone-500 mt-1">{period} backtest</p>
            </CardContent>
          </Card>
          <Card className="bg-stone-900/50 border-stone-800 backdrop-blur">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <ChartLineUp size={16} weight="bold" className="text-stone-500" />
                <span className="text-xs text-stone-500 uppercase tracking-wider">S&P 500</span>
              </div>
              <p className="text-3xl font-mono font-bold text-stone-400">
                +{summary.sp500Return.toFixed(1)}%
              </p>
              <p className="text-xs text-stone-500 mt-1">{period} benchmark</p>
            </CardContent>
          </Card>
          <Card className="bg-amber-500/5 border-amber-500/20 backdrop-blur">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkle size={16} weight="fill" className="text-amber-400" />
                <span className="text-xs text-amber-500/80 uppercase tracking-wider">Alpha</span>
              </div>
              <p className="text-3xl font-mono font-bold text-amber-400">
                +{summary.outperformance.toFixed(1)}%
              </p>
              <p className="text-xs text-amber-500/60 mt-1">Outperformance</p>
            </CardContent>
          </Card>
        </div>

        {/* Backtest Chart — THE HERO */}
        <Card className="bg-stone-900/50 border-stone-800 backdrop-blur overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <CardTitle className="text-base font-semibold">Backtest Performance</CardTitle>
                <p className="text-xs text-stone-500 mt-0.5">
                  Equal-weight portfolio of stocks scoring ≥{networkMin} network effects & ≥{founderMin} founder-led
                </p>
              </div>
              <div className="flex gap-1">
                {(["1Y", "5Y", "10Y"] as const).map((p) => (
                  <Button
                    key={p}
                    variant={period === p ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setPeriod(p)}
                    className={`text-xs px-3 ${period === p ? "bg-amber-500 text-stone-900 hover:bg-amber-400" : "text-stone-400 hover:text-stone-200"}`}
                  >
                    {p}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2 pb-4">
            <div className="flex items-center gap-6 mb-4 px-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-amber-400 rounded" />
                <span className="text-[11px] text-stone-400">Founder Index</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-stone-500 rounded" />
                <span className="text-[11px] text-stone-500">S&P 500</span>
              </div>
            </div>
            <BacktestChart data={backtestData} />
          </CardContent>
        </Card>

        {/* Filters + Stock Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <Card className="bg-stone-900/50 border-stone-800 backdrop-blur sticky top-8">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Funnel size={16} weight="bold" className="text-amber-400" />
                  <CardTitle className="text-sm font-semibold">Filter Stocks</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <ScoreSlider
                  label="Network Effects"
                  icon={<Lightning size={14} weight="fill" className="text-amber-400" />}
                  value={networkMin}
                  onChange={setNetworkMin}
                  color="text-amber-400"
                />
                <ScoreSlider
                  label="Founder-Led"
                  icon={<Crown size={14} weight="fill" className="text-amber-600" />}
                  value={founderMin}
                  onChange={setFounderMin}
                  color="text-amber-600"
                />
                
                <Separator className="bg-stone-800" />
                
                <div className="text-center">
                  <p className="text-2xl font-mono font-bold text-stone-100">{filteredStocks.length}</p>
                  <p className="text-xs text-stone-500">stocks match</p>
                </div>

                {!isPaid && lockedCount > 0 && (
                  <>
                    <Separator className="bg-stone-800" />
                    <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3">
                      <p className="text-xs text-amber-400 font-medium mb-1">
                        🔒 {lockedCount} more stocks hidden
                      </p>
                      <p className="text-[10px] text-stone-500 mb-2">
                        Upgrade to see the full list, detailed backtests, and IPO alerts.
                      </p>
                      <Button size="sm" className="w-full bg-amber-500 hover:bg-amber-400 text-stone-900 font-semibold text-xs">
                        Unlock for $10/mo <ArrowRight size={12} className="ml-1" />
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Stock Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {visibleStocks.map((stock) => (
                <StockCard key={stock.ticker} stock={stock} />
              ))}
              {!isPaid && Array.from({ length: Math.min(lockedCount, 3) }).map((_, i) => (
                <StockCard key={`locked-${i}`} stock={uniqueStocks[0]} locked />
              ))}
            </div>
            {filteredStocks.length === 0 && (
              <div className="text-center py-16">
                <p className="text-stone-500 text-sm">No stocks match your filters.</p>
                <p className="text-stone-600 text-xs mt-1">Try lowering your minimum scores.</p>
              </div>
            )}
          </div>
        </div>

        {/* Methodology */}
        <Card className="bg-stone-900/50 border-stone-800 backdrop-blur">
          <CardContent className="p-6">
            <h3 className="font-semibold text-sm mb-3">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-stone-400 leading-relaxed">
              <div>
                <p className="text-stone-300 font-medium mb-1 flex items-center gap-1">
                  <Lightning size={14} weight="fill" className="text-amber-400" /> Network Effects Score
                </p>
                <p>
                  Measures platform dynamics, marketplace liquidity, switching costs, data moats, and ecosystem lock-in. 
                  Companies like Visa (10) and Meta (10) have massive two-sided networks. Higher scores indicate stronger 
                  competitive moats driven by user participation.
                </p>
              </div>
              <div>
                <p className="text-stone-300 font-medium mb-1 flex items-center gap-1">
                  <Crown size={14} weight="fill" className="text-amber-600" /> Founder-Led Score
                </p>
                <p>
                  Measures founder involvement as CEO/Chair, equity ownership, long-term vision, and skin in the game. 
                  Companies like NVIDIA (Jensen Huang, 10) and Meta (Zuckerberg, 10) have active founders steering 
                  the ship. Research shows founder-led companies outperform over the long term.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="text-center py-8 text-xs text-stone-600">
          <p>Founder Index is for informational purposes only. Not financial advice.</p>
          <p className="mt-1">Built with the Fred Stack — Go + connectRPC + Next.js</p>
          <p className="mt-1">by <a href="https://tunajam.com" className="text-amber-600 hover:text-amber-500">Tunajam</a></p>
        </footer>
      </main>
    </div>
  )
}
