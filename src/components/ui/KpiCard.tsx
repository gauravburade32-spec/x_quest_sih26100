import React from 'react';
import { FileText, FileSearch, AlertTriangle, ShieldAlert, LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  FileText,
  FileSearch,
  AlertTriangle,
  ShieldAlert,
};

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  trendType?: 'positive' | 'warning' | 'danger' | 'neutral';
  icon?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendType = 'neutral',
  icon,
}) => {
  const IconComponent = icon ? iconMap[icon] : null;

  let trendColor = 'text-slate-500';
  if (trendType === 'warning') trendColor = 'text-amber-600 font-medium';
  if (trendType === 'danger') trendColor = 'text-rose-600 font-medium';
  if (trendType === 'positive') trendColor = 'text-emerald-600 font-medium';

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        {IconComponent && (
          <div className="p-2 rounded-lg bg-navy-50 text-navy-800 border border-navy-100">
            <IconComponent className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-navy-950 font-mono">
          {value}
        </span>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {subtitle && <span className="text-slate-500">{subtitle}</span>}
          {trend && <span className={trendColor}>{trend}</span>}
        </div>
      )}
    </div>
  );
};
