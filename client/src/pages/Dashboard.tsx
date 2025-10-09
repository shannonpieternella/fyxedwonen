import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { matchesApi, preferencesApi, dashboardApi } from '../services/api';

const Page = styled.div`
  min-height: 100vh;
  background: #eef2f7;
  padding: 24px;
`;

const Shell = styled.div`
  max-width: 1200px; margin: 0 auto; display:grid; grid-template-columns: 1fr 360px; gap: 22px;
  @media (max-width: 1100px){ grid-template-columns: 1fr; }
`;

const Card = styled.div`
  background: #fff; border:1px solid #e5e7eb; border-radius: 16px; padding: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);
`;

const Guide = styled(Card)`
  padding: 22px;
`;

const H1 = styled.h1`
  font-size: 28px; margin: 0 0 8px 0; color: #0f172a; letter-spacing: -0.01em;
`;

const Muted = styled.p`
  color: #475569; margin: 0;
`;

const ProgressWrap = styled.div`
  display:flex; align-items:center; gap:10px; margin-top: 10px; color:#64748b; font-weight:800;
`;
const ProgressOuter = styled.div`
  flex:1; height: 8px; background:#e5e7eb; border-radius: 999px; overflow:hidden;
`;
const ProgressInner = styled.div<{w:number}>`
  height:100%; background:#38b6ff; width: ${p=>Math.max(0, Math.min(100, p.w))}%;
`;

const StatRow = styled.div`
  display:grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 16px;
  @media (max-width: 700px){ grid-template-columns: 1fr 1fr; }
`;

const Stat = styled(Card)`
  display:grid; gap:6px; align-items:start;
  .k{ color:#64748b; font-weight:700; }
  .v{ font-size:22px; font-weight:900; color:#0f172a; }
`;

const SectionHead = styled.div`
  display:flex; align-items:center; justify-content:space-between; margin: 14px 0 10px;
`;
const SecTitle = styled.h2`
  margin:0; font-size:22px; color:#0f172a; letter-spacing:-0.01em;
`;
const SmallLink = styled(Link)`
  font-size:14px; color:#38b6ff; text-decoration:none; font-weight:700; &:hover{ text-decoration:underline; }
`;

const MatchGrid = styled.div`
  display:grid; grid-template-columns: 1fr 1fr; gap: 16px;
  @media (max-width: 900px){ grid-template-columns: 1fr; }
`;
const MatchCard = styled(Card)`
  padding: 0; overflow:hidden; border-radius: 14px; border-color:#dbe3ea;
`;
const MatchImg = styled.div<{src:string}>`
  height: 180px; background: url(${p=>p.src}) center/cover no-repeat;
`;
const MatchBody = styled.div`
  padding: 12px 14px; background:#f0f9ff;
`;
const Chips = styled.div`
  display:flex; gap:8px; flex-wrap:wrap; margin-top: 10px;
  span{ background:#e6f4ff; color:#0f172a; border:1px solid #cfe9ff; border-radius: 10px; padding:4px 8px; font-size:12px; font-weight:700; }
`;

const Side = styled.div`display:flex; flex-direction:column; gap:16px;`;

const List = styled.div`
  display:grid; gap:8px; margin-top: 10px;
`;
const ListItem = styled.div`
  display:flex; align-items:center; justify-content:space-between; background:#f8fafc; border:1px solid #e5e7eb; padding:10px 12px; border-radius: 12px; font-weight:700;
`;


