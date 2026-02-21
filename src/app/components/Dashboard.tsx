import { useState, useEffect, useMemo } from 'react';
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  LayoutDashboard, Receipt, Wallet, Target, BarChart3, Settings,
  Bell, TrendingUp, TrendingDown, HandCoins,
  ChevronRight, Menu, X, Smartphone, CreditCard, Banknote
} from "lucide-react";
import { getCategoryIcon, getCategoryColor } from "../data/mockData";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// ✅ Import Both Services
import { getTransactions, getBudgets, getDues } from "../../api/services";

interface DashboardProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  children?: React.ReactNode;
}

export function Dashboard({ onNavigate, currentPage, children }: DashboardProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ✅ State for Real Data
  const [transactions, setTransactions] = useState<any[]>([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [duesData, setDuesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Transactions AND Budgets
  useEffect(() => {
    const loadData = async () => {
      if (currentPage === 'dashboard') {
        try {
          setLoading(true);

          // 1. Fetch Transactions
          const transRes = await getTransactions();
          const sorted = transRes.data.sort((a: any, b: any) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setTransactions(sorted);

          // 2. Fetch Budgets & Calculate Total
          const budgetRes = await getBudgets();
          // Safety check: ensure budgetRes.data is an array
          const budgetData = Array.isArray(budgetRes.data) ? budgetRes.data : [];
          const total = budgetData.reduce((sum: number, b: any) => sum + (Number(b.amount) || Number(b.limit) || 0), 0);
          setTotalBudget(total);

          // 3. Fetch Dues
          try {
            const duesRes = await getDues();
            setDuesData(Array.isArray(duesRes.data) ? duesRes.data : []);
          } catch { setDuesData([]); }

        } catch (error) {
          console.error("Failed to load dashboard data", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [currentPage]);

  // ✅ Calculate Dynamic Values
  const { balance, monthlySpent, categoryData, weeklyData } = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let income = 0;
    let expense = 0;
    let monthExpense = 0;
    const catMap: { [key: string]: number } = {};
    const last7DaysMap: { [key: string]: number } = {};

    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = d.toLocaleDateString('en-IN', { weekday: 'short' });
      last7DaysMap[dayName] = 0;
    }

    transactions.forEach((t) => {
      const amount = Number(t.amount) || 0;
      const tDate = new Date(t.date);

      if (t.type === 'income') {
        income += amount;
      } else {
        expense += amount;

        if (tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear) {
          monthExpense += amount;
        }

        if (!catMap[t.category]) catMap[t.category] = 0;
        catMap[t.category] += amount;

        const dayName = tDate.toLocaleDateString('en-IN', { weekday: 'short' });
        const diffTime = Math.abs(now.getTime() - tDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 7 && last7DaysMap[dayName] !== undefined) {
          last7DaysMap[dayName] += amount;
        }
      }
    });

    return {
      balance: income - expense,
      monthlySpent: monthExpense,
      categoryData: Object.keys(catMap).map(key => ({ name: key, value: catMap[key] })),
      weeklyData: Object.keys(last7DaysMap).map(key => ({ day: key, amount: last7DaysMap[key] }))
    };
  }, [transactions]);

  // Spend by payment method
  const spendByPayment = useMemo(() => {
    const map: { [key: string]: number } = { upi: 0, cash: 0, card: 0 };
    transactions.forEach((t) => {
      if (t.type === 'expense') {
        const pm = (t.paymentMethod || 'cash').toLowerCase();
        if (map[pm] !== undefined) map[pm] += Number(t.amount) || 0;
      }
    });
    return map;
  }, [transactions]);

  // Dues summary
  const duesSummary = useMemo(() => {
    let youllGet = 0;
    let youOwe = 0;
    duesData.forEach((d) => {
      if (d.settled) return;
      if (d.type === 'pending') youllGet += Number(d.amount) || 0;
      else youOwe += Number(d.amount) || 0;
    });
    return { youllGet, youOwe };
  }, [duesData]);

  // Dynamic Budget Calculations
  const budgetRemaining = totalBudget - monthlySpent;
  const budgetProgress = totalBudget > 0 ? Math.min(Math.round((monthlySpent / totalBudget) * 100), 100) : 0;

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'transactions', icon: Receipt, label: 'Transactions' },
    { id: 'budgets', icon: Wallet, label: 'Budgets' },
    { id: 'savings', icon: Target, label: 'Savings Goals' },
    { id: 'dues', icon: HandCoins, label: 'Dues' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 transition-colors duration-300">

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:block fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40 transition-colors duration-300">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              CampusSpend
            </span>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <Button
            variant="outline"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              onNavigate('login');
            }}
            className="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Logout
          </Button>
        </div>
      </aside>

      {/* ✅ RESTORED: Mobile Sidebar Logic */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)}></div>
          <aside className="absolute left-0 top-0 h-screen w-64 bg-white dark:bg-gray-800 transition-colors">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl font-bold text-gray-900 dark:text-white">CampusSpend</span>
                <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(false)}>
                  <X className="w-5 h-5 dark:text-gray-400" />
                </Button>
              </div>
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        setIsSidebarOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 transition-colors">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              {/* ✅ RESTORED: Mobile Menu Trigger */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden dark:text-white"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </Button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                {currentPage}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="relative dark:text-gray-400 dark:hover:bg-gray-800">
                <Bell className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        {currentPage === 'dashboard' && (
          <main className="p-4 lg:p-8 pb-24 lg:pb-8">
            {/* Balance Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6 bg-gradient-to-br from-purple-500 to-blue-500 text-white border-0 shadow-xl">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-purple-100 text-sm">Current Balance</p>
                    <h2 className="text-3xl font-bold mt-2">
                      {loading ? "..." : `₹${balance.toLocaleString()}`}
                    </h2>
                  </div>
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Wallet className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>Available Funds</span>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-xl">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-orange-100 text-sm">This Month Spent</p>
                    <h2 className="text-3xl font-bold mt-2">
                      {loading ? "..." : `₹${monthlySpent.toLocaleString()}`}
                    </h2>
                  </div>
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <TrendingDown className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span>of ₹{totalBudget.toLocaleString()} budget</span>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-green-500 to-teal-500 text-white border-0 shadow-xl">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-green-100 text-sm">Budget Remaining</p>
                    <h2 className="text-3xl font-bold mt-2">
                      {loading ? "..." : `₹${budgetRemaining.toLocaleString()}`}
                    </h2>
                  </div>
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span>
                    {totalBudget > 0 ? `${Math.max(0, 100 - budgetProgress)}% left` : "No budget set"}
                  </span>
                </div>
              </Card>
            </div>

            {/* Spend Mode & Pending Dues */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* Spend Mode */}
              <Card className="p-6 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border-0 shadow-lg">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">Spend Mode</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-blue-500 uppercase">UPI</span>
                      <Smartphone className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">₹{spendByPayment.upi.toLocaleString()}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-green-500 uppercase">Cash</span>
                      <Banknote className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">₹{spendByPayment.cash.toLocaleString()}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-purple-500 uppercase">Card</span>
                      <CreditCard className="w-5 h-5 text-purple-500" />
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">₹{spendByPayment.card.toLocaleString()}</p>
                  </div>
                </div>
              </Card>

              {/* Pending Dues */}
              <Card className="p-6 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border-0 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <HandCoins className="w-5 h-5 text-purple-500" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Pending Dues</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                    onClick={() => onNavigate('dues')}
                  >
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">You'll Get</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">₹{duesSummary.youllGet.toLocaleString()}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">You Owe</p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">₹{duesSummary.youOwe.toLocaleString()}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              <Card className="p-6 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border-0 shadow-lg dark:text-white">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Spending by Category</h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  {categoryData.length > 0 ? (
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No expense data yet
                    </div>
                  )}
                </ResponsiveContainer>
              </Card>

              <Card className="p-6 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border-0 shadow-lg dark:text-white">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Weekly Spending</h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="day" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      dot={{ fill: '#8b5cf6', r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* ✅ RESTORED: Recent Transactions Table */}
            <Card className="p-6 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border-0 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="dark:text-gray-400 dark:hover:bg-gray-700"
                  onClick={() => onNavigate('transactions')}
                >
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <div className="space-y-4">
                {loading ? (
                  <p className="text-center text-gray-500 py-4">Loading transactions...</p>
                ) : transactions.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No recent transactions</p>
                ) : (
                  transactions.slice(0, 6).map((transaction) => (
                    <div
                      key={transaction._id || transaction.id}
                      className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 ${getCategoryColor(transaction.category)} rounded-xl flex items-center justify-center text-2xl`}>
                          {getCategoryIcon(transaction.category)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{transaction.note || transaction.description || "Transaction"}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <span>{transaction.category}</span>
                            <span>•</span>
                            <span>{new Date(transaction.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                            <Badge variant="outline" className="ml-2 border-gray-300 dark:border-gray-600 dark:text-gray-300">
                              {transaction.paymentMethod ? transaction.paymentMethod.toUpperCase() : "UPI"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className={`text-lg font-semibold ${transaction.type === 'expense' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                        {transaction.type === 'expense' ? '-' : '+'}₹{transaction.amount}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </main>
        )}

        {/* Render other pages */}
        {currentPage !== 'dashboard' && children && (
          <main className="p-4 lg:p-8 pb-24 lg:pb-8">
            {children}
          </main>
        )}
      </div>
    </div>
  );
}