import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Page = styled.div`
  background: #0f172a; /* deep navy hero */
  color: #fff;
`;
const Container = styled.div`
  max-width: 1200px; margin: 0 auto; padding: 40px 20px;
`;
const Hero = styled.div`
  display:grid; grid-template-columns: 1.1fr 0.9fr; gap: 28px; align-items:center;
  @media (max-width: 1000px){ grid-template-columns: 1fr; }
`;
const Title = styled.h1`
  font-size: 52px; line-height: 1.05; margin: 0 0 10px; letter-spacing:-0.02em;
`;
const Subtitle = styled.p`
  color:#cbd5e1; font-size:18px; margin: 0;
`;
const Panel = styled.div`
  background:#ffffff; border:1px solid #e5e7eb; border-radius:16px; margin-top:24px; color:#0f172a;
`;
const PanelInner = styled.div`
  padding: 18px 18px 4px 18px;
  display:flex; align-items:center; justify-content:space-between;
`;
const SecTitle = styled.h2`
  font-size: 24px; margin: 0 0 12px; color:#0f172a;
`;
const CountPill = styled.span`
  display:inline-flex; align-items:center; gap:8px; font-weight:900; color:#0f172a; background:#f1f5f9; border:1px solid #e2e8f0; padding:6px 10px; border-radius:999px; font-size:13px;
`;
const Grid = styled.div`
  display:grid; grid-template-columns: repeat(5, 1fr); gap: 14px; padding: 0 18px 18px;
  @media (max-width: 1100px){ grid-template-columns: repeat(3, 1fr); }
  @media (max-width: 700px){ grid-template-columns: repeat(2, 1fr); }
`;
const CityCard = styled.button<{gradient:string}>`
  display:block; border:0; padding:0; border-radius:12px; overflow:hidden; cursor:pointer;
  height: 180px; color:#fff; text-align:left; position:relative; box-shadow:0 8px 18px rgba(2,6,23,0.12);
  background: ${p=>p.gradient};
  transition: all 0.3s ease;
  &:hover{ transform: translateY(-4px); box-shadow:0 12px 24px rgba(2,6,23,0.18); }
  &::before{
    content:''; position:absolute; inset:0;
    background: radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 60%);
  }
  span{ position:absolute; left:14px; bottom:14px; z-index:1; font-weight:900; font-size:19px; text-shadow:0 2px 8px rgba(0,0,0,0.3); letter-spacing:-0.01em; }
`;
const SearchWrap = styled.div`
  margin-top: 18px;
`;
const SearchRow = styled.div`
  display:flex; gap:10px;
`;
const SearchFrame = styled.div`
  flex:1; border-radius:12px; background:#fff; border:2px solid #e5e7eb; padding:10px 12px; display:flex; gap:10px; align-items:center;
`;
const SearchInput = styled.input`
  border:0; outline:none; font-size:16px; flex:1;
`;
const SearchBtn = styled.button`
  background:#e91e63; color:#fff; border:0; border-radius:12px; padding: 12px 16px; font-weight:800;
`;
const Dropdown = styled.div` position:relative; `;
const DropdownList = styled.div`
  position:absolute; top:48px; left:0; right:0; background:#fff; border:1px solid #e5e7eb; border-radius:12px; box-shadow:0 10px 30px rgba(2,6,23,0.15); z-index:20;
  max-height: 320px; overflow:auto;
`;
const DropdownItem = styled.div`
  padding:10px 12px; cursor:pointer; font-weight:700; color:#0f172a;
  &:hover{ background:#f1f5f9; }
`;

// Professionele, subtiele gradients - zakelijk en rustig
const cityGradients: Record<string,string> = {
  Amsterdam: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', // Diep navy blauw
  Rotterdam: 'linear-gradient(135deg, #434343 0%, #000000 100%)', // Zwart/grijs - industrieel
  Utrecht: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)', // Grijs naar blauw
  'Den Haag': 'linear-gradient(135deg, #2c5364 0%, #203a43 100%)', // Donker petrol
  Eindhoven: 'linear-gradient(135deg, #485563 0%, #29323c 100%)', // Donkergrijs
  Groningen: 'linear-gradient(135deg, #373b44 0%, #4286f4 100%)', // Grijs naar blauw
  Haarlem: 'linear-gradient(135deg, #525252 0%, #3d72b4 100%)', // Grijs naar blauw
  Leiden: 'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)', // Blauw/paars gedemt
  Breda: 'linear-gradient(135deg, #414345 0%, #232526 100%)', // Donkergrijs
  Nijmegen: 'linear-gradient(135deg, #355c7d 0%, #6c5b7b 100%)', // Blauw/paars subtiel
  Almere: 'linear-gradient(135deg, #536976 0%, #292e49 100%)', // Grijs/navy
  Tilburg: 'linear-gradient(135deg, #283048 0%, #859398 100%)', // Navy naar grijs
  Zwolle: 'linear-gradient(135deg, #2e3192 0%, #1bffff 100%)', // Diep blauw naar cyan
  Maastricht: 'linear-gradient(135deg, #544a7d 0%, #ffd452 100%)', // Paars naar goud
  Arnhem: 'linear-gradient(135deg, #3a6186 0%, #89253e 100%)', // Blauw naar bordeaux
  Enschede: 'linear-gradient(135deg, #232526 0%, #414345 100%)', // Grijs tinten
  Delft: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', // Navy blauw
  Amersfoort: 'linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)', // Grijs naar aqua
  'Den Bosch': 'linear-gradient(135deg, #136a8a 0%, #267871 100%)', // Petrol tinten
  Apeldoorn: 'linear-gradient(135deg, #3e5151 0%, #decba4 100%)', // Groen/beige
};

