import React from 'react';
import { FileText, ShieldCheck, AlertTriangle, UserCheck, FilePieChart, Layers, ArrowRight } from 'lucide-react';
import { FeatureItem } from './FeatureDetailModal';
import { useLandingTheme } from './LandingThemeContext';

interface FeaturesSectionProps {
  onSelectFeature: (feature: FeatureItem) => void;
}

export const FEATURES_LIST: FeatureItem[] = [
  {
    id: 'bid-analysis',
    title: 'AI-Powered Bid Analysis',
    category: 'Document Intelligence',
    icon: <FileText className="w-6 h-6" />,
    shortDesc: 'Intelligent analysis of bids using advanced AI models and NLP',
    fullDesc: 'Automated extraction of technical clauses, commercial terms, and bidder qualifications from complex PDF tenders and submitted evidence documents with sub-second OCR parsing.',
    highlights: [
      'Multi-format PDF, DOCX, and scanned document OCR processing',
      'Automated clause segmentation & requirement parameter extraction',
      'High-precision text normalization across multi-page tender bids',
    ],
    moduleRoute: '/tenders',
  },
  {
    id: 'compliance-verification',
    title: 'Compliance Verification',
    category: 'Deterministic Rules',
    icon: <ShieldCheck className="w-6 h-6" />,
    shortDesc: 'Automated compliance checking against tender requirements',
    fullDesc: 'Rule-based compliance engine that checks extracted bidder evidence against mandatory tender criteria, thresholds, and technical specifications.',
    highlights: [
      'Deterministic rule evaluation with configurable boolean & range operators',
      'Instant pass/fail classification per tender clause',
      'Direct link between evaluated rule and underlying source page excerpt',
    ],
    moduleRoute: '/compliance',
  },
  {
    id: 'risk-assessment',
    title: 'Risk Assessment',
    category: 'Risk Intelligence',
    icon: <AlertTriangle className="w-6 h-6" />,
    shortDesc: 'AI-driven risk identification and priority scoring',
    fullDesc: 'Continuous risk profiling that surfaces financial anomalies, missing mandatory certificates, expired GSTIN registrations, and clause deviations.',
    highlights: [
      'Severity-graded risk classification (High, Medium, Low)',
      'Automated detection of financial turnover gaps and missing EMD proofs',
      'Proactive alert recommendations prior to final officer decision',
    ],
    moduleRoute: '/compliance',
  },
  {
    id: 'decision-support',
    title: 'Officer Decision Support',
    category: 'Human-in-the-Loop',
    icon: <UserCheck className="w-6 h-6" />,
    shortDesc: 'Human-in-the-loop decision support with full traceability',
    fullDesc: 'Preserves designated Procurement Officer authority with AI decision support, mandatory rationale input, and official GeM clarification request workflow.',
    highlights: [
      'Evaluator authority model ensuring human oversight on every decision',
      'Mandatory rationale recording for audit-compliance logs',
      'Formal clarification request generator for non-compliant bidders',
    ],
    moduleRoute: '/recommendations',
  },
  {
    id: 'reports-audit',
    title: 'Reports & Audit Trail',
    category: 'Auditability',
    icon: <FilePieChart className="w-6 h-6" />,
    shortDesc: 'Comprehensive reports and audit-ready documentation',
    fullDesc: 'Generates immutable executive PDF reports, structured JSON export logs, and cryptographic audit records for public procurement oversight.',
    highlights: [
      'One-click PDF generation for evaluation committee presentation',
      'Immutable audit trail recording every officer action and rule result',
      'Full compliance score breakdown and risk summary matrix',
    ],
    moduleRoute: '/reports',
  },
  {
    id: 'cross-consistency',
    title: 'Cross-Document Consistency',
    category: 'Verification Engine',
    icon: <Layers className="w-6 h-6" />,
    shortDesc: 'Cross-checking vendor values across submitted certificates',
    fullDesc: 'Automated cross-document verification comparing legal business names, turnover figures, and PAN/GSTIN identifiers across multiple submitted bidder files.',
    highlights: [
      'Detects discrepancies between Certificate of Incorporation, GST, and PAN',
      'Cross-validates financial audit figures against CA certificates',
      'Highlights unverified attributes for manual officer inspection',
    ],
    moduleRoute: '/verification',
  },
];

const DARK_ICON_COLORS: Record<string, string> = {
  'bid-analysis': 'text-blue-400',
  'compliance-verification': 'text-emerald-400',
  'risk-assessment': 'text-amber-400',
  'decision-support': 'text-indigo-400',
  'reports-audit': 'text-cyan-400',
  'cross-consistency': 'text-purple-400',
};

const LIGHT_ICON_COLORS: Record<string, string> = {
  'bid-analysis': 'text-blue-600',
  'compliance-verification': 'text-emerald-600',
  'risk-assessment': 'text-amber-600',
  'decision-support': 'text-indigo-600',
  'reports-audit': 'text-blue-600',
  'cross-consistency': 'text-indigo-600',
};

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ onSelectFeature }) => {
  const { theme } = useLandingTheme();
  const isDark = theme === 'dark';

  return (
    <section id="features" className={`py-24 relative overflow-hidden transition-colors duration-300 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Glow Effects */}
      {isDark && (
        <>
          <div className="absolute top-1/2 left-0 w-72 h-72 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className={`text-xs font-bold uppercase tracking-widest block font-mono ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
            FEATURES
          </span>
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Everything You Need for Smarter Evaluation
          </h2>
          <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            A complete AI-powered platform for bid evaluation, compliance, and risk management
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES_LIST.map((feature) => {
            const iconColor = isDark ? DARK_ICON_COLORS[feature.id] : LIGHT_ICON_COLORS[feature.id];
            return (
              <div
                key={feature.id}
                className={`rounded-2xl p-7 transition-all duration-300 group flex flex-col justify-between border ${
                  isDark
                    ? 'bg-slate-900/60 border-slate-800/90 hover:border-blue-500/50 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 backdrop-blur-md'
                    : 'bg-white border-slate-200/80 hover:border-blue-300 shadow-xs hover:shadow-md'
                }`}
              >
                <div className="space-y-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all border ${
                      isDark
                        ? 'bg-slate-950 border-slate-800 group-hover:scale-110 group-hover:border-blue-500/30'
                        : 'bg-blue-50 border-blue-100 group-hover:scale-105 group-hover:bg-blue-100/60'
                    }`}
                  >
                    {React.cloneElement(feature.icon as React.ReactElement<{ className: string }>, {
                      className: `w-6 h-6 ${iconColor}`,
                    })}
                  </div>

                  <div className="space-y-2">
                    <h3 className={`text-lg font-bold transition-colors ${isDark ? 'text-white group-hover:text-blue-300' : 'text-slate-900 group-hover:text-blue-700'}`}>
                      {feature.title}
                    </h3>
                    <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {feature.shortDesc}
                    </p>
                  </div>
                </div>

                <div className={`pt-6 mt-6 border-t flex items-center justify-between ${isDark ? 'border-slate-800/80' : 'border-slate-200/80'}`}>
                  <span className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                    {feature.category}
                  </span>
                  <button
                    onClick={() => onSelectFeature(feature)}
                    className={`text-xs font-bold flex items-center gap-1.5 group/btn ${
                      isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
