import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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

const ResetCard = styled.div`
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

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success'>('error');

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setMessage('Ongeldige reset link. Vraag een nieuwe aan.');
      setMessageType('error');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!newPassword || !confirmPassword) {
      setMessage('Vul beide velden in');
      setMessageType('error');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setMessage('Wachtwoord moet minimaal 6 karakters lang zijn');
      setMessageType('error');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Wachtwoorden komen niet overeen');
      setMessageType('error');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Wachtwoord succesvol gewijzigd! Je wordt doorgestuurd naar de login pagina...');
        setMessageType('success');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage(data.message || 'Er is een fout opgetreden. Probeer het opnieuw.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setMessage('Kan geen verbinding maken met de server. Probeer het later opnieuw.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <ResetCard>
        <Logo>
          <LogoText>FYXED WONEN</LogoText>
        </Logo>

        <Title>Nieuw wachtwoord instellen</Title>
        <Subtitle>
          Kies een nieuw wachtwoord voor je account.
        </Subtitle>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="newPassword">Nieuw wachtwoord</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Minimaal 6 karakters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={!token}
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="confirmPassword">Bevestig wachtwoord</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Herhaal je wachtwoord"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={!token}
            />
          </InputGroup>

          <SubmitButton type="submit" disabled={loading || !token}>
            {loading ? 'Bezig...' : 'Wachtwoord Wijzigen'}
          </SubmitButton>

          {message && <Message type={messageType}>{message}</Message>}
        </Form>

        <BackButton to="/login">← Terug naar inloggen</BackButton>
      </ResetCard>
    </PageContainer>
  );
};

export default ResetPassword;
