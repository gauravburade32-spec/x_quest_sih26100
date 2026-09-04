import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Menu, X, ArrowRight, UserCheck, Sun, Moon } from 'lucide-react';
import { useLandingTheme } from './LandingThemeContext';

interface NavbarProps {
  onOpenLogin: () => void;
  onOpenGetStarted: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLogin, onOpenGetStarted }) => {
  const { theme, toggleTheme } = useLandingTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#hero', sectionId: 'hero' },
    { name: 'Features', href: '#features', sectionId: 'features' },
    { name: 'How It Works', href: '#how-it-works', sectionId: 'how-it-works' },
    { name: 'Dashboard', href: '/dashboard', isRoute: true },
    { name: 'About Us', href: '#about', sectionId: 'about' },
    { name: 'Contact', href: '#contact', sectionId: 'contact' },
  ];

  const isDark = theme === 'dark';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? isDark
            ? 'bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 shadow-2xl py-3.5'
            : 'bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs py-3.5'
          : isDark
          ? 'bg-transparent py-5'
          : 'bg-slate-50/80 backdrop-blur-xs py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-transform group-hover:scale-105 ${
              isDark
                ? 'bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25'
                : 'bg-blue-600 text-white shadow-xs'
            }`}
          >
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <span
              className={`text-xl font-extrabold tracking-tight flex items-center gap-1 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              BidSure<span className={isDark ? 'text-blue-400' : 'text-blue-600'}>AI</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className={`hidden md:flex items-center gap-1 px-4 py-1.5 rounded-full backdrop-blur-md text-xs font-medium ${
            isDark
              ? 'bg-slate-900/60 border border-slate-800/80 shadow-inner'
              : 'bg-white/90 border border-slate-200/90 shadow-2xs'
          }`}
        >
          {navLinks.map((link) => {
            if (link.isRoute) {
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-1.5 rounded-full transition-all ${
                    isDark
                      ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  {link.name}
                </Link>
              );
            }
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setActiveSection(link.sectionId || 'hero')}
                className={`px-4 py-1.5 rounded-full transition-all ${
                  activeSection === link.sectionId
                    ? isDark
                      ? 'text-white bg-blue-600/20 border border-blue-500/30 font-semibold'
                      : 'text-blue-700 bg-blue-50 border border-blue-200/80 font-semibold'
                    : isDark
                    ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Landing Page Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`p-2 rounded-xl transition-all flex items-center justify-center border ${
              isDark
                ? 'bg-slate-900/80 border-slate-800 text-amber-300 hover:bg-slate-800 hover:border-slate-700 shadow-sm'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-xs'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          <button
            onClick={onOpenLogin}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 border ${
              isDark
                ? 'text-slate-300 hover:text-white border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-800'
                : 'text-slate-700 hover:text-slate-900 border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 shadow-xs'
            }`}
          >
            <UserCheck className={`w-3.5 h-3.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <span>Login</span>
          </button>

          <button
            onClick={onOpenGetStarted}
            className={`px-5 py-2 text-xs font-bold text-white rounded-xl transition-all flex items-center gap-2 group ${
              isDark
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40'
                : 'bg-blue-600 hover:bg-blue-700 shadow-xs hover:shadow-sm'
            }`}
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Mobile Hamburger & Theme Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`p-2 rounded-xl transition-all border ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-amber-300'
                : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 border rounded-xl ${
              isDark
                ? 'text-slate-300 hover:text-white bg-slate-900 border-slate-800'
                : 'text-slate-700 hover:text-slate-900 bg-white border-slate-200 shadow-xs'
            }`}
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div
          className={`md:hidden fixed inset-x-0 top-[70px] border-b p-6 space-y-4 shadow-2xl animate-in slide-in-from-top-4 duration-200 ${
            isDark
              ? 'bg-slate-950/95 border-slate-800 backdrop-blur-xl text-slate-200'
              : 'bg-white border-slate-200 backdrop-blur-xl text-slate-700'
          }`}
        >
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              if (link.isRoute) {
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-3 text-sm font-semibold rounded-xl border transition-colors ${
                      isDark
                        ? 'text-slate-200 hover:bg-slate-900 border-transparent hover:border-slate-800'
                        : 'text-slate-700 hover:bg-slate-50 border-transparent hover:border-slate-200'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              }
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 text-sm font-semibold rounded-xl border transition-colors ${
                    isDark
                      ? 'text-slate-200 hover:bg-slate-900 border-transparent hover:border-slate-800'
                      : 'text-slate-700 hover:bg-slate-50 border-transparent hover:border-slate-200'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </div>

          <div className={`pt-4 border-t flex flex-col gap-3 ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenLogin();
              }}
              className={`w-full py-3 text-xs font-semibold rounded-xl text-center border ${
                isDark
                  ? 'text-slate-200 bg-slate-900 border-slate-800'
                  : 'text-slate-700 bg-white border-slate-200 shadow-xs'
              }`}
            >
              Login to Officer Portal
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenGetStarted();
              }}
              className={`w-full py-3 text-xs font-bold text-white rounded-xl text-center ${
                isDark
                  ? 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-xs'
              }`}
            >
              Get Started with BidSure AI
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
