import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { propertyApi } from '../services/api';
import { Property, SearchFilters } from '../types';

const PageContainer = styled.div`
  min-height: 100vh;
  background: #ffffff;
`;

const HeroSection = styled.section`
  height: 300px;
  background-image: url('https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1600&h=600&fit=crop');
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%);
  }
`;

const SearchFormOverlay = styled.div`
  position: relative;
  z-index: 10;
  background: white;
  border-radius: 60px;
  padding: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr auto;
  gap: 1px;
  align-items: center;
  border: 1px solid #f1f5f9;
  max-width: 1000px;
  margin: 0 20px;

  @media (max-width: 1200px) {
    grid-template-columns: 1.5fr 1fr 1fr 1fr auto;
    gap: 2px;
  }

  @media (max-width: 968px) {
    grid-template-columns: 2fr 1fr 1fr auto;
    gap: 4px;
    padding: 6px;
    border-radius: 40px;
    margin: 0 15px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1.5fr 1fr auto;
    gap: 2px;
    padding: 4px;
    border-radius: 30px;
    margin: 0 10px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr auto;
    gap: 1px;
    padding: 4px;
    margin: 0 10px;
  }
`;

const FilterGroup = styled.div`
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
    padding: 12px 8px;

    &:not(:last-child)::after {
      display: none;
    }
  }

  @media (max-width: 768px) {
    padding: 8px 6px;
  }

  @media (max-width: 480px) {
    padding: 6px 4px;
  }
`;

const FilterLabel = styled.label`
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

const FilterInput = styled.input`
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

const FilterSelect = styled.select`
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

  @media (max-width: 968px) {
    width: 100%;
    border-radius: 12px;
    height: 48px;
  }

  @media (max-width: 768px) {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    font-size: 18px;
    margin: 4px;
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 16px;
    margin: 2px;
  }
`;

const ContentSection = styled.section`
  background: #f8fafc;
  min-height: 60vh;
  padding: 40px 0;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const ResultsHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const ResultsCount = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 30px 0;
`;

const ResultsSubHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }
`;

const ResultsCountSmall = styled.span`
  color: #6b7280;
  font-size: 16px;
  font-weight: 500;
`;

const RightControls = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const MapToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  transition: all 0.3s ease;

  &:hover {
    border-color: #38b6ff;
    color: #38b6ff;
  }

  .icon {
    font-size: 16px;
  }
`;

const SortSelect = styled.select`
  padding: 10px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  background: white;
  cursor: pointer;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #38b6ff;
  }
`;

const PropertyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PropertyCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #f1f5f9;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
  }
`;

const PropertyImageContainer = styled.div`
  height: 240px;
  position: relative;
  overflow: hidden;
`;

const PropertyImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${PropertyCard}:hover & {
    transform: scale(1.05);
  }
`;

const PropertyImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #38b6ff, #2196f3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
`;

const PropertyInfo = styled.div`
  padding: 20px;
`;

const PropertyTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CountryFlagSelect = styled.div`
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 500;
  color: #4b5563;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 12px;
  width: fit-content;

  &:hover {
    border-color: #38b6ff;
  }

  &::after {
    content: '▼';
    font-size: 10px;
    color: #6b7280;
    margin-left: auto;
  }
`;

const PropertyAddress = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 40px;
`;

const PageButton = styled.button<{ active?: boolean }>`
  padding: 8px 12px;
  border: 2px solid ${props => props.active ? '#38b6ff' : '#e5e7eb'};
  background: ${props => props.active ? '#38b6ff' : 'white'};
  color: ${props => props.active ? 'white' : '#4b5563'};
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    border-color: #38b6ff;
    background: ${props => props.active ? '#2196f3' : '#38b6ff'};
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FiltersPanel = styled.div<{ isOpen: boolean }>`
  background: white;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
`;

const FiltersHeader = styled.div`
  padding: 16px 20px;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const FiltersTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FilterToggle = styled.button`
  background: none;
  border: none;
  color: #38b6ff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    color: #2196f3;
  }
`;

const FiltersContent = styled.div<{ isOpen: boolean }>`
  padding: ${props => props.isOpen ? '24px 20px' : '0 20px'};
  max-height: ${props => props.isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`;

const FilterGroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const FilterButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #38b6ff;
    color: #38b6ff;
  }

  &.primary {
    background: #38b6ff;
    color: white;
    border-color: #38b6ff;

    &:hover {
      background: #2196f3;
    }
  }
