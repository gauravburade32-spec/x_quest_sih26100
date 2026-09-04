'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useTenders } from '@/context/TenderContext';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { BidderUploadZone } from '@/components/bidders/BidderUploadZone';
import { DocumentPreviewModal } from '@/components/bidders/DocumentPreviewModal';
import { BidderDocument } from '@/data/mockData';
import {
  ArrowLeft,
  Building2,
  FileText,
  User,
  Mail,
  ShieldCheck,
  Eye,
  Trash2,
  Sparkles,
  ArrowRight,
  Info,
  CheckCircle2,
  Clock,
  Layers,
  Tag,
  Zap,
} from 'lucide-react';

export default function BidderProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const bidderId = resolvedParams.id;

  const { getBidderById, getTenderById, getDocumentsByBidderId, removeBidderDocument } = useTenders();

  const bidder = getBidderById(bidderId);
  const bidderDocs = getDocumentsByBidderId(bidderId);
  const tender = bidder ? getTenderById(bidder.tenderId) : null;

  // Selected document for preview modal
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState<BidderDocument | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  if (!bidder) {
    return (
      <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
        <h2 className="text-lg font-bold text-slate-900">Bidder Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">
          The requested bidder reference ID "{bidderId}" could not be located.
        </p>
        <Link href="/bidders" className="mt-4 inline-block">
          <Button variant="outline" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
            Back to Bidders Directory
          </Button>
        </Link>
      </div>
    );
  }

  const requiredTotal = bidder.requiredCount || 9;
  const uploadedCount = bidderDocs.length;
  const pendingCount = Math.max(0, requiredTotal - uploadedCount);
  const isReady = uploadedCount >= requiredTotal;

  const firstDocId = bidderDocs.length > 0 ? bidderDocs[0].id : 'DOC-901-02';

  return (
    <div className="space-y-6 pb-6">
      {/* Top Breadcrumb & Active Tender Connection */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link href="/bidders">
          <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
            Back to Bidders Directory
          </Button>
        </Link>

        {tender && (
          <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-lg border border-slate-200/80 shadow-2xs text-xs">
            <Layers className="w-4 h-4 text-navy-800 shrink-0" />
            <span className="text-slate-500">Active Tender:</span>
            <Link
              href={`/tenders/${tender.id}`}
              className="font-bold text-navy-900 hover:text-brand-600 font-mono transition-colors"
            >
              {tender.referenceNo}
            </Link>
          </div>
        )}
      </div>

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-mono font-bold text-navy-900 bg-navy-50 px-2 py-0.5 rounded border border-navy-200">
                {bidder.id}
              </span>
              <StatusBadge status={bidder.status} />
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-brand-50 text-brand-800 border border-brand-200 rounded-full">
                Active Submission
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 leading-snug">
              {bidder.name}
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Registered Bidder for <span className="font-semibold text-slate-800">{bidder.tenderTitle}</span>
            </p>
          </div>

          <Link href={`/documents/${firstDocId}`}>
            <Button
              variant="primary"
              size="sm"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Document Intelligence
            </Button>
          </Link>
        </div>

        {/* Bidder Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Organization Type</span>
            <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {bidder.organizationType}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Registration No / CIN</span>
            <span className="font-semibold font-mono text-slate-800 mt-0.5 truncate block" title={bidder.registrationNo}>
              {bidder.registrationNo}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Contact Person</span>
            <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {bidder.contactPerson}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">GSTIN & PAN</span>
            <span className="font-semibold font-mono text-slate-800 mt-0.5">
              {bidder.gstin || "27AAACA1234B1Z9"}
            </span>
          </div>
        </div>
      </div>

      {/* Verification Notice Banner */}
      <div className="p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-lg flex items-center justify-between text-xs text-blue-900">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            Uploaded bidder evidence documents are securely managed and processed through automated document intelligence for compliance verification.
          </span>
        </div>
        <span className="font-mono font-medium text-blue-700 hidden md:inline shrink-0">
          Bidder Evidence Verification
        </span>
      </div>

      {/* Required vs Submitted Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Required Documents
          </span>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900">
            {requiredTotal}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Tender compliance baseline</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
            Uploaded Evidence
          </span>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-700">
            {uploadedCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Ready for verification</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
            Pending Evidence
          </span>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-700">
            {pendingCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Awaiting bidder submission</p>
        </div>
      </div>

      {/* Grid: Upload Form Zone + Submitted Document List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form Zone */}
        <div className="lg:col-span-1">
          <BidderUploadZone
            bidderId={bidder.id}
            tenderId={bidder.tenderId}
          />
        </div>

        {/* Submitted Documents Repository Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-navy-800" />
                  Submitted Evidence Documents
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Documents submitted by {bidder.name}
                </p>
              </div>
              <span className="text-xs font-mono text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                {bidderDocs.length} Documents
              </span>
            </div>

            {bidderDocs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider bg-slate-50/60">
                      <th className="pb-3 pt-2.5 px-4">Document Title</th>
                      <th className="pb-3 pt-2.5 px-4">Category</th>
                      <th className="pb-3 pt-2.5 px-4">Filename & Size</th>
                      <th className="pb-3 pt-2.5 px-4">Uploaded</th>
                      <th className="pb-3 pt-2.5 px-4">Status</th>
                      <th className="pb-3 pt-2.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bidderDocs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50/90 transition-colors">
                        <td className="py-3.5 px-4">
                          <Link href={`/documents/${doc.id}`} className="font-bold text-slate-900 hover:text-brand-600 transition-colors">
                            {doc.documentTitle}
                          </Link>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {doc.id}</p>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-medium text-slate-700 flex items-center gap-1">
                            <Tag className="w-3 h-3 text-slate-400 shrink-0" />
                            {doc.category}
                          </span>
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
                                setSelectedPreviewDoc(doc);
                                setIsPreviewOpen(true);
                              }}
                            >
                              View
                            </Button>
                            <button
                              onClick={() => removeBidderDocument(doc.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                              title="Remove document"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-800">No evidence documents uploaded yet</p>
                <p className="text-xs text-slate-400 mt-1">
                  Use the upload box on the left to submit required tender evidence documents.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Verification Readiness Footer */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-navy-800" />
            <h3 className="text-base font-bold text-slate-900">Verification Readiness</h3>
            <StatusBadge
              status={isReady ? 'ready_for_verification' : 'documents_pending'}
              label={isReady ? 'Ready for Document Intelligence' : 'Pending Evidence'}
            />
          </div>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            {uploadedCount} of {requiredTotal} required documents uploaded ({pendingCount} pending)
          </p>
        </div>

        <Link href={`/documents/${firstDocId}`}>
          <Button
            variant="primary"
            size="md"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Continue to Document Intelligence
          </Button>
        </Link>
      </div>

      {/* Document Preview Modal */}
      <DocumentPreviewModal
        document={selectedPreviewDoc}
        bidderName={bidder.name}
        tenderRef={bidder.tenderRef}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
}
