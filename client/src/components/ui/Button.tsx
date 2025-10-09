import styled, { css } from 'styled-components';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

export const Button = styled.button<{ variant?: Variant; size?: Size }>`
  --pad-y: 10px;
  --pad-x: 16px;
  --radius: ${(p) => p.theme.radii.md};
  border-radius: var(--radius);
  font-weight: 700;
  transition: transform 0.15s ease, background 0.2s ease, box-shadow 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  ${(p) =>
    p.size === 'sm' &&
    css`
      --pad-y: 8px;
      --pad-x: 12px;
      font-size: 14px;
    `}
  ${(p) =>
    (!p.size || p.size === 'md') &&
    css`
      font-size: 15px;
    `}
  ${(p) =>
    p.size === 'lg' &&
    css`
      --pad-y: 14px;
      --pad-x: 20px;
      font-size: 16px;
    `}

  padding: var(--pad-y) var(--pad-x);
  border: 2px solid transparent;

  ${(p) =>
    (!p.variant || p.variant === 'primary') &&
    css`
      background: ${p.theme.colors.primary};
      color: white;
      &:hover {
        background: ${p.theme.colors.primaryDark};
        transform: translateY(-1px);
        box-shadow: ${p.theme.shadow.sm};
      }
    `}

  ${(p) =>
    p.variant === 'secondary' &&
    css`
      background: ${p.theme.colors.white};
      color: ${p.theme.colors.accent};
      border-color: ${p.theme.colors.accent};
      &:hover {
        background: #eff6ff;
      }
    `}

  ${(p) =>
    p.variant === 'ghost' &&
    css`
      background: #eef2f7;
      color: #334155;
      &:hover {
        background: #e5e7eb;
      }
    `}

  ${(p) =>
    p.variant === 'danger' &&
    css`
      background: ${p.theme.colors.danger};
      color: white;
      &:hover {
        filter: brightness(0.95);
      }
    `}
`;