`;

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState<SearchFilters>({
    city: searchParams.get('woningplaats') || '',
    min_prijs: searchParams.get('min_prijs') ? parseInt(searchParams.get('min_prijs')!) : undefined,
    max_prijs: searchParams.get('max_prijs') ? parseInt(searchParams.get('max_prijs')!) : undefined,
    bedrooms: searchParams.get('bedrooms') ? parseInt(searchParams.get('bedrooms')!) : undefined,
    page: 1,
    limit: 20,
    sort: '-createdAt'
  });

  useEffect(() => {
    // Check if there are any search parameters
    const hasSearchParams = searchParams.toString().length > 0;

    if (!hasSearchParams) {
      // Redirect to default search (Amsterdam) when no search parameters
      navigate('/woning?woningplaats=amsterdam', { replace: true });
      return;
    }

    fetchProperties();
  }, [searchParams, navigate]);


  const fetchProperties = async () => {
    try {
      setLoading(true);

      // Build query parameters from URL search params
      const params = new URLSearchParams();
      if (searchParams.get('woningplaats')) params.append('city', searchParams.get('woningplaats')!);
      if (searchParams.get('min_prijs')) params.append('min_prijs', searchParams.get('min_prijs')!);
      if (searchParams.get('max_prijs')) params.append('max_prijs', searchParams.get('max_prijs')!);
      if (searchParams.get('bedrooms')) params.append('bedrooms', searchParams.get('bedrooms')!);
      if (searchParams.get('sort')) params.append('sort', searchParams.get('sort')!);
      if (searchParams.get('page')) params.append('page', searchParams.get('page')!);

      // Call real API instead of mock data
      const response = await fetch(`http://localhost:5001/api/properties?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setProperties(data.properties || []);
        setTotalCount(data.pagination?.total || 0);
        setCurrentPage(data.pagination?.current || 1);
        setTotalPages(data.pagination?.pages || 1);

        // Save search to localStorage for recent searches
        const city = searchParams.get('woningplaats');
        if (city && data.pagination?.total > 0) {
          const savedSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');

          // Remove existing search for same city
          const filteredSearches = savedSearches.filter((s: any) => s.query.toLowerCase() !== city.toLowerCase());

          // Add new search at the beginning
          const newSearch = {
            query: city,
            count: data.pagination.total,
            date: new Date().toISOString()
          };

          // Keep only last 5 searches
          const updatedSearches = [newSearch, ...filteredSearches].slice(0, 5);
          localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
        }
      } else {
        console.error('API Error:', data.message);
        setProperties([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value === '' ? undefined : (name.includes('prijs') || name === 'bedrooms' ? parseInt(value) : value)
    }));
  };

  const applyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (filters.city) params.append('woningplaats', filters.city);
    if (filters.min_prijs) params.append('min_prijs', filters.min_prijs.toString());
    if (filters.max_prijs) params.append('max_prijs', filters.max_prijs.toString());
    if (filters.bedrooms) params.append('bedrooms', filters.bedrooms.toString());
    if (filters.sort) params.append('sort', filters.sort);

    navigate(`/woning?${params.toString()}`);
  };

  const handlePropertyClick = (propertyId: string) => {
    navigate(`/woning/${propertyId}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    navigate(`/woning?${params.toString()}`);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', e.target.value);
    navigate(`/woning?${params.toString()}`);
  };

  if (loading) {
    return (
      <PageContainer>
        <HeroSection>
          <SearchFormOverlay>
            <FilterGroup>
              <FilterLabel>Locatie</FilterLabel>
              <FilterInput
                type="text"
                name="city"
                placeholder="arnhem"
                value={filters.city || searchParams.get('woningplaats') || ''}
                onChange={handleFilterChange}
              />
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Van</FilterLabel>
              <FilterSelect name="min_prijs" value={filters.min_prijs || searchParams.get('min_prijs') || ''} onChange={handleFilterChange}>
                <option value="">€ 275</option>
                <option value="275">€ 275</option>
                <option value="500">€ 500</option>
                <option value="750">€ 750</option>
                <option value="1000">€ 1.000</option>
                <option value="1500">€ 1.500</option>
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Tot</FilterLabel>
              <FilterSelect name="max_prijs" value={filters.max_prijs || searchParams.get('max_prijs') || ''} onChange={handleFilterChange}>
                <option value="">€ 3.495</option>
                <option value="1000">€ 1.000</option>
                <option value="1500">€ 1.500</option>
                <option value="2000">€ 2.000</option>
                <option value="3000">€ 3.000</option>
                <option value="3495">€ 3.495</option>
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Slaapkamers</FilterLabel>
              <FilterSelect name="bedrooms" value={filters.bedrooms || ''} onChange={handleFilterChange}>
                <option value="">Aantal slaapkamers</option>
                <option value="1">1 slaapkamer</option>
                <option value="2">2 slaapkamers</option>
                <option value="3">3 slaapkamers</option>
                <option value="4">4+ slaapkamers</option>
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Oppervlakte</FilterLabel>
              <FilterSelect name="size" value="" onChange={handleFilterChange}>
                <option value="">Aantal m2</option>
                <option value="50">50+ m²</option>
                <option value="75">75+ m²</option>
                <option value="100">100+ m²</option>
                <option value="150">150+ m²</option>
              </FilterSelect>
            </FilterGroup>

            <SearchButton onClick={applyFilters}>
              🔍
            </SearchButton>
          </SearchFormOverlay>
        </HeroSection>
        <ContentSection>
          <Container>
            <div>Loading...</div>
          </Container>
        </ContentSection>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <HeroSection>
        <SearchFormOverlay>
          <FilterGroup>
            <FilterLabel>Locatie</FilterLabel>
            <FilterInput
              type="text"
              name="city"
              placeholder="arnhem"
              value={filters.city || searchParams.get('woningplaats') || ''}
              onChange={handleFilterChange}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Van</FilterLabel>
            <FilterSelect name="min_prijs" value={filters.min_prijs || searchParams.get('min_prijs') || ''} onChange={handleFilterChange}>
              <option value="">€ 275</option>
              <option value="275">€ 275</option>
              <option value="500">€ 500</option>
              <option value="750">€ 750</option>
              <option value="1000">€ 1.000</option>
              <option value="1500">€ 1.500</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Tot</FilterLabel>
            <FilterSelect name="max_prijs" value={filters.max_prijs || searchParams.get('max_prijs') || ''} onChange={handleFilterChange}>
              <option value="">€ 3.495</option>
              <option value="1000">€ 1.000</option>
              <option value="1500">€ 1.500</option>
              <option value="2000">€ 2.000</option>
              <option value="3000">€ 3.000</option>
              <option value="3495">€ 3.495</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Slaapkamers</FilterLabel>
            <FilterSelect name="bedrooms" value={filters.bedrooms || ''} onChange={handleFilterChange}>
              <option value="">Aantal slaapkamers</option>
              <option value="1">1 slaapkamer</option>
              <option value="2">2 slaapkamers</option>
              <option value="3">3 slaapkamers</option>
              <option value="4">4+ slaapkamers</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Oppervlakte</FilterLabel>
            <FilterSelect name="size" value="" onChange={handleFilterChange}>
              <option value="">Aantal m2</option>
              <option value="50">50+ m²</option>
              <option value="75">75+ m²</option>
              <option value="100">100+ m²</option>
              <option value="150">150+ m²</option>
            </FilterSelect>
          </FilterGroup>

          <SearchButton onClick={applyFilters}>
            🔍
          </SearchButton>
        </SearchFormOverlay>
      </HeroSection>

      <ContentSection>
        <Container>
          <ResultsHeader>
            <ResultsCount>{properties.length} huurwoningen gevonden</ResultsCount>
          </ResultsHeader>

          <ResultsSubHeader>
            <ResultsCountSmall>{properties.length} woningen</ResultsCountSmall>

            <RightControls>
              <MapToggle>
                <span className="icon">🗺️</span>
                Kaart
              </MapToggle>

              <SortSelect defaultValue="-createdAt" onChange={handleSortChange}>
                <option value="-createdAt">Nieuwste eerst</option>
                <option value="price">Prijs laag naar hoog</option>
                <option value="-price">Prijs hoog naar laag</option>
                <option value="size">Oppervlakte klein naar groot</option>
                <option value="-size">Oppervlakte groot naar klein</option>
              </SortSelect>
            </RightControls>
          </ResultsSubHeader>

          <PropertyGrid>
            {properties.map((property) => (
              <PropertyCard
                key={property._id}
                onClick={() => handlePropertyClick(property._id)}
              >
                <PropertyImageContainer>
                  {property.images && property.images[0] ? (
                    <PropertyImage src={property.images[0].startsWith('http') ? property.images[0] : `http://localhost:5001${property.images[0]}`} alt={property.title} />
                  ) : (
                    <PropertyImagePlaceholder>🏠</PropertyImagePlaceholder>
                  )}
                </PropertyImageContainer>

                <PropertyInfo>
                  <PropertyTitle>{property.title}</PropertyTitle>

                  <CountryFlagSelect>
                    🇳🇱 Dutch
                  </CountryFlagSelect>

                  <PropertyAddress>
                    {property.address.postalCode} {property.address.city}
                  </PropertyAddress>
                </PropertyInfo>
              </PropertyCard>
            ))}
          </PropertyGrid>

          {totalPages > 1 && (
            <Pagination>
              <PageButton
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Vorige
              </PageButton>

              {[...Array(Math.min(5, totalPages))].map((_, index) => {
                const pageNum = Math.max(1, currentPage - 2) + index;
                if (pageNum > totalPages) return null;

                return (
                  <PageButton
                    key={pageNum}
                    active={pageNum === currentPage}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </PageButton>
                );
              })}

              <PageButton
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Volgende
              </PageButton>
            </Pagination>
          )}
        </Container>
      </ContentSection>
    </PageContainer>
  );
};

export default SearchResults;