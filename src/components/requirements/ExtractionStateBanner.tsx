import React from 'react';
import { CheckCircle2, Sparkles, Info, Layers } from 'lucide-react';

export const ExtractionStateBanner: React.FC = () => {
  const steps = [
    { label: 'Tender Uploaded', completed: true },
    { label: 'Document Prepared', completed: true },
    { label: 'Requirement Identification', completed: true },
    { label: 'Requirements Structured', completed: true },
  ];

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-navy-50 text-navy-800 border border-navy-100">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Extraction Pipeline Status
            </h3>
            <p className="text-[11px] text-slate-500">
              Structured requirement identification and category classification stage.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-800 border border-brand-200 text-[10px] font-semibold">
            Automated Extraction Active
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-mono font-medium">
            Clause Repository
          </span>
        </div>
      </div>

      {/* Stepper Progress */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200/70 text-xs"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold text-slate-800 text-[11px] leading-tight">
              {step.label}
            </span>
          </div>
        ))}
      </div>

      <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
        <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
        <span>
          <strong>Extraction Traceability:</strong> Requirements are linked to source page clauses for explainable bid compliance verification.
        </span>
      </div>
    </div>
  );
};
