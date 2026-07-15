'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';
type AccentColor = 'blue' | 'purple' | 'green' | 'orange' | 'rose';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const accentColors: Record<AccentColor, string> = {
  blue: '221.2 83.2% 53.3%',
  purple: '262.1 83.3% 57.8%',
  green: '142.1 76.2% 36.3%',
  orange: '24.6 95% 53.1%',
  rose: '346.8 77.2% 49.8%',
};

export function ThemeProvider({ children, defaultTheme = 'system', defaultAccent = 'blue' }: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultAccent?: AccentColor;
}) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [accentColor, setAccentColor] = useState<AccentColor>(defaultAccent);
  const [isDark, setIsDark] = useState(false);

  const applyTheme = useCallback((newTheme: Theme) => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');

    if (newTheme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(systemDark ? 'dark' : 'light');
      setIsDark(systemDark);
    } else {
      root.classList.add(newTheme);
      setIsDark(newTheme === 'dark');
    }
  }, []);

  const applyAccent = useCallback((color: AccentColor) => {
    const root = document.documentElement;
    root.style.setProperty('--primary', accentColors[color]);
    localStorage.setItem('accent-color', color);
  }, []);

  useEffect(() => {
    // Load saved preferences
    const savedTheme = localStorage.getItem('theme') as Theme || defaultTheme;
    const savedAccent = localStorage.getItem('accent-color') as AccentColor || defaultAccent;

    setThemeState(savedTheme);
    setAccentColor(savedAccent);
    applyTheme(savedTheme);
    applyAccent(savedAccent);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') applyTheme('system');
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [defaultTheme, defaultAccent, theme, applyTheme, applyAccent]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  }, [applyTheme]);

  const handleSetAccent = useCallback((color: AccentColor) => {
    setAccentColor(color);
    applyAccent(color);
  }, [applyAccent]);

  const toggleTheme = useCallback(() => {
    setTheme(isDark ? 'light' : 'dark');
  }, [isDark, setTheme]);

  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme,
      accentColor,
      setAccentColor: handleSetAccent,
      isDark,
      toggleTheme,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}