'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useTenders } from '@/context/TenderContext';
import { BidderDocument } from '@/data/mockData';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Tag,
  Trash2,
} from 'lucide-react';

const DOCUMENT_CATEGORIES = [
  'GST Registration',
  'PAN Card',
  'Certificate of Incorporation',
  'Technical Specification Conformance',
  'Financial Evidence (Audited Balance Sheet)',
  'OEM Authorization Form (MAF)',
  'ISO Certification',
  'Warranty Undertaking',
  'Other Tender Evidence',
];

interface BidderUploadZoneProps {
  bidderId: string;
  tenderId: string;
  onSuccess?: () => void;
}

export const BidderUploadZone: React.FC<BidderUploadZoneProps> = ({
  bidderId,
  tenderId,
  onSuccess,
}) => {
  const { addBidderDocument } = useTenders();

  const [documentTitle, setDocumentTitle] = useState('');
  const [category, setCategory] = useState('GST Registration');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      setError('Invalid format. Please upload a PDF file (.pdf).');
      setSelectedFile(null);
      return;
    }

    const maxBytes = 25 * 1024 * 1024;
    if (file.size > maxBytes) {
      setError('File size exceeds maximum limit of 25MB.');
      setSelectedFile(null);
      return;
    }

    setError(null);
    setSelectedFile(file);
    if (!documentTitle) {
      // Auto-set title from category or filename
      setDocumentTitle(category);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setError('Please select a PDF document to upload.');
      return;
    }

    setIsUploading(true);

    setTimeout(() => {
      const fileSizeFormatted = (selectedFile.size / (1024 * 1024)).toFixed(1) + ' MB';

      const newDoc: BidderDocument = {
        id: `DOC-${Math.floor(100 + Math.random() * 900)}-${Date.now().toString().slice(-2)}`,
        bidderId,
        tenderId,
        documentTitle: documentTitle.trim() || category,
        category,
        fileName: selectedFile.name,
        fileSize: fileSizeFormatted,
        uploadedAt: 'Just now',
        status: 'Uploaded — Ready for Verification',
      };

      addBidderDocument(newDoc);
      setIsUploading(false);
      setSelectedFile(null);
      setDocumentTitle('');
      if (onSuccess) onSuccess();
    }, 500);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
      <div>
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <UploadCloud className="w-4 h-4 text-navy-800" />
          Upload Bidder Evidence
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Submit documents required for tender compliance verification.
        </p>
      </div>

      <form onSubmit={handleUploadSubmit} className="space-y-4">
        {/* Category & Title Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Document Category <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  if (!documentTitle || DOCUMENT_CATEGORIES.includes(documentTitle)) {
                    setDocumentTitle(e.target.value);
                  }
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-800 cursor-pointer"
              >
                {DOCUMENT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Document Title / Label
            </label>
            <input
              type="text"
              placeholder="e.g. GST Registration Certificate 2026"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-800"
            />
          </div>
        </div>

        {/* PDF Dropzone */}
        {!selectedFile ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-brand-600 bg-brand-50/40'
                : error
                ? 'border-rose-300 bg-rose-50/20'
                : 'border-slate-300 bg-slate-50/50 hover:bg-slate-100/60 hover:border-navy-700'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              className="hidden"
            />
            <UploadCloud className="w-8 h-8 text-navy-800 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-800">
              Drag & Drop PDF Evidence File
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Click to choose PDF document (Max 25MB)
            </p>
          </div>
        ) : (
          /* Selected File State */
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <FileText className="w-5 h-5 text-rose-600 shrink-0" />
              <div className="min-w-0">
                <p className="font-bold text-slate-900 truncate">{selectedFile.name}</p>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                  <span>{formatBytes(selectedFile.size)}</span>
                  <span>•</span>
                  <StatusBadge status="uploaded_ready_for_verification" label="Ready for Verification" />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedFile(null)}
              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {error && (
          <p className="text-xs text-rose-600 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </p>
        )}

        <div className="flex justify-end pt-1">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!selectedFile || isUploading}
            icon={<PlusCircle className="w-4 h-4" />}
          >
            {isUploading ? 'Uploading...' : 'Upload Document'}
          </Button>
        </div>
      </form>
    </div>
  );
};
