import React from 'react';
import { TenderRequirement } from '@/data/mockData';
import { Layers, AlertCircle, CheckCircle2, Cpu, FileText } from 'lucide-react';

interface RequirementSummaryCardsProps {
  requirements: TenderRequirement[];
}

export const RequirementSummaryCards: React.FC<RequirementSummaryCardsProps> = ({
  requirements,
}) => {
  const totalCount = requirements.length;
  const mandatoryCount = requirements.filter((r) => r.isMandatory).length;
  const optionalCount = totalCount - mandatoryCount;
  const technicalCount = requirements.filter((r) => r.category === 'Technical').length;
  const documentsCount = requirements.filter(
    (r) => r.category === 'Mandatory Documents' || r.category === 'Eligibility'
  ).length;

  const metrics = [
    {
      title: 'Total Requirements',
      value: totalCount,
      subtitle: 'Structured clauses extracted',
      icon: Layers,
      color: 'text-navy-800 bg-navy-50 border-navy-100',
    },
    {
      title: 'Mandatory',
      value: mandatoryCount,
      subtitle: 'Non-negotiable criteria',
      icon: AlertCircle,
      color: 'text-rose-700 bg-rose-50 border-rose-100',
    },
    {
      title: 'Optional',
      value: optionalCount,
      subtitle: 'Desirable / Points scoring',
      icon: CheckCircle2,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-100',
    },
    {
      title: 'Technical',
      value: technicalCount,
      subtitle: 'Hardware & Spec clauses',
      icon: Cpu,
      color: 'text-indigo-700 bg-indigo-50 border-indigo-100',
    },
    {
      title: 'Documents Required',
      value: documentsCount,
      subtitle: 'Certificates & Undertakings',
      icon: FileText,
      color: 'text-amber-700 bg-amber-50 border-amber-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      {metrics.map((metric, idx) => {
        const Icon = metric.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {metric.title}
              </span>
              <div className={`p-1.5 rounded-lg border ${metric.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-2 text-2xl font-bold font-mono text-slate-950">
              {metric.value}
            </div>

            <p className="text-[11px] text-slate-500 mt-1 truncate">{metric.subtitle}</p>
          </div>
        );
      })}
    </div>
  );
};
