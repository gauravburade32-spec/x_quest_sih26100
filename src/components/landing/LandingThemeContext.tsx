'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type LandingTheme = 'dark' | 'light';

interface LandingThemeContextType {
  theme: LandingTheme;
  toggleTheme: () => void;
}

const LandingThemeContext = createContext<LandingThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
});

export const LandingThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<LandingTheme>('dark');

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('bidsure_landing_theme') as LandingTheme | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
      }
    } catch {
      // localStorage read fallback
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('bidsure_landing_theme', nextTheme);
      } catch {
        // localStorage write fallback
      }
      return nextTheme;
    });
  };

  return (
    <LandingThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </LandingThemeContext.Provider>
  );
};

export const useLandingTheme = () => useContext(LandingThemeContext);
