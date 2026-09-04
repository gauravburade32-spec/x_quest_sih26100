'use client';

import React, { useState } from 'react';
import { ExplainableFinding } from '@/data/mockData';
import { ExplainableFindingModal } from './ExplainableFindingModal';
import { Button } from '@/components/ui/Button';
import {
  Sparkles,
  FileText,
  Bookmark,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Search,
  Filter,
} from 'lucide-react';

interface ExplainableFindingsListProps {
  findings: ExplainableFinding[];
}

export const ExplainableFindingsList: React.FC<ExplainableFindingsListProps> = ({ findings }) => {
  const [selectedFinding, setSelectedFinding] = useState<ExplainableFinding | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const filteredFindings = findings.filter((f) => {
    const matchesSev = severityFilter === 'ALL' || f.severity === severityFilter;
    const matchesSearch =
      f.findingTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.humanReadableExplanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.requirementId && f.requirementId.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSev && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="relative w-full sm:w-80 text-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search AI findings, requirement ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto text-xs">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-800 cursor-pointer"
          >
            <option value="ALL">All Severities ({findings.length})</option>
            <option value="HIGH">HIGH Severity Only</option>
            <option value="MEDIUM">MEDIUM Severity Only</option>
            <option value="LOW">LOW Severity Only</option>
          </select>
        </div>
      </div>

      {/* Findings Grid */}
      {filteredFindings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFindings.map((finding) => (
            <div
              key={finding.findingId}
              className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between group cursor-pointer"
              onClick={() => {
                setSelectedFinding(finding);
                setIsModalOpen(true);
              }}
            >
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-navy-900 bg-navy-50 px-2 py-0.5 rounded border border-navy-200">
                    {finding.findingId}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
                      finding.severity === 'HIGH'
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : finding.severity === 'MEDIUM'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-blue-50 text-blue-800 border-blue-200'
                    }`}
                  >
                    {finding.severity}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors leading-snug">
                  {finding.findingTitle}
                </h3>

                <p className="text-slate-600 line-clamp-2 leading-relaxed">
                  {finding.humanReadableExplanation}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span className="flex items-center gap-1">
                  <Bookmark className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {finding.sourceDocumentName} ({finding.sourcePage})
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs py-1 px-2.5 hover:border-navy-800"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFinding(finding);
                    setIsModalOpen(true);
                  }}
                >
                  Explain Finding
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-xl border border-slate-200 text-center text-slate-500">
          <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-800">No explainable findings match your filter</p>
          <p className="text-xs text-slate-400 mt-1">Try adjusting severity filter or search query.</p>
        </div>
      )}

      {/* Inspector Modal */}
      <ExplainableFindingModal
        finding={selectedFinding}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
