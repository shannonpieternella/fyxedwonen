import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import OnboardingModal from '../components/onboarding/OnboardingModal';

const Section = styled.section`
  padding: 56px 20px;
  background: ${(p) => p.theme.colors.bg};
`;

const AltSection = styled.section`
  padding: 72px 20px;
  background:
    radial-gradient(1200px 600px at -10% -20%, rgba(56,182,255,0.06), transparent 60%),
    radial-gradient(900px 500px at 110% 10%, rgba(56,182,255,0.05), transparent 55%),
    ${(p)=>p.theme.mode==='dark' ? '#0c1628' : '#f7fbff'};
  border-top: 1px solid ${(p)=>p.theme.colors.border};
`;

const SubtleSection = styled.section`
  padding: 72px 20px;
  background:
    linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(56,182,255,0.04) 100%);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Hero = styled.div`
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 40px;
  align-items: center;
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const Title = styled.h1`
  font-size: 44px;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: ${(p) => p.theme.colors.text};
  margin: 0 0 12px 0;
  .accent { color: ${(p) => p.theme.colors.accent}; }
`;

const Subtitle = styled.p`
  color: ${(p) => p.theme.colors.textMuted};
  font-size: 18px;
  margin-bottom: 20px;
`;

const HeroPanel = styled.div`
  background: ${(p) => p.theme.colors.panel};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.xl};
  padding: 24px;
  box-shadow: ${(p) => p.theme.shadow.md};
`;

const Slideshow = styled.div<{ $img: string }>`
  border-radius: ${(p) => p.theme.radii.xl};
  height: 320px;
  background-image: url(${(p) => p.$img});
  background-size: cover;
  background-position: center;
  box-shadow: ${(p) => p.theme.shadow.lg};
  transition: background-image 0.6s ease;
`;

const Ctas = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 8px;
  a { text-decoration: none; }
`;

const SearchWrap = styled.div`
  display: grid; gap: 10px; margin-top: 14px; max-width: 680px; width: 100%;
  @media (max-width: 968px){ max-width: 100%; }
`;
const SearchLabel = styled.label`
  font-weight: 700; color: ${(p)=>p.theme.colors.text};
`;
const SearchRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  align-items: center;
  width: 100%;
  @media (max-width: 968px){ grid-template-columns: 1fr; }
`;
const SearchInput = styled.input`
  flex: 1;
  width: 100%;
  min-width: 0;
  padding: 10px 6px;
  border: 0;
  background: transparent;
  font-size: 18px;
  line-height: 1.4;
  &:focus{ outline: none; }
`;

const SearchFrame = styled.div`
  position: relative; flex:1; width: 100%; min-width: 0; max-width: 100%; border-radius: 9999px;
  background: linear-gradient(90deg, rgba(56,182,255,0.5), rgba(33,150,243,0.35));
  padding: 2px;
  box-shadow: 0 16px 40px rgba(0,0,0,0.08);
  min-height: 52px;
`;

const SearchInner = styled.div`
  display:flex; align-items:center; gap:10px; border-radius: 9999px; padding: 12px 16px; width: 100%;
  background: ${(p)=>p.theme.colors.panel}; border: 1px solid ${(p)=>p.theme.colors.border};
  min-height: 52px;
`;

const SearchAction = styled(Button)`
  height: 52px;
  border-radius: 9999px;
  padding: 0 22px;
  white-space: nowrap;
  @media (max-width: 968px){ width: 100%; }
`;

const SearchSubmit = styled(Button)`
  height: 52px;
  border-radius: 9999px;
  padding: 0 22px;
  white-space: nowrap;
  @media (max-width: 968px){ width: 100%; }
`;

const SearchIcon = styled.span`
  font-size: 20px; color: ${(p)=>p.theme.colors.textMuted};
`;

const Dropdown = styled.div`
  position: relative; width: 100%;
`;

const DropdownList = styled.div`
  position: absolute; left: 0; right: 0; top: calc(100% + 8px);
  background: ${(p)=>p.theme.colors.panel}; border:1px solid ${(p)=>p.theme.colors.border}; border-radius: 12px;
  box-shadow: 0 16px 36px rgba(0,0,0,0.12); max-height: 380px; overflow:auto; z-index: 100; padding: 6px;
`;

