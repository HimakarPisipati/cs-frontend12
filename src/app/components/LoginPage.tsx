import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Wallet, Mail, Lock, ArrowLeft, GraduationCap, Briefcase, Coins, Sparkles, TrendingUp } from "lucide-react";
import { login, adminVerifyOtp } from "../../api/services";
import { motion, AnimatePresence } from "motion/react";

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const landingMode = (localStorage.getItem('landingMode') || 'student') as 'student' | 'employee';
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedMode, setSelectedMode] = useState<'student' | 'employee'>(landingMode);
  const [loading, setLoading] = useState(false);
  const [showAdminOTP, setShowAdminOTP] = useState(false);
  const [adminOTP, setAdminOTP] = useState("");

  const isEmp = selectedMode === 'employee';
  const gradient = isEmp ? 'from-blue-600 to-cyan-600' : 'from-purple-600 to-blue-600';
  const gradientHover = isEmp ? 'hover:from-blue-700 hover:to-cyan-700' : 'hover:from-purple-700 hover:to-blue-700';
  const iconGradient = isEmp ? 'from-blue-500 to-cyan-500' : 'from-purple-500 to-blue-500';
  const accentText = isEmp ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400';
  const accentHover = isEmp ? 'hover:text-blue-700 dark:hover:text-blue-300' : 'hover:text-purple-700 dark:hover:text-purple-300';
  const brandName = isEmp ? 'CampusSpend Pro' : 'CampusSpend';





  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await login({ email, password, user_mode: selectedMode });

      if (res.data.requiresAdminOTP) {
        setShowAdminOTP(true);
        setLoading(false);
        return;
      }

      // 🔥 Save token and user
      saveUserData(res.data);
      onNavigate(localStorage.getItem("pendingAction") === "writeReview" ? "landing" : "dashboard");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminOTPVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await adminVerifyOtp({ email, otp: adminOTP });
      saveUserData(res.data);
      onNavigate("dashboard");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Invalid Admin OTP ❌");
    } finally {
      setLoading(false);
    }
  };

  const saveUserData = (data: any) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("userMode", data.userMode || "student");
    localStorage.setItem("user", JSON.stringify({
      _id: data._id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      userMode: data.userMode || "student",
      tutorialCompleted: data.tutorialCompleted || false,
      role: data.role || "user"
    }));
  };


  return (
    <div className={`min-h-screen relative overflow-hidden bg-gradient-to-br ${isEmp ? 'from-blue-50 via-cyan-50 to-green-50' : 'from-purple-50 via-blue-50 to-green-50'} dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 flex items-start justify-center p-4 pt-20 transition-colors duration-500`}>
      
      {/* Back Button - Positioned in the absolute corner */}
      <div className="absolute top-6 left-6 z-50">
        <Button 
          variant="ghost" 
          onClick={() => onNavigate("landing")} 
          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800/50 group transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Button>
      </div>

      {/* Background Animated Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0.05, 0.1, 0.05],
              scale: [1, 1.2, 1],
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
            }}
            transition={{ 
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            {i % 3 === 0 ? <Coins className={`w-32 h-32 ${accentText}`} /> : 
             i % 3 === 1 ? <Sparkles className={`w-24 h-24 ${accentText}`} /> : 
             <TrendingUp className={`w-40 h-40 ${accentText}`} />}
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 lg:items-start relative z-10"
      >


        {/* Left Side */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="hidden lg:block"
        >
          <div className="mb-8">
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

          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1633158829556-6ea20ad39b4f"
              alt={isEmp ? "Professional finance" : "Student budgeting"}
              className="rounded-[2.5rem] shadow-2xl border-4 border-white/50 dark:border-gray-700/50"
            />
            <div className={`absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br ${gradient} rounded-3xl blur-2xl opacity-40 animate-pulse`}></div>
          </motion.div>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Card className="p-10 lg:p-14 bg-white/70 dark:bg-gray-800/80 backdrop-blur-2xl border border-white/20 dark:border-gray-700/30 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] rounded-[2rem]">
            <div className="flex items-center gap-4 mb-10">
              <motion.div 
                whileHover={{ rotate: 10, scale: 1.1 }}
                className={`w-14 h-14 bg-gradient-to-br ${iconGradient} rounded-2xl flex items-center justify-center shadow-lg`}
              >
                <Wallet className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sign in</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">to continue to {brandName}</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!showAdminOTP ? (
                <motion.form 
                  key="login-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleLogin} 
                  className="space-y-6"
                >
                  {/* Mode Selection */}
                  <div className="space-y-3">
                    <Label className="dark:text-gray-300 font-semibold ml-1">Sign in as</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => setSelectedMode("student")}
                        className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 justify-center ${selectedMode === "student"
                            ? "border-purple-500 bg-purple-50/50 dark:bg-purple-900/30 ring-4 ring-purple-100 dark:ring-purple-900/20"
                            : "border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 bg-gray-50/30 dark:bg-gray-800/50"
                          }`}
                      >
                        <GraduationCap className={`w-6 h-6 ${selectedMode === "student" ? "text-purple-600 dark:text-purple-400" : "text-gray-400"}`} />
                        <span className={`font-bold ${selectedMode === "student" ? "text-purple-700 dark:text-purple-300" : "text-gray-500 dark:text-gray-400"}`}>Student</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => setSelectedMode("employee")}
                        className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 justify-center ${selectedMode === "employee"
                            ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/30 ring-4 ring-blue-100 dark:ring-blue-900/20"
                            : "border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 bg-gray-50/30 dark:bg-gray-800/50"
                          }`}
                      >
                        <Briefcase className={`w-6 h-6 ${selectedMode === "employee" ? "text-blue-600 dark:text-blue-400" : "text-gray-400"}`} />
                        <span className={`font-bold ${selectedMode === "employee" ? "text-blue-700 dark:text-blue-300" : "text-gray-500 dark:text-gray-400"}`}>Employee</span>
                      </motion.button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="dark:text-gray-300 font-semibold ml-1">Email</Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                      <Input
                        id="email"
                        type="email"
                        placeholder={isEmp ? "name@company.com" : "student@college.edu"}
                        className="pl-12 h-14 rounded-2xl dark:bg-gray-700/50 dark:text-white dark:border-gray-600 focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/20 transition-all"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="dark:text-gray-300 font-semibold ml-1">Password</Label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-12 h-14 rounded-2xl dark:bg-gray-700/50 dark:text-white dark:border-gray-600 focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/20 transition-all"
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
                      className={`text-sm ${accentText} ${accentHover} font-bold hover:underline underline-offset-4`}
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Button
                      type="submit"
                      disabled={loading}
                      className={`w-full h-14 rounded-2xl text-lg font-bold shadow-xl bg-gradient-to-r ${gradient} ${gradientHover} transform transition-all active:scale-95 !text-white`}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Signing in...</span>
                        </div>
                      ) : "Sign In"}
                    </Button>
                  </motion.div>
                </motion.form>
              ) : (
                <motion.form 
                  key="otp-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleAdminOTPVerify} 
                  className="space-y-6 text-center"
                >
                  <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl mb-6">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-1">Admin Verification</h3>
                    <p className="text-sm text-red-600/80 dark:text-red-400/80">
                      Extra security check: Please enter the 6-digit OTP sent to <b>{email}</b>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="otp" className="dark:text-gray-300 font-semibold">Verification Code</Label>
                    <Input
                      id="otp"
                      type="text"
                      maxLength={6}
                      placeholder="Enter OTP"
                      className="h-14 text-center text-2xl tracking-widest font-bold rounded-2xl dark:bg-gray-700/50 dark:text-white dark:border-gray-600 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900/20 transition-all"
                      value={adminOTP}
                      onChange={(e) => setAdminOTP(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button
                      type="submit"
                      disabled={loading || adminOTP.length !== 6}
                      className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white"
                    >
                      {loading ? "Verifying..." : "Verify & Access Admin"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowAdminOTP(false)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
                    >
                      Back to Login
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            <p className="mt-10 text-center text-gray-600 dark:text-gray-400 font-medium">
              Don't have an account?{" "}
              <button
                onClick={() => onNavigate("signup")}
                className={`${accentText} ${accentHover} font-extrabold hover:underline underline-offset-4 ml-1`}
              >
                Sign up
              </button>
            </p>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
