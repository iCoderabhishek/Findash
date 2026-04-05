import type { Transaction } from '@/features/transactions/types'

export type Theme = 'light' | 'dark'

export type DashboardStore = {
  role: 'Admin' | 'Viewer'
  setRole: (r: 'Admin' | 'Viewer') => void

  theme: Theme
  toggleTheme: () => void

  transactions: Transaction[]
  addTransaction: (tx: Omit<Transaction, 'id'>) => void
  updateTransaction: (id: string | number, tx: Omit<Transaction, 'id'>) => void
  deleteTransaction: (id: string | number) => void

  selectedCategory: string | null
  setSelectedCategory: (cat: string | null) => void

  currentPage: number
  setCurrentPage: (page: number) => void
}
