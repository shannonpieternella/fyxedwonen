import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { subscriptionApi } from '../services/api';
import { Card, CardHeader, CardTitle, CardSubtitle } from '../components/ui/Card';
import { Grid } from '../components/ui/Grid';
import { Button } from '../components/ui/Button';

const Page = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  padding: 40px 20px;
`;

const Container = styled.div`
  max-width: 960px;
  margin: 0 auto;
`;

const Price = styled.div`
  font-size: 32px;
  font-weight: 800;
  color: #0ea5e9;
`;

const Tier = styled.div`
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
`;

// Using shared Button component from ui/Button

const Abonnement: React.FC = () => {
  const [tiers, setTiers] = useState<any>({});
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const t = await subscriptionApi.pricing();
      const s = await subscriptionApi.status();
      setTiers(t.tiers || {});
      setStatus(s.subscription || null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const checkout = async (tierKey: string) => {
    setMsg('');
    const res = await subscriptionApi.createCheckout(tierKey);
    if (res.demo) {
      // Demo: direct naar success
      window.location.href = `/payment-success?session_id=${res.sessionId}`;
      return;
    }
    if (res.url) {
      window.location.href = res.url;
    } else if (res.sessionId) {
      // Fallback
      setMsg('Sessie aangemaakt. Volg de instructies op Stripe.');
    }
  };

  if (loading) return <Page>Bezig met laden…</Page>;

  return (
    <Page>
      <Container>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Abonnement</CardTitle>
              <CardSubtitle>Kies je periode of beheer je huidige abonnement.</CardSubtitle>
            </div>
          </CardHeader>
        {status?.status === 'active' ? (
          <div style={{ marginBottom: 16 }}>
            <div><strong>Status:</strong> Actief ({status.tier})</div>
            {status.endDate && <div><strong>Geldig tot:</strong> {new Date(status.endDate).toLocaleDateString('nl-NL')}</div>}
          </div>
        ) : (
          <>
            <p style={{ color: '#475569' }}>Kies je gewenste periode. Je kunt later altijd verlengen.</p>
            <Grid min="260px">
              {Object.entries(tiers).map(([key, t]: any) => (
                <Tier key={key}>
                  <div style={{ fontWeight: 800, fontSize: 18 }}>{t.name}</div>
                  <Price>€{Math.max(0, (t.price ?? 0) - 3)}</Price>
                  <div style={{ color: '#64748b', marginBottom: 8 }}>Korting: {t.discount}%</div>
                  <Button onClick={() => checkout(key)}>Kies {t.name}</Button>
                </Tier>
              ))}
            </Grid>
            {msg && <div style={{ marginTop: 12 }}>{msg}</div>}
          </>
        )}
        </Card>
      </Container>
    </Page>
  );
};

export default Abonnement;
