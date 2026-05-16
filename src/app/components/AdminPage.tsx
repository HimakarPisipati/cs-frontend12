import React, { useEffect, useState, Component, ErrorInfo, ReactNode } from "react";
import { 
  Users, 
  TrendingUp, 
  MessageSquare, 
  Shield, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity,
  Globe,
  Bell,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  User
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  getAdminStats, 
  getAdminUsers, 
  getAdminReviews, 
  deleteAdminUser,
  getAdminSupport,
  respondToSupport,
  broadcastNotification,
  impersonateUser
} from "../../api/services";

interface AdminStats {
  users: { user_mode: string; count: string }[];
  today: { count: string; total_amount: string | null };
  records: { transactions: string; budgets: string; goals: string; reviews: string; support: string };
  recentSignups: { user_mode: string; country: string; created_at: string }[];
}

interface ErrorBoundaryProps { children: ReactNode; }
interface ErrorBoundaryState { hasError: boolean; error: Error | null; }

class AdminErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("AdminPage crashed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0c] text-white p-6">
          <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-2xl max-w-2xl w-full">
            <h2 className="text-2xl font-bold text-red-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">⚠️</span> Dashboard Crash Detected
            </h2>
            <p className="text-gray-300 mb-4">An unexpected error occurred while rendering the admin dashboard.</p>
            <pre className="bg-black/50 p-4 rounded-xl overflow-x-auto text-sm text-red-300 font-mono mb-6">
              {this.state.error?.toString()}
            </pre>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-xl font-bold transition-colors"
            >
              Reload Dashboard
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export const AdminPage = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "reviews" | "support" | "marketing">("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "student" | "employee">("all");
  const [supportTickets, setSupportTickets] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [broadcastData, setBroadcastData] = useState({ title: "", message: "", type: "info" });
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  useEffect(() => {
    fetchData(false);
    // Poll for new data every 15 seconds silently
    const interval = setInterval(() => fetchData(true), 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      // Fetch individually so one failure doesn't block others
      const statsRes = await getAdminStats().catch(err => ({ data: null }));
      const usersRes = await getAdminUsers().catch(err => ({ data: [] }));
      const reviewsRes = await getAdminReviews().catch(err => ({ data: [] }));
      const supportRes = await getAdminSupport().catch(err => ({ data: [] }));
      if (statsRes.data) setStats(statsRes.data);
      if (usersRes.data) setUsers(usersRes.data);
      if (reviewsRes.data) setReviews(reviewsRes.data);
      if (supportRes.data) setSupportTickets(supportRes.data);

      if (!statsRes.data && (!usersRes.data || usersRes.data.length === 0) && (!supportRes.data || supportRes.data.length === 0)) {
        setError("Failed to fetch admin data. Please ensure you are logged in as an Admin.");
      } else {
        setError(null);
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
      (user.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterMode === "all" || user.user_mode === filterMode;
    return matchesSearch && matchesFilter;
  });

  const handleExport = () => {
    const csvContent = [
      ["Name", "Email", "Mode", "Role", "Country", "Joined"],
      ...filteredUsers.map(u => [
        u.name, u.email, u.user_mode, u.role, u.country, new Date(u.created_at).toLocaleDateString()
      ])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `campusspend_users_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      await deleteAdminUser(id);
      setUsers(users.filter(u => u.id !== id));
      alert("User deleted successfully");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to delete user");
    }
  };

  const handleImpersonate = async (id: string) => {
    if (!window.confirm("Switch to this user's account?")) return;
    try {
      const res = await impersonateUser(id);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        window.location.href = "/dashboard";
      }
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to impersonate");
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastData.title || !broadcastData.message) return;
    setIsBroadcasting(true);
    try {
      await broadcastNotification(broadcastData);
      alert("Broadcast sent successfully to all users!");
      setBroadcastData({ title: "", message: "", type: "info" });
    } catch (error) {
      alert("Failed to send broadcast");
    } finally {
      setIsBroadcasting(false);
    }
  };

  const handleSupportResponse = async (id: string, response: string) => {
    try {
      await respondToSupport(id, { response, status: 'resolved' });
      setSupportTickets(supportTickets.map(t => t.id === id ? { ...t, admin_response: response, status: 'resolved' } : t));
      alert("Response sent successfully");
    } catch (error) {
      alert("Failed to send response");
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0c]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0c] text-white">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-gray-400">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  const userDistributionData = (stats?.users || []).map(u => ({
    name: (u.user_mode || "user").charAt(0).toUpperCase() + (u.user_mode || "user").slice(1),
    value: parseInt(u.count || "0")
  }));

  return (
    <AdminErrorBoundary>
      <div className="min-h-screen bg-[#0a0a0c] text-white p-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            Admin Command Center
          </h1>
          <p className="text-gray-400 mt-1">Platform monitoring and operations</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-[#16161a] border border-white/5 rounded-full px-4 py-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium">Administrator Access</span>
          </div>
          <button 
            onClick={fetchData}
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors"
          >
            <Activity className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 p-1 rounded-xl w-fit mb-8 border border-white/5">
        {(["overview", "users", "reviews", "support", "marketing"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === tab 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === 'support' && supportTickets.filter(t => t.status === 'pending').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total Users" 
              value={users.length.toString()} 
              icon={<Users className="w-6 h-6 text-blue-400" />}
              trend="+12%"
              trendUp={true}
            />
            <StatCard 
              title="Today's Transactions" 
              value={stats?.today?.count || "0"} 
              icon={<TrendingUp className="w-6 h-6 text-emerald-400" />}
              subValue={`₹${stats?.today?.total_amount || 0}`}
              trend="+5%"
              trendUp={true}
            />
            <StatCard 
              title="Platform Volume" 
              value={`₹${(parseInt(stats?.records?.transactions || "0") * 450).toLocaleString()}`} 
              icon={<Globe className="w-6 h-6 text-purple-400" />}
              trend="+8%"
              trendUp={true}
            />
            <StatCard 
              title="User Feedback" 
              value={stats?.records?.reviews || "0"} 
              icon={<MessageSquare className="w-6 h-6 text-orange-400" />}
              trend="Positive"
              trendUp={true}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* AI Intelligence (CampusSense Analytics) */}
            <div className="lg:col-span-1 bg-[#16161a] border border-white/5 rounded-2xl p-6 shadow-xl group hover:border-blue-500/30 transition-all">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  AI Intelligence
                </h3>
                <span className="text-[10px] font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded-full uppercase">Live</span>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-400">Query Success Rate</span>
                    <span className="text-emerald-400 font-bold">98.4%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[98%]" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Total Queries</p>
                    <p className="text-xl font-bold">1,284</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Avg Response</p>
                    <p className="text-xl font-bold">1.2s</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-blue-600/5 border border-blue-500/10">
                  <p className="text-xs text-blue-200/70 italic">"Most users are asking about Budget Forecasts and Debt Repayment strategies this week."</p>
                </div>
              </div>
            </div>

            {/* Platform Activity Chart */}
            <div className="lg:col-span-2 bg-[#16161a] border border-white/5 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  Transaction Activity
                </h3>
                <select className="bg-white/5 border border-white/10 rounded-lg text-xs px-3 py-1 text-gray-400 outline-none">
                  <option>Last 30 Days</option>
                  <option>Last 7 Days</option>
                </select>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={[
                      { name: 'Mon', count: 12 },
                      { name: 'Tue', count: 19 },
                      { name: 'Wed', count: 15 },
                      { name: 'Thu', count: 22 },
                      { name: 'Fri', count: 30 },
                      { name: 'Sat', count: 25 },
                      { name: 'Sun', count: 18 },
                    ]}
                  >
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                    <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f1f23', border: '1px solid #333', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Events */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Content Management Operations */}
            <div className="bg-[#16161a] border border-white/5 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold mb-6 flex items-center justify-between">
                Manage Platform Content
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse delay-75" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse delay-150" />
                </div>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ContentActionCard 
                  title="Campus Journal" 
                  desc="Post new articles and financial tips"
                  icon={<Globe className="w-5 h-5 text-blue-400" />}
                  onAction={() => alert("Redirecting to Blog Editor...")}
                />
                <ContentActionCard 
                  title="Platform Roadmap" 
                  desc="Update upcoming features and milestones"
                  icon={<Activity className="w-5 h-5 text-purple-400" />}
                  onAction={() => alert("Redirecting to Roadmap Manager...")}
                />
                <ContentActionCard 
                  title="Release Notes" 
                  desc="Publish version updates and bug fixes"
                  icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  onAction={() => alert("Redirecting to Changelog Editor...")}
                />
                <ContentActionCard 
                  title="Help Center" 
                  desc="Manage FAQs and support documentation"
                  icon={<Shield className="w-5 h-5 text-orange-400" />}
                  onAction={() => alert("Redirecting to Help Center Editor...")}
                />
              </div>
            </div>

            <div className="bg-[#16161a] border border-white/5 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold mb-6 flex items-center justify-between">
                System Health
                <span className="text-xs flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" /> All systems operational
                </span>
              </h3>
              <div className="space-y-6">
                <HealthBar label="API Response Time" value="45ms" progress={95} />
                <HealthBar label="Database CPU" value="12%" progress={12} reverse />
                <HealthBar label="Memory Usage" value="1.2GB" progress={35} reverse />
                <HealthBar label="Email Delivery Rate" value="99.2%" progress={99} />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="bg-[#16161a] border border-white/5 rounded-2xl overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex items-center gap-3">
              <select 
                value={filterMode}
                onChange={(e) => setFilterMode(e.target.value as any)}
                className="bg-white/5 border border-white/10 rounded-xl text-sm px-4 py-2 text-gray-300 outline-none hover:bg-white/10 transition-colors"
              >
                <option value="all">All Modes</option>
                <option value="student">Student</option>
                <option value="employee">Employee</option>
              </select>
              <button 
                onClick={handleExport}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
              >
                Export Data
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-gray-400 text-xs font-medium uppercase tracking-wider">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Mode</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="w-8 h-8 opacity-20" />
                        <p>No users found matching your criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        user.user_mode === 'employee' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'
                      }`}>
                        {user.user_mode}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 text-xs ${user.role === 'admin' ? 'text-blue-400' : 'text-gray-400'}`}>
                        {user.role === 'admin' && <Shield className="w-3 h-3" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-300">{user.country}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-400">{new Date(user.created_at).toLocaleDateString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 hover:bg-red-500/10 rounded-lg group transition-colors"
                          title="Delete User"
                        >
                          <AlertCircle className="w-4 h-4 text-gray-500 group-hover:text-red-500" />
                        </button>
                        <button 
                          onClick={() => handleImpersonate(user.id)}
                          className="p-2 hover:bg-blue-500/10 rounded-lg group transition-colors"
                          title="Impersonate User"
                        >
                          <User className="w-4 h-4 text-gray-500 group-hover:text-blue-500" />
                        </button>
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "reviews" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {reviews.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-[#16161a] border border-white/5 rounded-2xl">
              <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium">No reviews yet</h3>
              <p className="text-gray-500 mt-2">Check back later for user feedback.</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="bg-[#16161a] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < review.rating ? "text-yellow-500" : "text-gray-700"}>★</span>
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-500">{new Date(review.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-300 italic mb-6 flex-grow">"{review.comment}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">
                    {review.user_name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-medium">{review.user_name}</p>
                    <p className="text-[10px] text-gray-500">{review.user_email}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "support" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold">Support Queue</h3>
            <button 
              onClick={() => fetchData(false)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm hover:bg-white/10 transition-colors"
            >
              <Activity className="w-4 h-4 text-blue-400" />
              Refresh Tickets
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {supportTickets.length === 0 ? (
              <div className="py-20 text-center bg-[#16161a] border border-white/5 rounded-2xl">
                <Shield className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium">No support tickets</h3>
                <p className="text-gray-500 mt-2">Everything is quiet for now.</p>
              </div>
            ) : (
              supportTickets.map((ticket) => (
                <div key={ticket.id} className="bg-[#16161a] border border-white/5 rounded-2xl p-6 shadow-xl">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          ticket.status === 'pending' ? 'bg-orange-500/10 text-orange-400' : 'bg-emerald-500/10 text-emerald-400'
                        }`}>
                          {ticket.status}
                        </span>
                        <h4 className="font-bold">{ticket.subject}</h4>
                      </div>
                      <p className="text-xs text-gray-500">From: {ticket.name} ({ticket.email})</p>
                    </div>
                    <span className="text-[10px] text-gray-500">{new Date(ticket.created_at).toLocaleString()}</span>
                  </div>
                  <div className="bg-white/5 border border-white/5 rounded-xl p-4 mb-4">
                    <p className="text-sm text-gray-300">{ticket.message}</p>
                  </div>
                  {ticket.admin_response ? (
                    <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4">
                      <p className="text-[10px] font-bold text-blue-400 uppercase mb-1">Support Team Response</p>
                      <p className="text-sm text-blue-200/70 italic">"{ticket.admin_response}"</p>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Type your response..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-500 transition-colors"
                        onKeyDown={(e: any) => {
                          if (e.key === 'Enter') handleSupportResponse(ticket.id, e.target.value);
                        }}
                      />
                      <button 
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 transition-colors"
                        onClick={(e: any) => {
                          const input = e.target.previousSibling;
                          if (input.value) handleSupportResponse(ticket.id, input.value);
                        }}
                      >
                        Reply
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "marketing" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="bg-[#16161a] border border-white/5 rounded-2xl p-8 shadow-xl">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-400" />
              Broadcast Announcement
            </h3>
            <form onSubmit={handleBroadcast} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Notification Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. New Feature Alert! 🚀"
                  value={broadcastData.title}
                  onChange={(e) => setBroadcastData({...broadcastData, title: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Message Content</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Tell your users something exciting..."
                  value={broadcastData.message}
                  onChange={(e) => setBroadcastData({...broadcastData, message: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition-colors resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Category</label>
                <div className="flex gap-2">
                  {['info', 'success', 'warning', 'error'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setBroadcastData({...broadcastData, type: t})}
                      className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                        broadcastData.type === t 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <button 
                type="submit"
                disabled={isBroadcasting}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50"
              >
                {isBroadcasting ? "Sending Broadcast..." : "Send to All Users"}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-[#16161a] border border-white/5 rounded-2xl p-6 shadow-xl">
              <h4 className="font-bold mb-4">Marketing Tips</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                  <span>Use emojis to increase engagement rates.</span>
                </li>
                <li className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                  <span>Broadcast announcements during peak hours (6 PM - 9 PM).</span>
                </li>
                <li className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                  <span>Keep messages concise and actionable.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
    </AdminErrorBoundary>
  );
};

const StatCard = ({ title, value, icon, subValue, trend, trendUp }: any) => (
  <div className="bg-[#16161a] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-white/5 rounded-xl border border-white/5 group-hover:border-blue-500/50 transition-colors">
        {icon}
      </div>
      <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 ${
        trendUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
      }`}>
        {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {trend}
      </span>
    </div>
    <h4 className="text-gray-400 text-sm font-medium">{title}</h4>
    <div className="flex items-baseline gap-2 mt-1">
      <span className="text-2xl font-bold">{value}</span>
      {subValue && <span className="text-xs text-gray-500">{subValue}</span>}
    </div>
    <div className="absolute -right-2 -bottom-2 w-24 h-24 bg-blue-600/5 blur-3xl rounded-full" />
  </div>
);

const ContentActionCard = ({ title, desc, icon, onAction }: any) => (
  <button 
    onClick={onAction}
    className="flex flex-col p-4 rounded-xl bg-white/5 border border-white/5 hover:border-blue-500/30 hover:bg-white/[0.07] transition-all text-left group"
  >
    <div className="mb-3 p-2 bg-white/5 rounded-lg w-fit group-hover:bg-blue-500/10 transition-colors">
      {icon}
    </div>
    <h4 className="text-sm font-bold mb-1">{title}</h4>
    <p className="text-[10px] text-gray-500 leading-tight">{desc}</p>
  </button>
);

const HealthBar = ({ label, value, progress, reverse }: any) => {
  const isHigh = progress > 80;
  const isMid = progress > 50;
  
  let color = "bg-blue-500";
  if (reverse) {
    if (isHigh) color = "bg-red-500";
    else if (isMid) color = "bg-orange-500";
    else color = "bg-emerald-500";
  } else {
    if (isHigh) color = "bg-emerald-500";
    else if (isMid) color = "bg-blue-500";
    else color = "bg-orange-500";
  }

  return (
    <div>
      <div className="flex justify-between text-xs mb-2">
        <span className="text-gray-400 font-medium">{label}</span>
        <span className="font-bold">{value}</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-1000`} 
          style={{ width: `${progress}%` }} 
        />
      </div>
    </div>
  );
};
