import React from 'react';
import { EvidenceMappingItem, TenderRequirement } from '@/data/mockData';
import { Layers, CheckCircle2, AlertTriangle, FileX, Clock } from 'lucide-react';

interface MappingSummaryCardsProps {
  requirements: TenderRequirement[];
  mappings: EvidenceMappingItem[];
}

export const MappingSummaryCards: React.FC<MappingSummaryCardsProps> = ({
  requirements,
  mappings,
}) => {
  const total = requirements.length;

  const fullyMappedCount = mappings.filter((m) => m.status === 'Mapped').length;
  const partiallyMappedCount = mappings.filter((m) => m.status === 'Partially Mapped').length;
  const missingCount = mappings.filter((m) => m.status === 'Missing Evidence').length;
  const reviewCount = mappings.filter((m) => m.status === 'Needs Review').length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Total Requirements</span>
        <div className="mt-1.5 font-mono font-bold text-slate-900 text-2xl flex items-center gap-2">
          <Layers className="w-5 h-5 text-slate-400" />
          {total}
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5">Extracted baseline</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Fully Mapped</span>
        <div className="mt-1.5 font-mono font-bold text-emerald-700 text-2xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          {fullyMappedCount}
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5">Evidence items verified</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">Partially Mapped</span>
        <div className="mt-1.5 font-mono font-bold text-amber-700 text-2xl flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-600" />
          {partiallyMappedCount}
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5">Partial coverage</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">Missing Evidence</span>
        <div className="mt-1.5 font-mono font-bold text-rose-700 text-2xl flex items-center gap-2">
          <FileX className="w-5 h-5 text-rose-600" />
          {missingCount}
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5">No document uploaded</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">Needs Review</span>
        <div className="mt-1.5 font-mono font-bold text-indigo-700 text-2xl flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-indigo-600" />
          {reviewCount}
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5">Officer check required</p>
      </div>
    </div>
  );
};