const Dashboard: React.FC = () => {
  const [matches, setMatches] = useState<any[]>([]);
  const [matchesLoading, setMatchesLoading] = useState<boolean>(true);
  const [searches, setSearches] = useState<{label:string; radius?:string}[]>([]);
  const [expectedPerWeek, setExpectedPerWeek] = useState<number | null>(null);
  const [days, setDays] = useState<number>(1);
  const [stats, setStats] = useState<{total:number; viewed:number; interested:number}>({total:0, viewed:0, interested:0});
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Rely on API auth; 401 handled globally by axios interceptor

    // Prefs → zoekopdrachten
    (async () => {
      try {
        const p = await preferencesApi.get();
        const prefs = (p && (p as any).preferences) ? (p as any).preferences : p;
        const list = (prefs?.cities || prefs?.searches || []) as any[];
        if (Array.isArray(list) && list.length) {
          setSearches(list.map((c:any)=>({label: c.name || c.city || String(c), radius: c.radius || '≤ 10km'})));
        } else {
          const raw = localStorage.getItem('onboardingPrefs');
          if (raw){ const ob=JSON.parse(raw); const city = ob?.filters?.city; if (city) setSearches([{label: city, radius:'≤ 10km'}]); }
        }
      } catch {
        // Fallback to cached preferences or onboardingPrefs
        try {
          const rawCache = localStorage.getItem('preferencesCache');
          if (rawCache){ const prefs = JSON.parse(rawCache); const list = prefs?.cities || [];
            if (Array.isArray(list) && list.length) setSearches(list.map((c:any)=>({label: String(c), radius:'≤ 10km'})));
          } else {
            const raw = localStorage.getItem('onboardingPrefs');
            if (raw){ const ob=JSON.parse(raw); const city = ob?.filters?.city; if (city) setSearches([{label: city, radius:'≤ 10km'}]); }
          }
        } catch {}
      }
    })();

    // Matches (with live fallback)
    (async () => {
      setMatchesLoading(true);
      try {
        // Use live=1 so preview reflects current preferences immediately
        const res = await matchesApi.list({ limit: 4, live: 1 });
        const items = (res && res.matches) ? res.matches.map((x:any)=> ({
          // normalize shape for virtual matches
          ...(x.property || {}),
          _matchId: x._id,
          score: x.score,
        })) : (res?.items || res || []);
        setMatches(items.slice(0,4));
      } catch {
        try {
          const raw = localStorage.getItem('dashboardMatchesCache');
          if (raw) setMatches(JSON.parse(raw));
        } catch { /* ignore */ }
      } finally {
        setMatchesLoading(false);
      }
    })();

    // Geen buddy- of reactiebrief-setup meer

    // Dashboard metrics (real data)
    (async () => {
      try {
        const res = await dashboardApi.metrics();
        const m = (res && res.metrics) ? res.metrics : res;
        // searches (if provided)
        if (Array.isArray(res?.searches) && res.searches.length) {
          setSearches(res.searches.map((c:string)=>({label: c, radius: '≤ 10km'})));
        }
        // expected per week
        if (typeof m?.expectedPerWeek === 'number') setExpectedPerWeek(m.expectedPerWeek);
        // counts - use real data from matches
        const total = m?.counts?.totalMatches || 0;
        const viewed = m?.counts?.viewedMatches || 0;
        const interested = m?.counts?.interestedCount || 0;

        setStats({ total, viewed, interested });
        setDays(m?.daysSinceSignup || 1);
        setProgressPercent(m?.progressPercent || 0);
      } catch (e) {
        console.error('Failed to load dashboard metrics:', e);
      }
    })();
  }, [navigate]);

  return (
    <Page>
      <Shell>
        <div>
          <Guide>
            <H1>Verhuisgids</H1>
            <Muted>Een nieuwe huurwoning vinden is niet makkelijk in de huidige markt. Daarom krijg je van ons alles wat je nodig hebt om je zoektocht een kickstart te geven.</Muted>
            <ProgressWrap>
            <ProgressOuter><ProgressInner w={progressPercent} /></ProgressOuter>
            <span>{progressPercent}% voltooid</span>
            </ProgressWrap>
          </Guide>

          <StatRow>
            <Stat><div className="k">Zoektocht</div><div className="v">{days} dagen</div></Stat>
            <Stat><div className="k">Aantal matches</div><div className="v">{matches.length > 0 ? matches.length : stats.total}</div></Stat>
            <Stat><div className="k">Stad</div><div className="v">{searches.length > 0 ? searches[0].label : '—'}</div></Stat>
            <Stat><div className="k">Verwacht per week</div><div className="v">{expectedPerWeek ?? '—'}</div></Stat>
          </StatRow>

          <SectionHead>
            <SecTitle>Woningmatches</SecTitle>
            <SmallLink to="/matches">Matchgeschiedenis bekijken</SmallLink>
          </SectionHead>

          {matchesLoading ? (
            <Card>
              <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 0', color:'#475569'}}>
                <div style={{fontSize:40, marginBottom:12}}>⏳</div>
                <div style={{fontWeight:700}}>Matches laden...</div>
              </div>
            </Card>
          ) : (
            <MatchGrid>
              {matches.length === 0 && (
                <Card>
                  Nog geen matches zichtbaar. Stel je <Link to="/preferences">voorkeuren</Link> in of bekijk alvast <Link to="/woning">woningen</Link>.
                </Card>
              )}
              {matches.map((m:any)=>{
              const img = m.images?.[0] || 'https://images.unsplash.com/photo-1560185008-b033106af2fb?w=600&h=400&fit=crop';
              const href = m.sourceUrl ? m.sourceUrl : (m._id ? `/woning/${m._id}` : undefined);
              const anchorProps = href ? { href, target: m.sourceUrl ? '_blank' : undefined, rel: m.sourceUrl ? 'noopener noreferrer' : undefined } : {};
              return (
                <a key={m._matchId || m._id} {...anchorProps} style={{textDecoration:'none'}}>
                  <MatchCard>
                    <MatchImg src={img} />
                    <MatchBody>
                      <div style={{fontWeight:900, color:'#0f172a'}}>{m.title || m.address?.street || 'Woning'}</div>
                      <div style={{color:'#64748b', fontSize:13}}>{m.address?.city || '—'} • {m.size || '—'}m² • €{m.price || '—'}</div>
                      <Chips>
                        <span>📍 {m.address?.city || '—'}</span>
                        <span>🛏 {m.rooms || 2}</span>
                        <span>📐 {m.size || 60}m²</span>
                        <span>💶 €{m.price || 1250}</span>
                      </Chips>
                    </MatchBody>
                  </MatchCard>
                </a>
              );
            })}
            </MatchGrid>
          )}
        </div>

        <Side>
          <Card>
            <SectionHead>
              <SecTitle>Voorkeuren</SecTitle>
              <SmallLink to="/preferences">Openen</SmallLink>
            </SectionHead>
            <div style={{color:'#475569'}}>Stel je steden, budget en woonwensen in en ontvang betere matches.</div>
          </Card>

          <Card>
            <SectionHead>
              <SecTitle>Abonnement</SecTitle>
              <SmallLink to="/subscription">Beheren</SmallLink>
            </SectionHead>
            <div style={{color:'#475569'}}>Bekijk of verleng je toegang en regel je betaling.</div>
          </Card>

          <Card>
            <SectionHead>
              <SecTitle>Zoekopdrachten</SecTitle>
              <SmallLink to="/preferences">Instellingen</SmallLink>
            </SectionHead>
              <div style={{background:'#dcfce7', border:'1px solid #86efac', color:'#065f46', padding:'10px 12px', borderRadius:10, fontWeight:700, fontSize:13}}>
              Met jouw huidige zoekopdrachten kun je gemiddeld {expectedPerWeek ?? '—'} matches per week verwachten
            </div>
            <List>
              {searches.map((s, i)=> (
                <ListItem key={i}><span>● {s.label}</span><span style={{color:'#64748b', fontWeight:700}}>{s.radius || ''}</span></ListItem>
              ))}
              <SmallLink to="/preferences">+ nieuwe zoekopdracht</SmallLink>
            </List>
          </Card>

          <Card>
            <SectionHead>
              <SecTitle>Snelle Acties</SecTitle>
            </SectionHead>
            <div style={{display:'grid', gap:10}}>
              <Link to="/woning" style={{textDecoration:'none', display:'block', background:'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', border:'2px solid #93c5fd', borderRadius:12, padding:'14px 16px', transition:'all 0.2s'}}>
                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                  <div style={{display:'flex', alignItems:'center', gap:12}}>
                    <span style={{fontSize:24}}>🏘️</span>
                    <div>
                      <div style={{fontWeight:800, color:'#0f172a', fontSize:15}}>Browse alle woningen</div>
                      <div style={{color:'#475569', fontSize:13, fontWeight:600}}>Bekijk het volledige aanbod</div>
                    </div>
                  </div>
                  <span style={{color:'#38b6ff', fontSize:20}}>→</span>
                </div>
              </Link>

              <Link to="/matches" style={{textDecoration:'none', display:'block', background:'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', border:'2px solid #86efac', borderRadius:12, padding:'14px 16px', transition:'all 0.2s'}}>
                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                  <div style={{display:'flex', alignItems:'center', gap:12}}>
                    <span style={{fontSize:24}}>🎯</span>
                    <div>
                      <div style={{fontWeight:800, color:'#0f172a', fontSize:15}}>Bekijk je matches</div>
                      <div style={{color:'#475569', fontSize:13, fontWeight:600}}>Persoonlijk geselecteerde woningen</div>
                    </div>
                  </div>
                  <span style={{color:'#10b981', fontSize:20}}>→</span>
                </div>
              </Link>

              <Link to="/preferences" style={{textDecoration:'none', display:'block', background:'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border:'2px solid #fbbf24', borderRadius:12, padding:'14px 16px', transition:'all 0.2s'}}>
                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                  <div style={{display:'flex', alignItems:'center', gap:12}}>
                    <span style={{fontSize:24}}>⚙️</span>
                    <div>
                      <div style={{fontWeight:800, color:'#0f172a', fontSize:15}}>Pas voorkeuren aan</div>
                      <div style={{color:'#475569', fontSize:13, fontWeight:600}}>Krijg betere matches</div>
                    </div>
                  </div>
                  <span style={{color:'#f59e0b', fontSize:20}}>→</span>
                </div>
              </Link>
            </div>
          </Card>

          {/* Reactiebrief en Zoekbuddy panelen verwijderd */}

          
        </Side>
      </Shell>
    </Page>
  );
};

export default Dashboard;
