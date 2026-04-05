import { useMemo } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowUpRightIcon, ArrowDownRightIcon } from '@hugeicons/core-free-icons'
import { GlowingEffect } from '@/components/ui/glowing-effect'
import { cardStyles } from '@/utils/colors'
import { cn } from '@/lib/utils'
import { useDashboard } from '@/store/dashboard-store'
import { computeSummaryCards } from '@/features/dashboard/utils/compute-dashboard'
import { SUMMARY_ICON_MAP, SUMMARY_CARD_BG } from '@/features/dashboard/constants'

export default function SummaryCards() {
  const transactions = useDashboard(s => s.transactions)
  const cards = useMemo(() => computeSummaryCards(transactions), [transactions])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => {
        const Icon = SUMMARY_ICON_MAP[card.iconName]
        const style = cardStyles[card.key as keyof typeof cardStyles]
        const bg = SUMMARY_CARD_BG[card.key]
        return (
          <div key={card.key} className="relative rounded-3xl border border-border/60 p-1">
            <GlowingEffect spread={40} glow disabled={false} proximity={64} inactiveZone={0.01} />
            <div className={cn('relative rounded-[calc(1.5rem-4px)] p-6 py-8', bg)}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-extrabold text-foreground tracking-tight">{card.amount}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <p className="text-sm text-muted-foreground font-medium">{card.title}</p>
                    {card.change && (
                      <span className={cn(
                        'inline-flex items-center gap-0.5 text-xs font-semibold',
                        card.isPositive ? 'text-emerald-500' : 'text-rose-500'
                      )}>
                        <HugeiconsIcon icon={card.isPositive ? ArrowUpRightIcon : ArrowDownRightIcon} size={12} />
                        {card.change}
                      </span>
                    )}
                  </div>
                </div>
                <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center', style.bg)}>
                  <HugeiconsIcon icon={Icon} size={22} className={style.icon} />
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
