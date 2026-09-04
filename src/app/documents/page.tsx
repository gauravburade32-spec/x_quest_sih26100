'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTenders } from '@/context/TenderContext';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { DocumentPreviewModal } from '@/components/bidders/DocumentPreviewModal';
import { BidderDocument } from '@/data/mockData';
import {
  FileText,
  Search,
  Filter,
  Eye,
  Info,
  Tag,
  Building2,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';

const CATEGORY_TABS = [
  'ALL',
  'GST Registration',
  'PAN Card',
  'Certificate of Incorporation',
  'Technical Specification Conformance',
  'Financial Evidence (Audited Balance Sheet)',
  'OEM Authorization Form (MAF)',
  'ISO Certification',
  'Warranty Undertaking',
];

export default function DocumentsPage() {
  const { bidderDocuments, bidders, tenders } = useTenders();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedTenderId, setSelectedTenderId] = useState('ALL');

  // Preview Modal
  const [selectedDoc, setSelectedDoc] = useState<BidderDocument | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const filteredDocs = bidderDocuments.filter((doc) => {
    const matchesCategory =
      selectedCategory === 'ALL' || doc.category === selectedCategory;

    const matchesTender =
      selectedTenderId === 'ALL' || doc.tenderId === selectedTenderId;

    const matchesSearch =
      doc.documentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesTender && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-6">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Document Repository</h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-brand-50 text-brand-800 border border-brand-200/90 rounded-full">
              Repository Active
            </span>
          </div>
          <p className="text-sm text-slate-600">
            Central evidence document repository across tenders and registered bidders.
          </p>
        </div>

        {/* Tender Selector */}
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
      </div>

      {/* Document Intake Repository Information Banner */}
      <div className="p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-lg flex items-center justify-between text-xs text-blue-900">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Document Repository:</strong> Uploaded bidder evidence documents staged for Document Intelligence and OCR verification.
          </span>
        </div>
        <span className="font-mono font-medium text-blue-700 hidden md:inline shrink-0">
          Document Desk
        </span>
      </div>

      {/* Category Tabs & Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORY_TABS.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                selectedCategory === cat
                  ? 'bg-navy-900 text-white font-semibold shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Categories' : cat}
            </button>
          ))}
        </div>

        {/* Search Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search document title, filename, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-800"
            />
          </div>

          <div className="text-xs font-mono text-slate-500">
            Showing {filteredDocs.length} Submitted Documents
          </div>
        </div>
      </div>

      {/* Document Repository Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-navy-800" />
            Evidence Document Matrix
          </h2>
          <span className="text-xs font-mono text-slate-500">
            Bidder Evidence
          </span>
        </div>

        {filteredDocs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider bg-slate-50/60">
                  <th className="pb-3 pt-2.5 px-4">Document Title</th>
                  <th className="pb-3 pt-2.5 px-4">Category</th>
                  <th className="pb-3 pt-2.5 px-4">Bidder</th>
                  <th className="pb-3 pt-2.5 px-4">Filename & Size</th>
                  <th className="pb-3 pt-2.5 px-4">Uploaded</th>
                  <th className="pb-3 pt-2.5 px-4">Status</th>
                  <th className="pb-3 pt-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDocs.map((doc) => {
                  const bidder = bidders.find((b) => b.id === doc.bidderId);
                  return (
                    <tr key={doc.id} className="hover:bg-slate-50/90 transition-colors">
                      <td className="py-3.5 px-4">
                        <Link
                          href={`/documents/${doc.id}`}
                          className="font-bold text-slate-900 hover:text-brand-600 transition-colors"
                        >
                          {doc.documentTitle}
                        </Link>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {doc.id}</p>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {doc.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <Link
                          href={`/bidders/${doc.bidderId}`}
                          className="font-bold text-slate-900 hover:text-brand-600 transition-colors"
                        >
                          {bidder?.name || doc.bidderId}
                        </Link>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-600 max-w-xs">
                        <p className="truncate font-semibold text-slate-800" title={doc.fileName}>
                          {doc.fileName}
                        </p>
                        <p className="text-[10px] text-slate-400">{doc.fileSize}</p>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-500">
                        {doc.uploadedAt}
                      </td>

                      <td className="py-3.5 px-4">
                        <StatusBadge status={doc.status} />
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link href={`/documents/${doc.id}`}>
                            <Button
                              variant="secondary"
                              size="sm"
                              className="text-xs py-1 px-2"
                              icon={<Zap className="w-3.5 h-3.5" />}
                            >
                              Intelligence
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs py-1 px-2"
                            icon={<Eye className="w-3.5 h-3.5" />}
                            onClick={() => {
                              setSelectedDoc(doc);
                              setIsPreviewOpen(true);
                            }}
                          >
                            View
                          </Button>
                        </div>
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
            <p className="text-sm font-semibold text-slate-800">No documents match your filters</p>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting search query or category tabs.
            </p>
          </div>
        )}
      </div>

      {/* Document Preview Modal */}
      <DocumentPreviewModal
        document={selectedDoc}
        bidderName={bidders.find((b) => b.id === selectedDoc?.bidderId)?.name}
        tenderRef={bidders.find((b) => b.id === selectedDoc?.bidderId)?.tenderRef}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
}
