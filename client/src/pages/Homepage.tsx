import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const HeroSection = styled.section`
  background: #ffffff;
  padding: 60px 0 80px;
  position: relative;
  overflow: hidden;
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
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

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;

  .stars {
    color: #fbbf24;
    font-size: 16px;
  }

  .score {
    font-weight: 600;
    color: #1f2937;
  }

  .total {
    color: #6b7280;
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
`;

const SearchContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
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

  @media (max-width: 968px) {
    grid-template-columns: 2fr 1fr auto;
    gap: 4px;
    padding: 6px;
    border-radius: 40px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr auto;
    gap: 8px;
    padding: 8px;
    border-radius: 30px;
  }
`;

const MobileFiltersContainer = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    margin-top: 20px;
  }
`;

const MobileFiltersGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
`;

const MobileFilterCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
`;

const MobileFilterLabel = styled.label`
  color: #1e293b;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 14px;
  display: block;
`;

const MobileFilterSelect = styled.select`
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  color: #64748b;
  background: white;
  outline: none;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: 40px;

  &:focus {
    border-color: #38b6ff;
    color: #1e293b;
  }

  option {
    color: #1e293b;
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
    padding: 12px 16px;

    &:not(:last-child)::after {
      display: none;
    }

    &.mobile-hidden {
      display: none;
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

  &:hover {
    background: #2196f3;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(56, 182, 255, 0.4);
  }

  @media (max-width: 768px) {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    margin: 0;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const CitiesSection = styled.section`
  background: #f8fafc;
  padding: 60px 0;
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
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
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
    background-image: url('https://images.unsplash.com/photo-1534351590666-13e3e96b5017?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80');
  }

  &.rotterdam {
    background-image: url('https://images.unsplash.com/photo-1555881400-74d7acaacd8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80');
  }

  &.den-haag {
    background-image: url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80');
  }

  &.utrecht {
    background-image: url('https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80');
  }

  &.eindhoven {
    background-image: url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80');
  }

  &.maastricht {
    background-image: url('https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80');
  }
`;

const CountryFlag = styled.div`
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: white;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  color: #4b5563;
  z-index: 2;
  border: 1px solid #e5e7eb;
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

            <Rating>
              <span className="stars">⭐⭐⭐⭐⭐</span>
              <span className="score">5.00</span>
              <span className="total">/5.00 0</span>
            </Rating>
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

            <FormGroup className="mobile-hidden">
              <Label>Van</Label>
              <Select
                name="minPrice"
                value={searchData.minPrice}
                onChange={handleInputChange}
              >
                <option value="">Geen minimum</option>
                <option value="500">€ 500</option>
                <option value="750">€ 750</option>
                <option value="1000">€ 1.000</option>
                <option value="1250">€ 1.250</option>
                <option value="1500">€ 1.500</option>
                <option value="2000">€ 2.000</option>
              </Select>
            </FormGroup>

            <FormGroup className="mobile-hidden">
              <Label>Tot</Label>
              <Select
                name="maxPrice"
                value={searchData.maxPrice}
                onChange={handleInputChange}
              >
                <option value="">Geen maximum</option>
                <option value="1000">€ 1.000</option>
                <option value="1500">€ 1.500</option>
                <option value="2000">€ 2.000</option>
                <option value="2500">€ 2.500</option>
                <option value="3000">€ 3.000</option>
                <option value="3500">€ 3.500</option>
              </Select>
            </FormGroup>

            <SearchButton type="submit">
              🔍
            </SearchButton>
          </SearchForm>

          <MobileFiltersContainer>
            <MobileFiltersGrid>
              <MobileFilterCard>
                <MobileFilterLabel>Minimumprijs</MobileFilterLabel>
                <MobileFilterSelect
                  name="minPrice"
                  value={searchData.minPrice}
                  onChange={handleInputChange}
                >
                  <option value="">Geen minimum</option>
                  <option value="500">€ 500</option>
                  <option value="750">€ 750</option>
                  <option value="1000">€ 1.000</option>
                  <option value="1250">€ 1.250</option>
                  <option value="1500">€ 1.500</option>
                  <option value="2000">€ 2.000</option>
                </MobileFilterSelect>
              </MobileFilterCard>

              <MobileFilterCard>
                <MobileFilterLabel>Maximumprijs</MobileFilterLabel>
                <MobileFilterSelect
                  name="maxPrice"
                  value={searchData.maxPrice}
                  onChange={handleInputChange}
                >
                  <option value="">Geen maximum</option>
                  <option value="1000">€ 1.000</option>
                  <option value="1500">€ 1.500</option>
                  <option value="2000">€ 2.000</option>
                  <option value="2500">€ 2.500</option>
                  <option value="3000">€ 3.000</option>
                  <option value="3500">€ 3.500</option>
                </MobileFilterSelect>
              </MobileFilterCard>
            </MobileFiltersGrid>
          </MobileFiltersContainer>
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
                <CountryFlag>🇳🇱 Dutch</CountryFlag>
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
              <CityImage className="rotterdam">
                <CountryFlag>🇳🇱 Dutch</CountryFlag>
              </CityImage>
              <CityInfo>
                <CityName>Rotterdam</CityName>
                <CityStats>
                  <CityCount>274 woningen</CityCount>
                  <CityPrice>Gem. € 2.088</CityPrice>
                </CityStats>
              </CityInfo>
            </CityCard>

            <CityCard onClick={() => handleCityClick('den-haag')}>
              <CityImage className="den-haag">
                <CountryFlag>🇳🇱 Dutch</CountryFlag>
              </CityImage>
              <CityInfo>
                <CityName>Den Haag</CityName>
                <CityStats>
                  <CityCount>337 woningen</CityCount>
                  <CityPrice>Gem. € 2.312</CityPrice>
                </CityStats>
              </CityInfo>
            </CityCard>

            <CityCard onClick={() => handleCityClick('utrecht')}>
              <CityImage className="utrecht">
                <CountryFlag>🇳🇱 Dutch</CountryFlag>
              </CityImage>
              <CityInfo>
                <CityName>Utrecht</CityName>
                <CityStats>
                  <CityCount>129 woningen</CityCount>
                  <CityPrice>Gem. € 2.207</CityPrice>
                </CityStats>
              </CityInfo>
            </CityCard>

            <CityCard onClick={() => handleCityClick('eindhoven')}>
              <CityImage className="eindhoven">
                <CountryFlag>🇳🇱 Dutch</CountryFlag>
              </CityImage>
              <CityInfo>
                <CityName>Eindhoven</CityName>
                <CityStats>
                  <CityCount>118 woningen</CityCount>
                  <CityPrice>Gem. € 1.774</CityPrice>
                </CityStats>
              </CityInfo>
            </CityCard>

            <CityCard onClick={() => handleCityClick('maastricht')}>
              <CityImage className="maastricht">
                <CountryFlag>🇳🇱 Dutch</CountryFlag>
              </CityImage>
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