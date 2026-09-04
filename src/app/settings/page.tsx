'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { SectionCard } from '@/components/ui/SectionCard';
import {
  Sliders,
  Building2,
  Bell,
  ShieldCheck,
  CheckCircle2,
  Save,
  RotateCcw,
  Zap,
  Lock,
  Cpu,
  Mail,
  User,
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'evaluation' | 'profile' | 'notifications' | 'system'>('evaluation');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Settings Form State
  const [evaluationMode, setEvaluationMode] = useState('standard');
  const [passThreshold, setPassThreshold] = useState(80);
  const [autoAuditLogging, setAutoAuditLogging] = useState(true);
  const [riskSensitivity, setRiskSensitivity] = useState('high');
  const [autoExecuteRules, setAutoExecuteRules] = useState(true);

  // Profile State
  const [deptName, setDeptName] = useState('Ministry of Infrastructure & Public Works');
  const [deskId, setDeskId] = useState('GEM-DESK-4091');
  const [officerName, setOfficerName] = useState('Senior Procurement Officer');
  const [officerEmail, setOfficerEmail] = useState('evaluation.desk@procurement.gov.in');

  // Notification State
  const [notifyHighRisk, setNotifyHighRisk] = useState(true);
  const [notifyDecisionRequired, setNotifyDecisionRequired] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  const handleReset = () => {
    setEvaluationMode('standard');
    setPassThreshold(80);
    setAutoAuditLogging(true);
    setRiskSensitivity('high');
    setAutoExecuteRules(true);
    setNotifyHighRisk(true);
    setNotifyDecisionRequired(true);
    setDailyDigest(false);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sliders className="w-5 h-5 text-brand-600" />
            Platform & Evaluation Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure BidSure AI evaluation thresholds, officer department details, alert preferences, and engine parameters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleReset} icon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset Defaults
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave} icon={<Save className="w-3.5 h-3.5" />}>
            Save Preferences
          </Button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Settings Saved Successfully!</strong> Platform configuration updated across active evaluation modules.
            </span>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setActiveTab('evaluation')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'evaluation'
              ? 'border-brand-600 text-brand-600 bg-white shadow-2xs rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 rounded-t-lg'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Evaluation & Rules
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'profile'
              ? 'border-brand-600 text-brand-600 bg-white shadow-2xs rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 rounded-t-lg'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Department Profile
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'notifications'
              ? 'border-brand-600 text-brand-600 bg-white shadow-2xs rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 rounded-t-lg'
          }`}
        >
          <Bell className="w-4 h-4" />
          Alert Preferences
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'system'
              ? 'border-brand-600 text-brand-600 bg-white shadow-2xs rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 rounded-t-lg'
          }`}
        >
          <Cpu className="w-4 h-4" />
          System Status
        </button>
      </div>

      {/* Tab 1: Evaluation & Rules */}
      {activeTab === 'evaluation' && (
        <div className="space-y-6">
          <SectionCard title="AI Evaluation Engine Parameters" subtitle="Adjust compliance scoring and decision threshold behavior">
            <form onSubmit={handleSave} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Evaluation Strictness */}
                <div className="space-y-2">
                  <label className="font-bold text-slate-800 block">Evaluation Mode Strictness</label>
                  <select
                    value={evaluationMode}
                    onChange={(e) => setEvaluationMode(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  >
                    <option value="strict">Strict (Zero tolerance for document ambiguity)</option>
                    <option value="standard">Standard (Recommended government evaluation protocol)</option>
                    <option value="relaxed">Permissive (Highlight discrepancies for manual review only)</option>
                  </select>
                  <p className="text-[11px] text-slate-500">
                    Controls automated flag sensitivity during compliance rule checks.
                  </p>
                </div>

                {/* Minimum Passing Score */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800">Minimum Technical Compliance Threshold</label>
                    <span className="font-mono font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                      {passThreshold}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    step="5"
                    value={passThreshold}
                    onChange={(e) => setPassThreshold(Number(e.target.value))}
                    className="w-full accent-brand-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>50% (Low)</span>
                    <span>80% (Standard)</span>
                    <span>100% (Strict)</span>
                  </div>
                </div>
              </div>

              <hr className="border-slate-200" />

              {/* Toggles */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div>
                    <p className="font-bold text-slate-800">Automatic Audit Trail Event Logging</p>
                    <p className="text-[11px] text-slate-500">
                      Log every officer verification step, decision override, and document inspection to immutable audit trail.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoAuditLogging}
                    onChange={(e) => setAutoAuditLogging(e.target.checked)}
                    className="w-4 h-4 accent-brand-600 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div>
                    <p className="font-bold text-slate-800">Auto-Execute Compliance Rules on Document Ingestion</p>
                    <p className="text-[11px] text-slate-500">
                      Automatically run eligibility rules and cross-document checks immediately after upload.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoExecuteRules}
                    onChange={(e) => setAutoExecuteRules(e.target.checked)}
                    className="w-4 h-4 accent-brand-600 cursor-pointer"
                  />
                </div>
              </div>
            </form>
          </SectionCard>
        </div>
      )}

      {/* Tab 2: Profile */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <SectionCard title="Procurement Department & Desk Profile" subtitle="Officer details attached to generated audit trails & decision reports">
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Procuring Organization / Ministry</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={deptName}
                      onChange={(e) => setDeptName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Evaluation Desk Identifier</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={deskId}
                      onChange={(e) => setDeskId(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Evaluation Officer Designation</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={officerName}
                      onChange={(e) => setOfficerName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Official Contact Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={officerEmail}
                      onChange={(e) => setOfficerEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button variant="primary" size="sm" type="submit" icon={<Save className="w-3.5 h-3.5" />}>
                  Save Profile Info
                </Button>
              </div>
            </form>
          </SectionCard>
        </div>
      )}

      {/* Tab 3: Notifications */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <SectionCard title="Notification & Warning Preferences" subtitle="Manage when AI alerts and officer review reminders trigger">
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <div>
                  <p className="font-bold text-slate-800">Instant Alert for High Risk Discrepancies</p>
                  <p className="text-[11px] text-slate-500">
                    Notify immediately in top header when certificate values or turnover criteria fall below thresholds.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyHighRisk}
                  onChange={(e) => setNotifyHighRisk(e.target.checked)}
                  className="w-4 h-4 accent-brand-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <div>
                  <p className="font-bold text-slate-800">Pending Officer Decision Reminders</p>
                  <p className="text-[11px] text-slate-500">
                    Alert when tender bids are waiting for human decision sign-off.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyDecisionRequired}
                  onChange={(e) => setNotifyDecisionRequired(e.target.checked)}
                  className="w-4 h-4 accent-brand-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <div>
                  <p className="font-bold text-slate-800">Daily Executive Evaluation Summary</p>
                  <p className="text-[11px] text-slate-500">
                    Receive daily breakdown of overall bid compliance scores and tender progress.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={dailyDigest}
                  onChange={(e) => setDailyDigest(e.target.checked)}
                  className="w-4 h-4 accent-brand-600 cursor-pointer"
                />
              </div>
            </div>
          </SectionCard>
        </div>
      )}

      {/* Tab 4: System Status */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          <SectionCard title="BidSure AI System & Engine Health" subtitle="Operational diagnostic info for active evaluation infrastructure">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Platform Version</span>
                <span className="font-bold text-slate-900 text-sm block">BidSure AI v1.0.4</span>
                <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-sans">
                  <CheckCircle2 className="w-3 h-3" /> Enterprise Release
                </span>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">AI Rules Engine</span>
                <span className="font-bold text-navy-900 text-sm block">Ruleset v2.4</span>
                <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-sans">
                  <Zap className="w-3 h-3" /> Active & Operational
                </span>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Audit Trail Cryptography</span>
                <span className="font-bold text-slate-900 text-sm block">SHA-256 Verified</span>
                <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-sans">
                  <ShieldCheck className="w-3 h-3" /> Immutable Seal
                </span>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Database Sync</span>
                <span className="font-bold text-slate-900 text-sm block">0.4ms Latency</span>
                <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-sans">
                  <CheckCircle2 className="w-3 h-3" /> Real-time Context
                </span>
              </div>
            </div>
          </SectionCard>
        </div>
      )}
    </div>
  );
}
