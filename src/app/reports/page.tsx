'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTenders } from '@/context/TenderContext';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { calculateComplianceScore } from '@/utils/scoringEngine';
import { analyzeRiskProfile } from '@/utils/riskEngine';
import { getCrossDocumentComparisonsForBidder } from '@/utils/consistencyEngine';
import { generateExplainableFindings } from '@/utils/explainableAiEngine';
import {
  Printer,
  Download,
  FileText,
  Building2,
  Layers,
  Award,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  FileCheck,
  Info,
  Bookmark,
  UserCheck,
  History,
  ShieldCheck,
} from 'lucide-react';

export default function ReportsPage() {
  const {
    tenders,
    bidders,
    evaluateAllRules,
    getRequirementsByTenderId,
    getOfficerDecision,
    getFindingVerification,
    logAuditEvent,
  } = useTenders();

  // Selectors State
  const [selectedTenderId, setSelectedTenderId] = useState('TND-2026-GEM-8921');
  const [selectedBidderId, setSelectedBidderId] = useState('BID-2026-901');

  // Dynamic context
  const currentBidder = bidders.find((b) => b.id === selectedBidderId) || bidders[0];
  const currentTender = tenders.find((t) => t.id === selectedTenderId) || tenders[0];

  // Dynamic evaluations & comparisons
  const tenderReqs = getRequirementsByTenderId(selectedTenderId);
  const evaluations = evaluateAllRules(selectedBidderId, selectedTenderId);
  const comparisons = getCrossDocumentComparisonsForBidder(selectedBidderId, selectedTenderId);

  // Engines
  const scoreSummary = calculateComplianceScore(evaluations, tenderReqs);
  const riskSummary = analyzeRiskProfile(evaluations, comparisons, tenderReqs);
  const explainableFindings = generateExplainableFindings(
    evaluations,
    comparisons,
    tenderReqs,
    riskSummary
  );
  const activeDecisionRecord = getOfficerDecision(selectedBidderId);

  // Print Handler
  const handlePrintReport = () => {
    logAuditEvent({
      id: `AUD-${Date.now().toString().slice(-4)}`,
      action: 'Exported Executive Procurement Report (PDF/Print)',
      eventType: 'Report Export',
      user: 'Rajesh V.',
      userRole: 'Procurement Officer',
      tenderId: selectedTenderId,
      tenderRef: currentTender.referenceNo,
      bidderId: selectedBidderId,
      bidderName: currentBidder.name,
      details: `Generated printable evaluation report for ${currentBidder.name} (${currentTender.referenceNo}).`,
      timestamp: 'Just now',
      traceabilityLine: `${currentTender.referenceNo} • ${currentBidder.name} • Executive Report PDF`,
    });

    window.print();
  };

  // Export JSON Handler
  const handleExportJson = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      tender: currentTender,
      bidder: currentBidder,
      complianceScore: scoreSummary,
      riskAssessment: riskSummary,
      explainableFindings,
      officerDecision: activeDecisionRecord || 'Pending Decision',
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `BidSure_Audit_Report_${currentTender.referenceNo}_${currentBidder.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    logAuditEvent({
      id: `AUD-${Date.now().toString().slice(-4)}`,
      action: 'Exported JSON Evaluation Data Record',
      eventType: 'Report Export',
      user: 'Rajesh V.',
      userRole: 'Procurement Officer',
      tenderId: selectedTenderId,
      tenderRef: currentTender.referenceNo,
      bidderId: selectedBidderId,
      bidderName: currentBidder.name,
      details: `Exported structured JSON audit report for ${currentBidder.name}.`,
      timestamp: 'Just now',
      traceabilityLine: `${currentTender.referenceNo} • JSON Audit Record`,
    });
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Top Header Banner (Hidden on Print) */}
      <div className="print:hidden flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Executive Evaluation Report & Export
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-brand-50 text-brand-800 border border-brand-200/90 rounded-full">
              Executive Reports
            </span>
          </div>
          <p className="text-sm text-slate-600">
            Generate, preview, and print official procurement evaluation reports with full source traceability.
          </p>
        </div>

        {/* Action Controls & Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-300 text-xs">
            <Layers className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <select
              value={selectedTenderId}
              onChange={(e) => setSelectedTenderId(e.target.value)}
              className="font-bold bg-transparent text-slate-900 focus:outline-none cursor-pointer max-w-[140px] truncate"
            >
              {tenders.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.referenceNo}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-300 text-xs">
            <Building2 className="w-3.5 h-3.5 text-navy-800 shrink-0" />
            <select
              value={selectedBidderId}
              onChange={(e) => setSelectedBidderId(e.target.value)}
              className="font-bold bg-transparent text-slate-900 focus:outline-none cursor-pointer max-w-[160px] truncate"
            >
              {bidders.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <Button variant="outline" size="sm" icon={<Download className="w-3.5 h-3.5" />} onClick={handleExportJson}>
            Export JSON
          </Button>

          <Button variant="primary" size="sm" icon={<Printer className="w-3.5 h-3.5" />} onClick={handlePrintReport}>
            Print / Export PDF
          </Button>
        </div>
      </div>

      {/* Decision Support Disclosure Banner (Print Version Included) */}
      <div className="p-4 bg-blue-50/90 border border-blue-200/90 rounded-xl flex items-center justify-between text-xs text-blue-900 shadow-xs">
        <div className="flex items-center gap-2.5">
          <Info className="w-5 h-5 text-blue-600 shrink-0" />
          <div>
            <strong className="block font-bold">Decision Support & Authority Disclosure</strong>
            <span>
              AI analysis provides decision support only. Final procurement qualification or disqualification remains strictly with the Procurement Officer.
            </span>
          </div>
        </div>
        <span className="font-mono font-bold text-blue-800 shrink-0 hidden lg:inline px-3 py-1 bg-blue-100/80 rounded-lg border border-blue-300">
          Procurement Evaluation Standard
        </span>
      </div>

      {/* PRINTABLE EXECUTIVE REPORT DOCUMENT WORKSPACE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-8 space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-bold text-navy-800 uppercase tracking-widest block">
              Integrated Bid Verification & Evaluation Desk
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
              Official Bid Compliance & Risk Evaluation Summary
            </h1>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Report Generated on {new Date().toLocaleDateString('en-GB')}
            </p>
          </div>

          <div className="text-right font-mono text-xs">
            <span className="font-bold text-slate-900 block">{currentTender.referenceNo}</span>
            <span className="text-slate-500 block">Audit Log: AUD-901-2026</span>
          </div>
        </div>

        {/* 1. Tender & Bidder Identification Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <span className="text-[10px] uppercase font-bold text-navy-800 tracking-wider block border-b border-slate-200 pb-1">
              Tender Details
            </span>
            <div className="space-y-1 font-mono">
              <p><strong className="text-slate-900">Reference:</strong> {currentTender.referenceNo}</p>
              <p className="font-sans"><strong className="text-slate-900">Title:</strong> {currentTender.title}</p>
              <p><strong className="text-slate-900">Department:</strong> {currentTender.department}</p>
              <p><strong className="text-slate-900">Category:</strong> {currentTender.category}</p>
              <p><strong className="text-slate-900">Value:</strong> {currentTender.estimatedValue}</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <span className="text-[10px] uppercase font-bold text-navy-800 tracking-wider block border-b border-slate-200 pb-1">
              Bidder Information
            </span>
            <div className="space-y-1 font-mono">
              <p className="font-sans"><strong className="text-slate-900">Entity Name:</strong> {currentBidder.name}</p>
              <p><strong className="text-slate-900">Bidder ID:</strong> {currentBidder.id}</p>
              <p><strong className="text-slate-900">Registration / CIN:</strong> {currentBidder.registrationNo}</p>
              <p><strong className="text-slate-900">GSTIN:</strong> {currentBidder.gstin}</p>
              <p><strong className="text-slate-900">PAN:</strong> {currentBidder.pan}</p>
            </div>
          </div>
        </div>

        {/* 2. Executive Scores & Recorded Decision */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Calculated Compliance Score</span>
            <span className="text-3xl font-extrabold font-mono text-slate-900 mt-1 block">
              {scoreSummary.scorePercentage}%
            </span>
            <span className="text-[11px] text-slate-500 block mt-1">
              {scoreSummary.compliantCount} of {scoreSummary.totalRequirements} Requirements Satisfied
            </span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Risk Profile Assessment</span>
            <div className="mt-2 flex justify-center">
              <StatusBadge status={riskSummary.overallLevel} />
            </div>
            <span className="text-[11px] text-slate-500 block mt-2">
              {riskSummary.highSeverityCount} High • {riskSummary.mediumSeverityCount} Med • {riskSummary.lowSeverityCount} Low
            </span>
          </div>

          <div className="p-4 bg-navy-950 text-white rounded-xl text-center space-y-1">
            <span className="text-[10px] font-bold uppercase text-brand-300 block">Official Human Decision</span>
            <span
              className={`px-3 py-1 text-xs font-bold font-mono rounded-lg border inline-block mt-1 ${
                activeDecisionRecord?.decision === 'Qualified'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : activeDecisionRecord?.decision === 'Disqualified'
                  ? 'bg-rose-50 text-rose-800 border-rose-300'
                  : activeDecisionRecord?.decision === 'Clarification Requested'
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-slate-800 text-slate-200 border-slate-700'
              }`}
            >
              {(activeDecisionRecord?.decision || 'Under Review').toUpperCase()}
            </span>
            <span className="text-[10px] text-slate-300 block pt-1 font-mono">
              Evaluator: {activeDecisionRecord?.officerName || 'Procurement Officer'}
            </span>
          </div>
        </div>

        {/* 3. Detailed Risk Findings Table */}
        <div className="space-y-2 text-xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-1">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            Detailed Risk Findings & Traceability ({riskSummary.totalRisks})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border border-slate-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px]">
                <th className="p-2.5">Severity</th>
                <th className="p-2.5">Category</th>
                <th className="p-2.5">Finding Title</th>
                <th className="p-2.5">Traceability</th>
                <th className="p-2.5">Evidence Explanation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {riskSummary.findings.map((r) => (
                <tr key={r.id}>
                  <td className="p-2.5 font-mono font-bold text-rose-700">{r.severity}</td>
                  <td className="p-2.5 font-bold text-slate-800">{r.category}</td>
                  <td className="p-2.5 font-semibold text-slate-900">{r.title}</td>
                  <td className="p-2.5 font-mono text-slate-500 text-[11px]">{r.traceability}</td>
                  <td className="p-2.5 text-slate-700">{r.explanation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

        {/* 4. Explainable AI Findings Matrix */}
        <div className="space-y-2 text-xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-1">
            <Sparkles className="w-4 h-4 text-brand-600" />
            Explainable AI Findings & Recommended Officer Actions ({explainableFindings.length})
          </h2>

          <div className="space-y-2">
            {explainableFindings.map((f) => (
              <div key={f.findingId} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-navy-900">{f.findingId} • {f.findingTitle}</span>
                  <span className="text-[10px] text-slate-500">Traceability: {f.traceability}</span>
                </div>
                <p className="text-slate-700 font-sans">{f.humanReadableExplanation}</p>
                <p className="text-[11px] text-navy-900 font-semibold font-sans">
                  <strong>Recommended Officer Action:</strong> {f.recommendedOfficerAction}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Officer Notes & Rationale */}
        {activeDecisionRecord && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-1">
              <FileCheck className="w-4 h-4 text-navy-800" />
              Officer Decision Rationale & Remarks
            </h2>
            <p className="text-slate-800 leading-relaxed font-sans">{activeDecisionRecord.rationale}</p>

            {activeDecisionRecord.clarificationText && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 font-medium font-sans">
                <strong>GeM Clarification Notice:</strong> {activeDecisionRecord.clarificationText}
              </div>
            )}
          </div>
        )}

        {/* Document Footer Signatures */}
        <div className="pt-8 border-t border-slate-300 grid grid-cols-2 gap-8 text-xs font-mono">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Evaluated By</span>
            <span className="font-bold text-slate-900 block mt-1">{activeDecisionRecord?.officerName || 'Rajesh V. (Senior Officer)'}</span>
            <span className="text-slate-500 block">Department of Procurement Evaluation</span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase">Platform Audit Certification</span>
            <span className="font-bold text-navy-900 block mt-1">BidSure AI Audit Seal Verified</span>
            <span className="text-slate-500 block">Timestamp: {new Date().toLocaleString('en-GB')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
