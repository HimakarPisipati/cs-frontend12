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
  userMode?: string;
  onModeChange?: (mode: string) => void;
}

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  isEmp?: boolean;
}

function PolicySection({ icon, title, children, defaultOpen = false, isEmp = false }: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl ${isEmp ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-purple-100 dark:bg-purple-900/30'} flex items-center justify-center shrink-0`}>
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

export function PrivacyPolicyPage({ onNavigate, userMode = "student", onModeChange }: PrivacyPolicyPageProps) {
  const isEmp = userMode === "employee";
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains("dark") ||
      localStorage.getItem("theme") !== "light";
  });

  const toggleMode = (mode: 'student' | 'employee') => {
    if (onModeChange) onModeChange(mode);
  };

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
    <div className={`min-h-screen relative bg-[#fafafa] dark:bg-gray-950 transition-colors duration-500 overflow-x-hidden`}>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onNavigate("landing")}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </Button>
              <div 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => onNavigate("landing")}
              >
                <div className={`w-10 h-10 bg-gradient-to-br ${isEmp ? 'from-blue-500 to-cyan-500' : 'from-purple-500 to-blue-500'} rounded-xl flex items-center justify-center`}>
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <span className={`text-xl font-bold bg-gradient-to-r ${isEmp ? 'from-blue-600 to-cyan-600' : 'from-purple-600 to-blue-600'} bg-clip-text text-transparent`}>
                  {isEmp ? 'CampusSpend Pro' : 'CampusSpend'}
                </span>
              </div>
            </div>

            {/* Mode Toggle Switch */}
            <div className="flex items-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-full p-1 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
              <button
                onClick={() => toggleMode('student')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${!isEmp 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md transform scale-105' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
              >
                Student
              </button>
              <button
                onClick={() => toggleMode('employee')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${isEmp 
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md transform scale-105' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
              >
                Professional
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <div className="pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative z-10">
        <div className={`inline-flex items-center gap-2 px-4 py-2 ${isEmp ? 'bg-blue-100 dark:bg-blue-900/40' : 'bg-purple-100 dark:bg-purple-900/40'} rounded-full mb-8`}>
          <Shield className={`w-4 h-4 ${isEmp ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'}`} />
          <span className={`text-xs font-bold uppercase tracking-widest ${isEmp ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'}`}>Your Privacy Matters</span>
        </div>
        <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">
          Privacy Policy.<br/>
          <span className={`bg-gradient-to-r ${isEmp ? 'from-blue-600 to-cyan-500' : 'from-purple-600 to-blue-500'} bg-clip-text text-transparent`}>
            Built on Trust.
          </span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          We are committed to protecting your personal information. Here's everything you need to know about how we handle and protect your financial data.
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-6 font-medium">
          Last updated: April 29, 2026
        </p>
      </div>

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className={`absolute top-0 -left-[10%] w-[50vw] h-[50vw] rounded-full blur-[120px] opacity-10 
          ${isEmp ? 'bg-blue-400' : 'bg-purple-400'}`}></div>
        <div className={`absolute top-[40%] -right-[10%] w-[60vw] h-[60vw] rounded-full blur-[120px] opacity-10 
          ${isEmp ? 'bg-cyan-400' : 'bg-blue-400'}`}></div>
      </div>

      {/* Policy Content */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {/* Overview */}
          <PolicySection
            icon={<Eye className={`w-5 h-5 ${isEmp ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'}`} />}
            title="1. Overview"
            defaultOpen={true}
            isEmp={isEmp}
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
            icon={<Database className={`w-5 h-5 ${isEmp ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'}`} />}
            title="2. Information We Collect"
            isEmp={isEmp}
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
            icon={<UserCheck className={`w-5 h-5 ${isEmp ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'}`} />}
            title="3. How We Use Your Information"
            isEmp={isEmp}
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
            icon={<Lock className={`w-5 h-5 ${isEmp ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'}`} />}
            title="4. Data Security & Encryption"
            isEmp={isEmp}
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

          {/* AI Data Processing */}
          <PolicySection
            icon={<Shield className={`w-5 h-5 ${isEmp ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'}`} />}
            title="5. AI Data Processing"
            isEmp={isEmp}
          >
            <p>
              CampusSpend uses Google Gemini AI for advanced features. Here is how your data is handled:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2 mt-2">
              <li>
                <strong>Receipt Scanning:</strong> When you upload a receipt, the image is processed 
                to extract text and data. This data is only used to pre-fill your transaction form.
              </li>
              <li>
                <strong>Conversational AI:</strong> Chat queries about your expenses are processed 
                by providing necessary transaction context to the AI model to give you accurate advice.
              </li>
              <li>
                <strong>Data Privacy:</strong> We use the Google Gemini API with enterprise-grade 
                security. Your data is processed for the sole purpose of providing these AI features 
                and is never shared with third parties for marketing.
              </li>
              <li className="text-amber-700 dark:text-amber-400 font-medium">
                <strong>Data Usage Disclosure:</strong> Since we utilize the Gemini API Free tier, 
                Google may use the data (your receipt text or chat messages) to help train and 
                improve their AI models.
              </li>
            </ul>
          </PolicySection>

          {/* Data Retention */}
          <PolicySection
            icon={<Database className={`w-5 h-5 ${isEmp ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'}`} />}
            title="5. Data Retention & Deletion"
            isEmp={isEmp}
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
            icon={<Eye className={`w-5 h-5 ${isEmp ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'}`} />}
            title="6. Cookies & Local Storage"
            isEmp={isEmp}
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
            icon={<Mail className={`w-5 h-5 ${isEmp ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'}`} />}
            title="7. Email Communications"
            isEmp={isEmp}
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
            icon={<Shield className={`w-5 h-5 ${isEmp ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'}`} />}
            title="8. Children's Privacy"
            isEmp={isEmp}
          >
            <p>
              CampusSpend is designed for students aged 13 and above. We do not knowingly collect 
              personal information from children under 13. If you believe a child under 13 has 
              provided us with personal information, please contact us so we can delete it.
            </p>
          </PolicySection>

          {/* Changes to This Policy */}
          <PolicySection
            icon={<Eye className={`w-5 h-5 ${isEmp ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'}`} />}
            title="9. Changes to This Policy"
            isEmp={isEmp}
          >
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any 
              changes by updating the "Last updated" date at the top of this page. You are 
              advised to review this Privacy Policy periodically for any changes.
            </p>
          </PolicySection>

          {/* Contact */}
          <PolicySection
            icon={<Mail className={`w-5 h-5 ${isEmp ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'}`} />}
            title="10. Contact Us"
            isEmp={isEmp}
          >
            <p>
              If you have any questions about this Privacy Policy or our data practices, 
              please don't hesitate to reach out:
            </p>
            <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl space-y-1">
              <p className="font-medium text-gray-800 dark:text-gray-200">Himakar Pisipati</p>
              <p className="text-sm">Developer & Creator of CampusSpend</p>
              <a href="mailto:campusspend@gmail.com" className={`text-sm ${isEmp ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'} hover:underline`}>campusspend@gmail.com</a>
            </div>
          </PolicySection>

          {/* Back to Home Button */}
          <div className="pt-8 text-center">
            <Button
              size="lg"
              onClick={() => onNavigate(localStorage.getItem("token") ? "settings" : "landing")}
              className={`bg-gradient-to-r ${isEmp ? 'from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700' : 'from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'} text-lg px-8 h-14`}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back {localStorage.getItem("token") ? "to Settings" : "to Home"}
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
