import { useMemo, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { AnimatePresence, motion } from 'motion/react'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useDashboard } from '@/store/dashboard-store'
import { computeInsights } from '@/features/dashboard/utils/compute-insights'
import { INSIGHT_TYPE_CONFIG } from '@/features/dashboard/constants'

export default function InsightsSection() {
  const transactions = useDashboard(s => s.transactions)
  const insights = useMemo(() => computeInsights(transactions), [transactions])
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="relative rounded-3xl border border-border bg-card p-6 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-sm font-bold">
          Smart Insights
        </span>
      </div>

      <div className="flex flex-col flex-1 justify-center">
        {insights.map((insight, idx) => {
          const config = INSIGHT_TYPE_CONFIG[insight.type]
          return (
            <div key={idx}>
              <div
                className="relative"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <AnimatePresence>
                  {hoveredIndex === idx && (
                    <motion.span
                      className="absolute inset-0 rounded-2xl bg-muted/50 dark:bg-muted/30 block"
                      layoutId="insight-hover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { duration: 0.15 } }}
                      exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.1 } }}
                    />
                  )}
                </AnimatePresence>
                <div className={cn(
                  'relative z-10 flex items-start gap-4 cursor-default py-4 px-3 border-l-2 transition-all duration-300',
                  config.accent
                )}>
                  <div className={cn(
                    'w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300',
                    hoveredIndex === idx && 'scale-110',
                    config.bg
                  )}>
                    <HugeiconsIcon icon={config.icon} size={18} className={config.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] uppercase tracking-widest text-muted-foreground/50 font-semibold">{insight.label}</p>
                    <p className="text-foreground font-semibold text-[15px] mt-1 leading-snug">{insight.value}</p>
                    <p className="text-xs text-muted-foreground/60 mt-1.5">{insight.detail}</p>
                  </div>
                </div>
              </div>
              {idx < insights.length - 1 && <Separator className="opacity-30 ml-3" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
