import React from 'react';
import styled from 'styled-components';
import { ThemeModeContext } from '../styles/AppThemeProvider';
import { SunIcon } from './icons/Sun';
import { MoonIcon } from './icons/Moon';

const Toggle = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 2px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.panel};
  color: ${(p) => p.theme.colors.text};
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.1s ease;
  &:hover { transform: translateY(-1px); }
`;

export const ThemeToggle: React.FC = () => {
  const { mode, toggle } = React.useContext(ThemeModeContext);
  return (
    <Toggle aria-label="Thema wisselen" onClick={toggle} title="Thema wisselen">
      {mode === 'dark' ? <SunIcon /> : <MoonIcon />}
    </Toggle>
  );
};

