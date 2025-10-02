import React, { useState, useEffect } from 'react';
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

const TruckIllustration = styled.div<{ $currentImage: string }>`
  position: relative;
  width: 100%;
  max-width: 500px;
  height: 300px;
  background-image: url(${props => props.$currentImage});
  background-size: cover;
  background-position: center;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  transition: background-image 0.8s ease-in-out;

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

const SlideshowDots = styled.div`
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 3;
`;

const Dot = styled.div<{ $active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.$active ? '#38b6ff' : 'rgba(255, 255, 255, 0.5)'};
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    background: ${props => props.$active ? '#38b6ff' : 'rgba(255, 255, 255, 0.8)'};
    transform: scale(1.2);
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
  font-size: 14px;

  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 4px;
  }
`;

const Input = styled.input`
  border: none;
  font-size: 16px;
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
    font-size: 16px;
  }
`;

const Select = styled.select`
  border: none;
  font-size: 16px;
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
    font-size: 16px;
    background-size: 16px;
    padding-right: 32px;
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

  .button-text {
    display: none;
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 48px;
    border-radius: 12px;
    margin: 12px 0 0 0;
    font-size: 16px;
    gap: 8px;

    .button-text {
      display: inline;
    }
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
    background-image: url('/images/cities/amsterdam-canal-netherlands-architecture-buildings-e43db9-1024.jpg');
  }

  &.rotterdam {
    background-image: url('/images/cities/rotterdam.jpg');
  }

  &.den-haag {
    background-image: url('/images/cities/Den_Haag_Skyline_1.jpg');
  }

  &.utrecht {
    background-image: url('/images/cities/Stadskantoor_Utrecht._(18148413504).jpg');
  }

  &.eindhoven {
    background-image: url('/images/cities/Het_station_in_zijn_omgeving_-_Eindhoven_-_20533929_-_RCE.jpg');
  }

  &.maastricht {
    background-image: url('/images/cities/Maastricht_sunset.jpg');
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

// Removed city count/average price display on homepage

const Homepage: React.FC = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    city: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: ''
  });

  // Slideshow state
  const slideshowImages = [
    '/images/slideshow/start.jpg',
    '/images/slideshow/slide2.jpg',
    '/images/slideshow/slide3.jpg',
    '/images/slideshow/slide4.jpg',
    '/images/slideshow/slide5.jpg'
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [availableImages, setAvailableImages] = useState<string[]>([]);

  // Check which images are available
  useEffect(() => {
    const checkImages = async () => {
      const available: string[] = [];
      for (const img of slideshowImages) {
        try {
          const response = await fetch(img, { method: 'HEAD' });
          if (response.ok) {
            available.push(img);
          }
        } catch (e) {
          // Image doesn't exist, skip it
        }
      }
      setAvailableImages(available.length > 0 ? available : [slideshowImages[0]]);
    };
    checkImages();
  }, []);

  // Auto-advance slideshow every 3 seconds
  useEffect(() => {
    if (availableImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % availableImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [availableImages.length]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    const normalizedCity = (searchData.city || '').trim().replace(/\s+/g, ' ');
    if (normalizedCity) params.append('woningplaats', normalizedCity.toLowerCase());
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
            <TruckIllustration
              $currentImage={availableImages[currentSlide] || slideshowImages[0]}
            >
              {availableImages.length > 1 && (
                <SlideshowDots>
                  {availableImages.map((_, index) => (
                    <Dot
                      key={index}
                      $active={currentSlide === index}
                      onClick={() => setCurrentSlide(index)}
                    />
                  ))}
                </SlideshowDots>
              )}
            </TruckIllustration>
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
              🔍<span className="button-text"> Zoeken</span>
            </SearchButton>
          </SearchForm>
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
              </CityInfo>
            </CityCard>

            <CityCard onClick={() => handleCityClick('rotterdam')}>
              <CityImage className="rotterdam" />
              <CityInfo>
                <CityName>Rotterdam</CityName>
              </CityInfo>
            </CityCard>

            <CityCard onClick={() => handleCityClick('den haag')}>
              <CityImage className="den-haag" />
              <CityInfo>
                <CityName>Den Haag</CityName>
              </CityInfo>
            </CityCard>

            <CityCard onClick={() => handleCityClick('utrecht')}>
              <CityImage className="utrecht" />
              <CityInfo>
                <CityName>Utrecht</CityName>
              </CityInfo>
            </CityCard>

            <CityCard onClick={() => handleCityClick('eindhoven')}>
              <CityImage className="eindhoven" />
              <CityInfo>
                <CityName>Eindhoven</CityName>
              </CityInfo>
            </CityCard>

            <CityCard onClick={() => handleCityClick('maastricht')}>
              <CityImage className="maastricht" />
              <CityInfo>
                <CityName>Maastricht</CityName>
              </CityInfo>
            </CityCard>
          </CitiesGrid>
        </Container>
      </CitiesSection>
    </>
  );
};

export default Homepage;
