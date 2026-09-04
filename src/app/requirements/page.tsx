'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTenders } from '@/context/TenderContext';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { MappingSummaryCards } from '@/components/mapping/MappingSummaryCards';
import { MappingDetailModal } from '@/components/mapping/MappingDetailModal';
import { TenderRequirement } from '@/data/mockData';
import {
  FileText,
  Search,
  Filter,
  Layers,
  Bookmark,
  ArrowRight,
  Info,
  Link as LinkIcon,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Sparkles,
} from 'lucide-react';

const CATEGORY_TABS: { label: string; value: string }[] = [
  { label: 'All Categories', value: 'ALL' },
  { label: 'Eligibility', value: 'Eligibility' },
  { label: 'Technical', value: 'Technical' },
  { label: 'Financial', value: 'Financial' },
  { label: 'Mandatory Documents', value: 'Mandatory Documents' },
  { label: 'Certifications', value: 'Certifications / Standards' },
  { label: 'Tender-Specific', value: 'Tender-Specific Conditions' },
];

export default function RequirementsPage() {
  const {
    requirements,
    tenders,
    bidders,
    evidenceMappings,
    getRequirementCoverage,
    getMappingsByRequirementId,
  } = useTenders();

  // Search & Filter State
  const [selectedTenderId, setSelectedTenderId] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Bidder Filter for Mapping View
  const [selectedBidderId, setSelectedBidderId] = useState('BID-2026-901');

  // Mapping Detail Modal State
  const [selectedRequirement, setSelectedRequirement] = useState<TenderRequirement | null>(null);
  const [isMappingModalOpen, setIsMappingModalOpen] = useState(false);

  const filteredRequirements = requirements.filter((req) => {
    const matchesTender =
      selectedTenderId === 'ALL' || req.tenderId === selectedTenderId;

    const matchesCategory =
      selectedCategory === 'ALL' || req.category === selectedCategory;

    const matchesSearch =
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTender && matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-6">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Requirement Matrix & Evidence Mapping</h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-brand-50 text-brand-800 border border-brand-200/90 rounded-full">
              Mapping Active
            </span>
          </div>
          <p className="text-sm text-slate-600">
            Connect extracted tender requirements with submitted bidder evidence documents.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Tender Filter Selector */}
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedTenderId}
              onChange={(e) => setSelectedTenderId(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-800 cursor-pointer shadow-2xs max-w-xs truncate"
            >
              <option value="ALL">All Tenders ({tenders.length})</option>
              {tenders.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.referenceNo} — {t.title}
                </option>
              ))}
            </select>
          </div>

          <Link href="/verification">
            <Button variant="primary" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
              Continue to Verification
            </Button>
          </Link>
        </div>
      </div>

      {/* Evidence Mapping Information Banner */}
      <div className="p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-lg flex items-center justify-between text-xs text-blue-900">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Evidence Mapping Workspace:</strong> Connects extracted requirement clauses to submitted bidder evidence documents before running compliance decision rules.
          </span>
        </div>
        <span className="font-mono font-medium text-blue-700 hidden md:inline shrink-0">
          Mapping Workspace
        </span>
      </div>

      {/* Mapping Summary Cards */}
      <MappingSummaryCards requirements={requirements} mappings={evidenceMappings} />

      {/* Category Tabs & Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedCategory(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                selectedCategory === tab.value
                  ? 'bg-navy-900 text-white font-semibold shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Bidder Filter Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search requirement ID, title, evidence..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-800"
            />
          </div>

          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs text-slate-500 font-semibold">Active Bidder:</span>
            <select
              value={selectedBidderId}
              onChange={(e) => setSelectedBidderId(e.target.value)}
              className="px-3 py-1.5 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-800 cursor-pointer shadow-2xs"
            >
              {bidders.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.id})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Requirement Matrix Table with Evidence Mapping Columns */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-navy-800" />
            Extracted Requirement & Evidence Matrix
          </h2>
          <span className="text-xs font-mono text-slate-500">
            Showing {filteredRequirements.length} Clauses
          </span>
        </div>

        {filteredRequirements.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider bg-slate-50/60">
                  <th className="pb-3 pt-2.5 px-4">Req ID</th>
                  <th className="pb-3 pt-2.5 px-4">Category & Type</th>
                  <th className="pb-3 pt-2.5 px-4">Requirement Title & Description</th>
                  <th className="pb-3 pt-2.5 px-4">Expected Evidence</th>
                  <th className="pb-3 pt-2.5 px-4">Mapped Bidder Evidence</th>
                  <th className="pb-3 pt-2.5 px-4">Coverage Status</th>
                  <th className="pb-3 pt-2.5 px-4">Source</th>
                  <th className="pb-3 pt-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequirements.map((req) => {
                  const coverage = getRequirementCoverage(req.id, selectedBidderId);
                  const reqMappings = getMappingsByRequirementId(req.id, selectedBidderId);
                  const mappedDocs = reqMappings.filter((m) => m.mappedDocumentTitle);

                  return (
                    <tr
                      key={req.id}
                      className="hover:bg-slate-50/90 transition-colors group cursor-pointer"
                      onClick={() => {
                        setSelectedRequirement(req);
                        setIsMappingModalOpen(true);
                      }}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-navy-900">
                        {req.id}
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-800">{req.category}</p>
                        <span
                          className={`inline-block mt-0.5 px-2 py-0.2 text-[10px] font-bold rounded border ${
                            req.isMandatory
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {req.isMandatory ? 'Mandatory' : 'Optional'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                          {req.title}
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                          {req.description}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="text-slate-700 font-medium line-clamp-2">
                          {req.evidenceExpected}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 font-mono">
                        {mappedDocs.length > 0 ? (
                          <div>
                            <span className="font-semibold text-slate-900 truncate block max-w-[130px]" title={mappedDocs[0].mappedDocumentTitle}>
                              {mappedDocs[0].mappedDocumentTitle}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {coverage.mapped} of {coverage.total} Mapped
                            </span>
                          </div>
                        ) : (
                          <span className="text-rose-600 font-normal italic">
                            No evidence mapped
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <StatusBadge status={coverage.status} />
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        <span className="flex items-center gap-1 text-[11px]">
                          <Bookmark className="w-3 h-3 text-slate-400 shrink-0" />
                          {req.sourcePage}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs py-1 px-2.5 hover:border-navy-800"
                          icon={<LinkIcon className="w-3.5 h-3.5" />}
                          onClick={() => {
                            setSelectedRequirement(req);
                            setIsMappingModalOpen(true);
                          }}
                        >
                          Inspect Mapping
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
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-800">No requirements match your filters</p>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting category tabs or search query.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Continuation Action Banner */}
      <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <h3 className="text-sm font-bold text-slate-900 font-sans">Evidence Mapping Completed?</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Proceed to the Compliance Verification module to run rules engine checks.
          </p>
        </div>

        <Link href="/verification">
          <Button variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
            Continue to Verification
          </Button>
        </Link>
      </div>

      {/* Mapping Detail Workspace Modal */}
      <MappingDetailModal
        requirement={selectedRequirement}
        isOpen={isMappingModalOpen}
        onClose={() => setIsMappingModalOpen(false)}
      />
    </div>
  );
}
