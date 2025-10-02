import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { API_BASE_URL } from '../services/api';

// Type for Stripe global
declare const Stripe: any;

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_demo');

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #38b6ff, #2196f3);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const PaymentCard = styled.div`
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

const Subtitle = styled.p`
  color: #6b7280;
  text-align: center;
  margin-bottom: 32px;
  line-height: 1.5;
`;

const PlanCard = styled.div`
  background: #f8fafc;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
`;

const PlanTitle = styled.h3`
  color: #1f2937;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px 0;
`;

const PlanPrice = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #38b6ff;
  margin-bottom: 16px;

  .period {
    font-size: 16px;
    color: #6b7280;
    font-weight: 400;
  }
`;

const PlanFeatures = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    color: #4b5563;
    margin-bottom: 8px;
    position: relative;
    padding-left: 24px;

    &::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: #16a34a;
      font-weight: 600;
    }
  }
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

const CardElementContainer = styled.div`
  padding: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;

  .StripeElement {
    font-family: inherit;
    font-size: 16px;
  }

  .StripeElement--focus {
    border-color: #38b6ff;
  }
`;

const PayButton = styled.button`
  background: #6772e5;
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 8px;
  width: 100%;

  &:hover {
    background: #5469d4;
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

const SecurityNote = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-size: 12px;
  margin-top: 16px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;

  .icon {
    font-size: 16px;
  }
`;

const PaymentForm: React.FC<{ selectedPlan: any }> = ({ selectedPlan }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleStripeCheckout = async () => {
    setLoading(true);
    setError('');

    try {
      // Get user email with fallback
      const userEmail = localStorage.getItem('tempUserEmail') || localStorage.getItem('userEmail') || 'demo@fyxedwonen.nl';

      // Call backend to create Stripe checkout session
      const response = await fetch(`${API_BASE_URL}/stripe/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planName: selectedPlan?.planName || 'Fyxed Wonen Premium',
          price: selectedPlan?.price || 29.95,
          userEmail: userEmail,
        }),
      });

      if (!response.ok) {
        throw new Error('Fout bij het aanmaken van betaalsessie');
      }

      const { sessionId, url, demo } = await response.json();

      // If we're in demo mode (no external URL), simulate payment
      if (demo) {
        setLoading(false);
        alert('Demo Mode: Betaling gesimuleerd! Je wordt doorgestuurd naar het succes scherm.');
        navigate('/payment-success?session_id=' + sessionId);
        return;
      }

      // If we have a direct URL (demo mode), open it
      if (url) {
        window.open(url, '_blank');
        // Simulate success after 5 seconds
        setTimeout(() => {
          setLoading(false);
          navigate('/payment-success?session_id=' + sessionId);
        }, 5000);
        return;
      }

      // Otherwise use normal Stripe redirect
      const stripe = (window as any).Stripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });

      if (error) {
        setError(error.message || 'Er is een fout opgetreden bij het doorsturen naar Stripe.');
      }

    } catch (err) {
      console.error('Stripe error:', err);
      setError('Er is een fout opgetreden bij de betaling. Probeer het opnieuw.');
      setLoading(false);
    }
  };

  return (
    <div>
      <PayButton
        onClick={handleStripeCheckout}
        disabled={loading}
        style={{ marginBottom: '16px' }}
      >
{loading ? 'Verbinden met Stripe...' : `💳 Betaal €${selectedPlan?.price?.toFixed(2) || '29.99'} via Stripe`}
      </PayButton>

      <div style={{ textAlign: 'center', marginBottom: '16px', color: '#6b7280', fontSize: '14px' }}>
        Doorgestuurd naar veilige Stripe betalingspagina • iDEAL, creditcard, Bancontact
      </div>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <SecurityNote>
        <span className="icon">🔒</span>
        Je betaling wordt beveiligd verwerkt door Stripe. Ondersteunt iDEAL, creditcard, Bancontact en meer.
      </SecurityNote>
    </div>
  );
};

const Payment: React.FC = () => {
  const [userEmail, setUserEmail] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  useEffect(() => {
    // Get user email from registration or login
    const tempUserData = localStorage.getItem('tempUserData');
    const storedEmail = localStorage.getItem('userEmail');

    if (tempUserData) {
      const userData = JSON.parse(tempUserData);
      setUserEmail(userData.email);
      setSelectedPlan(userData.selectedPlan);
    } else if (storedEmail) {
      setUserEmail(storedEmail);
      // Default plan if accessing payment directly
      setSelectedPlan({
        planName: 'Premium Basic',
        price: 29.95
      });
    }
  }, []);

  return (
    <Elements stripe={stripePromise}>
      <PageContainer>
        <PaymentCard>
          <Logo>
            <LogoText>FYXED WONEN</LogoText>
          </Logo>

          <Title>Voltooi je registratie</Title>
          <Subtitle>
            {userEmail && `Welkom ${userEmail}! `}
            Kies je abonnement om toegang te krijgen tot alle woningen.
          </Subtitle>

          <PlanCard>
            <PlanTitle>{selectedPlan?.planName || 'Premium Toegang'}</PlanTitle>
            <PlanPrice>
              €{selectedPlan?.price?.toFixed(2) || '29.99'} <span className="period">eenmalige betaling</span>
            </PlanPrice>
            <PlanFeatures>
              <li>Onbeperkte toegang tot alle woningen</li>
              <li>Contact met verhuurders</li>
              <li>Geavanceerde filters</li>
              <li>E-mail notificaties</li>
              <li>24/7 klantenservice</li>
            </PlanFeatures>
          </PlanCard>

          <PaymentForm selectedPlan={selectedPlan} />
        </PaymentCard>
      </PageContainer>
    </Elements>
  );
};

export default Payment;
