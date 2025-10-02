import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { API_BASE_URL } from '../../services/api';

const Container = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 20px 0;
`;

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: white;
  padding: 30px;
  text-align: center;
`;

const HeaderTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 10px;
`;

const HeaderSubtitle = styled.p`
  opacity: 0.9;
  font-size: 1.1rem;
`;

const Form = styled.form`
  padding: 40px;
`;

const Section = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h3`
  color: #333;
  margin-bottom: 20px;
  font-size: 1.3rem;
  border-bottom: 2px solid #1e40af;
  padding-bottom: 10px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #1e40af;
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #1e40af;
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  background: white;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #1e40af;
  }
`;

const CheckboxGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  cursor: pointer;
  color: #333;
  font-size: 0.95rem;
`;

const FeatureInput = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  align-items: center;
`;

const FeaturesList = styled.div`
  margin-top: 15px;
`;

const FeatureItem = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  background-color: #f8f9fa;
  padding: 8px 15px;
  margin-bottom: 5px;
  border-radius: 5px;
`;

const RemoveButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.8rem;
  margin-left: auto;

  &:hover {
    background: #c82333;
  }
`;

const AddButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background: #218838;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 40px;
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const CancelButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: #5a6268;
  }
`;

const ErrorMessage = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 12px;
  border-radius: 5px;
  margin-bottom: 20px;
  border: 1px solid #f5c6cb;
