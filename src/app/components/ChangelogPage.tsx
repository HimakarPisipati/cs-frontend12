import { ArrowLeft, Clock, Zap, Shield, Bug, Star, Package, ChevronRight, Smartphone, FileText, Lock, Moon } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface ChangelogPageProps {
  onNavigate: (page: string) => void;
  userMode?: string;
}

export function ChangelogPage({ onNavigate, userMode = 'student' }: ChangelogPageProps) {
  const isEmp = userMode === 'employee';

  const changelogData = [
    {
      version: "v2.0.0",
      date: "May 2026",
      title: "The AI Revolution",
      description: "Our biggest update ever. We've integrated Google Gemini AI to transform how you manage your money.",
      updates: [
        { type: 'feature', text: "AI Receipt Scanner: Snap photos to auto-fill transactions", icon: <FileText className="w-4 h-4" /> },
        { type: 'feature', text: "CampusSense: Your new conversational AI financial guide", icon: <Star className="w-4 h-4" /> },
        { type: 'feature', text: "Smart Categorization: Auto-selects categories as you type", icon: <Zap className="w-4 h-4" /> },
        { type: 'feature', text: "Predictive Spending & AI Anomaly Detection", icon: <Shield className="w-4 h-4" /> }
      ]
    },
    {
      version: "v1.4.0",
      date: "May 2026",
      title: "The Mobile Revolution",
      description: "A major update bringing CampusSpend to your pocket and enhancing security.",
      updates: [
        { type: 'feature', text: "Official Android App Launch (.apk available now)", icon: <Smartphone className="w-4 h-4" /> },
        { type: 'feature', text: "PDF Report Export for Mobile Devices", icon: <FileText className="w-4 h-4" /> },
        { type: 'security', text: "Secure Email OTP Verification for account updates", icon: <Lock className="w-4 h-4" /> },
        { type: 'fix', text: "Resolved mobile notification scheduling issues", icon: <Bug className="w-4 h-4" /> }
      ]
    },
    {
      version: "v1.3.0",
      date: "April 2026",
      title: "Visual Excellence",
      description: "Focused on user experience and aesthetic improvements.",
      updates: [
        { type: 'feature', text: "Default Dark Mode for a premium experience", icon: <Moon className="w-4 h-4" /> },
        { type: 'feature', text: "New Interactive Analytics Dashboard", icon: <Zap className="w-4 h-4" /> },
        { type: 'fix', text: "Fixed budget calculation race conditions", icon: <Bug className="w-4 h-4" /> }
      ]
    },
    {
      version: "v1.2.0",
      date: "March 2026",
      title: "Financial Planning Pro",
      description: "Deepening the financial management tools for professionals and students.",
      updates: [
        { type: 'feature', text: "Advanced EMI & Debt Management section", icon: <Shield className="w-4 h-4" /> },
        { type: 'feature', text: "Salary Component Tracker (PF, Tax, Deductions)", icon: <Zap className="w-4 h-4" /> },
        { type: 'feature', text: "Savings Goal Progress Visualization", icon: <Star className="w-4 h-4" /> }
      ]
    },
    {
      version: "v1.1.0",
      date: "February 2026",
      title: "Smart Interactions",
      description: "Making the app smarter and more responsive to your needs.",
      updates: [
        { type: 'feature', text: "Intelligent Bill Payment Reminders", icon: <Clock className="w-4 h-4" /> },
        { type: 'feature', text: "Real-time Multi-device Cloud Sync", icon: <Package className="w-4 h-4" /> },
        { type: 'fix', text: "Optimized dashboard loading performance", icon: <Bug className="w-4 h-4" /> }
      ]
    },
    {
      version: "v1.0.0",
      date: "January 2026",
      title: "The Beginning",
      description: "The initial launch of CampusSpend - a new way to track your finances.",
      updates: [
        { type: 'feature', text: "Core Expense & Income Tracking", icon: <Zap className="w-4 h-4" /> },
        { type: 'feature', text: "Category-based Budgeting", icon: <Package className="w-4 h-4" /> },
        { type: 'feature', text: "Student & Employee Mode Switcher", icon: <Star className="w-4 h-4" /> }
      ]
    }
  ];

  const theme = {
    gradient: isEmp ? 'from-blue-600 to-cyan-600' : 'from-purple-600 to-blue-600',
    text: isEmp ? 'text-blue-600' : 'text-purple-600',
    bg: isEmp ? 'bg-blue-50' : 'bg-purple-50',
    border: isEmp ? 'border-blue-100' : 'border-purple-100',
    accent: isEmp ? 'bg-blue-500' : 'bg-purple-500'
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 bg-gradient-to-br ${theme.gradient} rounded-lg flex items-center justify-center`}>
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white">Product Updates</span>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              What's New in <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>CampusSpend</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We're constantly working to make CampusSpend better. See the latest features, improvements, and fixes we've built for you.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4 text-sm font-medium">
              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                <Package className="w-4 h-4" />
                <span>{changelogData.length} Major Updates</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                <Clock className="w-4 h-4" />
                <span>Last updated May 2026</span>
              </div>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-0 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gray-100 dark:bg-gray-800 -translate-x-1/2 hidden sm:block"></div>

            <div className="space-y-16">
              {changelogData.map((item, index) => (
                <div key={index} className="relative">
                  {/* Timeline Dot */}
                  <div className={`absolute left-0 sm:left-1/2 top-0 w-4 h-4 rounded-full ${theme.accent} border-4 border-white dark:border-gray-900 -translate-x-1/2 z-10 hidden sm:block shadow-lg shadow-purple-500/20`}></div>

                  <div className={`flex flex-col ${index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'} items-start sm:items-center`}>
                    <div className="w-full sm:w-1/2 px-0 sm:px-12">
                      <div className={`${index % 2 === 0 ? 'sm:text-right' : 'sm:text-left'} mb-4 sm:mb-0`}>
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${theme.bg} ${theme.text} mb-2`}>
                          {item.version}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{item.title}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{item.date}</p>
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2 px-0 sm:px-12">
                      <Card className="p-6 border-0 shadow-xl bg-white dark:bg-gray-800 hover:shadow-2xl transition-all duration-300 group">
                        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                          {item.description}
                        </p>
                        <div className="space-y-4">
                          {item.updates.map((update, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <div className={`mt-1 p-1 rounded-md ${
                                update.type === 'feature' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' :
                                update.type === 'security' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' :
                                'bg-green-100 dark:bg-green-900/30 text-green-600'
                              }`}>
                                {update.icon}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{update.text}</p>
                                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{update.type}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer CTA */}
          <div className="mt-32 text-center">
            <Card className={`p-10 border-0 bg-gradient-to-br ${theme.gradient} text-white rounded-[2rem] shadow-2xl`}>
              <h2 className="text-3xl font-bold mb-4 text-white">Have a feature request?</h2>
              <p className="text-white/80 mb-8 max-w-lg mx-auto">
                We build CampusSpend based on your feedback. Tell us what you want to see next and we might include it in the next update!
              </p>
              <Button 
                onClick={() => onNavigate('contact-us')}
                size="lg" 
                className="bg-white text-gray-900 hover:bg-gray-100 rounded-xl px-8"
              >
                Send Suggestion
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2026 CampusSpend. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
