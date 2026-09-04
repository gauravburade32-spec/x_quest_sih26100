'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  RotateCcw,
  ChevronRight,
  MessageSquareText,
} from 'lucide-react';
import {
  ChatCategory,
  ChatMessage,
  CHAT_CATEGORIES,
  FALLBACK_MESSAGE,
  getQuestionsByCategory,
  findMatchingAnswer,
} from '@/data/chatbotData';

export const BidSureAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ChatCategory | 'All'>('All');
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const initialWelcomeMessage: ChatMessage = {
    id: 'msg-welcome',
    sender: 'assistant',
    text: 'Hello! I am the **BidSure Assistant**, your dedicated decision-support guide for public procurement evaluations. Select a category or pick a suggested question below to get started.',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialWelcomeMessage]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when messages or typing state changes
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  const handleQuestionClick = (questionText: string) => {
    submitUserQuery(questionText);
  };

  const handleSendSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isTyping) return;
    const query = inputValue.trim();
    setInputValue('');
    submitUserQuery(query);
  };

  const submitUserQuery = (query: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: timeStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate local lookup delay (350ms) for natural feedback
    setTimeout(() => {
      const match = findMatchingAnswer(query);
      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: match ? match.answer : FALLBACK_MESSAGE,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: match?.category,
        isFallback: !match,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 350);
  };

  const handleResetChat = () => {
    setMessages([initialWelcomeMessage]);
    setSelectedCategory('All');
    setInputValue('');
    setIsTyping(false);
  };

  const currentQuestions = getQuestionsByCategory(
    selectedCategory === 'All' ? undefined : selectedCategory
  );

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-navy-950 text-slate-200 border border-navy-800 shadow-lg text-xs font-semibold hover:bg-navy-900 transition-all cursor-pointer group"
            aria-label="Open BidSure Assistant"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white font-bold group-hover:text-brand-300 transition-colors">
              BidSure Assistant
            </span>
          </button>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close BidSure Assistant' : 'Open BidSure Assistant'}
          aria-expanded={isOpen}
          className={`w-13 h-13 rounded-full flex items-center justify-center shadow-xl transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
            isOpen
              ? 'bg-slate-800 hover:bg-slate-900 text-white scale-95'
              : 'bg-gradient-to-tr from-navy-950 via-navy-900 to-brand-600 text-white hover:scale-105 shadow-brand-500/20'
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <div className="relative flex items-center justify-center">
              <Bot className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-navy-950" />
            </div>
          )}
        </button>
      </div>

      {/* Floating Chat Panel Container */}
      {isOpen && (
        <div
          className="fixed bottom-20 right-4 sm:bottom-22 sm:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm sm:w-[400px] h-[540px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
          role="dialog"
          aria-label="BidSure Assistant Chat Window"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white px-4 py-3.5 border-b border-navy-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-600/30 border border-brand-400/40 text-brand-300 flex items-center justify-center font-bold shrink-0 shadow-xs">
                <ShieldCheck className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white tracking-wide">
                  BidSure Assistant
                </h2>
                <p className="text-[11px] text-slate-400 font-medium">
                  Procurement Evaluation Support
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                title="Reset conversation"
                aria-label="Reset conversation"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-navy-800 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-navy-800 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Scroll Container */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 bg-slate-50/60 font-sans">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`p-3.5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-brand-600 text-white rounded-2xl rounded-tr-xs ml-8 max-w-[85%] font-medium'
                      : msg.isFallback
                      ? 'bg-amber-50/90 text-amber-900 border border-amber-200/80 rounded-2xl rounded-tl-xs mr-6 max-w-[90%]'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-2xl rounded-tl-xs mr-6 max-w-[90%]'
                  }`}
                >
                  {msg.sender === 'assistant' && (
                    <div className="flex items-center gap-1.5 mb-1 text-[10px] font-bold uppercase tracking-wider text-brand-600">
                      <Sparkles className="w-3 h-3 text-brand-500" />
                      <span>BidSure Guide</span>
                      {msg.category && (
                        <span className="text-slate-400 font-normal">
                          • {msg.category}
                        </span>
                      )}
                    </div>
                  )}

                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {/* Local Simulated Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-3 rounded-2xl rounded-tl-xs border border-slate-200/80 mr-12 w-fit">
                <Bot className="w-4 h-4 text-brand-600 animate-spin" />
                <span className="text-[11px] font-medium text-slate-600">
                  BidSure Assistant is typing...
                </span>
                <div className="flex gap-1 ml-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce" />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce"
                    style={{ animationDelay: '150ms' }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce"
                    style={{ animationDelay: '300ms' }}
                  />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Category Filters & Suggested Questions Section */}
          <div className="p-3 bg-white border-t border-slate-200/80 space-y-2 shrink-0">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition-all cursor-pointer ${
                  selectedCategory === 'All'
                    ? 'bg-navy-900 text-white shadow-xs font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Categories
              </button>
              {CHAT_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-navy-900 text-white shadow-xs font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Clickable Suggested Questions Chips (max 3 displayed at once to save space) */}
            <div className="space-y-1.5 max-h-28 overflow-y-auto pr-0.5">
              {currentQuestions.slice(0, 3).map((qa) => (
                <button
                  key={qa.id}
                  onClick={() => handleQuestionClick(qa.question)}
                  disabled={isTyping}
                  className="w-full text-left p-2 rounded-xl text-xs bg-slate-50 hover:bg-brand-50 text-slate-700 hover:text-brand-700 border border-slate-200/80 hover:border-brand-300 transition-all font-medium flex items-center justify-between group cursor-pointer disabled:opacity-50"
                >
                  <span className="truncate pr-2">{qa.question}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-600 shrink-0" />
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendSubmit} className="flex items-center gap-2 pt-1">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask a procurement question..."
                disabled={isTyping}
                aria-label="Ask a procurement question"
                className="flex-1 bg-slate-50 border border-slate-300 text-slate-900 text-xs sm:text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white placeholder:text-slate-400 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                aria-label="Send message"
                className="p-2 rounded-xl bg-navy-900 text-white hover:bg-brand-600 disabled:opacity-40 disabled:hover:bg-navy-900 transition-colors shadow-xs cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="text-[10px] text-slate-400 text-center font-medium pt-0.5">
              BidSure Assistant • Predefined Evaluation Knowledge Base
            </div>
          </div>
        </div>
      )}
    </>
  );
};
