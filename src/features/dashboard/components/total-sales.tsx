import { useState, useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import { pieColors, bentoCardStatic } from '@/utils/colors'
import { cn } from '@/lib/utils'
import { useDashboard } from '@/store/dashboard-store'
import { computePieData } from '@/features/dashboard/utils/compute-dashboard'

export default function TotalSales() {
  const { transactions } = useDashboard()
  const pieData = useMemo(() => computePieData(transactions), [transactions])
  const total = pieData.reduce((acc, d) => acc + d.value, 0)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <Card className={cn(bentoCardStatic, 'h-full flex flex-col')}>
      <CardContent className="p-0 flex flex-col flex-1">
        <h3 className="text-foreground font-light text-xl tracking-tight mb-4">Total <span className="font-bold">Sales</span></h3>

        <div className="relative flex-1 min-h-50">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
                style={{ outline: 'none' }}
                animationDuration={600}
                onMouseEnter={(_, i) => setActiveIndex(i)}
                onMouseLeave={() => setTimeout(() => setActiveIndex(null), 150)}
              >
                {pieData.map((_entry, i) => (
                  <Cell
                    key={i}
                    fill={pieColors[i % pieColors.length]}
                    style={{
                      outline: 'none',
                      opacity: activeIndex === null || activeIndex === i ? 1 : 0.4,
                      transform: activeIndex === i ? 'scale(1.04)' : 'scale(1)',
                      transition: 'opacity 0.35s ease, transform 0.35s ease',
                    }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs text-muted-foreground transition-all duration-300 ease-in-out">
              {activeIndex !== null ? pieData[activeIndex].name : 'Total'}
            </span>
            <span className="text-lg font-bold text-foreground tracking-tight transition-all duration-300 ease-in-out">
              ₹{(activeIndex !== null ? pieData[activeIndex].value : total).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5">
          {pieData.map((item, i) => (
            <div key={item.name} className="flex items-center gap-2.5">
              <span
                className="w-3 h-3 rounded-md shrink-0"
                style={{ backgroundColor: pieColors[i % pieColors.length] }}
              />
              <span className="text-[13px] text-muted-foreground truncate">{item.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
