import React from 'react';
import styled from 'styled-components';

type Step = 1 | 2 | 3;

interface Props {
  open: boolean;
  onClose: () => void;
  initialCity?: string;
  onComplete: () => void;
}

const Overlay = styled.div`
  position: fixed; inset: 0; background: rgba(0,0,0,0.4);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
`;

const Card = styled.div`
  background: #fff; border-radius: 16px; border: 1px solid #e5e7eb; width: 100%; max-width: 720px;
  box-shadow: 0 18px 40px rgba(0,0,0,0.18);
`;

const Head = styled.div`
  padding: 18px 20px; border-bottom: 1px solid #eef2f7; display:flex; align-items:center; justify-content: space-between;
`;

const Title = styled.div`
  font-size: 18px; font-weight: 900; color: #0f172a;
`;

const StepText = styled.div`
  color: #64748b; font-weight: 700; font-size: 14px;
`;

const Body = styled.div`
  padding: 18px 20px; display: grid; gap: 14px;
`;

const Est = styled.div`
  background: #f0f9ff; border: 1px solid #bae6fd; color: #0c4a6e; padding: 10px 12px; border-radius: 10px; font-weight: 700;
`;

const Row = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
  @media (max-width: 640px){ grid-template-columns: 1fr; }
`;

const Field = styled.div`
  display: grid; gap: 6px;
`;

const Label = styled.label`
  font-weight: 700; color: #334155; font-size: 14px;
