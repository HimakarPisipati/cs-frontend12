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
} from "lucide-react";

interface ContactUsPageProps {
  onNavigate: (page: string) => void;
  userMode?: string;
}

export function ContactUsPage({ onNavigate, userMode = "student" }: ContactUsPageProps) {
  const isEmp = userMode === "employee";
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains("dark") ||
      localStorage.getItem("theme") === "dark";
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: ""
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
    }, 1500);
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
            <div className="lg:col-span-3">
              <Card className="p-8 border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md relative overflow-hidden">
                {isSubmitted ? (
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
                            placeholder="name@email.com"
                            className="h-12 bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 focus:border-purple-500"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
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
