'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BidSureAssistant } from '../chatbot/BidSureAssistant';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const pathname = usePathname();

  // On public Landing Page ('/'), render full-bleed without app sidebar
  if (pathname === '/') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row overflow-x-hidden relative">
      {/* Sidebar Component (Desktop & Mobile Drawer) */}
      <Sidebar
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-64 w-full">
        <Header onOpenMobileNav={() => setIsMobileNavOpen(true)} />
        <main className="flex-1 p-3 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Global Professional Footer Disclaimer */}
        <footer className="py-3 px-4 sm:px-8 bg-white border-t border-slate-200/80 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 font-sans">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="font-bold text-slate-800">BidSure AI</span>
            <span>• Enterprise Procurement Decision Support Platform</span>
          </div>
          <div className="text-[10px] text-slate-400 text-center sm:text-right">
            Automated verification records are decision-support evaluation assets.
          </div>
        </footer>
      </div>

      {/* Floating Chatbot Assistant */}
      <BidSureAssistant />
    </div>
  );
};
