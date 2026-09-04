'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTenders } from '@/context/TenderContext';
import { Button } from '@/components/ui/Button';
import { AuditEventDetailModal } from '@/components/audit/AuditEventDetailModal';
import { AuditEvent, AuditEventType, UserRole } from '@/data/mockData';
import {
  History,
  ShieldCheck,
  Building2,
  FileCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  Search,
  Filter,
  Bookmark,
  Info,
  Layers,
  ArrowRight,
  UserCheck,
  FileText,
} from 'lucide-react';

export default function AuditPage() {
  const { auditEvents, tenders, bidders } = useTenders();
  const [searchQuery, setSearchQuery] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('ALL');
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');
  const [selectedTenderId, setSelectedTenderId] = useState('ALL');

  // Detail Modal State
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const filteredEvents = auditEvents.filter((ev) => {
    const matchesEventType = eventTypeFilter === 'ALL' || ev.eventType === eventTypeFilter;
    const matchesRole = userRoleFilter === 'ALL' || ev.userRole === userRoleFilter;
    const matchesTender = selectedTenderId === 'ALL' || ev.tenderId === selectedTenderId;

    const matchesSearch =
      ev.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.tenderRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ev.bidderName && ev.bidderName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      ev.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.details.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesEventType && matchesRole && matchesTender && matchesSearch;
  });

  const humanDecisionsCount = auditEvents.filter((e) => e.eventType === 'Human Decision' || e.eventType === 'Clarification Notice').length;
  const ocrEventsCount = auditEvents.filter((e) => e.eventType === 'OCR Processing' || e.eventType === 'Requirement Extraction').length;

  return (
    <div className="space-y-6 pb-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Procurement System Audit Trail
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/90 rounded-full">
              Step 13 — Complete System Traceability
            </span>
          </div>
          <p className="text-sm text-slate-600">
            Chronological, searchable, and inspectable history of all system ingestion, OCR, rule evaluation, and officer decision events.
          </p>
        </div>

        <Link href="/reports">
          <Button variant="primary" size="sm" icon={<FileText className="w-4 h-4" />}>
            Executive Reports
          </Button>
        </Link>
      </div>

      {/* Decision Support Disclosure */}
      <div className="p-4 bg-blue-50/90 border border-blue-200/90 rounded-xl flex items-center justify-between text-xs text-blue-900 shadow-xs">
        <div className="flex items-center gap-2.5">
          <Info className="w-5 h-5 text-blue-600 shrink-0" />
          <div>
            <strong className="block font-bold">Auditability Disclosure</strong>
            <span>
              All system activities, automated evaluations, and human officer decisions are timestamped and linked to specific tender requirement IDs and evidence traceability lines.
            </span>
          </div>
        </div>
        <span className="font-mono font-bold text-blue-800 shrink-0 hidden lg:inline px-3 py-1 bg-blue-100/80 rounded-lg border border-blue-300">
          GeM Audit Standards
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Total Audit Events</span>
          <div className="mt-1.5 font-mono font-bold text-slate-900 text-2xl flex items-center gap-2">
            <History className="w-5 h-5 text-navy-800" />
            {auditEvents.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Indexed system activities</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Human Officer Actions</span>
          <div className="mt-1.5 font-mono font-bold text-emerald-700 text-2xl flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-600" />
            {humanDecisionsCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Officer decisions & notices</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">Document & OCR Ingestion</span>
          <div className="mt-1.5 font-mono font-bold text-blue-700 text-2xl flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            {ocrEventsCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Processed PDF files</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block">Active Tenders Logged</span>
          <div className="mt-1.5 font-mono font-bold text-slate-700 text-2xl flex items-center gap-2">
            <Layers className="w-5 h-5 text-slate-500" />
            {tenders.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Tenders monitored</p>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="relative w-full sm:w-72 text-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search action, tender ref, bidder, details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto text-xs">
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={eventTypeFilter}
              onChange={(e) => setEventTypeFilter(e.target.value)}
              className="text-xs bg-transparent text-slate-700 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Event Types</option>
              <option value="Tender Upload">Tender Upload</option>
              <option value="Requirement Extraction">Requirement Extraction</option>
              <option value="Document Submission">Document Submission</option>
              <option value="OCR Processing">OCR Processing</option>
              <option value="Evidence Mapping">Evidence Mapping</option>
              <option value="Rule Evaluation">Rule Evaluation</option>
              <option value="Consistency Check">Consistency Check</option>
              <option value="Risk Analysis">Risk Analysis</option>
              <option value="AI Explanation">AI Explanation</option>
              <option value="Officer Verification">Officer Verification</option>
              <option value="Clarification Notice">Clarification Notice</option>
              <option value="Human Decision">Human Decision</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
            <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={userRoleFilter}
              onChange={(e) => setUserRoleFilter(e.target.value)}
              className="text-xs bg-transparent text-slate-700 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Roles</option>
              <option value="Procurement Officer">Procurement Officer</option>
              <option value="Verification Engine">Verification Engine</option>
              <option value="OCR Engine">OCR Engine</option>
              <option value="GeM Ingestion System">GeM Ingestion System</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <History className="w-4 h-4 text-navy-800" />
            Audit Events History Log ({filteredEvents.length})
          </h2>
          <span className="text-xs font-mono text-slate-500">
            Chronological Audit Trail
          </span>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider bg-slate-50/60">
                  <th className="pb-3 pt-2.5 px-4">Event ID</th>
                  <th className="pb-3 pt-2.5 px-4">Date / Time</th>
                  <th className="pb-3 pt-2.5 px-4">Event Type</th>
                  <th className="pb-3 pt-2.5 px-4">Action & Details</th>
                  <th className="pb-3 pt-2.5 px-4">User / Actor</th>
                  <th className="pb-3 pt-2.5 px-4">Tender & Bidder</th>
                  <th className="pb-3 pt-2.5 px-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEvents.map((ev) => (
                  <tr key={ev.id} className="hover:bg-slate-50/90 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-navy-900 whitespace-nowrap">
                      {ev.id}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                      {ev.timestamp}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold font-mono rounded border ${
                          ev.eventType === 'Human Decision' || ev.eventType === 'Clarification Notice'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : ev.eventType === 'Officer Verification'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-blue-50 text-blue-800 border-blue-200'
                        }`}
                      >
                        {ev.eventType}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 max-w-sm">
                      <span className="font-bold text-slate-900 block">{ev.action}</span>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{ev.details}</p>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-700">
                      <span className="font-bold block text-slate-900">{ev.user}</span>
                      <span className="text-[10px] text-slate-400 block">{ev.userRole}</span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-600">
                      <span className="font-bold block text-slate-900">{ev.tenderRef}</span>
                      <span className="text-[10px] text-slate-500 block truncate max-w-[140px]">
                        {ev.bidderName || 'Tender Level'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs py-1 px-2.5 hover:border-navy-800"
                        onClick={() => {
                          setSelectedEvent(ev);
                          setIsDetailModalOpen(true);
                        }}
                      >
                        Inspect Event
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500">
            <History className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-800">No audit events match your filter</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting search keywords or filter dropdowns.</p>
          </div>
        )}
      </div>

      {/* Audit Event Detail Modal */}
      <AuditEventDetailModal
        event={selectedEvent}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  );
}
