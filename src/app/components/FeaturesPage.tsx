import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Wallet,
  PieChart,
  TrendingDown,
  FileText,
  Target,
  DollarSign,
  BarChart3,
  ArrowLeft,
  GraduationCap,
  Briefcase,
  Sparkles,
  Scan,
  MessageSquare,
  Activity,
  Zap
} from "lucide-react";

interface FeaturesPageProps {
  onNavigate: (page: string) => void;
  userMode: string;
  onModeChange?: (mode: string) => void;
}

const TiltCard = ({ feature, isEmp }: { feature: any, isEmp: boolean }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate mouse position relative to the card's center
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Convert to percentage (-0.5 to 0.5)
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    // Aggressive rotation for stronger 3D pop
    setRotateX(yPct * -35); 
    setRotateY(xPct * 35);

    // Track glare position relative to the top left of the card
    setGlarePosition({
      x: (mouseX / width) * 100,
      y: (mouseY / height) * 100
    });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    // Reset to initial state with a smooth transition
    setIsHovering(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div className="relative group perspective-[1500px]" style={{ perspective: "1500px" }}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`relative p-10 rounded-3xl transition-all duration-300 ease-out shadow-2xl flex flex-col justify-between overflow-hidden
          bg-white/40 dark:bg-gray-900/60 backdrop-blur-xl border border-white/50 dark:border-gray-700/60
          hover:shadow-[0_30px_60px_rgba(0,0,0,0.15)] min-h-[350px]
          ${isEmp ? 'hover:shadow-blue-500/30' : 'hover:shadow-purple-500/30'}`}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${isHovering ? 1.05 : 1}, ${isHovering ? 1.05 : 1}, 1)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Dynamic Holographic Glare Effect */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-300 mix-blend-overlay dark:mix-blend-screen"
          style={{
            opacity: isHovering ? 0.6 : 0,
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 60%)`,
            transform: "translateZ(1px)"
          }}
        ></div>

        {/* Deep background gradient pushing backwards */}
        <div 
          className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none 
            bg-gradient-to-br ${isEmp ? 'from-blue-600/10 to-cyan-400/5' : 'from-purple-600/10 to-blue-400/5'}`}
          style={{ transform: "translateZ(-40px)" }}
        ></div>

        {/* 3D Floating Icon Container */}
        <div className="mb-6 relative z-10" style={{ transform: "translateZ(80px)", transition: "transform 0.2s ease-out" }}>
          <div className={`p-5 rounded-2xl inline-block shadow-[0_10px_30px_rgba(0,0,0,0.15)] backdrop-blur-md border border-white/50 dark:border-gray-600/50
            ${isEmp ? 'bg-gradient-to-br from-blue-100/90 to-cyan-50/50 dark:from-blue-900/80 dark:to-cyan-900/40' : 'bg-gradient-to-br from-purple-100/90 to-blue-50/50 dark:from-purple-900/80 dark:to-blue-900/40'}`}>
            <div style={{ filter: "drop-shadow(0px 8px 8px rgba(0,0,0,0.25))" }}>
              {feature.icon}
            </div>
          </div>
        </div>
        
        {/* 3D Floating Text Container */}
        <div className="relative z-10" style={{ transform: "translateZ(60px)", transition: "transform 0.2s ease-out" }}>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white drop-shadow-sm tracking-tight">
              {feature.title}
            </h3>
            {feature.isAI && (
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-[10px] font-black text-white uppercase tracking-widest shadow-sm">
                PRO AI
              </span>
            )}
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg font-medium drop-shadow-sm">
            {feature.description}
          </p>
        </div>

        {/* Foreground 3D Floating Orbs */}
        <div 
          className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-50 transition-all duration-700 
          ${isEmp ? 'bg-cyan-400' : 'bg-blue-400'}`}
          style={{ transform: "translateZ(120px)" }}
        ></div>
        
        <div 
          className={`absolute -left-6 -bottom-6 w-20 h-20 rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-all duration-700 delay-100
          ${isEmp ? 'bg-blue-500' : 'bg-purple-500'}`}
          style={{ transform: "translateZ(100px)" }}
        ></div>
        
        {/* Extreme Depth Border Layer inside the card */}
        <div 
           className={`absolute inset-6 rounded-2xl border-2 opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none
           ${isEmp ? 'border-cyan-300/50' : 'border-purple-300/50'}`}
           style={{ transform: "translateZ(40px)" }}
        ></div>
      </div>
    </div>
  );
};

export function FeaturesPage({ onNavigate, userMode, onModeChange }: FeaturesPageProps) {
  const [currentMode, setCurrentMode] = useState(userMode || "student");
  const isEmp = currentMode === "employee";

  // Handle local state and parent state
  const toggleMode = (mode: string) => {
    setCurrentMode(mode);
    if (onModeChange) onModeChange(mode);
  };

  const aiFeatures = [
    {
      icon: <Scan className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />,
      title: "AI Receipt Scanner",
      description: "Stop typing, start scanning. Use advanced OCR to automatically extract merchant, date, and items from any photo of a bill or receipt.",
      isAI: true
    },
    {
      icon: <MessageSquare className="w-10 h-10 text-purple-600 dark:text-purple-400" />,
      title: "CampusSense Chat",
      description: "Talk to your money. Ask CampusSense about your spending habits, affordability predictions, and personalized saving tips.",
      isAI: true
    },
    {
      icon: <Zap className="w-10 h-10 text-amber-600 dark:text-amber-400" />,
      title: "Smart Categorization",
      description: "AI that understands context. Our NLP engine automatically selects the right category for your expenses as you type your notes.",
      isAI: true
    },
    {
      icon: <Activity className="w-10 h-10 text-red-600 dark:text-red-400" />,
      title: "Anomaly Detection",
      description: "Proactive protection. Our AI identifies unusually high spending patterns and flags them immediately to help you stay in control.",
      isAI: true
    }
  ];

  const studentFeatures = [
    ...aiFeatures,
    {
      icon: <Wallet className="w-10 h-10 text-purple-600 dark:text-purple-400" />,
      title: "Smart Budgets",
      description: "Set personalized monthly limits for food, entertainment, and more. Get warned before you overspend so you always stay within your pocket money."
    },
    {
      icon: <PieChart className="w-10 h-10 text-blue-600 dark:text-blue-400" />,
      title: "Expense Categorization",
      description: "Automatically organize expenses into distinct categories. See exactly where your money goes with beautiful, easy-to-read interactive charts."
    },
    {
      icon: <TrendingDown className="w-10 h-10 text-green-600 dark:text-green-400" />,
      title: "Actionable Insights",
      description: "Receive AI-driven smart insights about your weekly spending patterns to identify massive saving opportunities and build better habits."
    },
    {
      icon: <FileText className="w-10 h-10 text-orange-600 dark:text-orange-400" />,
      title: "One-Click PDF Export",
      description: "Instantly generate and export professional expense reports. Perfect for sharing with parents or keeping for your own personal records."
    }
  ];

  const employeeFeatures = [
    ...aiFeatures,
    {
      icon: <DollarSign className="w-10 h-10 text-blue-600 dark:text-blue-400" />,
      title: "Comprehensive Salary Tracker",
      description: "Track your monthly gross salary, complex deductions, PF contributions, and exactly what your true net take-home pay is over time."
    },
    {
      icon: <BarChart3 className="w-10 h-10 text-cyan-600 dark:text-cyan-400" />,
      title: "Tax & Deduction Monitor",
      description: "Keep a close eye on income tax, health insurance premiums, and retirement contributions month by month to optimize your wealth."
    },
    {
      icon: <Target className="w-10 h-10 text-green-600 dark:text-green-400" />,
      title: "Unified EMI Manager",
      description: "Consolidate all your debt. Track home loans, car loans, personal loans, and education EMIs in one powerful centralized dashboard."
    },
    {
      icon: <FileText className="w-10 h-10 text-orange-600 dark:text-orange-400" />,
      title: "Pro Financial Reports",
      description: "Generate boardroom-ready detailed salary and expense reports as secure PDFs for tax filing, audits, or personal net-worth tracking."
    }
  ];

  const activeFeatures = isEmp ? employeeFeatures : studentFeatures;

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${isEmp ? 'from-blue-50 via-cyan-50 to-green-50' : 'from-purple-50 via-blue-50 to-green-50'} dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 transition-colors duration-500`}>
      
      {/* Top Navigation */}
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
                <GraduationCap className="w-4 h-4" />
                Student
              </button>
              <button
                onClick={() => toggleMode('employee')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${isEmp 
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md transform scale-105' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
              >
                <Briefcase className="w-4 h-4" />
                Professional
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <div className="pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative z-10">
        <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">
          Powerful Features.<br/>
          <span className={`bg-gradient-to-r ${isEmp ? 'from-blue-600 to-cyan-500' : 'from-purple-600 to-blue-500'} bg-clip-text text-transparent`}>
            Designed for You.
          </span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Hover around to interact with our 3D showcase and explore the tools that will transform your financial journey.
        </p>
      </div>

      {/* 3D Features Grid */}
      <div className="pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 perspective-1000">
          {activeFeatures.map((feature, index) => (
            <TiltCard key={index} feature={feature} isEmp={isEmp} />
          ))}
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className={`absolute top-0 -left-[10%] w-[50vw] h-[50vw] rounded-full blur-[120px] opacity-20 
          ${isEmp ? 'bg-blue-400' : 'bg-purple-400'}`}></div>
        <div className={`absolute top-[40%] -right-[10%] w-[60vw] h-[60vw] rounded-full blur-[120px] opacity-20 
          ${isEmp ? 'bg-cyan-400' : 'bg-blue-400'}`}></div>
      </div>

      {/* Footer CTA */}
      <div className="relative z-10 pb-20 text-center">
        <Button 
          size="lg"
          onClick={() => onNavigate('signup')}
          className={`h-16 px-12 text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300
            bg-gradient-to-r ${isEmp ? 'from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700' : 'from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'}`}
        >
          Get Started for Free
        </Button>
      </div>
      
    </div>
  );
}
