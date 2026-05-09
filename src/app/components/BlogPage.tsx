import { ArrowLeft, Search, Clock, ChevronRight, Sparkles, BookOpen, Newspaper, TrendingUp, ShieldCheck, Mail, ArrowRight, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface BlogPageProps {
  onNavigate: (page: string) => void;
  userMode?: string;
}

export function BlogPage({ onNavigate, userMode = 'student' }: BlogPageProps) {
  const isEmp = userMode === 'employee';

  const categories = ["All", "Student Life", "Pro Finance", "Tech Updates", "Productivity"];

  const posts = [
    {
      title: "Mastering the Student Budget: 5 Proven Strategies",
      excerpt: "Surviving college on a budget doesn't have to be hard. Learn the secrets to saving without sacrifice.",
      category: "Student Life",
      readTime: "5 min",
      date: "May 10, 2026",
      image: "https://images.unsplash.com/photo-1523240715630-999680ad7b43?auto=format&fit=crop&q=80&w=800",
      accent: "from-blue-500 to-purple-500"
    },
    {
      title: "How AI is Changing Personal Finance in 2026",
      excerpt: "From predictive spending to automated savings, explore the technology driving the next financial revolution.",
      category: "Tech Updates",
      readTime: "8 min",
      date: "May 8, 2026",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
      accent: "from-purple-500 to-pink-500",
      isFeatured: true
    },
    {
      title: "Tax Planning for Early Career Professionals",
      excerpt: "Maximize your take-home pay with these essential tax-saving tips for new employees.",
      category: "Pro Finance",
      readTime: "6 min",
      date: "May 5, 2026",
      image: "https://images.unsplash.com/photo-1454165833767-027ffea9e772?auto=format&fit=crop&q=80&w=800",
      accent: "from-emerald-500 to-teal-500"
    },
    {
      title: "The Security of Neon Serverless Postgres",
      excerpt: "Why we chose Neon to power CampusSpend and how it keeps your data safe and highly available.",
      category: "Tech Updates",
      readTime: "4 min",
      date: "May 2, 2026",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=800",
      accent: "from-orange-500 to-red-500"
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
        <div className={`absolute -top-20 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] animate-pulse`}></div>
        <div className={`absolute -bottom-20 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] animate-pulse delay-700`}></div>
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
            <BookOpen className={`w-6 h-6 ${theme.accent}`} />
            <span className="font-bold text-gray-900 dark:text-white tracking-tight">Campus Journal</span>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-32 px-4 relative">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 opacity-0 animate-fade-in">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-900 shadow-lg border border-gray-100 dark:border-gray-800 mb-8 transform-gpu hover:scale-105 transition-transform duration-500">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-black uppercase tracking-widest text-gray-500">Insights & Stories</span>
             </div>
             <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-6 tracking-tighter">
               Campus <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>Journal</span>
             </h1>
             <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-12">
               Your destination for financial literacy, product updates, and strategies to master your money.
             </p>

             {/* Categories */}
             <div className="flex flex-wrap justify-center gap-3 mb-12">
                {categories.map((cat, i) => (
                  <button 
                    key={i} 
                    className={`px-6 py-2 rounded-2xl text-sm font-bold transition-all duration-300 ${
                      i === 0 
                        ? `bg-gradient-to-r ${theme.gradient} text-white shadow-lg` 
                        : 'bg-white dark:bg-gray-900 text-gray-500 hover:text-gray-900 dark:hover:text-white border border-gray-100 dark:border-gray-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
             </div>
          </div>

          {/* Featured Post (3D Effect) */}
          {posts.filter(p => p.isFeatured).map((post, i) => (
            <div key={i} className="mb-20 perspective-1000 opacity-0 animate-fade-in group">
               <Card className="relative overflow-hidden border-0 bg-white dark:bg-gray-900 shadow-2xl rounded-[3rem] p-4 transform-gpu transition-all duration-700 group-hover:rotate-x-2 group-hover:rotate-y-1">
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                     <div className="relative aspect-video lg:aspect-square rounded-[2rem] overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <div 
                          className="w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                          style={{ backgroundImage: `url(${post.image})` }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-8 left-8">
                           <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">Featured Story</span>
                        </div>
                     </div>
                     <div className="p-8 lg:p-16">
                        <div className="flex items-center gap-6 text-xs font-black text-gray-400 mb-8 tracking-[0.2em]">
                           <span className={theme.text}>{post.category}</span>
                           <span className="opacity-30">|</span>
                           <span className="flex items-center gap-2 text-amber-500"><Clock className="w-4 h-4" /> {post.readTime}</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-8 leading-tight group-hover:translate-x-2 transition-transform duration-500">
                          {post.title}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-xl mb-12 leading-relaxed">
                          {post.excerpt}
                        </p>
                        <Button 
                          onClick={() => onNavigate('article', post)}
                          className={`h-16 px-10 rounded-2xl bg-gradient-to-r ${theme.gradient} text-white font-black shadow-2xl hover:scale-105 transition-transform`}
                        >
                          Read Featured Story
                          <ArrowRight className="w-6 h-6 ml-3" />
                        </Button>
                     </div>
                  </div>
               </Card>
            </div>
          ))}

          {/* Grid Section */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {posts.filter(p => !p.isFeatured).map((post, i) => (
              <div 
                key={i} 
                className="group perspective-1000 opacity-0 animate-fade-in" 
                style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}
              >
                <Card className="h-full min-h-[600px] border-0 bg-white dark:bg-gray-900 shadow-xl rounded-[3rem] overflow-hidden transform-gpu transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group flex flex-col">
                   <div className="relative aspect-video overflow-hidden bg-gray-200 dark:bg-gray-800 shrink-0">
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                        style={{ backgroundImage: `url(${post.image})` }}
                      ></div>
                      <div className="absolute inset-0 bg-black/5"></div>
                      <div className={`absolute top-6 left-6 px-4 py-1.5 rounded-xl bg-white dark:bg-gray-950 text-[10px] font-black uppercase tracking-[0.2em] ${theme.text} shadow-2xl z-30 border border-gray-100 dark:border-gray-800`}>
                        {post.category}
                      </div>
                   </div>
                   <div className="p-10 flex flex-col flex-1">
                      <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">
                         <span className="flex items-center gap-1.5 text-amber-500"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
                         <span className="opacity-30">|</span>
                         <span>{post.date}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-purple-500 transition-colors duration-300 leading-tight">
                        {post.title}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                        {post.excerpt}
                      </p>
                      <div className="mt-auto pt-6 border-t border-gray-50 dark:border-gray-800">
                        <button 
                          onClick={() => onNavigate('article', post)}
                          className="flex items-center gap-2 text-sm font-black text-gray-900 dark:text-white group/btn"
                        >
                           Read Full Story
                           <ArrowRight className={`w-5 h-5 group-hover/btn:translate-x-2 transition-transform ${theme.text}`} />
                        </button>
                      </div>
                   </div>
                </Card>
              </div>
            ))}
          </div>

          {/* Newsletter Section */}
          <div className="mt-32 opacity-0 animate-fade-in" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
             <Card className="relative p-12 md:p-20 border-0 bg-gray-900 text-white rounded-[3.5rem] overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5">
                   <Newspaper className="w-64 h-64" />
                </div>
                <div className="relative z-10 max-w-2xl mx-auto text-center">
                   <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center mx-auto mb-8 animate-bounce-slow">
                      <Mail className="w-8 h-8 text-blue-400" />
                   </div>
                   <h2 className="text-4xl font-black mb-6 tracking-tight">Level up your <span className="text-blue-400">Financial IQ</span></h2>
                   <p className="text-gray-400 text-lg mb-10">
                     Join 5,000+ students and professionals who receive our weekly newsletter on mastering money and productivity.
                   </p>
                   <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                      <input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="flex-1 h-14 px-6 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                      <Button className={`h-14 px-8 rounded-2xl bg-gradient-to-r ${theme.gradient} text-white font-bold shadow-xl hover:scale-105 transition-transform`}>
                        Subscribe
                      </Button>
                   </div>
                </div>
             </Card>
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .perspective-1000 {
          perspective: 1000px;
        }
        .rotate-x-1 { transform: rotateX(1deg); }
        .rotate-y-1 { transform: rotateY(1deg); }
        .rotate-x-2 { transform: rotateX(2deg); }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}} />
    </div>
  );
}
