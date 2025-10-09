import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
// Stripe.js niet nodig in demo/URL-flow; we gebruiken backend createCheckout
import { subscriptionApi } from '../services/api';

// Geen Stripe.js initialisatie nodig

const PageContainer = styled.div`
  min-height: 100vh;
  background: ${(p) => p.theme.colors.bg};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const PaymentCard = styled.div`
  background: ${(p) => p.theme.colors.white};
  border-radius: 24px;
  padding: 32px 28px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid ${(p) => p.theme.colors.border};
  width: 100%;
  max-width: 560px;
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
  padding: 18px;
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
  padding: 14px 28px;
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

  const handleCheckout = async () => {
    setLoading(true);
    setError('');

    try {
      // Nieuwe subscription flow (RentBird): tier selecteren
      const tier = selectedPlan?.tier || '1_month';
      const { sessionId, url, demo } = await subscriptionApi.createCheckout(tier);

      // Demo: alleen via verify op success-pagina
      if (demo && sessionId) {
        navigate('/payment-success?session_id=' + sessionId);
        return;
      }

      // Als er een directe URL is, navigeer daarheen (zelfde tab)
      if (url) {
        window.location.href = url;
        return;
      }

      // Geen URL en niet-demomodus → fout tonen
      setError('Kon betaalsessie niet openen. Probeer opnieuw.');

    } catch (err) {
      console.error('Payment error:', err);
      setError('Er is een fout opgetreden bij de betaling. Probeer het opnieuw.');
      setLoading(false);
    }
  };

  return (
    <div>
      <PayButton
        onClick={handleCheckout}
        disabled={loading}
        style={{ marginBottom: '16px' }}
      >
{loading ? 'Betaling voorbereiden…' : `💳 Betaal €${selectedPlan?.price?.toFixed(2) || '26.95'} met iDeal`}
      </PayButton>

      <div style={{ textAlign: 'center', marginBottom: '12px', color: '#6b7280', fontSize: '13px' }}>
        iDEAL, creditcard, Bancontact • Beveiligde betaling
      </div>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <SecurityNote>
        <span className="icon">🔒</span>
        Je betaling wordt veilig verwerkt. Ondersteunt iDEAL, creditcard, Bancontact en meer.
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
      // Default plan if accessing payment directly (actieprijs €3 goedkoper)
      const fallback = { planId: 'basic', planName: 'Premium Basic', price: 26.95, tier: '1_month' };
      setSelectedPlan(fallback);
      localStorage.setItem('selectedPlan', JSON.stringify(fallback));
    } else {
      // Geen context? Zet ook een fallback om uitval te voorkomen
      const fallback = { planId: 'basic', planName: 'Premium Basic', price: 26.95, tier: '1_month' };
      setSelectedPlan(fallback);
      try { localStorage.setItem('selectedPlan', JSON.stringify(fallback)); } catch {}
    }
  }, []);

  return (
    <PageContainer>
      <PaymentCard>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
          <div style={{fontWeight:800, color:'#0f172a'}}>Stap 3/3 • Betaling</div>
          <div style={{color:'#64748b', fontWeight:700}}>Plan: {selectedPlan?.planName} · €{(selectedPlan?.price ?? 26.95).toFixed(2)}</div>
        </div>
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
            €{selectedPlan?.price?.toFixed(2) || '26.95'} <span className="period">eenmalige betaling</span>
          </PlanPrice>
          <PlanFeatures>
            <li>Directe e‑mailalerts bij nieuwe matches</li>
            <li>Alle woningen overzichtelijk op één plek</li>
            <li>Geavanceerde filters en voorkeursprofiel</li>
            <li>Contact met verhuurders</li>
            <li>Support die meedenkt</li>
          </PlanFeatures>
        </PlanCard>

        <div style={{display:'grid', gap:8, marginBottom:12, color:'#64748b', fontSize:12, textAlign:'center'}}>
          <div>Niet tevreden? Binnen 14 dagen je geld terug.</div>
          <div>★ 4,6 — gewaardeerd door 1.786 gebruikers</div>
        </div>

        <PaymentForm selectedPlan={selectedPlan} />
      </PaymentCard>
    </PageContainer>
  );
};

export default Payment;
