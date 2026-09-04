'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { OfficerDecisionState } from '@/data/mockData';
import {
  X,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  HelpCircle,
  FileCheck,
  Edit3,
} from 'lucide-react';

interface OfficerDecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetDecision: OfficerDecisionState;
  bidderName: string;
  bidderId: string;
  tenderRef: string;
  tenderId: string;
  complianceScore: number;
  riskLevel: string;
  unresolvedFindingsCount: number;
  totalFindingsCount: number;
  onConfirmDecision: (decision: OfficerDecisionState, rationale: string, clarificationText?: string, officerName?: string) => void;
}

export const OfficerDecisionModal: React.FC<OfficerDecisionModalProps> = ({
  isOpen,
  onClose,
  targetDecision,
  bidderName,
  bidderId,
  tenderRef,
  tenderId,
  complianceScore,
  riskLevel,
  unresolvedFindingsCount,
  totalFindingsCount,
  onConfirmDecision,
}) => {
  const [rationale, setRationale] = useState('');
  const [clarificationText, setClarificationText] = useState('');
  const [officerName, setOfficerName] = useState('Rajesh V. (Senior Procurement Officer)');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [validationError, setValidationError] = useState('');

  if (!isOpen) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!rationale.trim() && targetDecision !== 'Clarification Requested') {
      setValidationError('Please enter a decision rationale before proceeding.');
      return;
    }

    if (targetDecision === 'Clarification Requested' && !clarificationText.trim()) {
      setValidationError('Please specify the exact clarification request text to send to the bidder.');
      return;
    }

    if (!isConfirmed) {
      setValidationError('You must check the confirmation declaration box before submitting.');
      return;
    }

    onConfirmDecision(targetDecision, rationale, clarificationText, officerName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl border border-slate-200 shadow-2xl overflow-hidden my-4 animate-in fade-in zoom-in-95 duration-200 text-xs">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div>
            <span className="text-[10px] font-mono font-bold text-navy-800 bg-navy-50 px-2 py-0.5 rounded border border-navy-200 uppercase">
              Officer Review & Decision Confirmation
            </span>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">
              Confirm Official Officer Evaluation Decision
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Authority Disclosure */}
        <div className="px-6 py-2.5 bg-blue-50 border-b border-blue-200 text-xs text-blue-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              <strong>Officer Authority:</strong> AI system provides decision support. This official evaluation decision is executed solely under your authority as Procurement Officer.
            </span>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Summary Box */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 text-sm block">{bidderName}</span>
                <span className="text-slate-500 font-mono">Tender Ref: {tenderRef}</span>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Selected Decision</span>
                <span
                  className={`px-3 py-1 text-xs font-bold font-mono rounded-lg border inline-block mt-0.5 ${
                    targetDecision === 'Qualified'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : targetDecision === 'Disqualified'
                      ? 'bg-rose-50 text-rose-800 border-rose-300'
                      : targetDecision === 'Clarification Requested'
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-slate-100 text-slate-800 border-slate-300'
                  }`}
                >
                  {targetDecision.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 text-center font-mono">
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Compliance Score</span>
                <span className="font-bold text-slate-900 text-sm">{complianceScore}%</span>
              </div>

              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Risk Profile</span>
                <span className="font-bold text-rose-700 text-xs mt-0.5 block">{riskLevel}</span>
              </div>

              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Pending Findings</span>
                <span className="font-bold text-slate-700 text-sm">{unresolvedFindingsCount} / {totalFindingsCount}</span>
              </div>
            </div>
          </div>

          {/* Target-Specific Inputs */}
          {targetDecision === 'Clarification Requested' ? (
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 block">
                Official GeM Clarification Notice Text <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                placeholder="Specify exact evidence or clarification required from the bidder..."
                value={clarificationText}
                onChange={(e) => setClarificationText(e.target.value)}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-800 font-sans"
              />
            </div>
          ) : null}

          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 block">
              Officer Evaluation Rationale & Remarks {targetDecision !== 'Clarification Requested' && <span className="text-rose-500">*</span>}
            </label>
            <textarea
              rows={3}
              placeholder="Record explicit verification rationale, clause references, or officer committee observations..."
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-800 font-sans"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 block">Evaluating Officer Name / Designation</label>
            <input
              type="text"
              value={officerName}
              onChange={(e) => setOfficerName(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono"
            />
          </div>

          {/* Validation Error Alert */}
          {validationError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              {validationError}
            </div>
          )}

          {/* Declaration Checkbox */}
          <label className="flex items-start gap-2.5 p-3.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
            <input
              type="checkbox"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              className="mt-0.5 rounded text-navy-800 focus:ring-navy-800"
            />
            <span className="text-slate-700 leading-relaxed">
              <strong>Mandatory Declaration:</strong> I confirm as the designated Procurement Officer that this evaluation decision is based on verified tender evidence, rule traceability, and human judgment in compliance with GeM procurement guidelines.
            </span>
          </label>

          {/* Footer Buttons */}
          <div className="pt-3 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 border-t border-slate-200">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant={targetDecision === 'Disqualified' ? 'danger' : 'primary'}
              size="sm"
              type="submit"
              icon={<ShieldCheck className="w-4 h-4" />}
            >
              Record Official Decision
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
