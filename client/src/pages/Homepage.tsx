import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const HeroSection = styled.section`
  background: #ffffff;
  padding: 60px 0 80px;
  position: relative;
  overflow-x: hidden;
  width: 100%;
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
    padding: 0 16px;
  }
`;

const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const HeroTitle = styled.h1`
  font-size: 48px;
  font-weight: 700;
  line-height: 1.1;
  color: #1f2937;

  .blue {
    color: #38b6ff;
  }

  @media (max-width: 768px) {
    font-size: 36px;
  }
`;


const TruckContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;

  @media (max-width: 968px) {
    height: 300px;
  }
`;

const TruckIllustration = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  height: 300px;
  background-image: url('https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80');
  background-size: cover;
  background-position: center;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(56, 182, 255, 0.15) 0%, rgba(253, 126, 20, 0.1) 100%);
    z-index: 1;
  }

  &::after {
    content: '🔑';
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    z-index: 2;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(10px);
  }
`;

const SearchSection = styled.section`
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%);
  padding: 40px 0 60px;
  overflow-x: hidden;
  width: 100%;
`;

const SearchContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const SearchForm = styled.form`
  background: white;
  border-radius: 60px;
  padding: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  display: grid;
  grid-template-columns: 2.5fr 1fr 1fr auto;
  gap: 1px;
  align-items: center;
  border: 1px solid #f1f5f9;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 968px) {
    grid-template-columns: 2fr 1fr auto;
    gap: 4px;
    padding: 6px;
    border-radius: 40px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0;
    padding: 16px;
    border-radius: 20px;
  }
`;

const MobileActionBar = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    gap: 8px;
    margin-top: 16px;
    padding: 0 8px;
    flex-wrap: wrap;
  }
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid #e5e7eb;
  background: ${props => props.variant === 'primary' ? '#10b981' : 'white'};
  color: ${props => props.variant === 'primary' ? 'white' : '#374151'};
  cursor: pointer;
  transition: all 0.2s;
  flex: ${props => props.variant === 'primary' ? '1' : 'auto'};
  min-width: fit-content;

  &:hover {
    background: ${props => props.variant === 'primary' ? '#059669' : '#f9fafb'};
  }

  .icon {
    font-size: 16px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 20px;
  position: relative;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    right: 0;
    top: 20%;
    bottom: 20%;
    width: 1px;
    background: #e2e8f0;
  }

  @media (max-width: 968px) {
    padding: 12px 16px;
  }

  @media (max-width: 768px) {
    padding: 10px 0;

    &:not(:last-child)::after {
      display: none;
    }

    &.mobile-price {
      border-bottom: none !important;
      padding-bottom: 0;
      margin-bottom: 0;
    }

    &:not(:last-child):not(.mobile-price) {
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 12px;
      margin-bottom: 12px;
    }
  }
`;

const Label = styled.label`
  color: #1e293b;
  font-weight: 600;
  margin-bottom: 6px;
  font-size: 15px;

  @media (max-width: 768px) {
    font-size: 13px;
    margin-bottom: 4px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    margin-bottom: 3px;
  }