`;

interface PropertyFormData {
  title: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
  };
  price: string;
  size: string;
  rooms: string;
  bedrooms: string;
  yearBuilt: string;
  energyLabel: string;
  description: string;
  furnished: boolean;
  petsAllowed: boolean;
  garden: boolean;
  parking: boolean;
  balcony: boolean;
  availability: string;
}

const AddProperty: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    address: {
      street: '',
      city: '',
      postalCode: ''
    },
    price: '',
    size: '',
    rooms: '',
    bedrooms: '1',
    yearBuilt: '',
    energyLabel: '',
    description: '',
    furnished: false,
    petsAllowed: false,
    garden: false,
    parking: false,
    balcony: false,
    availability: new Date().toISOString().split('T')[0]
  });

  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (featureToRemove: string) => {
    setFeatures(features.filter(feature => feature !== featureToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.title || !formData.address.city || !formData.price || !formData.size || !formData.rooms) {
      setError('Vul alle verplichte velden in.');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('verhuurderToken');

      if (!token) {
        navigate('/verhuurders/login');
        return;
      }

      const propertyData = {
        ...formData,
        price: parseFloat(formData.price),
        size: parseFloat(formData.size),
        rooms: parseInt(formData.rooms),
        bedrooms: parseInt(formData.bedrooms),
        yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt) : undefined,
        features,
        images: [] // TODO: Add image upload functionality
      };

      const response = await fetch(`${API_BASE_URL}/verhuurders/properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(propertyData)
      });

      if (response.ok) {
        navigate('/verhuurders/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Er is een fout opgetreden bij het toevoegen van de woning.');
      }
    } catch (error) {
      console.error('Error adding property:', error);
      setError('Er is een fout opgetreden bij het toevoegen van de woning.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <FormContainer>
        <Header>
          <HeaderTitle>Nieuwe Woning Toevoegen</HeaderTitle>
          <HeaderSubtitle>Voeg alle gegevens van je woning toe</HeaderSubtitle>
        </Header>

        <Form onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Section>
            <SectionTitle>Basisgegevens</SectionTitle>
            <FormGrid>
              <FormGroup>
                <Label>Titel *</Label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Bijv. Ruime studio in Amsterdam"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Huurprijs per maand *</Label>
                <Input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="800"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Oppervlakte (m²) *</Label>
                <Input
                  type="number"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  placeholder="45"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Aantal kamers *</Label>
                <Input
                  type="number"
                  name="rooms"
                  value={formData.rooms}
                  onChange={handleInputChange}
                  placeholder="2"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Aantal slaapkamers</Label>
                <Input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  placeholder="1"
                />
              </FormGroup>
              <FormGroup>
                <Label>Bouwjaar</Label>
                <Input
                  type="number"
                  name="yearBuilt"
                  value={formData.yearBuilt}
                  onChange={handleInputChange}
                  placeholder="1990"
                />
              </FormGroup>
              <FormGroup>
                <Label>Energielabel</Label>
                <Select
                  name="energyLabel"
                  value={formData.energyLabel}
                  onChange={handleInputChange}
                >
                  <option value="">Selecteer energielabel</option>
                  <option value="A+">A+</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                  <option value="F">F</option>
                  <option value="G">G</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Beschikbaar vanaf</Label>
                <Input
                  type="date"
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </FormGrid>
          </Section>

          <Section>
            <SectionTitle>Adres</SectionTitle>
            <FormGrid>
              <FormGroup>
                <Label>Straat + huisnummer *</Label>
                <Input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleInputChange}
                  placeholder="Keizersgracht 123"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Stad *</Label>
                <Input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleInputChange}
                  placeholder="Amsterdam"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Postcode *</Label>
                <Input
                  type="text"
                  name="address.postalCode"
                  value={formData.address.postalCode}
                  onChange={handleInputChange}
                  placeholder="1016 DZ"
                  required
                />
              </FormGroup>
            </FormGrid>
          </Section>

          <Section>
            <SectionTitle>Voorzieningen</SectionTitle>
            <CheckboxGrid>
              <CheckboxGroup>
                <Checkbox
                  type="checkbox"
                  name="furnished"
                  checked={formData.furnished}
                  onChange={handleInputChange}
                  id="furnished"
                />
                <CheckboxLabel htmlFor="furnished">Gemeubileerd</CheckboxLabel>
              </CheckboxGroup>
              <CheckboxGroup>
                <Checkbox
                  type="checkbox"
                  name="petsAllowed"
                  checked={formData.petsAllowed}
                  onChange={handleInputChange}
                  id="petsAllowed"
                />
                <CheckboxLabel htmlFor="petsAllowed">Huisdieren toegestaan</CheckboxLabel>
              </CheckboxGroup>
              <CheckboxGroup>
                <Checkbox
                  type="checkbox"
                  name="garden"
                  checked={formData.garden}
                  onChange={handleInputChange}
                  id="garden"
                />
                <CheckboxLabel htmlFor="garden">Tuin</CheckboxLabel>
              </CheckboxGroup>
              <CheckboxGroup>
                <Checkbox
                  type="checkbox"
                  name="parking"
                  checked={formData.parking}
                  onChange={handleInputChange}
                  id="parking"
                />
                <CheckboxLabel htmlFor="parking">Parkeerplaats</CheckboxLabel>
              </CheckboxGroup>
              <CheckboxGroup>
                <Checkbox
                  type="checkbox"
                  name="balcony"
                  checked={formData.balcony}
                  onChange={handleInputChange}
                  id="balcony"
                />
                <CheckboxLabel htmlFor="balcony">Balkon</CheckboxLabel>
              </CheckboxGroup>
            </CheckboxGrid>
          </Section>

          <Section>
            <SectionTitle>Extra Kenmerken</SectionTitle>
            <FeatureInput>
              <Input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Bijv. Wasmachine, Vaatwasser, etc."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              />
              <AddButton type="button" onClick={addFeature}>
                Toevoegen
              </AddButton>
            </FeatureInput>
            <FeaturesList>
              {features.map((feature, index) => (
                <FeatureItem key={index}>
                  <span>{feature}</span>
                  <RemoveButton type="button" onClick={() => removeFeature(feature)}>
                    Verwijderen
                  </RemoveButton>
                </FeatureItem>
              ))}
            </FeaturesList>
          </Section>

          <Section>
            <SectionTitle>Beschrijving</SectionTitle>
            <FormGroup>
              <Label>Beschrijving van de woning</Label>
              <TextArea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Beschrijf de woning, de buurt, en andere relevante informatie..."
              />
            </FormGroup>
          </Section>

          <ButtonGroup>
            <CancelButton type="button" onClick={() => navigate('/verhuurders/dashboard')}>
              Annuleren
            </CancelButton>
            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Woning toevoegen...' : 'Woning Toevoegen'}
            </SubmitButton>
          </ButtonGroup>
        </Form>
      </FormContainer>
    </Container>
  );
};

export default AddProperty;
