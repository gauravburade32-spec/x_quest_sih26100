import React from 'react';

export type StatusType = 
  | 'compliant' 
  | 'needs_review' 
  | 'non_compliant' 
  | 'critical' 
  | 'active' 
  | 'under_review' 
  | 'pending'
  | 'high'
  | 'medium'
  | 'low'
  | 'draft'
  | 'uploaded'
  | 'processing'
  | 'ready_for_review'
  | 'ready_for_analysis'
  | 'not_yet_verified'
  | 'ready_for_verification'
  | 'documents_pending'
  | 'uploaded_ready_for_verification'
  | 'not_uploaded'
  | 'mapped'
  | 'partially_mapped'
  | 'missing_evidence'
  | 'not_yet_mapped'
  | 'consistent'
  | 'inconsistent'
  | 'not_available';

interface StatusBadgeProps {
  status: StatusType | string;
  label?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, className = '' }) => {
  const normalizedStatus = status.toLowerCase().replace(/ /g, '_').replace(/—/g, '').replace(/__/g, '_');

  let badgeStyles = 'bg-slate-100 text-slate-800 border-slate-200';
  let dotColor = 'bg-slate-400';
  let defaultLabel = label || status;

  switch (normalizedStatus) {
    case 'compliant':
    case 'success':
    case 'passed':
    case 'low':
    case 'mapped':
    case 'complete':
    case 'consistent':
      badgeStyles = 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
      dotColor = 'bg-emerald-500';
      break;
    case 'needs_review':
    case 'warning':
    case 'moderate':
    case 'medium':
    case 'ready_for_review':
    case 'documents_pending':
    case 'pending_evidence':
    case 'partially_mapped':
    case 'partial':
      badgeStyles = 'bg-amber-50 text-amber-800 border-amber-200/80';
      dotColor = 'bg-amber-500';
      break;
    case 'non_compliant':
    case 'critical':
    case 'danger':
    case 'high':
    case 'missing_evidence':
    case 'missing':
    case 'inconsistent':
      badgeStyles = 'bg-rose-50 text-rose-800 border-rose-200/80';
      dotColor = 'bg-rose-500';
      break;
    case 'active':
    case 'uploaded':
    case 'ready_for_analysis':
    case 'ready_for_verification':
    case 'uploaded_ready_for_verification':
      badgeStyles = 'bg-blue-50 text-blue-800 border-blue-200/80';
      dotColor = 'bg-blue-500';
      break;
    case 'under_review':
    case 'processing':
      badgeStyles = 'bg-indigo-50 text-indigo-800 border-indigo-200/80';
      dotColor = 'bg-indigo-500';
      break;
    case 'not_uploaded':
    case 'not_yet_verified':
    case 'not_yet_mapped':
    case 'not_available':
    case 'draft':
      badgeStyles = 'bg-slate-100 text-slate-700 border-slate-200';
      dotColor = 'bg-slate-400';
      break;
    default:
      badgeStyles = 'bg-slate-100 text-slate-700 border-slate-200';
      dotColor = 'bg-slate-400';
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors ${badgeStyles} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {defaultLabel}
    </span>
  );
};
