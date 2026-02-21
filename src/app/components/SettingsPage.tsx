import { useState, useEffect, useRef } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import {
  User, Bell, Palette, Lock, Download, Trash2, Moon, Sun, X, AlertTriangle, ShieldCheck, KeyRound
} from "lucide-react";
// ✅ Import updateProfile here
import { changePassword, deleteAccount, updateProfile, getUserProfile, forgotPassword, resetPassword } from "../../api/services";

interface SettingsPageProps {
  onNavigate: (page: string) => void;
}

export function SettingsPage({ onNavigate }: SettingsPageProps) {
  // --- THEME STATE ---
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("theme") === "dark";
    return false;
  });

  // --- NOTIFICATION STATE ---
  const [notifications, setNotifications] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);

  // --- PROFILE STATE ---
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // --- MODAL STATES ---
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // --- FORM STATES ---
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deleteConfirmationPassword, setDeleteConfirmationPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // --- FORGOT PASSWORD (OTP) STATE ---
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotStep, setForgotStep] = useState<"otp" | "newPassword" | "success">("otp");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ✅ LOAD USER DATA FROM SERVER (The Robust Way)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await getUserProfile();

        // Update State with real database values
        setName(data.name || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");

        // Optional: Update local storage to keep it in sync
        localStorage.setItem("user", JSON.stringify(data));

      } catch (error) {
        console.error("Failed to fetch profile:", error);
        // Fallback: Try loading from local storage if API fails
        const storedUser = localStorage.getItem("user");
        if (storedUser && storedUser !== "undefined") {
          const user = JSON.parse(storedUser);
          setName(user.name || "");
          setEmail(user.email || "");
          setPhone(user.phone || "");
        }
      }
    };

    fetchUserData();
  }, []);

  // ✅ DARK MODE HANDLER
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // ✅ HANDLE SAVE PROFILE (Real Logic)
  const handleSaveProfile = async () => {
    try {
      setLoading(true);

      // 1. Call API
      const { data } = await updateProfile({ name, email, phone });

      // 2. Update Local Storage safely
      let storedUser = localStorage.getItem("user");

      // 🛡️ SAFETY CHECK: If stored data is corrupt ("undefined"), treat it as empty
      if (storedUser === "undefined") {
        storedUser = "{}";
      }

      const currentUser = JSON.parse(storedUser || "{}");
      const updatedUser = { ...currentUser, name: data.name, phone: data.phone };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      // 3. Success Message
      alert("Profile updated successfully! ✅");

    } catch (error: any) {
      console.error("Update failed", error);
      alert(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // ✅ HANDLE CHANGE PASSWORD
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      return alert("New passwords do not match!");
    }
    if (newPassword.length < 6) {
      return alert("Password must be at least 6 characters");
    }

    try {
      setLoading(true);
      await changePassword({ currentPassword, newPassword });
      alert("Password updated successfully! ✅");
      setShowPasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // --- FORGOT PASSWORD HANDLERS ---
  const handleStartForgotPassword = async () => {
    if (!email) return alert("Email not found. Please update your profile first.");
    setLoading(true);
    try {
      await forgotPassword({ email });
      setForgotMode(true);
      setForgotStep("otp");
      setResendCooldown(60);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to send OTP ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const chars = value.replace(/\D/g, "").split("").slice(0, 6);
      const newOtp = [...otp];
      chars.forEach((char, i) => { if (index + i < 6) newOtp[index + i] = char; });
      setOtp(newOtp);
      otpRefs.current[Math.min(index + chars.length, 5)]?.focus();
      return;
    }
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus();
  };

  const handleVerifyAndReset = async () => {
    if (resetNewPassword !== resetConfirmPassword) return alert("Passwords don't match!");
    if (resetNewPassword.length < 6) return alert("Password must be at least 6 characters");
    setLoading(true);
    try {
      await resetPassword({ email, otp: otp.join(""), newPassword: resetNewPassword });
      setForgotStep("success");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to reset password ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleResendForgotOtp = async () => {
    if (resendCooldown > 0) return;
    try {
      await forgotPassword({ email });
      setResendCooldown(60);
      alert("OTP resent to your email ✅");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to resend OTP ❌");
    }
  };

  const closeForgotPassword = () => {
    setForgotMode(false);
    setForgotStep("otp");
    setOtp(["", "", "", "", "", ""]);
    setResetNewPassword("");
    setResetConfirmPassword("");
    setShowPasswordModal(false);
  };

  // ✅ HANDLE DELETE ACCOUNT
  const handleDeleteAccount = async () => {
    if (!deleteConfirmationPassword) return alert("Please enter your password");

    if (!window.confirm("Are you absolutely sure? This action cannot be undone.")) return;

    try {
      setLoading(true);
      await deleteAccount({ password: deleteConfirmationPassword });

      // Cleanup and Redirect
      alert("Account deleted. We're sad to see you go! 👋");
      localStorage.clear();
      sessionStorage.clear();
      onNavigate("login");
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 relative animate-in fade-in duration-500">

      {/* 1. Profile Settings Card */}
      <Card className="p-6 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border-0 shadow-lg transition-colors">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Settings</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Manage your account information</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="dark:text-gray-300">Full Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>
          <div>
            <Label className="dark:text-gray-300">Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 bg-gray-100 dark:bg-gray-600 dark:text-gray-300 "
            />
          </div>
          <div>
            <Label className="dark:text-gray-300">Phone Number</Label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>
          <Button
            onClick={handleSaveProfile}
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </Card>

      {/* 2. Appearance & Notifications Card */}
      <Card className="p-6 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border-0 shadow-lg transition-colors">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Appearance</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Customize look and feel</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl transition-colors">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="w-5 h-5 text-purple-400" /> : <Sun className="w-5 h-5 text-orange-500" />}
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Switch between light and dark theme</p>
              </div>
            </div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>

          {/* Notifications Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl transition-colors">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Notifications</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Enable push notifications</p>
              </div>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>
        </div>
      </Card>

      {/* 3. Security Section */}
      <Card className="p-6 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border-0 shadow-lg transition-colors">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Security</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Keep your account secure</p>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={() => setShowPasswordModal(true)}
            className="w-full justify-start dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Change Password
          </Button>
        </div>
      </Card>

      {/* 4. Data & Privacy Section */}
      <Card className="p-6 bg-white/80 dark:bg-gray-800 backdrop-blur-sm border-0 shadow-lg transition-colors">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
            <Download className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Data & Privacy</h3>
        </div>

        <Button
          variant="outline"
          onClick={() => setShowDeleteModal(true)}
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:bg-gray-700 dark:hover:bg-red-900/20 dark:border-gray-600"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Account
        </Button>
      </Card>

      {/* 🔹 CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-white dark:bg-gray-800 p-6 shadow-2xl relative">
            <button
              onClick={closeForgotPassword}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* === NORMAL CHANGE PASSWORD VIEW === */}
            {!forgotMode && (
              <>
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="dark:text-gray-300">Current Password</Label>
                    <Input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="mt-1 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <Label className="dark:text-gray-300">New Password</Label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="mt-1 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <Label className="dark:text-gray-300">Confirm New Password</Label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="mt-1 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <Button onClick={handleChangePassword} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    {loading ? "Updating..." : "Update Password"}
                  </Button>

                  <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-700"></div></div>
                    <div className="relative flex justify-center text-xs"><span className="px-2 bg-white dark:bg-gray-800 text-gray-500">or</span></div>
                  </div>

                  <button
                    onClick={handleStartForgotPassword}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium py-2"
                  >
                    <KeyRound className="w-4 h-4" />
                    {loading ? "Sending OTP..." : "Forgot Password? Reset via OTP"}
                  </button>
                </div>
              </>
            )}

            {/* === FORGOT PASSWORD: STEP 1 — ENTER OTP === */}
            {forgotMode && forgotStep === "otp" && (
              <>
                <div className="text-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <ShieldCheck className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Enter verification code</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">We sent a 6-digit code to</p>
                  <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">{email}</p>
                </div>

                <div className="flex justify-center gap-2 mb-6">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { otpRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-11 h-13 text-center text-lg font-bold border-2 border-gray-200 dark:border-gray-600 rounded-xl 
                        focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all
                        bg-gray-50 dark:bg-gray-700 dark:text-white hover:bg-white dark:hover:bg-gray-600"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                <Button
                  onClick={() => {
                    if (otp.join("").length !== 6) return alert("Please enter the full 6-digit code");
                    setForgotStep("newPassword");
                  }}
                  disabled={otp.join("").length !== 6}
                  className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 mb-3"
                >
                  Verify Code
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Didn't receive the code?{" "}
                    {resendCooldown > 0 ? (
                      <span className="text-gray-400">Resend in {resendCooldown}s</span>
                    ) : (
                      <button onClick={handleResendForgotOtp} className="text-purple-600 dark:text-purple-400 hover:text-purple-700 font-semibold">Resend OTP</button>
                    )}
                  </p>
                </div>

                <div className="mt-4 text-center">
                  <button onClick={() => { setForgotMode(false); setOtp(["", "", "", "", "", ""]); }} className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                    ← Back to change password
                  </button>
                </div>
              </>
            )}

            {/* === FORGOT PASSWORD: STEP 2 — SET NEW PASSWORD === */}
            {forgotMode && forgotStep === "newPassword" && (
              <>
                <div className="text-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Lock className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Set new password</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Choose a strong password</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="dark:text-gray-300">New Password</Label>
                    <Input type="password" placeholder="••••••••" value={resetNewPassword} onChange={(e) => setResetNewPassword(e.target.value)} className="mt-1 dark:bg-gray-700 dark:text-white" minLength={6} required />
                  </div>
                  <div>
                    <Label className="dark:text-gray-300">Confirm Password</Label>
                    <Input type="password" placeholder="••••••••" value={resetConfirmPassword} onChange={(e) => setResetConfirmPassword(e.target.value)} className="mt-1 dark:bg-gray-700 dark:text-white" minLength={6} required />
                  </div>
                  <Button onClick={handleVerifyAndReset} disabled={loading} className="w-full h-11 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                    {loading ? "Resetting..." : "Reset Password"}
                  </Button>
                </div>
              </>
            )}

            {/* === FORGOT PASSWORD: STEP 3 — SUCCESS === */}
            {forgotMode && forgotStep === "success" && (
              <div className="text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">✅</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Password Reset!</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Your password has been updated successfully.</p>
                <Button onClick={closeForgotPassword} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Done
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* 🔹 DELETE ACCOUNT MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-white dark:bg-gray-800 p-6 shadow-2xl relative border-2 border-red-100 dark:border-red-900">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-8 h-8" />
              <h3 className="text-xl font-bold">Delete Account?</h3>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
              This action is <strong>permanent</strong>. All your transactions, budgets, and savings data will be wiped immediately.
            </p>

            <div className="space-y-4">
              <div>
                <Label className="dark:text-gray-300">Enter your password to confirm</Label>
                <Input
                  type="password"
                  placeholder="Your Password"
                  value={deleteConfirmationPassword}
                  onChange={(e) => setDeleteConfirmationPassword(e.target.value)}
                  className="mt-1 dark:bg-gray-700 dark:text-white border-red-200 dark:border-red-900 focus:ring-red-500"
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowDeleteModal(false)} className="flex-1 dark:bg-gray-700 dark:text-white dark:border-gray-600">
                  Cancel
                </Button>
                <Button onClick={handleDeleteAccount} disabled={loading} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                  {loading ? "Deleting..." : "Delete Permanently"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

    </div>
  );
}