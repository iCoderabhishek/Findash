import type { Transaction } from '@/features/transactions/types'
import type { SummaryCard, Trend } from '@/features/dashboard/types'
import { formatCurrency } from '@/utils/format'

export function getTrend(chartData: { balance: number }[]): Trend {
  if (chartData.length < 2) return 'neutral'
  const first = chartData[0].balance
  const last = chartData[chartData.length - 1].balance
  if (last > first) return 'up'
  if (last < first) return 'down'
  return 'neutral'
}

export function computeSummaryCards(transactions: Transaction[]): SummaryCard[] {
  const totalIncome = transactions.filter(t => t.type === 'Income').reduce((s, t) => s + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === 'Expense').reduce((s, t) => s + t.amount, 0)
  const benefits = totalIncome - totalExpense

  return [
    { key: 'total-spent', title: 'Total spent', amount: formatCurrency(totalExpense), change: '', isPositive: false, iconName: 'money' },
    { key: 'income', title: 'Income', amount: formatCurrency(totalIncome), change: '', isPositive: true, iconName: 'trending-up' },
    { key: 'benefits', title: 'Benefits', amount: formatCurrency(Math.max(benefits, 0)), change: '', isPositive: benefits >= 0, iconName: 'gift' },
    { key: 'costs', title: 'Costs', amount: formatCurrency(totalExpense), change: '', isPositive: false, iconName: 'credit-card' },
  ]
}

export function computePieData(transactions: Transaction[]) {
  const expenses = transactions.filter(t => t.type === 'Expense')
  const byCategory: Record<string, number> = {}
  for (const t of expenses) {
    byCategory[t.category] = (byCategory[t.category] || 0) + t.amount
  }
  return Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name, value]) => ({ name, value }))
}

export function computeFinancialStats(transactions: Transaction[], openingBalance: number) {
  const totalCredits = transactions.filter(t => t.type === 'Income').reduce((s, t) => s + t.amount, 0)
  const totalDebits = transactions.filter(t => t.type === 'Expense').reduce((s, t) => s + t.amount, 0)
  const closing = openingBalance + totalCredits - totalDebits
  const changePct = ((closing - openingBalance) / openingBalance) * 100
  const netFlow = totalCredits - totalDebits
  const txCount = transactions.length
  const avgExpense = totalDebits / (transactions.filter(t => t.type === 'Expense').length || 1)

  const byCategory: Record<string, number> = {}
  for (const t of transactions.filter(t => t.type === 'Expense')) {
    byCategory[t.category] = (byCategory[t.category] || 0) + t.amount
  }
  const sortedCategories = Object.entries(byCategory).sort((a, b) => b[1] - a[1])
  const topCategory = sortedCategories[0]
  const topCategories = sortedCategories.slice(0, 4).map(([name, amount]) => ({
    name,
    amount,
    pct: Math.round((amount / totalDebits) * 100),
  }))

  const expenseCount = transactions.filter(t => t.type === 'Expense').length
  const incomeCount = transactions.filter(t => t.type === 'Income').length
  const savingsRate = totalCredits > 0 ? Math.round(((totalCredits - totalDebits) / totalCredits) * 100) : 0
  const creditsPct = totalCredits + totalDebits > 0 ? Math.round((totalCredits / (totalCredits + totalDebits)) * 100) : 50

  return {
    opening: formatCurrency(openingBalance),
    closing: formatCurrency(closing),
    closingRaw: closing,
    changePct: (changePct >= 0 ? '+' : '') + changePct.toFixed(1) + '%',
    isPositive: closing >= openingBalance,
    credits: formatCurrency(totalCredits),
    debits: formatCurrency(totalDebits),
    netFlow: formatCurrency(Math.abs(netFlow)),
    netFlowPositive: netFlow >= 0,
    txCount,
    expenseCount,
    incomeCount,
    avgExpense: formatCurrency(Math.round(avgExpense)),
    topCategory: topCategory ? { name: topCategory[0], amount: formatCurrency(topCategory[1]) } : null,
    topCategories,
    savingsRate,
    creditsPct,
  }
}
