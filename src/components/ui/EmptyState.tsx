import React from 'react';
import { Clock, ShieldAlert } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  moduleName?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description = "No records found matching the specified criteria.",
  moduleName,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-slate-200 shadow-sm my-4">
      <div className="w-14 h-14 rounded-full bg-navy-50 text-navy-800 border border-navy-100 flex items-center justify-center mb-4 shadow-inner">
        <Clock className="w-7 h-7 text-navy-800" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 tracking-tight">
        {title || (moduleName ? `${moduleName}` : "No Data Available")}
      </h2>
      <p className="mt-2 text-sm text-slate-500 max-w-md">
        {description}
      </p>
      
      <div className="mt-6 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2 text-xs text-slate-600">
        <ShieldAlert className="w-4 h-4 text-navy-700 shrink-0" />
        <span>BidSure AI • Procurement Decision Support</span>
      </div>
    </div>
  );
};
