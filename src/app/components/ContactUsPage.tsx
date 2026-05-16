import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  ArrowLeft,
  Mail,
  MessageSquare,
  MapPin,
  Phone,
  Send,
  Linkedin,
  Github,
  Twitter,
  Globe,
  Wallet,
  Sun,
  Moon,
  CheckCircle2,
  AlertCircle,
  Shield
} from "lucide-react";
import { submitSupportTicket, getUserSupportTickets } from "../../api/services";
import { Badge } from "./ui/badge";

interface ContactUsPageProps {
  onNavigate: (page: string) => void;
  userMode?: string;
}

export function ContactUsPage({ onNavigate, userMode = "student" }: ContactUsPageProps) {
  const isEmp = userMode === "employee";
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains("dark") ||
      localStorage.getItem("theme") !== "light";
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
    user_id: ""
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"send" | "tickets">("send");
  const [myTickets, setMyTickets] = useState<any[]>([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setIsLoggedIn(true);
        setFormData(prev => ({
          ...prev,
          name: user.name || "",
          email: user.email || "",
          user_id: user._id || user.id || ""
        }));
      } catch (e) {
        console.error("Error parsing user for contact form", e);
      }
    }
  }, []);

  useEffect(() => {
    if (activeTab === "tickets" && isLoggedIn) {
      loadTickets();
    }
  }, [activeTab, isLoggedIn]);

  const loadTickets = async () => {
    setIsLoadingTickets(true);
    try {
      const res = await getUserSupportTickets();
      setMyTickets(res.data || []);
    } catch (error) {
      console.error("Failed to load tickets", error);
    } finally {
      setIsLoadingTickets(false);
    }
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitSupportTicket(formData);
      setIsSubmitted(true);
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      setFormData({ 
        name: user?.name || "", 
        email: user?.email || "", 
        subject: "General Inquiry", 
        message: "",
        user_id: user?._id || user?.id || ""
      });
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: <Mail className={`w-6 h-6 ${isEmp ? 'text-blue-600' : 'text-purple-600'}`} />,
      title: "Email Us",
      value: "campusspend@gmail.com",
      description: "Our support team usually responds within 24 hours.",
      link: "mailto:campusspend@gmail.com"
    },
    {
      icon: <MapPin className={`w-6 h-6 ${isEmp ? 'text-cyan-600' : 'text-blue-600'}`} />,
      title: "Our Location",
      value: "Hyderabad, India",
      description: "Visit us at our student-focused development hub.",
      link: "#"
    },
    {
      icon: <Phone className={`w-6 h-6 ${isEmp ? 'text-blue-600' : 'text-green-600'}`} />,
      title: "Call Us",
      value: "+91 98765 43210",
      description: "Available Mon-Fri, 9am to 6pm IST.",
      link: "tel:+919876543210"
    }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${isEmp ? 'from-blue-50 via-cyan-50 to-green-50' : 'from-purple-50 via-blue-50 to-green-50'} dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 transition-colors duration-300`}>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate(localStorage.getItem("token") ? "settings" : "landing")}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white -ml-2"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-700" />
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 bg-gradient-to-br ${isEmp ? 'from-blue-500 to-cyan-500' : 'from-purple-500 to-blue-500'} rounded-lg flex items-center justify-center`}>
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <span className={`text-lg font-bold bg-gradient-to-r ${isEmp ? 'from-blue-600 to-cyan-600' : 'from-purple-600 to-blue-600'} bg-clip-text text-transparent`}>
                  {isEmp ? 'CampusSpend Pro' : 'CampusSpend'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Get in Touch
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Have questions about CampusSpend? We're here to help you manage your money better.
            Reach out to our team anytime.
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className={`absolute -top-24 -left-24 w-96 h-96 ${isEmp ? 'bg-blue-500/10' : 'bg-purple-500/10'} rounded-full blur-3xl`}></div>
          <div className={`absolute -bottom-24 -right-24 w-96 h-96 ${isEmp ? 'bg-cyan-500/10' : 'bg-blue-500/10'} rounded-full blur-3xl`}></div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">

            {/* Contact Info Sidebar */}
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-6">
                {contactMethods.map((method, idx) => (
                  <Card key={idx} className="p-6 border-0 shadow-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center shrink-0">
                        {method.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-1">{method.title}</h3>
                        <a href={method.link} className={`${isEmp ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'} font-medium hover:underline block mb-1`}>
                          {method.value}
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{method.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Card className={`p-8 border-0 shadow-lg bg-gradient-to-br ${isEmp ? 'from-blue-600 to-cyan-600' : 'from-purple-600 to-blue-600'} text-white overflow-hidden relative group`}>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-4">Connect on Social</h3>
                  <p className={`${isEmp ? 'text-blue-50' : 'text-purple-50'} mb-6 text-sm`}>Follow us for financial tips, updates, and student stories.</p>
                  <div className="flex gap-4">
                    <a href="#" className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors">
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors">
                      <Github className="w-5 h-5" />
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors">
                      <Globe className="w-5 h-5" />
                    </a>
                  </div>
                </div>
                {/* Decorative blob */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform"></div>
              </Card>
            </div>

            {/* Contact Form */}
            {/* Contact Form & My Tickets */}
            <div className="lg:col-span-3">
              {isLoggedIn && (
                <div className="flex gap-2 mb-6 bg-white/50 dark:bg-gray-800/50 p-1 rounded-xl border border-gray-200 dark:border-gray-700 w-fit">
                  <button
                    onClick={() => setActiveTab("send")}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                      activeTab === "send"
                        ? `bg-gradient-to-r ${isEmp ? 'from-blue-600 to-cyan-600' : 'from-purple-600 to-blue-600'} text-white shadow-md`
                        : "text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700"
                    }`}
                  >
                    Send Message
                  </button>
                  <button
                    onClick={() => setActiveTab("tickets")}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                      activeTab === "tickets"
                        ? `bg-gradient-to-r ${isEmp ? 'from-blue-600 to-cyan-600' : 'from-purple-600 to-blue-600'} text-white shadow-md`
                        : "text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700"
                    }`}
                  >
                    My Replies
                    {myTickets.some(t => t.status === 'resolved' && !t.read_by_user) && (
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    )}
                  </button>
                </div>
              )}

              <Card className="p-8 border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md relative overflow-hidden">
                {activeTab === "tickets" ? (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                      <Shield className={`w-6 h-6 ${isEmp ? 'text-blue-600' : 'text-purple-600'}`} />
                      Support History
                    </h2>
                    
                    {isLoadingTickets ? (
                      <div className="py-12 flex justify-center">
                        <div className={`w-10 h-10 border-4 ${isEmp ? 'border-blue-500/20 border-t-blue-500' : 'border-purple-500/20 border-t-purple-500'} rounded-full animate-spin`}></div>
                      </div>
                    ) : (myTickets || []).length === 0 ? (
                      <div className="py-12 text-center text-gray-500">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>You haven't submitted any tickets yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {(myTickets || []).map((ticket) => (
                          <div key={ticket.id} className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 hover:border-purple-500/30 transition-all">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                  ticket.status === 'pending' ? 'bg-orange-500/10 text-orange-600' : 'bg-green-500/10 text-green-600'
                                }`}>
                                  {ticket.status}
                                </span>
                                <h4 className="font-bold text-gray-900 dark:text-white">{ticket.subject}</h4>
                              </div>
                              <span className="text-[10px] text-gray-500">{new Date(ticket.created_at).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{ticket.message}</p>
                            
                            {ticket.admin_response && (
                              <div className={`p-4 rounded-xl ${isEmp ? 'bg-blue-500/5 border-blue-500/10' : 'bg-purple-500/5 border-purple-500/10'} border mt-2 animate-in slide-in-from-top-2 duration-300`}>
                                <div className="flex items-center gap-2 mb-2">
                                  <Shield className={`w-3 h-3 ${isEmp ? 'text-blue-500' : 'text-purple-500'}`} />
                                  <span className={`text-[10px] font-bold uppercase ${isEmp ? 'text-blue-500' : 'text-purple-500'}`}>Support Team Response</span>
                                </div>
                                <p className="text-sm text-gray-800 dark:text-gray-200 italic">"{ticket.admin_response}"</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : isSubmitted ? (
                  <div className="py-12 text-center space-y-6 animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto text-green-600 dark:text-green-400">
                      <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h2>
                      <p className="text-gray-600 dark:text-gray-400">Thank you for reaching out. We'll get back to you shortly.</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setIsSubmitted(false)}
                      className="mt-4"
                    >
                      Send another message
                    </Button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                      <MessageSquare className={`w-6 h-6 ${isEmp ? 'text-blue-600' : 'text-purple-600'}`} />
                      Send a Message
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Your Name</label>
                          <Input
                            required
                            placeholder="Rahul Kumar"
                            className="h-12 bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 focus:border-purple-500"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                          <Input
                            required
                            type="email"
                            readOnly={isLoggedIn}
                            placeholder="name@email.com"
                            className={`h-12 ${isLoggedIn ? 'bg-gray-100 dark:bg-gray-800/50 cursor-not-allowed text-gray-500' : 'bg-gray-50 dark:bg-gray-700/50'} border-gray-200 dark:border-gray-700 focus:border-purple-500`}
                            value={formData.email}
                            onChange={(e) => !isLoggedIn && setFormData({ ...formData, email: e.target.value })}
                          />
                          {isLoggedIn && (
                            <p className="text-[10px] text-gray-500 ml-1">Using your registered account email.</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Subject</label>
                        <select
                          className="w-full h-12 px-3 rounded-md bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-sm outline-none transition-all dark:text-white"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        >
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Support Request">Support Request</option>
                          <option value="Feature Suggestion">Feature Suggestion</option>
                          <option value="Bug Report">Bug Report</option>
                          <option value="Business Partnership">Business Partnership</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Message</label>
                        <Textarea
                          required
                          placeholder="How can we help you today?"
                          className="min-h-[160px] bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 focus:border-purple-500"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full h-14 bg-gradient-to-r ${isEmp ? 'from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-blue-500/25' : 'from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-purple-500/25'} text-lg font-bold shadow-lg`}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Sending...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Send className="w-5 h-5" />
                            Send Message
                          </div>
                        )}
                      </Button>
                    </form>
                  </>
                )}
              </Card>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
              <div className={`w-8 h-8 bg-gradient-to-br ${isEmp ? 'from-blue-500 to-cyan-500' : 'from-purple-500 to-blue-500'} rounded-lg flex items-center justify-center`}>
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white">{isEmp ? 'CampusSpend Pro' : 'CampusSpend'}</span>
            </div>
            <p className="text-sm mb-6 max-w-md mx-auto">Making money management simple for students and professionals everywhere.</p>
            <div className="flex justify-center gap-8 text-sm">
              <button onClick={() => onNavigate(localStorage.getItem("token") ? "dashboard" : "landing")} className="hover:text-white transition-colors text-sm font-normal">Home</button>
              <button onClick={() => onNavigate('privacy-policy')} className="hover:text-white transition-colors text-sm font-normal">Privacy</button>
              <button onClick={() => onNavigate('help-center')} className="hover:text-white transition-colors text-sm font-normal">Help Center</button>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800">
              <p>&copy; 2026 CampusSpend. Made By Himakar. All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
