import React from 'react';
import { CheckCircle2, Sparkles, Clock, AlertTriangle } from 'lucide-react';

interface ProcessingPipelineStepperProps {
  isProcessing: boolean;
  isProcessed: boolean;
  ocrStatus?: string;
}

export const ProcessingPipelineStepper: React.FC<ProcessingPipelineStepperProps> = ({
  isProcessing,
  isProcessed,
  ocrStatus = 'Native PDF Text',
}) => {
  const steps = [
    { label: 'Document Received', status: 'completed' },
    {
      label: 'Text Extraction',
      status: isProcessed ? 'completed' : isProcessing ? 'processing' : 'pending',
    },
    {
      label: 'OCR Recognition',
      status: isProcessed
        ? ocrStatus.includes('Failed')
          ? 'failed'
          : 'completed'
        : isProcessing
        ? 'processing'
        : 'pending',
    },
    {
      label: 'Document Classification',
      status: isProcessed ? 'completed' : 'pending',
    },
    {
      label: 'Field Extraction',
      status: isProcessed ? 'completed' : 'pending',
    },
    {
      label: 'Evidence Prepared',
      status: isProcessed ? 'completed' : 'pending',
    },
  ];

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-navy-800" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Document Processing Pipeline
          </h3>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-mono font-medium">
          {isProcessed ? 'Extraction Complete' : isProcessing ? 'Processing Engine...' : 'Ready to Process'}
        </span>
      </div>

      {/* Stepper Grid */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 pt-1">
        {steps.map((step, idx) => {
          let icon = <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
          let bgClass = 'bg-slate-50 border-slate-200 text-slate-600';

          if (step.status === 'completed') {
            icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;
            bgClass = 'bg-emerald-50/60 border-emerald-200 text-emerald-950 font-semibold';
          } else if (step.status === 'processing') {
            icon = <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin shrink-0" />;
            bgClass = 'bg-blue-50 border-blue-200 text-blue-900 font-semibold';
          } else if (step.status === 'failed') {
            icon = <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />;
            bgClass = 'bg-amber-50 border-amber-200 text-amber-900 font-semibold';
          }

          return (
            <div
              key={idx}
              className={`p-2 rounded-lg border text-[11px] flex items-center gap-1.5 transition-all ${bgClass}`}
            >
              {icon}
              <span className="truncate leading-tight">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
