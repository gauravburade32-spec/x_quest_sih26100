import React from 'react';
import { useLandingTheme } from './LandingThemeContext';

export const TrustSection: React.FC = () => {
  const { theme } = useLandingTheme();
  const isDark = theme === 'dark';

  const trustPartners = [
    {
      name: 'Ministry of Defence',
      icon: (
        <svg className={`w-8 h-8 opacity-80 group-hover:opacity-100 transition-opacity fill-current ${isDark ? 'text-slate-300' : 'text-slate-600 group-hover:text-blue-600'}`} viewBox="0 0 24 24">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-5.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
        </svg>
      ),
    },
    {
      name: 'Ministry of Railways',
      icon: (
        <svg className={`w-8 h-8 opacity-80 group-hover:opacity-100 transition-opacity fill-current ${isDark ? 'text-slate-300' : 'text-slate-600 group-hover:text-blue-600'}`} viewBox="0 0 24 24">
          <path d="M12 2c-4.42 0-8 .89-8 4v10c0 1.95 2.8 3.56 6.5 3.91V21c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.09c3.7-.35 6.5-1.96 6.5-3.91V6c0-3.11-3.58-4-8-4zm-4 13c-.83 0-1.5-.67-1.5-1.5S7.17 12 8 12s1.5.67 1.5 1.5S8.83 15 8 15zm8 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm2-6H6V6h12v3z" />
        </svg>
      ),
    },
    {
      name: 'State Government',
      icon: (
        <svg className={`w-8 h-8 opacity-80 group-hover:opacity-100 transition-opacity fill-current ${isDark ? 'text-slate-300' : 'text-slate-600 group-hover:text-blue-600'}`} viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zm0 9L4 7v10l8 4 8-4V7l-8 4z" />
        </svg>
      ),
    },
    {
      name: 'Public Sector Units',
      icon: (
        <svg className={`w-8 h-8 opacity-80 group-hover:opacity-100 transition-opacity fill-current ${isDark ? 'text-slate-300' : 'text-slate-600 group-hover:text-blue-600'}`} viewBox="0 0 24 24">
          <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
        </svg>
      ),
    },
    {
      name: 'Government Institutions',
      icon: (
        <svg className={`w-8 h-8 opacity-80 group-hover:opacity-100 transition-opacity fill-current ${isDark ? 'text-slate-300' : 'text-slate-600 group-hover:text-blue-600'}`} viewBox="0 0 24 24">
          <path d="M4 10v7h3v-7H4zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm14-12v7h3v-7h-3zm-4-7L2 6v2h19V6l-9-3z" />
        </svg>
      ),
    },
  ];

  return (
    <section className={`py-12 border-y relative transition-colors duration-300 ${isDark ? 'bg-slate-950 border-slate-800/80' : 'bg-white border-slate-200/80'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <div className="shrink-0 text-center lg:text-left">
            <span className={`text-xs font-bold uppercase tracking-widest block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Built for Transparent Procurement
            </span>
            <h2 className={`text-sm font-semibold mt-1 ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>
              Trusted by Government Evaluation Teams
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-12 w-full lg:w-auto items-center justify-items-center">
            {trustPartners.map((item, idx) => (
              <div
                key={idx}
                className={`flex flex-col items-center gap-2.5 group p-2 rounded-xl transition-all text-center ${
                  isDark ? 'hover:bg-slate-900/60' : 'hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border ${
                    isDark
                      ? 'bg-slate-900 border-slate-800 group-hover:border-blue-500/50 group-hover:shadow-lg group-hover:shadow-blue-500/10'
                      : 'bg-slate-50 border-slate-200 group-hover:border-blue-300 group-hover:bg-blue-50/40 group-hover:shadow-2xs'
                  }`}
                >
                  {item.icon}
                </div>
                <span className={`text-xs font-medium transition-colors ${isDark ? 'text-slate-300 group-hover:text-white' : 'text-slate-700 group-hover:text-blue-700'}`}>
                  {item.name}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
