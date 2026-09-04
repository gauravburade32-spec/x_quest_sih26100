'use client';

import React from 'react';
import Link from 'next/link';
import { KpiCard } from '@/components/ui/KpiCard';
import { SectionCard } from '@/components/ui/SectionCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { useTenders } from '@/context/TenderContext';
import {
  KPI_METRICS,
  MOCK_COMPLIANCE_BREAKDOWN,
  MOCK_RISK_SUMMARY,
  MOCK_PROTOTYPE_ALERTS,
  MOCK_RECENT_ACTIVITY,
  QUICK_ACTIONS_LIST,
} from '@/data/mockData';
import {
  Info,
  ArrowUpRight,
  Sparkles,
  Clock,
  PlusCircle,
  Users,
  FileCheck,
  FilePieChart,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from 'lucide-react';

const QUICK_ICON_MAP: Record<string, React.ReactNode> = {
  PlusCircle: <PlusCircle className="w-4 h-4" />,
  Users: <Users className="w-4 h-4" />,
  FileCheck: <FileCheck className="w-4 h-4" />,
  FilePieChart: <FilePieChart className="w-4 h-4" />,
};

export default function DashboardPage() {
  const { tenders } = useTenders();

  return (
    <div className="space-y-6 pb-6">
      {/* TOP HERO HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Procurement Compliance Dashboard
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-brand-50 text-brand-800 border border-brand-200/90 rounded-full">
              Evaluation Desk
            </span>
          </div>
          <p className="text-sm text-slate-600">
            AI-assisted bid verification and evidence-based decision support for procurement officers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/tenders">
            <Button variant="primary" size="sm" icon={<PlusCircle className="w-4 h-4" />}>
              + New Tender
            </Button>
          </Link>
        </div>
      </div>

      {/* Platform Information Banner */}
      <div className="p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-lg flex items-center justify-between text-xs text-blue-900">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Decision Support Platform:</strong> BidSure AI assists evaluation officers by verifying bidder evidence against mandatory tender criteria and highlighting risk discrepancies.
          </span>
        </div>
        <span className="font-mono font-medium text-blue-700 hidden md:inline shrink-0">
          Evaluation Desk Active
        </span>
      </div>

      {/* ==========================================
          KPI OVERVIEW
         ========================================== */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Evaluation Overview
          </h2>
          <span className="text-[10px] text-slate-400 font-mono">Live Metrics</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {KPI_METRICS.map((kpi, idx) => (
            <KpiCard
              key={idx}
              title={kpi.title}
              value={idx === 0 ? tenders.length.toString() : kpi.value}
              subtitle={kpi.subtitle}
              trend={kpi.trend}
              trendType={kpi.trendType}
              icon={kpi.icon}
            />
          ))}
        </div>
      </div>

      {/* ==========================================
          QUICK ACTIONS TOOLBAR
         ========================================== */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-navy-800" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Quick Actions
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          {QUICK_ACTIONS_LIST.map((act) => (
            <Link key={act.id} href={act.route}>
              <Button
                variant={act.variant}
                size="sm"
                icon={QUICK_ICON_MAP[act.icon]}
                className="text-xs"
              >
                {act.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* ==========================================
          MAIN GRID: ACTIVE TENDERS + AI ALERTS
         ========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ACTIVE TENDERS (2 cols on desktop) */}
        <div className="lg:col-span-2">
          <SectionCard
            title="Active Procurement Tenders"
            subtitle="Tenders undergoing bid compliance and document verification"
            action={
              <Link href="/tenders">
                <Button variant="ghost" size="sm" className="text-xs text-navy-800 hover:text-navy-900 font-semibold">
                  View All Tenders <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider bg-slate-50/60">
                    <th className="pb-3 pt-2 px-3">Tender & Reference</th>
                    <th className="pb-3 pt-2 px-3">Primary Bidder</th>
                    <th className="pb-3 pt-2 px-3">Bids</th>
                    <th className="pb-3 pt-2 px-3">Est. Value</th>
                    <th className="pb-3 pt-2 px-3">Status</th>
                    <th className="pb-3 pt-2 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tenders.slice(0, 5).map((tender) => (
                    <tr
                      key={tender.id}
                      className="hover:bg-slate-50/90 transition-colors group cursor-pointer"
                    >
                      <td className="py-3 px-3">
                        <p className="font-semibold text-slate-900 group-hover:text-navy-900 transition-colors">
                          {tender.title}
                        </p>
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                          Ref: {tender.referenceNo}
                        </p>
                      </td>
                      <td className="py-3 px-3">
                        <p className="font-medium text-slate-800">{tender.primaryBidder}</p>
                        <p className="text-[10px] text-slate-400">{tender.department || tender.category}</p>
                      </td>
                      <td className="py-3 px-3 font-mono font-medium text-slate-700">
                        {tender.bidsCount}
                      </td>
                      <td className="py-3 px-3 font-mono font-medium text-slate-900">
                        {tender.estimatedValue}
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={tender.status} />
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link href="/verification">
                          <Button variant="outline" size="sm" className="text-xs py-1 px-2.5 hover:border-navy-800">
                            Review Bid
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>

        {/* AI RISK ALERTS (1 col on desktop) */}
        <div>
          <SectionCard
            title="AI Risk Alerts"
            subtitle="Automated compliance discrepancy warnings"
            action={
              <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold tracking-wide">
                High Attention
              </span>
            }
          >
            <div className="space-y-3">
              {MOCK_PROTOTYPE_ALERTS.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3.5 rounded-lg border text-xs space-y-2 transition-all hover:shadow-xs ${
                    alert.severity === 'high'
                      ? 'bg-rose-50/40 border-rose-200/90 text-rose-950'
                      : 'bg-amber-50/40 border-amber-200/90 text-amber-950'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5 leading-snug">
                      <Sparkles className="w-3.5 h-3.5 text-navy-800 shrink-0" />
                      {alert.title}
                    </span>
                    <StatusBadge
                      status={alert.severity}
                      label={alert.severity.toUpperCase()}
                      className="shrink-0"
                    />
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {alert.description}
                  </p>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span className="truncate max-w-[140px]" title={alert.bidderName}>
                      {alert.bidderName}
                    </span>
                    <span className="shrink-0">{alert.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* ==========================================
          LOWER GRID: COMPLIANCE + RISK + RECENT ACTIVITY
         ========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COMPLIANCE OVERVIEW */}
        <SectionCard
          title="Compliance Overview"
          subtitle="Verification distribution summary"
        >
          <div className="space-y-4">
            {/* Overall Summary Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                <span>Overall Compliance Breakdown</span>
                <span className="font-mono text-slate-500">37 Total Bids</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200/60">
                {MOCK_COMPLIANCE_BREAKDOWN.map((item, idx) => (
                  <div
                    key={idx}
                    className={`${item.color} h-full transition-all`}
                    style={{ width: `${item.percentage}%` }}
                    title={`${item.label}: ${item.percentage}% (${item.count} bids)`}
                  />
                ))}
              </div>
            </div>

            {/* Detailed Cards */}
            <div className="space-y-2.5">
              {MOCK_COMPLIANCE_BREAKDOWN.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50/80 border border-slate-200/70 rounded-lg flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    <span className="font-semibold text-slate-800">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-slate-500">{item.count} Bids</span>
                    <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* RISK OVERVIEW */}
        <SectionCard
          title="Risk Level Distribution"
          subtitle="Risk evaluation summary across submitted bids"
        >
          <div className="space-y-3">
            {MOCK_RISK_SUMMARY.map((risk, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50/80 border border-slate-200/70 rounded-lg text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {risk.level === 'high' && <ShieldAlert className="w-4 h-4 text-rose-600" />}
                    {risk.level === 'medium' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                    {risk.level === 'low' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    <span className="font-bold text-slate-900">{risk.label}</span>
                  </div>
                  <span className="font-mono text-sm font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                    {risk.count}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  {risk.description}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* RECENT ACTIVITY */}
        <SectionCard
          title="Recent System Activity"
          subtitle="Audit log & system timeline"
        >
          <div className="space-y-3">
            {MOCK_RECENT_ACTIVITY.map((act) => (
              <div
                key={act.id}
                className="flex gap-3 text-xs items-start p-2.5 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200/60"
              >
                <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5 text-navy-800 shadow-2xs">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <p className="font-semibold text-slate-900">{act.action}</p>
                  <p className="text-[11px] text-slate-600 leading-snug truncate" title={act.target}>
                    {act.target}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5 font-mono">
                    <span>{act.user}</span>
                    <span>{act.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
