'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  User,
  X,
  Menu,
  FolderKanban,
  Users,
  FileText,
  ListChecks,
  CheckCircle2,
  AlertTriangle,
  History,
  Check,
} from 'lucide-react';
import { useTenders } from '@/context/TenderContext';
import {
  MOCK_BIDDERS_LIST,
  MOCK_BIDDER_DOCUMENTS,
  MOCK_REQUIREMENTS,
  MOCK_PROTOTYPE_ALERTS,
} from '@/data/mockData';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/tenders': 'Tenders Management',
  '/bidders': 'Bidders Directory',
  '/documents': 'Document Repository',
  '/requirements': 'Requirement Matrix',
  '/verification': 'Bid Verification',
  '/compliance': 'Compliance & Risk Analysis',
  '/recommendations': 'AI Recommendations',
  '/reports': 'Executive Reports',
  '/audit': 'Audit Trail & Logs',
  '/settings': 'Platform Settings',
};

interface SearchResultItem {
  id: string;
  category: 'Tender' | 'Bidder' | 'Requirement' | 'Document';
  title: string;
  subtitle: string;
  route: string;
}

interface HeaderProps {
  onOpenMobileNav?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileNav }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { tenders } = useTenders();

  const title = PAGE_TITLES[pathname] || 'Procurement Portal';

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Notification State
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(MOCK_PROTOTYPE_ALERTS.length + 1);
  const [notifications, setNotifications] = useState([
    {
      id: 'n-1',
      title: 'High Risk Finding Alert',
      desc: 'ABC Technologies: Past Experience Certificate Value Variance',
      type: 'risk',
      time: '10m ago',
      read: false,
      route: '/compliance',
    },
    {
      id: 'n-2',
      title: 'Officer Decision Required',
      desc: 'Pending recommendation review for GEM/2026/B/492104',
      type: 'decision',
      time: '25m ago',
      read: false,
      route: '/recommendations',
    },
    {
      id: 'n-3',
      title: 'Audit Event Logged',
      desc: 'Officer Decision updated for CipherSec Systems India',
      type: 'audit',
      time: '1h ago',
      read: false,
      route: '/audit',
    },
    {
      id: 'n-4',
      title: 'Document Verified',
      desc: 'OEM Authorization certificate passed format verification',
      type: 'info',
      time: '2h ago',
      read: true,
      route: '/documents',
    },
  ]);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute Search Results
  const getSearchResults = (): SearchResultItem[] => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const results: SearchResultItem[] = [];

    // Tenders
    tenders.forEach((t) => {
      if (
        t.title.toLowerCase().includes(q) ||
        t.referenceNo.toLowerCase().includes(q) ||
        t.primaryBidder.toLowerCase().includes(q)
      ) {
        results.push({
          id: t.id,
          category: 'Tender',
          title: t.title,
          subtitle: `Ref: ${t.referenceNo} • ${t.primaryBidder}`,
          route: '/tenders',
        });
      }
    });

    // Bidders
    MOCK_BIDDERS_LIST.forEach((b) => {
      if (
        b.name.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q) ||
        b.contactEmail.toLowerCase().includes(q)
      ) {
        results.push({
          id: b.id,
          category: 'Bidder',
          title: b.name,
          subtitle: `ID: ${b.id} • ${b.tenderRef}`,
          route: '/bidders',
        });
      }
    });

    // Requirements
    MOCK_REQUIREMENTS.forEach((r) => {
      if (
        r.id.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
      ) {
        results.push({
          id: r.id,
          category: 'Requirement',
          title: `${r.id}: ${r.title}`,
          subtitle: `Category: ${r.category} • Mandatory`,
          route: '/requirements',
        });
      }
    });

    // Documents
    MOCK_BIDDER_DOCUMENTS.forEach((d) => {
      if (
        d.documentTitle.toLowerCase().includes(q) ||
        d.fileName.toLowerCase().includes(q) ||
        d.bidderId.toLowerCase().includes(q)
      ) {
        results.push({
          id: d.id,
          category: 'Document',
          title: d.documentTitle,
          subtitle: `${d.fileName} • ${d.bidderId}`,
          route: '/documents',
        });
      }
    });

    return results.slice(0, 8);
  };

  const searchResults = getSearchResults();

  const handleSelectResult = (route: string) => {
    setIsSearchOpen(false);
    setIsMobileSearchActive(false);
    setSearchQuery('');
    router.push(route);
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/90 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Mobile Drawer Trigger & Current Page Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={onOpenMobileNav}
          className="p-2 -ml-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 md:hidden transition-colors shrink-0"
          aria-label="Open Mobile Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-base sm:text-xl font-bold text-slate-900 tracking-tight truncate">
            {title}
          </h1>
        </div>
      </div>

      {/* Right Action Icons & User Profile */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Mobile Search Toggle Icon */}
        <button
          onClick={() => setIsMobileSearchActive((prev) => !prev)}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg sm:hidden transition-colors"
          aria-label="Toggle Mobile Search"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Global Search Input & Dropdown (Desktop & Expanded Mobile) */}
        <div
          className={`relative w-full max-w-[200px] sm:w-72 ${
            isMobileSearchActive
              ? 'absolute inset-x-2 top-2 z-40 bg-white p-2 rounded-xl border border-slate-200 shadow-xl sm:static sm:p-0 sm:border-none sm:shadow-none'
              : 'hidden sm:block'
          }`}
          ref={searchRef}
        >
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search tenders, bidders..."
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
            />
            {isMobileSearchActive ? (
              <button
                onClick={() => {
                  setIsMobileSearchActive(false);
                  setSearchQuery('');
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 sm:hidden"
              >
                <X className="w-4 h-4" />
              </button>
            ) : searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : null}
          </div>

          {/* Search Dropdown */}
          {isSearchOpen && searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden z-50 animate-in fade-in duration-150 max-w-[calc(100vw-2rem)]">
              <div className="p-2 border-b border-slate-100 bg-slate-50 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-semibold">Search Results ({searchResults.length})</span>
                <span className="font-mono text-[10px] hidden sm:inline">Press Esc to close</span>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {searchResults.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500">
                    No results found for &quot;<span className="font-semibold text-slate-700">{searchQuery}</span>&quot;
                  </div>
                ) : (
                  searchResults.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectResult(item.route)}
                      className="w-full text-left p-3 hover:bg-slate-50 transition-colors flex items-start gap-2.5"
                    >
                      <div className="mt-0.5 shrink-0">
                        {item.category === 'Tender' && <FolderKanban className="w-4 h-4 text-navy-800" />}
                        {item.category === 'Bidder' && <Users className="w-4 h-4 text-brand-600" />}
                        {item.category === 'Requirement' && <ListChecks className="w-4 h-4 text-amber-600" />}
                        {item.category === 'Document' && <FileText className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-bold text-slate-900 truncate">{item.title}</p>
                          <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono shrink-0">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{item.subtitle}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen((prev) => !prev)}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors relative"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Popover Panel */}
          {isNotifOpen && (
            <div className="absolute right-[-60px] sm:right-0 mt-2 w-[300px] sm:w-80 bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden z-50 animate-in fade-in duration-150">
              <div className="p-3 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-navy-800" />
                  <span className="text-xs font-bold text-slate-900">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Mark read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 text-xs">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      setIsNotifOpen(false);
                      router.push(n.route);
                    }}
                    className={`p-3 cursor-pointer transition-colors flex items-start gap-2.5 ${
                      n.read ? 'bg-white hover:bg-slate-50' : 'bg-blue-50/40 hover:bg-blue-50/70'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {n.type === 'risk' && <AlertTriangle className="w-4 h-4 text-rose-600" />}
                      {n.type === 'decision' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                      {n.type === 'audit' && <History className="w-4 h-4 text-navy-800" />}
                      {n.type === 'info' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className="font-bold text-slate-900 text-xs truncate">{n.title}</p>
                        <span className="text-[9px] text-slate-400 font-mono shrink-0">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                        {n.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                <button
                  onClick={() => {
                    setIsNotifOpen(false);
                    router.push('/audit');
                  }}
                  className="text-xs font-semibold text-navy-800 hover:text-navy-950 transition-colors"
                >
                  View Full Audit Log & Notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2 pl-1 border-l border-slate-200/80">
          <div className="w-8 h-8 rounded-full bg-navy-800 text-brand-300 flex items-center justify-center font-bold text-xs shadow-xs border border-brand-400/30">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden lg:block text-left">
            <span className="text-xs font-bold text-slate-900 block leading-tight">
              Officer Desk
            </span>
            <span className="text-[10px] text-slate-500 block leading-tight font-mono">
              Senior Evaluator
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
