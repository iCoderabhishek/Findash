import React, { createContext, useContext, useState } from 'react';

import type { Transaction } from '../features/transactions/types';
import data from '../data/data.json';

const initialTransactions: Transaction[] = data.transactions as Transaction[];

type DashboardContextType = {
  role: 'Admin' | 'Viewer';
  setRole: (r: 'Admin' | 'Viewer') => void;
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string | number, tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string | number) => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<'Admin' | 'Viewer'>('Admin');
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    setTransactions(prev => [{ ...tx, id: Date.now().toString() }, ...prev]);
  };

  const updateTransaction = (id: string | number, tx: Omit<Transaction, 'id'>) => {
    setTransactions(prev => prev.map(t => (t.id === id ? { ...t, ...tx, id } : t)));
  };

  const deleteTransaction = (id: string | number) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <DashboardContext.Provider value={{
      role, setRole,
      transactions, addTransaction, updateTransaction, deleteTransaction,
      selectedCategory, setSelectedCategory
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
}
