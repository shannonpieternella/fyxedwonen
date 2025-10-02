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
  grid-template-columns: 1fr;
  gap: 40px;
  margin-bottom: 80px;
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
              {/* Telefoon verwijderd op verzoek */}

              <ContactItem>
                <ContactIcon>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </ContactIcon>
                <ContactInfoText>
                  <ContactLabel>E-mail</ContactLabel>
                  <ContactValue>wonen@fyxedbv.nl</ContactValue>
                </ContactInfoText>
              </ContactItem>

              <ContactItem>
                <ContactIcon>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </ContactIcon>
                <ContactInfoText>
                  <ContactLabel>Adres</ContactLabel>
                  <ContactValue>
                    Nieuwe Koelenstraat 15<br />
                    6821 AB Arnhem
                  </ContactValue>
                </ContactInfoText>
              </ContactItem>

              <ContactItem>
                <ContactIcon>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/><path d="m12.5 7-1 0v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                  </svg>
                </ContactIcon>
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

          {/* Contactformulier verwijderd op verzoek */}
        </ContactGrid>
      </ContentSection>

      <CompanyInfoSection>
        <CompanyInfoGrid>
          <InfoCard>
            <InfoIcon>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
              </svg>
            </InfoIcon>
            <InfoTitle>Bedrijfsgegevens</InfoTitle>
            <InfoText>
              KvK: 97975354<br />
              BTW: NL850628441B01<br />
              Fyxed B.V.
            </InfoText>
          </InfoCard>

          <InfoCard>
            <InfoIcon>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/>
              </svg>
            </InfoIcon>
            <InfoTitle>Snelle Reactie</InfoTitle>
            <InfoText>
              We reageren binnen 24 uur op alle vragen en staan klaar om je te helpen bij het vinden van je ideale woning.
            </InfoText>
          </InfoCard>

          <InfoCard>
            <InfoIcon>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"/>
              </svg>
            </InfoIcon>
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
