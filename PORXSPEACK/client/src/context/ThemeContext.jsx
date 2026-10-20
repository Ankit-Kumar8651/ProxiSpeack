import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const THEMES = [
  { id: 'dark', name: 'Dark Theme', desc: 'Default sleek slate dark mode' },
  { id: 'light', name: 'Light Theme', desc: 'Clean, crisp daytime aesthetic' },
  { id: 'midnight', name: 'Midnight Blue', desc: 'Deep cosmic navy blue' },
  { id: 'high-contrast', name: 'High Contrast', desc: 'Maximum accessibility and sharp edges' },
];

export const UI_MODES = [
  {
    id: 'normal',
    name: 'Normal Mode',
    desc: 'Clean & compact cards, standard borders, reduced visual ornamentation',
  },
  {
    id: 'visual',
    name: 'Visual Mode',
    desc: 'Rich glassmorphism, accent glows, animated hover elevations, dynamic aesthetics',
  },
];

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('proxispeak_theme') || 'dark';
  });

  const [uiMode, setUiModeState] = useState(() => {
    return localStorage.getItem('proxispeak_uimode') || 'visual';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('proxispeak_theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-ui-mode', uiMode);
    localStorage.setItem('proxispeak_uimode', uiMode);
  }, [uiMode]);

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
  };

  const setUiMode = (newMode) => {
    setUiModeState(newMode);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, uiMode, setUiMode, THEMES, UI_MODES }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
