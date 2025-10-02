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

const Terms: React.FC = () => {
  return (
    <PageContainer>
      <HeroSection>
        <HeroTitle>Algemene Voorwaarden</HeroTitle>
        <HeroSubtitle>
          De gebruiksvoorwaarden voor Fyxed Wonen platform en diensten.
        </HeroSubtitle>
      </HeroSection>

      <ContentSection>
        <LastUpdated>Laatst bijgewerkt: 28 september 2025</LastUpdated>

        <SectionTitle>1. Algemene Bepalingen</SectionTitle>
        <SectionText>
          Deze algemene voorwaarden zijn van toepassing op alle diensten die worden aangeboden door
          Fyxed Wonen B.V., gevestigd te Nieuwe Koelenstraat 15, 6821 AB Arnhem, ingeschreven in het
          handelsregister onder nummer 97975354.
        </SectionText>
        <SectionText>
          Door gebruik te maken van onze website en diensten, gaat u akkoord met deze voorwaarden.
          Indien u niet akkoord gaat met (een deel van) deze voorwaarden, kunt u geen gebruik maken
          van onze diensten.
        </SectionText>

        <SectionTitle>2. Definities</SectionTitle>
        <List>
          <ListItem><strong>Fyxed Wonen:</strong> Fyxed Wonen B.V., aanbieder van het platform</ListItem>
          <ListItem><strong>Platform:</strong> De website en mobiele applicatie van Fyxed Wonen</ListItem>
          <ListItem><strong>Huurder:</strong> Persoon die gebruik maakt van het platform om een woning te zoeken</ListItem>
          <ListItem><strong>Verhuurder:</strong> Persoon of entiteit die woningen aanbiedt via het platform</ListItem>
          <ListItem><strong>Diensten:</strong> Alle diensten aangeboden door Fyxed Wonen</ListItem>
        </List>

        <SectionTitle>3. Gebruik van het Platform</SectionTitle>
        <SubsectionTitle>3.1 Registratie</SubsectionTitle>
        <SectionText>
          Voor het gebruik van bepaalde functies is registratie vereist. U bent verplicht accurate en
          volledige informatie te verstrekken tijdens de registratie en deze up-to-date te houden.
        </SectionText>

        <SubsectionTitle>3.2 Accountbeveiliging</SubsectionTitle>
        <SectionText>
          U bent verantwoordelijk voor het geheimhouden van uw inloggegevens en alle activiteiten
          die plaatsvinden onder uw account. Fyxed Wonen is niet aansprakelijk voor schade als gevolg
          van ongeoorloofd gebruik van uw account.
        </SectionText>

        <SubsectionTitle>3.3 Toegestaan gebruik</SubsectionTitle>
        <SectionText>
          Het platform mag uitsluitend worden gebruikt voor het zoeken en aanbieden van huurwoningen.
          Het is verboden het platform te gebruiken voor illegale activiteiten, spam, of het versturen
          van misleidende informatie.
        </SectionText>

        <SectionTitle>4. Diensten en Kosten</SectionTitle>
        <SubsectionTitle>4.1 Basisdiensten</SubsectionTitle>
        <SectionText>
          Het zoeken en bekijken van woningen is gratis. Voor bepaalde premium functies kunnen kosten
          in rekening worden gebracht, zoals vermeld op het platform.
        </SectionText>

        <SubsectionTitle>4.2 Betaling</SubsectionTitle>
        <SectionText>
          Betalingen worden verwerkt via beveiligde betalingsproviders. Alle prijzen zijn inclusief BTW,
          tenzij anders vermeld. Bij het aangaan van een betaald abonnement gaat u akkoord met de
          bijbehorende voorwaarden.
        </SectionText>

        <SectionTitle>5. Verantwoordelijkheden</SectionTitle>
        <SubsectionTitle>5.1 Fyxed Wonen</SubsectionTitle>
        <List>
          <ListItem>Zorgt voor een functionerend platform</ListItem>
          <ListItem>Behandelt persoonlijke gegevens conform de privacywetgeving</ListItem>
          <ListItem>Biedt klantenservice tijdens kantooruren</ListItem>
          <ListItem>Monitort de kwaliteit van woningaanbiedingen</ListItem>
        </List>

        <SubsectionTitle>5.2 Gebruikers</SubsectionTitle>
        <List>
          <ListItem>Verstrekken accurate en waarheidsgetrouwe informatie</ListItem>
          <ListItem>Naleven van alle geldende wet- en regelgeving</ListItem>
          <ListItem>Respectvol omgaan met andere gebruikers</ListItem>
          <ListItem>Tijdig melden van problemen of misbruik</ListItem>
        </List>

        <SectionTitle>6. Aansprakelijkheid</SectionTitle>
        <SectionText>
          Fyxed Wonen functioneert als platform en bemiddelaar tussen huurders en verhuurders.
          Wij zijn niet aansprakelijk voor:
        </SectionText>
        <List>
          <ListItem>De juistheid van woningaanbiedingen</ListItem>
          <ListItem>Geschillen tussen huurders en verhuurders</ListItem>
          <ListItem>Schade door technische storingen</ListItem>
          <ListItem>Indirect gevolg van het gebruik van ons platform</ListItem>
        </List>

        <SectionTitle>7. Intellectueel Eigendom</SectionTitle>
        <SectionText>
          Alle content op het platform, inclusief teksten, afbeeldingen, logo's en software, is
          eigendom van Fyxed Wonen of gebruikt onder licentie. Het is verboden deze content te
          kopiëren, distribueren of commercieel te gebruiken zonder toestemming.
        </SectionText>

        <SectionTitle>8. Privacybescherming</SectionTitle>
        <SectionText>
          De verwerking van uw persoonlijke gegevens geschiedt conform ons Privacybeleid. Door het
          gebruik van onze diensten gaat u akkoord met de verwerking van uw gegevens zoals beschreven
          in ons privacybeleid.
        </SectionText>

        <SectionTitle>9. Beëindiging</SectionTitle>
        <SectionText>
          Beide partijen kunnen de overeenkomst te allen tijde beëindigen. Fyxed Wonen behoudt zich
          het recht voor accounts op te schorten of te beëindigen bij schending van deze voorwaarden.
        </SectionText>

        <SectionTitle>10. Wijzigingen</SectionTitle>
        <SectionText>
          Fyxed Wonen kan deze voorwaarden wijzigen. Wijzigingen worden aangekondigd via het platform
          en treden in werking 30 dagen na aankondiging. Voortgezet gebruik na deze periode geldt
          als akkoord met de gewijzigde voorwaarden.
        </SectionText>

        <SectionTitle>11. Toepasselijk Recht</SectionTitle>
        <SectionText>
          Op deze voorwaarden is Nederlands recht van toepassing. Geschillen worden voorgelegd aan
          de bevoegde rechter in het arrondissement waar Fyxed Wonen is gevestigd.
        </SectionText>

        <SectionTitle>12. Contact</SectionTitle>
        <SectionText>
          Voor vragen over deze voorwaarden kunt u contact opnemen via:
        </SectionText>
        <List>
          <ListItem>E-mail: wonen@fyxedbv.nl</ListItem>
          <ListItem>Telefoon: +31 26 123 4567</ListItem>
          <ListItem>Adres: Nieuwe Koelenstraat 15, 6821 AB Arnhem</ListItem>
        </List>
      </ContentSection>
    </PageContainer>
  );
};

export default Terms;
