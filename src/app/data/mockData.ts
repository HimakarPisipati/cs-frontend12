// Types
export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'expense' | 'income';
  paymentMethod: 'Cash' | 'UPI' | 'Card';
}

export interface Budget {
  category: string;
  limit: number;
  spent: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  emoji: string;
}

export const categories = [
  { name: 'Food', icon: '🍔', color: 'bg-orange-500' },
  { name: 'Transport', icon: '🚗', color: 'bg-blue-500' },
  { name: 'Shopping', icon: '🛍️', color: 'bg-pink-500' },
  { name: 'Rent', icon: '🏠', color: 'bg-purple-500' },
  { name: 'Education', icon: '📚', color: 'bg-green-500' },
  { name: 'Entertainment', icon: '🎮', color: 'bg-red-500' },
  { name: 'Healthcare', icon: '💊', color: 'bg-teal-500' },
  { name: 'Other', icon: '💰', color: 'bg-gray-500' },
];

export const getCategoryIcon = (categoryName: string): string => {
  const category = categories.find(c => c.name === categoryName);
  return category?.icon || '💰';
};

export const getCategoryColor = (categoryName: string): string => {
  const category = categories.find(c => c.name === categoryName);
  return category?.color || 'bg-gray-500';
};

// Mock data
export const mockTransactions: Transaction[] = [
  {
    id: '1',
    amount: 250,
    category: 'Food',
    description: 'Lunch at canteen',
    date: '2026-01-10',
    type: 'expense',
    paymentMethod: 'UPI'
  },
  {
    id: '2',
    amount: 5000,
    category: 'Education',
    description: 'Monthly allowance',
    date: '2026-01-09',
    type: 'income',
    paymentMethod: 'UPI'
  },
  {
    id: '3',
    amount: 150,
    category: 'Transport',
    description: 'Auto to college',
    date: '2026-01-09',
    type: 'expense',
    paymentMethod: 'Cash'
  },
  {
    id: '4',
    amount: 899,
    category: 'Shopping',
    description: 'New headphones',
    date: '2026-01-08',
    type: 'expense',
    paymentMethod: 'Card'
  },
  {
    id: '5',
    amount: 300,
    category: 'Entertainment',
    description: 'Movie with friends',
    date: '2026-01-07',
    type: 'expense',
    paymentMethod: 'UPI'
  },
  {
    id: '6',
    amount: 450,
    category: 'Food',
    description: 'Dinner at restaurant',
    date: '2026-01-06',
    type: 'expense',
    paymentMethod: 'Card'
  },
  {
    id: '7',
    amount: 100,
    category: 'Transport',
    description: 'Bus pass',
    date: '2026-01-05',
    type: 'expense',
    paymentMethod: 'Cash'
  },
  {
    id: '8',
    amount: 1200,
    category: 'Education',
    description: 'Books for semester',
    date: '2026-01-04',
    type: 'expense',
    paymentMethod: 'UPI'
  },
];

export const mockBudgets: Budget[] = [
  { category: 'Food', limit: 3000, spent: 1200 },
  { category: 'Transport', limit: 1000, spent: 450 },
  { category: 'Shopping', limit: 2000, spent: 899 },
  { category: 'Entertainment', limit: 1500, spent: 600 },
  { category: 'Education', limit: 3000, spent: 1200 },
  { category: 'Other', limit: 1000, spent: 250 },
];

export const mockSavingsGoals: SavingsGoal[] = [
  {
    id: '1',
    name: 'New Headphones',
    targetAmount: 2500,
    currentAmount: 1800,
    emoji: '🎧'
  },
  {
    id: '2',
    name: 'Goa Trip',
    targetAmount: 8000,
    currentAmount: 3200,
    emoji: '🏖️'
  },
  {
    id: '3',
    name: 'MacBook Fund',
    targetAmount: 80000,
    currentAmount: 15000,
    emoji: '💻'
  },
];

export const getMonthlySpending = () => {
  const expenses = mockTransactions.filter(t => t.type === 'expense');
  return expenses.reduce((sum, t) => sum + t.amount, 0);
};

export const getMonthlyIncome = () => {
  const income = mockTransactions.filter(t => t.type === 'income');
  return income.reduce((sum, t) => sum + t.amount, 0);
};

export const getCurrentBalance = () => {
  return getMonthlyIncome() - getMonthlySpending();
};

export const getCategorySpending = () => {
  const expenses = mockTransactions.filter(t => t.type === 'expense');
  const categoryTotals: { [key: string]: number } = {};
  
  expenses.forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });
  
  return Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
    fill: getCategoryColor(name)
  }));
};

export const getWeeklySpending = () => {
  return [
    { day: 'Mon', amount: 4500 },
    { day: 'Tue', amount: 320 },
    { day: 'Wed', amount: 580 },
    { day: 'Thu', amount: 290 },
    { day: 'Fri', amount: 650 },
    { day: 'Sat', amount: 820 },
    { day: 'Sun', amount: 420 },
  ];
};
