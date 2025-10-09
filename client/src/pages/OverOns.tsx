import React from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  min-height: 100vh;
  background: #ffffff;
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: white;
  padding: 100px 20px;
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: 56px;
  font-weight: 800;
  margin-bottom: 20px;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 22px;
  opacity: 0.9;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
  color: #cbd5e1;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const ContentSection = styled.section`
  padding: 80px 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const StorySection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  margin-bottom: 80px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const StoryImage = styled.div`
  width: 100%;
  height: 400px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 80px;
`;

const StoryContent = styled.div``;

const SectionTitle = styled.h2`
  font-size: 40px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 20px;
  line-height: 1.2;
  letter-spacing: -0.01em;

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const SectionText = styled.p`
  font-size: 18px;
  color: #475569;
  line-height: 1.8;
  margin-bottom: 20px;
`;

const MissionSection = styled.section`
  background: #f8fafc;
  padding: 80px 20px;
`;

const MissionContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const MissionTitle = styled.h2`
  font-size: 48px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 20px;
  letter-spacing: -0.02em;
`;

const MissionText = styled.p`
  font-size: 22px;
  color: #475569;
  margin-bottom: 60px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.7;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
  margin-top: 50px;
`;

const FeatureCard = styled.div`
  background: white;
  padding: 35px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  text-align: left;
  border: 1px solid #e5e7eb;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  }
`;

const FeatureIcon = styled.div`
  font-size: 44px;
  margin-bottom: 16px;
`;

const FeatureTitle = styled.h3`
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 12px;
`;

const FeatureText = styled.p`
  color: #64748b;
  line-height: 1.6;
  font-size: 16px;
`;

const StatsSection = styled.section`
  padding: 80px 20px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: white;
  text-align: center;
`;

const StatsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const StatsTitle = styled.h2`
  font-size: 40px;
  font-weight: 800;
  margin-bottom: 50px;
  letter-spacing: -0.01em;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
`;

const StatCard = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 56px;
  font-weight: 900;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #38b6ff, #667eea);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StatLabel = styled.div`
  font-size: 17px;
  opacity: 0.9;
  color: #cbd5e1;
`;

const OverOns: React.FC = () => {
  return (
    <PageContainer>
      <HeroSection>
        <HeroTitle>Vind sneller je perfecte huurwoning</HeroTitle>
        <HeroSubtitle>
          Wij automatiseren je woningzoektocht en sturen alleen relevante matches rechtstreeks naar je inbox.
        </HeroSubtitle>
      </HeroSection>

      <ContentSection>
        <StorySection>
          <StoryContent>
            <SectionTitle>Waarom Fyxed Wonen?</SectionTitle>
            <SectionText>
              De Nederlandse huurmarkt is druk en competitief. Nieuwe woningen verdwijnen binnen enkele uren,
              en handmatig zoeken kost veel tijd zonder garantie op succes.
            </SectionText>
            <SectionText>
              Daarom hebben we Fyxed Wonen gebouwd: een slim platform dat 24/7 automatisch alle grote huursites
              scant, nieuwe woningen direct matcht met jouw voorkeuren, en je alleen de beste opties toont.
              Zo reageer je sneller en vergroot je je kans op een bezichtiging.
            </SectionText>
            <SectionText>
              Geen tijdverspilling meer aan overbodige zoekresultaten. Wij brengen de juiste woningen naar jou.
            </SectionText>
          </StoryContent>
          <StoryImage>🏠</StoryImage>
        </StorySection>
      </ContentSection>

      <MissionSection>
        <MissionContainer>
          <MissionTitle>Onze Missie</MissionTitle>
          <MissionText>
            Elke huurder verdient een eerlijke kans op een goede woning. Wij maken de zoektocht
            transparanter, sneller en minder stressvol door technologie slim in te zetten.
          </MissionText>

          <FeatureGrid>
            <FeatureCard>
              <FeatureIcon>⚡</FeatureIcon>
              <FeatureTitle>24/7 Automatisch Zoeken</FeatureTitle>
              <FeatureText>
                Onze bots scannen non-stop alle grote huurplatforms in Nederland.
                Zodra er een nieuwe woning verschijnt die past bij jouw criteria, krijg je direct een alert.
              </FeatureText>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>🎯</FeatureIcon>
              <FeatureTitle>Slimme Matching</FeatureTitle>
              <FeatureText>
                Stel één keer je voorkeuren in (stad, budget, aantal kamers, oppervlakte) en wij filteren
                automatisch alle woningen die passen. Geen irrelevante resultaten meer.
              </FeatureText>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>🔔</FeatureIcon>
              <FeatureTitle>Instant Notificaties</FeatureTitle>
              <FeatureText>
                Ontvang direct een melding wanneer er een nieuwe match is. Geen vertraging, geen gemiste kansen.
                Reageer als eerste en verhoog je slagingskans.
              </FeatureText>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>📊</FeatureIcon>
              <FeatureTitle>Transparant & Eerlijk</FeatureTitle>
              <FeatureText>
                Geen verborgen kosten, geen onduidelijke voorwaarden. Je ziet precies waar je aan toe bent.
                Gratis beginnen, betaal alleen als je onze premium features wilt gebruiken.
              </FeatureText>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>⏱️</FeatureIcon>
              <FeatureTitle>Bespaar Tijd</FeatureTitle>
              <FeatureText>
                Stop met uren lang zoeken op meerdere websites. Laat ons het werk doen terwijl jij je richt
                op het voorbereiden van je reacties en bezichtigingen.
              </FeatureText>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>🤝</FeatureIcon>
              <FeatureTitle>Persoonlijke Ondersteuning</FeatureTitle>
              <FeatureText>
                Vragen of hulp nodig? Ons team staat voor je klaar. We helpen je graag met het instellen
                van je voorkeuren en geven tips voor een succesvolle zoektocht.
              </FeatureText>
            </FeatureCard>
          </FeatureGrid>
        </MissionContainer>
      </MissionSection>

      <StatsSection>
        <StatsContainer>
          <StatsTitle>Fyxed Wonen in Cijfers</StatsTitle>
          <StatsGrid>
            <StatCard>
              <StatNumber>2.000+</StatNumber>
              <StatLabel>Actieve Woningen</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>36+</StatNumber>
              <StatLabel>Nederlandse Steden</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>24/7</StatNumber>
              <StatLabel>Automatisch Scannen</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>&lt; 1 min</StatNumber>
              <StatLabel>Gemiddelde Alerttijd</StatLabel>
            </StatCard>
          </StatsGrid>
        </StatsContainer>
      </StatsSection>
    </PageContainer>
  );
};

export default OverOns;
