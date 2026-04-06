import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Transaction } from '@/features/transactions/types'
import type { DashboardStore, Theme } from '@/store/types'
import data from '@/data/data.json'

function getSavedTheme(): Theme {
  try {
    const saved = localStorage.getItem('findash-theme')
    if (saved === 'dark' || saved === 'light') return saved
  } catch { /* noop */ }
  return 'light'
}

export const useDashboard = create<DashboardStore>()(
  persist(
    (set) => ({
      role: 'Admin',
      setRole: (role) => set({ role }),

      theme: getSavedTheme(),
      toggleTheme: () => set((s) => {
        const next = s.theme === 'light' ? 'dark' : 'light'
        document.documentElement.classList.toggle('dark', next === 'dark')
        localStorage.setItem('findash-theme', next)
        return { theme: next }
      }),

      transactions: data.transactions as Transaction[],
      addTransaction: (tx) => set((s) => ({
        transactions: [{ ...tx, id: Date.now().toString() }, ...s.transactions],
      })),
      updateTransaction: (id, tx) => set((s) => ({
        transactions: s.transactions.map(t => t.id === id ? { ...t, ...tx, id } : t),
      })),
      deleteTransaction: (id) => set((s) => ({
        transactions: s.transactions.filter(t => t.id !== id),
      })),

      selectedCategory: null,
      setSelectedCategory: (cat) => set({ selectedCategory: cat }),

      currentPage: 1,
      setCurrentPage: (page) => set({ currentPage: page }),
    }),
    {
      name: 'findash-data',
      // Only persist transactions — theme is already persisted separately
      partialize: (s) => ({ transactions: s.transactions }),
    }
  )
)
