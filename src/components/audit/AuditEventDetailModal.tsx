'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { AuditEvent } from '@/data/mockData';
import {
  X,
  History,
  Info,
  Bookmark,
  FileText,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  Layers,
  Building2,
} from 'lucide-react';

interface AuditEventDetailModalProps {
  event: AuditEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AuditEventDetailModal: React.FC<AuditEventDetailModalProps> = ({
  event,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl border border-slate-200 shadow-2xl overflow-hidden my-4 animate-in fade-in zoom-in-95 duration-200 text-xs">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-mono font-bold text-navy-900 bg-navy-50 px-2 py-0.5 rounded border border-navy-200">
                {event.id}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold font-mono bg-blue-50 text-blue-800 border border-blue-200 rounded">
                {event.eventType}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 leading-snug">
              Audit Log Record: {event.action}
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
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-400 block uppercase">Timestamp</span>
              <span className="font-bold text-slate-900 mt-0.5 block">{event.timestamp}</span>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-400 block uppercase">User / Actor</span>
              <span className="font-bold text-navy-900 mt-0.5 block truncate" title={event.user}>
                {event.user}
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-400 block uppercase">System Role</span>
              <span className="font-bold text-slate-800 mt-0.5 block truncate" title={event.userRole}>
                {event.userRole}
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-400 block uppercase">Tender Reference</span>
              <span className="font-bold text-slate-900 mt-0.5 block">{event.tenderRef}</span>
            </div>
          </div>

          {/* Action Details Box */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 font-sans">
            <span className="text-[10px] font-bold uppercase text-slate-400 block font-mono">Detailed Event Description</span>
            <p className="text-slate-800 leading-relaxed text-sm font-medium">{event.details}</p>
          </div>

          {/* Status Change (If Present) */}
          {(event.previousStatus || event.newStatus) && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Status Transition</span>
              <div className="flex items-center gap-3 font-mono">
                <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-600 font-bold">
                  {event.previousStatus || 'Initial State'}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="px-3 py-1 bg-navy-900 text-white rounded-lg font-bold">
                  {event.newStatus || 'Completed'}
                </span>
              </div>
            </div>
          )}

          {/* Related Artifacts */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 font-mono">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Related Procurement Artifacts</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {event.bidderName && (
                <div className="p-2 bg-white border border-slate-200 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Bidder Entity</span>
                  <span className="font-bold text-slate-900 font-sans">{event.bidderName}</span>
                </div>
              )}

              {event.documentName && (
                <div className="p-2 bg-white border border-slate-200 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Document File</span>
                  <span className="font-bold text-slate-900 truncate block" title={event.documentName}>
                    {event.documentName}
                  </span>
                </div>
              )}

              {event.requirementId && (
                <div className="p-2 bg-white border border-slate-200 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Requirement ID</span>
                  <span className="font-bold text-navy-900">{event.requirementId}</span>
                </div>
              )}

              {event.findingId && (
                <div className="p-2 bg-white border border-slate-200 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Finding ID</span>
                  <span className="font-bold text-brand-700">{event.findingId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Full Traceability Line */}
          <div className="p-3 bg-slate-900 text-white rounded-xl text-[11px] font-mono flex items-center justify-between">
            <span className="text-slate-400">Traceability Line:</span>
            <span className="font-bold text-brand-300">{event.traceabilityLine}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-mono">
            BidSure AI • System Audit Standard
          </span>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Inspection
          </Button>
        </div>
      </div>
    </div>
  );
};
