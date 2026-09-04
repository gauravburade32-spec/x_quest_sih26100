'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useTenders } from '@/context/TenderContext';
import { Tender } from '@/data/mockData';
import {
  X,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  Trash2,
  Info,
} from 'lucide-react';

interface TenderUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (createdTender: Tender) => void;
}

export const TenderUploadModal: React.FC<TenderUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { addTender } = useTenders();

  // Form State
  const [referenceNo, setReferenceNo] = useState('');
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [closingDate, setClosingDate] = useState('');
  const [category, setCategory] = useState('Information Technology Infrastructure');
  const [estimatedValue, setEstimatedValue] = useState('₹2,50,00,000');

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Errors & Validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    // Validate PDF type
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      setErrors((prev) => ({
        ...prev,
        file: 'Invalid file format. Please upload a PDF document (.pdf).',
      }));
      setSelectedFile(null);
      return;
    }

    // Validate size (max 25MB)
    const maxBytes = 25 * 1024 * 1024;
    if (file.size > maxBytes) {
      setErrors((prev) => ({
        ...prev,
        file: 'File size exceeds maximum limit of 25MB.',
      }));
      setSelectedFile(null);
      return;
    }

    // Clear file error and set file
    setErrors((prev) => {
      const next = { ...prev };
      delete next.file;
      return next;
    });
    setSelectedFile(file);
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!referenceNo.trim()) {
      newErrors.referenceNo = 'Tender Reference / ID is required.';
    }
    if (!title.trim()) {
      newErrors.title = 'Tender Title is required.';
    }
    if (!department.trim()) {
      newErrors.department = 'Procuring Organization is required.';
    }
    if (!closingDate.trim()) {
      newErrors.closingDate = 'Submission Deadline is required.';
    }
    if (!selectedFile) {
      newErrors.file = 'Tender PDF document is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const fileSizeFormatted = selectedFile
        ? (selectedFile.size / (1024 * 1024)).toFixed(1) + ' MB'
        : '3.5 MB';

      const newTender: Tender = {
        id: `TND-2026-GEM-${Math.floor(1000 + Math.random() * 9000)}`,
        referenceNo: referenceNo.trim(),
        title: title.trim(),
        department: department.trim(),
        category: category,
        estimatedValue: estimatedValue.trim() || '₹1,50,00,000',
        publishingDate: 'Today',
        closingDate: closingDate.trim(),
        status: 'Ready for Analysis',
        primaryBidder: 'Awaiting Bid Submissions',
        bidsCount: 0,
        uploadedDocumentName: selectedFile ? selectedFile.name : 'Tender_Document.pdf',
        uploadedDocumentSize: fileSizeFormatted,
        uploadDate: 'Today',
      };

      addTender(newTender);
      setIsSubmitting(false);
      onSuccess(newTender);
    }, 600);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-4">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-navy-800" />
              Create New Tender
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload tender document and enter procurement metadata.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Intake Notice */}
        <div className="px-6 py-2.5 bg-blue-50/90 border-b border-blue-200/80 text-xs text-blue-900 flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Tender Intake Notice:</strong> Uploaded documents will be prepared for automated Requirement Extraction.
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* SECTION A: Tender Document Upload */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              A. Tender Document Upload <span className="text-rose-500">*</span>
            </label>

            {!selectedFile ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-brand-600 bg-brand-50/50 scale-[0.99]'
                    : errors.file
                    ? 'border-rose-300 bg-rose-50/30 hover:border-rose-400'
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
                <div className="w-12 h-12 rounded-full bg-navy-50 text-navy-800 border border-navy-100 flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-800">
                  Upload Tender Document
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Drag and drop your PDF tender here, or click to choose file.
                </p>
                <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-mono">
                  <span>Accepted format: <strong>PDF</strong></span>
                  <span>•</span>
                  <span>Max file size: <strong>25MB</strong></span>
                </div>

                <div className="mt-4">
                  <Button type="button" variant="outline" size="sm">
                    Choose File
                  </Button>
                </div>
              </div>
            ) : (
              /* Selected File Preview Box */
              <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-xl flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate" title={selectedFile.name}>
                      {selectedFile.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 font-mono">
                      <span>{formatBytes(selectedFile.size)}</span>
                      <span>•</span>
                      <StatusBadge status="ready_for_analysis" label="Ready for analysis" />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                  title="Remove file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {errors.file && (
              <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.file}
              </p>
            )}
          </div>

          {/* SECTION B: Basic Tender Information */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              B. Basic Tender Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tender Reference */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tender Reference / ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. GEM/2026/B/5102938"
                  value={referenceNo}
                  onChange={(e) => {
                    setReferenceNo(e.target.value);
                    if (errors.referenceNo) setErrors((prev) => ({ ...prev, referenceNo: '' }));
                  }}
                  className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-800 ${
                    errors.referenceNo ? 'border-rose-300 bg-rose-50/20' : 'border-slate-300'
                  }`}
                />
                {errors.referenceNo && (
                  <p className="mt-1 text-[11px] text-rose-600">{errors.referenceNo}</p>
                )}
              </div>

              {/* Procuring Organization */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Procuring Organization <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ministry of Electronics & IT"
                  value={department}
                  onChange={(e) => {
                    setDepartment(e.target.value);
                    if (errors.department) setErrors((prev) => ({ ...prev, department: '' }));
                  }}
                  className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-800 ${
                    errors.department ? 'border-rose-300 bg-rose-50/20' : 'border-slate-300'
                  }`}
                />
                {errors.department && (
                  <p className="mt-1 text-[11px] text-rose-600">{errors.department}</p>
                )}
              </div>
            </div>

            {/* Tender Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tender Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Supply of Cloud Computing Infrastructure & Servers"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                }}
                className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-800 ${
                  errors.title ? 'border-rose-300 bg-rose-50/20' : 'border-slate-300'
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-[11px] text-rose-600">{errors.title}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Submission Deadline */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Submission Deadline <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={closingDate}
                  onChange={(e) => {
                    setClosingDate(e.target.value);
                    if (errors.closingDate) setErrors((prev) => ({ ...prev, closingDate: '' }));
                  }}
                  className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-800 ${
                    errors.closingDate ? 'border-rose-300 bg-rose-50/20' : 'border-slate-300'
                  }`}
                />
                {errors.closingDate && (
                  <p className="mt-1 text-[11px] text-rose-600">{errors.closingDate}</p>
                )}
              </div>

              {/* Estimated Tender Value */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Estimated Value (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ₹2,50,00,000"
                  value={estimatedValue}
                  onChange={(e) => setEstimatedValue(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-800"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isSubmitting}
              icon={isSubmitting ? null : <CheckCircle2 className="w-4 h-4" />}
            >
              {isSubmitting ? 'Uploading...' : 'Upload & Continue'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
