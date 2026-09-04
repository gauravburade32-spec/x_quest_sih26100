import React from 'react';
import { ShieldCheck, Eye, UserCheck, History, AlertTriangle, FilePieChart } from 'lucide-react';
import { useLandingTheme } from './LandingThemeContext';

export const WhyBidsureSection: React.FC = () => {
  const { theme } = useLandingTheme();
  const isDark = theme === 'dark';

  const pillars = [
    {
      title: 'Evidence-Based Evaluation',
      desc: 'Every compliance decision is directly anchored to verified page excerpts and extracted document clauses.',
      icon: <ShieldCheck className="w-6 h-6" />,
      badge: 'Page Traceability',
      colorDark: 'text-blue-400',
      colorLight: 'text-blue-600',
    },
    {
      title: 'Transparent AI Reasoning',
      desc: 'Deterministic rules and explainable logs replace opaque black-box scoring with clear verification steps.',
      icon: <Eye className="w-6 h-6" />,
      badge: 'Zero Black Box',
      colorDark: 'text-cyan-400',
      colorLight: 'text-blue-600',
    },
    {
      title: 'Human-in-the-Loop Governance',
      desc: 'Puts procurement officers in full control with mandatory decision rationale and official GeM notice tools.',
      icon: <UserCheck className="w-6 h-6" />,
      badge: 'Officer Authority',
      colorDark: 'text-indigo-400',
      colorLight: 'text-indigo-600',
    },
    {
      title: 'Complete Traceability',
      desc: 'Immutable audit logs record every evaluation action, rule execution, and officer confirmation timestamp.',
      icon: <History className="w-6 h-6" />,
      badge: 'Cryptographic Logs',
      colorDark: 'text-purple-400',
      colorLight: 'text-indigo-600',
    },
    {
      title: 'Proactive Risk Mitigation',
      desc: 'Surfaces financial turnover deficits, missing EMD proofs, and expired registration certificates automatically.',
      icon: <AlertTriangle className="w-6 h-6" />,
      badge: 'Early Warnings',
      colorDark: 'text-amber-400',
      colorLight: 'text-amber-600',
    },
    {
      title: 'Audit-Ready Reporting',
      desc: 'Generates standardized executive PDF summary reports and structured JSON exports with one click.',
      icon: <FilePieChart className="w-6 h-6" />,
      badge: 'Executive PDF',
      colorDark: 'text-emerald-400',
      colorLight: 'text-emerald-600',
    },
  ];

  return (
    <section id="about" className={`py-24 relative overflow-hidden transition-colors duration-300 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className={`text-xs font-bold uppercase tracking-widest block font-mono ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
            WHY BIDSURE AI
          </span>
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Built for Integrity, Speed & Public Trust
          </h2>
          <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Designed specifically for public sector procurement teams requiring verifiable accuracy and zero ambiguity
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((item, idx) => {
            const iconColor = isDark ? item.colorDark : item.colorLight;
            return (
              <div
                key={idx}
                className={`p-7 rounded-2xl space-y-4 transition-all duration-300 group border ${
                  isDark
                    ? 'bg-slate-900/40 border-slate-800/80 hover:border-blue-500/40 shadow-xl hover:shadow-2xl'
                    : 'bg-white border-slate-200/80 hover:border-blue-300 shadow-xs hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform border ${
                      isDark ? 'bg-slate-950 border-slate-800' : 'bg-blue-50 border-blue-100'
                    }`}
                  >
                    {React.cloneElement(item.icon as React.ReactElement<{ className: string }>, {
                      className: `w-6 h-6 ${iconColor}`,
                    })}
                  </div>
                  <span
                    className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-md border ${
                      isDark
                        ? 'text-slate-300 bg-slate-800/60 border-slate-700/60'
                        : 'text-slate-700 bg-slate-100 border-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className={`text-lg font-bold transition-colors ${isDark ? 'text-white group-hover:text-blue-300' : 'text-slate-900 group-hover:text-blue-700'}`}>
                    {item.title}
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
