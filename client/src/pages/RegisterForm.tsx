import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { userApi } from '../services/api';

const PageContainer = styled.div`
  min-height: 100vh;
  background: #eef2f7;
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: white;
  padding: 40px 20px 60px;
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: 42px;
  font-weight: 800;
  margin-bottom: 12px;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 18px;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto 16px;
  line-height: 1.6;
  color: #cbd5e1;
`;

const StepIndicator = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 700;
  backdrop-filter: blur(10px);
`;

const Container = styled.div`
  max-width: 1000px;
  margin: -30px auto 0;
  padding: 0 20px 60px;
  position: relative;
`;

const RegisterCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  animation: slideUp 0.5s ease-out;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const Logo = styled.div`
  display: none;
`;

const LogoText = styled.h1`
  display: none;
`;

const Title = styled.h2`
  display: none;
`;

const TopContext = styled.div`
  display: grid; gap: 10px; margin-bottom: 12px; text-align: center;
`;

const StatBar = styled.div`
  display:flex; align-items:center; justify-content:center; gap:10px; color:#475569;
  .score{font-weight:900; color:#0f172a;}
`;

const QuerySummary = styled.div`
  background:#f8fafc; border:1px solid #e5e7eb; border-radius:12px; padding:12px; color:#334155;
`;

const SelectedPlanInfo = styled.div`
  background: linear-gradient(135deg, #dcfce7 0%, #d1fae5 100%);
  border: 2px solid #86efac;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);
`;

const PlanName = styled.div`
  font-weight: 800;
  color: #065f46;
  margin-bottom: 8px;
  font-size: 16px;
`;

const PlanPrice = styled.div`
  font-size: 28px;
  font-weight: 900;
  color: #0f172a;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 20px;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const Side = styled.div``;

const SideCard = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #f0f9ff 100%);
  border: 2px solid #dbeafe;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const HelpText = styled.div`
  color: #64748b;
  font-size: 13px;
  font-weight: 600;
`;

const StrengthWrap = styled.div`
  display:flex; align-items:center; gap:8px; font-size:12px; color:#64748b;
`;

const StrengthBar = styled.div<{ level: 0 | 1 | 2 | 3 }>`
  height: 6px; border-radius: 999px; background:#e5e7eb; overflow:hidden; position:relative;
  &::after{ content:''; position:absolute; inset:0; width:${(p)=>({0:'0%',1:'33%',2:'66%',3:'100%'})[p.level]};
    background:${(p)=>({0:'#e5e7eb',1:'#f59e0b',2:'#38b6ff',3:'#16a34a'})[p.level]}; border-radius:999px; transition: width .2s ease; }
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
  color: #0f172a;
  font-size: 15px;
  font-weight: 700;
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
  background: #f8fafc;
  transition: all 0.2s ease;

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

const RegisterButton = styled.button`
  background: linear-gradient(135deg, #38b6ff 0%, #667eea 100%);
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
  box-shadow: 0 4px 14px rgba(56, 182, 255, 0.3);
  width: 100%;

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

const ErrorMessage = styled.div`
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #991b1b;
  font-size: 14px;
  text-align: center;
  margin-top: 16px;
  padding: 14px 18px;
  border-radius: 12px;
  font-weight: 700;
  border: 2px solid #fca5a5;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &::before {
    content: '⚠️';
    font-size: 18px;
  }
`;

const SuccessMessage = styled.div`
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
  font-size: 14px;
  text-align: center;
  margin-top: 16px;
  padding: 14px 18px;
  border-radius: 12px;
  font-weight: 700;
  border: 2px solid #86efac;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &::before {
    content: '✓';
    font-size: 18px;
    font-weight: 900;
  }
`;

const BackButton = styled(Link)`
  color: #6b7280;
  text-decoration: none;
  font-size: 14px;
  text-align: center;
  display: block;
  margin-bottom: 24px;

  &:hover {
    color: #38b6ff;
  }
