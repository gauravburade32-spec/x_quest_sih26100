'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CrossDocumentFieldComparison } from '@/data/mockData';
import {
  X,
  GitCompare,
  FileText,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Sparkles,
  Layers,
} from 'lucide-react';

interface ConsistencyDetailModalProps {
  comparison: CrossDocumentFieldComparison | null;
  bidderName?: string;
  tenderRef?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ConsistencyDetailModal: React.FC<ConsistencyDetailModalProps> = ({
  comparison,
  bidderName,
  tenderRef,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !comparison) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl border border-slate-200 shadow-2xl overflow-hidden my-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold text-navy-900 bg-navy-50 px-2 py-0.5 rounded border border-navy-200">
                {comparison.id}
              </span>
              <StatusBadge status={comparison.result} />
              <span className="text-xs font-semibold text-slate-500">• Confidence: {comparison.confidence}</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-1.5 leading-snug">
              Cross-Document Attribute: {comparison.attributeLabel}
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
              <strong>Decision Support Disclosure:</strong> Cross-document analysis provides evidence-based consistency checks. Final procurement decisions remain with the Procurement Officer.
            </span>
          </div>
          <span className="font-mono font-medium text-blue-700 shrink-0 hidden md:inline">
            Cross-Document Engine
          </span>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Context Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Target Bidder</span>
              <span className="font-bold text-slate-900 text-sm">{bidderName || "ABC Technologies Pvt. Ltd."}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Tender Reference</span>
              <span className="font-bold text-slate-900 text-sm">{tenderRef || "GEM/2026/B/492104"}</span>
            </div>
          </div>

          {/* Sources Comparison Grid */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Extracted Values Across Submitted Documents
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {comparison.sources.map((src, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs"
                >
                  <div className="flex items-center gap-2 text-slate-700">
                    <FileText className="w-4 h-4 text-brand-600 shrink-0" />
                    <span className="font-bold truncate" title={src.documentTitle}>
                      {src.documentTitle}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 font-mono space-y-1">
                    <div className="flex items-center justify-between text-slate-500">
                      <span>File Name:</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[140px]" title={src.fileName}>{src.fileName}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Excerpt Page:</span>
                      <span className="font-semibold text-slate-800">{src.sourcePage}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-900 pt-1 border-t border-slate-100">
                      <span>Extracted Value:</span>
                      <span className="font-bold text-navy-900 bg-slate-100 px-2 py-0.5 rounded">
                        {src.extractedValue}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Consistency Explanation */}
          <div className="p-4 bg-navy-950 text-white rounded-xl space-y-2 border border-navy-900 shadow-md">
            <div className="flex items-center justify-between">
              <span className="font-bold text-brand-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-400" />
                Consistency Explanation
              </span>
              <span className="text-[10px] font-mono text-slate-300">Analysis Engine</span>
            </div>
            <p className="text-slate-200 leading-relaxed font-sans">{comparison.explanation}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <span className="text-[10px] text-slate-400 font-mono">
            BidSure AI • Cross-Document Consistency Engine
          </span>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Inspection
          </Button>
        </div>
      </div>
    </div>
  );
};
