import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

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

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #1e40af;
    box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #1e40af;
    box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  background: white;

  &:focus {
    outline: none;
    border-color: #1e40af;
    box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: normal;

  input {
    margin-right: 8px;
    width: auto;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(30, 64, 175, 0.4);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const CancelButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #5a6268;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
`;

const ErrorMessage = styled.div`
  background: #ffe6e6;
  color: #d00;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #d00;
  margin-bottom: 20px;
`;

const PhotoSection = styled.div`
  margin-bottom: 30px;
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
`;

const PhotoItem = styled.div`
  position: relative;
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  background: #fafafa;
`;

const PhotoPreview = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;

  &:hover {
    background: #c0392b;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  display: inline-block;
  padding: 10px 20px;
  background: #1e40af;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #1d4ed8;
  }
`;

const AddPhotoButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 150px;
  border: 2px dashed #1e40af;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(30, 64, 175, 0.1);
  }
`;

interface Property {
  _id: string;
  title: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
  };
  price: number;
  size: number;
  rooms: number;
  bedrooms: number;
  yearBuilt?: number;
  energyLabel?: string;
  description: string;
  furnished: boolean;
  petsAllowed: boolean;
  garden: boolean;
  parking: boolean;
  balcony: boolean;
  images: string[];
}

const EditProperty: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    street: '',
    city: '',
    postalCode: '',
    price: '',
    size: '',
    rooms: '',
    bedrooms: '',
    yearBuilt: '',
    energyLabel: '',
    description: '',
    furnished: false,
    petsAllowed: false,
    garden: false,
    parking: false,
    balcony: false
  });

  useEffect(() => {
    if (!id) {
      setError('Geen property ID gevonden');
      setLoading(false);
      return;
    }
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const token = localStorage.getItem('verhuurderToken');
      const response = await fetch(`http://localhost:5001/api/verhuurders/properties`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const property = data.properties.find((p: Property) => p._id === id);

        if (property) {
          setFormData({
            title: property.title || '',
            street: property.address?.street || '',
            city: property.address?.city || '',
            postalCode: property.address?.postalCode || '',
            price: property.price?.toString() || '',
            size: property.size?.toString() || '',
            rooms: property.rooms?.toString() || '',
            bedrooms: property.bedrooms?.toString() || '',
            yearBuilt: property.yearBuilt?.toString() || '',
            energyLabel: property.energyLabel || '',
            description: property.description || '',
            furnished: property.furnished || false,
            petsAllowed: property.petsAllowed || false,
            garden: property.garden || false,
            parking: property.parking || false,
            balcony: property.balcony || false
          });
          setCurrentImages(property.images || []);
        } else {
          setError('Property niet gevonden');
        }
      } else {
        setError('Kon property niet laden');
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      setError('Er ging iets mis bij het laden van de property');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setNewImages(prev => [...prev, ...fileArray]);
    }
    e.target.value = '';
  };

  const removeCurrentImage = (index: number) => {
    setCurrentImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const token = localStorage.getItem('verhuurderToken');

      // Create FormData for file upload
      const formDataToSend = new FormData();

      // Add all form fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('street', formData.street);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('postalCode', formData.postalCode);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('size', formData.size);
      formDataToSend.append('rooms', formData.rooms);
      formDataToSend.append('bedrooms', formData.bedrooms);
      if (formData.yearBuilt) formDataToSend.append('yearBuilt', formData.yearBuilt);
      if (formData.energyLabel) formDataToSend.append('energyLabel', formData.energyLabel);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('furnished', formData.furnished.toString());
      formDataToSend.append('petsAllowed', formData.petsAllowed.toString());
      formDataToSend.append('garden', formData.garden.toString());
      formDataToSend.append('parking', formData.parking.toString());
      formDataToSend.append('balcony', formData.balcony.toString());

      // Add current images that should remain
      currentImages.forEach((image, index) => {
        formDataToSend.append(`currentImages[${index}]`, image);
      });

      // Add new images
      newImages.forEach((file) => {
        formDataToSend.append('images', file);
      });

      const response = await fetch(`http://localhost:5001/api/verhuurders/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        alert('Property succesvol bijgewerkt!');
        navigate('/verhuurders/dashboard');
      } else {
        const data = await response.json();
        setError(data.message || 'Er ging iets mis bij het bijwerken van de property');
      }
    } catch (error) {
      console.error('Error updating property:', error);
      setError('Er ging iets mis bij het bijwerken van de property');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <FormContainer>
          <LoadingMessage>
            <h3>Property laden...</h3>
          </LoadingMessage>
        </FormContainer>
      </Container>
    );
  }

  return (
    <Container>
      <FormContainer>
        <Header>
          <HeaderTitle>Property Bewerken</HeaderTitle>
          <HeaderSubtitle>Pas de gegevens van je property aan</HeaderSubtitle>
        </Header>

        <Form onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Section>
            <SectionTitle>Basis Informatie</SectionTitle>
            <InputGroup>
              <Label>Titel *</Label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Bijv. Ruim appartement in het centrum"
              />
            </InputGroup>
          </Section>

          <Section>
            <SectionTitle>Adres</SectionTitle>
            <InputGroup>
              <Label>Straat + huisnummer *</Label>
              <Input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                required
                placeholder="Bijv. Hoofdstraat 123"
              />
            </InputGroup>
            <InputGroup>
              <Label>Stad *</Label>
              <Input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                placeholder="Bijv. Amsterdam"
              />
            </InputGroup>
            <InputGroup>
              <Label>Postcode *</Label>
              <Input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                required
                placeholder="Bijv. 1234 AB"
              />
            </InputGroup>
          </Section>

          <Section>
            <SectionTitle>Property Details</SectionTitle>
            <InputGroup>
              <Label>Huurprijs per maand (€) *</Label>
              <Input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                placeholder="Bijv. 1200"
              />
            </InputGroup>
            <InputGroup>
              <Label>Oppervlakte (m²) *</Label>
              <Input
                type="number"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                required
                placeholder="Bijv. 75"
              />
            </InputGroup>
            <InputGroup>
              <Label>Aantal kamers *</Label>
              <Input
                type="number"
                name="rooms"
                value={formData.rooms}
                onChange={handleInputChange}
                required
                placeholder="Bijv. 3"
              />
            </InputGroup>
            <InputGroup>
              <Label>Aantal slaapkamers *</Label>
              <Input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleInputChange}
                required
                placeholder="Bijv. 2"
              />
            </InputGroup>
            <InputGroup>
              <Label>Bouwjaar</Label>
              <Input
                type="number"
                name="yearBuilt"
                value={formData.yearBuilt}
                onChange={handleInputChange}
                placeholder="Bijv. 1995"
              />
            </InputGroup>
            <InputGroup>
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
            </InputGroup>
          </Section>

          <Section>
            <SectionTitle>Beschrijving</SectionTitle>
            <InputGroup>
              <Label>Uitgebreide beschrijving</Label>
              <TextArea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Beschrijf je property in detail..."
              />
            </InputGroup>
          </Section>

          <Section>
            <SectionTitle>Voorzieningen</SectionTitle>
            <CheckboxGroup>
              <CheckboxItem>
                <input
                  type="checkbox"
                  name="furnished"
                  checked={formData.furnished}
                  onChange={handleInputChange}
                />
                Gemeubileerd
              </CheckboxItem>
              <CheckboxItem>
                <input
                  type="checkbox"
                  name="petsAllowed"
                  checked={formData.petsAllowed}
                  onChange={handleInputChange}
                />
                Huisdieren toegestaan
              </CheckboxItem>
              <CheckboxItem>
                <input
                  type="checkbox"
                  name="garden"
                  checked={formData.garden}
                  onChange={handleInputChange}
                />
                Tuin
              </CheckboxItem>
              <CheckboxItem>
                <input
                  type="checkbox"
                  name="parking"
                  checked={formData.parking}
                  onChange={handleInputChange}
                />
                Parkeerplaats
              </CheckboxItem>
              <CheckboxItem>
                <input
                  type="checkbox"
                  name="balcony"
                  checked={formData.balcony}
                  onChange={handleInputChange}
                />
                Balkon
              </CheckboxItem>
            </CheckboxGroup>
          </Section>

          <Section>
            <SectionTitle>Foto's</SectionTitle>
            <PhotoGrid>
              {/* Current Images */}
              {currentImages.map((image, index) => (
                <PhotoItem key={`current-${index}`}>
                  <PhotoPreview src={image.startsWith('http') ? image : `http://localhost:5001${image}`} alt={`Property foto ${index + 1}`} />
                  <DeleteButton onClick={() => removeCurrentImage(index)}>
                    ×
                  </DeleteButton>
                  <div>Huidige foto</div>
                </PhotoItem>
              ))}

              {/* New Images */}
              {newImages.map((file, index) => (
                <PhotoItem key={`new-${index}`}>
                  <PhotoPreview src={URL.createObjectURL(file)} alt={`Nieuwe foto ${index + 1}`} />
                  <DeleteButton onClick={() => removeNewImage(index)}>
                    ×
                  </DeleteButton>
                  <div>Nieuwe foto</div>
                </PhotoItem>
              ))}

              {/* Add Photo Button */}
              <AddPhotoButton>
                <FileInputLabel htmlFor="photo-upload">
                  📸 Foto's Toevoegen
                </FileInputLabel>
                <FileInput
                  id="photo-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                  Maximaal 5MB per foto
                </div>
              </AddPhotoButton>
            </PhotoGrid>
          </Section>

          <ButtonContainer>
            <CancelButton
              type="button"
              onClick={() => navigate('/verhuurders/dashboard')}
            >
              Annuleren
            </CancelButton>
            <SubmitButton type="submit" disabled={saving}>
              {saving ? 'Bezig met opslaan...' : 'Property Bijwerken'}
            </SubmitButton>
          </ButtonContainer>
        </Form>
      </FormContainer>
    </Container>
  );
};

export default EditProperty;