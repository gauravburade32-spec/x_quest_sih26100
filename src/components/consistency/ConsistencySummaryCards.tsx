import React from 'react';
import { CrossDocumentFieldComparison } from '@/data/mockData';
import { GitCompare, CheckCircle2, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';

interface ConsistencySummaryCardsProps {
  comparisons: CrossDocumentFieldComparison[];
}

export const ConsistencySummaryCards: React.FC<ConsistencySummaryCardsProps> = ({ comparisons }) => {
  const total = comparisons.length;
  const consistentCount = comparisons.filter((c) => c.result === 'CONSISTENT').length;
  const inconsistentCount = comparisons.filter((c) => c.result === 'INCONSISTENT').length;
  const reviewCount = comparisons.filter((c) => c.result === 'NEEDS REVIEW').length;
  const notAvailableCount = comparisons.filter((c) => c.result === 'NOT AVAILABLE').length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Fields Compared</span>
        <div className="mt-1.5 font-mono font-bold text-slate-900 text-2xl flex items-center gap-2">
          <GitCompare className="w-5 h-5 text-slate-400" />
          {total}
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5">Attributes analyzed</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Consistent</span>
        <div className="mt-1.5 font-mono font-bold text-emerald-700 text-2xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          {consistentCount}
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5">Cross-document match</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">Inconsistent</span>
        <div className="mt-1.5 font-mono font-bold text-rose-700 text-2xl flex items-center gap-2">
          <XCircle className="w-5 h-5 text-rose-600" />
          {inconsistentCount}
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5">Attribute conflict</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">Needs Review</span>
        <div className="mt-1.5 font-mono font-bold text-amber-700 text-2xl flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          {reviewCount}
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5">Format/abbreviation check</p>
      </div>
    </div>
  );
};
