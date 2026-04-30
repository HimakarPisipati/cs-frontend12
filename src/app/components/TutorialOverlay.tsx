import { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { X, ChevronRight, ChevronLeft, Info } from "lucide-react";

interface Step {
  targetId: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  page?: string;
}

interface TutorialOverlayProps {
  onComplete: () => void;
  onNavigate: (page: string) => void;
  userMode: string;
}

export function TutorialOverlay({ onComplete, onNavigate, userMode }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const isEmployee = userMode === 'employee';

  const theme = isEmployee 
    ? { gradient: 'from-blue-600 to-cyan-600', text: 'text-blue-600' }
    : { gradient: 'from-purple-600 to-blue-600', text: 'text-purple-600' };

  const steps: Step[] = [
    {
      targetId: 'tutorial-header',
      title: "Welcome to CampusSpend!",
      content: `Let's take a tour of your ${isEmployee ? 'Professional' : 'Student'} finance dashboard.`,
      position: 'bottom',
      page: 'dashboard'
    },
    {
      targetId: 'tutorial-balance',
      title: "Financial Snapshot",
      content: "Track your balance, monthly spending, and remaining budget here.",
      position: 'bottom',
      page: 'dashboard'
    },
    {
      targetId: 'tutorial-nav',
      title: "Navigation Menu",
      content: "Use this menu to switch between different sections of the app.",
      position: 'right',
      page: 'dashboard'
    },
    {
      targetId: 'tutorial-transactions-add',
      title: "Track Transactions",
      content: "Easily add new expenses or income. Your history is automatically categorized.",
      position: 'bottom',
      page: 'transactions'
    },
    {
      targetId: 'tutorial-budgets-add',
      title: "Smart Budgeting",
      content: "Set monthly limits for different categories to keep your spending in check.",
      position: 'bottom',
      page: 'budgets'
    },
    {
      targetId: 'tutorial-savings-add',
      title: "Savings Goals",
      content: "Save for big purchases by setting goals and tracking your progress.",
      position: 'bottom',
      page: 'savings'
    },
    {
      targetId: 'tutorial-analytics-charts',
      title: "Detailed Analytics",
      content: "Get deep insights into your spending patterns with advanced charts.",
      position: 'top',
      page: 'analytics'
    },
    {
      targetId: 'tutorial-settings-mode',
      title: "Settings & Customization",
      content: "Switch between Student and Employee modes or change your theme here.",
      position: 'bottom',
      page: 'settings'
    }
  ];

  useEffect(() => {
    const updateCoords = () => {
      const step = steps[currentStep];
      const element = document.getElementById(step.targetId);
      if (element) {
        const rect = element.getBoundingClientRect();
        setCoords({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        });
      } else {
        setCoords({ top: window.innerHeight / 2, left: window.innerWidth / 2, width: 0, height: 0 });
      }
    };

    const step = steps[currentStep];
    
    // Check if we need to navigate
    if (step.page) {
      onNavigate(step.page);
    }

    // Auto-scroll when step changes
    const scrollElement = () => {
      const element = document.getElementById(step.targetId);
      if (element) {
        // 1. Standard scroll into view with options
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
        
        // 2. Fallback: Manual scroll calculation for absolute precision
        const rect = element.getBoundingClientRect();
        const absoluteElementTop = rect.top + window.scrollY;
        const middle = absoluteElementTop - (window.innerHeight / 2) + (rect.height / 2);
        
        // If it's not significantly centered, force it
        const currentViewportTop = window.scrollY;
        const currentViewportBottom = currentViewportTop + window.innerHeight;
        
        if (Math.abs(currentViewportTop + (window.innerHeight / 2) - (absoluteElementTop + rect.height / 2)) > 100) {
          window.scrollTo({
            top: middle,
            behavior: 'smooth'
          });
        }
        updateCoords();
      }
    };

    // Update positions on scroll/resize
    window.addEventListener('scroll', updateCoords, true);
    window.addEventListener('resize', updateCoords);
    
    // Frequent checks to ensure alignment during page transitions
    const timers = [50, 150, 300, 500, 800, 1200, 1800, 2500].map(ms => setTimeout(() => {
      scrollElement();
      updateCoords();
    }, ms));

    return () => {
      window.removeEventListener('scroll', updateCoords, true);
      window.removeEventListener('resize', updateCoords);
      timers.forEach(clearTimeout);
    };
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Backdrop with hole */}
      <div className="absolute inset-0 bg-black/60 transition-all duration-500" style={{
        clipPath: `polygon(
          0% 0%, 0% 100%, 
          ${coords.left}px 100%, 
          ${coords.left}px ${coords.top}px, 
          ${coords.left + coords.width}px ${coords.top}px, 
          ${coords.left + coords.width}px ${coords.top + coords.height}px, 
          ${coords.left}px ${coords.top + coords.height}px, 
          ${coords.left}px 100%, 
          100% 100%, 100% 0%
        )`
      }} />

      {/* Spotlight highlight */}
      <div 
        className={`absolute border-2 border-dashed border-white/50 rounded-xl transition-all duration-300`}
        style={{
          top: coords.top - 4,
          left: coords.left - 4,
          width: coords.width + 8,
          height: coords.height + 8,
        }}
      />

      {/* Tutorial Card */}
      <div 
        className="absolute pointer-events-auto transition-all duration-300 w-[320px] sm:w-[400px]"
        style={{
          top: step.position === 'bottom' ? coords.top + coords.height + 20 : 
               step.position === 'top' ? coords.top - 210 : 
               coords.top + (coords.height / 2) - 100,
          left: step.position === 'right' ? coords.left + coords.width + 20 :
                Math.max(20, Math.min(window.innerWidth - 420, coords.left + (coords.width / 2) - 200)),
        }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-start justify-between mb-4">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center shadow-lg shadow-purple-500/20`}>
              <Info className="w-6 h-6 text-white" />
            </div>
            <button 
              onClick={onComplete}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {step.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            {step.content}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {steps.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all ${i === currentStep ? `w-6 bg-gradient-to-r ${theme.gradient}` : 'w-1.5 bg-gray-200 dark:bg-gray-700'}`}
                />
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={onComplete}
                className="text-sm font-semibold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 px-3 py-2"
              >
                Skip
              </button>
              {currentStep > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleBack}
                  className="rounded-xl"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
              )}
              <Button 
                onClick={handleNext}
                className={`rounded-xl bg-gradient-to-r ${theme.gradient} text-white px-6`}
              >
                {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                {currentStep !== steps.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
