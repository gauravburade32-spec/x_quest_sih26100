import React from 'react';
import { DocumentIntelligenceResult } from '@/data/mockData';
import { FileText, Layers, Tag, CheckCircle2, AlertCircle } from 'lucide-react';

interface IntelligenceSummaryHeaderProps {
  result: DocumentIntelligenceResult | null;
  category: string;
}

export const IntelligenceSummaryHeader: React.FC<IntelligenceSummaryHeaderProps> = ({
  result,
  category,
}) => {
  const pages = result?.pagesCount || 1;
  const textStatus = result?.extractedTextStatus || 'Pending Processing';
  const docType = result?.category || category;
  const detectedFieldsCount = result?.fields.filter((f) => f.status === 'Detected').length || 0;
  const reviewFieldsCount = result?.fields.filter((f) => f.status !== 'Detected').length || 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Pages</span>
        <div className="mt-1 font-mono font-bold text-slate-900 text-lg flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-slate-500" />
          {pages} Page{pages > 1 ? 's' : ''}
        </div>
      </div>

      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Extracted Text</span>
        <div className="mt-1 font-mono font-bold text-slate-900 text-sm flex items-center gap-1.5 truncate">
          <FileText className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="truncate">{textStatus}</span>
        </div>
      </div>

      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Document Type</span>
        <div className="mt-1 font-bold text-slate-900 text-xs flex items-center gap-1.5 truncate" title={docType}>
          <Tag className="w-4 h-4 text-navy-800 shrink-0" />
          <span className="truncate">{docType}</span>
        </div>
      </div>

      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Fields Detected</span>
        <div className="mt-1 font-mono font-bold text-emerald-700 text-lg flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {detectedFieldsCount} Detected
        </div>
      </div>

      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Requires Review</span>
        <div className="mt-1 font-mono font-bold text-amber-700 text-lg flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          {reviewFieldsCount} Fields
        </div>
      </div>
    </div>
  );
};
