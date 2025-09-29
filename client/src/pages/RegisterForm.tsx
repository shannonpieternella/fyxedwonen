import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

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
  max-width: 500px;
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const LogoText = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`;

const Title = styled.h2`
  color: #1f2937;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 16px;
`;

const SelectedPlanInfo = styled.div`
  background: #f0f9ff;
  border: 1px solid #38b6ff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 32px;
  text-align: center;
`;

const PlanName = styled.div`
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 4px;
`;

const PlanPrice = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: #374151;
  font-size: 14px;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 16px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #38b6ff;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const RegisterButton = styled.button`
  background: #38b6ff;
  color: white;
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 8px;

  &:hover {
    background: #2196f3;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 14px;
  text-align: center;
  margin-top: 8px;
`;

const SuccessMessage = styled.div`
  color: #16a34a;
  font-size: 14px;
  text-align: center;
  margin-top: 8px;
`;

const BackButton = styled(Link)`
  color: #6b7280;
  text-decoration: none;
  font-size: 14px;
  text-align: center;
  display: block;
  margin-bottom: 24px;

  &:hover {
    color: #38b6ff;
  }
`;

const TermsText = styled.div`
  font-size: 12px;
  color: #6b7280;
  line-height: 1.4;
  margin-top: 16px;
  text-align: center;

  a {
    color: #38b6ff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const RegisterForm: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get selected plan from localStorage
    const planData = localStorage.getItem('selectedPlan');
    if (planData) {
      setSelectedPlan(JSON.parse(planData));
    } else {
      // Redirect back to plans if no plan selected
      navigate('/register');
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Wachtwoorden komen niet overeen');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Wachtwoord moet minimaal 6 tekens bevatten');
      setLoading(false);
      return;
    }

    try {
      // Real registration with backend API
      const response = await fetch('http://localhost:5001/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess('Account succesvol aangemaakt! Je wordt doorgestuurd naar de betaalpagina...');

        // Store user data temporarily for payment
        localStorage.setItem('tempUserData', JSON.stringify({
          ...formData,
          selectedPlan
        }));

        // Store auth token
        localStorage.setItem('authToken', data.token);

        // Redirect to payment page after 2 seconds
        setTimeout(() => {
          navigate('/payment');
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Er is een fout opgetreden bij het registreren');
      }
    } catch (err) {
      setError('Kan geen verbinding maken met de server. Probeer het later opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedPlan) {
    return null; // Will redirect to /register
  }

  return (
    <PageContainer>
      <RegisterCard>
        <Logo>
          <LogoText>FYXED WONEN</LogoText>
        </Logo>

        <BackButton to="/register">← Terug naar abonnementen</BackButton>

        <Title>Account aanmaken</Title>

        <SelectedPlanInfo>
          <PlanName>{selectedPlan.planName}</PlanName>
          <PlanPrice>€{selectedPlan.price.toFixed(2)}</PlanPrice>
        </SelectedPlanInfo>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="firstName">Voornaam</Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Je voornaam"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="lastName">Achternaam</Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Je achternaam"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="email">E-mailadres</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="je@email.com"
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
              placeholder="06 12345678"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">Wachtwoord</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Minimaal 6 tekens"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="confirmPassword">Bevestig wachtwoord</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Herhaal je wachtwoord"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <RegisterButton type="submit" disabled={loading}>
            {loading ? 'Registreren...' : `Doorgaan naar betaling`}
          </RegisterButton>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
        </Form>

        <TermsText>
          Door te registreren ga je akkoord met onze{' '}
          <a href="/terms">Algemene Voorwaarden</a> en{' '}
          <a href="/privacy">Privacybeleid</a>.
        </TermsText>
      </RegisterCard>
    </PageContainer>
  );
};

export default RegisterForm;