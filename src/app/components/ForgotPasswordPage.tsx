import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Mail, Lock, ArrowLeft, ShieldCheck, KeyRound } from "lucide-react";
import { forgotPassword, resetPassword, resendOtp } from "../../api/services";

interface ForgotPasswordPageProps {
    onNavigate: (page: string) => void;
}

export function ForgotPasswordPage({ onNavigate }: ForgotPasswordPageProps) {
    const [step, setStep] = useState<"email" | "otp" | "newPassword" | "success">("email");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await forgotPassword({ email });
            setStep("otp");
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
            chars.forEach((char, i) => {
                if (index + i < 6) newOtp[index + i] = char;
            });
            setOtp(newOtp);
            const nextIndex = Math.min(index + chars.length, 5);
            inputRefs.current[nextIndex]?.focus();
            return;
        }
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerifyOtp = () => {
        const otpString = otp.join("");
        if (otpString.length !== 6) {
            return alert("Please enter the full 6-digit code");
        }
        setStep("newPassword");
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return alert("Passwords don't match");
        }
        if (newPassword.length < 6) {
            return alert("Password must be at least 6 characters");
        }

        setLoading(true);
        try {
            await resetPassword({ email, otp: otp.join(""), newPassword });
            setStep("success");
        } catch (err: any) {
            alert(err?.response?.data?.message || "Failed to reset password ❌");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendCooldown > 0) return;
        try {
            await forgotPassword({ email });
            setResendCooldown(60);
            alert("OTP resent to your email ✅");
        } catch (err: any) {
            alert(err?.response?.data?.message || "Failed to resend OTP ❌");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 flex items-center justify-center p-4 transition-colors">
            <Card className="w-full max-w-md p-8 lg:p-12 bg-white/80 dark:bg-gray-800/90 backdrop-blur-lg border-0 shadow-2xl">

                {/* ==================== STEP 1: ENTER EMAIL ==================== */}
                {step === "email" && (
                    <>
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <KeyRound className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Forgot Password?</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                Enter your email and we'll send you a verification code
                            </p>
                        </div>

                        <form onSubmit={handleSendOtp} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="dark:text-gray-300">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="student@college.edu"
                                        className="pl-10 h-12 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                            >
                                {loading ? "Sending..." : "Send Verification Code"}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => onNavigate("login")}
                                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center justify-center gap-1 mx-auto"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back to Login
                            </button>
                        </div>
                    </>
                )}

                {/* ==================== STEP 2: ENTER OTP ==================== */}
                {step === "otp" && (
                    <>
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <ShieldCheck className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Enter verification code</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">We sent a 6-digit code to</p>
                            <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">{email}</p>
                        </div>

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
                                    className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 dark:border-gray-600 rounded-xl 
                                        focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 outline-none transition-all
                                        bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-600"
                                    autoFocus={index === 0}
                                />
                            ))}
                        </div>

                        <Button
                            onClick={handleVerifyOtp}
                            disabled={otp.join("").length !== 6}
                            className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 mb-4"
                        >
                            Verify Code
                        </Button>

                        <div className="text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Didn't receive the code?{" "}
                                {resendCooldown > 0 ? (
                                    <span className="text-gray-400 dark:text-gray-500">Resend in {resendCooldown}s</span>
                                ) : (
                                    <button onClick={handleResendOtp} className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold">
                                        Resend OTP
                                    </button>
                                )}
                            </p>
                        </div>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => { setStep("email"); setOtp(["", "", "", "", "", ""]); }}
                                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                ← Change email
                            </button>
                        </div>
                    </>
                )}

                {/* ==================== STEP 3: NEW PASSWORD ==================== */}
                {step === "newPassword" && (
                    <>
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Lock className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Set new password</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                Choose a strong password for your account
                            </p>
                        </div>

                        <form onSubmit={handleResetPassword} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="newPassword" className="dark:text-gray-300">New Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10 h-12 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                        required
                                        minLength={6}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="dark:text-gray-300">Confirm Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10 h-12 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                        required
                                        minLength={6}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                            >
                                {loading ? "Resetting..." : "Reset Password"}
                            </Button>
                        </form>
                    </>
                )}

                {/* ==================== STEP 4: SUCCESS ==================== */}
                {step === "success" && (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">✅</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Password Reset!</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
                            Your password has been updated successfully. You can now sign in with your new password.
                        </p>
                        <Button
                            onClick={() => onNavigate("login")}
                            className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        >
                            Go to Login
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
}