const DropdownHeader = styled.div`
  padding: 6px 8px; color:${(p)=>p.theme.colors.textMuted}; font-weight:800; font-size: 12px; text-transform: uppercase; letter-spacing: .04em;
`;

const ChipRow = styled.div`
  display:flex; flex-wrap:wrap; gap:8px; padding: 4px 6px 8px;
`;

const Chip = styled.button`
  border:1px solid ${(p)=>p.theme.colors.border}; border-radius: 999px; padding: 6px 10px; font-weight:700; font-size:12px; background: ${(p)=>p.theme.colors.panel};
  &:hover{ background: ${(p)=>p.theme.mode==='dark' ? 'rgba(56,182,255,0.16)' : 'rgba(56,182,255,0.10)'}; }
`;

const DropdownItem = styled.button`
  width: 100%; text-align: left; background: transparent; border: 0; padding: 12px 12px; border-radius: 10px; color: ${(p)=>p.theme.colors.text};
  display:flex; align-items:center; gap:10px; font-weight:600;
  &:hover { background: ${(p)=>p.theme.mode==='dark' ? 'rgba(56,182,255,0.12)' : 'rgba(56,182,255,0.08)'}; }
`;

const ModalOverlay = styled.div`
  position: fixed; inset: 0; background: rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; z-index: 50;
`;

const ModalCard = styled.div`
  background: ${(p)=>p.theme.colors.panel}; border:1px solid ${(p)=>p.theme.colors.border}; border-radius: 16px; padding: 22px; width: 100%; max-width: 520px;
  box-shadow: 0 18px 40px rgba(0,0,0,0.16);
`;

const ModalTitle = styled.h3`
  margin: 0 0 6px 0; font-size: 20px; font-weight: 900; color: ${(p)=>p.theme.colors.text};
`;

const ModalText = styled.p`
  margin: 0 0 16px 0; color: ${(p)=>p.theme.colors.textMuted};
`;

const ModalButtons = styled.div`
  display:flex; gap: 10px; justify-content:flex-end;
`;

const ModalInput = styled.input`
  width: 100%; padding: 12px; border: 2px solid ${(p)=>p.theme.colors.border}; border-radius: 12px; font-size: 16px;
  &:focus{ border-color: ${(p)=>p.theme.colors.accent}; box-shadow: 0 0 0 3px rgba(56,182,255,0.18); outline:none; }
`;

const RatingBar = styled.div`
  display:flex; gap:18px; align-items:center; margin-top: 14px; color:${(p)=>p.theme.colors.textMuted};
  .score{ font-weight:900; color:${(p)=>p.theme.colors.text}; }
`;

const KnownFor = styled.div`
  display:flex; flex-wrap:wrap; gap:12px; align-items:center; margin-top: 12px; color:${(p)=>p.theme.colors.textMuted};
  .chip{ border:1px solid ${(p)=>p.theme.colors.border}; padding:6px 10px; border-radius: 999px; font-weight:700; font-size:12px; }
`;

const UtilityBar = styled.div`
  display:flex; flex-wrap:wrap; gap:14px; align-items:center; margin-top: 12px;
  color:${(p)=>p.theme.colors.textMuted}; font-weight:700; font-size:12px;
`;

const SectionHead = styled.div`
  display:flex; align-items:flex-end; justify-content:space-between; gap:16px; margin-bottom: 8px;
`;

const SectionTitle = styled.h2`
  margin:0; font-size:30px; font-weight:900; letter-spacing:-0.02em; color:${(p)=>p.theme.colors.text};
`;

const AccentBar = styled.div`
  height: 4px; width: 64px; border-radius: 999px; background: linear-gradient(90deg, #38b6ff, #2196f3);
`;

const Features = styled.div`
  margin-top: 18px;
`;

const FeatureList = styled.div`
  display: grid; grid-template-columns: 1fr; gap: 14px;
  @media (min-width: 900px){ grid-template-columns: 1fr 1fr; }
`;

