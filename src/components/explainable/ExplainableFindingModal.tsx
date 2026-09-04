'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ExplainableFinding } from '@/data/mockData';
import {
  X,
  Sparkles,
  HelpCircle,
  FileText,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface ExplainableFindingModalProps {
  finding: ExplainableFinding | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ExplainableFindingModal: React.FC<ExplainableFindingModalProps> = ({
  finding,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !finding) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] flex flex-col rounded-xl border border-slate-200 shadow-2xl overflow-hidden my-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-xs font-mono font-bold text-navy-900 bg-navy-50 px-2 py-0.5 rounded border border-navy-200">
                {finding.findingId}
              </span>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold font-mono rounded border ${
                  finding.severity === 'HIGH'
                    ? 'bg-rose-50 text-rose-800 border-rose-200'
                    : finding.severity === 'MEDIUM'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-blue-50 text-blue-800 border-blue-200'
                }`}
              >
                {finding.severity} SEVERITY
              </span>
              <span className="text-xs font-semibold text-slate-500">• {finding.category}</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 leading-snug">
              Explainable AI Finding: {finding.findingTitle}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Decision Support Banner */}
        <div className="px-4 sm:px-6 py-2.5 bg-blue-50/90 border-b border-blue-200/80 text-xs text-blue-900 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              <strong>Decision Support Disclosure:</strong> Explainable AI findings provide transparent evidence-based analysis. Final procurement decisions remain with the Procurement Officer.
            </span>
          </div>
          <span className="font-mono font-medium text-blue-700 shrink-0 hidden md:inline">
            Explainable AI Engine
          </span>
        </div>

        {/* Content Body: 5-Question Breakdown */}
        <div className="p-4 sm:p-6 space-y-4 flex-1 overflow-y-auto text-xs">
          {/* Question 1: What was detected? */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <span className="text-[10px] uppercase font-bold text-navy-800 tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-navy-800" />
              1. What was detected?
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-2.5 bg-white border border-slate-200 rounded-lg space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Expected Requirement Condition</span>
                <span className="font-mono font-bold text-slate-900 block">{finding.expectedCondition}</span>
              </div>

              <div className="p-2.5 bg-white border border-slate-200 rounded-lg space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Actual Extracted Condition</span>
                <span className="font-mono font-bold text-navy-900 block">{finding.actualCondition}</span>
              </div>
            </div>
          </div>

          {/* Question 2: Why was it detected? */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-navy-800 tracking-wider block">
              2. Why was it detected?
            </span>
            <p className="text-slate-800 font-medium leading-relaxed">{finding.whyGenerated}</p>
          </div>

          {/* Question 3: What evidence supports it? */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <span className="text-[10px] uppercase font-bold text-navy-800 tracking-wider block">
              3. What evidence supports it?
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono">
              <div className="p-2 bg-white border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-400 block">Source Document</span>
                <span className="font-bold text-slate-900 truncate block mt-0.5" title={finding.sourceDocumentName}>
                  {finding.sourceDocumentName}
                </span>
              </div>

              <div className="p-2 bg-white border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-400 block">Source Page</span>
                <span className="font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                  <Bookmark className="w-3 h-3 text-slate-400" />
                  {finding.sourcePage}
                </span>
              </div>

              <div className="p-2 bg-white border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-400 block">Extraction Confidence</span>
                <span className="font-bold text-emerald-700 mt-0.5 block">{finding.extractionConfidence}</span>
              </div>
            </div>
          </div>

          {/* Question 4: Which requirement/rule caused it? */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <span className="text-[10px] uppercase font-bold text-navy-800 tracking-wider block">
              4. Which requirement/rule caused it?
            </span>
            <div className="p-2.5 bg-white border border-slate-200 rounded-lg space-y-1 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Requirement ID:</span>
                <span className="font-bold text-navy-900">{finding.requirementId || 'N/A'}</span>
              </div>
              <p className="text-[11px] text-slate-700 font-sans font-semibold pt-0.5">
                Rule / Logic: {finding.ruleOrComparisonLogic}
              </p>
            </div>
          </div>

          {/* Question 5: What should the officer verify? */}
          <div className="p-4 bg-navy-950 text-white rounded-xl space-y-2 shadow-md">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-400" />
              5. Recommended Procurement Officer Action
            </span>
            <p className="text-slate-200 font-medium leading-relaxed font-sans">{finding.recommendedOfficerAction}</p>
          </div>

          {/* Human Readable Explanation Box */}
          <div className="p-4 bg-slate-900 text-white rounded-xl space-y-1.5 shadow-xs">
            <span className="text-[10px] font-mono text-slate-300 font-bold uppercase block">
              Plain Language Explanation
            </span>
            <p className="text-slate-200 leading-relaxed font-sans">{finding.humanReadableExplanation}</p>
          </div>

          {/* Full Traceability Line */}
          <div className="p-3 bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-mono text-slate-600 flex items-center justify-between">
            <span>Traceability Line:</span>
            <span className="font-bold text-slate-800">{finding.traceability}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <span className="text-[10px] text-slate-400 font-mono">
            BidSure AI • Explainable AI Engine
          </span>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Explanation
          </Button>
        </div>
      </div>
    </div>
  );
};
