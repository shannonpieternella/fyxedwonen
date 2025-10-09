export type ThemeMode = 'light' | 'dark';

export interface AppTheme {
  mode: ThemeMode;
  colors: {
    primary: string;
    primaryDark: string;
    accent: string;
    success: string;
    warning: string;
    danger: string;
    text: string;
    textMuted: string;
    border: string;
    bg: string;
    panel: string;
    white: string;
  };
  radii: { sm: string; md: string; lg: string; xl: string };
  shadow: { sm: string; md: string; lg: string };
  space: (n: number) => string;
  breakpoints: { sm: string; md: string; lg: string; xl: string };
}

const base = {
  radii: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
  },
  shadow: {
    sm: '0 1px 3px rgba(0,0,0,0.08)',
    md: '0 2px 8px rgba(0,0,0,0.10)',
    lg: '0 10px 24px rgba(0,0,0,0.12)',
  },
  space: (n: number) => `${n * 4}px`,
  breakpoints: {
    sm: '480px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
};

export const lightTheme: AppTheme = {
  ...base,
  mode: 'light',
  colors: {
    primary: '#38b6ff',
    primaryDark: '#2196f3',
    accent: '#0ea5e9',
    success: '#16a34a',
    warning: '#f59e0b',
    danger: '#ef4444',
    text: '#1f2937',
    textMuted: '#6b7280',
    border: '#e5e7eb',
    bg: '#f8fafc',
    panel: '#ffffff',
    white: '#ffffff',
  },
};

export const darkTheme: AppTheme = {
  ...base,
  mode: 'dark',
  colors: {
    primary: '#38b6ff',
    primaryDark: '#2196f3',
    accent: '#38bdf8',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    text: '#e5e7eb',
    textMuted: '#94a3b8',
    border: '#334155',
    bg: '#0b1220',
    panel: '#0f172a',
    white: '#0f172a',
  },
};
