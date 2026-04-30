import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { 
  Smartphone, 
  Apple, 
  Play, 
  Zap, 
  ShieldCheck, 
  Bell, 
  Camera, 
  ArrowLeft,
  CheckCircle2,
  Globe,
  Wallet
} from "lucide-react";

interface MobileAppPageProps {
  onNavigate: (page: string) => void;
  userMode?: string;
}

export function MobileAppPage({ onNavigate, userMode = 'student' }: MobileAppPageProps) {
  const isEmp = userMode === 'employee';
  
  const theme = {
    gradient: isEmp ? 'from-blue-600 to-cyan-600' : 'from-purple-600 to-blue-600',
    text: isEmp ? 'text-blue-600' : 'text-purple-600',
    bg: isEmp ? 'bg-blue-50' : 'bg-purple-50',
    border: isEmp ? 'border-blue-100' : 'border-purple-100',
    icon: isEmp ? 'text-blue-500' : 'text-purple-500',
    badge: isEmp ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
  };

  const features = [
    {
      icon: <Bell className={`w-6 h-6 ${theme.icon}`} />,
      title: "Instant Notifications",
      description: "Get real-time alerts for every transaction and budget limit warning."
    },
    {
      icon: <Camera className={`w-6 h-6 ${theme.icon}`} />,
      title: "Receipt Scanner",
      description: "Simply snap a photo of your bills and let AI categorize them automatically."
    },
    {
      icon: <ShieldCheck className={`w-6 h-6 ${theme.icon}`} />,
      title: "Biometric Security",
      description: "Lock your financial data with FaceID or Fingerprint authentication."
    },
    {
      icon: <Zap className={`w-6 h-6 ${theme.icon}`} />,
      title: "Offline Mode",
      description: "Add transactions even without internet; we'll sync when you're back online."
    }
  ];

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
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white">CampusSpend</span>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${theme.badge} text-xs font-bold uppercase tracking-wider mb-6`}>
                <Smartphone className="w-4 h-4" />
                Mobile App Now Available
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Manage your money <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>on the go</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
                Take the power of {isEmp ? 'CampusSpend Pro' : 'CampusSpend'} with you. Available now for both iOS and Android devices with a seamless sync experience.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-black hover:bg-gray-800 text-white rounded-2xl h-16 px-8 flex items-center gap-3 transition-transform hover:scale-105"
                >
                  <div className="text-left">
                    <div className="text-[10px] uppercase font-bold opacity-70">Download on the</div>
                    <div className="text-xl font-bold leading-none">App Store</div>
                  </div>
                </Button>
                
                <Button 
                  size="lg" 
                  className="bg-black hover:bg-gray-800 text-white rounded-2xl h-16 px-8 flex items-center gap-3 transition-transform hover:scale-105"
                >
                  <div className="text-left">
                    <div className="text-[10px] uppercase font-bold opacity-70">Get it on</div>
                    <div className="text-xl font-bold leading-none">Google Play</div>
                  </div>
                </Button>
              </div>

              <div className="mt-8 flex items-center gap-6">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-[10px] font-bold">U{i}</div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-bold text-gray-900 dark:text-white">10k+</span> students already using the app
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className={`absolute -inset-4 bg-gradient-to-r ${theme.gradient} rounded-3xl blur-2xl opacity-20 animate-pulse`}></div>
              <img 
                src="/mobile-app-mockup.png" 
                alt="Mobile App Mockup" 
                className="relative rounded-3xl w-full shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className={`py-20 ${theme.bg} dark:bg-gray-800/30 transition-colors`}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Designed for your device
              </h2>
              <p className="text-gray-600 dark:text-gray-400">Optimized for performance and accessibility on both major platforms.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-8 bg-white dark:bg-gray-800 border-0 shadow-xl overflow-hidden relative group">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150`}></div>
                <div className="flex items-center gap-4 mb-8">
                  <div>
                    <h3 className="text-xl font-bold dark:text-white">CampusSpend for iOS</h3>
                    <p className="text-sm text-gray-500">Requires iOS 15.0 or later</p>
                  </div>
                </div>
                <ul className="space-y-4">
                  {['Swift UI native performance', 'Interactive Widgets', 'Apple Pay integration', 'Siri Shortcuts support'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-8 bg-white dark:bg-gray-800 border-0 shadow-xl overflow-hidden relative group">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150`}></div>
                <div className="flex items-center gap-4 mb-8">
                  <div>
                    <h3 className="text-xl font-bold dark:text-white">CampusSpend for Android</h3>
                    <p className="text-sm text-gray-500">Requires Android 8.0 or later</p>
                  </div>
                </div>
                <ul className="space-y-4">
                  {['Material You dynamic theme', 'Customizable Widgets', 'Google Pay support', 'Multi-window multitasking'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* App Features */}
        <section className="py-20 max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Mobile-Exclusive Features
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Everything you love about CampusSpend, optimized for your pocket.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-all">
                <div className={`w-12 h-12 ${theme.bg} rounded-xl flex items-center justify-center mb-6`}>
                  {feature.icon}
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Global Access */}
        <section className="max-w-4xl mx-auto px-4 text-center py-20">
          <div className={`w-20 h-20 bg-gradient-to-br ${theme.gradient} rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-purple-500/20`}>
            <Globe className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Sync across all your devices
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
            Start adding an expense on your phone and see it instantly on your desktop. Your financial data is always in sync, always accessible.
          </p>
          <Button 
            onClick={() => onNavigate('signup')}
            className={`h-12 px-8 bg-gradient-to-r ${theme.gradient} text-white rounded-xl font-bold hover:shadow-lg transition-all`}
          >
            Create Your Account
          </Button>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className={`w-8 h-8 bg-gradient-to-br ${theme.gradient} rounded-lg flex items-center justify-center`}>
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white">CampusSpend</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">© 2026 CampusSpend. All rights reserved.</p>
          <div className="flex justify-center gap-6">
            <button onClick={() => onNavigate('privacy-policy')} className="text-xs text-gray-400 hover:text-gray-600">Privacy Policy</button>
            <button onClick={() => onNavigate('help-center')} className="text-xs text-gray-400 hover:text-gray-600">Help Center</button>
            <button onClick={() => onNavigate('contact-us')} className="text-xs text-gray-400 hover:text-gray-600">Contact Us</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
