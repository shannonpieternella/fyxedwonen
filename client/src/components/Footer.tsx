import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const FooterContainer = styled.footer`
  background: #1f2937;
  color: white;
  padding: 60px 20px 30px;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const FooterSection = styled.div``;

const FooterTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: white;
`;

const FooterText = styled.p`
  color: #d1d5db;
  line-height: 1.6;
  margin-bottom: 16px;
`;

const FooterLinkList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FooterLinkItem = styled.li`
  margin-bottom: 12px;
`;

const FooterLink = styled(Link)`
  color: #d1d5db;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: #38b6ff;
  }
`;

const handleLinkClick = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const FooterBottom = styled.div`
  border-top: 1px solid #374151;
  padding-top: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Copyright = styled.div`
  color: #9ca3af;
  font-size: 14px;
`;

const LegalLinks = styled.div`
  display: flex;
  gap: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const LegalLink = styled(Link)`
  color: #9ca3af;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;

  &:hover {
    color: #38b6ff;
  }
`;

const ContactInfo = styled.div`
  color: #d1d5db;
  font-size: 14px;
  line-height: 1.6;
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterGrid>
          <FooterSection>
            <FooterTitle>Fyxed Wonen</FooterTitle>
            <FooterText>
              Jouw partner in het vinden van de perfecte huurwoning.
              Betrouwbaar, transparant en altijd in jouw voordeel.
            </FooterText>
            <ContactInfo>
              KvK: 75806762
            </ContactInfo>
          </FooterSection>

          <FooterSection>
            <FooterTitle>Diensten</FooterTitle>
            <FooterLinkList>
              <FooterLinkItem>
                <FooterLink to="/woning" onClick={handleLinkClick}>Huurwoningen Zoeken</FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink to="/verhuurders" onClick={handleLinkClick}>Voor Verhuurders</FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink to="/dashboard" onClick={handleLinkClick}>Mijn Account</FooterLink>
              </FooterLinkItem>
            </FooterLinkList>
          </FooterSection>

          <FooterSection>
            <FooterTitle>Bedrijf</FooterTitle>
            <FooterLinkList>
              <FooterLinkItem>
                <FooterLink to="/over-ons" onClick={handleLinkClick}>Over Ons</FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink to="/contact" onClick={handleLinkClick}>Contact</FooterLink>
              </FooterLinkItem>
            </FooterLinkList>
          </FooterSection>

          <FooterSection>
            <FooterTitle>Voor Verhuurders</FooterTitle>
            <FooterLinkList>
              <FooterLinkItem>
                <FooterLink to="/verhuurders" onClick={handleLinkClick}>Verhuurder Portal</FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink to="/verhuurders/login" onClick={handleLinkClick}>Inloggen</FooterLink>
              </FooterLinkItem>
              <FooterLinkItem>
                <FooterLink to="/verhuurders/register" onClick={handleLinkClick}>Registreren</FooterLink>
              </FooterLinkItem>
            </FooterLinkList>
          </FooterSection>

          <FooterSection>
            <FooterTitle>Contact</FooterTitle>
            <ContactInfo>
              +31 26 123 4567<br />
              wonen@fyxedbv.nl<br />
              <br />
              Ma-Vr: 09:00 - 18:00<br />
              Weekend: Op afspraak
            </ContactInfo>
          </FooterSection>
        </FooterGrid>

        <FooterBottom>
          <Copyright>
            © 2025 Fyxed Wonen B.V. Alle rechten voorbehouden.
          </Copyright>

          <LegalLinks>
            <LegalLink to="/voorwaarden" onClick={handleLinkClick}>Algemene Voorwaarden</LegalLink>
            <LegalLink to="/privacy" onClick={handleLinkClick}>Privacybeleid</LegalLink>
          </LegalLinks>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