`;

const Input = styled.input`
  border: none;
  font-size: 15px;
  color: #64748b;
  background: transparent;
  outline: none;
  width: 100%;

  &::placeholder {
    color: #94a3b8;
    font-weight: 400;
  }

  &:focus {
    color: #1e293b;
  }

  @media (max-width: 768px) {
    font-size: 13px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const Select = styled.select`
  border: none;
  font-size: 15px;
  color: #64748b;
  background: transparent;
  outline: none;
  width: 100%;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 8px center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: 32px;

  &:focus {
    color: #1e293b;
  }

  option {
    color: #1e293b;
  }

  @media (max-width: 768px) {
    font-size: 13px;
    background-size: 14px;
    padding-right: 28px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    background-size: 12px;
    padding-right: 24px;
  }
`;

const MobilePriceRow = styled.div`
  display: contents;

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid #f1f5f9;
    margin-bottom: 12px;
  }
`;

const SearchButton = styled.button`
  background: #38b6ff;
  color: white;
  font-weight: 600;
  border-radius: 50%;
  font-size: 20px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  margin: 8px;
  box-shadow: 0 4px 12px rgba(56, 182, 255, 0.3);
  border: none;
  cursor: pointer;

  &:hover {
    background: #2196f3;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(56, 182, 255, 0.4);
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 48px;
    border-radius: 12px;
    margin: 12px 0 0 0;
    font-size: 16px;
    gap: 8px;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const CitiesSection = styled.section`
  background: #f8fafc;
  padding: 60px 0;
  overflow-x: hidden;
  width: 100%;
`;

const SectionTitle = styled.h2`
  font-size: 36px;
  font-weight: 700;
  color: #1f2937;
  text-align: center;
  margin-bottom: 16px;
`;

const SectionSubtitle = styled.p`
  font-size: 18px;
  color: #6b7280;
  text-align: center;
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const CitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const CityCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #f3f4f6;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  }
`;

const CityImage = styled.div`
  height: 160px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%);
  }

  &.amsterdam {
    background-image: url('https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=600');
  }

  &.rotterdam {
    background-image: url('https://images.pexels.com/photos/5604693/pexels-photo-5604693.jpeg?auto=compress&cs=tinysrgb&w=600');
  }

  &.den-haag {
    background-image: url('https://images.pexels.com/photos/5409751/pexels-photo-5409751.jpeg?auto=compress&cs=tinysrgb&w=600');
  }

  &.utrecht {
    background-image: url('https://images.pexels.com/photos/1121782/pexels-photo-1121782.jpeg?auto=compress&cs=tinysrgb&w=600');
  }

  &.eindhoven {
    background-image: url('https://images.pexels.com/photos/2524368/pexels-photo-2524368.jpeg?auto=compress&cs=tinysrgb&w=600');
  }

  &.maastricht {
    background-image: url('https://images.pexels.com/photos/1796715/pexels-photo-1796715.jpeg?auto=compress&cs=tinysrgb&w=600');
  }
`;

const CityInfo = styled.div`
  padding: 20px;
`;

const CityName = styled.h3`
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
`;

const CityStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const CityCount = styled.p`
  color: #4b5563;
  font-size: 14px;
  font-weight: 500;
`;

const CityPrice = styled.p`
  color: #6b7280;
  font-size: 14px;
