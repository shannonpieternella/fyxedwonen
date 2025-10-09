import React from 'react';
import styled from 'styled-components';

type Variant = 'plain' | 'alt';

const Wrapper = styled.section<{ variant: Variant }>`
  padding: 72px 20px;
  background: ${(p) => (p.variant === 'alt' ? (p.theme.mode === 'dark' ? '#0c1628' : '#f7fbff') : p.theme.colors.bg)};
  border-top: 1px solid ${(p) => (p.variant === 'alt' ? p.theme.colors.border : 'transparent')};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Heading = styled.h2`
  font-size: 28px;
  font-weight: 800;
  margin: 0 0 10px 0;
  color: ${(p) => p.theme.colors.text};
`;

const Sub = styled.p`
  color: ${(p) => p.theme.colors.textMuted};
  margin: 0 0 24px 0;
`;

const Section: React.FC<{ title?: string; subtitle?: string; variant?: Variant; className?: string; children: React.ReactNode }>
  = ({ title, subtitle, variant = 'plain', className, children }) => (
  <Wrapper variant={variant} className={className}>
    <Container className="container">
      {title && <Heading className="reveal">{title}</Heading>}
      {subtitle && <Sub className="reveal" style={{ transitionDelay: '60ms' }}>{subtitle}</Sub>}
      {children}
    </Container>
  </Wrapper>
);

export default Section;

