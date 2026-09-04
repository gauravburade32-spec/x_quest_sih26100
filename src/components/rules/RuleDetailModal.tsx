'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ComplianceRule, RuleEvaluationRecord, TenderRequirement } from '@/data/mockData';
import {
  X,
  ShieldCheck,
  FileText,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Info,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface RuleDetailModalProps {
  rule: ComplianceRule | null;
  evaluation: RuleEvaluationRecord | null;
  requirement: TenderRequirement | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RuleDetailModal: React.FC<RuleDetailModalProps> = ({
  rule,
  evaluation,
  requirement,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !rule || !evaluation || !requirement) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl border border-slate-200 shadow-2xl overflow-hidden my-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold text-navy-900 bg-navy-50 px-2 py-0.5 rounded border border-navy-200">
                {rule.id} • v{rule.version}
              </span>
              <span
                className={`px-2 py-0.2 text-[10px] font-bold rounded border ${
                  evaluation.result === 'COMPLIANT'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : evaluation.result === 'NON-COMPLIANT'
                    ? 'bg-rose-50 text-rose-800 border-rose-200'
                    : evaluation.result === 'NEEDS REVIEW'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {evaluation.result}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 leading-snug mt-1">
              Rule Inspection: {rule.fieldLabel}
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
              <strong>Decision Support Disclosure:</strong> Rule evaluation provides decision support. Final procurement decisions remain with the Procurement Officer.
            </span>
          </div>
          <span className="font-mono font-medium text-blue-700 shrink-0 hidden md:inline">
            Compliance Rules Engine
          </span>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Requirement Info */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Associated Tender Requirement ({requirement.id})
            </span>
            <p className="font-bold text-slate-900 text-sm">{requirement.title}</p>
            <p className="text-slate-600 leading-relaxed">{requirement.description}</p>
          </div>

          {/* Rule Logic Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-400 block uppercase font-mono font-bold">Field Key</span>
              <span className="font-mono font-bold text-slate-800">{rule.fieldKey}</span>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-400 block uppercase font-mono font-bold">Evaluation Operator</span>
              <span className="font-mono font-bold text-navy-800">{rule.operator}</span>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-400 block uppercase font-mono font-bold">Expected Threshold / Value</span>
              <span className="font-mono font-bold text-slate-900">{evaluation.expectedValue}</span>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-400 block uppercase font-mono font-bold">Actual Extracted Value</span>
              <span className="font-mono font-bold text-slate-900">{evaluation.actualValue}</span>
            </div>
          </div>

          {/* Evidence Traceability */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 font-mono">
            <span className="text-[10px] font-bold uppercase text-slate-400 block font-sans">
              Evidence Source & Page Reference
            </span>
            <div className="flex items-center justify-between text-slate-800">
              <span>Evaluated Rule ID:</span>
              <span className="font-bold">{evaluation.ruleId}</span>
            </div>
            <div className="flex items-center justify-between text-slate-800">
              <span>Page / Excerpt:</span>
              <span className="font-bold">{evaluation.sourcePage || 'Page 1, Paragraph 3'}</span>
            </div>
          </div>

          {/* Explanation Box */}
          <div className="p-4 bg-navy-950 text-white rounded-xl space-y-2 border border-navy-900 shadow-md">
            <div className="flex items-center justify-between">
              <span className="font-bold text-brand-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-400" />
                Deterministic Rule Explanation
              </span>
              <span className="text-[10px] font-mono text-slate-300">Rule Engine Log</span>
            </div>
            <p className="text-slate-200 leading-relaxed font-sans">{evaluation.reason}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <span className="text-[10px] text-slate-400 font-mono">
            BidSure AI • Rule Evaluation Engine
          </span>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Inspection
          </Button>
        </div>
      </div>
    </div>
  );
};