`;

const Input = styled.input`
  padding: 12px; border: 2px solid #e5e7eb; border-radius: 10px; font-size: 16px; outline: none;
  &:focus{ border-color: #38b6ff; box-shadow: 0 0 0 3px rgba(56, 182, 255, 0.18); }
`;

const Select = styled.select`
  padding: 12px; border: 2px solid #e5e7eb; border-radius: 10px; font-size: 16px; outline: none; background:#fff;
  &:focus{ border-color: #38b6ff; box-shadow: 0 0 0 3px rgba(56, 182, 255, 0.18); }
`;

const Checkbox = styled.label`
  display:flex; align-items:center; gap: 10px; color:#334155; font-weight:600;
  input{ width:18px; height:18px; }
`;

const Foot = styled.div`
  padding: 16px 20px; border-top: 1px solid #eef2f7; display:flex; gap:10px; justify-content:flex-end;
`;

const Btn = styled.button<{variant?: 'primary' | 'ghost'}>`
  border-radius: 10px; padding: 10px 16px; font-weight: 800; border: 2px solid transparent;
  ${(p)=>p.variant==='primary' ? `background:#38b6ff; color:#fff; &:hover{ background:#2196f3; }` : `background:#eef2f7; color:#334155; &:hover{ background:#e5e7eb; }`}
`;

function estimateMatches(filters: any): number {
  // Indicatieve schatting op basis van simpele regels — puur voor UI feedback
  const base = 60;
  const cityBoost = filters.city?.toLowerCase().includes('amsterdam') ? 30 : filters.city ? 15 : 0;
  const price = Number(filters.maxPrice) || 0;
  const priceAdj = price >= 3000 ? 10 : price >= 2000 ? 0 : -10;
  const bedsAdj = (Number(filters.bedrooms) || 0) >= 3 ? -5 : 0;
  const sizeAdj = (Number(filters.minSize) || 0) >= 80 ? -5 : 0;
  const furnishedAdj = filters.furnished && filters.furnished !== 'any' ? -4 : 0;
  let est = base + cityBoost + priceAdj + bedsAdj + sizeAdj + furnishedAdj;
  if (filters.flexPrice) est += 8; // iets ruimer zoeken
  return Math.max(8, Math.round(est));
}

export const OnboardingModal: React.FC<Props> = ({ open, onClose, initialCity, onComplete }) => {
  const [step, setStep] = React.useState<Step>(1);
  const [city, setCity] = React.useState(initialCity || '');
  const [maxPrice, setMaxPrice] = React.useState<number>(2000);
  const [bedrooms, setBedrooms] = React.useState<number>(1);
  const [minSize, setMinSize] = React.useState<number>(0);
  const [furnished, setFurnished] = React.useState<'any'|'ja'|'nee'>('any');
  const [prefs, setPrefs] = React.useState<{[k:string]: boolean}>({
    garden: false,
    balcony: false,
    parking: false,
    petsAllowed: false,
  });

  React.useEffect(()=>{ setCity(initialCity || ''); }, [initialCity]);

  if (!open) return null;

  const filters = { city, maxPrice, bedrooms, minSize, furnished, prefs };
  const est = estimateMatches({ city, maxPrice, bedrooms, minSize, furnished });

  const next = () => setStep((s: Step): Step => (s < 3 ? ((s + 1) as Step) : s));
  const prev = () => setStep((s: Step): Step => (s > 1 ? ((s - 1) as Step) : s));
  const complete = () => {
    // Bewaar selectie voor op registratiepagina
    localStorage.setItem('onboardingPrefs', JSON.stringify({
      filters,
      estimatePerWeek: est,
    }));
    if (city) localStorage.setItem('prefCity', city);
    onComplete();
  };

  return (
    <Overlay onClick={onClose}>
      <Card onClick={(e)=>e.stopPropagation()}>
        <Head>
          <Title>Stel je zoekopdracht in</Title>
          <StepText>Stap {step}/3</StepText>
        </Head>
        <Body>
          <Est>
            Met deze instellingen verwachten we ongeveer <strong>{est}</strong> matches per week
          </Est>

          {step === 1 && (
            <>
              <Field>
                <Label>Waar wil je wonen?</Label>
                <Input value={city} placeholder="Bijv. Amsterdam" onChange={(e)=>setCity(e.target.value)} />
              </Field>
              <Field>
                <Label>Maximale huurprijs</Label>
                <Input type="number" min={0} step={50} value={maxPrice} onChange={(e)=>setMaxPrice(Number(e.target.value)||0)} />
              </Field>
            </>
          )}

          {step === 2 && (
            <>
              <Row>
                <Field>
                  <Label>Slaapkamers (minimum)</Label>
                  <Select value={String(bedrooms)} onChange={(e)=>setBedrooms(Number(e.target.value)||1)}>
                    <option value="0">Ook kamers</option>
                    <option value="1">1 of meer</option>
                    <option value="2">2 of meer</option>
                    <option value="3">3 of meer</option>
                  </Select>
                </Field>
                <Field>
                  <Label>Minimum oppervlakte (m²)</Label>
                  <Input type="number" min={0} step={5} value={minSize} placeholder="Bijv. 50" onChange={(e)=>setMinSize(Number(e.target.value)||0)} />
                </Field>
              </Row>
              <Field>
                <Label>Gemeubileerd</Label>
                <Select value={furnished} onChange={(e)=>setFurnished(e.target.value as any)}>
                  <option value="any">Maakt niet uit</option>
                  <option value="ja">Ja</option>
                  <option value="nee">Nee</option>
                </Select>
              </Field>
            </>
          )}

          {step === 3 && (
            <>
              <Field>
                <Label>Extra voorkeuren (optioneel)</Label>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
                  <Checkbox><input type="checkbox" checked={prefs.garden} onChange={(e)=>setPrefs(p=>({...p, garden: e.target.checked}))}/>Tuin</Checkbox>
                  <Checkbox><input type="checkbox" checked={prefs.balcony} onChange={(e)=>setPrefs(p=>({...p, balcony: e.target.checked}))}/>Balkon</Checkbox>
                  <Checkbox><input type="checkbox" checked={prefs.parking} onChange={(e)=>setPrefs(p=>({...p, parking: e.target.checked}))}/>Parkeerplaats</Checkbox>
                  <Checkbox><input type="checkbox" checked={prefs.petsAllowed} onChange={(e)=>setPrefs(p=>({...p, petsAllowed: e.target.checked}))}/>Huisdieren toegestaan</Checkbox>
                </div>
              </Field>
              <div style={{color:'#64748b', fontSize:13, padding:'10px', background:'#f8fafc', borderRadius:8}}>
                💡 Tip: laat voorkeuren uitgeschakeld om meer resultaten te krijgen. Je kunt je voorkeuren later altijd aanpassen.
              </div>
            </>
          )}
        </Body>
        <Foot>
          <Btn variant="ghost" onClick={onClose}>Sluiten</Btn>
          {step > 1 && <Btn variant="ghost" onClick={prev}>Terug</Btn>}
          {step < 3 ? (
            <Btn variant="primary" onClick={next}>Volgende</Btn>
          ) : (
            <Btn variant="primary" onClick={complete}>Verder</Btn>
          )}
        </Foot>
      </Card>
    </Overlay>
  );
};

export default OnboardingModal;
