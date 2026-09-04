'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTenders } from '@/context/TenderContext';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { ConsistencySummaryCards } from '@/components/consistency/ConsistencySummaryCards';
import { ConsistencyDetailModal } from '@/components/consistency/ConsistencyDetailModal';
import { getCrossDocumentComparisonsForBidder } from '@/utils/consistencyEngine';
import { CrossDocumentFieldComparison } from '@/data/mockData';
import {
  GitCompare,
  Search,
  Filter,
  Layers,
  Building2,
  Bookmark,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  FileText,
} from 'lucide-react';

export default function CompliancePage() {
  const { tenders, bidders } = useTenders();

  // Selectors & Filters State
  const [selectedTenderId, setSelectedTenderId] = useState('TND-2026-GEM-8921');
  const [selectedBidderId, setSelectedBidderId] = useState('BID-2026-901');
  const [searchQuery, setSearchQuery] = useState('');
  const [resultFilter, setResultFilter] = useState('ALL');

  // Inspection Modal State
  const [selectedComparison, setSelectedComparison] = useState<CrossDocumentFieldComparison | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Current bidder and tender context
  const currentBidder = bidders.find((b) => b.id === selectedBidderId) || bidders[0];
  const currentTender = tenders.find((t) => t.id === selectedTenderId) || tenders[0];

  // Dynamically evaluate comparisons using normalization comparison logic
  const comparisons = getCrossDocumentComparisonsForBidder(selectedBidderId, selectedTenderId);

  const filteredComparisons = comparisons.filter((c) => {
    const matchesResult = resultFilter === 'ALL' || c.result === resultFilter;
    const matchesSearch =
      c.attributeLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.sources.some((s) => s.extractedValue.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesResult && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-6">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Cross-Document Consistency</h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-brand-50 text-brand-800 border border-brand-200/90 rounded-full">
              Comparison Engine Active
            </span>
          </div>
          <p className="text-sm text-slate-600">
            Compare extracted bidder information across submitted documents to detect inconsistencies and formatting variances.
          </p>
        </div>

        {/* Tender & Bidder Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-300">
            <Layers className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <select
              value={selectedTenderId}
              onChange={(e) => setSelectedTenderId(e.target.value)}
              className="text-xs font-bold bg-transparent text-slate-900 focus:outline-none cursor-pointer max-w-[140px] truncate"
            >
              {tenders.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.referenceNo}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-300">
            <Building2 className="w-3.5 h-3.5 text-navy-800 shrink-0" />
            <select
              value={selectedBidderId}
              onChange={(e) => setSelectedBidderId(e.target.value)}
              className="text-xs font-bold bg-transparent text-slate-900 focus:outline-none cursor-pointer max-w-[160px] truncate"
            >
              {bidders.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Decision-Support Disclosure Banner */}
      <div className="p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-lg flex items-center justify-between text-xs text-blue-900">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Decision Support Notice:</strong> Cross-document analysis provides evidence-based consistency checks. Final procurement decisions remain with the Procurement Officer.
          </span>
        </div>
        <span className="font-mono font-medium text-blue-700 hidden md:inline shrink-0">
          Consistency Analysis Protocol
        </span>
      </div>

      {/* Bidder + Tender Context Card */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-navy-50 border border-navy-200 flex items-center justify-center text-navy-900 font-bold">
            <GitCompare className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-slate-900 text-sm block">{currentBidder.name}</span>
            <span className="text-slate-500 font-mono">
              Bidder ID: {currentBidder.id} • Tender: {currentTender.referenceNo} ({currentTender.title})
            </span>
          </div>
        </div>

        <span className="px-3 py-1 bg-slate-100 rounded-lg border border-slate-200 font-mono text-slate-700 font-medium self-start sm:self-auto">
          3 Submitted Documents Compared
        </span>
      </div>

      {/* Consistency Summary Cards (Calculated dynamically) */}
      <ConsistencySummaryCards comparisons={comparisons} />

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search attribute, extracted value..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={resultFilter}
            onChange={(e) => setResultFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-800 cursor-pointer"
          >
            <option value="ALL">All Consistency Results</option>
            <option value="CONSISTENT">CONSISTENT Only</option>
            <option value="INCONSISTENT">INCONSISTENT Only</option>
            <option value="NEEDS REVIEW">NEEDS REVIEW Only</option>
          </select>
        </div>
      </div>

      {/* Consistency Analysis Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-navy-800" />
            Cross-Document Attribute Consistency Matrix
          </h2>
          <span className="text-xs font-mono text-slate-500">
            Showing {filteredComparisons.length} Attributes
          </span>
        </div>

        {filteredComparisons.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider bg-slate-50/60">
                  <th className="pb-3 pt-2.5 px-4">Field / Attribute</th>
                  <th className="pb-3 pt-2.5 px-4">Document 1 (Inc Cert)</th>
                  <th className="pb-3 pt-2.5 px-4">Document 2 (GST Cert)</th>
                  <th className="pb-3 pt-2.5 px-4">Document 3 (PAN Card)</th>
                  <th className="pb-3 pt-2.5 px-4">Result</th>
                  <th className="pb-3 pt-2.5 px-4">Confidence</th>
                  <th className="pb-3 pt-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredComparisons.map((comp) => {
                  const doc1 = comp.sources[0]?.extractedValue || 'N/A';
                  const doc2 = comp.sources[1]?.extractedValue || 'N/A';
                  const doc3 = comp.sources[2]?.extractedValue || 'N/A';

                  return (
                    <tr
                      key={comp.id}
                      className="hover:bg-slate-50/90 transition-colors group cursor-pointer"
                      onClick={() => {
                        setSelectedComparison(comp);
                        setIsModalOpen(true);
                      }}
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {comp.attributeLabel}
                        <p className="text-[10px] text-slate-400 font-mono">ID: {comp.id}</p>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-800 max-w-[150px]">
                        <span className="truncate block font-medium" title={doc1}>
                          {doc1}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-800 max-w-[150px]">
                        <span className="truncate block font-medium" title={doc2}>
                          {doc2}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-800 max-w-[150px]">
                        <span className="truncate block font-medium" title={doc3}>
                          {doc3}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <StatusBadge status={comp.result} />
                      </td>

                      <td className="py-3.5 px-4 font-mono text-emerald-700 font-semibold">
                        {comp.confidence}
                      </td>

                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs py-1 px-2.5 hover:border-navy-800"
                          onClick={() => {
                            setSelectedComparison(comp);
                            setIsModalOpen(true);
                          }}
                        >
                          Inspect Comparison
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500">
            <GitCompare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-800">No comparisons match your filters</p>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting search query or result filter dropdown.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Continuation Action Banner */}
      <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <h3 className="text-sm font-bold text-slate-900 font-sans">Consistency Analysis Finalized?</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Proceed to AI Recommendations & Officer Review Workspace.
          </p>
        </div>

        <Link href="/recommendations">
          <Button variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
            Continue to Compliance Scoring
          </Button>
        </Link>
      </div>

      {/* Attribute Detail Inspection Modal */}
      <ConsistencyDetailModal
        comparison={selectedComparison}
        bidderName={currentBidder.name}
        tenderRef={currentTender.referenceNo}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
