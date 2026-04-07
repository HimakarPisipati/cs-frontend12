import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Wallet, Mail, Lock, User, ArrowLeft, ShieldCheck, GraduationCap, Briefcase } from "lucide-react";

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
  const [loading, setLoading] = useState(false);

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
      const res = await signup({ name, email, password, user_mode: userMode });

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
        }));
        onNavigate("dashboard");
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
      }));

      onNavigate("dashboard");
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
      <div className={`min-h-screen bg-gradient-to-br ${bgGradient} dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 flex items-center justify-center p-4 transition-colors`}>
        <Card className="w-full max-w-md p-8 lg:p-12 bg-white/80 dark:bg-gray-800/90 backdrop-blur-lg border-0 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`w-16 h-16 bg-gradient-to-br ${iconGradient} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Verify your email</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              We sent a 6-digit code to
            </p>
            <p className={`text-sm font-semibold ${accentText}`}>{email}</p>
          </div>

          {/* OTP Input */}
          <div className="flex justify-center gap-3 mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                className={`w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 dark:border-gray-600 rounded-xl 
                  ${focusRing} outline-none transition-all
                  bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-600`}
                autoFocus={index === 0}
              />
            ))}
          </div>

          {/* Verify Button */}
          <Button
            onClick={handleVerifyOtp}
            disabled={loading || otp.join("").length !== 6}
            className={`w-full h-12 bg-gradient-to-r ${gradient} ${gradientHover} mb-4`}
          >
            {loading ? "Verifying..." : "Verify & Create Account"}
          </Button>

          {/* Resend */}
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Didn't receive the code?{" "}
              {resendCooldown > 0 ? (
                <span className="text-gray-400 dark:text-gray-500">
                  Resend in {resendCooldown}s
                </span>
              ) : (
                <button
                  onClick={handleResendOtp}
                  className={`${accentText} ${accentHover} font-semibold`}
                >
                  Resend OTP
                </button>
              )}
            </p>
          </div>

          {/* Back */}
          <div className="mt-6 text-center">
            <button
              onClick={() => { setShowOtp(false); setOtp(["", "", "", "", "", ""]); }}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              ← Back to signup
            </button>
          </div>
        </Card>
      </div>
    );
  }

  // ==========================================
  // SIGNUP FORM VIEW
  // ==========================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 flex items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-start">
        {/* Left Side - Illustration & Info */}
        <div className="hidden lg:block">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => onNavigate("landing")}
              className="mb-4 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
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

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1701576766277-c6160505581d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc3R1ZHlpbmclMjBsYXB0b3B8ZW58MXx8fHwxNzY3OTcyODE0fDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Student studying"
              className="rounded-3xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent rounded-3xl"></div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <Card className="p-8 lg:p-12 bg-white/80 dark:bg-gray-800/90 backdrop-blur-lg border-0 shadow-2xl">
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

          <div className="flex items-center gap-3 mb-8">
            <div className={`w-12 h-12 bg-gradient-to-br ${iconGradient} rounded-xl flex items-center justify-center`}>
              <Wallet className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Create account
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Start tracking your expenses
              </p>
            </div>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="dark:text-gray-300">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Rahul Sharma"
                  className="pl-10 h-12 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="dark:text-gray-300">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder={isEmp ? 'name@company.com' : 'student@college.edu'}
                  className="pl-10 h-12 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Mode Selection */}
            <div className="space-y-2">
              <Label className="dark:text-gray-300">I am a</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserMode("student")}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${userMode === "student"
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30"
                    : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                    }`}
                >
                  <GraduationCap className={`w-7 h-7 ${userMode === "student" ? "text-purple-600 dark:text-purple-400" : "text-gray-400"}`} />
                  <span className={`text-sm font-semibold ${userMode === "student" ? "text-purple-700 dark:text-purple-300" : "text-gray-500 dark:text-gray-400"}`}>Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUserMode("employee")}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${userMode === "employee"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                    : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                    }`}
                >
                  <Briefcase className={`w-7 h-7 ${userMode === "employee" ? "text-blue-600 dark:text-blue-400" : "text-gray-400"}`} />
                  <span className={`text-sm font-semibold ${userMode === "employee" ? "text-blue-700 dark:text-blue-300" : "text-gray-500 dark:text-gray-400"}`}>Employee</span>
                </button>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500">You can change this later in Settings</p>
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" id="terms" className="mt-1" required />
              <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                I agree to the{" "}
                <a href="#" className={`${accentText} ${accentHover}`}>
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className={`${accentText} ${accentHover}`}>
                  Privacy Policy
                </a>
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className={`w-full h-12 bg-gradient-to-r ${gradient} ${gradientHover}`}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          {/* Social logins are still mock */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                className="h-12 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                onClick={() =>
                  alert("Google signup not implemented yet. Use normal signup ✅")
                }
              >
                Google
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-12 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                onClick={() =>
                  alert("Apple signup not implemented yet. Use normal signup ✅")
                }
              >
                Apple
              </Button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <button
              onClick={() => onNavigate("login")}
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold"
            >
              Sign in
            </button>
          </p>
        </Card>
      </div>
    </div>
  );
}
