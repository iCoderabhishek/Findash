import type { Transaction } from '@/features/transactions/types'

const HEADERS = ['Date', 'Category', 'Type', 'Amount (₹)'] as const


// a basic csv exporter, with transactions.
function escapeCell(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function formatRow(tx: Transaction): string {
  return [
    escapeCell(tx.date),
    escapeCell(tx.category),
    escapeCell(tx.type),
    tx.type === 'Income' ? tx.amount.toFixed(2) : `-${tx.amount.toFixed(2)}`,
  ].join(',')
}

export function exportTransactionsCsv(transactions: Transaction[]) {
  const rows = [HEADERS.join(','), ...transactions.map(formatRow)]
  const csv = rows.join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `findash-transactions-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
