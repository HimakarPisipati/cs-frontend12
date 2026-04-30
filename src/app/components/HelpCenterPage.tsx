import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  ArrowLeft,
  HelpCircle,
  Search,
  Book,
  MessageSquare,
  Mail,
  ChevronDown,
  ChevronUp,
  Wallet,
  Sun,
  Moon,
  Zap,
  Shield,
  Clock,
  User,
} from "lucide-react";
import { Input } from "./ui/input";

interface HelpCenterPageProps {
  onNavigate: (page: string) => void;
}

interface FAQProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="border-0 shadow-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors"
      >
        <h3 className="text-base font-semibold text-gray-900 dark:text-white pr-4">{question}</h3>
        <div className="text-gray-400 dark:text-gray-500 shrink-0">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-5 pb-5 pt-0 text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-700/50">
          <div className="pt-4">{answer}</div>
        </div>
      </div>
    </Card>
  );
}

export function HelpCenterPage({ onNavigate }: HelpCenterPageProps) {
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains("dark") ||
      localStorage.getItem("theme") === "dark";
  });
  const [searchQuery, setSearchQuery] = useState("");

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

  const categories = [
    {
      icon: <Wallet className="w-6 h-6 text-purple-600" />,
      title: "Getting Started",
      description: "Learn the basics of tracking your expenses and setting up budgets.",
      count: 12
    },
    {
      icon: <Shield className="w-6 h-6 text-blue-600" />,
      title: "Account & Security",
      description: "Manage your profile, change passwords, delete account, and understand data security.",
      count: 9
    },
    {
      icon: <Zap className="w-6 h-6 text-orange-600" />,
      title: "Pro Features",
      description: "Deep dive into salary tracking, EMI management, and advanced analytics.",
      count: 15
    },
    {
      icon: <Clock className="w-6 h-6 text-green-600" />,
      title: "Reminders & Dues",
      description: "How to set up and manage bill reminders and payment tracking.",
      count: 10
    }
  ];

  const faqs = [
    {
      question: "Is CampusSpend free to use?",
      answer: "Yes, CampusSpend is completely free for students and professionals. All our core features including budget tracking, salary management, and PDF reports are available without any cost."
    },
    {
      question: "How do I switch between Student and Employee mode?",
      answer: "You can switch modes from your Profile or Settings page. Go to Settings > Preferences and select your preferred mode. This will update your dashboard to show tools relevant to your profile."
    },
    {
      question: "Is my financial data secure?",
      answer: "Absolutely. We use AES-256 encryption to store your sensitive financial information and industry-standard security protocols for all data transmissions. We never share your personal data with third parties."
    },
    {
      question: "How can I export my expense reports?",
      answer: "You can export reports from the Transactions or Analytics pages. Look for the 'Export PDF' button. You can filter by date range or category before exporting."
    },
    {
      question: "Can I use CampusSpend on my mobile phone?",
      answer: "Yes! CampusSpend is a Progressive Web App (PWA), meaning you can use it on your phone's browser, and it will behave just like a native app. You can even 'Add to Home Screen' for easier access."
    },
    {
      question: "How do I delete my account?",
      answer: "To delete your account, go to Profile > Settings > Security and select 'Delete Account'. Please note that this action is permanent and will remove all your transaction history and budget data. You can also contact support if you need help."
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCategories = categories.filter(cat =>
    cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 transition-colors duration-300">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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

      {/* Hero Search Section */}
      <section className="relative overflow-hidden py-16 lg:py-24 bg-white dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            How can we help you?
          </h1>
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for articles, guides, or FAQs..."
              className="w-full h-14 pl-12 pr-4 text-lg rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-400 bg-white dark:bg-gray-800 shadow-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">Popular:</span>
            {['Budgeting', 'Security', 'Salary Tracking', 'Account Deletion'].map((tag) => (
              <button 
                key={tag} 
                onClick={() => setSearchQuery(tag)}
                className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredCategories.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredCategories.map((cat, idx) => (
                <Card key={idx} className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm group cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{cat.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{cat.description}</p>
                  <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">{cat.count} articles</span>
                </Card>
              ))}
            </div>
          ) : (
            searchQuery && (
              <div className="text-center py-10">
                <p className="text-gray-500 dark:text-gray-400">No categories matching "{searchQuery}"</p>
              </div>
            )
          )}
        </div>
      </section>

      {/* FAQ & Support Section */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* FAQs */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <HelpCircle className="w-7 h-7 text-purple-600" />
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((faq, idx) => (
                    <FAQItem key={idx} question={faq.question} answer={faq.answer} />
                  ))
                ) : (
                  <div className="text-center py-10 bg-white/50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                    <HelpCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                      No FAQs found matching "{searchQuery}"
                    </p>
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="mt-4 text-purple-600 dark:text-purple-400 font-semibold hover:underline"
                    >
                      Clear search
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Support Sidebar */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <MessageSquare className="w-7 h-7 text-blue-600" />
                Contact Support
              </h2>
              
              <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                <h3 className="text-xl font-bold mb-4">Still need help?</h3>
                <p className="text-purple-50 mb-6">Our support team is always here to help you with any issues or questions.</p>
                <a href="mailto:campusspend@gmail.com" className="block">
                  <Button className="w-full bg-white text-purple-600 hover:bg-gray-100 font-bold h-12">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Support
                  </Button>
                </a>
              </Card>

              <Card className="p-6 border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Quick Links</h3>
                <div className="space-y-3">
                  <button onClick={() => onNavigate('privacy-policy')} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                    <Book className="w-4 h-4" />
                    Privacy Policy
                  </button>
                  <button className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                    <User className="w-4 h-4" />
                    Terms of Service
                  </button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white">CampusSpend</span>
            </div>
            <p className="text-sm mb-6 max-w-md mx-auto">Making money management simple for students and professionals everywhere.</p>
            <div className="flex justify-center gap-8 text-sm">
              <button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors">Home</button>
              <button onClick={() => onNavigate('privacy-policy')} className="hover:text-white transition-colors">Privacy</button>
              <button onClick={() => onNavigate('signup')} className="hover:text-white transition-colors">Get Started</button>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800">
              <p>&copy; 2026 CampusSpend. Made By Himakar. All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
