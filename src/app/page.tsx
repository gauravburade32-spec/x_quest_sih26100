'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { TrustSection } from '@/components/landing/TrustSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { WorkflowSection } from '@/components/landing/WorkflowSection';
import { WhyBidsureSection } from '@/components/landing/WhyBidsureSection';
import { CtaBanner } from '@/components/landing/CtaBanner';
import { PublicFooter } from '@/components/landing/PublicFooter';
import { AuthModal } from '@/components/landing/AuthModal';
import { FeatureDetailModal, FeatureItem } from '@/components/landing/FeatureDetailModal';

import { LandingThemeProvider, useLandingTheme } from '@/components/landing/LandingThemeContext';

function LandingPageContent() {
  const { theme } = useLandingTheme();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [selectedFeature, setSelectedFeature] = useState<FeatureItem | null>(null);
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);

  const handleOpenLogin = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const handleOpenGetStarted = () => {
    setAuthMode('signup');
    setIsAuthModalOpen(true);
  };

  const handleSelectFeature = (feature: FeatureItem) => {
    setSelectedFeature(feature);
    setIsFeatureModalOpen(true);
  };

  return (
    <div
      className={`min-h-screen font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden transition-colors duration-300 ${
        theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'
      }`}
    >
      {/* Navbar */}
      <Navbar
        onOpenLogin={handleOpenLogin}
        onOpenGetStarted={handleOpenGetStarted}
      />

      {/* Hero Section with 3D Visual & Floating Cards */}
      <HeroSection onExploreDashboard={handleOpenLogin} />

      {/* Trust & Credibility Section */}
      <TrustSection />

      {/* Features Grid Section */}
      <FeaturesSection onSelectFeature={handleSelectFeature} />

      {/* 8-Step Workflow Section */}
      <WorkflowSection />

      {/* Why BidSure AI Enterprise Pillars */}
      <WhyBidsureSection />

      {/* Final Call To Action Banner */}
      <CtaBanner />

      {/* Public Footer */}
      <PublicFooter />

      {/* Interactive Auth Modal (Login / Signup) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />

      {/* Feature Learn More Modal */}
      <FeatureDetailModal
        feature={selectedFeature}
        isOpen={isFeatureModalOpen}
        onClose={() => setIsFeatureModalOpen(false)}
      />
    </div>
  );
}

export default function LandingPage() {
  return (
    <LandingThemeProvider>
      <LandingPageContent />
    </LandingThemeProvider>
  );
}
