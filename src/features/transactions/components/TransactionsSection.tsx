import { useState } from 'react';
import { PiMagnifyingGlass, PiFunnel, PiCaretUpDown, PiPlus, PiTrash, PiPencilSimple, PiX } from 'react-icons/pi';
import { useDashboard } from '../../../store/DashboardContext';
import type { Transaction } from '../types';

export default function TransactionsSection() {
  const { 
    transactions, 
    role, 
    deleteTransaction, 
    addTransaction, 
    updateTransaction,
    selectedCategory,
    setSelectedCategory
  } = useDashboard();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: '',
    type: 'Expense' as 'Income' | 'Expense'
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.category || !formData.date) return;
    
    const payload = {
      ...formData,
      amount: parseFloat(formData.amount)
    };

    if (editingId !== null) {
      updateTransaction(editingId, payload);
    } else {
      addTransaction(payload);
    }
    
    closeForm();
  };

  const openForm = (tx?: Transaction) => {
    if (tx) {
      setEditingId(tx.id);
      setFormData({
        date: tx.date,
        amount: tx.amount.toString(),
        category: tx.category,
        type: tx.type
      });
    } else {
      setEditingId(null);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        category: '',
        type: 'Expense'
      });
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'All' || t.type === filterType;
    const matchesCategoryClick = selectedCategory ? t.category === selectedCategory : true;
    return matchesSearch && matchesFilter && matchesCategoryClick;
  });

  return (
    <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 hover:shadow-sm transition-shadow duration-200 h-full relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-text-primary font-semibold">Transactions</h3>
          {selectedCategory && (
            <span className="flex items-center gap-1 text-xs bg-accent-blue-light text-accent-blue px-2 py-1 rounded-md font-medium">
              Filtered: {selectedCategory}
              <button onClick={() => setSelectedCategory(null)} className="hover:text-text-primary ml-1 transition-colors">
                <PiX className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <PiMagnifyingGlass className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search category..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-bg-base border border-border-subtle rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue transition-all w-40 sm:w-48"
            />
          </div>
          
          <div className="relative group cursor-pointer hidden sm:block">
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="appearance-none pl-8 pr-8 py-1.5 bg-bg-base border border-border-subtle rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue transition-all cursor-pointer"
            >
              <option value="All">All Types</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
            <PiFunnel className="w-4 h-4 text-text-muted absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {role === 'Admin' && (
            <button 
              onClick={() => openForm()}
              className="flex items-center gap-1 bg-text-primary text-bg-surface px-3 py-1.5 rounded-lg text-sm hover:bg-text-secondary transition-colors font-medium shadow-sm"
            >
              <PiPlus className="w-4 h-4" /> Add
            </button>
          )}
        </div>
      </div>

      {isFormOpen && (
        <form onSubmit={handleFormSubmit} className="mb-6 p-4 bg-bg-base border border-border-subtle rounded-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 items-end">
            <div>
              <label className="block text-xs text-text-secondary mb-1">Date</label>
              <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-3 py-1.5 border border-border-subtle rounded flex-1 text-sm bg-bg-surface" />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">Amount</label>
              <input type="number" required step="0.01" min="0" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full px-3 py-1.5 border border-border-subtle rounded flex-1 text-sm bg-bg-surface" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">Category</label>
              <input type="text" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-1.5 border border-border-subtle rounded flex-1 text-sm bg-bg-surface" placeholder="e.g. Food" />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">Type</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} className="w-full px-3 py-1.5 border border-border-subtle rounded flex-1 text-sm bg-bg-surface">
                <option value="Expense">Expense</option>
                <option value="Income">Income</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button type="submit" className="bg-text-primary text-bg-surface px-4 py-1.5 rounded text-sm font-medium hover:bg-text-secondary transition-colors w-full">Save</button>
              <button type="button" onClick={closeForm} className="bg-bg-surface border border-border-subtle text-text-primary px-3 py-1.5 rounded text-sm font-medium hover:bg-bg-base transition-colors shrink-0"><PiX/></button>
            </div>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-muted uppercase border-b border-border-subtle bg-bg-surface">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium text-right flex items-center justify-end gap-1">
                Amount <PiCaretUpDown className="w-3 h-3" />
              </th>
              {role === 'Admin' && <th className="px-4 py-3 font-medium text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <tr key={tx.id} className="border-b border-border-subtle/50 last:border-0 hover:bg-bg-base/50 transition-colors group">
                  <td className="px-4 py-4 text-text-secondary">{tx.date}</td>
                  <td className="px-4 py-4 font-medium text-text-primary">{tx.category}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      tx.type === 'Income' ? 'bg-success-light text-success' : 'bg-danger-light text-danger'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className={`px-4 py-4 text-right font-bold whitespace-nowrap ${
                     tx.type === 'Income' ? 'text-success' : 'text-danger'
                  }`}>
                    {tx.type === 'Income' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </td>
                  {role === 'Admin' && (
                     <td className="px-4 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openForm(tx)} className="text-text-muted hover:text-accent-blue transition-colors p-1" title="Edit">
                          <PiPencilSimple className="w-4 h-4"/>
                        </button>
                        <button onClick={() => deleteTransaction(tx.id)} className="text-text-muted hover:text-danger transition-colors p-1" title="Delete">
                          <PiTrash className="w-4 h-4"/>
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={role === 'Admin' ? 5 : 4} className="px-4 py-12 text-center text-text-muted">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-12 h-12 bg-bg-base rounded-full flex items-center justify-center mb-3">
                      <PiMagnifyingGlass className="w-5 h-5 text-text-muted" />
                    </div>
                    <p className="font-medium">No transactions available</p>
                    <p className="text-xs mt-1">Adjust your filters or add a new one.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
