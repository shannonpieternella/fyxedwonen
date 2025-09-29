import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const PageContainer = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  padding: 40px 20px;
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Breadcrumb = styled.div`
  margin-bottom: 24px;
  font-size: 14px;
  color: #6b7280;

  a {
    color: #38b6ff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 32px;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #38b6ff, #2196f3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 32px;
  font-weight: 600;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h1`
  color: #1f2937;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const ProfileEmail = styled.div`
  color: #6b7280;
  font-size: 16px;
  margin-bottom: 8px;
`;

const MemberSince = styled.div`
  color: #6b7280;
  font-size: 14px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

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
  color: #374151;
  font-size: 14px;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #38b6ff;
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: #38b6ff;
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  background: white;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #38b6ff;
  }
`;

const SaveButton = styled.button`
  background: #38b6ff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  align-self: flex-start;

  &:hover {
    background: #2196f3;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled.div`
  background: #dcfce7;
  border: 2px solid #16a34a;
  color: #166534;
  padding: 16px 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  font-weight: 600;
  font-size: 16px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.15);
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const SectionTitle = styled.h2`
  color: #1f2937;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PreferencesCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background 0.2s;

  &:hover {
    background: #f9fafb;
  }
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #38b6ff;
`;

const Profile: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    occupation: '',
    income: '',
    bio: '',
    preferredCity: '',
    maxRent: '',
    minRooms: '',
    emailNotifications: true,
    smsNotifications: false,
    weeklyUpdates: true,
    instantAlerts: true
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const paymentCompleted = localStorage.getItem('paymentCompleted') === 'true';

    if (!isLoggedIn || !paymentCompleted) {
      navigate('/login');
      return;
    }

    // Load existing profile data
    const savedProfile = localStorage.getItem('userProfile');
    const userEmail = localStorage.getItem('userEmail');

    if (savedProfile) {
      setFormData({ ...formData, ...JSON.parse(savedProfile) });
    } else if (userEmail) {
      setFormData({ ...formData, email: userEmail });
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save to localStorage (in real app, save to database)
      localStorage.setItem('userProfile', JSON.stringify(formData));

      // Update email in case it changed
      localStorage.setItem('userEmail', formData.email);

      setTimeout(() => {
        setSuccess(true);
        setLoading(false);

        // Hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      }, 1000);
    } catch (error) {
      setLoading(false);
    }
  };

  const getInitials = () => {
    const first = formData.firstName || formData.email.charAt(0);
    const last = formData.lastName || '';
    return (first.charAt(0) + last.charAt(0)).toUpperCase();
  };

  return (
    <PageContainer>
      <Container>
        <Breadcrumb>
          <Link to="/dashboard">Dashboard</Link> / Profiel
        </Breadcrumb>

        <ProfileCard>
          <ProfileHeader>
            <Avatar>{getInitials()}</Avatar>
            <ProfileInfo>
              <ProfileName>
                {formData.firstName || formData.lastName
                  ? `${formData.firstName} ${formData.lastName}`.trim()
                  : formData.email.split('@')[0]
                }
              </ProfileName>
              <ProfileEmail>{formData.email}</ProfileEmail>
              <MemberSince>Lid sinds december 2024</MemberSince>
            </ProfileInfo>
          </ProfileHeader>

          {success && (
            <SuccessMessage>
              ✅ Profiel succesvol bijgewerkt!
            </SuccessMessage>
          )}

          <Form onSubmit={handleSubmit}>
            <SectionTitle>
              👤 Persoonlijke Informatie
            </SectionTitle>

            <FormRow>
              <InputGroup>
                <Label htmlFor="firstName">Voornaam</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Je voornaam"
                />
              </InputGroup>
              <InputGroup>
                <Label htmlFor="lastName">Achternaam</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Je achternaam"
                />
              </InputGroup>
            </FormRow>

            <FormRow>
              <InputGroup>
                <Label htmlFor="email">E-mailadres</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="je@email.com"
                />
              </InputGroup>
              <InputGroup>
                <Label htmlFor="phone">Telefoonnummer</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="06 12345678"
                />
              </InputGroup>
            </FormRow>

            <FormRow>
              <InputGroup>
                <Label htmlFor="dateOfBirth">Geboortedatum</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </InputGroup>
              <InputGroup>
                <Label htmlFor="occupation">Beroep</Label>
                <Input
                  id="occupation"
                  name="occupation"
                  type="text"
                  value={formData.occupation}
                  onChange={handleChange}
                  placeholder="Bijvoorbeeld: Software Developer"
                />
              </InputGroup>
            </FormRow>

            <InputGroup>
              <Label htmlFor="income">Maandinkomen (bruto)</Label>
              <Select
                id="income"
                name="income"
                value={formData.income}
                onChange={handleChange}
              >
                <option value="">Selecteer inkomen</option>
                <option value="< €2000">Minder dan €2.000</option>
                <option value="€2000-€3000">€2.000 - €3.000</option>
                <option value="€3000-€4000">€3.000 - €4.000</option>
                <option value="€4000-€5000">€4.000 - €5.000</option>
                <option value="€5000+">Meer dan €5.000</option>
              </Select>
            </InputGroup>

            <InputGroup>
              <Label htmlFor="bio">Over jezelf</Label>
              <TextArea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Vertel iets over jezelf, dit helpt verhuurders je beter te leren kennen..."
              />
            </InputGroup>

            <SectionTitle>
              🏠 Woonvoorkeuren
            </SectionTitle>

            <FormRow>
              <InputGroup>
                <Label htmlFor="preferredCity">Gewenste stad</Label>
                <Select
                  id="preferredCity"
                  name="preferredCity"
                  value={formData.preferredCity}
                  onChange={handleChange}
                >
                  <option value="">Alle steden</option>
                  <option value="Amsterdam">Amsterdam</option>
                  <option value="Rotterdam">Rotterdam</option>
                  <option value="Den Haag">Den Haag</option>
                  <option value="Utrecht">Utrecht</option>
                  <option value="Arnhem">Arnhem</option>
                  <option value="Nijmegen">Nijmegen</option>
                </Select>
              </InputGroup>
              <InputGroup>
                <Label htmlFor="maxRent">Maximale huur</Label>
                <Select
                  id="maxRent"
                  name="maxRent"
                  value={formData.maxRent}
                  onChange={handleChange}
                >
                  <option value="">Geen limiet</option>
                  <option value="€1000">Tot €1.000</option>
                  <option value="€1500">Tot €1.500</option>
                  <option value="€2000">Tot €2.000</option>
                  <option value="€2500">Tot €2.500</option>
                  <option value="€3000">Tot €3.000</option>
                  <option value="€3500+">€3.500 of meer</option>
                </Select>
              </InputGroup>
            </FormRow>

            <InputGroup>
              <Label htmlFor="minRooms">Minimum aantal kamers</Label>
              <Select
                id="minRooms"
                name="minRooms"
                value={formData.minRooms}
                onChange={handleChange}
              >
                <option value="">Geen voorkeur</option>
                <option value="1">1 kamer</option>
                <option value="2">2 kamers</option>
                <option value="3">3 kamers</option>
                <option value="4">4 kamers</option>
                <option value="5">5+ kamers</option>
              </Select>
            </InputGroup>

            <SaveButton type="submit" disabled={loading}>
              {loading ? 'Opslaan...' : 'Profiel Opslaan'}
            </SaveButton>
          </Form>
        </ProfileCard>

        <PreferencesCard>
          <SectionTitle>
            🔔 Notificatie Voorkeuren
          </SectionTitle>

          <CheckboxGroup>
            <CheckboxItem>
              <Checkbox
                type="checkbox"
                name="emailNotifications"
                checked={formData.emailNotifications}
                onChange={handleChange}
              />
              <span>E-mail notificaties voor nieuwe woningen</span>
            </CheckboxItem>

            <CheckboxItem>
              <Checkbox
                type="checkbox"
                name="smsNotifications"
                checked={formData.smsNotifications}
                onChange={handleChange}
              />
              <span>SMS notificaties voor directe matches</span>
            </CheckboxItem>

            <CheckboxItem>
              <Checkbox
                type="checkbox"
                name="weeklyUpdates"
                checked={formData.weeklyUpdates}
                onChange={handleChange}
              />
              <span>Wekelijkse overzichten met nieuwe woningen</span>
            </CheckboxItem>

            <CheckboxItem>
              <Checkbox
                type="checkbox"
                name="instantAlerts"
                checked={formData.instantAlerts}
                onChange={handleChange}
              />
              <span>Directe meldingen voor perfect matchende woningen</span>
            </CheckboxItem>
          </CheckboxGroup>

          <SaveButton
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            style={{ marginTop: '24px' }}
          >
            {loading ? 'Opslaan...' : 'Voorkeuren Opslaan'}
          </SaveButton>
        </PreferencesCard>

        <PreferencesCard>
          <SectionTitle>
            💳 Abonnement & Betaling
          </SectionTitle>

          <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '12px'
            }}>
              <div>
                <div style={{ color: '#166534', fontWeight: '600', fontSize: '16px' }}>
                  Premium Toegang
                </div>
                <div style={{ color: '#16a34a', fontSize: '14px' }}>
                  Status: Actief
                </div>
              </div>
              <div style={{
                background: '#16a34a',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                ✓ BETAALD
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{
                padding: '16px',
                background: '#f8fafc',
                border: '1px solid #e5e7eb',
                borderRadius: '12px'
              }}>
                <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                  Abonnement Type
                </div>
                <div style={{ color: '#1f2937', fontWeight: '600' }}>
                  Premium - Eenmalig
                </div>
              </div>

              <div style={{
                padding: '16px',
                background: '#f8fafc',
                border: '1px solid #e5e7eb',
                borderRadius: '12px'
              }}>
                <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                  Betaald Bedrag
                </div>
                <div style={{ color: '#1f2937', fontWeight: '600' }}>
                  €29,95
                </div>
              </div>

              <div style={{
                padding: '16px',
                background: '#f8fafc',
                border: '1px solid #e5e7eb',
                borderRadius: '12px'
              }}>
                <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                  Geldig tot
                </div>
                <div style={{ color: '#1f2937', fontWeight: '600' }}>
                  Permanent
                </div>
              </div>

              <div style={{
                padding: '16px',
                background: '#f8fafc',
                border: '1px solid #e5e7eb',
                borderRadius: '12px'
              }}>
                <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                  Laatste Betaling
                </div>
                <div style={{ color: '#1f2937', fontWeight: '600' }}>
                  {new Date().toLocaleDateString('nl-NL')}
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{
              color: '#1f2937',
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '16px'
            }}>
              Je Premium Voordelen:
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                'Onbeperkte toegang tot alle woningen',
                'Direct contact met verhuurders',
                'Geavanceerde zoekfilters',
                'E-mail notificaties voor nieuwe woningen',
                'Prioritaire klantenservice',
                'Geen advertenties'
              ].map((benefit, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#374151'
                }}>
                  <span style={{ color: '#16a34a' }}>✓</span>
                  {benefit}
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <div style={{ color: '#0369a1', fontWeight: '600', marginBottom: '8px' }}>
              💡 Tip: Je abonnement
            </div>
            <div style={{ color: '#0284c7', fontSize: '14px' }}>
              Je hebt een eenmalige betaling gedaan voor permanente toegang tot alle premium functies.
              Er zijn geen verdere kosten of automatische verlengingen.
            </div>
          </div>

          <button style={{
            background: '#6b7280',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'not-allowed',
            width: '100%'
          }} disabled>
            Betaalgegevens Wijzigen (Niet van toepassing)
          </button>
        </PreferencesCard>
      </Container>
    </PageContainer>
  );
};

export default Profile;