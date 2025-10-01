import React from 'react';
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
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 24px;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const ContentSection = styled.section`
  padding: 100px 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const StorySection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  margin-bottom: 100px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const StoryImage = styled.div`
  width: 100%;
  height: 400px;
  background: url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop') center/cover;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
`;

const StoryContent = styled.div``;

const SectionTitle = styled.h2`
  font-size: 40px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 24px;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const SectionText = styled.p`
  font-size: 18px;
  color: #6b7280;
  line-height: 1.7;
  margin-bottom: 24px;
`;

const ValuesSection = styled.section`
  background: #f8fafc;
  padding: 100px 20px;
`;

const ValuesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const ValuesTitle = styled.h2`
  font-size: 40px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 24px;
`;

const ValuesSubtitle = styled.p`
  font-size: 20px;
  color: #6b7280;
  margin-bottom: 80px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
`;

const ValueCard = styled.div`
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

const ValueIcon = styled.div`
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

const ValueTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
`;

const ValueText = styled.p`
  color: #6b7280;
  line-height: 1.6;
`;

const StatsSection = styled.section`
  padding: 100px 20px;
  background: linear-gradient(135deg, #38b6ff, #2196f3);
  color: white;
  text-align: center;
`;

const StatsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const StatsTitle = styled.h2`
  font-size: 40px;
  font-weight: 700;
  margin-bottom: 60px;
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
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 18px;
  opacity: 0.9;
`;

const OverOns: React.FC = () => {
  return (
    <PageContainer>
      <HeroSection>
        <HeroTitle>Over Fyxed Wonen</HeroTitle>
        <HeroSubtitle>
          Wij maken het vinden van jouw perfecte huurwoning eenvoudig, snel en betrouwbaar.
        </HeroSubtitle>
      </HeroSection>

      <ContentSection>
        <StorySection>
          <StoryContent>
            <SectionTitle>Ons Verhaal</SectionTitle>
            <SectionText>
              Fyxed Wonen werd opgericht vanuit de frustratie over de complexe en ondoorzichtige huurmarkt in Nederland.
              Te vaak zagen we huurders weken zoeken naar een geschikte woning, terwijl verhuurders moeite hadden
              de juiste kandidaten te vinden.
            </SectionText>
            <SectionText>
              Daarom hebben wij een platform ontwikkeld dat transparantie, efficiency en vertrouwen centraal stelt.
              Met moderne technologie en persoonlijke service brengen we huurders en verhuurders samen op een
              manier die eerlijk en effectief is voor iedereen.
            </SectionText>
          </StoryContent>
          <StoryImage />
        </StorySection>
      </ContentSection>

      <ValuesSection>
        <ValuesContainer>
          <ValuesTitle>Onze Waarden</ValuesTitle>
          <ValuesSubtitle>
            Deze kernwaarden sturen alles wat we doen en helpen ons de beste service te leveren.
          </ValuesSubtitle>

          <ValuesGrid>
            <ValueCard>
              <ValueIcon>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              </ValueIcon>
              <ValueTitle>Transparantie</ValueTitle>
              <ValueText>
                Geen verborgen kosten, geen onduidelijke voorwaarden. Bij ons weet je precies waar je aan toe bent
                en wat je kunt verwachten.
              </ValueText>
            </ValueCard>

            <ValueCard>
              <ValueIcon>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/>
                </svg>
              </ValueIcon>
              <ValueTitle>Efficiency</ValueTitle>
              <ValueText>
                We waarderen jouw tijd. Daarom hebben we onze processen geoptimaliseerd om je zo snel mogelijk
                te helpen bij het vinden van jouw ideale woning.
              </ValueText>
            </ValueCard>

            <ValueCard>
              <ValueIcon>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11H15.5C16.4,11 17,11.6 17,12.5V16.5C17,17.4 16.4,18 15.5,18H8.5C7.6,18 7,17.4 7,16.5V12.5C7,11.6 7.6,11 8.5,11H9.2V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,10V11H13.5V10C13.5,8.7 12.8,8.2 12,8.2Z"/>
                </svg>
              </ValueIcon>
              <ValueTitle>Betrouwbaarheid</ValueTitle>
              <ValueText>
                Met jarenlange ervaring en een bewezen track record kun je erop vertrouwen dat we er zijn
                wanneer je ons nodig hebt.
              </ValueText>
            </ValueCard>

            <ValueCard>
              <ValueIcon>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9,21C9,21.5 9.4,22 10,22H14C14.6,22 15,21.5 15,21V20H9V21M12,2C8.1,2 5,5.1 5,9C5,11.4 6.2,13.5 8,14.7V17C8,17.5 8.4,18 9,18H15C15.6,18 16,17.5 16,17V14.7C17.8,13.5 19,11.4 19,9C19,5.1 15.9,2 12,2M9.5,11.5C9.5,11.2 9.8,11 10,11S10.5,11.2 10.5,11.5S10.2,12 10,12S9.5,11.8 9.5,11.5M13.5,11.5C13.5,11.2 13.8,11 14,11S14.5,11.2 14.5,11.5S14.2,12 14,12S13.5,11.8 13.5,11.5M12,15.5C11.2,15.5 10.5,14.8 10.5,14H13.5C13.5,14.8 12.8,15.5 12,15.5Z"/>
                </svg>
              </ValueIcon>
              <ValueTitle>Innovatie</ValueTitle>
              <ValueText>
                We blijven investeren in nieuwe technologieën en methoden om onze service te verbeteren en
                de huurmarkt toegankelijker te maken.
              </ValueText>
            </ValueCard>

            <ValueCard>
              <ValueIcon>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.993 1.993 0 0 0 18.06 7c-.8 0-1.54.5-1.85 1.26l-1.92 5.63c-.25.72.11 1.51.8 1.83l2.91 1.33V18c0 .55.45 1 1 1s1-.45 1-1zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zm1.5 1h-3c-.83 0-1.5.67-1.5 1.5V16h6v-2.5c0-.83-.67-1.5-1.5-1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm1.5 1h-3C3.45 7 3 7.45 3 8v2.5h6V8c0-.55-.45-1-1-1zm-1.5 8.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S4 12.17 4 13s.67 1.5 1.5 1.5zm1.5 1h-3c-.83 0-1.5.67-1.5 1.5V20h6v-2.5c0-.83-.67-1.5-1.5-1.5z"/>
                </svg>
              </ValueIcon>
              <ValueTitle>Persoonlijke Service</ValueTitle>
              <ValueText>
                Elke klant is uniek. We luisteren naar jouw specifieke behoeften en bieden persoonlijk advies
                dat past bij jouw situatie.
              </ValueText>
            </ValueCard>

            <ValueCard>
              <ValueIcon>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </ValueIcon>
              <ValueTitle>Duurzaamheid</ValueTitle>
              <ValueText>
                We geloven in een duurzame toekomst en stimuleren energiezuinige woningen en groene
                woonoplossingen in ons aanbod.
              </ValueText>
            </ValueCard>
          </ValuesGrid>
        </ValuesContainer>
      </ValuesSection>

      <StatsSection>
        <StatsContainer>
          <StatsTitle>Fyxed Wonen in Cijfers</StatsTitle>
          <StatsGrid>
            <StatCard>
              <StatNumber>10.000+</StatNumber>
              <StatLabel>Tevreden Huurders</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>2.500+</StatNumber>
              <StatLabel>Verhuurde Woningen</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>50+</StatNumber>
              <StatLabel>Nederlandse Steden</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>98%</StatNumber>
              <StatLabel>Klanttevredenheid</StatLabel>
            </StatCard>
          </StatsGrid>
        </StatsContainer>
      </StatsSection>
    </PageContainer>
  );
};

export default OverOns;