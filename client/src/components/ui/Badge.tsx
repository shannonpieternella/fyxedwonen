import styled, { css } from 'styled-components';

type Tone = 'info' | 'success' | 'warning' | 'danger' | 'neutral';

export const Badge = styled.span<{ tone?: Tone }>`
  display: inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 12px;
  ${(p) =>
    (!p.tone || p.tone === 'neutral') &&
    css`
      background: #eef2f7;
      color: #334155;
    `}
  ${(p) =>
    p.tone === 'info' &&
    css`
      background: #e0f2fe;
      color: ${p.theme.colors.accent};
    `}
  ${(p) =>
    p.tone === 'success' &&
    css`
      background: #dcfce7;
      color: ${p.theme.colors.success};
    `}
  ${(p) =>
    p.tone === 'warning' &&
    css`
      background: #fef3c7;
      color: ${p.theme.colors.warning};
    `}
  ${(p) =>
    p.tone === 'danger' &&
    css`
      background: #fee2e2;
      color: ${p.theme.colors.danger};
    `}
`;

