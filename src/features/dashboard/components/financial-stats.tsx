import { useMemo, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowUpRightIcon, ArrowDownRightIcon } from '@hugeicons/core-free-icons'
import { AnimatePresence, motion } from 'motion/react'
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation'
import { bentoCardStatic, statusColors } from '@/utils/colors'
import { cn } from '@/lib/utils'
import { useDashboard } from '@/store/dashboard-store'
import { computeFinancialStats } from '@/features/dashboard/utils/compute-dashboard'
import { OPENING_BALANCE } from '@/features/dashboard/constants'

const BAR_COLORS = [
  'bg-indigo-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
]

export default function FinancialStats() {
  const transactions = useDashboard(s => s.transactions)
  const d = useMemo(() => computeFinancialStats(transactions, OPENING_BALANCE), [transactions])
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
      <div className={cn(bentoCardStatic, 'h-full')}>
        <p className="text-xs uppercase tracking-widest text-muted-foreground/50 font-semibold">Balance flow</p>
        <div className="mt-4 space-y-1">
          <div
            className="relative rounded-xl px-3 py-2 -mx-3"
            onMouseEnter={() => setHoveredItem('opening')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <AnimatePresence>
              {hoveredItem === 'opening' && (
                <motion.span className="absolute inset-0 bg-muted/60 dark:bg-muted/40 block rounded-xl" layoutId="balance-hover"
                  initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.12 } }}
                  exit={{ opacity: 0, transition: { duration: 0.12, delay: 0.08 } }} />
              )}
            </AnimatePresence>
            <div className="relative z-10">
              <p className="text-sm text-muted-foreground font-medium">Opening</p>
              <p className="text-2xl font-extrabold text-foreground tracking-tight">{d.opening}</p>
            </div>
          </div>
          <span className="block text-muted-foreground/30 text-base pl-3">↓</span>
          <div
            className="relative rounded-xl px-3 py-2 -mx-3"
            onMouseEnter={() => setHoveredItem('closing')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <AnimatePresence>
              {hoveredItem === 'closing' && (
                <motion.span className="absolute inset-0 bg-muted/60 dark:bg-muted/40 block rounded-xl" layoutId="balance-hover"
                  initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.12 } }}
                  exit={{ opacity: 0, transition: { duration: 0.12, delay: 0.08 } }} />
              )}
            </AnimatePresence>
            <div className="relative z-10">
              <p className="text-sm text-muted-foreground font-medium">Closing</p>
              <p className="text-2xl font-extrabold text-foreground tracking-tight">{d.closing}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 mt-3">
          <HugeiconsIcon icon={d.isPositive ? ArrowUpRightIcon : ArrowDownRightIcon} size={14}
            className={d.isPositive ? statusColors.positive : statusColors.negative} />
          <span className={cn('text-sm font-bold', d.isPositive ? statusColors.positive : statusColors.negative)}>
            {d.changePct} growth
          </span>
        </div>
        <p className="text-xs text-muted-foreground/90 mt-2">
          {d.isPositive ? 'Your balance grew this period' : 'Balance declined — review spending'}
        </p>
      </div>

      <div className={cn(bentoCardStatic, 'h-full')}>
        <p className="text-xs uppercase tracking-widest text-muted-foreground/50 font-semibold">Money in vs out</p>
        <div className="mt-4 space-y-1">
          <div
            className="relative rounded-xl px-3 py-2 -mx-3 flex items-center justify-between"
            onMouseEnter={() => setHoveredItem('credits')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <AnimatePresence>
              {hoveredItem === 'credits' && (
                <motion.span className="absolute inset-0 bg-emerald-500/8 dark:bg-emerald-500/10 block rounded-xl" layoutId="money-hover"
                  initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.12 } }}
                  exit={{ opacity: 0, transition: { duration: 0.12, delay: 0.08 } }} />
              )}
            </AnimatePresence>
            <span className="relative z-10 text-sm text-muted-foreground font-medium">Credits</span>
            <span className="relative z-10 text-base font-bold text-emerald-500">{d.credits}</span>
          </div>
          <div
            className="relative rounded-xl px-3 py-2 -mx-3 flex items-center justify-between"
            onMouseEnter={() => setHoveredItem('debits')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <AnimatePresence>
              {hoveredItem === 'debits' && (
                <motion.span className="absolute inset-0 bg-rose-500/8 dark:bg-rose-500/10 block rounded-xl" layoutId="money-hover"
                  initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.12 } }}
                  exit={{ opacity: 0, transition: { duration: 0.12, delay: 0.08 } }} />
              )}
            </AnimatePresence>
            <span className="relative z-10 text-sm text-muted-foreground font-medium">Debits</span>
            <span className="relative z-10 text-base font-bold text-rose-500">-{d.debits}</span>
          </div>
          <div
            className="relative rounded-xl px-3 py-2 -mx-3 flex items-center justify-between"
            onMouseEnter={() => setHoveredItem('net')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <AnimatePresence>
              {hoveredItem === 'net' && (
                <motion.span className="absolute inset-0 bg-muted/60 dark:bg-muted/40 block rounded-xl" layoutId="money-hover"
                  initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.12 } }}
                  exit={{ opacity: 0, transition: { duration: 0.12, delay: 0.08 } }} />
              )}
            </AnimatePresence>
            <span className="relative z-10 text-sm text-foreground font-semibold">Net</span>
            <span className={cn('relative z-10 text-base font-extrabold', d.netFlowPositive ? 'text-emerald-500' : 'text-rose-500')}>
              {d.netFlowPositive ? '+' : '-'}{d.netFlow}
            </span>
          </div>
        </div>
        <div className="mt-3 h-2.5 rounded-full bg-muted overflow-hidden flex gap-0.5">
          <div className="bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${d.creditsPct}%` }} />
          <div className="bg-rose-500 rounded-full transition-all duration-500" style={{ width: `${100 - d.creditsPct}%` }} />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-muted-foreground/60"><span className="font-bold text-foreground">{d.incomeCount}</span> income</span>
          <span className="text-xs text-muted-foreground/60"><span className="font-bold text-foreground">{d.expenseCount}</span> expenses</span>
        </div>
      </div>

      <div className="lg:col-span-3 relative rounded-3xl overflow-hidden border border-border/20 bg-card/50">
        <BackgroundGradientAnimation
          gradientBackgroundStart="rgb(10, 10, 15)"
          gradientBackgroundEnd="rgb(15, 15, 25)"
          firstColor="99, 102, 241"
          secondColor="16, 185, 129"
          thirdColor="139, 92, 246"
          fourthColor="236, 72, 153"
          fifthColor="59, 130, 246"
          pointerColor="139, 92, 246"
          size="50%"
          blendingValue="hard-light"
          interactive={false}
          containerClassName="!h-full !w-full absolute inset-0 opacity-[0.09] dark:opacity-[0.35]"
        />
        <div className="relative z-10 p-6">
          <div className="flex items-center justify-between mb-5">
            <p className="text-xs uppercase tracking-widest text-muted-foreground/80 font-semibold">Period summary</p>
            <span className="text-xs text-muted-foreground/80">
              <span className="font-bold text-foreground">{d.txCount}</span> transactions this month
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-5">
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1">Savings rate</p>
              <p className="text-3xl font-extrabold text-foreground tracking-tight">{d.savingsRate}%</p>
              <p className="text-xs text-muted-foreground/80 mt-1.5">
                {d.savingsRate > 20 ? 'Healthy saving habits' : d.savingsRate > 0 ? 'Room to improve' : 'Overspending alert'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1">Avg. per expense</p>
              <p className="text-3xl font-extrabold text-foreground tracking-tight">{d.avgExpense}</p>
              <p className="text-xs text-muted-foreground/80 mt-1.5">Across <span className="font-semibold text-foreground">{d.expenseCount}</span> transactions</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1">Total earned</p>
              <p className="text-3xl font-extrabold text-emerald-500 tracking-tight">{d.credits}</p>
              <p className="text-xs text-muted-foreground/80 mt-1.5">From <span className="font-semibold text-foreground">{d.incomeCount}</span> sources</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1">Top spending</p>
              <p className="text-3xl font-extrabold text-foreground tracking-tight">{d.topCategory?.name ?? '—'}</p>
              {d.topCategory && (
                <p className="text-xs text-muted-foreground/80 mt-1.5">{d.topCategory.amount} spent</p>
              )}
            </div>
          </div>

          {d.topCategories.length > 0 && (
            <div className="mt-6 pt-5 border-t border-border/30">
              <p className="text-xs text-muted-foreground/80 font-medium mb-3">Where your money goes</p>
              <div className="space-y-3">
                {d.topCategories.map((cat, i) => (
                  <div key={cat.name} className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground font-medium w-24 shrink-0 truncate">{cat.name}</span>
                    <div className="flex-1 h-2 rounded-full bg-muted/50 overflow-hidden">
                      <div
                        className={cn('h-full rounded-full transition-all duration-700 ease-out', BAR_COLORS[i % BAR_COLORS.length])}
                        style={{ width: `${cat.pct}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-foreground w-10 text-right">{cat.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
