'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useTenders } from '@/context/TenderContext';
import { TenderRequirement, BidderDocument } from '@/data/mockData';
import {
  X,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Bookmark,
  Building2,
  Sparkles,
  ArrowRight,
  Info,
  Tag,
  Unlink,
  Link as LinkIcon,
  ShieldCheck,
  FileX,
} from 'lucide-react';

interface MappingDetailModalProps {
  requirement: TenderRequirement | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MappingDetailModal: React.FC<MappingDetailModalProps> = ({
  requirement,
  isOpen,
  onClose,
}) => {
  const {
    bidders,
    getDocumentsByBidderId,
    getMappingsByRequirementId,
    mapDocumentToRequirement,
    unmapDocumentFromRequirement,
    getIntelligenceResultByDocId,
  } = useTenders();

  const [selectedBidderId, setSelectedBidderId] = useState('BID-2026-901');

  if (!isOpen || !requirement) return null;

  const currentBidder = bidders.find((b) => b.id === selectedBidderId) || bidders[0];
  const bidderDocs = getDocumentsByBidderId(selectedBidderId);
  const mappings = getMappingsByRequirementId(requirement.id, selectedBidderId);

  // Expected evidence items list
  const expectedItems = requirement.evidenceExpected.split(/[,&]/).map((s) => s.trim());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] flex flex-col rounded-xl border border-slate-200 shadow-2xl overflow-hidden my-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold text-navy-900 bg-navy-50 px-2 py-0.5 rounded border border-navy-200">
                {requirement.id}
              </span>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold rounded border ${
                  requirement.isMandatory
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                {requirement.isMandatory ? 'Mandatory' : 'Optional'}
              </span>
              <span className="text-xs font-semibold text-slate-500">• Category: {requirement.category}</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-1 leading-snug">
              Requirement → Evidence Mapping: {requirement.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Information Disclosure Banner */}
        <div className="px-4 sm:px-6 py-2.5 bg-blue-50/90 border-b border-blue-200/80 text-xs text-blue-900 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              <strong>Evidence Visibility Only:</strong> Connecting extracted tender requirements with submitted bidder documents. No final compliance decision is made at this stage.
            </span>
          </div>
          <span className="font-mono font-medium text-blue-700 shrink-0 hidden md:inline">
            Evidence Mapping Workspace
          </span>
        </div>

        {/* Workspace Body: Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200/80 overflow-y-auto flex-1">
          {/* LEFT PANEL: Tender Requirement & Expected Evidence */}
          <div className="p-6 space-y-4 bg-slate-50/40">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <FileText className="w-4 h-4 text-navy-800" />
                Tender Requirement Specification
              </h3>
              <p className="text-xs text-slate-700 font-medium mt-2 leading-relaxed bg-white p-3.5 rounded-lg border border-slate-200">
                {requirement.description}
              </p>
            </div>

            {/* Source Reference */}
            <div className="text-xs font-mono text-slate-500 flex items-center gap-1.5 bg-slate-100 p-2.5 rounded-lg border border-slate-200/70">
              <Bookmark className="w-4 h-4 text-slate-400" />
              <span>Source: {requirement.sourceDocument} ({requirement.sourcePage})</span>
            </div>

            {/* Expected Evidence Checklist */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Expected Evidence Checklist ({expectedItems.length})
              </h4>
              <div className="space-y-2">
                {expectedItems.map((item, idx) => {
                  const mapped = mappings.find((m) => m.expectedEvidenceLabel.toLowerCase().includes(item.toLowerCase()));
                  const isMapped = mapped?.status === 'Mapped';

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border text-xs flex items-center justify-between gap-2 transition-all ${
                        isMapped
                          ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-950'
                          : 'bg-white border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {isMapped ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <FileX className="w-4 h-4 text-rose-500 shrink-0" />
                        )}
                        <span className="font-semibold truncate">{item}</span>
                      </div>
                      <StatusBadge status={mapped?.status || 'Missing Evidence'} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Bidder Evidence & Interactive Mapping */}
          <div className="p-6 space-y-4">
            {/* Bidder Selector Header */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Select Bidder</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Building2 className="w-4 h-4 text-navy-800" />
                  <select
                    value={selectedBidderId}
                    onChange={(e) => setSelectedBidderId(e.target.value)}
                    className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-800 cursor-pointer"
                  >
                    {bidders.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-500">
                {bidderDocs.length} Submitted Docs
              </span>
            </div>

            {/* Interactive Mapping Items */}
            <div className="space-y-4">
              {expectedItems.map((expectedLabel, idx) => {
                const existingMapping = mappings.find(
                  (m) => m.expectedEvidenceLabel.toLowerCase().includes(expectedLabel.toLowerCase())
                );
                const mappedDoc = existingMapping?.mappedDocumentId
                  ? bidderDocs.find((d) => d.id === existingMapping.mappedDocumentId)
                  : null;

                const intelResult = mappedDoc ? getIntelligenceResultByDocId(mappedDoc.id) : null;

                // Find suggested match document from submitted docs if not mapped
                const suggestedDoc = !mappedDoc
                  ? bidderDocs.find((d) => d.category.toLowerCase().includes(expectedLabel.toLowerCase().split(' ')[0]))
                  : null;

                return (
                  <div
                    key={idx}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 shadow-2xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-navy-800" />
                        <h5 className="text-xs font-bold text-slate-900">{expectedLabel}</h5>
                      </div>
                      <StatusBadge status={existingMapping?.status || 'Missing Evidence'} />
                    </div>

                    {/* Case 1: Document Mapped */}
                    {mappedDoc ? (
                      <div className="space-y-2 bg-white p-3 rounded-lg border border-slate-200">
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {mappedDoc.documentTitle}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono">{mappedDoc.fileName}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-rose-600 border-rose-200 hover:bg-rose-50 text-[11px] py-0.5 px-2"
                            icon={<Unlink className="w-3 h-3" />}
                            onClick={() => {
                              if (existingMapping) unmapDocumentFromRequirement(existingMapping.id);
                            }}
                          >
                            Unmap
                          </Button>
                        </div>

                        {/* Step 6 Extracted Fields Preview */}
                        {intelResult && intelResult.fields.length > 0 && (
                          <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px]">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              Extracted Evidence Fields
                            </span>
                            {intelResult.fields.slice(0, 3).map((f, fieldIdx) => (
                              <div key={fieldIdx} className="flex items-center justify-between text-slate-700 font-mono">
                                <span>{f.label}:</span>
                                <span className="font-bold text-slate-900">{f.value}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Source Traceability */}
                        <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-500">
                          <span>Traceability: {requirement.id} → {mappedDoc.fileName} → Page 1</span>
                          <span className="text-emerald-700 font-semibold">High Confidence</span>
                        </div>
                      </div>
                    ) : (
                      /* Case 2: Unmapped / Suggested Match Available */
                      <div className="space-y-2">
                        {suggestedDoc && (
                          <div className="p-2.5 bg-blue-50/90 border border-blue-200/80 rounded-lg text-xs flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              <span className="text-[11px] text-blue-900 font-semibold truncate">
                                Suggested Match: {suggestedDoc.fileName}
                              </span>
                            </div>
                            <Button
                              variant="primary"
                              size="sm"
                              className="text-[11px] py-0.5 px-2"
                              icon={<LinkIcon className="w-3 h-3" />}
                              onClick={() => {
                                mapDocumentToRequirement(
                                  requirement.id,
                                  expectedLabel,
                                  suggestedDoc.id,
                                  selectedBidderId
                                );
                              }}
                            >
                              Map Evidence
                            </Button>
                          </div>
                        )}

                        {!suggestedDoc && (
                          <div className="p-3 bg-rose-50/50 border border-rose-200/70 rounded-lg text-xs text-rose-900 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                              <span>Missing Evidence — No matching document uploaded yet.</span>
                            </div>
                            <span className="text-[10px] font-mono text-rose-700 font-bold">Action Required</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <span className="text-[10px] text-slate-400 font-mono">
            BidSure AI • Evidence Mapping Layer
          </span>
          <Button variant="primary" size="sm" onClick={onClose} icon={<ArrowRight className="w-4 h-4" />}>
            Close & Save Mapping
          </Button>
        </div>
      </div>
    </div>
  );
};
