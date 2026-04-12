import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Wallet, Mail, Lock, ArrowLeft, GraduationCap, Briefcase } from "lucide-react";
import { login } from "../../api/services";

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const landingMode = (localStorage.getItem('landingMode') || 'student') as 'student' | 'employee';
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedMode, setSelectedMode] = useState<'student' | 'employee'>(landingMode);
  const [loading, setLoading] = useState(false);

  const isEmp = selectedMode === 'employee';
  const gradient = isEmp ? 'from-blue-600 to-cyan-600' : 'from-purple-600 to-blue-600';
  const gradientHover = isEmp ? 'hover:from-blue-700 hover:to-cyan-700' : 'hover:from-purple-700 hover:to-blue-700';
  const iconGradient = isEmp ? 'from-blue-500 to-cyan-500' : 'from-purple-500 to-blue-500';
  const accentText = isEmp ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400';
  const accentHover = isEmp ? 'hover:text-blue-700 dark:hover:text-blue-300' : 'hover:text-purple-700 dark:hover:text-purple-300';
  const brandName = isEmp ? 'CampusSpend Pro' : 'CampusSpend';

  useEffect(() => {
    // Check if we arrived here from "Try Demo" button
    const isDemo = localStorage.getItem("demoLogin") === "true";
    if (isDemo) {
      localStorage.removeItem("demoLogin");
      handleDemoLogin();
    }
  }, []);

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      const demoEmail = "demo@campispend.com";
      const demoPassword = "demo1234";
      const res = await login({ email: demoEmail, password: demoPassword, user_mode: selectedMode });

      // 🔥 Save token and user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userMode", res.data.userMode || "student");
      localStorage.setItem("user", JSON.stringify({
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        userMode: res.data.userMode || "student",
      }));

      onNavigate("dashboard");
    } catch (err: any) {
      console.error("Demo login failed:", err);
      // Fallback: stay on login page but reset loading
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await login({ email, password, user_mode: selectedMode });

      // 🔥 Save token and user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userMode", res.data.userMode || "student");
      localStorage.setItem("user", JSON.stringify({
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        phone: res.data.phone,
        userMode: res.data.userMode || "student",
      }));

      onNavigate("dashboard");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${isEmp ? 'from-blue-50 via-cyan-50 to-green-50' : 'from-purple-50 via-blue-50 to-green-50'} dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 flex items-center justify-center p-4 transition-colors`}>
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-start">
        {/* Left Side */}
        <div className="hidden lg:block">
          <div className="mb-8">
            <Button variant="ghost" onClick={() => onNavigate("landing")} className="mb-4 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome back to
              <span className={`block bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                {brandName}
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              {isEmp
                ? 'Continue managing your salary, EMIs, and professional finances.'
                : 'Continue tracking your expenses and building better money habits.'
              }
            </p>
          </div>

          <img
            src="https://images.unsplash.com/photo-1633158829556-6ea20ad39b4f"
            alt={isEmp ? "Professional finance" : "Student budgeting"}
            className="rounded-3xl shadow-2xl"
          />
        </div>

        {/* Login Form */}
        <Card className="p-8 lg:p-12 bg-white/80 dark:bg-gray-800/90 backdrop-blur-lg border-0 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className={`w-12 h-12 bg-gradient-to-br ${iconGradient} rounded-xl flex items-center justify-center`}>
              <Wallet className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sign in</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">to continue to {brandName}</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Mode Selection */}
            <div className="space-y-2">
              <Label className="dark:text-gray-300">Sign in as</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedMode("student")}
                  className={`p-3 rounded-xl border-2 transition-all flex items-center gap-2 justify-center ${selectedMode === "student"
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                    }`}
                >
                  <GraduationCap className={`w-5 h-5 ${selectedMode === "student" ? "text-purple-600 dark:text-purple-400" : "text-gray-400"}`} />
                  <span className={`text-sm font-semibold ${selectedMode === "student" ? "text-purple-700 dark:text-purple-300" : "text-gray-500 dark:text-gray-400"}`}>Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMode("employee")}
                  className={`p-3 rounded-xl border-2 transition-all flex items-center gap-2 justify-center ${selectedMode === "employee"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                    }`}
                >
                  <Briefcase className={`w-5 h-5 ${selectedMode === "employee" ? "text-blue-600 dark:text-blue-400" : "text-gray-400"}`} />
                  <span className={`text-sm font-semibold ${selectedMode === "employee" ? "text-blue-700 dark:text-blue-300" : "text-gray-500 dark:text-gray-400"}`}>Employee</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="dark:text-gray-300">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder={isEmp ? "name@company.com" : "student@college.edu"}
                  className="pl-10 h-12 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="dark:text-gray-300">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-12 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => onNavigate("forgot-password")}
                className={`text-sm ${accentText} ${accentHover} font-medium`}
              >
                Forgot Password?
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className={`w-full h-12 bg-gradient-to-r ${gradient} ${gradientHover}`}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <button
              onClick={() => onNavigate("signup")}
              className={`${accentText} ${accentHover} font-semibold`}
            >
              Sign up
            </button>
          </p>
        </Card>
      </div>
    </div>
  );
}
