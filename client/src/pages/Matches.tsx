import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { matchesApi } from '../services/api';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Skeleton, SkeletonRow } from '../components/ui/Skeleton';

const Page = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  padding: 40px 20px;
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px 120px 200px;
  gap: 12px;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
`;

// Using shared Button component from ui/Button

const Matches: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<any[]>([]);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      // Use live=1 to compute matches based on current preferences
      const { matches } = await matchesApi.list({ limit: 50, live: 1 });
      setList(matches || []);
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Kon matches niet laden');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const interested = async (id: string) => { await matchesApi.markInterested(id); await load(); };
  const dismiss = async (id: string) => { await matchesApi.dismiss(id); await load(); };

  if (loading) return (
    <Page>
      <Container>
        <Card>
          <CardHeader>
            <CardTitle>Jouw Matches</CardTitle>
          </CardHeader>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonRow key={i}>
              <Skeleton h={16} />
              <Skeleton h={16} w="80px" />
              <Skeleton h={16} w="100px" />
              <Skeleton h={36} r={10} w="200px" />
            </SkeletonRow>
          ))}
        </Card>
      </Container>
    </Page>
  );

  return (
    <Page>
      <Container>
        <Card>
          <CardHeader>
            <CardTitle>Jouw Matches</CardTitle>
            <Badge tone={list.length ? 'info' : 'neutral'}>{list.length} resultaten</Badge>
          </CardHeader>
        {error && <div style={{ color: '#b91c1c' }}>{error}</div>}
        {list.length === 0 ? (
          <div style={{ color: '#64748b' }}>Nog geen matches. Stel je <a href="/preferences">voorkeuren</a> in en kom later terug.</div>
        ) : (
          list.map((m) => (
            <Row key={m._id} style={{ transition: 'background 0.2s, transform 0.1s' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>{m.property?.title}</div>
                {m.property?.offeredSince && (
                  <div style={{ color: '#64748b', fontSize: 13, marginTop: 2 }}>
                    Aangeboden sinds {new Date(m.property.offeredSince).toLocaleDateString('nl-NL')}
                  </div>
                )}
                <div style={{ color: '#475569', fontSize: 14, marginTop: 4 }}>
                  {m.property?.address?.city} · {m.property?.rooms} kamers · {m.property?.size} m²
                </div>
              </div>
              <div style={{display:'flex', gap:8, alignItems:'center'}}>
                <Badge tone={m.score >= 80 ? 'success' : 'info'}>{m.score}% match</Badge>
                {m.hireChance === 'high' && <Badge tone="success">Grote kans op huur</Badge>}
                {m.hireChance === 'low' && <Badge tone="warning">Weinig kans op huur</Badge>}
              </div>
              <div style={{ fontWeight: 800, color: '#0ea5e9' }}>€{(m.property?.price || 0).toLocaleString('nl-NL')}</div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                {m.property?.sourceUrl && (
                  <a href={m.property.sourceUrl} target="_blank" rel="noreferrer">
                    <Button variant="secondary" size="sm">Bekijk bron</Button>
                  </a>
                )}
                <Button onClick={() => interested(m._id)} size="sm">Interessant</Button>
                <Button variant="ghost" onClick={() => dismiss(m._id)} size="sm">Verbergen</Button>
              </div>
            </Row>
          ))
        )}
        </Card>
      </Container>
    </Page>
  );
};

export default Matches;
