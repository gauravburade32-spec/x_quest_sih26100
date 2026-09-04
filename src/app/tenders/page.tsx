'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useTenders } from '@/context/TenderContext';
import { Tender } from '@/data/mockData';
import { TenderUploadModal } from '@/components/tenders/TenderUploadModal';
import { TenderDetailModal } from '@/components/tenders/TenderDetailModal';
import {
  PlusCircle,
  Search,
  Filter,
  FileCheck2,
  Info,
  CheckCircle2,
  ArrowUpRight,
  Building2,
  Calendar,
  FileText,
} from 'lucide-react';

export default function TendersPage() {
  const { tenders } = useTenders();

  // Modal States
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Success Banner State
  const [successBannerMessage, setSuccessBannerMessage] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const handleUploadSuccess = (createdTender: Tender) => {
    setIsUploadModalOpen(false);
    setSuccessBannerMessage(
      `Tender "${createdTender.title}" uploaded successfully. The tender is ready for requirement analysis.`
    );
    setSelectedTender(createdTender);
    setIsDetailModalOpen(true);
  };

  const filteredTenders = tenders.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || t.status.toLowerCase().replace(/ /g, '_') === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-6">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tenders</h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-brand-50 text-brand-800 border border-brand-200/90 rounded-full">
              Intake Active
            </span>
          </div>
          <p className="text-sm text-slate-600">
            Manage tender documents and initiate compliance verification.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<PlusCircle className="w-4 h-4" />}
          onClick={() => setIsUploadModalOpen(true)}
        >
          + New Tender
        </Button>
      </div>

      {/* Tender Repository Information Banner */}
      <div className="p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-lg flex items-center justify-between text-xs text-blue-900">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Tender Repository:</strong> Uploaded tender documents are staged for automated requirement extraction and eligibility verification.
          </span>
        </div>
        <span className="font-mono font-medium text-blue-700 hidden md:inline shrink-0">
          Intake Desk
        </span>
      </div>

      {/* Success Notification Banner */}
      {successBannerMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start justify-between gap-3 shadow-xs animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-medium">{successBannerMessage}</p>
          </div>
          <button
            onClick={() => setSuccessBannerMessage(null)}
            className="text-emerald-700 hover:text-emerald-950 text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search reference, title, organization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-800"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-800 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="ready_for_analysis">Ready for Analysis</option>
            <option value="under_review">Under Review</option>
            <option value="active">Active</option>
            <option value="ready_for_review">Ready for Review</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Tender List Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-navy-800" />
            Tender Repository
          </h2>
          <span className="text-xs font-mono text-slate-500">
            Showing {filteredTenders.length} Tenders
          </span>
        </div>

        {filteredTenders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider bg-slate-50/60">
                  <th className="pb-3 pt-2.5 px-4">Tender Reference</th>
                  <th className="pb-3 pt-2.5 px-4">Tender Title</th>
                  <th className="pb-3 pt-2.5 px-4">Department / Organization</th>
                  <th className="pb-3 pt-2.5 px-4">Submission Deadline</th>
                  <th className="pb-3 pt-2.5 px-4">Bids Received</th>
                  <th className="pb-3 pt-2.5 px-4">Status</th>
                  <th className="pb-3 pt-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTenders.map((tender) => (
                  <tr
                    key={tender.id}
                    className="hover:bg-slate-50/90 transition-colors group cursor-pointer"
                    onClick={() => {
                      setSelectedTender(tender);
                      setIsDetailModalOpen(true);
                    }}
                  >
                    {/* Reference */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-navy-900 group-hover:text-brand-600 transition-colors">
                        {tender.referenceNo}
                      </span>
                    </td>

                    {/* Title */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-semibold text-slate-900 group-hover:text-navy-950 line-clamp-1">
                        {tender.title}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Val: {tender.estimatedValue}
                      </p>
                    </td>

                    {/* Department */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[180px]" title={tender.department}>
                          {tender.department}
                        </span>
                      </div>
                    </td>

                    {/* Deadline */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-slate-600 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{tender.closingDate}</span>
                      </div>
                    </td>

                    {/* Bids Received */}
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                      {tender.bidsCount}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={tender.status} />
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs py-1 px-2.5 hover:border-navy-800"
                        onClick={() => {
                          setSelectedTender(tender);
                          setIsDetailModalOpen(true);
                        }}
                      >
                        View Detail <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty Search State */
          <div className="p-12 text-center text-slate-500">
            <FileCheck2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-800">No tenders match your search</p>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search filters or upload a new tender document.
            </p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <TenderUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={handleUploadSuccess}
      />

      {/* Detail Preview Modal */}
      <TenderDetailModal
        tender={selectedTender}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  );
}
