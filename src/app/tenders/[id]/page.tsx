'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useTenders } from '@/context/TenderContext';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { ExtractionStateBanner } from '@/components/requirements/ExtractionStateBanner';
import { RequirementSummaryCards } from '@/components/requirements/RequirementSummaryCards';
import { RequirementDetailModal } from '@/components/requirements/RequirementDetailModal';
import { TenderRequirement } from '@/data/mockData';
import {
  ArrowLeft,
  Search,
  Filter,
  FileText,
  Building2,
  Calendar,
  Sparkles,
  ArrowRight,
  Download,
  Info,
  Bookmark,
  Users,
  Link as LinkIcon,
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

export default function TenderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const tenderId = resolvedParams.id;

  const { getTenderById, getRequirementsByTenderId, getBiddersByTenderId } = useTenders();

  const tender = getTenderById(tenderId);
  const requirements = getRequirementsByTenderId(tenderId);
  const tenderBidders = getBiddersByTenderId(tenderId);

  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Modals
  const [selectedRequirement, setSelectedRequirement] = useState<TenderRequirement | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  if (!tender) {
    return (
      <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
        <h2 className="text-lg font-bold text-slate-900">Tender Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">
          The requested tender reference ID "{tenderId}" could not be located.
        </p>
        <Link href="/tenders" className="mt-4 inline-block">
          <Button variant="outline" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
            Back to Tenders
          </Button>
        </Link>
      </div>
    );
  }

  const filteredRequirements = requirements.filter((req) => {
    const matchesCategory =
      selectedCategory === 'ALL' || req.category === selectedCategory;

    const matchesType =
      typeFilter === 'ALL' ||
      (typeFilter === 'MANDATORY' && req.isMandatory) ||
      (typeFilter === 'OPTIONAL' && !req.isMandatory);

    const matchesSearch =
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-6">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/tenders">
          <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
            Back to Tenders Repository
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          <Link href={`/bidders`}>
            <Button variant="outline" size="sm" icon={<Users className="w-4 h-4" />}>
              View Bids ({tenderBidders.length > 0 ? tenderBidders.length : tender.bidsCount})
            </Button>
          </Link>
          <Link href="/requirements">
            <Button
              variant="primary"
              size="sm"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Evidence Mapping
            </Button>
          </Link>
        </div>
      </div>

      {/* Tender Header Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-mono font-bold text-navy-900 bg-navy-50 px-2 py-0.5 rounded border border-navy-200">
                {tender.referenceNo}
              </span>
              <StatusBadge status={tender.status} />
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-brand-50 text-brand-800 border border-brand-200 rounded-full">
                Extracted Requirements
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 leading-snug">
              {tender.title}
            </h1>
          </div>

          <Button variant="outline" size="sm" icon={<Download className="w-3.5 h-3.5" />}>
            {tender.uploadedDocumentName || "Tender_Document.pdf"}
          </Button>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Organization</span>
            <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {tender.department}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Deadline</span>
            <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5 font-mono">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {tender.closingDate}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Tender Value</span>
            <span className="font-semibold text-slate-900 mt-0.5 font-mono">
              {tender.estimatedValue}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Primary Bidder</span>
            <span className="font-semibold text-slate-800 mt-0.5">
              {tender.primaryBidder}
            </span>
          </div>
        </div>
      </div>

      {/* Extraction Stage Banner */}
      <ExtractionStateBanner />

      {/* 5 Dynamic Summary Cards */}
      <RequirementSummaryCards requirements={requirements} />

      {/* Main Requirements Section */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Section Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-navy-800" />
              Extracted Tender Requirements
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Structured requirement repository with expected evidence mappings.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500 bg-white px-2.5 py-1 rounded border border-slate-200">
            {filteredRequirements.length} Requirements Found
          </span>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 border-b border-slate-200/80 space-y-3 bg-slate-50/30">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSelectedCategory(tab.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                  selectedCategory === tab.value
                    ? 'bg-navy-900 text-white font-semibold shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search & Type Filter Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search requirements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-800"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-800 cursor-pointer"
              >
                <option value="ALL">All Types (Mandatory & Optional)</option>
                <option value="MANDATORY">Mandatory Only</option>
                <option value="OPTIONAL">Optional Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requirements Table */}
        {filteredRequirements.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider bg-slate-50/60">
                  <th className="pb-3 pt-2.5 px-4">Req ID</th>
                  <th className="pb-3 pt-2.5 px-4">Category & Type</th>
                  <th className="pb-3 pt-2.5 px-4">Requirement Title & Description</th>
                  <th className="pb-3 pt-2.5 px-4">Expected Evidence</th>
                  <th className="pb-3 pt-2.5 px-4">Source Page</th>
                  <th className="pb-3 pt-2.5 px-4">Status</th>
                  <th className="pb-3 pt-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequirements.map((req) => (
                  <tr
                    key={req.id}
                    className="hover:bg-slate-50/90 transition-colors group cursor-pointer"
                    onClick={() => {
                      setSelectedRequirement(req);
                      setIsDetailOpen(true);
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

                    <td className="py-3.5 px-4 max-w-sm">
                      <p className="font-bold text-slate-900 group-hover:text-navy-900 transition-colors">
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

                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      <span className="flex items-center gap-1 text-[11px]">
                        <Bookmark className="w-3 h-3 text-slate-400 shrink-0" />
                        {req.sourcePage}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={req.status} />
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs py-1 px-2.5"
                        onClick={() => {
                          setSelectedRequirement(req);
                          setIsDetailOpen(true);
                        }}
                      >
                        Inspect
                      </Button>
                    </td>
                  </tr>
                ))}
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

      {/* Bottom CTA */}
      <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <h3 className="text-sm font-bold text-slate-900 font-sans">Ready for Evidence Mapping?</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Proceed to map bidder submitted documents against these extracted tender requirements.
          </p>
        </div>

        <Link href="/requirements">
          <Button
            variant="primary"
            size="md"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Continue to Evidence Mapping
          </Button>
        </Link>
      </div>

      {/* Requirement Detail Modal */}
      <RequirementDetailModal
        requirement={selectedRequirement}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
}
