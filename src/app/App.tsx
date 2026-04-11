import { useEffect, useState } from "react";
import { LandingPage } from "./components/LandingPage";
import { LoginPage } from "./components/LoginPage";
import { SignupPage } from "./components/SignupPage";
import { Dashboard } from "./components/Dashboard";
import { TransactionsPage } from "./components/TransactionsPage";
import { BudgetsPage } from "./components/BudgetsPage";
import { SavingsPage } from "./components/SavingsPage";
import { AnalyticsPage } from "./components/AnalyticsPage";
import { SettingsPage } from "./components/SettingsPage";
import { ForgotPasswordPage } from "./components/ForgotPasswordPage";
import { DuesPage } from "./components/DuesPage";
import { SalaryPage } from "./components/SalaryPage";
import { RemindersPage } from "./components/RemindersPage";

export default function App() {
  const token = localStorage.getItem("token");

  // ✅ FIX 1: Default to "dashboard" if logged in
  const [currentPage, setCurrentPage] = useState<string>(
    token ? "dashboard" : "landing"
  );

  // ✅ User Mode: student or employee
  const [userMode, setUserMode] = useState<string>(() => {
    return localStorage.getItem("userMode") || "student";
  });

  // ✅ Dynamic tab title + favicon based on mode
  useEffect(() => {
    const isEmployee = userMode === "employee";
    document.title = isEmployee ? "CampusSpend Pro" : "CampusSpend";
    const favicon = document.getElementById("favicon") as HTMLLinkElement | null;
    if (favicon) {
      favicon.href = isEmployee ? "/logo-employee.png" : "/logo-student.png";
    }
  }, [userMode]);

  // ✅ FIX 2: Added "dashboard" to this list so it gets protected too
  const protectedPages = [
    "dashboard",
    "transactions",
    "budgets",
    "savings",
    "dues",
    "salary",
    "analytics",
    "settings",
    "reminders",
  ];

  const handleNavigate = (page: string) => {
    // If going back to landing/login, ensure we clear the token (Logout)
    if (page === "landing" || page === "login") {
      localStorage.removeItem("token");
    }
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleModeChange = (mode: string) => {
    setUserMode(mode);
    localStorage.setItem("userMode", mode);
  };

  // 🔐 PROTECTION LOGIC
  useEffect(() => {
    // Check fresh token from storage
    const currentToken = localStorage.getItem("token");

    // If on a protected page AND no token, kick to login
    if (protectedPages.includes(currentPage) && !currentToken) {
      setCurrentPage("login");
    }
  }, [currentPage]);

  // Sync userMode from localStorage on login
  useEffect(() => {
    const storedMode = localStorage.getItem("userMode");
    if (storedMode && storedMode !== userMode) {
      setUserMode(storedMode);
    }
  }, [currentPage]);

  // Public pages
  if (currentPage === "landing") {
    return <LandingPage onNavigate={handleNavigate} />;
  }

  // ✅ Make sure your LoginPage calls onNavigate('dashboard') upon success
  if (currentPage === "login") {
    return <LoginPage onNavigate={handleNavigate} />;
  }

  if (currentPage === "signup") {
    return <SignupPage onNavigate={handleNavigate} />;
  }

  if (currentPage === "forgot-password") {
    return <ForgotPasswordPage onNavigate={handleNavigate} />;
  }

  // Protected pages layout
  return (
    <Dashboard onNavigate={handleNavigate} currentPage={currentPage} userMode={userMode}>
      {/* The Dashboard component handles the "Home" view internally when 
        currentPage === 'dashboard', so we don't need a child component here.
      */}
      {currentPage === "transactions" && <TransactionsPage userMode={userMode} />}
      {currentPage === "budgets" && <BudgetsPage userMode={userMode} />}
      {currentPage === "savings" && <SavingsPage userMode={userMode} />}
      {currentPage === "dues" && <DuesPage userMode={userMode} />}
      {currentPage === "salary" && <SalaryPage />}
      {currentPage === "analytics" && <AnalyticsPage userMode={userMode} />}
      {currentPage === "settings" && <SettingsPage onNavigate={handleNavigate} userMode={userMode} onModeChange={handleModeChange} />}
      {currentPage === "reminders" && <RemindersPage userMode={userMode} />}
    </Dashboard>
  );
}