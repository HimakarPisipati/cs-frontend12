"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Trash2, 
  TrendingDown, 
  TrendingUp, 
  Wallet,
  MessageSquare,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { chatWithAI } from "../../api/services";

interface Message {
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

export function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickChips = [
    "How much did I spend on Food this month?",
    "Show my highest expense last week.",
    "Can I afford a 20,000 INR phone?",
    "Summarize my budget status."
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initial greeting
    if (messages.length === 0) {
      setMessages([
        {
          role: "ai",
          content: "Hello! I'm CampusSense, your personal financial guide. Ask me anything about your transactions, budgets, or savings! 👋",
          timestamp: new Date()
        }
      ]);
    }
  }, []);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Pass last 10 messages as history for context
      const history = messages.slice(-10).map(m => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.content
      }));

      const res = await chatWithAI(text, history);
      
      const aiMessage: Message = {
        role: "ai",
        content: res.data.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: "ai",
        content: "I'm sorry, I'm having trouble connecting to my brain. Please try again later! 🧠❌",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Simple Markdown Formatter to handle **bold** and bullet points
  const formatMessage = (content: string) => {
    // 1. Handle bold text: **text** -> <b>text</b>
    let formatted = content.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-indigo-600 dark:text-indigo-400">$1</strong>');
    
    // 2. Handle bullet points: * text -> • text
    formatted = formatted.replace(/^\* (.*)/gm, '<div class="flex gap-2 mb-1"><span>•</span><span>$1</span></div>');
    
    // 3. Handle line breaks
    formatted = formatted.replace(/\n/g, '<br />');

    return <div dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  const clearChat = () => {
    setMessages([
      {
        role: "ai",
        content: "Chat cleared. How else can I help you? 😊",
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">CampusSense</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">CampusSense Online</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={clearChat} className="text-gray-500 hover:text-red-500">
          <Trash2 className="w-4 h-4 mr-2" />
          Clear Chat
        </Button>
      </div>

      {/* Chat Area */}
      <Card className="flex-1 overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
          <AnimatePresence mode="popLayout">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                    msg.role === "user" 
                      ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600" 
                      : "bg-purple-100 dark:bg-purple-900/30 text-purple-600"
                  }`}>
                    {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-md rounded-tr-none"
                      : "bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 shadow-sm rounded-tl-none"
                  }`}>
                    {formatMessage(msg.content)}
                    <div className={`text-[10px] mt-2 opacity-60 ${msg.role === "user" ? "text-white/80" : "text-gray-400"}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100" />
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-gray-50/50 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-700">
          {/* Quick Chips */}
          {messages.length < 5 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {quickChips.map((chip, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(chip)}
                  className="text-xs px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors flex items-center gap-1 group"
                >
                  <Sparkles size={12} className="group-hover:rotate-12 transition-transform" />
                  {chip}
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <div className="relative flex-1">
              <Input
                placeholder="Ask about your spending..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend(input)}
                className="h-12 pr-12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500/20 rounded-xl"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                <MessageSquare size={18} className="text-gray-400" />
              </div>
            </div>
            <Button 
              onClick={() => handleSend(input)} 
              disabled={!input.trim() || isLoading}
              className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 shrink-0"
            >
              <Send size={18} />
            </Button>
          </div>
          <p className="text-[10px] text-center text-gray-400 mt-3">
            AI can make mistakes. Please verify important financial decisions.
          </p>
        </div>
      </Card>
    </div>
  );
}
