import { useState, useMemo } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Search01Icon, PlusSignIcon,
  Delete01Icon, PencilEdit01Icon, CancelIcon,
  ArrowLeft01Icon, ArrowRight01Icon,
  ArrowTurnBackwardIcon,
} from '@hugeicons/core-free-icons'
import { AnimatePresence, motion } from 'motion/react'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useDashboard } from '@/store/dashboard-store'
import { paginate } from '@/features/transactions/utils/pagination'
import { bentoCardStatic } from '@/utils/colors'
import { cn } from '@/lib/utils'
import { DatePicker } from '@/components/ui/date-picker'
import type { Transaction } from '@/features/transactions/types'
import { PAGE_SIZE } from '@/features/transactions/constants'
import { TableSkeleton } from '@/features/transactions/components/table-skeleton'
import { usePendingDelete } from '@/features/transactions/hooks/use-pending-delete'
import { useAnimatedNumber } from '@/features/transactions/hooks/use-animated-number'

// --- Sub-component: animated amount cell ---
function AmountCell({ tx }: { tx: Transaction }) {
  const animated = useAnimatedNumber(tx.amount)
  return (
    <TableCell className={cn(
      'text-sm text-right font-bold tabular-nums relative z-10',
      tx.type === 'Income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400',
    )}>
      {tx.type === 'Income' ? '+' : '-'}₹{animated.toFixed(2)}
    </TableCell>
  )
}

// --- Sub-component: row action buttons with tooltips ---
function RowActions({
  isPending,
  onEdit,
  onDelete,
  onUndo,
}: {
  isPending: boolean
  onEdit: () => void
  onDelete: () => void
  onUndo: () => void
}) {
  return (
    <TableCell className="text-right relative z-10">
      <TooltipProvider>
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {isPending ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-lg"
                  className="rounded-full text-amber-500 hover:text-amber-600"
                  onClick={onUndo}
                >
                  <HugeiconsIcon icon={ArrowTurnBackwardIcon} size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Undo delete</TooltipContent>
            </Tooltip>
          ) : (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon-lg" className="rounded-full" onClick={onEdit}>
                    <HugeiconsIcon icon={PencilEdit01Icon} size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Edit</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon-lg" className="rounded-full" onClick={onDelete}>
                    <HugeiconsIcon icon={Delete01Icon} size={18} className="text-rose-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Delete</TooltipContent>
              </Tooltip>
            </>
          )}
        </div>
      </TooltipProvider>
    </TableCell>
  )
}

