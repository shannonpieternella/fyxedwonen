import styled from 'styled-components';

export const Card = styled.div`
  background: ${(p) => p.theme.colors.white};
  border-radius: ${(p) => p.theme.radii.lg};
  padding: 24px;
  box-shadow: ${(p) => p.theme.shadow.md};
  border: 1px solid ${(p) => p.theme.colors.border};
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const CardTitle = styled.h2`
  font-size: 20px;
  color: ${(p) => p.theme.colors.text};
`;

export const CardSubtitle = styled.p`
  color: ${(p) => p.theme.colors.textMuted};
  font-size: 14px;
`;

