import { ArrowLeft, Rocket, Brain, Users, Scan, Globe, TrendingUp, Briefcase, ChevronRight, Sparkles, Target, Zap, Apple, Smartphone, ShieldCheck, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface RoadmapPageProps {
  onNavigate: (page: string) => void;
  userMode?: string;
}

export function RoadmapPage({ onNavigate, userMode = 'student' }: RoadmapPageProps) {
  const isEmp = userMode === 'employee';

  const roadmapPhases = [
    {
      phase: "Phase 01",
      quarter: "Q3 2026",
      status: "In Development",
      title: "iOS & Global Reach",
      accent: "from-blue-500 to-cyan-500",
      items: [
        { 
          title: "CampusSpend for iOS", 
          desc: "Bringing the full power of CampusSpend to Apple devices with native performance.", 
          icon: <Apple className="w-6 h-6 text-gray-900 dark:text-white" />,
          isPriority: true 
        },
        { 
          title: "Multi-Currency Engine", 
          desc: "Seamless support for international transactions and exchange rate tracking.", 
          icon: <Globe className="w-6 h-6 text-cyan-500" /> 
        }
      ]
    },
    {
      phase: "Phase 02",
      quarter: "Q4 2026",
      status: "Next Up",
      title: "Intelligent Insights",
      accent: "from-purple-500 to-blue-500",
      items: [
        { 
          title: "AI Spending Predictions", 
          desc: "ML algorithms that forecast your future expenses based on current habits.", 
          icon: <Brain className="w-6 h-6 text-purple-500" />,
          isNew: true 
        },
        { 
          title: "Smart Bill Categorization", 
          desc: "Automated tagging and organization of every transaction using LLMs.", 
          icon: <Zap className="w-6 h-6 text-yellow-500" /> 
        }
      ]
    },
    {
      phase: "Phase 03",
      quarter: "H1 2027",
      status: "Planning",
      title: "Social Finance",
      accent: "from-cyan-500 to-green-500",
      items: [
        { 
          title: "Group Bill Splitting", 
          desc: "Split rent, groceries, and dining with friends or roommates instantly.", 
          icon: <Users className="w-6 h-6 text-blue-500" /> 
        },
        { 
          title: "OCR Smart Scanner", 
          desc: "Scan physical receipts to automatically log and verify expenses.", 
          icon: <Scan className="w-6 h-6 text-green-500" /> 
        }
      ]
    },
    {
      phase: "Phase 04",
      quarter: "H2 2027",
      status: "Future Vision",
      title: "Professional Wealth",
      accent: "from-green-500 to-emerald-500",
      items: [
        { 
          title: "Investment Sync", 
          desc: "Unified view of your stocks, crypto, and traditional savings portfolios.", 
          icon: <TrendingUp className="w-6 h-6 text-emerald-500" /> 
        },
        { 
          title: "Tax Optimization AI", 
          desc: "Personalized advice to maximize your deductions and financial growth.", 
          icon: <ShieldCheck className="w-6 h-6 text-orange-500" /> 
        }
      ]
    }
  ];

  const theme = {
    gradient: isEmp ? 'from-blue-600 to-cyan-600' : 'from-purple-600 to-blue-600',
    text: isEmp ? 'text-blue-600' : 'text-purple-600',
    bg: isEmp ? 'bg-blue-50' : 'bg-purple-50',
    border: isEmp ? 'border-blue-100' : 'border-purple-100',
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-500 overflow-x-hidden">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl border-b border-white/20 dark:border-gray-800/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => onNavigate('landing')}
            className="group flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-medium">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <Rocket className={`w-5 h-5 ${isEmp ? 'text-blue-500' : 'text-purple-500'}`} />
            <span className="font-bold text-gray-900 dark:text-white">Roadmap</span>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20 animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6">
              Our <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>Journey</span> Ahead
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              We're building the future of campus finance. Explore our roadmap to see what's coming next.
            </p>
          </div>

          {/* Horizontal Roadmap Layout */}
          <div className="relative overflow-x-auto pb-12 no-scrollbar">
            {/* Connecting Line (Desktop) */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-800 -translate-y-1/2 hidden lg:block z-0"></div>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-0 lg:min-w-max px-4">
              {roadmapPhases.map((phase, index) => (
                <div key={index} className="relative flex flex-col items-center lg:w-[350px] animate-fade-in-up" style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}>
                  
                  {/* Timeline Point */}
                  <div className={`hidden lg:flex w-12 h-12 rounded-full border-4 border-white dark:border-gray-950 bg-gradient-to-br ${phase.accent} items-center justify-center z-10 shadow-lg mb-8 group hover:scale-110 transition-transform`}>
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>

                  {/* Card Section */}
                  <Card className="w-full p-8 border-0 shadow-xl bg-white dark:bg-gray-800/50 backdrop-blur-md rounded-3xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                     {/* Quarter Badge */}
                     <div className="flex justify-between items-center mb-6">
                        <span className="text-xs font-black uppercase tracking-widest text-gray-400">{phase.quarter}</span>
                        <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${
                          phase.status === 'In Development' ? 'bg-green-100 text-green-700' :
                          phase.status === 'Next Up' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {phase.status}
                        </div>
                     </div>

                     <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{phase.title}</h3>
                     
                     <div className="space-y-4">
                        {phase.items.map((item, idx) => (
                          <div key={idx} className="flex gap-3">
                             <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-900 shrink-0">
                                {item.icon}
                             </div>
                             <div>
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white">{item.title}</h4>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                             </div>
                          </div>
                        ))}
                     </div>

                     {/* Phase Number Overlay */}
                     <div className="absolute -bottom-4 -right-2 text-6xl font-black opacity-[0.03] dark:opacity-[0.08] italic select-none">
                        {phase.phase.split(' ')[1]}
                     </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Highlight: iOS App */}
          <div className="mt-20 animate-fade-in-up" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
             <Card className="p-10 border-0 bg-gray-900 text-white rounded-[2.5rem] overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <Apple className="w-48 h-48" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                   <div className="md:w-2/3">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6">
                         <Target className="w-3 h-3" />
                         Priority Goal
                      </div>
                      <h2 className="text-3xl md:text-5xl font-black mb-6">iOS Version Coming Soon</h2>
                      <p className="text-gray-400 leading-relaxed mb-8">
                         We are working hard to bring the full CampusSpend experience to iOS. Expect native performance, widget support, and seamless Apple ecosystem integration by late 2026.
                      </p>
                      <div className="flex gap-4">
                         <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                            <ShieldCheck className="w-4 h-4 text-green-400" />
                            <span className="text-xs font-bold text-gray-300">Biometrics</span>
                         </div>
                         <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                            <Smartphone className="w-4 h-4 text-blue-400" />
                            <span className="text-xs font-bold text-gray-300">Native UI</span>
                         </div>
                      </div>
                   </div>
                   <div className="md:w-1/3 flex justify-center">
                      <img src="/mobile-app-mockup.png" alt="iOS Mockup" className="w-full max-w-[200px] drop-shadow-2xl hover:scale-105 transition-transform" />
                   </div>
                </div>
             </Card>
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
    </div>
  );
}
