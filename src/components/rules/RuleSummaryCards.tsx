import React from 'react';
import { RuleEvaluationRecord } from '@/data/mockData';
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle, HelpCircle } from 'lucide-react';

interface RuleSummaryCardsProps {
  evaluations: RuleEvaluationRecord[];
}

export const RuleSummaryCards: React.FC<RuleSummaryCardsProps> = ({ evaluations }) => {
  const total = evaluations.length;
  const compliantCount = evaluations.filter((e) => e.result === 'COMPLIANT').length;
  const nonCompliantCount = evaluations.filter((e) => e.result === 'NON-COMPLIANT').length;
  const reviewCount = evaluations.filter((e) => e.result === 'NEEDS REVIEW').length;
  const notEvaluatedCount = evaluations.filter((e) => e.result === 'NOT EVALUATED').length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Total Requirements</span>
        <div className="mt-1.5 font-mono font-bold text-slate-900 text-2xl flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-slate-400" />
          {total}
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5">Rules configured</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Compliant</span>
        <div className="mt-1.5 font-mono font-bold text-emerald-700 text-2xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          {compliantCount}
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5">Rules satisfied</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">Non-Compliant</span>
        <div className="mt-1.5 font-mono font-bold text-rose-700 text-2xl flex items-center gap-2">
          <XCircle className="w-5 h-5 text-rose-600" />
          {nonCompliantCount}
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5">Threshold violation</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">Needs Review</span>
        <div className="mt-1.5 font-mono font-bold text-amber-700 text-2xl flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          {reviewCount}
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5">Officer check required</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">Not Evaluated</span>
        <div className="mt-1.5 font-mono font-bold text-slate-700 text-2xl flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-slate-400" />
          {notEvaluatedCount}
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5">Evidence unmapped</p>
      </div>
    </div>
  );
};
