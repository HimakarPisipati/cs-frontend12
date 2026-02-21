import { useState, useEffect, useMemo } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  TrendingUp, TrendingDown, Calendar, Award, AlertCircle, Sparkles, Loader2
} from "lucide-react";
import { 
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { categories } from "../data/mockData";
import { getTransactions, getBudgets } from "../../api/services";

export function AnalyticsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transRes, budgetRes] = await Promise.all([
          getTransactions(),
          getBudgets()
        ]);
        
        // ✅ FIX: Strict Data Safety
        setTransactions(Array.isArray(transRes.data) ? transRes.data : []);
        const total = (Array.isArray(budgetRes.data) ? budgetRes.data : []).reduce((sum: number, b: any) => sum + (Number(b.amount) || 0), 0);
        setTotalBudget(total);
      } catch (err) {
        console.error("Failed to fetch analytics data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const { 
    categoryData, monthlyComparison, topCategories, 
    percentageChange, isSpendingLess, avgSpending, bestMonth
  } = useMemo(() => {
    // ✅ FIX: Strict Zero Return if empty
    if (!transactions || transactions.length === 0) return { 
      categoryData: [], monthlyComparison: [], topCategories: [], 
      percentageChange: 0, isSpendingLess: true, avgSpending: 0, bestMonth: "-" 
    };

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    let thisMonthSpent = 0;
    let lastMonthSpent = 0;
    const catMap: { [key: string]: number } = {};
    const monthMap: { [key: string]: number } = {};

    transactions.forEach(t => {
      const amount = Number(t.amount);
      const date = new Date(t.date);
      const monthKey = date.toLocaleString('default', { month: 'short' });

      if (t.type === 'expense') {
        catMap[t.category] = (catMap[t.category] || 0) + amount;
        monthMap[monthKey] = (monthMap[monthKey] || 0) + amount;

        if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
          thisMonthSpent += amount;
        } else if (date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear) {
          lastMonthSpent += amount;
        }
      }
    });

    const formattedCatData = Object.keys(catMap).map(key => ({
      name: key, value: catMap[key]
    })).sort((a, b) => b.value - a.value);

    const monthsOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedMonthlyData = Object.keys(monthMap)
      .sort((a, b) => monthsOrder.indexOf(a) - monthsOrder.indexOf(b))
      .slice(-6)
      .map(month => ({
        month,
        spent: monthMap[month],
        budget: totalBudget
      }));

    const pChange = lastMonthSpent > 0 
      ? ((thisMonthSpent - lastMonthSpent) / lastMonthSpent) * 100 
      : 0;
    
    const totalSpentAllTime = Object.values(monthMap).reduce((a, b) => a + b, 0);
    const numberOfMonths = Object.keys(monthMap).length || 1;
    const sortedMonths = Object.entries(monthMap).sort(([,a], [,b]) => a - b);
    
    return {
      categoryData: formattedCatData,
      monthlyComparison: formattedMonthlyData,
      topCategories: formattedCatData.slice(0, 3),
      percentageChange: Math.abs(pChange).toFixed(1),
      isSpendingLess: pChange < 0,
      avgSpending: Math.round(totalSpentAllTime / numberOfMonths),
      bestMonth: sortedMonths.length > 0 ? sortedMonths[0][0] : "-"
    };
  }, [transactions, totalBudget]);

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6', '#64748b'];

  if (loading) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-purple-600" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card className="p-6 bg-gradient-to-br from-purple-500 to-blue-500 text-white border-0 shadow-xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-purple-100 text-sm mb-2">vs Last Month</p>
            <h2 className="text-4xl font-bold">
              {isSpendingLess ? "-" : "+"}{percentageChange}%
            </h2>
            <p className="text-purple-100 text-sm mt-2">
              {transactions.length === 0 ? "No data yet. Start spending!" : isSpendingLess ? "You spent less this month! 🎉" : "Spending increased slightly ⚠️"}
            </p>
          </div>
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            {isSpendingLess ? <TrendingDown className="w-8 h-8" /> : <TrendingUp className="w-8 h-8" />}
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border-0 shadow-lg dark:border-gray-700">
           <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Best Month</h3>
           <p className="text-sm text-gray-600 dark:text-gray-400">{bestMonth === "-" ? "No Data" : bestMonth}</p>
        </Card>
        <Card className="p-6 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border-0 shadow-lg dark:border-gray-700">
           <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Top Spending</h3>
           <p className="text-sm text-gray-600 dark:text-gray-400">
             {topCategories[0]?.name || "None"} - ₹{topCategories[0]?.value.toLocaleString() || 0}
           </p>
        </Card>
        <Card className="p-6 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border-0 shadow-lg dark:border-gray-700">
           <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Monthly Avg</h3>
           <p className="text-sm text-gray-600 dark:text-gray-400">₹{avgSpending.toLocaleString()}</p>
        </Card>
      </div>

      {/* Charts logic stays same... */}
      {/* (Rest of the file is standard, charts will render empty data safely) */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border-0 shadow-lg transition-colors dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Category Breakdown</h3>
            <Button variant="ghost" size="sm" className="dark:text-gray-400">
              <Calendar className="w-4 h-4 mr-2" />
              All Time
            </Button>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            {categoryData.length > 0 ? (
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }}
                />
              </PieChart>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">No data available</div>
            )}
          </ResponsiveContainer>
        </Card>

        {/* Monthly Comparison Chart */}
        <Card className="p-6 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border-0 shadow-lg transition-colors dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Monthly History</h3>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                cursor={{fill: 'transparent'}}
                contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }}
              />
              <Legend />
              <Bar dataKey="spent" fill="#8b5cf6" name="Spent" radius={[8, 8, 0, 0]} />
              <Bar dataKey="budget" fill="#e9d5ff" name="Budget" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}