const FeatureItem = styled.div<{ $accent?: string }>`
  position: relative; padding: 18px 18px 18px 16px; border-radius: 14px;
  background: ${(p)=>p.theme.mode==='dark' ? 'rgba(255,255,255,0.03)' : '#ffffff'};
  border: 1px solid ${(p)=>p.$accent ? p.$accent+'33' : p.theme.colors.border};
  box-shadow: 0 10px 28px rgba(0,0,0,0.05);
  display:flex; gap: 12px; align-items:flex-start;
  &::before{ content:''; position:absolute; left:0; top:12px; bottom:12px; width:4px; border-radius: 999px; background: ${(p)=>p.$accent || '#38b6ff'}; }
`;

const FeatureIconCircle = styled.div<{ $accent?: string }>`
  width: 44px; height: 44px; border-radius: 12px; display:flex; align-items:center; justify-content:center;
  background: ${(p)=>p.$accent ? p.$accent+'1A' : 'rgba(56,182,255,0.12)'}; color: ${(p)=>p.$accent || p.theme.colors.accent};
  box-shadow: inset 0 0 0 1px ${(p)=>p.$accent ? p.$accent+'55' : 'rgba(56,182,255,0.3)'};
  font-size: 22px;
`;

const FeatureCard = styled.div<{ $accent?: string }>`
  position: relative;
  background: ${(p)=>p.theme.mode==='dark' ? 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.02) 100%)' : 'linear-gradient(180deg, #ffffff 0%, #fafcff 100%)'};
  border: 1px solid ${(p) => p.$accent ? p.$accent+'33' : p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.lg};
  padding: 20px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.06);
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
  &:hover { transform: translateY(-4px); box-shadow: 0 16px 36px rgba(0,0,0,0.08); border-color: ${(p)=>p.$accent || 'rgba(56,182,255,0.35)'}; }
`;

const FeatureIcon = styled.div<{ $accent?: string }>`
  font-size: 22px; line-height: 1; width: 42px; height: 42px;
  display: inline-flex; align-items: center; justify-content: center;
  border-radius: 12px;
  background: ${(p)=>p.$accent ? p.$accent+'22' : (p.theme.mode==='dark' ? 'rgba(56,182,255,0.18)' : 'rgba(56,182,255,0.14)')};
  color: ${(p)=>p.$accent || p.theme.colors.accent};
  box-shadow: inset 0 0 0 1px ${(p)=>p.$accent ? p.$accent+'55' : 'rgba(56,182,255,0.3)'};
`;

const FeatureTitle = styled.div`
  font-weight: 800; margin-top: 10px; color: ${(p)=>p.theme.colors.text};
`;

const FeatureDesc = styled.p`
  margin: 6px 0 0 0; color: ${(p)=>p.theme.colors.textMuted}; font-size: 14px;
`;

const TimelineWrap = styled.div`
  position: relative; margin-top: 18px; display:grid; grid-template-columns: 1fr; gap:16px;
`;

const TL = styled.div`
  position: relative; margin-left: 8px; padding-left: 26px;
  &::before{ content:''; position:absolute; left:14px; top:0; bottom:0; width:2px; background: ${(p)=>p.theme.colors.border}; border-radius: 2px; }
`;

const TLItem = styled.div<{ $accent?: string }>`
  position: relative; margin: 0 0 6px 0; padding: 12px 14px; background: ${(p)=>p.theme.colors.panel}; border:1px solid ${(p)=>p.$accent ? p.$accent+'33' : p.theme.colors.border}; border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.05);
`;

const TLDot = styled.div<{ $accent?: string }>`
  position: absolute; left: -26px; top: 16px; width: 18px; height: 18px; border-radius: 999px; background: ${(p)=>p.$accent || p.theme.colors.accent}; box-shadow: 0 6px 14px rgba(56,182,255,0.25);
`;

const TLHead = styled.div`
  font-weight: 900; color:${(p)=>p.theme.colors.text}; margin-bottom: 4px; display:flex; align-items:center; gap:8px;
`;

const TLNum = styled.span`
  display:inline-flex; width: 26px; height:26px; border-radius: 999px; background: ${(p)=>p.theme.colors.accent}; color:#fff; font-weight:900; align-items:center; justify-content:center;
`;

const TLBody = styled.div`
  color:${(p)=>p.theme.colors.textMuted}; font-size:14px;
`;

const CitiesBar = styled.div`
  display: flex; gap: 10px; flex-wrap: wrap; margin-top: 12px;
  span { background:#eef2f7; color:#334155; padding:6px 10px; border-radius: 999px; font-weight:700; font-size:12px; }
`;

