import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const PageContainer = styled.div`
  min-height: 100vh;
  background: #ffffff;
  padding: 40px 20px;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 48px;
`;

const Logo = styled.h1`
  font-size: 36px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 16px;
`;

const Title = styled.h2`
  color: #1f2937;
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 16px;
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 18px;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 32px;
  margin-bottom: 48px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const PricingCard = styled.div<{ featured?: boolean }>`
  background: white;
  border: 2px solid ${props => props.featured ? '#38b6ff' : '#e5e7eb'};
  border-radius: 24px;
  padding: 32px;
  text-align: center;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  ${props => props.featured && `
    transform: scale(1.05);
    box-shadow: 0 20px 40px rgba(56, 182, 255, 0.15);
  `}

  &:hover {
    transform: ${props => props.featured ? 'scale(1.05)' : 'scale(1.02)'};
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  }
`;

const PopularBadge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #fd7e14;
  color: white;
  padding: 8px 24px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
`;

const PlanName = styled.h3`
  color: #1f2937;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const PlanDescription = styled.p`
  color: #6b7280;
  font-size: 16px;
  margin-bottom: 24px;
`;

const PriceContainer = styled.div`
  margin-bottom: 32px;
`;

const Price = styled.div`
  font-size: 48px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
`;

const PricePeriod = styled.div`
  color: #6b7280;
  font-size: 16px;
`;

const DiscountBadge = styled.div`
  background: #16a34a;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
  margin-top: 8px;
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 32px 0;
  text-align: left;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  color: #4b5563;
  font-size: 16px;

  &::before {
    content: '✓';
    color: #16a34a;
    font-weight: 600;
    font-size: 18px;
  }
`;

const SelectButton = styled.button<{ featured?: boolean }>`
  width: 100%;
  padding: 16px;
  background: ${props => props.featured ? '#38b6ff' : '#fd7e14'};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.featured ? '#2196f3' : '#e8681c'};
    transform: translateY(-2px);
  }
`;

const LoginPrompt = styled.div`
  text-align: center;
  color: #6b7280;
  font-size: 16px;
  margin-top: 32px;

  a {
    color: #38b6ff;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const MoneyBackGuarantee = styled.div`
  background: #f0f9ff;
  border: 1px solid #38b6ff;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 24px;
  color: #1e40af;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
`;

const Register: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const navigate = useNavigate();

  const handlePlanSelect = (planId: string, price: number) => {
    // Store selected plan
    localStorage.setItem('selectedPlan', JSON.stringify({
      planId,
      price,
      planName: planId === 'basic' ? 'Premium Basic' : planId === 'gold' ? 'Premium Gold' : 'Premium Platinum'
    }));

    // Navigate to registration form (create a separate component)
    navigate('/register-form');
  };

  return (
    <PageContainer>
      <Container>
        <Header>
          <Logo>FYXED WONEN</Logo>
          <Title>Kies je abonnement</Title>
          <Subtitle>
            Krijg onbeperkte toegang tot alle huurwoningen en exclusieve voordelen.
            Start vandaag nog met het vinden van jouw perfecte woning.
          </Subtitle>
        </Header>

        <PricingGrid>
          {/* Basic Plan */}
          <PricingCard>
            <PlanName>Premium Basic</PlanName>
            <PlanDescription>1 Maand</PlanDescription>
            <PriceContainer>
              <Price>€29,95</Price>
              <PricePeriod>Eenmalige aankoop</PricePeriod>
            </PriceContainer>
            <FeaturesList>
              <FeatureItem>Onbeperkte toegang tot alle woningen</FeatureItem>
              <FeatureItem>Contact met verhuurders</FeatureItem>
              <FeatureItem>Geavanceerde zoekfilters</FeatureItem>
              <FeatureItem>E-mail notificaties</FeatureItem>
              <FeatureItem>24/7 klantenservice</FeatureItem>
            </FeaturesList>
            <SelectButton onClick={() => handlePlanSelect('basic', 29.95)}>
              Kies Basic
            </SelectButton>
          </PricingCard>

          {/* Gold Plan - Featured */}
          <PricingCard featured>
            <PopularBadge>Meest Populair</PopularBadge>
            <PlanName>Premium Gold</PlanName>
            <PlanDescription>3 Maanden</PlanDescription>
            <PriceContainer>
              <Price>€79,95</Price>
              <PricePeriod>Eenmalige aankoop</PricePeriod>
              <DiscountBadge>10% KORTING</DiscountBadge>
            </PriceContainer>
            <FeaturesList>
              <FeatureItem>Alle Basic voordelen</FeatureItem>
              <FeatureItem>Voorrang op nieuwe woningen</FeatureItem>
              <FeatureItem>Premium klantenservice</FeatureItem>
              <FeatureItem>Exclusieve woningaanbiedingen</FeatureItem>
              <FeatureItem>Persoonlijke woonadvies</FeatureItem>
            </FeaturesList>
            <SelectButton featured onClick={() => handlePlanSelect('gold', 79.95)}>
              Kies Gold
            </SelectButton>
          </PricingCard>

          {/* Platinum Plan */}
          <PricingCard>
            <PlanName>Premium Platinum</PlanName>
            <PlanDescription>6 Maanden</PlanDescription>
            <PriceContainer>
              <Price>€149,95</Price>
              <PricePeriod>Eenmalige aankoop</PricePeriod>
              <DiscountBadge>15% KORTING</DiscountBadge>
            </PriceContainer>
            <MoneyBackGuarantee>
              🛡️ Niet goed, Geld terug garantie
            </MoneyBackGuarantee>
            <FeaturesList>
              <FeatureItem>Alle Gold voordelen</FeatureItem>
              <FeatureItem>VIP-service en support</FeatureItem>
              <FeatureItem>Exclusieve bezichtigingen</FeatureItem>
              <FeatureItem>Gratis juridisch advies</FeatureItem>
              <FeatureItem>Persoonlijke makelaar contact</FeatureItem>
            </FeaturesList>
            <SelectButton onClick={() => handlePlanSelect('platinum', 149.95)}>
              Kies Platinum
            </SelectButton>
          </PricingCard>
        </PricingGrid>

        <LoginPrompt>
          Al een account? <Link to="/login">Log hier in</Link>
        </LoginPrompt>
      </Container>
    </PageContainer>
  );
};

export default Register;