import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Shield, ArrowRight, Lock, UserCheck, Sparkles, Building2, CheckCircle2 } from 'lucide-react';
import { useLandingTheme } from './LandingThemeContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const { theme } = useLandingTheme();
  const isDark = theme === 'dark';
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('officer.rajesh@gem.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [department, setDepartment] = useState('Department of Information Technology & Procurement');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onClose();
      router.push('/dashboard');
    }, 600);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200 ${isDark ? 'bg-slate-950/80 backdrop-blur-md' : 'bg-slate-900/60 backdrop-blur-xs'}`}>
      <div className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border ${isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`}>
        {/* Header */}
        <div className={`px-6 py-5 border-b flex items-center justify-between ${isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold ${isDark ? 'bg-blue-600 shadow-md shadow-blue-500/20' : 'bg-blue-600 shadow-xs'}`}>
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className={`font-bold text-sm tracking-wide ${isDark ? 'text-white' : 'text-slate-900'}`}>BidSure AI</span>
              <span className={`text-[10px] block font-mono ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>Government Procurement Portal</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/60'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="text-center space-y-1">
            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {mode === 'login' ? 'Officer Portal Login' : 'Get Started with BidSure AI'}
            </h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {mode === 'login'
                ? 'Enter your official credentials to access evaluation workspace'
                : 'Request instant evaluator access for government procurement teams'}
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <label className={`text-[11px] font-bold uppercase tracking-wider block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Official Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-all font-mono border ${
                    isDark
                      ? 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-600 focus:border-blue-500 focus:ring-blue-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600'
                  }`}
                  placeholder="name@gov.in"
                  required
                />
                <UserCheck className={`w-4 h-4 absolute right-3 top-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              </div>
            </div>

            <div>
              <label className={`text-[11px] font-bold uppercase tracking-wider block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Security Passcode
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-all font-mono border ${
                    isDark
                      ? 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-600 focus:border-blue-500 focus:ring-blue-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600'
                  }`}
                  placeholder="••••••••••••"
                  required
                />
                <Lock className={`w-4 h-4 absolute right-3 top-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className={`text-[11px] font-bold uppercase tracking-wider block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Department / Ministry
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className={`w-full rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-all font-sans border ${
                      isDark
                        ? 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-600 focus:border-blue-500 focus:ring-blue-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600'
                    }`}
                    placeholder="Department of Information Technology"
                    required
                  />
                  <Building2 className={`w-4 h-4 absolute right-3 top-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                </div>
              </div>
            )}
          </div>

          <div
            className={`p-3 rounded-xl text-[11px] flex items-start gap-2.5 border ${
              isDark
                ? 'bg-blue-950/40 border-blue-900/60 text-blue-300'
                : 'bg-blue-50 border-blue-200 text-blue-900'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <span>
              <strong>Pre-authenticated Session Ready:</strong> Demonstrates real-time procurement workspace integration with verified sample evaluation data.
            </span>
          </div>

          <button
            type="submit"
            className={`w-full py-3 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 ${
              isDark
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/30'
                : 'bg-blue-600 hover:bg-blue-700 shadow-xs'
            }`}
          >
            {isLoading ? (
              <Sparkles className="w-4 h-4 animate-spin text-white" />
            ) : (
              <>
                <span>{mode === 'login' ? 'Enter Evaluation Workspace' : 'Launch Demo Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className={`pt-2 text-center border-t text-xs ${isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
            {mode === 'login' ? (
              <span>
                Need access for another department?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`font-semibold hover:underline ${isDark ? 'text-blue-400' : 'text-blue-600'}`}
                >
                  Register Organization
                </button>
              </span>
            ) : (
              <span>
                Already have an officer account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={`font-semibold hover:underline ${isDark ? 'text-blue-400' : 'text-blue-600'}`}
                >
                  Sign In
                </button>
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
