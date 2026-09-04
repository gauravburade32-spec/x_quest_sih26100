'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  FileText,
  ListChecks,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  FilePieChart,
  History,
  Settings,
  UserCheck,
  Shield,
  X,
  Globe,
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Public Home', path: '/', icon: Globe },
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Tenders', path: '/tenders', icon: FolderKanban },
  { name: 'Bidders', path: '/bidders', icon: Users },
  { name: 'Documents', path: '/documents', icon: FileText },
  { name: 'Requirements', path: '/requirements', icon: ListChecks },
  { name: 'Verification', path: '/verification', icon: CheckCircle2 },
  { name: 'Compliance & Risk', path: '/compliance', icon: ShieldCheck },
  { name: 'Recommendations', path: '/recommendations', icon: Sparkles },
  { name: 'Reports', path: '/reports', icon: FilePieChart },
  { name: 'Audit Trail', path: '/audit', icon: History },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden transition-opacity duration-200"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`w-64 fixed left-0 top-0 bottom-0 bg-navy-950 text-slate-300 flex flex-col border-r border-navy-900 shadow-xl z-50 transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-navy-900/80 bg-navy-950 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md font-bold text-xl shrink-0 group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-wide">
                  BidSure <span className="text-brand-400 font-extrabold">AI</span>
                </h1>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Smart Evaluation Platform
                </span>
              </div>
            </div>
          </Link>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white hover:bg-navy-900 rounded-lg md:hidden transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Navigation
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm font-semibold'
                    : 'text-slate-300 hover:bg-navy-900 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Footer Section */}
        <div className="p-3 border-t border-navy-900/80 space-y-3 bg-navy-950">
          <Link
            href="/settings"
            onClick={onClose}
            className={`flex items-center gap-3 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              pathname === '/settings'
                ? 'bg-brand-600 text-white shadow-sm font-semibold'
                : 'text-slate-300 hover:bg-navy-900 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Settings</span>
          </Link>

          {/* User Profile Badge */}
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-navy-900/90 border border-navy-800">
            <div className="w-8 h-8 rounded-full bg-navy-800 border border-brand-500/40 flex items-center justify-center text-brand-300 shrink-0">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">
                Procurement Officer
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                Evaluation Desk
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
