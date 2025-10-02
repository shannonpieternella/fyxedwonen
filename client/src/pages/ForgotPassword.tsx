import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { API_BASE_URL } from '../services/api';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #38b6ff, #2196f3);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ForgotPasswordCard = styled.div`
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

const SubmitButton = styled.button`
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

const Message = styled.div<{ type: 'error' | 'success' }>`
  color: ${props => props.type === 'error' ? '#ef4444' : '#16a34a'};
  font-size: 14px;
  text-align: center;
  margin-top: 8px;
  padding: 12px;
  border-radius: 8px;
  background: ${props => props.type === 'error' ? '#fef2f2' : '#f0fdf4'};
  border: 1px solid ${props => props.type === 'error' ? '#fecaca' : '#bbf7d0'};
`;

const BackButton = styled(Link)`
  color: #6b7280;
  text-decoration: none;
  font-size: 14px;
  text-align: center;
  display: block;
  margin-top: 24px;

  &:hover {
    color: #38b6ff;
  }
`;

const InstructionBox = styled.div`
  background: #f0f9ff;
  border: 1px solid #38b6ff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
  color: #1e40af;
  font-size: 14px;
  text-align: center;
`;

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success'>('error');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!email) {
      setMessage('Vul je e-mailadres in');
      setMessageType('error');
      setLoading(false);
      return;
    }

    try {
      // API call to backend for password reset
      const response = await fetch(`${API_BASE_URL}/users/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('We hebben een e-mail met instructies verstuurd naar je e-mailadres.');
        setMessageType('success');
        setEmail('');
      } else {
        setMessage(data.message || 'Er is een fout opgetreden. Probeer het opnieuw.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setMessage('Kan geen verbinding maken met de server. Probeer het later opnieuw.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <ForgotPasswordCard>
        <Logo>
          <LogoText>FYXED WONEN</LogoText>
        </Logo>

        <Title>Wachtwoord vergeten?</Title>
        <Subtitle>
          Geen probleem! Vul je e-mailadres in en we sturen je instructies om je wachtwoord opnieuw in te stellen.
        </Subtitle>

        <InstructionBox>
          💡 Controleer ook je spam/ongewenste berichten folder na het versturen.
        </InstructionBox>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="email">E-mailadres</Label>
            <Input
              id="email"
              type="email"
              placeholder="je@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Versturen...' : 'Verstuur Reset Link'}
          </SubmitButton>

          {message && <Message type={messageType}>{message}</Message>}
        </Form>

        <BackButton to="/login">← Terug naar inloggen</BackButton>
      </ForgotPasswordCard>
    </PageContainer>
  );
};

export default ForgotPassword;
