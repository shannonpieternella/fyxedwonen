import React from 'react';
import { ThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from './theme';

type ThemeMode = 'light' | 'dark';

export const ThemeModeContext = React.createContext({
  mode: 'light' as ThemeMode,
  toggle: () => {},
});

export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = React.useState<ThemeMode>(() => {
    const saved = localStorage.getItem('themeMode');
    return (saved === 'dark' || saved === 'light') ? (saved as ThemeMode) : 'light';
  });

  const toggle = () => setMode((m) => {
    const next = m === 'light' ? 'dark' : 'light';
    localStorage.setItem('themeMode', next);
    return next;
  });

  const theme = mode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeModeContext.Provider value={{ mode, toggle }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