function slugifyCity(name: string){ return name.toLowerCase().replace(/\s+/g,'-'); }

const HuurwoningenIndex: React.FC = () => {
  const navigate = useNavigate();
  const [cities, setCities] = React.useState<string[]>([]);
  const [total, setTotal] = React.useState<number>(0);
  const [query, setQuery] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const gridCities = React.useMemo(()=>{
    if (cities && cities.length) return cities.slice(0, 10);
    return ['Amsterdam','Den Haag','Rotterdam','Utrecht','Eindhoven','Groningen','Tilburg','Almere','Breda','Nijmegen'];
  },[cities]);

  React.useEffect(()=>{ (async()=>{ try{ const r = await fetch('/api/properties/cities'); const j = await r.json(); if(Array.isArray(j.cities)){ setCities(j.cities.map((c:any)=>c.name)); if (typeof j.total === 'number') setTotal(j.total); else { try{ setTotal(j.cities.reduce((sum:number, c:any)=> sum + (Number(c.count)||0), 0)); }catch{ setTotal(0); } } } }catch{}})(); },[]);

  const filtered = React.useMemo(()=>{
    const q = query.trim().toLowerCase();
    if(!q) return cities.slice(0, 100);
    return cities.filter(c=>c.toLowerCase().includes(q));
  },[cities, query]);

  const go = (name:string) => navigate(`/huurwoningen/${slugifyCity(name)}`);

  return (
    <Page>
      <Container>
        <Hero>
          <div>
            <Title>Ontdek je nieuwe thuis tussen alle huurhuizen</Title>
            <Subtitle>Bekijk het actuele aanbod per stad en start je zoektocht gratis. Klik op een woning om je aan te melden en direct alerts te krijgen.</Subtitle>
            <SearchWrap>
              <SearchRow>
                <Dropdown style={{flex:1}}>
                  <SearchFrame onClick={()=>setOpen(true)}>
                    <span style={{fontSize:18}}>🔎</span>
                    <SearchInput placeholder="Zoek in jouw favoriete stad" value={query} onChange={(e)=>{ setQuery(e.target.value); setOpen(true); }} />
                  </SearchFrame>
                  {open && (
                    <DropdownList onMouseLeave={()=>setOpen(false)}>
                      {filtered.map((c)=> (
                        <DropdownItem key={c} onClick={()=>{ setOpen(false); go(c); }}>📍 {c}</DropdownItem>
                      ))}
                    </DropdownList>
                  )}
                </Dropdown>
                <SearchBtn onClick={()=>{ if(query.trim()) go(query.trim()); }}>Start zoektocht →</SearchBtn>
              </SearchRow>
            </SearchWrap>
          </div>
        </Hero>
      </Container>

      <div style={{background:'#eef2f7', color:'#0f172a'}}>
        <Container>
          <Panel>
            <PanelInner>
              <SecTitle>Zoek in jouw favoriete stad</SecTitle>
              <CountPill>In totaal {total.toLocaleString('nl-NL')} woningen</CountPill>
            </PanelInner>
            <Grid>
              {gridCities.map((c)=> (
                <CityCard key={c} gradient={cityGradients[c] || cityGradients['Amsterdam']} onClick={()=>go(c)}>
                  <span>{c}</span>
                </CityCard>
              ))}
            </Grid>
            <div style={{padding:'0 18px 18px'}}>
              <button onClick={()=>navigate('/huurwoningen/alle')} style={{border:'2px solid #e91e63', color:'#e91e63', background:'#fff', borderRadius:12, padding:'10px 14px', fontWeight:900}}>Zoek in alle steden →</button>
            </div>
          </Panel>
        </Container>
      </div>
    </Page>
  );
};

export default HuurwoningenIndex;
