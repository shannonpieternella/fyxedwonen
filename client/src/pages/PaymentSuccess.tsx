import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { subscriptionApi } from '../services/api';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #16a34a, #15803d);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const SuccessCard = styled.div`
  background: white;
  border-radius: 24px;
  padding: 48px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  text-align: center;
`;

const SuccessIcon = styled.div`
  font-size: 64px;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  color: #1f2937;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 16px;
`;

const Message = styled.p`
  color: #6b7280;
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 32px;
`;

const Button = styled.button`
  background: #16a34a;
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #15803d;
  }
`;

const LoadingText = styled.div`
  color: #6b7280;
  font-size: 16px;
  margin-top: 16px;
`;

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        console.warn('Geen session_id in URL; betaling niet gevalideerd.');
        return;
      }
      try {
        const res = await subscriptionApi.verifyPayment(sessionId);
          if (res?.success) {
            localStorage.setItem('paymentCompleted', 'true');
            localStorage.setItem('isLoggedIn', 'true');
            const tempUserData = localStorage.getItem('tempUserData');
            if (tempUserData) {
              const userData = JSON.parse(tempUserData);
              localStorage.setItem('userEmail', userData.email);
              try {
                const name = [userData.firstName, userData.lastName].filter(Boolean).join(' ').trim();
                if (name) localStorage.setItem('userName', name);
              } catch {}
              localStorage.removeItem('tempUserData');
            }
            window.dispatchEvent(new Event('authStatusChanged'));
          // Automatisch door naar dashboard
          setTimeout(() => navigate('/dashboard'), 1200);
        } else {
          console.warn('Betaling niet bevestigd door backend.');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
      }
    };

    verifyPayment();
  }, [sessionId, navigate]);

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <PageContainer>
      <SuccessCard>
        <SuccessIcon>🎉</SuccessIcon>
        <Title>Betaling Succesvol!</Title>
        <Message>
          Bedankt voor je betaling! Je account is nu geactiveerd en je hebt toegang tot alle premium functies van Fyxed Wonen.
        </Message>
        <Button onClick={handleGoToDashboard}>Ga naar Dashboard</Button>
        {sessionId && (
          <LoadingText>
            Sessie ID: {sessionId.substring(0, 20)}...
          </LoadingText>
        )}
        {!sessionId && (
          <LoadingText>
            Geen session_id gevonden. Als je een betaling hebt gedaan maar niet wordt doorgestuurd, klik dan op de knop of ga terug naar de betaalpagina.
          </LoadingText>
        )}
      </SuccessCard>
    </PageContainer>
  );
};

export default PaymentSuccess;