`;

const TermsText = styled.div`
  font-size: 12px;
  color: #6b7280;
  line-height: 1.4;
  margin-top: 16px;
  text-align: center;

  a {
    color: #38b6ff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 20px;
  padding: 18px;
  background: linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%);
  border-radius: 12px;
  border: 2px solid #dbeafe;
  transition: all 0.2s ease;

  &:hover {
    border-color: #38b6ff;
    box-shadow: 0 4px 12px rgba(56, 182, 255, 0.1);
  }
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  margin: 0;
  margin-top: 2px;
  cursor: pointer;
  accent-color: #38b6ff;
`;

const CheckboxLabel = styled.label`
  font-size: 14px;
  color: #0f172a;
  line-height: 1.5;
  cursor: pointer;
  font-weight: 600;

  a {
    color: #38b6ff;
    text-decoration: none;
    font-weight: 700;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const RegisterForm: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [avgAccepted, setAvgAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (loggedIn) {
      navigate('/dashboard', { replace: true });
      return;
    }
    // Get selected plan from localStorage, or set a sensible default
    const planData = localStorage.getItem('selectedPlan');
    if (planData) {
      setSelectedPlan(JSON.parse(planData));
    } else {
      const fallback = {
        planId: 'basic',
        planName: 'Premium Basic',
        price: 26.95,
        tier: '1_month',
      };
      localStorage.setItem('selectedPlan', JSON.stringify(fallback));
      setSelectedPlan(fallback);
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Basic validation
    if (!avgAccepted) {
      setError('Je moet akkoord gaan met de Algemene Voorwaarden en het Privacybeleid');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Wachtwoorden komen niet overeen');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Wachtwoord moet minimaal 6 tekens bevatten');
      setLoading(false);
      return;
    }

    try {
      const data = await userApi.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });

      setSuccess('Account succesvol aangemaakt! Je wordt doorgestuurd naar de betaalpagina...');

      // Store user data temporarily for payment
      localStorage.setItem('tempUserData', JSON.stringify({
        ...formData,
        selectedPlan
      }));

      // Store auth token
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('token', data.token); // ensure axios interceptor picks it up
      if (!localStorage.getItem('signup_ts')) {
        try { localStorage.setItem('signup_ts', String(Date.now())); } catch {}
      }

      // Redirect to payment page after 2 seconds
      setTimeout(() => {
        navigate('/payment');
      }, 2000);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Er is een fout opgetreden bij het registreren';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedPlan) {
    return null;
  }

  return (
    <PageContainer>
      <HeroSection>
        <StepIndicator>
          <span>📝</span>
          <span>Stap 2/3 • Registratie</span>
        </StepIndicator>
        <HeroTitle>Maak je account aan</HeroTitle>
        <HeroSubtitle>
          Nog één stap en je krijgt automatisch matches in je inbox!
        </HeroSubtitle>
        <div style={{display:'flex', justifyContent:'center', gap:12, marginTop:16}}>
          <div style={{display:'inline-flex', alignItems:'center', gap:6, padding:'6px 12px', background:'rgba(255,255,255,0.1)', borderRadius:8, fontSize:14, fontWeight:700}}>
            <span>⭐</span>
            <span>4,6 • 1.786 reviews</span>
          </div>
          {selectedPlan && (
            <div style={{display:'inline-flex', alignItems:'center', gap:6, padding:'6px 12px', background:'rgba(56,182,255,0.2)', borderRadius:8, fontSize:14, fontWeight:700}}>
              <span>{selectedPlan.planName}</span>
              <span>•</span>
              <span>€{selectedPlan.price.toFixed(2)}</span>
            </div>
          )}
        </div>
      </HeroSection>

      <Container>
        <RegisterCard>
          <ContentGrid>
            <div>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="firstName">Voornaam</Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Je voornaam"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="lastName">Achternaam</Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Je achternaam"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="email">E-mailadres</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="je@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="phone">Telefoonnummer</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="06 12345678"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">Wachtwoord</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Minimaal 6 tekens"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {(() => {
              const p = formData.password;
              const lengthScore = p.length >= 12 ? 2 : p.length >= 8 ? 1 : p.length > 0 ? 0 : 0;
              const variety = /[A-Z]/.test(p) && /[0-9]/.test(p) && /[^A-Za-z0-9]/.test(p);
              const level = (p.length === 0 ? 0 : (variety ? (lengthScore + 1) : lengthScore)) as 0|1|2|3;
              const label = ['','Zwak','Oké','Sterk'][level];
              return (
                <StrengthWrap>
                  <StrengthBar level={level} style={{flex:1}} />
                  <span>{label}</span>
                </StrengthWrap>
              );
            })()}
          </InputGroup>

          <InputGroup>
            <Label htmlFor="confirmPassword">Bevestig wachtwoord</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Herhaal je wachtwoord"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              id="avgAccepted"
              checked={avgAccepted}
              onChange={(e) => setAvgAccepted(e.target.checked)}
              required
            />
            <CheckboxLabel htmlFor="avgAccepted">
              Ik ga akkoord met de{' '}
              <a href="/terms" target="_blank" rel="noopener noreferrer">
                Algemene Voorwaarden
              </a>{' '}
              en het{' '}
              <a href="/privacy" target="_blank" rel="noopener noreferrer">
                Privacybeleid
              </a>
              .
            </CheckboxLabel>
          </CheckboxContainer>

          <RegisterButton type="submit" disabled={loading || !avgAccepted}>
            {loading ? 'Registreren...' : `Doorgaan naar betaling`}
          </RegisterButton>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
        </Form>
          </div>
          <Side>
            {selectedPlan && (
              <SelectedPlanInfo>
                <PlanName>✨ {selectedPlan.planName}</PlanName>
                <PlanPrice>€{selectedPlan.price.toFixed(2)}</PlanPrice>
                <div style={{marginTop:8, color:'#065f46', fontSize:13, fontWeight:700}}>
                  Eenmalige betaling • Geen verborgen kosten
                </div>
              </SelectedPlanInfo>
            )}
            {(() => {
              try {
                const raw = localStorage.getItem('onboardingPrefs');
                if (!raw) return null;
                const ob = JSON.parse(raw);
                const city = ob?.filters?.city || localStorage.getItem('prefCity');
                const est = ob?.estimatePerWeek;
                return (
                  <SideCard style={{marginBottom:20}}>
                    <div style={{fontWeight:800, marginBottom:10, fontSize:16, color:'#0f172a', display:'flex', alignItems:'center', gap:8}}>
                      <span>🎯</span>
                      <span>Jouw zoekopdracht</span>
                    </div>
                    <div style={{fontSize:15, fontWeight:700, color:'#0f172a', marginBottom:4}}>
                      📍 {city || 'Onbekend'}
                    </div>
                    <div style={{color:'#64748b', fontSize:14, fontWeight:600}}>
                      Verwacht ~{est || 20} matches per week
                    </div>
                  </SideCard>
                );
              } catch { return null; }
            })()}
            <SideCard>
              <div style={{display:'grid', gap:14}}>
                <div style={{display:'flex', alignItems:'center', gap:10, fontWeight:700, color:'#0f172a'}}>
                  <span style={{fontSize:20}}>🔒</span>
                  <span>Gegevens veilig en versleuteld</span>
                </div>
                <div style={{display:'flex', alignItems:'center', gap:10, fontWeight:700, color:'#0f172a'}}>
                  <span style={{fontSize:20}}>↩️</span>
                  <span>Binnen 14 dagen geld terug</span>
                </div>
                <div style={{display:'flex', alignItems:'center', gap:10, fontWeight:700, color:'#0f172a'}}>
                  <span style={{fontSize:20}}>⭐</span>
                  <span>4,6 — 1.786 reviews</span>
                </div>
              </div>
            </SideCard>
          </Side>
        </ContentGrid>

        <TermsText>
          Door te registreren ga je akkoord met onze{' '}
          <a href="/terms">Algemene Voorwaarden</a> en{' '}
          <a href="/privacy">Privacybeleid</a>.
        </TermsText>

        <div style={{textAlign:'center', marginTop:24}}>
          <Link to="/" style={{color:'#64748b', textDecoration:'none', fontSize:14, fontWeight:600, transition:'color 0.2s'}}>
            ← Terug naar home
          </Link>
        </div>
      </RegisterCard>
      </Container>
    </PageContainer>
  );
};

export default RegisterForm;
