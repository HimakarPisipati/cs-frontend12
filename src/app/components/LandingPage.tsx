import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  Wallet,
  PieChart,
  TrendingDown,
  FileText,
  Target,
  Zap,
  Shield,
  Sparkles,
  ArrowRight,
  Star,
  Sun,
  Moon,
  Briefcase,
  GraduationCap,
  DollarSign,
  BarChart3
} from "lucide-react";

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains("dark") ||
      localStorage.getItem("theme") === "dark";
  });
  const [landingMode, setLandingMode] = useState<'student' | 'employee'>(() => {
    return (localStorage.getItem('landingMode') as 'student' | 'employee') || 'student';
  });
  const isEmp = landingMode === 'employee';

  const updateLandingMode = (mode: 'student' | 'employee') => {
    setLandingMode(mode);
    localStorage.setItem('landingMode', mode);
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

  const studentFeatures = [
    {
      icon: <Wallet className="w-8 h-8 text-purple-500" />,
      title: "Smart Budgets",
      description: "Set monthly budgets per category and track your spending in real-time"
    },
    {
      icon: <PieChart className="w-8 h-8 text-blue-500" />,
      title: "Expense Categories",
      description: "Organize expenses into categories like food, transport, and entertainment"
    },
    {
      icon: <TrendingDown className="w-8 h-8 text-green-500" />,
      title: "Weekly Insights",
      description: "Get smart insights about your spending patterns and saving opportunities"
    },
    {
      icon: <FileText className="w-8 h-8 text-orange-500" />,
      title: "PDF Export",
      description: "Export your expense reports for sharing or personal records"
    }
  ];

  const employeeFeatures = [
    {
      icon: <DollarSign className="w-8 h-8 text-blue-500" />,
      title: "Salary Tracker",
      description: "Track your monthly salary, deductions, PF, and net take-home pay"
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-cyan-500" />,
      title: "Tax & Deductions",
      description: "Monitor your tax, insurance, and PF deductions month by month"
    },
    {
      icon: <Target className="w-8 h-8 text-green-500" />,
      title: "EMI Manager",
      description: "Track home loans, car loans, and education EMIs in one place"
    },
    {
      icon: <FileText className="w-8 h-8 text-orange-500" />,
      title: "Financial Reports",
      description: "Generate and export detailed salary and expense reports as PDF"
    }
  ];

  const features = isEmp ? employeeFeatures : studentFeatures;

  const testimonials = [
    {
      name: "Dhruba Jyothi Mahata",
      role: "Electronics and Computing, Pre-final year",
      image: "/testimonials/dhruba.jpeg",
      content:
        "CampusSpend helped me save ₹5,000 in just 2 months! Now I can finally afford that trip to Goa.",
      rating: 5,
    },
    {
      name: "Suryavardhan Chaluvadi",
      role: "Computer Science Engineering, Pre-final year",
      image: "/testimonials/surya.jpeg",
      content:
        "Best expense tracker for students! Simple UI and the insights actually help me cut unnecessary spending.",
      rating: 5,
    },
    {
      name: "Vishnu Sai Bhattu",
      role: "Electronics and Computing, Pre-final year",
      image: "/testimonials/vishnu.jpeg",
      content:
        "I love how it shows me where my pocket money goes. The category breakdown is super helpful!",
      rating: 5,
    },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${isEmp ? 'from-blue-50 via-cyan-50 to-green-50' : 'from-purple-50 via-blue-50 to-green-50'} dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 transition-colors duration-300`}>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 bg-gradient-to-br ${isEmp ? 'from-blue-500 to-cyan-500' : 'from-purple-500 to-blue-500'} rounded-xl flex items-center justify-center`}>
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <span className={`text-xl font-bold bg-gradient-to-r ${isEmp ? 'from-blue-600 to-cyan-600' : 'from-purple-600 to-blue-600'} bg-clip-text text-transparent`}>
                {isEmp ? 'CampusSpend Pro' : 'CampusSpend'}
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Features</a>
              <a href="#testimonials" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Testimonials</a>
            </div>

            <div className="flex items-center gap-3">
              {/* Mode Toggle */}
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full p-0.5">
                <button
                  onClick={() => updateLandingMode('student')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${!isEmp
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  Student
                </button>
                <button
                  onClick={() => updateLandingMode('employee')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${isEmp
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  Employee
                </button>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <Button
                variant="ghost"
                onClick={() => onNavigate('login')}
                className="hidden sm:flex dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
              >
                Login
              </Button>
              <Button
                onClick={() => onNavigate('signup')}
                className={`bg-gradient-to-r ${isEmp ? 'from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700' : 'from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'}`}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 ${isEmp ? 'bg-blue-100 dark:bg-blue-900/40' : 'bg-purple-100 dark:bg-purple-900/40'} rounded-full mb-6`}>
              <Sparkles className={`w-4 h-4 ${isEmp ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'}`} />
              <span className={`text-sm ${isEmp ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'}`}>Made By Himakar Pisipati</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              {isEmp ? 'Manage your salary.' : 'Track every rupee.'}
              <br />
              <span className={`bg-gradient-to-r ${isEmp ? 'from-blue-600 via-cyan-600 to-green-600' : 'from-purple-600 via-blue-600 to-green-600'} bg-clip-text text-transparent`}>
                {isEmp ? 'Grow your wealth as a professional.' : 'Save more as a student.'}
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
              {isEmp
                ? 'Track salary, deductions, EMIs, and investments. Take full control of your professional finances.'
                : 'The easiest way to manage your pocket money, hostel expenses, and student budget. Start building better money habits today.'
              }
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => {
                  localStorage.setItem("demoLogin", "true");
                  onNavigate('login');
                }}
                className={`bg-gradient-to-r ${isEmp ? 'from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700' : 'from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'} text-lg px-8 h-14`}
              >
                Try Demo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onNavigate('signup')}
                className="text-lg px-8 h-14 border-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Get Started Free
              </Button>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span>Free Forever</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className={`w-5 h-5 ${isEmp ? 'text-blue-500' : 'text-purple-500'}`} />
                <span>{isEmp ? 'Professional Grade' : 'Student Focused'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative gradients */}
        <div className={`absolute top-0 left-1/4 w-96 h-96 ${isEmp ? 'bg-blue-300 dark:bg-blue-800' : 'bg-purple-300 dark:bg-purple-800'} rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-pulse`}></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-300 dark:bg-blue-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {isEmp ? 'Tools built for working professionals' : 'Everything you need to manage money'}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {isEmp
                ? 'Powerful features to manage salary, taxes, EMIs, and investments'
                : 'Powerful features designed specifically for student life and budgets'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/80"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className={`py-20 bg-gradient-to-br ${isEmp ? 'from-blue-50 to-cyan-50' : 'from-purple-50 to-blue-50'} dark:from-gray-950 dark:to-gray-900 transition-colors`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {isEmp ? 'Trusted by professionals everywhere' : 'Loved by students across India'}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {isEmp
                ? 'Join thousands of professionals managing their finances smarter'
                : 'Join thousands of students who are taking control of their finances'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 bg-gradient-to-r ${isEmp ? 'from-blue-600 to-cyan-600' : 'from-purple-600 to-blue-600'} text-white`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            {isEmp ? 'Ready to master your professional finances?' : 'Ready to take control of your money?'}
          </h2>
          <p className={`text-xl mb-10 ${isEmp ? 'text-blue-100' : 'text-purple-100'}`}>
            {isEmp
              ? 'Join CampusSpend Pro and track salary, EMIs, and investments'
              : 'Join CampusSpend today and start your journey to smarter spending'
            }
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => onNavigate('signup')}
              className={`bg-white ${isEmp ? 'text-blue-600' : 'text-purple-600'} hover:bg-gray-100 text-lg px-8 h-14`}
            >
              Get Started Free
            </Button>
            <Button
              size="lg"
              onClick={() => {
                localStorage.setItem("demoLogin", "true");
                onNavigate('login');
              }}
              className="text-lg px-8 h-14 border-2 border-white text-white bg-transparent hover:bg-white/10"
            >
              Try Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-8 h-8 bg-gradient-to-br ${isEmp ? 'from-blue-500 to-cyan-500' : 'from-purple-500 to-blue-500'} rounded-lg flex items-center justify-center`}>
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-white">{isEmp ? 'CampusSpend Pro' : 'CampusSpend'}</span>
              </div>
              <p className="text-sm">
                {isEmp ? 'Smart financial management for working professionals.' : 'Making money management simple for students everywhere.'}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mobile App</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 CampusSpend. Made By Himakar .All Rights Reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
