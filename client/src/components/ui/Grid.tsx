import styled from 'styled-components';

export const Grid = styled.div<{ min?: string }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(${(p) => p.min || '240px'}, 1fr));
  gap: 16px;
`;