// --- Main component ---
export default function LastActivity() {
  const {
    transactions, role,
    deleteTransaction, addTransaction, updateTransaction,
    selectedCategory, setSelectedCategory,
    currentPage, setCurrentPage,
  } = useDashboard()

  const isHydrated = useDashboard.persist?.hasHydrated?.() ?? true
  const { pending, markForDelete, undoDelete } = usePendingDelete(deleteTransaction)

  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('All')
  const [hoveredRow, setHoveredRow] = useState<string | number | null>(null)
  const [isFormOpenRaw, setIsFormOpen] = useState(false)
  const isFormOpen = role === 'Admin' && isFormOpenRaw
  const [editingId, setEditingId] = useState<string | number | null>(null)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: '',
    type: 'Expense' as 'Income' | 'Expense',
  })

  const filtered = useMemo(() => transactions.filter((t) => {
    const matchesSearch = t.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'All' || t.type === filterType
    const matchesCategory = !selectedCategory || t.category === selectedCategory
    return matchesSearch && matchesFilter && matchesCategory
  }), [transactions, searchTerm, filterType, selectedCategory])

  const { data: paginatedData, range, totalPages } = paginate(filtered, currentPage, PAGE_SIZE)

  const openForm = (tx?: Transaction) => {
    if (tx) {
      setEditingId(tx.id)
      setFormData({ date: tx.date, amount: tx.amount.toString(), category: tx.category, type: tx.type })
    } else {
      setEditingId(null)
      setFormData({ date: new Date().toISOString().split('T')[0], amount: '', category: '', type: 'Expense' })
    }
    setIsFormOpen(true)
  }

  const closeForm = () => { setIsFormOpen(false); setEditingId(null) }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.amount || !formData.category || !formData.date) return
    const payload = { ...formData, amount: parseFloat(formData.amount) }
    if (editingId !== null) updateTransaction(editingId, payload)
    else addTransaction(payload)
    closeForm()
  }

  return (
    <div className={cn(bentoCardStatic, 'h-full')}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-foreground font-light text-xl tracking-tight">
            Last <span className="font-bold">activity</span>
          </h3>
          {selectedCategory && (
            <span className="flex items-center gap-1 text-xs bg-blue-500/10 text-blue-500 px-2 py-1 rounded-full font-medium transition-all duration-200">
              {selectedCategory}
              <button onClick={() => setSelectedCategory(null)} className="hover:text-foreground ml-1 transition-colors">
                <HugeiconsIcon icon={CancelIcon} size={12} />
              </button>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">

          <div className="relative">
            <HugeiconsIcon icon={Search01Icon} size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
              className="pl-8 pr-3 py-1.5 bg-muted/50 border border-border/40 rounded-full text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-foreground/5 focus:border-border transition-all duration-300 w-36 focus:w-44"
            />
          </div>

          <div className="hidden sm:block">
            <Select value={filterType} onValueChange={(v) => { setFilterType(v); setCurrentPage(1) }}>
              <SelectTrigger className="rounded-full bg-muted/50 border-border/40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Income">Income</SelectItem>
                <SelectItem value="Expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <span className="text-xs text-muted-foreground hidden md:block tabular-nums">{range}</span>

          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon-sm" className="rounded-full" disabled={currentPage <= 1} onClick={() => setCurrentPage(currentPage - 1)}>
              <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
            </Button>
            <Button variant="outline" size="icon-sm" className="rounded-full" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
            </Button>
          </div>

          {role === 'Admin' && (
            <Button size="lg" onClick={() => openForm()} className="gap-1 rounded-full">
              <HugeiconsIcon icon={PlusSignIcon} size={14} /> Add
            </Button>
          )}
        </div>
      </div>

      {/* Add / Edit Form */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-muted/40 border border-border/40 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 items-end">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Date</label>
              <DatePicker
                value={formData.date ? new Date(formData.date) : undefined}
                onChange={(date) => setFormData({ ...formData, date: date ? date.toISOString().split('T')[0] : '' })}
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Amount</label>
              <input type="number" required step="1" min="1" value={formData.amount}
                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-1.5 border border-border/40 rounded-xl text-sm bg-card text-foreground" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Category</label>
              <input type="text" required value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-1.5 border border-border/40 rounded-xl text-sm bg-card text-foreground" placeholder="e.g. Food" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Type</label>
              <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as 'Income' | 'Expense' })}>
                <SelectTrigger className="w-full rounded-xl border-border/40 bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Expense">Expense</SelectItem>
                  <SelectItem value="Income">Income</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="sm" className="flex-1 rounded-xl">Save</Button>
              <Button type="button" variant="outline" size="icon-sm" className="rounded-xl" onClick={closeForm}>
                <HugeiconsIcon icon={CancelIcon} size={14} />
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        {!isHydrated ? (
          <TableSkeleton showActions={role === 'Admin'} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/40">
                <TableHead className="text-[13px] font-medium text-muted-foreground">Date</TableHead>
                <TableHead className="text-[13px] font-medium text-muted-foreground">Category</TableHead>
                <TableHead className="text-[13px] font-medium text-muted-foreground">Type</TableHead>
                <TableHead className="text-[13px] font-medium text-muted-foreground text-right">Amount</TableHead>
                {role === 'Admin' && (
                  <TableHead className="text-[13px] font-medium text-muted-foreground text-right">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((tx) => {
                  const isPending = tx.id in pending
                  return (
                    <TableRow
                      key={tx.id}
                      className={cn(
                        'group relative border-border/30 transition-opacity duration-300',
                        isPending && 'opacity-40',
                      )}
                      onMouseEnter={() => setHoveredRow(tx.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <TableCell className="relative text-sm text-muted-foreground tabular-nums">
                        <AnimatePresence>
                          {hoveredRow === tx.id && (
                            <motion.span
                              className="absolute inset-0 bg-muted/50 dark:bg-muted/30 block"
                              layoutId="row-hover"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1, transition: { duration: 0.12 } }}
                              exit={{ opacity: 0, transition: { duration: 0.12, delay: 0.08 } }}
                            />
                          )}
                        </AnimatePresence>
                        <span className="relative z-10">{tx.date}</span>
                      </TableCell>
                      <TableCell className="text-sm font-medium text-foreground relative z-10">{tx.category}</TableCell>
                      <TableCell className="relative z-10">
                        <span className={cn(
                          'inline-flex px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border transition-opacity duration-200 hover:opacity-80',
                          tx.type === 'Income'
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400 dark:border-emerald-400/20'
                            : 'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400 dark:border-rose-400/20',
                        )}>
                          {tx.type}
                        </span>
                      </TableCell>
                      <AmountCell tx={tx} />
                      {role === 'Admin' && (
                        <RowActions
                          isPending={isPending}
                          onEdit={() => openForm(tx)}
                          onDelete={() => markForDelete(tx)}
                          onUndo={() => undoDelete(tx.id)}
                        />
                      )}
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={role === 'Admin' ? 5 : 4} className="text-center py-12">
                    <div className="flex flex-col items-center text-muted-foreground">
                      <HugeiconsIcon icon={Search01Icon} size={24} className="mb-2 opacity-40" />
                      <p className="font-medium">No transactions found</p>
                      <p className="text-xs mt-1 text-muted-foreground/60">Adjust filters or add a new one</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
