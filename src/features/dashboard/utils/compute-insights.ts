import type { Transaction } from '@/features/transactions/types'
import type { Insight } from '@/features/dashboard/types'

export function computeInsights(transactions: Transaction[]): Insight[] {
  const expenses = transactions.filter(t => t.type === 'Expense')
  const incomes = transactions.filter(t => t.type === 'Income')

  const totalExpense = expenses.reduce((s, t) => s + t.amount, 0)
  const totalIncome = incomes.reduce((s, t) => s + t.amount, 0)

  const byCategory: Record<string, number> = {}
  for (const t of expenses) {
    byCategory[t.category] = (byCategory[t.category] || 0) + t.amount
  }

  const sorted = Object.entries(byCategory).sort((a, b) => b[1] - a[1])
  const insights: Insight[] = []

  if (sorted.length > 0) {
    const [topCat, topAmt] = sorted[0]
    const pct = Math.round((topAmt / totalExpense) * 100)
    insights.push({
      label: 'Top category',
      value: `${topCat} is ${pct}% of total spend`,
      detail: `₹${topAmt.toLocaleString('en-IN')} out of ₹${totalExpense.toLocaleString('en-IN')}`,
      type: pct > 40 ? 'warning' : 'info',
    })
  }

  if (totalIncome > 0) {
    const savingsRate = Math.round(((totalIncome - totalExpense) / totalIncome) * 100)
    insights.push({
      label: 'Savings rate',
      value: savingsRate > 0 ? `You're saving ${savingsRate}% of income` : `Spending exceeds income by ${Math.abs(savingsRate)}%`,
      detail: `₹${(totalIncome - totalExpense).toLocaleString('en-IN')} net`,
      type: savingsRate > 20 ? 'success' : savingsRate > 0 ? 'info' : 'warning',
    })
  }

  if (sorted.length >= 2) {
    const [topCat] = sorted[0]
    const ratio = Math.round(sorted[0][1] / sorted[1][1])
    if (ratio >= 2) {
      insights.push({
        label: 'Spending gap',
        value: `${topCat} costs ${ratio}x more than others`,
        detail: 'Consider reviewing this category',
        type: 'warning',
      })
    } else {
      insights.push({
        label: 'Diversity',
        value: `Spending spread across ${sorted.length} categories`,
        detail: 'Balanced distribution',
        type: 'success',
      })
    }
  }

  return insights
}
