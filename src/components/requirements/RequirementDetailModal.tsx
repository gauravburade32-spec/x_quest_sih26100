'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TenderRequirement } from '@/data/mockData';
import {
  X,
  FileText,
  Bookmark,
  ShieldCheck,
  Info,
  Clock,
  ExternalLink,
  ListChecks,
} from 'lucide-react';

interface RequirementDetailModalProps {
  requirement: TenderRequirement | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RequirementDetailModal: React.FC<RequirementDetailModalProps> = ({
  requirement,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !requirement) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-4">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-navy-900 bg-navy-50 px-2 py-0.5 rounded border border-navy-200">
                {requirement.id}
              </span>
              <StatusBadge status={requirement.status} />
              <span
                className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${
                  requirement.isMandatory
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                {requirement.isMandatory ? 'Mandatory' : 'Optional'}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-2 leading-snug">
              {requirement.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          {/* Category & Clause Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/70">
            <div className="flex items-start gap-2.5">
              <ListChecks className="w-4 h-4 text-navy-800 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Clause Category</p>
                <p className="font-semibold text-slate-900">{requirement.category}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <FileText className="w-4 h-4 text-navy-800 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Tender Reference</p>
                <p className="font-semibold text-slate-900 font-mono">{requirement.tenderId}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Requirement Description
            </h3>
            <p className="text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed font-sans">
              {requirement.description}
            </p>
          </div>

          {/* Expected Evidence Box */}
          <div className="p-4 bg-navy-950 text-white rounded-xl space-y-1.5 shadow-md">
            <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-brand-300 block">
              Expected Evidence Document / Clause
            </span>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {requirement.evidenceExpected}
            </p>
          </div>

          {/* Verification Section */}
          <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Verification Status</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              Verification is evaluated against submitted bidder evidence documents during rules execution.
            </p>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-800 pt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Current Status: {requirement.status}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <span className="text-[10px] text-slate-400 font-mono">
            BidSure AI • Requirement Traceability Standard
          </span>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Detail
          </Button>
        </div>
      </div>
    </div>
  );
};
