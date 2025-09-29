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

const TeamSection = styled.section`
  padding: 100px 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const TeamTitle = styled.h2`
  font-size: 40px;
  font-weight: 700;
  color: #1f2937;
  text-align: center;
  margin-bottom: 24px;
`;

const TeamSubtitle = styled.p`
  font-size: 20px;
  color: #6b7280;
  text-align: center;
  margin-bottom: 80px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
`;

const TeamCard = styled.div`
  text-align: center;
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

const TeamPhoto = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #38b6ff, #2196f3);
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: white;
`;

const TeamName = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
`;

const TeamRole = styled.div`
  color: #38b6ff;
  font-weight: 500;
  margin-bottom: 16px;
`;

const TeamBio = styled.p`
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
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
              <ValueIcon>🏠</ValueIcon>
              <ValueTitle>Transparantie</ValueTitle>
              <ValueText>
                Geen verborgen kosten, geen onduidelijke voorwaarden. Bij ons weet je precies waar je aan toe bent
                en wat je kunt verwachten.
              </ValueText>
            </ValueCard>

            <ValueCard>
              <ValueIcon>⚡</ValueIcon>
              <ValueTitle>Efficiency</ValueTitle>
              <ValueText>
                We waarderen jouw tijd. Daarom hebben we onze processen geoptimaliseerd om je zo snel mogelijk
                te helpen bij het vinden van jouw ideale woning.
              </ValueText>
            </ValueCard>

            <ValueCard>
              <ValueIcon>🤝</ValueIcon>
              <ValueTitle>Betrouwbaarheid</ValueTitle>
              <ValueText>
                Met jarenlange ervaring en een bewezen track record kun je erop vertrouwen dat we er zijn
                wanneer je ons nodig hebt.
              </ValueText>
            </ValueCard>

            <ValueCard>
              <ValueIcon>💡</ValueIcon>
              <ValueTitle>Innovatie</ValueTitle>
              <ValueText>
                We blijven investeren in nieuwe technologieën en methoden om onze service te verbeteren en
                de huurmarkt toegankelijker te maken.
              </ValueText>
            </ValueCard>

            <ValueCard>
              <ValueIcon>❤️</ValueIcon>
              <ValueTitle>Persoonlijke Service</ValueTitle>
              <ValueText>
                Elke klant is uniek. We luisteren naar jouw specifieke behoeften en bieden persoonlijk advies
                dat past bij jouw situatie.
              </ValueText>
            </ValueCard>

            <ValueCard>
              <ValueIcon>🌍</ValueIcon>
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

      <TeamSection>
        <TeamTitle>Ons Team</TeamTitle>
        <TeamSubtitle>
          Ontmoet de mensen die er elke dag voor zorgen dat jij snel en eenvoudig jouw droomwoning vindt.
        </TeamSubtitle>

        <TeamGrid>
          <TeamCard>
            <TeamPhoto>👨‍💼</TeamPhoto>
            <TeamName>Mark van der Berg</TeamName>
            <TeamRole>Founder & CEO</TeamRole>
            <TeamBio>
              Met 15 jaar ervaring in de vastgoedmarkt leidt Mark ons team met passie en visie
              voor een betere huurmarkt.
            </TeamBio>
          </TeamCard>

          <TeamCard>
            <TeamPhoto>👩‍💻</TeamPhoto>
            <TeamName>Lisa Jansen</TeamName>
            <TeamRole>Head of Technology</TeamRole>
            <TeamBio>
              Lisa zorgt ervoor dat ons platform cutting-edge blijft en ontwikkelt innovatieve
              oplossingen voor onze gebruikers.
            </TeamBio>
          </TeamCard>

          <TeamCard>
            <TeamPhoto>👨‍🏠</TeamPhoto>
            <TeamName>David Müller</TeamName>
            <TeamRole>Head of Operations</TeamRole>
            <TeamBio>
              David coördineert alle operationele processen en zorgt ervoor dat alles soepel verloopt
              voor huurders en verhuurders.
            </TeamBio>
          </TeamCard>

          <TeamCard>
            <TeamPhoto>👩‍💼</TeamPhoto>
            <TeamName>Sarah de Wit</TeamName>
            <TeamRole>Customer Success Manager</TeamRole>
            <TeamBio>
              Sarah en haar team zorgen ervoor dat elke klant de beste ervaring heeft en succesvol
              een woning vindt.
            </TeamBio>
          </TeamCard>
        </TeamGrid>
      </TeamSection>
    </PageContainer>
  );
};

export default OverOns;