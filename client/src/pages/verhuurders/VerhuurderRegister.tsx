import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { API_BASE_URL } from '../../services/api';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #38b6ff, #2196f3);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const RegisterCard = styled.div`
  background: white;
  border-radius: 24px;
  padding: 48px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const LogoText = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: #1f2937;
  margin: 0 0 4px 0;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #38b6ff, #2196f3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const LogoSubtitle = styled.div`
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 4px;
`;

const Title = styled.h2`
  color: #1f2937;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 16px;
`;

const Subtitle = styled.p`
  color: #6b7280;
  text-align: center;
  margin-bottom: 32px;
  font-size: 16px;
  line-height: 1.5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  color: #374151;
  font-weight: 600;
  margin-bottom: 6px;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 14px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s ease;
  background: #ffffff;

  &:focus {
    outline: none;
    border-color: #38b6ff;
    box-shadow: 0 0 0 3px rgba(253, 126, 20, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const TextArea = styled.textarea`
  padding: 14px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.2s ease;
  background: #ffffff;

  &:focus {
    outline: none;
    border-color: #38b6ff;
    box-shadow: 0 0 0 3px rgba(253, 126, 20, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Button = styled.button<{ loading?: boolean }>`
  background: linear-gradient(135deg, #38b6ff, #2196f3);
  color: white;
  border: none;
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: ${props => props.loading ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  margin-top: 12px;
  opacity: ${props => props.loading ? 0.7 : 1};

  &:hover {
    transform: ${props => props.loading ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.loading ? 'none' : '0 4px 20px rgba(253, 126, 20, 0.3)'};
  }

  &:active {
    transform: ${props => props.loading ? 'none' : 'translateY(0)'};
  }
`;

const ErrorMessage = styled.div`
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 16px;
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 24px;
  color: #6b7280;
  font-size: 14px;

  a {
    color: #38b6ff;
    font-weight: 600;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 24px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const Checkbox = styled.input`
  margin: 0;
  margin-top: 2px;
`;

const CheckboxLabel = styled.label`
  font-size: 14px;
  color: #374151;
  line-height: 1.4;
  cursor: pointer;

  a {
    color: #38b6ff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  company: string;
  address: string;
  propertyTypes: string;
  experience: string;
  motivation: string;
}

const VerhuurderRegister: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    company: '',
    address: '',
    propertyTypes: '',
    experience: '',
    motivation: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [avgAccepted, setAvgAccepted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!avgAccepted) {
      setError('Je moet akkoord gaan met de Algemene Voorwaarden en het Privacybeleid');
      setLoading(false);
      return;
    }

    if (!formData.name || !formData.email || !formData.password || !formData.phone || !formData.address) {
      setError('Vul alle verplichte velden in.');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Wachtwoorden komen niet overeen.');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Wachtwoord moet minimaal 6 karakters lang zijn.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/verhuurders/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          company: formData.company,
          address: formData.address,
          propertyTypes: formData.propertyTypes,
          experience: formData.experience,
          motivation: formData.motivation
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save login info and redirect to dashboard
        localStorage.setItem('verhuurderLoggedIn', 'true');
        localStorage.setItem('verhuurderEmail', data.verhuurder.email);
        localStorage.setItem('verhuurderToken', data.token);

        navigate('/verhuurders/dashboard');
      } else {
        setError(data.message || 'Er is een fout opgetreden bij het aanmaken van je account.');
      }
    } catch (error) {
      console.error('Error creating account:', error);
      setError('Er is een fout opgetreden bij het aanmaken van je account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <RegisterCard>
        <Logo>
          <LogoText>Fyxed Wonen</LogoText>
          <LogoSubtitle>Verhuurder Portal</LogoSubtitle>
        </Logo>

        <Title>Account Aanmaken</Title>
        <Subtitle>
          Maak een verhuurder account aan om je woningen te beheren en huurders te bereiken.
        </Subtitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form onSubmit={handleSubmit}>
          <Row>
            <InputGroup>
              <Label>Volledige naam *</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Jouw volledige naam"
                required
              />
            </InputGroup>

            <InputGroup>
              <Label>E-mailadres *</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="jouw@email.nl"
                required
              />
            </InputGroup>
          </Row>

          <Row>
            <InputGroup>
              <Label>Wachtwoord *</Label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Minimaal 6 karakters"
                required
              />
            </InputGroup>

            <InputGroup>
              <Label>Bevestig wachtwoord *</Label>
              <Input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Herhaal je wachtwoord"
                required
              />
            </InputGroup>
          </Row>

          <Row>
            <InputGroup>
              <Label>Telefoonnummer *</Label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="06 12345678"
                required
              />
            </InputGroup>

            <InputGroup>
              <Label>Bedrijfsnaam (optioneel)</Label>
              <Input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Jouw bedrijf B.V."
              />
            </InputGroup>
          </Row>

          <InputGroup>
            <Label>Adres *</Label>
            <Input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Straat 123, 1234 AB Stad"
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>Type woningen die je verhuurt</Label>
            <Input
              type="text"
              name="propertyTypes"
              value={formData.propertyTypes}
              onChange={handleInputChange}
              placeholder="Bijv. Appartementen, Studio's, Eengezinswoningen"
            />
          </InputGroup>

          <InputGroup>
            <Label>Ervaring met verhuur</Label>
            <TextArea
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              placeholder="Vertel over je ervaring als verhuurder..."
            />
          </InputGroup>

          <InputGroup>
            <Label>Waarom wil je verhuren via Fyxed Wonen?</Label>
            <TextArea
              name="motivation"
              value={formData.motivation}
              onChange={handleInputChange}
              placeholder="Wat trekt je aan in ons platform?"
            />
          </InputGroup>

          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              id="avgAccepted"
              checked={avgAccepted}
              onChange={(e) => setAvgAccepted(e.target.checked)}
              required
            />
            <CheckboxLabel htmlFor="avgAccepted">
              Ik ga akkoord met de{' '}
              <a href="/terms" target="_blank" rel="noopener noreferrer">
                Algemene Voorwaarden
              </a>{' '}
              en het{' '}
              <a href="/privacy" target="_blank" rel="noopener noreferrer">
                Privacybeleid
              </a>
              .
            </CheckboxLabel>
          </CheckboxContainer>

          <Button type="submit" loading={loading} disabled={loading || !avgAccepted}>
            {loading ? 'Account aanmaken...' : 'Account Aanmaken'}
          </Button>
        </Form>

        <LoginLink>
          Heb je al een account?{' '}
          <Link to="/verhuurders/login">Log hier in</Link>
        </LoginLink>
      </RegisterCard>
    </PageContainer>
  );
};

export default VerhuurderRegister;
