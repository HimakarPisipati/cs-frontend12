import { getCurrencySymbol } from "../../utils/currency";
import { useState, useEffect, useMemo } from 'react';
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  LayoutDashboard, Receipt, Wallet, Target, BarChart3, Settings,
  Bell, TrendingUp, TrendingDown, HandCoins, Briefcase,
  ChevronRight, Menu, X, Smartphone, CreditCard, Banknote, DollarSign, CalendarDays, RepeatIcon, Sparkles,
  User, LogOut, Mail, CheckCircle2, AlertCircle, Info, Clock, Check
} from "lucide-react";
import { getCategoryIcon, getCategoryColor } from "../data/mockData";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from "motion/react";

// ✅ Import Both Services
import { 
  getTransactions, getBudgets, getDues, getSalaries, getReminders, getUserProfile,
  getNotifications, markNotificationAsRead, markAllNotificationsAsRead, updateProfile
} from "../../api/services";
import { TutorialOverlay } from './TutorialOverlay';
import { CategoryIcon } from './CategoryIcon';

interface DashboardProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  userMode?: string;
  children?: React.ReactNode;
}

export function Dashboard({ onNavigate, currentPage, userMode = 'student', children }: DashboardProps) {
  const isEmployee = userMode === 'employee';

  // Theme colors based on mode
  const theme = isEmployee
    ? {
      gradient: 'from-blue-500 to-cyan-500',
      gradientHover: 'from-blue-600 to-cyan-600',
      sidebarActive: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg',
      textGradient: 'from-blue-600 to-cyan-600',
      bgGradient: 'from-blue-50 via-cyan-50 to-teal-50',
      label: 'CampusSpend Pro',
    }
    : {
      gradient: 'from-purple-500 to-blue-500',
      gradientHover: 'from-purple-600 to-blue-600',
      sidebarActive: 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg',
      textGradient: 'from-purple-600 to-blue-600',
      bgGradient: 'from-purple-50 via-blue-50 to-green-50',
      label: 'CampusSpend',
    };
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ✅ State for Real Data
  const [transactions, setTransactions] = useState<any[]>([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [duesData, setDuesData] = useState<any[]>([]);
  const [salaryData, setSalaryData] = useState<any>(null);
  const [remindersData, setRemindersData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // ✅ Get user name on mount
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.name) setUserName(user.name);
        if (user.email) setUserEmail(user.email);
      } catch (e) { console.error("Error parsing user from localStorage", e); }
    }
    
    // Also fetch fresh profile to stay in sync
    getUserProfile().then(res => {
      if (res.data) {
        if (res.data.name) setUserName(res.data.name);
        if (res.data.email) setUserEmail(res.data.email);
        // Sync back to localStorage
        const existing = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem("user", JSON.stringify({ ...existing, ...res.data }));
      }
    }).catch(err => console.error("Error fetching user profile", err));
  }, []);

  useEffect(() => {
    const isDemo = localStorage.getItem("isDemo") === "true";
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : {};
    const tutorialDone = user.tutorialCompleted || sessionStorage.getItem("tutorial_completed") === "true";
    
    if (!tutorialDone && currentPage === 'dashboard' && (isDemo || user._id)) {
      setShowTutorial(true);
    }
  }, [currentPage, userName]);

  // ✅ Fetch Transactions AND Budgets
  useEffect(() => {
    const loadData = async () => {
      if (currentPage === 'dashboard') {
        try {
          setLoading(true);

          // 1. Fetch Transactions
          const transRes = await getTransactions();
          const transData = Array.isArray(transRes.data) ? transRes.data : [];
          const sorted = transData.sort((a: any, b: any) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setTransactions(sorted);

          // 2. Fetch Budgets & Calculate Total
          const budgetRes = await getBudgets();

          // Safety check: ensure budgetRes.data is an array
          const budgetData = Array.isArray(budgetRes.data) ? budgetRes.data : [];
          
          const globalBudget = budgetData.find((b: any) => b.category?.toLowerCase() === "general");
          const total = globalBudget ? (Number(globalBudget.amount) || Number(globalBudget.limit) || 0) : 0;
          setTotalBudget(total);

          // 3. Fetch Dues
          try {
            const duesRes = await getDues();
            setDuesData(Array.isArray(duesRes.data) ? duesRes.data : []);
          } catch { setDuesData([]); }

          // 4. Fetch Salary (Employee Mode)
          if (isEmployee) {
            try {
              const salaryRes = await getSalaries();
              const entries = Array.isArray(salaryRes.data) ? salaryRes.data : [];
              if (entries.length > 0) setSalaryData(entries[0]);
            } catch { setSalaryData(null); }
          }

          // 5. Fetch Reminders
          try {
            const remindersRes = await getReminders();
            const allReminders = Array.isArray(remindersRes.data) ? remindersRes.data : [];
            const upcoming = allReminders
              .filter((r: any) => !r.isPaid)
              .sort((a: any, b: any) => new Date(a.reminderDate).getTime() - new Date(b.reminderDate).getTime())
              .slice(0, 3);
            setRemindersData(upcoming);
          } catch { setRemindersData([]); }

        } catch (error) {
          console.error("Failed to load dashboard data", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [currentPage]);

  // ✅ Fetch Notifications
  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      const data = Array.isArray(res.data) ? res.data : [];
      setNotifications(data);
      setUnreadCount(data.filter((n: any) => !n.is_read).length);
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  };

  useEffect(() => {
    if (currentPage !== 'landing') {
      fetchNotifications();
      // Poll for notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [currentPage]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      fetchNotifications();
    } catch (err) {
      console.error("Error marking notification as read", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      fetchNotifications();
    } catch (err) {
      console.error("Error marking all read", err);
    }
  };

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

  const baseMenuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'transactions', icon: Receipt, label: 'Transactions' },
    { id: 'budgets', icon: Wallet, label: 'Budgets' },
    { id: 'savings', icon: Target, label: 'Savings Goals' },
    { id: 'dues', icon: HandCoins, label: isEmployee ? 'EMI / Loans' : 'Dues' },
    { id: 'reminders', icon: CalendarDays, label: 'Reminders' },
  ];

  const employeeOnlyItems = [
    { id: 'salary', icon: Briefcase, label: 'Salary' },
  ];

  const menuItems = [
    ...baseMenuItems,
    ...(isEmployee ? employeeOnlyItems : []),
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isDemo");
    sessionStorage.removeItem("demo_db");
    sessionStorage.removeItem("tutorial_completed");
    onNavigate('landing');
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bgGradient} dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 transition-colors duration-300`}>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:block fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40 transition-colors duration-300">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 pb-2">
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-10 h-10 bg-gradient-to-br ${theme.gradient} rounded-xl flex items-center justify-center`}>
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <span className={`text-xl font-bold bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>
                {theme.label}
              </span>
            </div>
          </div>

          {/* Scrollable Nav */}
          <nav id="tutorial-nav" className="flex-1 overflow-y-auto px-6 space-y-2 scrollbar-hide">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ 
                    scale: 1.02, 
                    x: 8,
                    backgroundColor: isActive ? undefined : "rgba(0,0,0,0.05)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group ${isActive
                    ? theme.sidebarActive
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute left-0 w-1 h-6 bg-white rounded-r-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  )}
                  <Icon className={`w-5 h-5 transition-transform group-hover:rotate-12 ${isActive ? 'text-white' : ''}`} />
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              );
            })}
          </nav>


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
                  const isActive = currentPage === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        onNavigate(item.id);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                        ? theme.sidebarActive
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </motion.button>
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
        <header id="tutorial-header" className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 transition-colors">
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
              {localStorage.getItem("isDemo") === "true" && (
                <Badge variant="outline" className="hidden md:flex items-center gap-1.5 border-orange-200 bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">
                  <Sparkles className="w-3.5 h-3.5" />
                  Demo Mode
                </Badge>
              )}

              <div className="relative">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="relative dark:text-gray-400 dark:hover:bg-gray-800"
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </motion.div>

                {/* Notifications Dropdown */}
                {isNotificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
                      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/50">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
                          {unreadCount > 0 && (
                            <Badge className="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 border-0">
                              {unreadCount} New
                            </Badge>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button 
                            onClick={handleMarkAllRead}
                            className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>

                      <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
                        {notifications.length > 0 ? (
                          notifications.map((n) => (
                            <div 
                              key={n.id}
                              onClick={() => !n.is_read && handleMarkAsRead(n.id)}
                              className={`p-4 border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer relative ${!n.is_read ? 'bg-purple-50/30 dark:bg-purple-900/10' : ''}`}
                            >
                              {!n.is_read && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500"></div>
                              )}
                              <div className="flex gap-3">
                                <div className={`mt-1 shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                                  n.type === 'success' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                                  n.type === 'warning' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' :
                                  n.type === 'error' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                                  'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                }`}>
                                  {n.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> :
                                   n.type === 'warning' ? <AlertCircle className="w-4 h-4" /> :
                                   n.type === 'error' ? <X className="w-4 h-4" /> :
                                   <Info className="w-4 h-4" />}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <p className={`text-sm font-bold ${!n.is_read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                      {n.title}
                                    </p>
                                    <span className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-2">
                                    {n.message}
                                  </p>
                                  {n.email_sent && (
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">
                                      <Mail className="w-3 h-3" />
                                      Email Sent
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-12 text-center">
                            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Bell className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                            </div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No notifications yet</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">We'll notify you here</p>
                          </div>
                        )}
                      </div>

                      {notifications.length > 0 && (
                        <div className="p-3 bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 text-center">
                          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                            Showing last 50 notifications
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="relative group">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 transition-all">
                    <div className={`w-full h-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-white`}>
                      <User className="w-5 h-5" />
                    </div>
                  </Button>
                </motion.div>

                {/* Profile Dropdown on Hover */}
                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="w-64 bg-white dark:bg-gray-800 rounded-[1.5rem] shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden transform origin-top-right">
                    {/* Header with User Info */}
                    <div className="p-4 bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-white text-lg font-bold shadow-md`}>
                          {userName ? userName.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                            {userName || "User"}
                          </p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                            {userEmail || "Not signed in"}
                          </p>
                        </div>
                      </div>
                      
                      <Badge className={`rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-wider border-0 text-white bg-gradient-to-r ${theme.gradient} shadow-sm`}>
                        {isEmployee ? "Employee" : "Student"}
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className="p-2">
                      <button 
                        onClick={() => onNavigate('settings')}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-xl transition-all group/item"
                      >
                        <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover/item:bg-white dark:group-hover/item:bg-gray-600 transition-colors">
                          <Settings className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                        </div>
                        <span>Account Settings</span>
                      </button>

                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all group/logout"
                      >
                        <div className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-900/30 flex items-center justify-center group-hover/logout:bg-white dark:group-hover/logout:bg-red-800 transition-colors">
                          <LogOut className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                        </div>
                        <span>{localStorage.getItem("isDemo") === "true" ? "Exit" : "Logout"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        {currentPage === 'dashboard' && (
          <main className="p-4 lg:p-8 pb-24 lg:pb-8">
            {/* Balance Cards */}
            <div id="tutorial-balance" className="grid md:grid-cols-3 gap-6 mb-8">
              <motion.div whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 300 }}>
                <Card className={`p-6 bg-gradient-to-br ${theme.gradient} text-white border-0 shadow-xl h-full`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-white/70 text-sm">{isEmployee ? "Current Balance" : "Available Funds"}</p>
                      <h2 className="text-3xl font-bold mt-2">
                        {loading ? "..." : `${getCurrencySymbol()}${(isEmployee ? balance : budgetRemaining).toLocaleString()}`}
                      </h2>
                    </div>
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Wallet className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4" />
                    <span>{isEmployee ? "Available Funds" : "Based on your monthly budget"}</span>
                  </div>
                </Card>
              </motion.div>

              <motion.div whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 300 }}>
                <Card className="p-6 bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-xl h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-orange-100 text-sm">This Month Spent</p>
                      <h2 className="text-3xl font-bold mt-2">
                        {loading ? "..." : `${getCurrencySymbol()}${monthlySpent.toLocaleString()}`}
                      </h2>
                    </div>
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <TrendingDown className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span>of {getCurrencySymbol()}{totalBudget.toLocaleString()} budget</span>
                  </div>
                </Card>
              </motion.div>

              <motion.div whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 300 }}>
                <Card className="p-6 bg-gradient-to-br from-green-500 to-teal-500 text-white border-0 shadow-xl h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-green-100 text-sm">{isEmployee ? "Budget Remaining" : "Monthly Budget"}</p>
                      <h2 className="text-3xl font-bold mt-2">
                        {loading ? "..." : `${getCurrencySymbol()}${(isEmployee ? budgetRemaining : totalBudget).toLocaleString()}`}
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
              </motion.div>
            </div>

            {/* Spend Mode & Pending Dues */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* Spend Mode */}
              <Card className="p-6 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border-0 shadow-lg">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">Spend Mode</h3>
                <div className="grid grid-cols-3 gap-3">
                  <motion.div whileHover={{ scale: 1.05 }} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 transition-colors hover:border-blue-200 dark:hover:border-blue-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-blue-500 uppercase">UPI</span>
                      <Smartphone className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{getCurrencySymbol()}{spendByPayment.upi.toLocaleString()}</p>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 transition-colors hover:border-green-200 dark:hover:border-green-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-green-500 uppercase">Cash</span>
                      <Banknote className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{getCurrencySymbol()}{spendByPayment.cash.toLocaleString()}</p>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 transition-colors hover:border-purple-200 dark:hover:border-purple-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-bold uppercase ${isEmployee ? 'text-cyan-500' : 'text-purple-500'}`}>Card</span>
                      <CreditCard className={`w-5 h-5 ${isEmployee ? 'text-cyan-500' : 'text-purple-500'}`} />
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{getCurrencySymbol()}{spendByPayment.card.toLocaleString()}</p>
                  </motion.div>
                </div>
              </Card>

              {/* Pending Dues */}
              <Card className="p-6 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border-0 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <HandCoins className={`w-5 h-5 ${isEmployee ? 'text-blue-500' : 'text-purple-500'}`} />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{isEmployee ? 'Active EMIs' : 'Pending Dues'}</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`${isEmployee ? 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300' : 'text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300'}`}
                    onClick={() => onNavigate('dues')}
                  >
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">You'll Get</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{getCurrencySymbol()}{duesSummary.youllGet.toLocaleString()}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">You Owe</p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">{getCurrencySymbol()}{duesSummary.youOwe.toLocaleString()}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Employee Mode: Salary & Tax Summary */}
            {isEmployee && salaryData && (
              <div className="grid lg:grid-cols-2 gap-6 mb-8">
                <Card className="p-6 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border-0 shadow-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="w-5 h-5 text-blue-500" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Salary Overview</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Gross Salary</p>
                      <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{getCurrencySymbol()}{salaryData.grossSalary?.toLocaleString()}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Net Salary</p>
                      <p className="text-xl font-bold text-green-600 dark:text-green-400">{getCurrencySymbol()}{salaryData.netSalary?.toLocaleString()}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border-0 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-blue-500" />
                      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Tax & Deductions</h3>
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400" onClick={() => onNavigate('salary')}>
                      View All <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600">
                      <p className="text-xs text-gray-500 dark:text-gray-400">PF</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{getCurrencySymbol()}{salaryData.pf?.toLocaleString()}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Tax</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{getCurrencySymbol()}{salaryData.tax?.toLocaleString()}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Insurance</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{getCurrencySymbol()}{salaryData.insurance?.toLocaleString()}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Other</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{getCurrencySymbol()}{salaryData.otherDeductions?.toLocaleString()}</p>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Charts */}
            <div id="tutorial-charts" className="grid lg:grid-cols-2 gap-6 mb-8">
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
                      stroke={isEmployee ? '#3b82f6' : '#8b5cf6'}
                      strokeWidth={3}
                      dot={{ fill: isEmployee ? '#3b82f6' : '#8b5cf6', r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* ✅ Upcoming Reminders Widget */}
            <Card id="tutorial-reminders" className="p-6 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border-0 shadow-lg mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CalendarDays className={`w-5 h-5 ${isEmployee ? 'text-blue-500' : 'text-purple-500'}`} />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Upcoming Reminders</h3>
                </div>
                <Button
                  variant="ghost" size="sm"
                  className={`${isEmployee ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'}`}
                  onClick={() => onNavigate('reminders')}
                >
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <div className="space-y-3">
                {remindersData.length > 0 ? (
                  remindersData.map((r: any) => {
                    const isOverdue = new Date(r.reminderDate) < new Date();
                    return (
                      <div key={r._id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isOverdue ? 'bg-red-100 dark:bg-red-900/30' : 'bg-purple-100 dark:bg-purple-900/30'}`}>
                            <CalendarDays className={`w-4 h-4 ${isOverdue ? 'text-red-500' : 'text-purple-500'}`} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                              {r.title}
                              {r.isRecurring && <RepeatIcon className="w-3 h-3 text-purple-400" />}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(r.reminderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                              {isOverdue && <span className="text-red-500 ml-1 font-medium">· Overdue</span>}
                            </p>
                          </div>
                        </div>
                        <p className={`font-bold text-base ${isOverdue ? 'text-red-500' : 'text-purple-600 dark:text-purple-400'}`}>
                          {getCurrencySymbol()}{Number(r.amount).toLocaleString()}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-6 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-xl">
                    <p className="text-sm">No upcoming reminders</p>
                    <p className="text-xs mt-1">Set reminders to track your bills</p>
                  </div>
                )}
              </div>
            </Card>

            {/* ✅ RESTORED: Recent Transactions Table */}
            <Card id="tutorial-recent" className="p-6 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border-0 shadow-lg">
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
                        <div className={`w-12 h-12 ${getCategoryColor(transaction.category)} rounded-xl flex items-center justify-center shadow-inner shrink-0`}>
                          <CategoryIcon name={getCategoryIcon(transaction.category)} className="text-white" size={24} />
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
                        {transaction.type === 'expense' ? '-' : '+'}{getCurrencySymbol()}{transaction.amount}
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

      {showTutorial && (
        <TutorialOverlay 
          userMode={userMode} 
          onNavigate={onNavigate}
          onComplete={() => {
            setShowTutorial(false);
            sessionStorage.setItem("tutorial_completed", "true");
            // Also persist to backend for real users or localStorage for demo
            updateProfile({ tutorialCompleted: true }).then(res => {
              if (res.data) {
                const existing = JSON.parse(localStorage.getItem("user") || "{}");
                localStorage.setItem("user", JSON.stringify({ ...existing, ...res.data }));
              }
            }).catch(err => console.error("Error updating tutorial status", err));
          }} 
        />
      )}
    </div>
  );
}