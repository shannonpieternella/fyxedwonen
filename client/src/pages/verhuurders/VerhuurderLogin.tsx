import React, { useState } from 'react';
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

const LoginCard = styled.div`
  background: white;
  border-radius: 24px;
  padding: 48px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
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
  margin-bottom: 32px;
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

const LoginButton = styled.button`
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

const Divider = styled.div`
  text-align: center;
  margin: 24px 0;
  color: #6b7280;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: #e5e7eb;
    z-index: 1;
  }

  span {
    background: white;
    padding: 0 16px;
    position: relative;
    z-index: 2;
  }
`;

const RegisterPrompt = styled.div`
  text-align: center;
  color: #6b7280;
  font-size: 14px;

  a {
    color: #38b6ff;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const BackToSite = styled(Link)`
  display: inline-block;
  margin-bottom: 24px;
  color: #6b7280;
  text-decoration: none;
  font-size: 14px;

  &:hover {
    color: #38b6ff;
  }
`;

const ForgotPasswordLink = styled(Link)`
  display: block;
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  text-decoration: none;
  margin-top: 16px;

  &:hover {
    color: #38b6ff;
  }
`;

const VerhuurderLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5001/api/verhuurders/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        localStorage.setItem('verhuurderLoggedIn', 'true');
        localStorage.setItem('verhuurderEmail', data.verhuurder.email);
        localStorage.setItem('verhuurderToken', data.token);
        localStorage.setItem('verhuurderName', data.verhuurder.name);

        navigate('/verhuurders/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Ongeldige inloggegevens');
      }
    } catch (err) {
      setError('Kan geen verbinding maken met de server. Probeer het later opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <LoginCard>
        <BackToSite to="/">← Terug naar hoofdsite</BackToSite>

        <Logo>
          <LogoText>FYXED WONEN</LogoText>
          <LogoSubtitle>Verhuurder Portal</LogoSubtitle>
        </Logo>

        <Title>Inloggen</Title>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="email">E-mailadres</Label>
            <Input
              id="email"
              type="email"
              placeholder="verhuurder@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">Wachtwoord</Label>
            <Input
              id="password"
              type="password"
              placeholder="Voer je wachtwoord in"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputGroup>

          <LoginButton type="submit" disabled={loading}>
            {loading ? 'Inloggen...' : 'Inloggen'}
          </LoginButton>

          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Form>

        <ForgotPasswordLink to="/verhuurders/forgot-password">
          Wachtwoord vergeten?
        </ForgotPasswordLink>

        <Divider>
          <span>of</span>
        </Divider>

        <RegisterPrompt>
          Nog geen verhuurder account? <Link to="/verhuurders/register">Aanmelden als verhuurder</Link>
        </RegisterPrompt>
      </LoginCard>
    </PageContainer>
  );
};

export default VerhuurderLogin;