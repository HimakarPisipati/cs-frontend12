import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { 
  ArrowLeft, 
  Megaphone, 
  Calendar, 
  ChevronRight, 
  Bell,
  Info,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sun,
  Moon,
  Wallet
} from "lucide-react";
import { getAnnouncements } from "../../api/services";

interface AnnouncementsPageProps {
  onNavigate: (page: string) => void;
  userMode?: string;
}

export function AnnouncementsPage({ onNavigate, userMode = "student" }: AnnouncementsPageProps) {
  const isEmp = userMode === "employee";
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains("dark") ||
      localStorage.getItem("theme") !== "light";
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const { data } = await getAnnouncements();
        // Sort by date descending
        setAnnouncements(data || []);
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Info className={`w-5 h-5 ${isEmp ? 'text-blue-500' : 'text-purple-500'}`} />;
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${isEmp ? 'from-blue-50 via-cyan-50 to-green-50' : 'from-purple-50 via-blue-50 to-green-50'} dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 transition-colors duration-300`}>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onNavigate("settings")}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </Button>
              <div 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => onNavigate("settings")}
              >
                <div className={`w-10 h-10 bg-gradient-to-br ${isEmp ? 'from-blue-500 to-cyan-500' : 'from-purple-500 to-blue-500'} rounded-xl flex items-center justify-center`}>
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <span className={`text-xl font-bold bg-gradient-to-r ${isEmp ? 'from-blue-600 to-cyan-600' : 'from-purple-600 to-blue-600'} bg-clip-text text-transparent`}>
                  {isEmp ? 'CampusSpend Pro' : 'CampusSpend'}
                </span>
              </div>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-32">
        {/* Header */}
        <div className="mb-12 text-center relative">
          <div className={`absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 ${isEmp ? 'bg-blue-500/10' : 'bg-purple-500/10'} rounded-full blur-3xl`} />
          <div className={`w-16 h-16 ${isEmp ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'} rounded-2xl flex items-center justify-center mx-auto mb-6 relative z-10`}>
            <Megaphone className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Community Announcements</h1>
          <p className="text-gray-600 dark:text-gray-400">Stay updated with the latest news and platform updates</p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {loading ? (
            <div className="py-20 flex justify-center">
              <div className={`w-10 h-10 border-4 ${isEmp ? 'border-blue-500/20 border-t-blue-500' : 'border-purple-500/20 border-t-purple-500'} rounded-full animate-spin`} />
            </div>
          ) : announcements.length === 0 ? (
            <Card className="p-12 text-center border-0 shadow-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                <Bell className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No announcements yet</h3>
              <p className="text-gray-600 dark:text-gray-400">Check back later for important updates from the team.</p>
            </Card>
          ) : (
            announcements.map((item, idx) => (
              <Card key={idx} className="overflow-hidden border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-md hover:shadow-xl transition-all group">
                <div className="flex">
                  <div className={`w-2 shrink-0 ${
                    item.type === 'warning' ? 'bg-orange-500' :
                    item.type === 'error' ? 'bg-red-500' :
                    item.type === 'success' ? 'bg-green-500' :
                    (isEmp ? 'bg-blue-500' : 'bg-purple-500')
                  }`} />
                  <div className="p-6 w-full">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          item.type === 'warning' ? 'bg-orange-50 dark:bg-orange-900/20' :
                          item.type === 'error' ? 'bg-red-50 dark:bg-red-900/20' :
                          item.type === 'success' ? 'bg-green-50 dark:bg-green-900/20' :
                          (isEmp ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-purple-50 dark:bg-purple-900/20')
                        }`}>
                          {getTypeIcon(item.type)}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(item.created_at).toLocaleDateString(undefined, {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                            <span className="capitalize">{item.type || 'Announcement'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {item.message}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>© 2026 CampusSpend Community Updates</p>
        </div>
      </div>
    </div>
  );
}
