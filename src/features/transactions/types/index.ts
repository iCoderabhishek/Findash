export type Transaction = {
  id: string | number;
  date: string;
  amount: number;
  category: string;
  type: 'Income' | 'Expense';
};
