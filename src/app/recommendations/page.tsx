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
import { ExplainableFindingsList } from '@/components/explainable/ExplainableFindingsList';
import { OfficerDecisionModal } from '@/components/officer/OfficerDecisionModal';
import { OfficerDecisionState, FindingVerificationState } from '@/data/mockData';
import {
  ShieldAlert,
  Award,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  FileCheck,
  Info,
  Building2,
  Layers,
  Search,
  Filter,
  Bookmark,
  Sparkles,
  ArrowRight,
  Printer,
  Edit3,
  ShieldCheck,
  UserCheck,
  MessageSquare,
  History,
} from 'lucide-react';

export default function RecommendationsPage() {
  const {
    tenders,
    bidders,
    evaluateAllRules,
    getRequirementsByTenderId,
    getOfficerDecision,
    saveOfficerDecision,
    getFindingVerification,
    updateFindingVerification,
  } = useTenders();

  // Selectors State
  const [selectedTenderId, setSelectedTenderId] = useState('TND-2026-GEM-8921');
  const [selectedBidderId, setSelectedBidderId] = useState('BID-2026-901');

  // Step 12 Officer Decision Modal State
  const [targetDecision, setTargetDecision] = useState<OfficerDecisionState | null>(null);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);

  // Dynamic context
  const currentBidder = bidders.find((b) => b.id === selectedBidderId) || bidders[0];
  const currentTender = tenders.find((t) => t.id === selectedTenderId) || tenders[0];

  // Dynamic evaluations & comparisons
  const tenderReqs = getRequirementsByTenderId(selectedTenderId);
  const evaluations = evaluateAllRules(selectedBidderId, selectedTenderId);
  const comparisons = getCrossDocumentComparisonsForBidder(selectedBidderId, selectedTenderId);

  // Step 10 Scoring & Risk Engines
  const scoreSummary = calculateComplianceScore(evaluations, tenderReqs);
  const riskSummary = analyzeRiskProfile(evaluations, comparisons, tenderReqs);

  // Step 11 Explainable AI Engine
  const explainableFindings = generateExplainableFindings(
    evaluations,
    comparisons,
    tenderReqs,
    riskSummary
  );

  // Step 12 Officer Decision Record
  const activeDecisionRecord = getOfficerDecision(selectedBidderId);

  const handleOpenDecisionModal = (decision: OfficerDecisionState) => {
    setTargetDecision(decision);
    setIsDecisionModalOpen(true);
  };

  const handleConfirmDecision = (
    decision: OfficerDecisionState,
    rationale: string,
    clarificationText?: string,
    officerName: string = 'Rajesh V. (Senior Procurement Officer)'
  ) => {
    const verifiedCount = explainableFindings.filter(
      (f) => getFindingVerification(f.findingId) === 'Verified / Confirmed'
    ).length;

    saveOfficerDecision(selectedBidderId, {
      id: `DEC-${selectedBidderId}-${Date.now().toString().slice(-4)}`,
      tenderId: selectedTenderId,
      bidderId: selectedBidderId,
      bidderName: currentBidder.name,
      tenderRef: currentTender.referenceNo,
      decision,
      rationale,
      clarificationText,
      scorePercentage: scoreSummary.scorePercentage,
      riskLevel: riskSummary.overallLevel,
      verifiedFindingsCount: verifiedCount,
      totalFindingsCount: explainableFindings.length,
      timestamp: 'Just now',
      officerName,
      traceabilitySummary: `${currentTender.referenceNo} • ${scoreSummary.scorePercentage}% Score • ${riskSummary.overallLevel}`,
    });
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Officer Review & Human Evaluation Decision
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-brand-50 text-brand-800 border border-brand-200/90 rounded-full">
              Officer Decision Workspace
            </span>
          </div>
          <p className="text-sm text-slate-600">
            Review findings, verify evidence items, and record official human procurement decisions with complete auditability.
          </p>
        </div>

        {/* Tender & Bidder Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-300">
            <Layers className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <select
              value={selectedTenderId}
              onChange={(e) => setSelectedTenderId(e.target.value)}
              className="text-xs font-bold bg-transparent text-slate-900 focus:outline-none cursor-pointer max-w-[140px] truncate"
            >
              {tenders.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.referenceNo}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-300">
            <Building2 className="w-3.5 h-3.5 text-navy-800 shrink-0" />
            <select
              value={selectedBidderId}
              onChange={(e) => setSelectedBidderId(e.target.value)}
              className="text-xs font-bold bg-transparent text-slate-900 focus:outline-none cursor-pointer max-w-[160px] truncate"
            >
              {bidders.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Procurement Officer Authority Disclosure Banner */}
      <div className="p-4 bg-blue-50/90 border border-blue-200/90 rounded-xl flex items-center justify-between text-xs text-blue-900 shadow-xs">
        <div className="flex items-center gap-2.5">
          <Info className="w-5 h-5 text-blue-600 shrink-0" />
          <div>
            <strong className="block font-bold">Decision Support & Human Authority Disclosure</strong>
            <span>
              AI analysis provides decision support only. Final procurement qualification or disqualification remains strictly with the Procurement Officer. System never auto-rejects or auto-qualifies bids.
            </span>
          </div>
        </div>
        <Link
          href="/audit"
          className="font-mono font-bold text-blue-800 shrink-0 hidden lg:flex items-center gap-1 px-3 py-1 bg-blue-100/80 rounded-lg border border-blue-300 hover:bg-blue-200 transition-colors"
        >
          <History className="w-3.5 h-3.5" /> View Audit Trail
        </Link>
      </div>

      {/* Recorded Officer Decision Status Banner (If Decision Exists) */}
      {activeDecisionRecord ? (
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-navy-900 text-white flex items-center justify-center font-bold">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase text-slate-500">Official Recorded Decision</span>
                  <span
                    className={`px-2.5 py-0.5 text-xs font-bold font-mono rounded border ${
                      activeDecisionRecord.decision === 'Qualified'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : activeDecisionRecord.decision === 'Disqualified'
                        ? 'bg-rose-50 text-rose-800 border-rose-300'
                        : activeDecisionRecord.decision === 'Clarification Requested'
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : 'bg-slate-100 text-slate-800 border-slate-300'
                    }`}
                  >
                    {activeDecisionRecord.decision.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Recorded by {activeDecisionRecord.officerName} • {activeDecisionRecord.timestamp}
                </p>
              </div>
            </div>

            <Link href="/audit">
              <Button variant="outline" size="sm" icon={<History className="w-3.5 h-3.5" />}>
                Audit Log Details
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Decision Rationale</span>
              <p className="text-slate-800 leading-relaxed font-sans">{activeDecisionRecord.rationale}</p>
            </div>

            {activeDecisionRecord.clarificationText ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg space-y-1">
                <span className="text-[10px] font-bold uppercase text-amber-800 block">Pending GeM Clarification Request</span>
                <p className="text-amber-900 leading-relaxed font-sans font-medium">{activeDecisionRecord.clarificationText}</p>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1 font-mono">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Verification Traceability</span>
                <p className="text-slate-700">{activeDecisionRecord.traceabilitySummary}</p>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* Context Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-navy-50 border border-navy-200 flex items-center justify-center text-navy-900 font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-slate-900 text-sm block">{currentBidder.name}</span>
            <span className="text-slate-500 font-mono">
              Bidder ID: {currentBidder.id} • Tender Ref: {currentTender.referenceNo} ({currentTender.department})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-slate-100 rounded-lg border border-slate-200 font-mono text-slate-700 font-medium">
            {evaluations.length} Total Requirements Assessed
          </span>
        </div>
      </div>

      {/* 2-Column Summary Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Compliance Score & Methodology */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-600" />
              Calculated Compliance Score
            </h2>
            <span className="text-xs font-mono font-bold text-slate-500">
              {scoreSummary.compliantCount} / {scoreSummary.totalRequirements} Satisfied
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
            {/* Circular Score Meter */}
            <div className="relative w-32 h-32 flex items-center justify-center rounded-full bg-slate-50 border-4 border-slate-200 shadow-inner shrink-0">
              <div className="text-center">
                <span className="text-3xl font-extrabold font-mono text-slate-900">
                  {scoreSummary.scorePercentage}%
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mt-0.5">
                  Overall Score
                </span>
              </div>
            </div>

            {/* Score Metrics List */}
            <div className="space-y-2 w-full text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/80 border border-emerald-200/80">
                <span className="font-semibold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Compliant Requirements
                </span>
                <span className="font-bold font-mono text-emerald-900">{scoreSummary.compliantCount}</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50/80 border border-amber-200/80">
                <span className="font-semibold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Needs Review (Partial 50%)
                </span>
                <span className="font-bold font-mono text-amber-900">{scoreSummary.needsReviewCount}</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-rose-50/80 border border-rose-200/80">
                <span className="font-semibold text-rose-900 flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" /> Non-Compliant Requirements
                </span>
                <span className="font-bold font-mono text-rose-900">{scoreSummary.nonCompliantCount}</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-100 border border-slate-200">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" /> Unmapped Evidence
                </span>
                <span className="font-bold font-mono text-slate-700">{scoreSummary.notEvaluatedCount}</span>
              </div>
            </div>
          </div>

          {/* Scoring Methodology Box */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Scoring Formula Methodology</span>
            <p className="text-slate-700 leading-relaxed font-sans">{scoreSummary.methodologyExplanation}</p>
          </div>
        </div>

        {/* Right Column: Risk Profile & Overview */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              Risk Analysis & Assessment
            </h2>
            <StatusBadge status={riskSummary.overallLevel} />
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
              <span className="text-[10px] font-bold uppercase text-rose-700 block">High Severity</span>
              <span className="text-2xl font-mono font-bold text-rose-800">{riskSummary.highSeverityCount}</span>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <span className="text-[10px] font-bold uppercase text-amber-700 block">Medium Severity</span>
              <span className="text-2xl font-mono font-bold text-amber-800">{riskSummary.mediumSeverityCount}</span>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <span className="text-[10px] font-bold uppercase text-blue-700 block">Low Severity</span>
              <span className="text-2xl font-mono font-bold text-blue-800">{riskSummary.lowSeverityCount}</span>
            </div>
          </div>

          <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2 shadow-md text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-brand-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-400" />
                Risk Assessment Rationale
              </span>
              <span className="text-[10px] font-mono text-slate-300">Risk Engine Log</span>
            </div>
            <p className="text-slate-200 leading-relaxed font-sans">
              {riskSummary.overallLevel === 'HIGH RISK'
                ? 'Bidder flagged with HIGH RISK due to unmapped mandatory evidence items (OEM Authorization Form and Core Switch Port Density Specification) requiring officer verification.'
                : 'Bidder assessed with LOW RISK. All mandatory technical and eligibility evidence satisfied.'}
            </p>
          </div>
        </div>
      </div>

      {/* STEP 11 EXPLAINABLE AI FINDINGS SECTION WITH STEP 12 VERIFICATION ACTIONS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-600" />
              Explainable AI Findings Workspace & Item Verification ({explainableFindings.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review AI findings individually and mark item verification status before recording the official evaluation decision.
            </p>
          </div>

          <span className="text-xs font-mono text-brand-700 bg-brand-50 px-2.5 py-1 rounded border border-brand-200 font-semibold">
            Officer Verification Layer
          </span>
        </div>

        {/* Render List with Verification Dropdowns */}
        <div className="space-y-3">
          {explainableFindings.map((finding) => {
            const currentVerification = getFindingVerification(finding.findingId);

            return (
              <div
                key={finding.findingId}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-navy-900 bg-navy-50 px-2 py-0.5 rounded border border-navy-200">
                      {finding.findingId}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold font-mono rounded border ${
                        finding.severity === 'HIGH'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : finding.severity === 'MEDIUM'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-blue-50 text-blue-800 border-blue-200'
                      }`}
                    >
                      {finding.severity}
                    </span>
                    <span className="text-slate-500 font-semibold">• {finding.category}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">{finding.findingTitle}</h3>
                  <p className="text-slate-600 leading-relaxed font-sans">{finding.humanReadableExplanation}</p>

                  <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 pt-0.5">
                    <span>Source: {finding.sourceDocumentName} ({finding.sourcePage})</span>
                    <span>• {finding.traceability}</span>
                  </div>
                </div>

                {/* Finding Verification Action Dropdown */}
                <div className="flex flex-col items-end gap-1.5 shrink-0 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Officer Verification Status</span>
                  <select
                    value={currentVerification}
                    onChange={(e) =>
                      updateFindingVerification(finding.findingId, e.target.value as FindingVerificationState)
                    }
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border focus:outline-none cursor-pointer ${
                      currentVerification === 'Verified / Confirmed'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : currentVerification === 'Needs Clarification'
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : currentVerification === 'Mark as Resolved'
                        ? 'bg-blue-50 text-blue-800 border-blue-300'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    <option value="Keep Pending">⏳ Keep Pending</option>
                    <option value="Verified / Confirmed">✓ Verified / Confirmed</option>
                    <option value="Needs Clarification">⚠️ Needs Clarification</option>
                    <option value="Mark as Resolved">✔ Mark as Resolved</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 12 HUMAN DECISION CONTROLS SECTION */}
      <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-brand-400" />
              <h2 className="text-base font-bold text-white">
                Execute Procurement Officer Human Decision
              </h2>
            </div>
            <p className="text-xs text-slate-300">
              Select official evaluation decision for Bidder: <strong className="text-white">{currentBidder.name}</strong>
            </p>
          </div>

          <span className="text-xs font-mono text-brand-300 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
            Evaluation Decision Protocol
          </span>
        </div>

        {/* 4 Human Decision Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 text-xs">
          {/* Qualify */}
          <button
            onClick={() => handleOpenDecisionModal('Qualified')}
            className="p-4 rounded-xl border border-emerald-500/50 bg-emerald-950/60 hover:bg-emerald-900/80 transition-all text-left group space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-300 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Qualify Bidder
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-[11px] text-emerald-200/80 leading-snug">
              Confirm bidder satisfies all mandatory technical, eligibility, and financial requirements.
            </p>
          </button>

          {/* Disqualify */}
          <button
            onClick={() => handleOpenDecisionModal('Disqualified')}
            className="p-4 rounded-xl border border-rose-500/50 bg-rose-950/60 hover:bg-rose-900/80 transition-all text-left group space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-300 text-sm flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-400" /> Disqualify Bidder
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-rose-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-[11px] text-rose-200/80 leading-snug">
              Record non-qualification due to non-compliance with mandatory tender clauses.
            </p>
          </button>

          {/* Request Clarification */}
          <button
            onClick={() => handleOpenDecisionModal('Clarification Requested')}
            className="p-4 rounded-xl border border-amber-500/50 bg-amber-950/60 hover:bg-amber-900/80 transition-all text-left group space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-300 text-sm flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-amber-400" /> Request Clarification
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-[11px] text-amber-200/80 leading-snug">
              Issue an official GeM portal clarification notice to the bidder for unmapped or pending evidence.
            </p>
          </button>

          {/* Keep Under Review */}
          <button
            onClick={() => handleOpenDecisionModal('Under Review')}
            className="p-4 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 transition-all text-left group space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 text-sm flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-slate-400" /> Keep Under Review
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              De-escalate status and maintain bid under active evaluation for committee review.
            </p>
          </button>
        </div>
      </div>

      {/* Confirmation Modal Component */}
      {targetDecision && (
        <OfficerDecisionModal
          isOpen={isDecisionModalOpen}
          onClose={() => setIsDecisionModalOpen(false)}
          targetDecision={targetDecision}
          bidderName={currentBidder.name}
          bidderId={selectedBidderId}
          tenderRef={currentTender.referenceNo}
          tenderId={selectedTenderId}
          complianceScore={scoreSummary.scorePercentage}
          riskLevel={riskSummary.overallLevel}
          unresolvedFindingsCount={
            explainableFindings.filter((f) => getFindingVerification(f.findingId) === 'Keep Pending').length
          }
          totalFindingsCount={explainableFindings.length}
          onConfirmDecision={handleConfirmDecision}
        />
      )}
    </div>
  );
}
