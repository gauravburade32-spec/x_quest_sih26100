import React from 'react';
import {
  FilePlus,
  ScanText,
  ListChecks,
  MapPin,
  ShieldAlert,
  Sparkles,
  UserCheck,
  History,
  CheckCircle2,
  Shield,
} from 'lucide-react';
import { useLandingTheme } from './LandingThemeContext';

export const WorkflowSection: React.FC = () => {
  const { theme } = useLandingTheme();
  const isDark = theme === 'dark';

  const steps = [
    {
      num: '01',
      title: 'Tender Ingestion',
      desc: 'Upload tender notice, specifications, and bidder submission packets.',
      icon: <FilePlus className="w-5 h-5" />,
    },
    {
      num: '02',
      title: 'Document & OCR Processing',
      desc: 'Sub-second document intelligence & high-accuracy OCR extraction.',
      icon: <ScanText className="w-5 h-5" />,
    },
    {
      num: '03',
      title: 'Requirement Extraction',
      desc: 'Automated clause breakdown and mandatory criteria identification.',
      icon: <ListChecks className="w-5 h-5" />,
    },
    {
      num: '04',
      title: 'Evidence Mapping',
      desc: 'Linking extracted tender requirements with submitted bidder evidence.',
      icon: <MapPin className="w-5 h-5" />,
    },
    {
      num: '05',
      title: 'Compliance & Risk Analysis',
      desc: 'Deterministic rules evaluation & severity-graded risk profiling.',
      icon: <ShieldAlert className="w-5 h-5" />,
    },
    {
      num: '06',
      title: 'Explainable AI Findings',
      desc: 'Transparent reasoning logs & evidence page reference traceability.',
      icon: <Sparkles className="w-5 h-5" />,
    },
    {
      num: '07',
      title: 'Human Officer Review',
      desc: 'Procurement officer oversight, rationale entry, or GeM clarification.',
      icon: <UserCheck className="w-5 h-5" />,
    },
    {
      num: '08',
      title: 'Decision & Audit Trail',
      desc: 'Final official qualification decision & immutable cryptographic log.',
      icon: <History className="w-5 h-5" />,
    },
  ];

  const DARK_STEP_COLORS = [
    'text-blue-400',
    'text-cyan-400',
    'text-indigo-400',
    'text-purple-400',
    'text-amber-400',
    'text-blue-400',
    'text-emerald-400',
    'text-cyan-400',
  ];

  const LIGHT_STEP_COLORS = [
    'text-blue-600',
    'text-blue-600',
    'text-indigo-600',
    'text-indigo-600',
    'text-amber-600',
    'text-blue-600',
    'text-emerald-600',
    'text-blue-600',
  ];

  return (
    <section id="how-it-works" className={`py-24 border-t relative transition-colors duration-300 ${isDark ? 'bg-slate-950/80 border-slate-800/80' : 'bg-white border-slate-200/80'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className={`text-xs font-bold uppercase tracking-widest block font-mono ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
            HOW IT WORKS
          </span>
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            End-to-End Procurement Intelligence Workflow
          </h2>
          <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            A seamless 8-step pipeline bringing evidence automation and human decision governance together
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const iconColor = isDark ? DARK_STEP_COLORS[index] : LIGHT_STEP_COLORS[index];
            return (
              <div
                key={step.num}
                className={`p-6 rounded-2xl relative group transition-all duration-200 border ${
                  isDark
                    ? 'bg-slate-900/50 border-slate-800/80 hover:border-blue-500/40 shadow-lg hover:-translate-y-1'
                    : 'bg-slate-50/80 border-slate-200/80 hover:border-blue-300 hover:bg-white shadow-2xs hover:shadow-sm hover:-translate-y-1'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-2xl font-black font-mono transition-colors ${isDark ? 'text-blue-500/40 group-hover:text-blue-400' : 'text-blue-600/30 group-hover:text-blue-600'}`}>
                    {step.num}
                  </span>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'}`}>
                    {React.cloneElement(step.icon as React.ReactElement<{ className: string }>, {
                      className: `w-5 h-5 ${iconColor}`,
                    })}
                  </div>
                </div>

                <h3 className={`text-base font-bold mb-2 transition-colors ${isDark ? 'text-white group-hover:text-blue-300' : 'text-slate-900 group-hover:text-blue-700'}`}>
                  {step.title}
                </h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {step.desc}
                </p>

                {index < steps.length - 1 && (
                  <div className={`hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-0.5 z-10 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Human-in-the-loop Disclosure Banner */}
        <div
          className={`mt-16 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 border ${
            isDark
              ? 'bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border-blue-800/40 shadow-2xl'
              : 'bg-blue-50/80 border-blue-200/80 shadow-xs'
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                isDark
                  ? 'bg-blue-600/20 border-blue-500/40 text-blue-400'
                  : 'bg-blue-600/10 border-blue-200 text-blue-600'
              }`}
            >
              <Shield className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Human Officer Decision Governance
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${
                    isDark
                      ? 'text-emerald-400 bg-emerald-950/80 border-emerald-800/80'
                      : 'text-emerald-800 bg-emerald-100 border-emerald-200'
                  }`}
                >
                  Verified Protocol
                </span>
              </h4>
              <p className={`text-xs leading-relaxed max-w-3xl ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                BidSure AI is an evidence-based decision support system. Automated verification logs, compliance scores, and risk findings provide objective analysis – final evaluation decisions remain solely with the designated Procurement Officer.
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <div
              className={`flex items-center gap-2 text-xs font-semibold font-mono px-4 py-2 rounded-xl border ${
                isDark
                  ? 'text-blue-300 bg-slate-950 border-slate-800'
                  : 'text-blue-900 bg-white border-blue-200 shadow-2xs'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <span>Full Audit Traceability</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
