import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const PageContainer = styled.div`
  min-height: 100vh;
  background: #ffffff;
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, #38b6ff, #2196f3);
  color: white;
  padding: 120px 20px;
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: 56px;
  font-weight: 700;
  margin-bottom: 24px;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 24px;
  opacity: 0.9;
  max-width: 700px;
  margin: 0 auto 40px;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const HeroButton = styled(Link)`
  background: white;
  color: #38b6ff;
  padding: 16px 32px;
  border-radius: 50px;
  font-size: 18px;
  font-weight: 600;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(255, 255, 255, 0.3);
  }
`;

const BenefitsSection = styled.section`
  padding: 100px 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 40px;
  font-weight: 700;
  color: #1f2937;
  text-align: center;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 20px;
  color: #6b7280;
  text-align: center;
  margin-bottom: 80px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 40px;
`;

const BenefitCard = styled.div`
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

const BenefitIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #38b6ff, #2196f3);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: white;
  margin: 0 auto 24px;
`;

const BenefitTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
`;

const BenefitText = styled.p`
  color: #6b7280;
  line-height: 1.6;
`;

const ProcessSection = styled.section`
  background: #f8fafc;
  padding: 100px 20px;
`;

const ProcessContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const ProcessSteps = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-top: 60px;
`;

const ProcessStep = styled.div`
  text-align: center;
  position: relative;
`;

const StepNumber = styled.div`
  width: 60px;
  height: 60px;
  background: #38b6ff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  margin: 0 auto 24px;
`;

const StepTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
`;

const StepText = styled.p`
  color: #6b7280;
  line-height: 1.6;
`;

const PricingSection = styled.section`
  padding: 100px 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-top: 60px;
`;

const PricingCard = styled.div<{ featured?: boolean }>`
  background: white;
  border: 2px solid ${props => props.featured ? '#38b6ff' : '#e5e7eb'};
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  position: relative;
  transition: all 0.3s ease;

  ${props => props.featured && `
    transform: scale(1.05);
    box-shadow: 0 20px 40px rgba(56, 182, 255, 0.15);
  `}

  &:hover {
    border-color: #38b6ff;
    transform: ${props => props.featured ? 'scale(1.05)' : 'scale(1.02)'};
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
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
`;

const PlanPrice = styled.div`
  font-size: 48px;
  font-weight: 700;
  color: #38b6ff;
  margin-bottom: 8px;
`;

const PlanPeriod = styled.div`
  color: #6b7280;
  margin-bottom: 32px;
`;

const PlanFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 32px 0;
  text-align: left;
`;

const PlanFeature = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  color: #4b5563;

  &::before {
    content: '✓';
    color: #16a34a;
    font-weight: 600;
    font-size: 18px;
  }
`;

const PlanButton = styled.button`
  width: 100%;
  background: #38b6ff;
  color: white;
  border: none;
  padding: 16px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #2196f3;
  }
`;

const ContactSection = styled.section`
  background: #f8fafc;
  padding: 100px 20px;
`;

const ContactContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const ContactForm = styled.form`
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 40px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  text-align: left;
`;

const Input = styled.input`
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #38b6ff;
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
  resize: vertical;
  min-height: 120px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #38b6ff;
  }
`;

const SubmitButton = styled.button`
  background: #38b6ff;
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  width: 100%;
  margin-top: 16px;

  &:hover {
    background: #2196f3;
  }
`;

