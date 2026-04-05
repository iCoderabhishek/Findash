import { useState, useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import { bentoCardStatic } from '@/utils/colors'
import { cn } from '@/lib/utils'
import { PERIOD_LABELS, TREND_COLORS } from '@/features/dashboard/constants'
import { getTrend } from '@/features/dashboard/utils/compute-dashboard'
import type { Period } from '@/features/dashboard/types'
import data from '@/data/data.json'

export default function CashMonitoring() {
  const [period, setPeriod] = useState<Period>('monthly')
  const [animKey, setAnimKey] = useState(0)
  const [fading, setFading] = useState(false)
  const chartData = data.chartData[period]

  const trend = useMemo(() => getTrend(chartData), [chartData])
  const strokeColor = TREND_COLORS[trend]

  const handlePeriodChange = (key: Period) => {
    if (key === period) return
    setFading(true)
    setTimeout(() => {
      setPeriod(key)
      setAnimKey(prev => prev + 1)
      setFading(false)
    }, 250)
  }

  return (
    <Card className={cn(bentoCardStatic, 'h-full')}>
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-foreground font-light text-xl tracking-tight">Cash <span className="font-bold">Monitoring</span></h3>
          <div className="flex items-center gap-0.5 bg-muted/50 rounded-full p-1">
            {PERIOD_LABELS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handlePeriodChange(key)}
                className={cn(
                  'px-3.5 py-1 text-xs font-medium rounded-full transition-all duration-300',
                  period === key
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className={cn('h-72 transition-opacity duration-300 ease-in-out', fading ? 'opacity-0' : 'opacity-100')}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart key={animKey} data={chartData}>
              <defs>
                <linearGradient id="color-balance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={strokeColor} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} dx={-10} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{
                  borderRadius: '14px',
                  border: '1px solid var(--border)',
                  background: 'var(--card)',
                  color: 'var(--foreground)',
                  boxShadow: '0 8px 24px rgb(0 0 0 / 0.08)',
                }}
                formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Balance']}
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke={strokeColor}
                strokeWidth={2.5}
                fill="url(#color-balance)"
                dot={false}
                activeDot={{ r: 5, strokeWidth: 0, fill: strokeColor }}
                animationDuration={800}
                animationEasing="ease-in-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
