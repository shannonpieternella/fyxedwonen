import React, { useState } from 'react';
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
  max-width: 1200px;
  margin: 0 auto;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  margin-bottom: 80px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const ContactInfo = styled.div``;

const ContactTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 24px;
`;

const ContactText = styled.p`
  font-size: 18px;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 32px;
`;

const ContactDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ContactIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #38b6ff, #2196f3);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
`;

const ContactInfoText = styled.div``;

const ContactLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
`;

const ContactValue = styled.div`
  font-size: 16px;
  color: #6b7280;
`;

const ContactForm = styled.form`
  background: #f8fafc;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 24px;
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

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled.div`
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #166534;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  text-align: center;
`;

const CompanyInfoSection = styled.section`
  background: #f8fafc;
  padding: 80px 20px;
`;

const CompanyInfoGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
`;

const InfoCard = styled.div`
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const InfoIcon = styled.div`
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #38b6ff, #2196f3);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
  margin: 0 auto 24px;
`;

const InfoTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
`;

const InfoText = styled.p`
  color: #6b7280;
  line-height: 1.6;
`;

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock form submission
      setTimeout(() => {
        setSuccess(true);
        setLoading(false);

        // Reset form after 3 seconds
        setTimeout(() => {
          setSuccess(false);
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
          });
        }, 3000);
      }, 1000);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <HeroSection>
        <HeroTitle>Neem Contact Op</HeroTitle>
        <HeroSubtitle>
          Heb je vragen over onze diensten? Ons team staat klaar om je te helpen.
        </HeroSubtitle>
      </HeroSection>

      <ContentSection>
        <ContactGrid>
          <ContactInfo>
            <ContactTitle>Laten we praten</ContactTitle>
            <ContactText>
              Of je nu een huurder bent op zoek naar je droomwoning, of een verhuurder die zijn property wilt verhuren,
              we helpen je graag verder. Neem contact op en ontdek hoe Fyxed Wonen jou kan helpen.
            </ContactText>

            <ContactDetails>
              <ContactItem>
                <ContactIcon>📞</ContactIcon>
                <ContactInfoText>
                  <ContactLabel>Telefoon</ContactLabel>
                  <ContactValue>+31 26 123 4567</ContactValue>
                </ContactInfoText>
              </ContactItem>

              <ContactItem>
                <ContactIcon>📧</ContactIcon>
                <ContactInfoText>
                  <ContactLabel>E-mail</ContactLabel>
                  <ContactValue>info@fyxedwonen.nl</ContactValue>
                </ContactInfoText>
              </ContactItem>

              <ContactItem>
                <ContactIcon>📍</ContactIcon>
                <ContactInfoText>
                  <ContactLabel>Adres</ContactLabel>
                  <ContactValue>
                    Nieuwe Koelenstraat 15<br />
                    6821 AB Arnhem
                  </ContactValue>
                </ContactInfoText>
              </ContactItem>

              <ContactItem>
                <ContactIcon>🕒</ContactIcon>
                <ContactInfoText>
                  <ContactLabel>Openingstijden</ContactLabel>
                  <ContactValue>
                    Ma-Vr: 09:00 - 18:00<br />
                    Weekend: Op afspraak
                  </ContactValue>
                </ContactInfoText>
              </ContactItem>
            </ContactDetails>
          </ContactInfo>

          <ContactForm onSubmit={handleSubmit}>
            <FormTitle>Stuur ons een bericht</FormTitle>

            {success && (
              <SuccessMessage>
                ✅ Bedankt voor je bericht! We nemen zo snel mogelijk contact op.
              </SuccessMessage>
            )}

            <FormGrid>
              <InputGroup>
                <Label htmlFor="firstName">Voornaam *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </InputGroup>

              <InputGroup>
                <Label htmlFor="lastName">Achternaam *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </InputGroup>
            </FormGrid>

            <FormGrid>
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
            </FormGrid>

            <InputGroup>
              <Label htmlFor="subject">Onderwerp *</Label>
              <Input
                id="subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Waar kunnen we je mee helpen?"
                required
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="message">Bericht *</Label>
              <TextArea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Vertel ons meer over je vraag..."
                required
              />
            </InputGroup>

            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Verzenden...' : 'Bericht Verzenden'}
            </SubmitButton>
          </ContactForm>
        </ContactGrid>
      </ContentSection>

      <CompanyInfoSection>
        <CompanyInfoGrid>
          <InfoCard>
            <InfoIcon>🏢</InfoIcon>
            <InfoTitle>Bedrijfsgegevens</InfoTitle>
            <InfoText>
              KvK: 97975354<br />
              BTW: NL850628441B01<br />
              Fyxed Wonen B.V.
            </InfoText>
          </InfoCard>

          <InfoCard>
            <InfoIcon>⚡</InfoIcon>
            <InfoTitle>Snelle Reactie</InfoTitle>
            <InfoText>
              We reageren binnen 24 uur op alle vragen en staan klaar om je te helpen bij het vinden van je ideale woning.
            </InfoText>
          </InfoCard>

          <InfoCard>
            <InfoIcon>🛡️</InfoIcon>
            <InfoTitle>Betrouwbaar</InfoTitle>
            <InfoText>
              Met jaren ervaring in de huurmarkt bieden we een veilige en betrouwbare service voor huurders en verhuurders.
            </InfoText>
          </InfoCard>
        </CompanyInfoGrid>
      </CompanyInfoSection>
    </PageContainer>
  );
};

export default Contact;