const TrustBar = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px; margin-top: 18px;
  div { background: ${(p)=>p.theme.colors.panel}; border:1px solid ${(p)=>p.theme.colors.border}; border-radius: 12px; padding: 10px 12px; font-weight:700; color:${(p)=>p.theme.colors.text}; }
`;

const FAQ = styled.div`
  display: grid; gap: 12px; margin-top: 16px;
`;

const QA = styled.div`
  background: ${(p)=>p.theme.colors.panel}; border:1px solid ${(p)=>p.theme.colors.border}; border-radius: 12px; padding: 14px;
  summary { cursor: pointer; font-weight: 800; color: ${(p)=>p.theme.colors.text}; }
  p { color: ${(p)=>p.theme.colors.textMuted}; margin-top: 8px; }
`;

const CompareGrid = styled.div`
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; margin-top: 10px;
  @media (max-width: 968px){ grid-template-columns: 1fr; }
`;

const CompareCol = styled.div`
  background: ${(p)=>p.theme.colors.panel}; border:1px solid ${(p)=>p.theme.colors.border}; border-radius: ${(p)=>p.theme.radii.lg};
  padding: 18px 18px 20px; box-shadow: 0 6px 18px rgba(0,0,0,0.04);
`;

const CompareTitle = styled.div`
  font-weight: 900; margin-bottom: 10px; color:${(p)=>p.theme.colors.text};
`;

const CompareList = styled.ul`
  margin: 0; padding-left: 18px; color:${(p)=>p.theme.colors.textMuted};
  li { margin: 6px 0; }
