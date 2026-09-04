import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, Sparkles, ArrowRight, Play, CheckCircle2, Zap, AlertTriangle, TrendingUp } from 'lucide-react';
import { useLandingTheme } from './LandingThemeContext';

interface HeroSectionProps {
  onExploreDashboard: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreDashboard }) => {
  const { theme } = useLandingTheme();
  const isDark = theme === 'dark';

  return (
    <section
      id="hero"
      className={`relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden transition-colors duration-300 ${
        isDark
          ? 'bg-slate-950'
          : 'bg-gradient-to-b from-blue-50/60 via-slate-50 to-slate-50'
      }`}
    >
      {/* Background Cyber Ambient Glow & Grid Lines */}
      {isDark ? (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-950 to-slate-950 pointer-events-none" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        </>
      ) : (
        <>
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-400/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f060_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f060_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Pill Badge */}
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold ${
                isDark
                  ? 'bg-blue-950/80 border border-blue-500/30 text-blue-300 shadow-inner'
                  : 'bg-blue-50 border border-blue-200/90 text-blue-800 shadow-2xs'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 animate-pulse ${isDark ? 'text-cyan-400' : 'text-blue-600'}`} />
              <span>AI-Powered Procurement Evaluation</span>
            </div>

            {/* Headline */}
            <h1
              className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Smarter Procurement. <br />
              Stronger Decisions. <br />
              {isDark ? (
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                  Powered by AI.
                </span>
              ) : (
                <span className="text-blue-600">
                  Powered by AI.
                </span>
              )}
            </h1>

            {/* Sub-headline / Copy */}
            <p className={`text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              BidSure AI assists government evaluation officers with AI-driven bid analysis, compliance verification, and risk assessment – ensuring transparency, accuracy, and accountability in every decision.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/dashboard"
                className={`w-full sm:w-auto px-8 py-3.5 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2.5 group ${
                  isDark
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/15'
                }`}
              >
                <span>Explore Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#how-it-works"
                className={`w-full sm:w-auto px-6 py-3.5 border font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 group ${
                  isDark
                    ? 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 hover:border-slate-700 text-slate-200 backdrop-blur-md'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-xs'
                }`}
              >
                <Play className={`w-4 h-4 group-hover:scale-110 transition-transform ${isDark ? 'text-blue-400 fill-blue-400' : 'text-blue-600 fill-blue-600'}`} />
                <span>See How It Works</span>
              </a>
            </div>

            {/* Trust Pillars */}
            <div className={`pt-6 border-t grid grid-cols-3 gap-4 text-center lg:text-left ${isDark ? 'border-slate-800/80' : 'border-slate-200/80'}`}>
              <div className="space-y-1">
                <div className={`flex items-center justify-center lg:justify-start gap-1.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  <Shield className="w-4 h-4" />
                  <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>AI-Powered</span>
                </div>
                <p className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Smart Analysis</p>
              </div>

              <div className="space-y-1">
                <div className={`flex items-center justify-center lg:justify-start gap-1.5 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>
                  <CheckCircle2 className="w-4 h-4" />
                  <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>100% Transparent</span>
                </div>
                <p className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Audit-Ready</p>
              </div>

              <div className="space-y-1">
                <div className={`flex items-center justify-center lg:justify-start gap-1.5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                  <Zap className="w-4 h-4" />
                  <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Faster Decisions</span>
                </div>
                <p className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Higher Accuracy</p>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Hero Graphic + Floating Metric Panels */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            
            {/* Ambient Background Aura */}
            <div className={`absolute inset-0 blur-[90px] rounded-full pointer-events-none ${isDark ? 'bg-gradient-to-tr from-blue-600/20 to-cyan-500/20' : 'bg-blue-500/10'}`} />

            {/* Main 3D Container Box */}
            <div
              className={`relative w-full max-w-lg lg:max-w-none rounded-3xl p-3 border group overflow-hidden ${
                isDark
                  ? 'bg-gradient-to-b from-slate-800/80 via-slate-900/60 to-slate-950/80 border-slate-700/60 shadow-[0_0_80px_rgba(37,99,235,0.25)] backdrop-blur-xl'
                  : 'bg-white border-slate-200/90 shadow-xl'
              }`}
            >
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-950">
                <Image
                  src="/images/bidsure_hero_3d.jpg"
                  alt="BidSure AI Digital Procurement HQ"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent ${isDark ? 'opacity-60' : 'opacity-40'}`} />
              </div>

              {/* Floating Metric 1: Compliance Score (Top Left) */}
              <div
                className={`absolute top-6 left-4 sm:left-6 backdrop-blur-md p-3.5 rounded-2xl shadow-2xl flex items-center gap-3.5 animate-bounce-slow border ${
                  isDark ? 'bg-slate-900/90 border-slate-700/80 text-white' : 'bg-white/95 border-slate-200/90 text-slate-900'
                }`}
              >
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <svg className="w-12 h-12 transform -rotate-90">
                    <circle cx="24" cy="24" r="18" stroke={isDark ? '#1e293b' : '#e2e8f0'} strokeWidth="4" fill="transparent" />
                    <circle cx="24" cy="24" r="18" stroke={isDark ? '#3b82f6' : '#2563eb'} strokeWidth="4" fill="transparent" strokeDasharray="113" strokeDashoffset="9" />
                  </svg>
                  <span className={`absolute font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>92%</span>
                </div>
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Compliance Score</span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md inline-block mt-0.5 border ${
                      isDark
                        ? 'text-emerald-400 bg-emerald-950/80 border-emerald-800/80'
                        : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                    }`}
                  >
                    Excellent
                  </span>
                </div>
              </div>

              {/* Floating Metric 2: Active Tenders (Top Right) */}
              <div
                className={`absolute top-4 right-4 sm:right-6 backdrop-blur-md p-3.5 rounded-2xl shadow-2xl space-y-1 border ${
                  isDark ? 'bg-slate-900/90 border-slate-700/80 text-white' : 'bg-white/95 border-slate-200/90 text-slate-900'
                }`}
              >
                <span className={`text-[10px] font-bold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Active Tenders</span>
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-extrabold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>128</span>
                  <span className={`text-[10px] font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>+12 this week</span>
                </div>
                <div className={`w-24 h-1 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                  <div className={`w-3/4 h-full rounded-full ${isDark ? 'bg-blue-500' : 'bg-blue-600'}`} />
                </div>
              </div>

              {/* Floating Metric 3: Risk Alerts (Right Middle) */}
              <div
                className={`absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 backdrop-blur-md p-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border ${
                  isDark
                    ? 'bg-slate-900/95 border-rose-800/80 text-white'
                    : 'bg-white/95 border-rose-200/90 text-slate-900'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                    isDark ? 'bg-rose-950/80 border-rose-800/80 text-rose-400' : 'bg-rose-50 border-rose-200 text-rose-600'
                  }`}
                >
                  <AlertTriangle className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Risk Alerts</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-lg font-bold font-mono ${isDark ? 'text-rose-400' : 'text-rose-600'}`}>3</span>
                    <span className={`text-[10px] font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Requires Attention</span>
                  </div>
                </div>
              </div>

              {/* Floating Metric 4: AI Accuracy (Bottom Right) */}
              <div
                className={`absolute bottom-6 right-6 backdrop-blur-md p-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border ${
                  isDark ? 'bg-slate-900/90 border-slate-700/80 text-white' : 'bg-white/95 border-slate-200/90 text-slate-900'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                    isDark ? 'bg-blue-950/80 border-blue-800/80 text-cyan-400' : 'bg-blue-50 border-blue-200 text-blue-600'
                  }`}
                >
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>AI Accuracy</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className={`text-base font-extrabold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>98.7%</span>
                    <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>This Month</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
