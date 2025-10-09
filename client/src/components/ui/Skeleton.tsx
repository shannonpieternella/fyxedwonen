import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

export const Skeleton = styled.div<{ h?: number; w?: string; r?: number }>`
  width: ${(p) => p.w || '100%'};
  height: ${(p) => (p.h ? `${p.h}px` : '14px')};
  border-radius: ${(p) => (p.r ? `${p.r}px` : '8px')};
  background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 37%, #e5e7eb 63%);
  background-size: 800px 104px;
  animation: ${shimmer} 1.25s infinite linear;
  opacity: 0.7;
`;

export const SkeletonRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px 120px 200px;
  gap: 12px;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eef2f7;
`;

