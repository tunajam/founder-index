"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type Stock } from "@/data/stocks"
import { TrendUp, TrendDown, Lightning, Crown } from "@phosphor-icons/react"

interface StockCardProps {
  stock: Stock
  locked?: boolean
}

function ScoreBar({ value, max = 10, color }: { value: number; max?: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-stone-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
      <span className="text-xs font-mono text-stone-400 w-4 text-right">{value}</span>
    </div>
  )
}

export function StockCard({ stock, locked }: StockCardProps) {
  const combinedScore = stock.networkEffects + stock.founderLed
  
  if (locked) {
    return (
      <Card className="bg-stone-900/50 border-stone-800 backdrop-blur">
        <CardContent className="p-4 flex items-center justify-center min-h-[120px]">
          <div className="text-center">
            <div className="text-stone-600 text-2xl mb-1">🔒</div>
            <p className="text-stone-500 text-xs">Upgrade to unlock</p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card className="bg-stone-900/50 border-stone-800 hover:border-stone-700 transition-colors backdrop-blur group">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-stone-100 text-sm">{stock.ticker}</span>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-stone-700 text-stone-500">
                {stock.sector}
              </Badge>
            </div>
            <p className="text-stone-400 text-xs mt-0.5 truncate max-w-[180px]">{stock.name}</p>
          </div>
          <div className="text-right">
            <div className={`text-xs font-mono font-bold ${combinedScore >= 16 ? "text-amber-400" : combinedScore >= 12 ? "text-amber-600" : "text-stone-500"}`}>
              {combinedScore}/20
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div>
            <div className="flex items-center gap-1 mb-1">
              <Lightning size={12} weight="fill" className="text-amber-400" />
              <span className="text-[10px] text-stone-500 uppercase tracking-wider">Network Effects</span>
            </div>
            <ScoreBar value={stock.networkEffects} color="bg-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-1 mb-1">
              <Crown size={12} weight="fill" className="text-amber-600" />
              <span className="text-[10px] text-stone-500 uppercase tracking-wider">Founder-Led</span>
            </div>
            <ScoreBar value={stock.founderLed} color="bg-amber-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
