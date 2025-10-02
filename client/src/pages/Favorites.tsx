import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ORIGIN } from '../services/api';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 20px 0;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: white;
  padding: 40px 0;
  text-align: center;
  margin-bottom: 30px;
`;

const HeaderTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 10px;
  font-weight: 700;
`;

const HeaderSubtitle = styled.p`
  opacity: 0.9;
  font-size: 1.1rem;
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const FavoritesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  margin-top: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PropertyCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #e5e7eb;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
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
  font-size: 48px;
  font-weight: bold;
`;

const FavoriteHeart = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.1);
  }
`;

const PropertyInfo = styled.div`
  padding: 24px;
`;

const PropertyTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
  line-height: 1.4;
`;

const PropertyDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const PropertyPrice = styled.div`
  font-size: 1.6rem;
  font-weight: 700;
  color: #1e40af;
`;

const PropertyLocation = styled.div`
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
`;

const PropertySpecs = styled.div`
  display: flex;
  gap: 16px;
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 16px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const ViewButton = styled.button`
  flex: 1;
  background: #1e40af;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #1d4ed8;
    transform: translateY(-1px);
  }
`;

const RemoveButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #dc2626;
    transform: translateY(-1px);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: #6b7280;
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 24px;
`;

const EmptyTitle = styled.h3`
  font-size: 24px;
  color: #374151;
  margin-bottom: 16px;
`;

const EmptyText = styled.p`
  font-size: 16px;
  line-height: 1.6;
  max-width: 400px;
  margin: 0 auto;
`;

const BrowseButton = styled.button`
  background: #1e40af;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 24px;
  transition: all 0.3s ease;

  &:hover {
    background: #1d4ed8;
    transform: translateY(-1px);
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
  images: string[];
  addedAt?: string;
}

const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    try {
      const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavorites(savedFavorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = (propertyId: string) => {
    const updatedFavorites = favorites.filter(property => property._id !== propertyId);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const handleViewProperty = (propertyId: string) => {
    navigate(`/woning/${propertyId}`);
  };

  const handleBrowseProperties = () => {
    navigate('/woning?woningplaats=amsterdam');
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <HeaderTitle>Mijn Favorieten</HeaderTitle>
          <HeaderSubtitle>Je opgeslagen woningen</HeaderSubtitle>
        </Header>
        <ContentContainer>
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            Favorieten laden...
          </div>
        </ContentContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderTitle>Mijn Favorieten</HeaderTitle>
        <HeaderSubtitle>
          {favorites.length === 0
            ? 'Je hebt nog geen favorieten toegevoegd'
            : `${favorites.length} ${favorites.length === 1 ? 'favoriet' : 'favorieten'}`
          }
        </HeaderSubtitle>
      </Header>

      <ContentContainer>
        {favorites.length === 0 ? (
          <EmptyState>
            <EmptyIcon>💙</EmptyIcon>
            <EmptyTitle>Geen favorieten gevonden</EmptyTitle>
            <EmptyText>
              Je hebt nog geen woningen toegevoegd aan je favorieten.
              Wanneer je een woning bekijkt, klik op het hartje om deze toe te voegen aan je favorieten.
            </EmptyText>
            <BrowseButton onClick={handleBrowseProperties}>
              Woningen Bekijken
            </BrowseButton>
          </EmptyState>
        ) : (
          <FavoritesGrid>
            {favorites.map((property) => (
              <PropertyCard key={property._id}>
                <PropertyImageContainer>
                  {property.images && property.images[0] ? (
                    <PropertyImage
                      src={property.images[0].startsWith('http') ? property.images[0] : `${API_ORIGIN}${property.images[0]}`}
                      alt={property.title}
                    />
                  ) : (
                    <PropertyImagePlaceholder>🏠</PropertyImagePlaceholder>
                  )}
                  <FavoriteHeart onClick={(e) => {
                    e.stopPropagation();
                    removeFromFavorites(property._id);
                  }}>
                    ❤️
                  </FavoriteHeart>
                </PropertyImageContainer>

                <PropertyInfo>
                  <PropertyTitle>{property.title}</PropertyTitle>

                  <PropertyDetails>
                    <PropertyPrice>€ {property.price.toLocaleString()}/maand</PropertyPrice>
                    <PropertyLocation>{property.address.city}</PropertyLocation>
                  </PropertyDetails>

                  <PropertySpecs>
                    <span>🏠 {property.rooms} kamers</span>
                    <span>🛏️ {property.bedrooms} slaapkamers</span>
                    <span>📐 {property.size} m²</span>
                  </PropertySpecs>

                  <ActionButtons>
                    <ViewButton onClick={() => handleViewProperty(property._id)}>
                      Bekijk Woning
                    </ViewButton>
                    <RemoveButton onClick={() => removeFromFavorites(property._id)}>
                      ❌
                    </RemoveButton>
                  </ActionButtons>
                </PropertyInfo>
              </PropertyCard>
            ))}
          </FavoritesGrid>
        )}
      </ContentContainer>
    </Container>
  );
};

export default Favorites;
