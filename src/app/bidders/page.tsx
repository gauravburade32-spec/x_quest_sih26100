'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTenders } from '@/context/TenderContext';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import {
  Users,
  Search,
  Filter,
  Building2,
  FileText,
  User,
  ArrowUpRight,
  Info,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export default function BiddersPage() {
  const { bidders, tenders } = useTenders();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTenderFilter, setSelectedTenderFilter] = useState('ALL');

  const filteredBidders = bidders.filter((bidder) => {
    const matchesTender =
      selectedTenderFilter === 'ALL' || bidder.tenderId === selectedTenderFilter;

    const matchesSearch =
      bidder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bidder.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bidder.registrationNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bidder.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bidder.tenderRef.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTender && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-6">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Bidders Directory</h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-brand-50 text-brand-800 border border-brand-200/90 rounded-full">
              Verified Registrations
            </span>
          </div>
          <p className="text-sm text-slate-600">
            Manage registered bidders and evidence document submissions for compliance verification.
          </p>
        </div>

        {/* Tender Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedTenderFilter}
            onChange={(e) => setSelectedTenderFilter(e.target.value)}
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
      </div>

      {/* Verification Notice Banner */}
      <div className="p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-lg flex items-center justify-between text-xs text-blue-900">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            Bidder records and submitted evidence documents are securely managed for procurement compliance verification.
          </span>
        </div>
        <span className="font-mono font-medium text-blue-700 hidden md:inline shrink-0">
          Bidder Compliance Management
        </span>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search bidder name, ID, CIN, contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-800"
          />
        </div>

        <div className="text-xs text-slate-500 font-mono">
          Showing {filteredBidders.length} Registered Bidders
        </div>
      </div>

      {/* Bidders Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-navy-800" />
            Registered Bidders
          </h2>
          <span className="text-xs font-mono text-slate-500">
            Bidder Evidence Intake
          </span>
        </div>

        {filteredBidders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider bg-slate-50/60">
                  <th className="pb-3 pt-2.5 px-4">Bidder Name & ID</th>
                  <th className="pb-3 pt-2.5 px-4">Organization Type</th>
                  <th className="pb-3 pt-2.5 px-4">Registration / CIN</th>
                  <th className="pb-3 pt-2.5 px-4">Contact Person</th>
                  <th className="pb-3 pt-2.5 px-4">Bid / Tender Ref</th>
                  <th className="pb-3 pt-2.5 px-4">Docs Submitted</th>
                  <th className="pb-3 pt-2.5 px-4">Verification Status</th>
                  <th className="pb-3 pt-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBidders.map((bidder) => (
                  <tr
                    key={bidder.id}
                    className="hover:bg-slate-50/90 transition-colors group cursor-pointer"
                  >
                    {/* Name & ID */}
                    <td className="py-3.5 px-4">
                      <Link href={`/bidders/${bidder.id}`} className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                        {bidder.name}
                      </Link>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {bidder.id}</p>
                    </td>

                    {/* Org Type */}
                    <td className="py-3.5 px-4 text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {bidder.organizationType}
                      </span>
                    </td>

                    {/* Reg No */}
                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      {bidder.registrationNo}
                    </td>

                    {/* Contact Person */}
                    <td className="py-3.5 px-4 text-slate-800">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {bidder.contactPerson}
                      </span>
                    </td>

                    {/* Tender Ref */}
                    <td className="py-3.5 px-4 font-mono">
                      <Link
                        href={`/tenders/${bidder.tenderId}`}
                        className="font-bold text-navy-900 hover:text-brand-600 transition-colors"
                      >
                        {bidder.tenderRef}
                      </Link>
                      <p className="text-[10px] text-slate-400 truncate max-w-[140px]" title={bidder.tenderTitle}>
                        {bidder.tenderTitle}
                      </p>
                    </td>

                    {/* Docs Submitted */}
                    <td className="py-3.5 px-4 font-mono font-medium">
                      <span className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200">
                        {bidder.submittedCount} / {bidder.requiredCount} Docs
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={bidder.status} />
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <Link href={`/bidders/${bidder.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs py-1 px-2.5 hover:border-navy-800"
                        >
                          View Bid <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-800">No bidders match your search</p>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting tender filter or search query.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