const VoorVerhuurders: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyCount: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Bedankt voor je interesse! We nemen binnen 24 uur contact op.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      propertyCount: '',
      message: ''
    });
  };

  return (
    <PageContainer>
      <HeroSection>
        <HeroTitle>Verhuur Slim met Fyxed Wonen</HeroTitle>
        <HeroSubtitle>
          Bereik duizenden potentiële huurders en verhuur je property sneller dan ooit.
          Geen gedoe, gewoon resultaat.
        </HeroSubtitle>
        <HeroButton to="/verhuurders/register">Registreer Gratis</HeroButton>
      </HeroSection>

      <BenefitsSection>
        <SectionTitle>Waarom Kiezen voor Fyxed Wonen?</SectionTitle>
        <SectionSubtitle>
          Als verhuurder krijg je toegang tot ons uitgebreide netwerk van huurders en professionele tools
          om je property effectief te promoten.
        </SectionSubtitle>

        <BenefitsGrid>
          <BenefitCard>
            <BenefitIcon>🎯</BenefitIcon>
            <BenefitTitle>Gegarandeerde Exposure</BenefitTitle>
            <BenefitText>
              Je property wordt gezien door duizenden actieve huurders. Onze geavanceerde matching algoritmen
              zorgen ervoor dat je property bij de juiste mensen terechtkomt.
            </BenefitText>
          </BenefitCard>

          <BenefitCard>
            <BenefitIcon>⚡</BenefitIcon>
            <BenefitTitle>Snelle Verhuur</BenefitTitle>
            <BenefitText>
              Gemiddeld verhuren onze verhuurders hun property 60% sneller dan via traditionele kanalen.
              Minder leegstand betekent meer inkomsten.
            </BenefitText>
          </BenefitCard>

          <BenefitCard>
            <BenefitIcon>🛡️</BenefitIcon>
            <BenefitTitle>Gescreende Huurders</BenefitTitle>
            <BenefitText>
              Al onze huurders doorlopen een verificatieproces. Je ontvangt alleen serieuze reacties
              van gekwalificeerde kandidaten.
            </BenefitText>
          </BenefitCard>

          <BenefitCard>
            <BenefitIcon>💰</BenefitIcon>
            <BenefitTitle>Transparante Pricing</BenefitTitle>
            <BenefitText>
              Geen verborgen kosten of verrassingen. Je weet precies wat je betaalt en wanneer.
              Alleen betalen bij succesvolle verhuur.
            </BenefitText>
          </BenefitCard>

          <BenefitCard>
            <BenefitIcon>📱</BenefitIcon>
            <BenefitTitle>Easy Management</BenefitTitle>
            <BenefitText>
              Beheer al je listings vanuit één dashboard. Upload foto's, beantwoord vragen en
              communiceer met huurders - alles op één plek.
            </BenefitText>
          </BenefitCard>

          <BenefitCard>
            <BenefitIcon>📊</BenefitIcon>
            <BenefitTitle>Realtime Analytics</BenefitTitle>
            <BenefitText>
              Krijg inzicht in hoe je property presteert. Zie hoeveel mensen je listing bekijken
              en optimaliseer je aanpak op basis van data.
            </BenefitText>
          </BenefitCard>
        </BenefitsGrid>
      </BenefitsSection>

      <ProcessSection>
        <ProcessContainer>
          <SectionTitle>Hoe Het Werkt</SectionTitle>
          <SectionSubtitle>
            In vier simpele stappen van leegstaande property naar tevreden huurder.
          </SectionSubtitle>

          <ProcessSteps>
            <ProcessStep>
              <StepNumber>1</StepNumber>
              <StepTitle>Registreer Je Property</StepTitle>
              <StepText>
                Upload foto's, beschrijving en details van je property. Onze AI helpt je
                bij het optimaliseren van je listing voor maximale zichtbaarheid.
              </StepText>
            </ProcessStep>

            <ProcessStep>
              <StepNumber>2</StepNumber>
              <StepTitle>Automatische Matching</StepTitle>
              <StepText>
                Ons algoritme matcht je property automatisch met geschikte huurders
                op basis van hun voorkeuren en criteria.
              </StepText>
            </ProcessStep>

            <ProcessStep>
              <StepNumber>3</StepNumber>
              <StepTitle>Ontvang Reacties</StepTitle>
              <StepText>
                Gekwalificeerde huurders kunnen direct reageren. Je ontvangt georganiseerde
                reacties met alle relevante informatie over de kandidaten.
              </StepText>
            </ProcessStep>

            <ProcessStep>
              <StepNumber>4</StepNumber>
              <StepTitle>Sluit Het Contract</StepTitle>
              <StepText>
                Kies de beste kandidaat en sluit het huurcontract. Wij ondersteunen je
                bij het hele proces tot en met de sleuteloverdracht.
              </StepText>
            </ProcessStep>
          </ProcessSteps>
        </ProcessContainer>
      </ProcessSection>

      <PricingSection>
        <SectionTitle>Gratis Registratie voor Verhuurders</SectionTitle>
        <SectionSubtitle>
          Start vandaag nog gratis met het verhuren van je property via Fyxed Wonen.
          Geen verborgen kosten, geen maandelijkse abonnementen.
        </SectionSubtitle>

        <PricingGrid>
          <PricingCard featured style={{maxWidth: '500px', margin: '0 auto'}}>
            <PopularBadge>100% Gratis</PopularBadge>
            <PlanName>Verhuurder Account</PlanName>
            <PlanPrice>€0</PlanPrice>
            <PlanPeriod>altijd gratis</PlanPeriod>
            <PlanFeatures>
              <PlanFeature>Onbeperkt properties toevoegen</PlanFeature>
              <PlanFeature>Professionele foto uploads</PlanFeature>
              <PlanFeature>Directe communicatie met huurders</PlanFeature>
              <PlanFeature>Realtime notificaties van reacties</PlanFeature>
              <PlanFeature>Dashboard voor property management</PlanFeature>
              <PlanFeature>Gescreende huurder database toegang</PlanFeature>
              <PlanFeature>24/7 platform beschikbaarheid</PlanFeature>
            </PlanFeatures>
            <PlanButton as={Link} to="/verhuurders/register" style={{textDecoration: 'none', display: 'block', textAlign: 'center'}}>
              Registreer Nu Gratis
            </PlanButton>
          </PricingCard>
        </PricingGrid>
      </PricingSection>

      <ContactSection>
        <ContactContainer>
          <SectionTitle>Klaar om te Beginnen?</SectionTitle>
          <SectionSubtitle>
            Laat je contactgegevens achter en we nemen binnen 24 uur contact op om je te helpen
            met het verhuren van je property.
          </SectionSubtitle>

          <ContactForm onSubmit={handleSubmit}>
            <FormGrid>
              <InputGroup>
                <Label htmlFor="name">Volledige Naam *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </InputGroup>

              <InputGroup>
                <Label htmlFor="email">E-mailadres *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </InputGroup>
            </FormGrid>

            <FormGrid>
              <InputGroup>
                <Label htmlFor="phone">Telefoonnummer</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </InputGroup>

              <InputGroup>
                <Label htmlFor="propertyCount">Aantal Properties</Label>
                <Input
                  id="propertyCount"
                  name="propertyCount"
                  type="number"
                  value={formData.propertyCount}
                  onChange={handleChange}
                  placeholder="Hoeveel woningen wil je verhuren?"
                />
              </InputGroup>
            </FormGrid>

            <InputGroup>
              <Label htmlFor="message">Bericht</Label>
              <TextArea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Vertel ons meer over je property(s) en je doelen..."
              />
            </InputGroup>

            <SubmitButton type="submit">
              Ontvang Gratis Consultatie
            </SubmitButton>
          </ContactForm>
        </ContactContainer>
      </ContactSection>
    </PageContainer>
  );
};

export default VoorVerhuurders;