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
import { PrivacyPolicyPage } from "./components/PrivacyPolicyPage";
import { HelpCenterPage } from "./components/HelpCenterPage";
import { ContactUsPage } from "./components/ContactUsPage";
import { login } from "../api/services";

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

  const handleDemoLogin = async () => {
    // 🔥 Demo Mode: Local session only, no DB calls
    localStorage.setItem("token", "demo-token");
    localStorage.setItem("isDemo", "true");
    localStorage.setItem("userMode", userMode);
    localStorage.setItem("user", JSON.stringify({
      _id: "demo-user-id",
      name: "Demo User",
      email: "demo@campispend.com",
      userMode: userMode,
    }));

    setUserMode(userMode);
    setCurrentPage("dashboard");
    window.scrollTo(0, 0);
  };

  const handleNavigate = (page: string) => {
    if (page === "demo-login") {
      handleDemoLogin();
      return;
    }
    
    if (page === "login" && localStorage.getItem("token")) {
      // If already logged in and trying to go to login page, send to dashboard
      setCurrentPage("dashboard");
      return;
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
    return <LandingPage onNavigate={handleNavigate} userMode={userMode} onModeChange={handleModeChange} />;
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

  if (currentPage === "privacy-policy") {
    return <PrivacyPolicyPage onNavigate={handleNavigate} userMode={userMode} />;
  }

  if (currentPage === "help-center") {
    return <HelpCenterPage onNavigate={handleNavigate} userMode={userMode} />;
  }

  if (currentPage === "contact-us") {
    return <ContactUsPage onNavigate={handleNavigate} userMode={userMode} />;
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