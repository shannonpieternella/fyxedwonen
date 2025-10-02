import React from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  min-height: 100vh;
  background: #ffffff;
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, #38b6ff, #2196f3);
  color: white;
  padding: 80px 20px;
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 20px;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const ContentSection = styled.section`
  padding: 80px 20px;
  max-width: 1000px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 24px;
  margin-top: 40px;

  &:first-child {
    margin-top: 0;
  }
`;

const SectionText = styled.p`
  font-size: 16px;
  color: #6b7280;
  line-height: 1.7;
  margin-bottom: 24px;
`;

const SubsectionTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
  margin-top: 32px;
`;

const List = styled.ul`
  color: #6b7280;
  line-height: 1.7;
  margin-bottom: 24px;
  padding-left: 24px;
`;

const ListItem = styled.li`
  margin-bottom: 8px;
`;

const LastUpdated = styled.div`
  font-size: 14px;
  color: #9ca3af;
  font-style: italic;
  margin-bottom: 40px;
  text-align: center;
`;

const HighlightBox = styled.div`
  background: #f0f9ff;
  border-left: 4px solid #38b6ff;
  padding: 24px;
  margin: 32px 0;
  border-radius: 8px;
`;

const Privacy: React.FC = () => {
  return (
    <PageContainer>
      <HeroSection>
        <HeroTitle>Privacybeleid</HeroTitle>
        <HeroSubtitle>
          Hoe Fyxed Wonen uw persoonlijke gegevens verwerkt en beschermt.
        </HeroSubtitle>
      </HeroSection>

      <ContentSection>
        <LastUpdated>Laatst bijgewerkt: 28 september 2025</LastUpdated>

        <HighlightBox>
          <SectionText style={{ marginBottom: 0, color: '#1f2937' }}>
            <strong>Samenvatting:</strong> Wij respecteren uw privacy en verwerken alleen de gegevens die
            nodig zijn om onze diensten te leveren. Uw gegevens worden nooit verkocht aan derden en u
            heeft volledige controle over uw persoonlijke informatie.
          </SectionText>
        </HighlightBox>

        <SectionTitle>1. Wie wij zijn</SectionTitle>
        <SectionText>
          Fyxed Wonen B.V. (KvK: 97975354) is de verantwoordelijke voor de verwerking van uw
          persoonlijke gegevens. Wij zijn gevestigd aan de Nieuwe Koelenstraat 15, 6821 AB Arnhem
          en zijn bereikbaar via wonen@fyxedbv.nl.
        </SectionText>

        <SectionTitle>2. Welke gegevens verzamelen wij</SectionTitle>

        <SubsectionTitle>2.1 Gegevens die u ons verstrekt</SubsectionTitle>
        <List>
          <ListItem><strong>Accountgegevens:</strong> Naam, e-mailadres, telefoonnummer</ListItem>
          <ListItem><strong>Profielinformatie:</strong> Voorkeuren, zoekgeschiedenis, favorieten</ListItem>
          <ListItem><strong>Communicatie:</strong> Berichten, contactformulieren, klantenservice</ListItem>
          <ListItem><strong>Betalingsgegevens:</strong> Facturatiegegevens (niet uw bankgegevens)</ListItem>
          <ListItem><strong>Verificatiegegevens:</strong> Documenten voor identiteitsverificatie</ListItem>
        </List>

        <SubsectionTitle>2.2 Gegevens die automatisch worden verzameld</SubsectionTitle>
        <List>
          <ListItem><strong>Technische gegevens:</strong> IP-adres, browsertype, apparaatinformatie</ListItem>
          <ListItem><strong>Gebruiksgegevens:</strong> Pagina's bezocht, zoektermen, klikgedrag</ListItem>
          <ListItem><strong>Locatiegegevens:</strong> Alleen als u hiervoor toestemming geeft</ListItem>
          <ListItem><strong>Cookies:</strong> Voor het functioneren van de website</ListItem>
        </List>

        <SectionTitle>3. Waarom verwerken wij uw gegevens</SectionTitle>

        <SubsectionTitle>3.1 Dienstverlening</SubsectionTitle>
        <List>
          <ListItem>Account aanmaken en beheren</ListItem>
          <ListItem>Zoekresultaten personaliseren</ListItem>
          <ListItem>Communicatie tussen huurders en verhuurders faciliteren</ListItem>
          <ListItem>Betalingen verwerken</ListItem>
          <ListItem>Klantenservice verlenen</ListItem>
        </List>

        <SubsectionTitle>3.2 Wettelijke verplichtingen</SubsectionTitle>
        <List>
          <ListItem>Identiteitsverificatie volgens de Wwft</ListItem>
          <ListItem>Belastingaangiften en boekhouding</ListItem>
          <ListItem>Fraudepreventie</ListItem>
        </List>

        <SubsectionTitle>3.3 Verbetering van diensten</SubsectionTitle>
        <List>
          <ListItem>Website optimalisatie</ListItem>
          <ListItem>Nieuwe functies ontwikkelen</ListItem>
          <ListItem>Kwaliteit van woningaanbod verbeteren</ListItem>
        </List>

        <SectionTitle>4. Rechtsgrondslag voor verwerking</SectionTitle>
        <SectionText>
          Wij verwerken uw gegevens op basis van:
        </SectionText>
        <List>
          <ListItem><strong>Overeenkomst:</strong> Voor het leveren van onze diensten</ListItem>
          <ListItem><strong>Toestemming:</strong> Voor marketing en locatiegegevens</ListItem>
          <ListItem><strong>Gerechtvaardigd belang:</strong> Voor fraudepreventie en websitebeveiliging</ListItem>
          <ListItem><strong>Wettelijke verplichting:</strong> Voor compliance en belastingen</ListItem>
        </List>

        <SectionTitle>5. Met wie delen wij uw gegevens</SectionTitle>

        <SubsectionTitle>5.1 Nooit verkoop aan derden</SubsectionTitle>
        <SectionText>
          Wij verkopen uw persoonlijke gegevens nooit aan derden voor marketingdoeleinden.
        </SectionText>

        <SubsectionTitle>5.2 Beperkt delen met serviceproviders</SubsectionTitle>
        <List>
          <ListItem><strong>Betalingsproviders:</strong> Voor het verwerken van betalingen</ListItem>
          <ListItem><strong>E-mailservice:</strong> Voor het verzenden van notificaties</ListItem>
          <ListItem><strong>Hostingproviders:</strong> Voor het hosten van onze website</ListItem>
          <ListItem><strong>Analysediensten:</strong> Voor websitestatistieken (geanonimiseerd)</ListItem>
        </List>

        <SubsectionTitle>5.3 Wettelijke verplichtingen</SubsectionTitle>
        <SectionText>
          In uitzonderlijke gevallen kunnen wij gegevens delen met autoriteiten wanneer dit
          wettelijk verplicht is of noodzakelijk is voor rechtsbescherming.
        </SectionText>

        <SectionTitle>6. Hoe lang bewaren wij uw gegevens</SectionTitle>
        <List>
          <ListItem><strong>Accountgegevens:</strong> Tot 2 jaar na accountsluiting</ListItem>
          <ListItem><strong>Transactiegegevens:</strong> 7 jaar (wettelijke verplichting)</ListItem>
          <ListItem><strong>Communicatie:</strong> 3 jaar voor kwaliteitsborging</ListItem>
          <ListItem><strong>Website logs:</strong> 30 dagen voor beveiliging</ListItem>
          <ListItem><strong>Marketing:</strong> Tot u zich uitschrijft</ListItem>
        </List>

        <SectionTitle>7. Beveiliging van uw gegevens</SectionTitle>
        <SectionText>
          Wij nemen de beveiliging van uw gegevens zeer serieus en gebruiken:
        </SectionText>
        <List>
          <ListItem>SSL-versleuteling voor alle datatransmissie</ListItem>
          <ListItem>Beveiligde servers in Nederland/EU</ListItem>
          <ListItem>Tweefactorauthenticatie voor medewerkers</ListItem>
          <ListItem>Regelmatige beveiligingsaudits</ListItem>
          <ListItem>Minimale toegang tot gegevens (need-to-know basis)</ListItem>
        </List>

        <SectionTitle>8. Cookies en tracking</SectionTitle>

        <SubsectionTitle>8.1 Essentiële cookies</SubsectionTitle>
        <SectionText>
          Deze cookies zijn nodig voor het functioneren van de website (inloggen, voorkeuren).
        </SectionText>

        <SubsectionTitle>8.2 Analytische cookies</SubsectionTitle>
        <SectionText>
          Met uw toestemming gebruiken wij Google Analytics voor websitestatistieken.
          Deze gegevens worden geanonimiseerd.
        </SectionText>

        <SubsectionTitle>8.3 Marketing cookies</SubsectionTitle>
        <SectionText>
          Alleen met uw expliciete toestemming voor gepersonaliseerde advertenties.
        </SectionText>

        <SectionTitle>9. Uw rechten</SectionTitle>
        <SectionText>
          U heeft de volgende rechten betreffende uw persoonlijke gegevens:
        </SectionText>
        <List>
          <ListItem><strong>Inzage:</strong> Weten welke gegevens wij van u hebben</ListItem>
          <ListItem><strong>Rectificatie:</strong> Onjuiste gegevens laten corrigeren</ListItem>
          <ListItem><strong>Wissing:</strong> Uw gegevens laten verwijderen</ListItem>
          <ListItem><strong>Beperking:</strong> Verwerking (tijdelijk) stopzetten</ListItem>
          <ListItem><strong>Overdraagbaarheid:</strong> Uw gegevens in een standaardformaat ontvangen</ListItem>
          <ListItem><strong>Bezwaar:</strong> Tegen bepaalde verwerkingen</ListItem>
          <ListItem><strong>Toestemming intrekken:</strong> Voor toestemmingsgebaseerde verwerking</ListItem>
        </List>

        <SubsectionTitle>9.1 Hoe uw rechten uitoefenen</SubsectionTitle>
        <SectionText>
          Stuur een e-mail naar wonen@fyxedbv.nl met uw verzoek. Wij reageren binnen 30 dagen.
          Voor uw beveiliging vragen wij om identificatie voordat wij uw verzoek behandelen.
        </SectionText>

        <SectionTitle>10. Overdracht buiten de EU</SectionTitle>
        <SectionText>
          Uw gegevens worden in principe binnen de EU verwerkt. Als overdracht naar landen buiten
          de EU noodzakelijk is, zorgen wij voor adequate bescherming via standaardcontractbepalingen
          of andere door de EU goedgekeurde methoden.
        </SectionText>

        <SectionTitle>11. Wijzigingen in dit beleid</SectionTitle>
        <SectionText>
          Wij kunnen dit privacybeleid wijzigen om nieuwe ontwikkelingen te reflecteren. Belangrijke
          wijzigingen kondigen wij aan via e-mail of een prominente melding op onze website.
        </SectionText>

        <SectionTitle>12. Contact en klachten</SectionTitle>

        <SubsectionTitle>12.1 Vragen over privacy</SubsectionTitle>
        <List>
          <ListItem>E-mail: wonen@fyxedbv.nl</ListItem>
          <ListItem>Telefoon: +31 26 123 4567</ListItem>
          <ListItem>Post: Fyxed Wonen B.V., t.a.v. Privacy Officer, Nieuwe Koelenstraat 15, 6821 AB Arnhem</ListItem>
        </List>

        <SubsectionTitle>12.2 Klacht indienen</SubsectionTitle>
        <SectionText>
          Als u niet tevreden bent met hoe wij uw privacy-verzoek behandelen, kunt u een klacht
          indienen bij de Autoriteit Persoonsgegevens (www.autoriteitpersoonsgegevens.nl).
        </SectionText>

        <HighlightBox>
          <SectionText style={{ marginBottom: 0, color: '#1f2937' }}>
            <strong>Heeft u vragen?</strong> Neem gerust contact op via wonen@fyxedbv.nl.
            Wij helpen u graag met vragen over uw privacy en gegevensbescherming.
          </SectionText>
        </HighlightBox>
      </ContentSection>
    </PageContainer>
  );
};

export default Privacy;
