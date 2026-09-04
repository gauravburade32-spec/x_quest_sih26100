import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useLandingTheme } from './LandingThemeContext';

export const CtaBanner: React.FC = () => {
  const { theme } = useLandingTheme();
  const isDark = theme === 'dark';

  return (
    <section className={`py-20 relative overflow-hidden transition-colors duration-300 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          className={`rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden transition-all duration-300 border ${
            isDark
              ? 'bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-blue-800/50 shadow-2xl'
              : 'bg-navy-950 border-navy-900 shadow-xl'
          }`}
        >
          {/* Subtle Ambient Light */}
          {isDark ? (
            <>
              <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-500/20 blur-[90px] rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-cyan-500/20 blur-[90px] rounded-full pointer-events-none" />
            </>
          ) : (
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-600/10 blur-[90px] rounded-full pointer-events-none" />
          )}

          <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border ${
                isDark
                  ? 'bg-blue-900/60 border-blue-500/40 text-blue-300'
                  : 'bg-navy-900 border-navy-800 text-brand-300'
              }`}
            >
              {isDark ? <Sparkles className="w-4 h-4 text-cyan-400" /> : <ShieldCheck className="w-4 h-4 text-brand-400" />}
              <span>Enterprise Procurement Standard</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Make Every Procurement Decision More Transparent.
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Evaluate bids with AI-powered evidence, compliance verification, and risk intelligence in a secure, audit-ready platform built for government teams.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/dashboard"
                className={`w-full sm:w-auto px-8 py-3.5 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2.5 group ${
                  isDark
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20'
                }`}
              >
                <span>Open Evaluation Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#features"
                className={`w-full sm:w-auto px-6 py-3.5 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 border ${
                  isDark
                    ? 'bg-slate-900/80 hover:bg-slate-800 border-slate-700 text-slate-200'
                    : 'bg-navy-900 hover:bg-navy-800 border-navy-800 text-slate-200'
                }`}
              >
                <span>Explore Features</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
