import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Wallet, Mail, Lock, User, ArrowLeft, ShieldCheck, GraduationCap, Briefcase, Globe, Coins, Sparkles, TrendingUp } from "lucide-react";
import { COUNTRY_CURRENCY_MAP, CURRENCY_SYMBOLS } from "../../utils/currency";
import { motion, AnimatePresence } from "motion/react";

// ✅ import your signup + OTP API services
import { signup, verifyOtp, resendOtp } from "../../api/services";


interface SignupPageProps {
  onNavigate: (page: string) => void;
}

export function SignupPage({ onNavigate }: SignupPageProps) {
  const landingMode = (localStorage.getItem('landingMode') || 'student') as 'student' | 'employee';
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userMode, setUserMode] = useState<"student" | "employee">(landingMode);
  const [country, setCountry] = useState("India");
  const [currency, setCurrency] = useState("INR");
  const [loading, setLoading] = useState(false);

  const handleCountryChange = (selectedCountry: string) => {
    setCountry(selectedCountry);
    setCurrency(COUNTRY_CURRENCY_MAP[selectedCountry] || "INR");
  };

  const isEmp = userMode === 'employee';
  const gradient = isEmp ? 'from-blue-600 to-cyan-600' : 'from-purple-600 to-blue-600';
  const gradientHover = isEmp ? 'hover:from-blue-700 hover:to-cyan-700' : 'hover:from-purple-700 hover:to-blue-700';
  const iconGradient = isEmp ? 'from-blue-500 to-cyan-500' : 'from-purple-500 to-blue-500';
  const accentText = isEmp ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400';
  const accentHover = isEmp ? 'hover:text-blue-700 dark:hover:text-blue-300' : 'hover:text-purple-700 dark:hover:text-purple-300';
  const focusRing = isEmp ? 'focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800' : 'focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800';
  const brandName = isEmp ? 'CampusSpend Pro' : 'CampusSpend';
  const bgGradient = isEmp ? 'from-blue-50 via-cyan-50 to-green-50' : 'from-purple-50 via-blue-50 to-green-50';

  // OTP State
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signup({ name, email, password, user_mode: userMode, country, currency });

      if (res.data.requiresVerification) {
        // OTP was sent — show verification screen
        setShowOtp(true);
        setResendCooldown(60);
      } else if (res.data.token) {
        // Email confirmation disabled — log in directly
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userMode", res.data.userMode || userMode);
        localStorage.setItem("user", JSON.stringify({
          _id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          tutorialCompleted: res.data.tutorialCompleted || false,
        }));
        const pending = localStorage.getItem("pendingAction");
        if (pending === "writeReview") {
          onNavigate("landing");
        } else {
          onNavigate("dashboard");
        }

      }
    } catch (err: any) {
      console.log(err);
      alert(err?.response?.data?.message || "Signup failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste of full OTP
      const chars = value.replace(/\D/g, "").split("").slice(0, 6);
      const newOtp = [...otp];
      chars.forEach((char, i) => {
        if (index + i < 6) newOtp[index + i] = char;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + chars.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    if (!/^\d*$/.test(value)) return; // only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      return alert("Please enter the full 6-digit code");
    }

    setLoading(true);
    try {
      const res = await verifyOtp({ email, otp: otpString });

      // If auto-login failed but account was created, redirect to login
      if (res.data.requiresLogin) {
        alert(res.data.message || "Account created! Please sign in.");
        onNavigate("login");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userMode", res.data.userMode || userMode);
      localStorage.setItem("user", JSON.stringify({
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        tutorialCompleted: res.data.tutorialCompleted || false,
      }));

      const pending = localStorage.getItem("pendingAction");
      if (pending === "writeReview") {
        onNavigate("landing");
      } else {
        onNavigate("dashboard");
      }

    } catch (err: any) {
      console.log(err);
      alert(err?.response?.data?.message || "Invalid OTP ❌");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;

    try {
      await resendOtp({ email });
      setResendCooldown(60);
      alert("OTP resent to your email ✅");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to resend OTP ❌");
    }
  };

  // ==========================================
  // OTP VERIFICATION VIEW
  // ==========================================
  if (showOtp) {
    return (
      <div className={`min-h-screen relative overflow-hidden bg-gradient-to-br ${bgGradient} dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 flex items-center justify-center p-4 transition-colors duration-500`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md"
        >
          <Card className="p-10 lg:p-12 bg-white/70 dark:bg-gray-800/80 backdrop-blur-2xl border border-white/20 dark:border-gray-700/30 shadow-2xl rounded-[2rem]">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div 
                initial={{ rotate: -10 }}
                animate={{ rotate: 0 }}
                className={`w-20 h-20 bg-gradient-to-br ${iconGradient} rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl`}
              >
                <ShieldCheck className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Verify your email</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-3">
                We sent a 6-digit code to
              </p>
              <p className={`text-lg font-bold ${accentText} mt-1`}>{email}</p>
            </div>

            {/* OTP Input */}
            <div className="flex justify-center gap-3 mb-10">
              {otp.map((digit, index) => (
                <motion.input
                  key={index}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className={`w-12 h-16 text-center text-2xl font-extrabold border-2 border-gray-100 dark:border-gray-700 rounded-2xl 
                    ${focusRing} outline-none transition-all
                    bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-800`}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {/* Verify Button */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleVerifyOtp}
                disabled={loading || otp.join("").length !== 6}
                className={`w-full h-14 rounded-2xl text-lg font-bold shadow-xl bg-gradient-to-r ${gradient} ${gradientHover} mb-6`}
              >
                {loading ? "Verifying..." : "Verify & Create Account"}
              </Button>
            </motion.div>

            {/* Resend */}
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                Didn't receive the code?{" "}
                {resendCooldown > 0 ? (
                  <span className="text-gray-400 dark:text-gray-500 font-bold">
                    Resend in {resendCooldown}s
                  </span>
                ) : (
                  <button
                    onClick={handleResendOtp}
                    className={`${accentText} ${accentHover} font-extrabold hover:underline underline-offset-4`}
                  >
                    Resend OTP
                  </button>
                )}
              </p>
            </div>

            {/* Back */}
            <div className="mt-8 text-center">
              <button
                onClick={() => { setShowOtp(false); setOtp(["", "", "", "", "", ""]); }}
                className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                ← Back to signup
              </button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  // ==========================================
  // SIGNUP FORM VIEW
  // ==========================================
  return (
    <div className={`min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 flex items-start justify-center p-4 pt-20 transition-colors duration-500`}>
      
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
        {/* Left Side - Illustration & Info */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="hidden lg:block"
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Start your journey with
              <span className={`block bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                {brandName}
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              {isEmp ? 'Join professionals taking control of their finances.' : 'Join thousands of students taking control of their finances.'}
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1701576766277-c6160505581d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc3R1ZHlpbmclMjBsYXB0b3B8ZW58MXx8fHwxNzY3OTcyODE0fDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Student studying"
              className="rounded-[2.5rem] shadow-2xl border-4 border-white/50 dark:border-gray-700/50"
            />
            <div className={`absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br ${gradient} rounded-3xl blur-2xl opacity-40 animate-pulse`}></div>
          </motion.div>
        </motion.div>

        {/* Right Side - Signup Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Card className="p-10 lg:p-12 bg-white/70 dark:bg-gray-800/80 backdrop-blur-2xl border border-white/20 dark:border-gray-700/30 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] rounded-[2rem]">
            <div className="lg:hidden mb-6">
              <Button
                variant="ghost"
                onClick={() => onNavigate("landing")}
                className="mb-4 -ml-2 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>

            <div className="flex items-center gap-4 mb-10">
              <motion.div 
                whileHover={{ rotate: 10, scale: 1.1 }}
                className={`w-14 h-14 bg-gradient-to-br ${iconGradient} rounded-2xl flex items-center justify-center shadow-lg`}
              >
                <Wallet className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Create account
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Start tracking your expenses
                </p>
              </div>
            </div>

            <form onSubmit={handleSignup} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="dark:text-gray-300 font-semibold ml-1">Full Name</Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Rahul Sharma"
                    className="pl-12 h-14 rounded-2xl dark:bg-gray-700/50 dark:text-white dark:border-gray-600 focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/20 transition-all"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="dark:text-gray-300 font-semibold ml-1">Email</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={isEmp ? 'name@company.com' : 'student@college.edu'}
                    className="pl-12 h-14 rounded-2xl dark:bg-gray-700/50 dark:text-white dark:border-gray-600 focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/20 transition-all"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Mode Selection */}
              <div className="space-y-3">
                <Label className="dark:text-gray-300 font-semibold ml-1">I am a</Label>
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setUserMode("student")}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${userMode === "student"
                      ? "border-purple-500 bg-purple-50/50 dark:bg-purple-900/30 ring-4 ring-purple-100 dark:ring-purple-900/20"
                      : "border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 bg-gray-50/30 dark:bg-gray-800/50"
                      }`}
                  >
                    <GraduationCap className={`w-8 h-8 ${userMode === "student" ? "text-purple-600 dark:text-purple-400" : "text-gray-400"}`} />
                    <span className={`font-bold ${userMode === "student" ? "text-purple-700 dark:text-purple-300" : "text-gray-500 dark:text-gray-400"}`}>Student</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setUserMode("employee")}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${userMode === "employee"
                      ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/30 ring-4 ring-blue-100 dark:ring-blue-900/20"
                      : "border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 bg-gray-50/30 dark:bg-gray-800/50"
                      }`}
                  >
                    <Briefcase className={`w-8 h-8 ${userMode === "employee" ? "text-blue-600 dark:text-blue-400" : "text-gray-400"}`} />
                    <span className={`font-bold ${userMode === "employee" ? "text-blue-700 dark:text-blue-300" : "text-gray-500 dark:text-gray-400"}`}>Employee</span>
                  </motion.button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country" className="dark:text-gray-300 font-semibold ml-1">Country</Label>
                  <div className="relative group">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                    <select
                      id="country"
                      value={country}
                      onChange={(e) => handleCountryChange(e.target.value)}
                      className="w-full pl-12 pr-10 h-14 rounded-2xl border border-gray-100 bg-gray-50/50 text-sm dark:border-gray-600 dark:bg-gray-900/50 dark:text-white outline-none focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/20 transition-all appearance-none cursor-pointer font-medium"
                    >
                      {Object.keys(COUNTRY_CURRENCY_MAP).sort().map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency" className="dark:text-gray-300 font-semibold ml-1">Currency</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-extrabold text-lg">
                      {CURRENCY_SYMBOLS[currency] || "₹"}
                    </span>
                    <Input
                      id="currency"
                      type="text"
                      value={currency}
                      disabled
                      className="pl-12 h-14 rounded-2xl dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700 cursor-not-allowed opacity-70 font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-1">
                <input type="checkbox" id="terms" className="mt-1 w-5 h-5 rounded-md border-gray-200 text-purple-600 focus:ring-purple-500" required />
                <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                  I agree to the{" "}
                  <button 
                    type="button"
                    onClick={() => onNavigate("privacy-policy")}
                    className={`${accentText} ${accentHover} font-bold hover:underline transition-all`}
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button 
                    type="button"
                    onClick={() => onNavigate("privacy-policy")}
                    className={`${accentText} ${accentHover} font-bold hover:underline transition-all`}
                  >
                    Privacy Policy
                  </button>
                </label>
              </div>

              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button
                  type="submit"
                  disabled={loading}
                  className={`w-full h-14 rounded-2xl text-lg font-bold shadow-xl bg-gradient-to-r ${gradient} ${gradientHover} transform transition-all active:scale-95 !text-white`}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : "Create Account"}
                </Button>
              </motion.div>
            </form>

            <p className="mt-10 text-center text-gray-600 dark:text-gray-400 font-medium">
              Already have an account?{" "}
              <button
                onClick={() => onNavigate("login")}
                className={`${accentText} ${accentHover} font-extrabold hover:underline underline-offset-4 ml-1`}
              >
                Sign in
              </button>
            </p>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
