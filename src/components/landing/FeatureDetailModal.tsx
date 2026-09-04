import React from 'react';
import { X, Shield, ArrowRight, CheckCircle2, Cpu } from 'lucide-react';
import Link from 'next/link';
import { useLandingTheme } from './LandingThemeContext';

export interface FeatureItem {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  shortDesc: string;
  fullDesc: string;
  highlights: string[];
  moduleRoute: string;
}

interface FeatureDetailModalProps {
  feature: FeatureItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FeatureDetailModal: React.FC<FeatureDetailModalProps> = ({
  feature,
  isOpen,
  onClose,
}) => {
  const { theme } = useLandingTheme();
  const isDark = theme === 'dark';

  if (!isOpen || !feature) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200 ${isDark ? 'bg-slate-950/80 backdrop-blur-md' : 'bg-slate-900/60 backdrop-blur-xs'}`}>
      <div className={`w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border ${isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`}>
        {/* Header */}
        <div className={`px-6 py-5 border-b flex items-center justify-between shrink-0 ${isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${isDark ? 'bg-blue-950/80 border-blue-800/80 text-cyan-400' : 'bg-blue-50 border-blue-200 text-blue-600'}`}>
              {feature.icon}
            </div>
            <div>
              <span className={`text-[10px] font-mono font-bold uppercase tracking-widest block ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                {feature.category}
              </span>
              <h3 className={`text-base font-bold leading-tight mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {feature.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/60'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          <div className="space-y-2">
            <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <Cpu className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              Core Technical Capability
            </h4>
            <p className={`p-4 rounded-xl border leading-relaxed font-sans ${isDark ? 'bg-slate-950/60 border-slate-800/80 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
              {feature.fullDesc}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Key Platform Highlights
            </h4>
            <div className="grid grid-cols-1 gap-2.5">
              {feature.highlights.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl flex items-start gap-3 border ${
                    isDark ? 'bg-slate-950/40 border-slate-800/80 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  <span className="font-medium leading-normal">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`p-4 rounded-xl flex items-center justify-between text-xs border ${isDark ? 'bg-gradient-to-r from-blue-950/60 to-slate-900 border-blue-800/40 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-900'}`}>
            <div className="flex items-center gap-2">
              <Shield className={`w-4 h-4 shrink-0 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className="font-medium">Human Officer Oversight & Audit Record Maintained</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0 ${isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50'}`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 border font-semibold text-xs rounded-xl transition-colors text-center ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300' : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-xs'
            }`}
          >
            Close Overview
          </button>
          <Link
            href={feature.moduleRoute}
            onClick={onClose}
            className={`px-5 py-2 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 text-white ${
              isDark ? 'bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/20' : 'bg-blue-600 hover:bg-blue-700 shadow-xs'
            }`}
          >
            <span>Launch Feature Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
