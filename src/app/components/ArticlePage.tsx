import { ArrowLeft, Clock, Calendar, Share2, Facebook, Twitter, Link as LinkIcon, Sparkles, BookOpen, User, ArrowRight, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface ArticlePageProps {
  article: {
    title: string;
    excerpt: string;
    category: string;
    readTime: string;
    date: string;
    image: string;
    accent: string;
  };
  onNavigate: (page: string) => void;
  userMode?: string;
}

export function ArticlePage({ article, onNavigate, userMode = 'student' }: ArticlePageProps) {
  const isEmp = userMode === 'employee';

  const theme = {
    gradient: isEmp ? 'from-blue-600 to-cyan-600' : 'from-purple-600 to-blue-600',
    text: isEmp ? 'text-blue-600' : 'text-purple-600',
    bg: isEmp ? 'bg-blue-50' : 'bg-purple-50',
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-500">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => onNavigate('blog')}
            className="group flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Journal</span>
          </button>
          <div className="flex items-center gap-4">
             <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all">
                <Share2 className="w-5 h-5" />
             </button>
             <Button className={`h-10 px-6 rounded-xl bg-gradient-to-r ${theme.gradient} text-white font-bold shadow-lg`}>
                Get Started
             </Button>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-32">
        {/* Article Hero */}
        <div className="max-w-4xl mx-auto px-4 mb-16">
           <div className="mb-8 animate-fade-in">
              <span className={`inline-block px-4 py-1.5 rounded-full ${theme.bg} ${theme.text} text-[10px] font-black uppercase tracking-widest mb-6`}>
                 {article.category}
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter leading-tight">
                 {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400 font-medium">
                 <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                       <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <span>By CampusSpend Team</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{article.date}</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{article.readTime} read</span>
                 </div>
              </div>
           </div>

           {/* Hero Image */}
           <div className="relative aspect-[21/9] rounded-[3rem] overflow-hidden shadow-2xl animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
              <div 
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${article.image})` }}
              ></div>
           </div>
        </div>

        {/* Content Section */}
        <div className="max-w-3xl mx-auto px-4">
           <div className="prose prose-lg dark:prose-invert max-w-none animate-fade-in" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
              <p className="text-xl leading-relaxed text-gray-600 dark:text-gray-300 font-medium italic border-l-4 border-purple-500 pl-6 mb-12">
                 "{article.excerpt}"
              </p>

              <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-[1.8]">
                 <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Introduction</h2>
                 <p>
                    Managing finances is one of the most critical skills for both students and early-career professionals. Yet, it's often the one thing we aren't taught in school. At CampusSpend, we believe that financial freedom starts with transparency and intelligent tracking.
                 </p>

                 <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Why it Matters Now</h2>
                 <p>
                    With the rise of digital transactions and instant payments, it's easier than ever to lose track of where your money is going. Small daily expenses—the extra coffee, the subscription you forgot to cancel, or the late-night snack—can add up to thousands of rupees over a month.
                 </p>

                 <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 my-12">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                       <Sparkles className="w-5 h-5 text-amber-500" />
                       Key Takeaways
                    </h3>
                    <ul className="space-y-4 list-none pl-0">
                       <li className="flex gap-3">
                          <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-1">
                             <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          </div>
                          <span>Always track your "Fixed" vs "Variable" expenses separately.</span>
                       </li>
                       <li className="flex gap-3">
                          <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-1">
                             <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          </div>
                          <span>Set a hard limit on your "Fun & Leisure" category.</span>
                       </li>
                       <li className="flex gap-3">
                          <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 mt-1">
                             <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          </div>
                          <span>Review your analytics weekly, not just monthly.</span>
                       </li>
                    </ul>
                 </div>

                 <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Looking Ahead</h2>
                 <p>
                    Our mission with CampusSpend is to automate these insights for you. As mentioned in our roadmap, we are working on AI Spending Predictions that will alert you before you exceed your budget, not after.
                 </p>

                 <p>
                    Until then, staying consistent with manual tracking is your most powerful tool. It builds the "financial muscle" needed for long-term wealth management.
                 </p>
              </div>

              {/* Interaction Bar */}
              <div className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors">
                       <Heart className="w-5 h-5" />
                       <span className="font-bold">245</span>
                    </button>
                    <div className="flex -space-x-2">
                       {[1,2,3].map(i => (
                         <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-950 bg-gray-200 dark:bg-gray-800"></div>
                       ))}
                       <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-950 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[10px] font-bold">
                          +12
                       </div>
                    </div>
                 </div>
                 <div className="flex gap-3">
                    <button className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:scale-110 transition-transform">
                       <Facebook className="w-5 h-5" />
                    </button>
                    <button className="p-3 rounded-full bg-cyan-50 dark:bg-cyan-900/20 text-cyan-500 hover:scale-110 transition-transform">
                       <Twitter className="w-5 h-5" />
                    </button>
                    <button className="p-3 rounded-full bg-gray-50 dark:bg-gray-900 text-gray-400 hover:scale-110 transition-transform">
                       <LinkIcon className="w-5 h-5" />
                    </button>
                 </div>
              </div>
           </div>
        </div>

        {/* Recommended Section */}
        <div className="max-w-5xl mx-auto px-4 mt-32">
           <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-12">Related Articles</h3>
           <div className="grid md:grid-cols-2 gap-8">
              {[1, 2].map(i => (
                <Card key={i} className="p-6 border-0 bg-gray-50 dark:bg-gray-900 rounded-[2rem] hover:bg-white dark:hover:bg-gray-800 transition-all cursor-pointer group">
                   <div className="flex gap-6 items-center">
                      <div className="w-24 h-24 rounded-2xl bg-gray-200 dark:bg-gray-700 overflow-hidden shrink-0">
                         <div className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=400)` }}></div>
                      </div>
                      <div>
                         <span className={`text-[10px] font-black uppercase tracking-widest ${theme.text} mb-2 block`}>Finance Tips</span>
                         <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-purple-500 transition-colors">How to split bills with roommates without the drama.</h4>
                      </div>
                   </div>
                </Card>
              ))}
           </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
    </div>
  );
}
