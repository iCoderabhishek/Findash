import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as LineTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, ResponsiveContainer as PieResponsiveContainer, Tooltip as PieTooltip
} from 'recharts';
import { useDashboard } from '../../../store/DashboardContext';
import data from '../../../data/data.json';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function ChartsSection() {
  const { selectedCategory, setSelectedCategory } = useDashboard();

  const balanceData = data.chartData.balanceData;
  const categoryData = data.chartData.categoryData;
  const totalExpenses = categoryData.reduce((acc, curr) => acc + curr.value, 0);

  const handlePieClick = (itemGroup: any) => {
    if (selectedCategory === itemGroup.name) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(itemGroup.name);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Line Chart */}
      <div className="bg-bg-surface p-6 rounded-2xl border border-border-subtle lg:col-span-2 hover:shadow-sm transition-shadow duration-200 h-full">
        <h3 className="text-text-primary font-semibold mb-6">Balance History</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={balanceData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }} 
                dy={10} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }} 
                dx={-10}
                tickFormatter={(value) => `$${value/1000}k`}
              />
              <LineTooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#0f172a' }}
              />
              <Line 
                type="monotone" 
                dataKey="balance" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} 
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-bg-surface p-6 rounded-2xl border border-border-subtle hover:shadow-sm transition-shadow duration-200 h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-text-primary font-semibold">Spending Snapshot</h3>
          {selectedCategory && (
            <span className="text-xs text-text-muted">Click slice to clear filter</span>
          )}
        </div>
        
        {categoryData.length > 0 ? (
          <div className="h-72 flex relative cursor-pointer flex-1">
            <PieResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  onClick={handlePieClick}
                  style={{ outline: 'none' }}
                >
                  {categoryData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      style={{ 
                        opacity: selectedCategory ? (selectedCategory === entry.name ? 1 : 0.3) : 1,
                        transition: 'opacity 0.2s',
                        cursor: 'pointer',
                        outline: 'none'
                      }}
                    />
                  ))}
                </Pie>
                <PieTooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </PieResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-text-secondary text-xs">Total Expenses</span>
              <span className="text-text-primary font-bold text-lg">${totalExpenses.toFixed(0)}</span>
            </div>
          </div>
        ) : (
          <div className="h-72 flex items-center justify-center flex-col text-text-muted flex-1">
            <p>No expense data available</p>
          </div>
        )}
      </div>
    </div>
  );
}