`;

const Homepage: React.FC = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    city: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (searchData.city) params.append('woningplaats', searchData.city.toLowerCase());
    if (searchData.minPrice) params.append('min_prijs', searchData.minPrice);
    if (searchData.maxPrice) params.append('max_prijs', searchData.maxPrice);
    if (searchData.bedrooms) params.append('bedrooms', searchData.bedrooms);

    navigate(`/woning?${params.toString()}`);
  };

  const handleCityClick = (city: string) => {
    navigate(`/woning?woningplaats=${city.toLowerCase()}`);
  };

  return (
    <>
      <HeroSection>
        <HeroContent>
          <LeftContent>
            <HeroTitle>
              <span className="blue">Fyxed Wonen</span><br />
              snel en makkelijk<br />
              een woning huren
            </HeroTitle>

          </LeftContent>

          <TruckContainer>
            <TruckIllustration />
          </TruckContainer>
        </HeroContent>
      </HeroSection>

      <SearchSection>
        <SearchContainer>
          <SearchForm onSubmit={handleSearch}>
            <FormGroup>
              <Label>Waar</Label>
              <Input
                type="text"
                name="city"
                placeholder="Plaats, stadsdeel, wijk of buurt"
                value={searchData.city}
                onChange={handleInputChange}
              />
            </FormGroup>

            <MobilePriceRow>
              <FormGroup className="mobile-price">
                <Label>Van</Label>
                <Select
                  name="minPrice"
                  value={searchData.minPrice}
                  onChange={handleInputChange}
                >
                  <option value="">Min</option>
                  <option value="500">€ 500</option>
                  <option value="750">€ 750</option>
                  <option value="1000">€ 1.000</option>
                  <option value="1250">€ 1.250</option>
                  <option value="1500">€ 1.500</option>
                  <option value="2000">€ 2.000</option>
                </Select>
              </FormGroup>

              <FormGroup className="mobile-price">
                <Label>Tot</Label>
                <Select
                  name="maxPrice"
                  value={searchData.maxPrice}
                  onChange={handleInputChange}
                >
                  <option value="">Max</option>
                  <option value="1000">€ 1.000</option>
                  <option value="1500">€ 1.500</option>
                  <option value="2000">€ 2.000</option>
                  <option value="2500">€ 2.500</option>
                  <option value="3000">€ 3.000</option>
                  <option value="3500">€ 3.500</option>
                </Select>
              </FormGroup>
            </MobilePriceRow>

            <SearchButton type="submit">
              🔍 Zoeken
            </SearchButton>
          </SearchForm>

          <MobileActionBar>
            <ActionButton variant="primary">
              <span className="icon">💾</span>
              Zoekopslaan
            </ActionButton>
            <ActionButton>
              <span className="icon">⚙️</span>
              Filters (0)
            </ActionButton>
            <ActionButton>
              <span className="icon">🔲</span>
              Tegel
            </ActionButton>
            <ActionButton>
              <span className="icon">🗺️</span>
              Kaart
            </ActionButton>
          </MobileActionBar>
        </SearchContainer>
      </SearchSection>

      <CitiesSection>
        <Container>
          <SectionTitle>Populaire steden</SectionTitle>
          <SectionSubtitle>
            Ontdek de beste huurwoningen in Nederlandse topsteden. Van bruisend Amsterdam tot historisch Maastricht.
          </SectionSubtitle>
          <CitiesGrid>
            <CityCard onClick={() => handleCityClick('amsterdam')}>
              <CityImage className="amsterdam">
              </CityImage>
              <CityInfo>
                <CityName>Amsterdam</CityName>
                <CityStats>
                  <CityCount>652 woningen</CityCount>
                  <CityPrice>Gem. € 2.490</CityPrice>
                </CityStats>
              </CityInfo>
            </CityCard>

            <CityCard onClick={() => handleCityClick('rotterdam')}>
              <CityImage className="rotterdam" />
              <CityInfo>
                <CityName>Rotterdam</CityName>
                <CityStats>
                  <CityCount>274 woningen</CityCount>
                  <CityPrice>Gem. € 2.088</CityPrice>
                </CityStats>
              </CityInfo>
            </CityCard>

            <CityCard onClick={() => handleCityClick('den-haag')}>
              <CityImage className="den-haag" />
              <CityInfo>
                <CityName>Den Haag</CityName>
                <CityStats>
                  <CityCount>337 woningen</CityCount>
                  <CityPrice>Gem. € 2.312</CityPrice>
                </CityStats>
              </CityInfo>
            </CityCard>

            <CityCard onClick={() => handleCityClick('utrecht')}>
              <CityImage className="utrecht" />
              <CityInfo>
                <CityName>Utrecht</CityName>
                <CityStats>
                  <CityCount>129 woningen</CityCount>
                  <CityPrice>Gem. € 2.207</CityPrice>
                </CityStats>
              </CityInfo>
            </CityCard>

            <CityCard onClick={() => handleCityClick('eindhoven')}>
              <CityImage className="eindhoven" />
              <CityInfo>
                <CityName>Eindhoven</CityName>
                <CityStats>
                  <CityCount>118 woningen</CityCount>
                  <CityPrice>Gem. € 1.774</CityPrice>
                </CityStats>
              </CityInfo>
            </CityCard>

            <CityCard onClick={() => handleCityClick('maastricht')}>
              <CityImage className="maastricht" />
              <CityInfo>
                <CityName>Maastricht</CityName>
                <CityStats>
                  <CityCount>74 woningen</CityCount>
                  <CityPrice>Gem. € 1.437</CityPrice>
                </CityStats>
              </CityInfo>
            </CityCard>
          </CitiesGrid>
        </Container>
      </CitiesSection>
    </>
  );
};

export default Homepage;