import React from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';
import { useLandingTheme } from './LandingThemeContext';

export const PublicFooter: React.FC = () => {
  const { theme } = useLandingTheme();
  const isDark = theme === 'dark';

  return (
    <footer id="contact" className={`text-xs py-16 border-t transition-colors duration-300 ${isDark ? 'bg-slate-950 border-slate-800/80 text-slate-400' : 'bg-white border-slate-200/80 text-slate-600'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold ${isDark ? 'bg-blue-600 shadow-md shadow-blue-500/20' : 'bg-blue-600 shadow-xs'}`}>
                <Shield className="w-5 h-5" />
              </div>
              <span className={`text-xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                BidSure<span className={isDark ? 'text-blue-400' : 'text-blue-600'}>AI</span>
              </span>
            </Link>

            <p className={`text-xs leading-relaxed max-w-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              AI-powered procurement evaluation, bid verification, compliance analysis, risk assessment, and decision support platform for government procurement teams.
            </p>

            <div className="pt-2 flex items-center gap-3 text-[11px] text-slate-500 font-mono">
              <span className={`inline-block w-2 h-2 rounded-full animate-pulse ${isDark ? 'bg-emerald-400' : 'bg-emerald-600'}`} />
              <span>System Operational • Verified Procurement Stack</span>
            </div>
          </div>

          {/* Links Col 1 */}
          <div className="space-y-3">
            <span className={`text-xs font-bold uppercase tracking-wider block ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Platform Modules
            </span>
            <ul className={`space-y-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <li>
                <Link href="/dashboard" className={isDark ? 'hover:text-blue-400 transition-colors' : 'hover:text-blue-600 transition-colors'}>
                  Executive Dashboard
                </Link>
              </li>
              <li>
                <Link href="/tenders" className={isDark ? 'hover:text-blue-400 transition-colors' : 'hover:text-blue-600 transition-colors'}>
                  Tenders & Documents
                </Link>
              </li>
              <li>
                <Link href="/bidders" className={isDark ? 'hover:text-blue-400 transition-colors' : 'hover:text-blue-600 transition-colors'}>
                  Bidder Submissions
                </Link>
              </li>
              <li>
                <Link href="/compliance" className={isDark ? 'hover:text-blue-400 transition-colors' : 'hover:text-blue-600 transition-colors'}>
                  Compliance Rules
                </Link>
              </li>
              <li>
                <Link href="/reports" className={isDark ? 'hover:text-blue-400 transition-colors' : 'hover:text-blue-600 transition-colors'}>
                  Executive Reports
                </Link>
              </li>
              <li>
                <Link href="/audit" className={isDark ? 'hover:text-blue-400 transition-colors' : 'hover:text-blue-600 transition-colors'}>
                  Audit Logs
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div className="space-y-3">
            <span className={`text-xs font-bold uppercase tracking-wider block ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Navigation
            </span>
            <ul className={`space-y-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <li>
                <a href="#hero" className={isDark ? 'hover:text-blue-400 transition-colors' : 'hover:text-blue-600 transition-colors'}>
                  Home Overview
                </a>
              </li>
              <li>
                <a href="#features" className={isDark ? 'hover:text-blue-400 transition-colors' : 'hover:text-blue-600 transition-colors'}>
                  Core Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className={isDark ? 'hover:text-blue-400 transition-colors' : 'hover:text-blue-600 transition-colors'}>
                  8-Step Workflow
                </a>
              </li>
              <li>
                <a href="#about" className={isDark ? 'hover:text-blue-400 transition-colors' : 'hover:text-blue-600 transition-colors'}>
                  Why BidSure AI
                </a>
              </li>
              <li>
                <Link href="/settings" className={isDark ? 'hover:text-blue-400 transition-colors' : 'hover:text-blue-600 transition-colors'}>
                  System Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Governance & Contact */}
          <div className="space-y-3">
            <span className={`text-xs font-bold uppercase tracking-wider block ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Governance & Support
            </span>
            <div className={`space-y-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <p>Government Evaluation Support</p>
              <p className={`font-mono ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>support@bidsure.ai</p>
              <p className="text-[11px] text-slate-500">
                Department of Procurement Intelligence & Verification
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className={`pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] ${isDark ? 'border-slate-900 text-slate-400' : 'border-slate-200/80 text-slate-500'}`}>
          <p>© 2026 BidSure AI. Enterprise Procurement Decision Support System.</p>
          <div className="flex items-center gap-6">
            <span className={isDark ? 'hover:text-slate-300 transition-colors cursor-pointer' : 'hover:text-slate-900 transition-colors cursor-pointer'}>Privacy Policy</span>
            <span className={isDark ? 'hover:text-slate-300 transition-colors cursor-pointer' : 'hover:text-slate-900 transition-colors cursor-pointer'}>Terms of Service</span>
            <span className={isDark ? 'hover:text-slate-300 transition-colors cursor-pointer' : 'hover:text-slate-900 transition-colors cursor-pointer'}>GeM Guidelines Compliance</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
