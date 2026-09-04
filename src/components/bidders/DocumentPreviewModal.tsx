'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { BidderDocument } from '@/data/mockData';
import {
  X,
  FileText,
  Eye,
  Calendar,
  Building2,
  Tag,
  Download,
  Info,
  Sparkles,
} from 'lucide-react';

interface DocumentPreviewModalProps {
  document: BidderDocument | null;
  bidderName?: string;
  tenderRef?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document,
  bidderName,
  tenderRef,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !document) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-4">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-navy-900 bg-navy-50 px-2 py-0.5 rounded border border-navy-200">
                {document.id}
              </span>
              <StatusBadge status={document.status} />
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-1.5 leading-snug">
              {document.documentTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Document Inspection Banner */}
        <div className="px-4 sm:px-6 py-2.5 bg-blue-50/90 border-b border-blue-200/80 text-xs text-blue-900 flex items-center gap-2 shrink-0">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Evidence Document Preview:</strong> Submitted bidder document staged for automated Document Intelligence and OCR verification.
          </span>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/70">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Document Category</p>
              <p className="font-semibold text-slate-900 mt-0.5 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-navy-800" />
                {document.category}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Filename & Size</p>
              <p className="font-semibold text-slate-900 mt-0.5 font-mono">
                {document.fileName} ({document.fileSize})
              </p>
            </div>
          </div>

          {/* Document Preview Placeholder Box */}
          <div className="p-8 bg-slate-100/80 border-2 border-dashed border-slate-300 rounded-xl text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center mx-auto text-navy-800 shadow-2xs">
              <Eye className="w-6 h-6 text-navy-800" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">
                Document Preview Window
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                <span>
                  Full-text PDF rendering, side-by-side clause highlight, and OCR field extraction are integrated in Document Intelligence.
                </span>
              </p>
            </div>
            <div className="pt-2">
              <Button variant="outline" size="sm" icon={<Download className="w-3.5 h-3.5" />}>
                Download Document ({document.fileSize})
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <span className="text-[10px] text-slate-400 font-mono">
            BidSure AI • Evidence Repository
          </span>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Preview
          </Button>
        </div>
      </div>
    </div>
  );
};
