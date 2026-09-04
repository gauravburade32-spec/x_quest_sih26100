'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Tender } from '@/data/mockData';
import {
  X,
  FileText,
  Calendar,
  Building2,
  Sparkles,
  ArrowRight,
  Download,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface TenderDetailModalProps {
  tender: Tender | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TenderDetailModal: React.FC<TenderDetailModalProps> = ({
  tender,
  isOpen,
  onClose,
}) => {
  const [analysisStartedMessage, setAnalysisStartedMessage] = useState(false);

  if (!isOpen || !tender) return null;

  const handleStartAnalysis = () => {
    setAnalysisStartedMessage(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-4">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-500">
                {tender.referenceNo}
              </span>
              <StatusBadge status={tender.status} />
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-1 leading-snug">
              {tender.title}
            </h2>
          </div>
          <button
            onClick={() => {
              setAnalysisStartedMessage(false);
              onClose();
            }}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prototype Banner */}
        <div className="px-4 sm:px-6 py-2.5 bg-blue-50/90 border-b border-blue-200/80 text-xs text-blue-900 flex items-center gap-2 shrink-0">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Tender Intake Detail:</strong> Uploaded document is staged for Requirement Extraction.
          </span>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/70 text-xs">
            <div className="flex items-start gap-2.5">
              <Building2 className="w-4 h-4 text-navy-800 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Procuring Organization</p>
                <p className="font-semibold text-slate-900">{tender.department || "Ministry / Govt Dept"}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-navy-800 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Submission Deadline</p>
                <p className="font-semibold text-slate-900">{tender.closingDate}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <FileText className="w-4 h-4 text-navy-800 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Category</p>
                <p className="font-semibold text-slate-900">{tender.category}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-navy-800 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Estimated Value</p>
                <p className="font-semibold font-mono text-slate-900">{tender.estimatedValue}</p>
              </div>
            </div>
          </div>

          {/* Uploaded Document Card */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Uploaded Tender Document
            </h3>
            <div className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {tender.uploadedDocumentName || `${tender.referenceNo}_Tender_Doc.pdf`}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                    Size: {tender.uploadedDocumentSize || "4.5 MB"} • Uploaded: {tender.uploadDate || "Today"}
                  </p>
                </div>
              </div>

              <Button variant="outline" size="sm" icon={<Download className="w-3.5 h-3.5" />}>
                Download
              </Button>
            </div>
          </div>

          {/* Next Step Stage Indicator */}
          <div className="p-4 bg-navy-950 text-white rounded-xl space-y-2 border border-navy-900 shadow-md">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-brand-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-400" />
                Requirement Extraction Workspace
              </span>
              <span className="px-2 py-0.5 bg-navy-800 text-slate-300 rounded text-[10px] font-mono">
                Automated Module
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Once initiated, the AI engine will extract technical eligibility, financial criteria, and mandatory compliance clauses from this tender document.
            </p>
          </div>

          {analysisStartedMessage && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Requirement Analysis Initiated:</strong> Automated extraction engine is processing the tender document clauses.
              </span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-4 sm:px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <Button
            variant="outline"
            size="md"
            onClick={() => {
              setAnalysisStartedMessage(false);
              onClose();
            }}
          >
            Close
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={handleStartAnalysis}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Start Requirement Analysis
          </Button>
        </div>
      </div>
    </div>
  );
};
