import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { preferencesApi } from '../services/api';

const PageContainer = styled.div`
  min-height: 100vh;
  background: #eef2f7;
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: white;
  padding: 60px 20px 80px;
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 16px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 20px;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
  color: #cbd5e1;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const Container = styled.div`
  max-width: 1000px;
  margin: -40px auto 0;
  padding: 0 20px 60px;
  position: relative;
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  letter-spacing: -0.01em;
`;

const SectionDescription = styled.p`
  color: #64748b;
  margin-bottom: 24px;
  font-size: 16px;
  line-height: 1.6;
`;

const Section = styled.div`
  margin-bottom: 40px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 2px solid #f1f5f9;
  margin: 40px 0;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 14px 16px 14px 44px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
  background: white;
  margin-bottom: 16px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #38b6ff;
    box-shadow: 0 0 0 3px rgba(56, 182, 255, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const SearchWrapper = styled.div`
  position: relative;

  &::before {
    content: '🔍';
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 18px;
    pointer-events: none;
  }
`;

const CityGridContainer = styled.div`
  max-height: 240px;
  overflow-y: auto;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  background: #f8fafc;
  margin-bottom: 16px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #e5e7eb;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #94a3b8;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #64748b;
  }
`;

const CityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
`;

const CityChip = styled.button<{ selected: boolean }>`
  background: ${p => p.selected ? 'linear-gradient(135deg, #38b6ff 0%, #667eea 100%)' : '#f8fafc'};
  color: ${p => p.selected ? 'white' : '#475569'};
  border: 2px solid ${p => p.selected ? '#38b6ff' : '#e2e8f0'};
  border-radius: 12px;
  padding: 12px 16px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(56, 182, 255, 0.2);
    border-color: #38b6ff;
  }

  &::before {
    content: '${p => p.selected ? '✓' : '+'}';
    font-size: 16px;
    font-weight: 900;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 700;
  color: #0f172a;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Input = styled.input`
  padding: 14px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
  transition: all 0.2s ease;
  background: #f8fafc;

  &:focus {
    outline: none;
    border-color: #38b6ff;
    background: white;
    box-shadow: 0 0 0 3px rgba(56, 182, 255, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const Select = styled.select`
  padding: 14px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
  transition: all 0.2s ease;
  background: #f8fafc;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #38b6ff;
    background: white;
    box-shadow: 0 0 0 3px rgba(56, 182, 255, 0.1);
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  color: #475569;
  transition: all 0.2s ease;

  &:hover {
    background: white;
    border-color: #38b6ff;
  }

  input[type="checkbox"] {
    width: 20px;
    height: 20px;
    cursor: pointer;
    accent-color: #38b6ff;
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #38b6ff 0%, #667eea 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 32px;
  font-size: 18px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px rgba(56, 182, 255, 0.3);
  width: 100%;
  margin-top: 20px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(56, 182, 255, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SuccessMessage = styled.div`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 16px 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);

  &::before {
    content: '✓';
    font-size: 24px;
    font-weight: 900;
  }
`;

const LoadingSkeleton = styled.div<{ h: number }>`
  height: ${p => p.h}px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 12px;

  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

const FeatureHighlight = styled.div`
  background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%);
  border: 2px solid #dbeafe;
  border-radius: 16px;
  padding: 20px;
  margin-top: 24px;
  display: flex;
  align-items: start;
  gap: 16px;
`;

const HighlightIcon = styled.div`
  font-size: 32px;
  flex-shrink: 0;
`;

const HighlightContent = styled.div`
  flex: 1;
`;

const HighlightTitle = styled.h3`
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 8px 0;
`;

const HighlightText = styled.p`
  color: #475569;
  margin: 0;
  line-height: 1.6;
  font-size: 15px;
`;

// Using shared components

const defaultCities = [
  'Amsterdam','Rotterdam','Utrecht','Den Haag','Eindhoven','Tilburg','Groningen','Almere',
  'Breda','Nijmegen','Enschede','Haarlem','Arnhem','Zaanstad','Amersfoort','Apeldoorn',
  'Haarlemmermeer','Zoetermeer','Zwolle','Leiden','Maastricht','Dordrecht','Ede','Westland',
  'Leeuwarden','Alphen aan den Rijn','Alkmaar','Emmen','Delft','Venlo'
];

const Voorkeuren: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [cities, setCities] = useState<string[]>(defaultCities);
  const [citySearch, setCitySearch] = useState('');
  const [form, setForm] = useState<any>({
    cities: [],
    minPrice: 0,
    maxPrice: 3000,
    minRooms: 1,
    minSize: 0,
    maxSize: 500,
    furnished: 'both',
    petsAllowed: false,
    garden: false,
    balcony: false,
    parking: false,
  });

  useEffect(() => {
    const load = async () => {
      try {
        // laad stedenlijst uit backend (valt terug op default)
        try {
          const res = await fetch('/api/preferences/cities');
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data.cities)) setCities(data.cities);
          }
        } catch (_) {}
        const { preferences } = await preferencesApi.get();
        setForm({ ...form, ...preferences });
        try { localStorage.setItem('preferencesCache', JSON.stringify(preferences)); } catch {}
      } catch (e) {
        // fallback to cache if available
        try {
          const raw = localStorage.getItem('preferencesCache');
          if (raw) {
            const cached = JSON.parse(raw);
            setForm((f:any)=>({ ...f, ...cached }));
          }
        } catch {}
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (name: string, value: any) => setForm((f: any) => ({ ...f, [name]: value }));

  const selectCity = (city: string) => {
    // Alleen 1 stad selecteren (radio button gedrag)
    const current = form.cities || [];
    if (current.includes(city)) {
      // Als dezelfde stad nogmaals geklikt wordt, deselecteren
      update('cities', []);
    } else {
      // Selecteer alleen deze stad
      update('cities', [city]);
    }
  };

  // Filter steden op basis van zoekopdracht
  const filteredCities = cities.filter(city =>
    city.toLowerCase().includes(citySearch.toLowerCase())
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await preferencesApi.save(form);
      try { localStorage.setItem('preferencesCache', JSON.stringify(form)); } catch {}
      setMessage('Voorkeuren succesvol opgeslagen!');
      // Redirect naar dashboard na 1 seconde
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (e: any) {
      setMessage(e?.response?.data?.error || 'Opslaan mislukt. Probeer het opnieuw.');
      setSaving(false);
    }
  };

  if (loading) return (
    <PageContainer>
      <HeroSection>
        <HeroTitle>Woonvoorkeuren</HeroTitle>
        <HeroSubtitle>Je voorkeuren worden geladen...</HeroSubtitle>
      </HeroSection>
      <Container>
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <LoadingSkeleton h={120} />
            <LoadingSkeleton h={80} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <LoadingSkeleton h={60} />
              <LoadingSkeleton h={60} />
              <LoadingSkeleton h={60} />
              <LoadingSkeleton h={60} />
            </div>
            <LoadingSkeleton h={60} />
          </div>
        </Card>
      </Container>
    </PageContainer>
  );

  return (
    <PageContainer>
      <HeroSection>
        <HeroTitle>Stel je woonvoorkeuren in</HeroTitle>
        <HeroSubtitle>
          Personaliseer je zoektocht en ontvang alleen matches die perfect bij je passen
        </HeroSubtitle>
      </HeroSection>

      <Container>
        <Card>
          {message && <SuccessMessage>{message}</SuccessMessage>}

          <form onSubmit={submit}>
            <Section>
              <SectionTitle>
                <span>📍</span>
                Waar wil je wonen?
              </SectionTitle>
              <SectionDescription>
                Selecteer de stad waar je zoekt. Gebruik de zoekbalk om snel je stad te vinden.
              </SectionDescription>
              <SearchWrapper>
                <SearchInput
                  type="text"
                  placeholder="Zoek een stad..."
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                />
              </SearchWrapper>
              <CityGridContainer>
                <CityGrid>
                  {filteredCities.length > 0 ? (
                    filteredCities.map((city) => (
                      <CityChip
                        key={city}
                        type="button"
                        selected={form.cities?.includes(city) || false}
                        onClick={() => selectCity(city)}
                      >
                        {city}
                      </CityChip>
                    ))
                  ) : (
                    <div style={{ gridColumn: '1 / -1', color: '#64748b', textAlign: 'center', padding: '20px' }}>
                      Geen steden gevonden voor "{citySearch}"
                    </div>
                  )}
                </CityGrid>
              </CityGridContainer>
              {form.cities?.length > 0 && (
                <div style={{ color: '#38b6ff', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>✓</span>
                  <span>Geselecteerd: {form.cities[0]}</span>
                </div>
              )}
            </Section>

            <Divider />

            <Section>
              <SectionTitle>
                <span>💰</span>
                Budget & Ruimte
              </SectionTitle>
              <SectionDescription>
                Stel je budget en gewenste woninggrootte in
              </SectionDescription>
              <Grid>
                <InputGroup>
                  <Label>
                    <span>💶</span>
                    Minimale huurprijs
                  </Label>
                  <Input
                    type="number"
                    value={form.minPrice}
                    onChange={(e) => update('minPrice', Number(e.target.value))}
                    placeholder="Bijv. 500"
                  />
                </InputGroup>
                <InputGroup>
                  <Label>
                    <span>💳</span>
                    Maximale huurprijs
                  </Label>
                  <Input
                    type="number"
                    value={form.maxPrice}
                    onChange={(e) => update('maxPrice', Number(e.target.value))}
                    placeholder="Bijv. 1500"
                  />
                </InputGroup>
                <InputGroup>
                  <Label>
                    <span>🛏️</span>
                    Minimum aantal kamers
                  </Label>
                  <Input
                    type="number"
                    value={form.minRooms}
                    onChange={(e) => update('minRooms', Number(e.target.value))}
                    placeholder="Bijv. 2"
                  />
                </InputGroup>
                <InputGroup>
                  <Label>
                    <span>📐</span>
                    Minimum oppervlakte (m²)
                  </Label>
                  <Input
                    type="number"
                    value={form.minSize}
                    onChange={(e) => update('minSize', Number(e.target.value))}
                    placeholder="Bijv. 40"
                  />
                </InputGroup>
                <InputGroup>
                  <Label>
                    <span>📏</span>
                    Maximum oppervlakte (m²)
                  </Label>
                  <Input
                    type="number"
                    value={form.maxSize}
                    onChange={(e) => update('maxSize', Number(e.target.value))}
                    placeholder="Bijv. 150"
                  />
                </InputGroup>
                <InputGroup>
                  <Label>
                    <span>🪑</span>
                    Gemeubileerd
                  </Label>
                  <Select value={form.furnished} onChange={(e) => update('furnished', e.target.value)}>
                    <option value="both">Maakt niet uit</option>
                    <option value="yes">Ja, gemeubileerd</option>
                    <option value="no">Nee, ongemeubileerd</option>
                  </Select>
                </InputGroup>
              </Grid>
            </Section>

            <Divider />

            <Section>
              <SectionTitle>
                <span>🎯</span>
                Extra Voorkeuren
              </SectionTitle>
              <SectionDescription>
                Geef aanvullende wensen aan voor je ideale woning
              </SectionDescription>
              <div style={{ display: 'grid', gap: '12px' }}>
                <CheckboxLabel>
                  <input
                    type="checkbox"
                    checked={!!form.petsAllowed}
                    onChange={(e) => update('petsAllowed', e.target.checked)}
                  />
                  <span>🐕 Huisdieren toegestaan</span>
                </CheckboxLabel>
                <CheckboxLabel>
                  <input
                    type="checkbox"
                    checked={!!form.garden}
                    onChange={(e) => update('garden', e.target.checked)}
                  />
                  <span>🌳 Tuin</span>
                </CheckboxLabel>
                <CheckboxLabel>
                  <input
                    type="checkbox"
                    checked={!!form.balcony}
                    onChange={(e) => update('balcony', e.target.checked)}
                  />
                  <span>🏡 Balkon</span>
                </CheckboxLabel>
                <CheckboxLabel>
                  <input
                    type="checkbox"
                    checked={!!form.parking}
                    onChange={(e) => update('parking', e.target.checked)}
                  />
                  <span>🅿️ Parkeerplaats</span>
                </CheckboxLabel>
              </div>
            </Section>

            <Button type="submit" disabled={saving}>
              {saving ? '⏳ Bezig met opslaan...' : '✓ Voorkeuren Opslaan'}
            </Button>
          </form>

          <FeatureHighlight>
            <HighlightIcon>💡</HighlightIcon>
            <HighlightContent>
              <HighlightTitle>Hoe werkt het?</HighlightTitle>
              <HighlightText>
                Zodra je voorkeuren opslaat, scannen we 24/7 automatisch alle beschikbare woningen.
                Wanneer een nieuwe woning matcht met je criteria, krijg je direct een notificatie via e-mail.
                Zo reageer je als eerste en vergroot je je kans op een bezichtiging!
              </HighlightText>
            </HighlightContent>
          </FeatureHighlight>
        </Card>
      </Container>
    </PageContainer>
  );
};

export default Voorkeuren;
