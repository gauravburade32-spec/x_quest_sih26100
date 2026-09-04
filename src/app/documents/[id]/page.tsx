'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useTenders } from '@/context/TenderContext';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { ProcessingPipelineStepper } from '@/components/intelligence/ProcessingPipelineStepper';
import { IntelligenceSummaryHeader } from '@/components/intelligence/IntelligenceSummaryHeader';
import { processDocumentIntelligence } from '@/utils/documentProcessor';
import { DocumentIntelligenceResult } from '@/data/mockData';
import {
  ArrowLeft,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Bookmark,
  Layers,
  Building2,
  Tag,
  ArrowRight,
  Eye,
  Info,
  Clock,
  Zap,
} from 'lucide-react';

export default function DocumentIntelligencePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const docId = resolvedParams.id;

  const {
    getBidderDocumentById,
    getBidderById,
    getTenderById,
    getRequirementsByTenderId,
    getIntelligenceResultByDocId,
    saveIntelligenceResult,
  } = useTenders();

  const doc = getBidderDocumentById(docId);
  const bidder = doc ? getBidderById(doc.bidderId) : null;
  const tender = doc ? getTenderById(doc.tenderId) : null;
  const existingResult = getIntelligenceResultByDocId(docId);

  const [activeTab, setActiveTab] = useState<'structured' | 'rawText'>('structured');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentResult, setCurrentResult] = useState<DocumentIntelligenceResult | null>(
    existingResult || null
  );
  const [isStep7ModalOpen, setIsStep7ModalOpen] = useState(false);

  if (!doc) {
    return (
      <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
        <h2 className="text-lg font-bold text-slate-900">Document Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">
          The requested document reference ID "{docId}" could not be located.
        </p>
        <Link href="/documents" className="mt-4 inline-block">
          <Button variant="outline" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
            Back to Document Repository
          </Button>
        </Link>
      </div>
    );
  }

  // Related requirement mapping for connection section
  const requirements = tender ? getRequirementsByTenderId(tender.id) : [];
  const mappedRequirement = requirements.find((r) =>
    r.category.toLowerCase().includes(doc.category.toLowerCase().split(' ')[0])
  ) || requirements[0];

  const handleProcessDocument = async () => {
    setIsProcessing(true);

    try {
      const result = await processDocumentIntelligence(
        doc.id,
        doc.category,
        doc.documentTitle,
        doc.fileName
      );

      setCurrentResult(result);
      saveIntelligenceResult(doc.id, result);
    } catch (err) {
      console.error('Extraction failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Top Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {bidder ? (
            <Link href={`/bidders/${bidder.id}`}>
              <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
                Back to {bidder.name}
              </Button>
            </Link>
          ) : (
            <Link href="/documents">
              <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
                Back to Document Repository
              </Button>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleProcessDocument}
            disabled={isProcessing}
            icon={<Zap className={`w-4 h-4 text-brand-600 ${isProcessing ? 'animate-spin' : ''}`} />}
          >
            {isProcessing ? 'Processing Engine...' : 'Process Document'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsStep7ModalOpen(true)}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Continue to Compliance Verification
          </Button>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-mono font-bold text-navy-900 bg-navy-50 px-2 py-0.5 rounded border border-navy-200">
                {doc.id}
              </span>
              <StatusBadge status={doc.status} />
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-brand-50 text-brand-800 border border-brand-200 rounded-full">
                Document Intelligence
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 leading-snug">
              {doc.documentTitle}
            </h1>
            <p className="text-xs text-slate-600 mt-1 font-mono">
              Filename: {doc.fileName} ({doc.fileSize}) • Category: {doc.category}
            </p>
          </div>

          <Button variant="outline" size="sm" icon={<Eye className="w-3.5 h-3.5" />}>
            Preview PDF
          </Button>
        </div>

        {/* Metadata Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Bidder</span>
            <span className="font-semibold text-slate-900 mt-0.5 truncate block" title={bidder?.name}>
              {bidder?.name || 'ABC Technologies Pvt. Ltd.'}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Tender Reference</span>
            <span className="font-semibold font-mono text-navy-900 mt-0.5">
              {tender?.referenceNo || 'GEM/2026/B/492104'}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Classification Method</span>
            <span className="font-semibold text-slate-800 mt-0.5 text-[11px]">
              {currentResult?.classificationMethod || 'User-selected category classification'}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">OCR Recognition</span>
            <span className="font-semibold text-slate-800 mt-0.5 font-mono text-[11px]">
              {currentResult?.ocrStatus || 'Native PDF Text'}
            </span>
          </div>
        </div>
      </div>

      {/* Information Banner */}
      <div className="p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-lg flex items-center justify-between text-xs text-blue-900">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Document Intelligence Engine:</strong> Extracted fields are parsed from document stream patterns. If a field is not present, it displays <em>Not detected</em>.
          </span>
        </div>
        <span className="font-mono font-medium text-blue-700 hidden md:inline shrink-0">
          Document Desk Active
        </span>
      </div>

      {/* Processing Pipeline Stepper */}
      <ProcessingPipelineStepper
        isProcessing={isProcessing}
        isProcessed={!!currentResult}
        ocrStatus={currentResult?.ocrStatus}
      />

      {/* Summary Header Metrics */}
      <IntelligenceSummaryHeader result={currentResult} category={doc.category} />

      {/* Workspace Tabs & Dual Panel Grid */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Workspace Toolbar */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('structured')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'structured'
                  ? 'bg-navy-900 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Structured Evidence Tab
            </button>
            <button
              onClick={() => setActiveTab('rawText')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'rawText'
                  ? 'bg-navy-900 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Extracted Text Stream Tab
            </button>
          </div>

          <span className="text-xs font-mono text-slate-500">
            {currentResult ? 'Processed State' : 'Awaiting Engine Trigger'}
          </span>
        </div>

        {/* TAB 1: STRUCTURED EVIDENCE & DUAL PANEL */}
        {activeTab === 'structured' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-200/80">
            {/* LEFT PANEL: Document & OCR Information */}
            <div className="p-6 space-y-4 bg-slate-50/30">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-navy-800" />
                Document Metadata & OCR Status
              </h3>

              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 shadow-2xs text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono uppercase">Document Title</span>
                  <p className="font-bold text-slate-900 mt-0.5">{doc.documentTitle}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-slate-500">Document Category</span>
                  <span className="font-semibold text-slate-800">{doc.category}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Text Recognition</span>
                  <span className="font-mono text-slate-800 font-semibold">
                    {currentResult?.ocrStatus || 'Native PDF Stream'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Classification Confidence</span>
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {currentResult?.classificationConfidence || 'High'}
                  </span>
                </div>
              </div>

              {/* Prepared for Requirement Mapping Connection Card */}
              {mappedRequirement && (
                <div className="p-4 bg-navy-950 text-white rounded-xl space-y-2 border border-navy-900 shadow-md text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-brand-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                      Prepared for Requirement Mapping
                    </span>
                    <span className="px-2 py-0.5 bg-navy-800 text-slate-300 rounded text-[10px] font-mono">
                      {mappedRequirement.id}
                    </span>
                  </div>
                  <p className="font-semibold text-white leading-snug">{mappedRequirement.title}</p>
                  <p className="text-[11px] text-slate-300">
                    Expected Evidence: {mappedRequirement.evidenceExpected}
                  </p>
                  <div className="pt-2 border-t border-navy-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Status: Evidence extracted — verification pending</span>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT PANEL: Extracted Evidence Table */}
            <div className="lg:col-span-2 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Extracted Evidence Fields & Confidence
                </h3>
                {!currentResult && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleProcessDocument}
                    disabled={isProcessing}
                    className="text-xs"
                  >
                    Run Extraction Engine
                  </Button>
                )}
              </div>

              {currentResult ? (
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider bg-slate-50/60">
                        <th className="pb-3 pt-2.5 px-4">Field Label</th>
                        <th className="pb-3 pt-2.5 px-4">Extracted Value</th>
                        <th className="pb-3 pt-2.5 px-4">Confidence</th>
                        <th className="pb-3 pt-2.5 px-4">Source Location</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentResult.fields.map((field, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            {field.label}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                            {field.value === 'Not detected' ? (
                              <span className="text-slate-400 font-normal italic">
                                Not detected
                              </span>
                            ) : (
                              <span className="text-slate-900">{field.value}</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 text-[10px] font-bold rounded border ${
                                field.confidence === 'High'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : field.confidence === 'Medium'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-slate-100 text-slate-500 border-slate-200'
                              }`}
                            >
                              {field.confidence}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-600">
                            <span className="flex items-center gap-1 text-[11px]">
                              <Bookmark className="w-3 h-3 text-slate-400 shrink-0" />
                              {field.sourcePage}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center text-slate-500 border border-dashed border-slate-300 rounded-xl">
                  <Zap className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-800">Document Ready for Processing</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Click "Process Document" above to extract key evidence fields and text streams from this PDF.
                  </p>
                  <div className="mt-4">
                    <Button variant="primary" size="sm" onClick={handleProcessDocument}>
                      Process Document Now
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: EXTRACTED TEXT STREAM */}
        {activeTab === 'rawText' && (
          <div className="p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-navy-800" />
              Extracted Raw PDF Text Stream
            </h3>

            {currentResult && currentResult.rawTextPages.length > 0 ? (
              <div className="space-y-4">
                {currentResult.rawTextPages.map((page) => (
                  <div key={page.pageNumber} className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-navy-900">Page {page.pageNumber}</span>
                      <span className="text-slate-500">{page.text.length} Characters</span>
                    </div>
                    <pre className="p-4 bg-slate-50 text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                      {page.text}
                    </pre>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500 border border-dashed border-slate-300 rounded-xl">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-800">No Text Extracted Yet</p>
                <p className="text-xs text-slate-400 mt-1">
                  Run "Process Document" to inspect page text streams.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Verification Action Modal */}
      {isStep7ModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-xl p-6 border border-slate-200 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-navy-50 text-navy-800 flex items-center justify-center mx-auto shadow-inner">
              <Sparkles className="w-6 h-6 text-brand-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Compliance Verification & Rules Engine
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Extracted document fields and verified claims are ready for evaluation against mandatory compliance rules.
              </p>
            </div>
            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => setIsStep7ModalOpen(false)}
              >
                Acknowledge & Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
