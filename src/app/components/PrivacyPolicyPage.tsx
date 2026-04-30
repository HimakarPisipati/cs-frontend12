import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  ArrowLeft,
  Shield,
  Eye,
  Lock,
  Database,
  UserCheck,
  Mail,
  ChevronDown,
  ChevronUp,
  Wallet,
  Sun,
  Moon,
} from "lucide-react";

interface PrivacyPolicyPageProps {
  onNavigate: (page: string) => void;
}

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function PolicySection({ icon, title, children, defaultOpen = false }: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <div className="text-gray-400 dark:text-gray-500 ml-4">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-6 pt-0 text-gray-600 dark:text-gray-400 leading-relaxed space-y-3 border-t border-gray-100 dark:border-gray-700/50">
          <div className="pt-4">{children}</div>
        </div>
      </div>
    </Card>
  );
}

export function PrivacyPolicyPage({ onNavigate }: PrivacyPolicyPageProps) {
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains("dark") ||
      localStorage.getItem("theme") === "dark";
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
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 transition-colors duration-300">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate("landing")}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white -ml-2"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-700" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  CampusSpend
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <section className="relative overflow-hidden py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/40 rounded-full mb-6">
            <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">Your Privacy Matters</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We are committed to protecting your personal information and your right to privacy. 
            Here's everything you need to know about how we handle your data.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
            Last updated: April 29, 2026
          </p>
        </div>

        {/* Decorative gradients */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-300 dark:bg-purple-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-15 animate-pulse" />
        <div className="absolute top-10 right-1/4 w-72 h-72 bg-blue-300 dark:bg-blue-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-15 animate-pulse delay-1000" />
      </section>

      {/* Policy Content */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {/* Overview */}
          <PolicySection
            icon={<Eye className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
            title="1. Overview"
            defaultOpen={true}
          >
            <p>
              CampusSpend ("we", "our", or "us") is a personal finance management application 
              designed for students and working professionals. This Privacy Policy explains how 
              we collect, use, disclose, and safeguard your information when you use our 
              web application.
            </p>
            <p>
              By using CampusSpend, you agree to the collection and use of information in 
              accordance with this policy. If you do not agree with our policies, please do 
              not use the application.
            </p>
          </PolicySection>

          {/* Information We Collect */}
          <PolicySection
            icon={<Database className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
            title="2. Information We Collect"
          >
            <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">
              We collect the following types of information:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong>Account Information:</strong> Name, email address, and encrypted password 
                when you register for an account.
              </li>
              <li>
                <strong>Financial Data:</strong> Transaction records (expenses and income), budget 
                categories and limits, savings goals, dues, salary information, and reminders 
                that you voluntarily enter into the application.
              </li>
              <li>
                <strong>Usage Data:</strong> Application preferences such as theme settings and 
                user mode (student/employee).
              </li>
            </ul>
            <p className="mt-3 text-sm bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-3 rounded-lg">
              ✅ We do <strong>not</strong> collect browsing history, location data, contacts, 
              or any data from your device beyond what you explicitly provide.
            </p>
          </PolicySection>

          {/* How We Use Your Information */}
          <PolicySection
            icon={<UserCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
            title="3. How We Use Your Information"
          >
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-2 ml-2 mt-2">
              <li>Provide and maintain the CampusSpend service</li>
              <li>Authenticate your account and manage sessions</li>
              <li>Display your financial data (transactions, budgets, analytics) back to you</li>
              <li>Send email reminders for upcoming bills and payments (if enabled)</li>
              <li>Generate expense reports and analytics</li>
              <li>Improve and optimize the application experience</li>
            </ul>
            <p className="mt-3 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 p-3 rounded-lg">
              ℹ️ We <strong>never</strong> sell, rent, or share your financial data with third 
              parties for advertising or marketing purposes.
            </p>
          </PolicySection>

          {/* Data Security */}
          <PolicySection
            icon={<Lock className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
            title="4. Data Security & Encryption"
          >
            <p>
              We take the security of your data seriously. Here are the measures we implement:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2 mt-2">
              <li>
                <strong>Encryption at Rest:</strong> Sensitive financial data including 
                transaction categories, notes, budget amounts, and salary details are encrypted 
                using AES-256 encryption before being stored in the database.
              </li>
              <li>
                <strong>Password Hashing:</strong> Your password is never stored in plain text. 
                We use industry-standard bcrypt hashing to protect your credentials.
              </li>
              <li>
                <strong>JWT Authentication:</strong> Secure JSON Web Tokens (JWT) are used for 
                session management, ensuring that only authenticated users can access their data.
              </li>
              <li>
                <strong>HTTPS:</strong> All data transmitted between your browser and our servers 
                is encrypted using TLS/SSL.
              </li>
            </ul>
          </PolicySection>

          {/* Data Retention */}
          <PolicySection
            icon={<Database className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
            title="5. Data Retention & Deletion"
          >
            <p>
              Your data is retained as long as your account is active. You have full control 
              over your data:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2 mt-2">
              <li>You can delete individual transactions, budgets, goals, and reminders at any time</li>
              <li>You can export your data as PDF reports before deletion</li>
              <li>
                You can permanently delete your account through the Settings page, which will 
                remove all your data from our servers
              </li>
            </ul>
            <p className="mt-3 text-sm bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 p-3 rounded-lg">
              ⚠️ Account deletion is permanent and cannot be undone. Please export any data 
              you wish to keep before deleting your account.
            </p>
          </PolicySection>

          {/* Cookies & Local Storage */}
          <PolicySection
            icon={<Eye className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
            title="6. Cookies & Local Storage"
          >
            <p>CampusSpend uses browser local storage for:</p>
            <ul className="list-disc list-inside space-y-2 ml-2 mt-2">
              <li><strong>Authentication Token:</strong> To keep you logged in during your session</li>
              <li><strong>Theme Preference:</strong> To remember your light/dark mode choice</li>
              <li><strong>User Mode:</strong> To remember your student/employee mode selection</li>
            </ul>
            <p className="mt-3">
              We do not use third-party tracking cookies or analytics services that collect 
              personal information.
            </p>
          </PolicySection>

          {/* Email Communications */}
          <PolicySection
            icon={<Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
            title="7. Email Communications"
          >
            <p>We may send you emails for:</p>
            <ul className="list-disc list-inside space-y-2 ml-2 mt-2">
              <li><strong>Account Verification:</strong> OTP codes during signup</li>
              <li><strong>Password Reset:</strong> If you request a password recovery</li>
              <li><strong>Payment Reminders:</strong> Notifications for upcoming bills and dues you've set</li>
            </ul>
            <p className="mt-3">
              You can disable reminder emails by deleting or modifying your reminders in the 
              application. We will never send unsolicited marketing emails.
            </p>
          </PolicySection>

          {/* Children's Privacy */}
          <PolicySection
            icon={<Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
            title="8. Children's Privacy"
          >
            <p>
              CampusSpend is designed for students aged 13 and above. We do not knowingly collect 
              personal information from children under 13. If you believe a child under 13 has 
              provided us with personal information, please contact us so we can delete it.
            </p>
          </PolicySection>

          {/* Changes to This Policy */}
          <PolicySection
            icon={<Eye className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
            title="9. Changes to This Policy"
          >
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any 
              changes by updating the "Last updated" date at the top of this page. You are 
              advised to review this Privacy Policy periodically for any changes.
            </p>
          </PolicySection>

          {/* Contact */}
          <PolicySection
            icon={<Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
            title="10. Contact Us"
          >
            <p>
              If you have any questions about this Privacy Policy or our data practices, 
              please don't hesitate to reach out:
            </p>
            <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl space-y-1">
              <p className="font-medium text-gray-800 dark:text-gray-200">Himakar Pisipati</p>
              <p className="text-sm">Developer & Creator of CampusSpend</p>
              <a href="mailto:campusspend@gmail.com" className="text-sm text-purple-600 dark:text-purple-400 hover:underline">campusspend@gmail.com</a>
            </div>
          </PolicySection>

          {/* Back to Home Button */}
          <div className="pt-8 text-center">
            <Button
              size="lg"
              onClick={() => onNavigate("landing")}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 h-14"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p>&copy; 2026 CampusSpend. Made By Himakar. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
