"use client"

import { Slider } from "@/components/ui/slider"

interface ScoreSliderProps {
  label: string
  icon: React.ReactNode
  value: number
  onChange: (value: number) => void
  color: string
}

export function ScoreSlider({ label, icon, value, onChange, color }: ScoreSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm text-stone-300">{label}</span>
        </div>
        <span className={`text-sm font-mono font-bold ${color}`}>≥ {value}</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={1}
        max={10}
        step={1}
        className="w-full"
      />
    </div>
  )
}
