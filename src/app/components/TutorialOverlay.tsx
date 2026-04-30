import { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { X, ChevronRight, ChevronLeft, Info } from "lucide-react";

interface Step {
  targetId: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface TutorialOverlayProps {
  onComplete: () => void;
  userMode: string;
}

export function TutorialOverlay({ onComplete, userMode }: TutorialOverlayProps) {
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
      content: `Let's take a 30-second tour of your ${isEmployee ? 'Professional' : 'Student'} finance dashboard.`,
      position: 'bottom'
    },
    {
      targetId: 'tutorial-balance',
      title: "Your Financial Snapshot",
      content: "Track your current balance, monthly spending, and remaining budget in real-time.",
      position: 'bottom'
    },
    {
      targetId: 'tutorial-charts',
      title: "Visual Analytics",
      content: "See where your money goes with category breakdowns and weekly spending trends.",
      position: 'top'
    },
    {
      targetId: 'tutorial-reminders',
      title: "Never Miss a Bill",
      content: "Keep track of your upcoming payments and set reminders to avoid late fees.",
      position: 'top'
    },
    {
      targetId: 'tutorial-recent',
      title: "Recent Activity",
      content: "Quickly review your latest expenses and income entries here.",
      position: 'top'
    },
    {
      targetId: 'tutorial-nav',
      title: "Full Control",
      content: "Use the navigation menu to manage Transactions, Budgets, Savings, and more.",
      position: 'right'
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

    // Auto-scroll when step changes
    const step = steps[currentStep];
    const element = document.getElementById(step.targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Update positions on scroll/resize
    updateCoords();
    window.addEventListener('scroll', updateCoords, true);
    window.addEventListener('resize', updateCoords);
    
    // Initial delay to wait for any page transitions or smooth scrolls
    const timer = setTimeout(updateCoords, 100);
    const timer2 = setTimeout(updateCoords, 500); // Second check after smooth scroll might have moved more

    return () => {
      window.removeEventListener('scroll', updateCoords, true);
      window.removeEventListener('resize', updateCoords);
      clearTimeout(timer);
      clearTimeout(timer2);
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
