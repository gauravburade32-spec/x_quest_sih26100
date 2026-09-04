'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTenders } from '@/context/TenderContext';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { RuleSummaryCards } from '@/components/rules/RuleSummaryCards';
import { RuleDetailModal } from '@/components/rules/RuleDetailModal';
import { ComplianceRule, RuleEvaluationRecord, TenderRequirement } from '@/data/mockData';
import {
  ShieldCheck,
  Search,
  Filter,
  Layers,
  Building2,
  Bookmark,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Sparkles,
  Zap,
  ShieldAlert,
} from 'lucide-react';

export default function VerificationPage() {
  const {
    tenders,
    bidders,
    requirements,
    rules,
    evaluateAllRules,
    getRuleByRequirementId,
    getRequirementsByTenderId,
  } = useTenders();

  // Selectors & Search State
  const [selectedTenderId, setSelectedTenderId] = useState('TND-2026-GEM-8921');
  const [selectedBidderId, setSelectedBidderId] = useState('BID-2026-901');
  const [searchQuery, setSearchQuery] = useState('');
  const [resultFilter, setResultFilter] = useState('ALL');

  // Inspection Modal State
  const [selectedRule, setSelectedRule] = useState<ComplianceRule | null>(null);
  const [selectedEval, setSelectedEval] = useState<RuleEvaluationRecord | null>(null);
  const [selectedReq, setSelectedReq] = useState<TenderRequirement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Run evaluation engine for active tender & bidder
  const evaluations = evaluateAllRules(selectedBidderId, selectedTenderId);
  const tenderReqs = getRequirementsByTenderId(selectedTenderId);

  const filteredEvaluations = evaluations.filter((evalRec) => {
    const req = tenderReqs.find((r) => r.id === evalRec.requirementId);
    const matchesResult =
      resultFilter === 'ALL' || evalRec.result === resultFilter;

    const matchesSearch =
      evalRec.requirementId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evalRec.fieldKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evalRec.actualValue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req && req.title.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesResult && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-6">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Compliance Rules Engine</h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-brand-50 text-brand-800 border border-brand-200/90 rounded-full">
              Rules Active
            </span>
          </div>
          <p className="text-sm text-slate-600">
            Deterministic rule-based evaluation of tender requirements against mapped bidder evidence.
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

      {/* Human-in-the-Loop Information Banner */}
      <div className="p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-lg flex items-center justify-between text-xs text-blue-900">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Decision Support Notice:</strong> Rule evaluation provides deterministic decision support. Final procurement qualification decisions remain with the Procurement Officer.
          </span>
        </div>
        <span className="font-mono font-medium text-blue-700 hidden md:inline shrink-0">
          Decision Support Protocol
        </span>
      </div>

      {/* Summary Metrics Banner */}
      <RuleSummaryCards evaluations={evaluations} />

      {/* Search & Result Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        {/* Search Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search req ID, rule field, actual value..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-800"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-800 cursor-pointer"
            >
              <option value="ALL">All Evaluation Results</option>
              <option value="COMPLIANT">COMPLIANT Only</option>
              <option value="NON-COMPLIANT">NON-COMPLIANT Only</option>
              <option value="NEEDS REVIEW">NEEDS REVIEW Only</option>
              <option value="NOT EVALUATED">NOT EVALUATED Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Compliance Evaluation Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-navy-800" />
            Configurable Compliance Evaluation Matrix
          </h2>
          <span className="text-xs font-mono text-slate-500">
            Showing {filteredEvaluations.length} Executed Rules
          </span>
        </div>

        {filteredEvaluations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider bg-slate-50/60">
                  <th className="pb-3 pt-2.5 px-4">Req ID</th>
                  <th className="pb-3 pt-2.5 px-4">Requirement Title</th>
                  <th className="pb-3 pt-2.5 px-4">Type</th>
                  <th className="pb-3 pt-2.5 px-4">Rule Definition</th>
                  <th className="pb-3 pt-2.5 px-4">Expected Value</th>
                  <th className="pb-3 pt-2.5 px-4">Actual Extracted</th>
                  <th className="pb-3 pt-2.5 px-4">Evaluation Result</th>
                  <th className="pb-3 pt-2.5 px-4">Source</th>
                  <th className="pb-3 pt-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEvaluations.map((evalRec) => {
                  const req = tenderReqs.find((r) => r.id === evalRec.requirementId);
                  const rule = getRuleByRequirementId(evalRec.requirementId);

                  return (
                    <tr
                      key={evalRec.id}
                      className="hover:bg-slate-50/90 transition-colors group cursor-pointer"
                      onClick={() => {
                        if (rule && req) {
                          setSelectedRule(rule);
                          setSelectedEval(evalRec);
                          setSelectedReq(req);
                          setIsModalOpen(true);
                        }
                      }}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-navy-900">
                        {evalRec.requirementId}
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                          {req?.title || evalRec.fieldKey}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">Rule: {evalRec.ruleId}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.2 text-[10px] font-bold rounded border ${
                            req?.isMandatory
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {req?.isMandatory ? 'Mandatory' : 'Optional'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        <span className="font-semibold text-slate-900">{rule?.ruleType || 'EXISTS'}</span>
                        <p className="text-[10px] text-slate-500">Operator: {rule?.operator || '=='}</p>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-800 font-semibold">
                        {evalRec.expectedValue}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {evalRec.actualValue}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                            evalRec.result === 'COMPLIANT'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : evalRec.result === 'NON-COMPLIANT'
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : evalRec.result === 'NEEDS REVIEW'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {evalRec.result === 'COMPLIANT' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                          {evalRec.result === 'NON-COMPLIANT' && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                          {evalRec.result === 'NEEDS REVIEW' && <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
                          {evalRec.result === 'NOT EVALUATED' && <HelpCircle className="w-3.5 h-3.5 text-slate-400" />}
                          {evalRec.result}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        <span className="flex items-center gap-1 text-[11px]">
                          <Bookmark className="w-3 h-3 text-slate-400 shrink-0" />
                          {evalRec.sourcePage || 'Page 1'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs py-1 px-2.5 hover:border-navy-800"
                          onClick={() => {
                            if (rule && req) {
                              setSelectedRule(rule);
                              setSelectedEval(evalRec);
                              setSelectedReq(req);
                              setIsModalOpen(true);
                            }
                          }}
                        >
                          Inspect Rule
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500">
            <ShieldAlert className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-800">No rule evaluation records match your filters</p>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting search query or result filter dropdown.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Continuation Action Banner */}
      <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <h3 className="text-sm font-bold text-slate-900 font-sans">Rules Evaluation Finalized?</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Proceed to Cross-Document Consistency analysis.
          </p>
        </div>

        <Link href="/compliance">
          <Button variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
            Continue to Cross-Document Consistency
          </Button>
        </Link>
      </div>

      {/* Rule Detail Inspection Modal */}
      <RuleDetailModal
        rule={selectedRule}
        evaluation={selectedEval}
        requirement={selectedReq}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
