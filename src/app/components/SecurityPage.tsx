import { ArrowLeft, Shield, Lock, EyeOff, Key, Database, ShieldCheck, Fingerprint, RefreshCcw, Bell, Smartphone, Globe, FileCheck, Target, Zap, Brain } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface SecurityPageProps {
  onNavigate: (page: string) => void;
  userMode?: string;
}

export function SecurityPage({ onNavigate, userMode = 'student' }: SecurityPageProps) {
  const isEmp = userMode === 'employee';

  const securityFeatures = [
    {
      title: "Bank-Grade Encryption",
      desc: "All your sensitive data is encrypted using AES-256 bit encryption before it even hits our database.",
      icon: <Lock className="w-8 h-8 text-blue-500" />,
      tag: "Encryption"
    },
    {
      title: "Secure Cloud Database",
      desc: "We use Neon Serverless Postgres with isolated environments and encrypted storage to ensure your data is always safe and highly available.",
      icon: <Database className="w-8 h-8 text-purple-500" />,
      tag: "Database"
    },
    {
      title: "Secure Email OTP",
      desc: "Critical account changes require a one-time password sent to your verified email address.",
      icon: <ShieldCheck className="w-8 h-8 text-green-500" />,
      tag: "Identity"
    },
    {
      title: "JWT Authentication",
      desc: "Secure, stateless authentication using JSON Web Tokens ensures your session remains private and protected.",
      icon: <Key className="w-8 h-8 text-amber-500" />,
      tag: "Access"
    },
    {
      title: "AI Safety & Data Privacy",
      desc: "Financial data is decrypted on-the-fly only when needed for AI analysis (Scanner/Chat). We use enterprise-grade Google Gemini AI with secure data protocols.",
      icon: <Brain className="w-8 h-8 text-indigo-500" />,
      tag: "Intelligence"
    }
  ];

  const theme = {
    gradient: isEmp ? 'from-blue-600 to-cyan-600' : 'from-purple-600 to-blue-600',
    text: isEmp ? 'text-blue-600' : 'text-purple-600',
    bg: isEmp ? 'bg-blue-50' : 'bg-purple-50',
    border: isEmp ? 'border-blue-100' : 'border-purple-100',
    accent: isEmp ? 'text-blue-500' : 'text-purple-500'
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-500 overflow-x-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-[120px] animate-pulse`}></div>
        <div className={`absolute bottom-0 right-1/4 w-96 h-96 ${isEmp ? 'bg-cyan-400/10' : 'bg-purple-400/10'} rounded-full blur-[120px] animate-pulse delay-700`}></div>
      </div>

      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => onNavigate('landing')}
            className="group flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Exit</span>
          </button>
          <div className="flex items-center gap-2">
            <Shield className={`w-6 h-6 ${theme.accent}`} />
            <span className="font-bold text-gray-900 dark:text-white">Security Center</span>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-32 px-4 relative">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-24 animate-fade-in">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-900 shadow-xl border border-gray-100 dark:border-gray-800 mb-8`}>
              <Fingerprint className="w-5 h-5 text-purple-500" />
              <span className="text-xs font-black uppercase tracking-widest text-gray-500">Your Privacy, Our Priority</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter">
              Fortified Security for <br />
              <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>Your Financial Life</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              We understand that tracking expenses is personal. That's why we've built CampusSpend with multi-layered security protocols to keep student and employee data safe from any threat.
            </p>
          </div>

          {/* 3D Interactive Feature Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-24">
            {securityFeatures.map((feature, index) => (
              <div 
                key={index} 
                className="group relative perspective-1000 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
              >
                <Card className="p-10 border-0 bg-white/80 dark:bg-gray-900/50 backdrop-blur-md shadow-2xl rounded-[2.5rem] transform-gpu transition-all duration-500 group-hover:rotate-x-2 group-hover:rotate-y-2 group-hover:-translate-y-2 overflow-hidden">
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${theme.gradient} opacity-[0.05] rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700`}></div>
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">{feature.tag}</span>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{feature.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          {/* Compliance Section */}
          <Card className="p-12 md:p-20 border-0 bg-gray-900 text-white rounded-[3rem] overflow-hidden relative mb-24">
            <div className="absolute top-0 right-0 p-20 opacity-5">
              <ShieldCheck className="w-64 h-64" />
            </div>
            <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-black mb-8 leading-tight">Strict Privacy <br />Standards</h2>
                <p className="text-gray-400 mb-10 text-lg leading-relaxed">
                  Whether you are a student managing pocket money or an employee tracking professional salary, your data never leaves your account. We do not sell or share your data with third parties.
                </p>
                <div className="space-y-6">
                  {[
                    "No Third-Party Tracking",
                    "End-to-End Encrypted Sync",
                    "Regular Security Audits",
                    "Zero-Knowledge Architecture"
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                        <FileCheck className="w-3.5 h-3.5 text-green-400" />
                      </div>
                      <span className="font-bold text-sm text-gray-200">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10 text-center hover:bg-white/10 transition-colors">
                  <EyeOff className="w-10 h-10 text-blue-400 mx-auto mb-4" />
                  <h4 className="font-bold text-sm">Privacy First</h4>
                </div>
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10 text-center hover:bg-white/10 transition-colors">
                  <RefreshCcw className="w-10 h-10 text-purple-400 mx-auto mb-4" />
                  <h4 className="font-bold text-sm">Instant Sync</h4>
                </div>
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10 text-center hover:bg-white/10 transition-colors">
                  <Bell className="w-10 h-10 text-amber-400 mx-auto mb-4" />
                  <h4 className="font-bold text-sm">Secure Alerts</h4>
                </div>
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10 text-center hover:bg-white/10 transition-colors">
                  <Globe className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
                  <h4 className="font-bold text-sm">Global CDN</h4>
                </div>
              </div>
            </div>
          </Card>

          {/* Bottom Action */}
          <div className="text-center">
             <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Trust is our foundation.</h3>
             <Button 
              onClick={() => onNavigate('landing')}
              size="lg"
              className={`h-14 px-10 rounded-2xl bg-gradient-to-r ${theme.gradient} text-white font-bold shadow-2xl hover:scale-105 transition-transform`}
             >
               Explore with Confidence
             </Button>
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .perspective-1000 {
          perspective: 1000px;
        }
        .rotate-x-2 {
          transform: rotateX(2deg);
        }
        .rotate-y-2 {
          transform: rotateY(2deg);
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
    </div>
  );
}