`;

const RentbirdHome: React.FC = () => {
  const navigate = useNavigate();
  // Slideshow images (behoud bestaande afbeeldingen)
  const images = React.useMemo(
    () => [
      '/images/slideshow/start.jpg',
      '/images/slideshow/slide2.jpg',
      '/images/slideshow/slide3.jpg',
      '/images/slideshow/slide4.jpg',
      '/images/slideshow/slide5.jpg',
    ],
    []
  );
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), 3500);
    return () => clearInterval(t);
  }, [images.length]);

  // Homepage bevat geen pricing preview; prijzen staan op de abonnementpagina

  // Steden dropdown + registratie modal
  const [cities, setCities] = React.useState<string[]>([]);
  const [cityQuery, setCityQuery] = React.useState('');
  const [showDrop, setShowDrop] = React.useState(false);
  const [showReg, setShowReg] = React.useState(false);
  const [chosenCity, setChosenCity] = React.useState<string>('');
  const [email, setEmail] = React.useState('');
  const dropRef = React.useRef<HTMLDivElement>(null);
  const featuredCities = React.useMemo(()=>[
    'Amsterdam','Rotterdam','Utrecht','Den Haag','Eindhoven','Haarlem','Groningen','Leiden'
  ],[]);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/properties/cities');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.cities)) setCities(data.cities.map((c:any)=>c.name));
        }
      } catch {}
    })();
  }, []);

  const filtered = React.useMemo(() => {
    const q = cityQuery.trim().toLowerCase();
    if (!q) return cities.length ? cities : [
      'Amsterdam','Rotterdam','Utrecht','Den Haag','Eindhoven','Haarlem','Groningen','Leiden','Zwolle','Nijmegen'
    ];
    return cities.filter(c => c.toLowerCase().includes(q));
  }, [cities, cityQuery]);

  // Close dropdown on outside click or ESC
  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const node = dropRef.current; if (!node) return;
      if (!node.contains(e.target as Node)) setShowDrop(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setShowDrop(false); setShowReg(false); }
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDocClick); document.removeEventListener('keydown', onKey); };
  }, []);

  return (
    <>
      <Section>
        <Container>
          <Hero>
            <div>
              <Title>
                Krijg als eerste passende huurwoningen <span className="accent">in je inbox</span>
              </Title>
              <Subtitle>We scannen 24/7 alle huursites en matchen elke nieuwe woning direct met jouw voorkeuren. Zo ben jij als eerste op de hoogte.</Subtitle>
              {/* Hero CTA buttons verwijderd op verzoek */}
              <UtilityBar>
                <span>Niet tevreden? Binnen 14 dagen je geld terug</span>
                <span>Complete AI‑zoekhulp voor huurwoningen</span>
                <span>★ 4,6 — gewaardeerd door 1.786 gebruikers</span>
              </UtilityBar>
              <SearchWrap>
                <SearchLabel htmlFor="home-city">Waar wil je wonen?</SearchLabel>
                <SearchRow>
                  <SearchFrame ref={dropRef as any}>
                    <SearchInner>
                      <SearchIcon>🔎</SearchIcon>
                      <Dropdown style={{ flex: 1 }}>
                        <SearchInput
                          id="home-city"
                          placeholder="Zoek op plaatsnaam"
                          value={cityQuery}
                          onFocus={() => setShowDrop(true)}
                          onClick={() => setShowDrop(true)}
                          onChange={(e:any) => { setCityQuery(e.target.value); setShowDrop(true); }}
                          onKeyDown={(e:any)=>{
                            if(e.key==='Enter'){
                              const v=(e.currentTarget as HTMLInputElement).value?.trim();
                              if(v){ setChosenCity(v); setShowDrop(false); setShowReg(true); }
                              e.preventDefault();
                            }
                          }}
                        />
                        {showDrop && (
                          <DropdownList>
                            <DropdownHeader>Populaire steden</DropdownHeader>
                            <ChipRow>
                              {featuredCities.map((c)=>(
                                <Chip key={c} onClick={()=>{ setChosenCity(c); setShowDrop(false); setShowReg(true); }}>{c}</Chip>
                              ))}
                            </ChipRow>
                            <DropdownHeader>Alle steden</DropdownHeader>
                            {filtered.map((c) => (
                              <DropdownItem key={c}
                                onClick={() => { setChosenCity(c); setShowDrop(false); setShowReg(true); }}
                              >
                                <span>📍</span> {c}
                              </DropdownItem>
                            ))}
                          </DropdownList>
                        )}
                      </Dropdown>
                    </SearchInner>
                  </SearchFrame>
                  <SearchSubmit onClick={()=>{ const v=cityQuery.trim(); if(v){ setChosenCity(v); setShowReg(true); } }}>Zoeken</SearchSubmit>
                </SearchRow>
              </SearchWrap>
              {/* Optional chips/ratings removed per request */}
            </div>
            <div>
              <Slideshow $img={images[idx]} />
            </div>
          </Hero>
        </Container>
      </Section>

      <AltSection>
        <Container>
          <SectionHead>
            <SectionTitle>Waarom Fyxed Wonen</SectionTitle>
            <AccentBar />
          </SectionHead>
          <Features>
            <FeatureList>
              <FeatureItem $accent="#38b6ff">
                <FeatureIconCircle $accent="#38b6ff">✨</FeatureIconCircle>
                <div>
                  <FeatureTitle>Transparante matches</FeatureTitle>
                  <FeatureDesc>Heldere scores met redenen, zodat je meteen ziet waarom een woning past.</FeatureDesc>
                </div>
              </FeatureItem>
              <FeatureItem $accent="#10b981">
                <FeatureIconCircle $accent="#10b981">📬</FeatureIconCircle>
                <div>
                  <FeatureTitle>Directe alerts</FeatureTitle>
                  <FeatureDesc>Nieuwe passende woningen gelijk in je inbox, zonder te hoeven zoeken.</FeatureDesc>
                </div>
              </FeatureItem>
              <FeatureItem $accent="#f59e0b">
                <FeatureIconCircle $accent="#f59e0b">🗂️</FeatureIconCircle>
                <div>
                  <FeatureTitle>Alles bij elkaar</FeatureTitle>
                  <FeatureDesc>Alle relevante woningen overzichtelijk op één plek — wel zo rustig.</FeatureDesc>
                </div>
              </FeatureItem>
              <FeatureItem $accent="#a78bfa">
                <FeatureIconCircle $accent="#a78bfa">🕐</FeatureIconCircle>
                <div>
                  <FeatureTitle>Doorlopend scannen</FeatureTitle>
                  <FeatureDesc>We scannen 24/7 en doseren slim — snel op de hoogte, nooit overspoeld.</FeatureDesc>
                </div>
              </FeatureItem>
            </FeatureList>
          </Features>
        </Container>
      </AltSection>

      {showReg && (
        <OnboardingModal
          open={showReg}
          onClose={()=>setShowReg(false)}
          initialCity={chosenCity}
          onComplete={()=>{
            // Zet een standaardplan klaar zodat de registratieflow doorloopt
            try {
              const defaultPlan = {
                planId: 'basic',
                planName: 'Premium Basic',
                price: 26.95,
                tier: '1_month',
              };
              localStorage.setItem('selectedPlan', JSON.stringify(defaultPlan));
            } catch {}
            setShowReg(false);
            navigate('/register-form');
          }}
        />
      )}

      <SubtleSection>
        <Container>
          <SectionHead>
            <SectionTitle>Hoe het werkt</SectionTitle>
            <AccentBar />
          </SectionHead>
          <TimelineWrap>
            <TL>
              <TLItem $accent="#38b6ff">
                <TLDot $accent="#38b6ff" />
                <TLHead><TLNum>1</TLNum> Kies je toegang</TLHead>
                <TLBody>Kies een periode die bij je past. Je regelt alles in je account.</TLBody>
              </TLItem>
              <TLItem $accent="#10b981">
                <TLDot $accent="#10b981" />
                <TLHead><TLNum>2</TLNum> Voorkeuren instellen</TLHead>
                <TLBody>Selecteer steden, budget en m². Wij doen de rest.</TLBody>
              </TLItem>
              <TLItem $accent="#f59e0b">
                <TLDot $accent="#f59e0b" />
                <TLHead><TLNum>3</TLNum> 24/7 scannen</TLHead>
                <TLBody>We scannen doorlopend en matchen nieuwe woningen direct met jouw profiel.</TLBody>
              </TLItem>
              <TLItem $accent="#a78bfa">
                <TLDot $accent="#a78bfa" />
                <TLHead><TLNum>4</TLNum> Reageer meteen</TLHead>
                <TLBody>Je ontvangt directe e‑mailalerts en ziet alles bij “Matches”.</TLBody>
              </TLItem>
            </TL>
          </TimelineWrap>
        </Container>
      </SubtleSection>

      <Section>
        <Container>
          <Title style={{fontSize:28, marginBottom:16}}>Blijf een stap voor op traditioneel zoeken</Title>
          <CompareGrid>
            <CompareCol>
              <CompareTitle>Handmatig zoeken</CompareTitle>
              <CompareList>
                <li>Dagelijks dezelfde 3–5 sites afspeuren</li>
                <li>Kostbare tijd kwijt aan eindeloos zoeken</li>
                <li>Nieuwe woningen vaak pas veel later gezien</li>
                <li>Late reactie → minder kans op bezichtiging</li>
                <li>Maandenlange stress en onzekerheid</li>
              </CompareList>
            </CompareCol>
            <CompareCol>
              <CompareTitle>Zoeken met Fyxed</CompareTitle>
              <CompareList>
                <li>Onze zoekbot scant continu alle huursites</li>
                <li>Jij checkt alerts en reageert doelgericht</li>
                <li>Nieuwe matches vaak binnen seconden</li>
                <li>Meer bezichtigingen met minder moeite</li>
                <li>Weken i.p.v. maanden naar jouw woning</li>
              </CompareList>
            </CompareCol>
          </CompareGrid>
        </Container>
      </Section>

      <Section>
        <Container>
          <Title style={{fontSize:28, marginBottom:16}}>Veelgestelde vragen</Title>
          <FAQ>
            <QA as="details">
              <summary>Hoe vaak matchen jullie nieuwe woningen?</summary>
              <p>We scannen continu en matchen nieuwe woningen direct op jouw voorkeuren. Je krijgt meteen een e‑mail als er iets relevants binnenkomt.</p>
            </QA>
            <QA as="details">
              <summary>Welke sites scannen jullie?</summary>
              <p>We monitoren de belangrijkste huursites in Nederland. Alles komt samen in één overzicht zodat jij niets mist.</p>
            </QA>
            <QA as="details">
              <summary>Heb ik een abonnement nodig om matches te zien?</summary>
              <p>Ja, matches zijn onderdeel van onze betaalde service. Je kunt je abonnement maandelijks regelen vanuit je account.</p>
            </QA>
          </FAQ>
        </Container>
      </Section>

      {/* CTA-sectie met 'Start vandaag' verwijderd op verzoek */}
    </>
  );
};

export default RentbirdHome;
