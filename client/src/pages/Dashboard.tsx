import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { API_BASE_URL } from '../services/api';

const PageContainer = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  padding: 40px 20px;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const WelcomeTitle = styled.h1`
  color: #1f2937;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const WelcomeSubtitle = styled.p`
  color: #6b7280;
  font-size: 16px;
  margin-bottom: 24px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, #38b6ff, #2196f3);
  color: white;
  padding: 24px;
  border-radius: 12px;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  opacity: 0.9;
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ContentSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  color: #1f2937;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SectionIcon = styled.span`
  font-size: 24px;
`;

const FavoritesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FavoriteItem = styled.div`
  display: flex;
  gap: 16px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.2s;

  &:hover {
    border-color: #38b6ff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const PropertyImage = styled.img`
  width: 80px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
`;

const PropertyInfo = styled.div`
  flex: 1;
`;

const PropertyTitle = styled.h3`
  color: #1f2937;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const PropertyDetails = styled.div`
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 8px;
`;

const PropertyPrice = styled.div`
  color: #38b6ff;
  font-size: 16px;
  font-weight: 600;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: #6b7280;

  .icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #1f2937;
  }

  .description {
    margin-bottom: 24px;
  }
`;

const ActionButton = styled(Link)`
  background: #38b6ff;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  display: inline-block;
  transition: background 0.2s;

  &:hover {
    background: #2196f3;
  }
`;

const RemoveButton = styled.button`
  color: #ef4444;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;

  &:hover {
    background: #fee2e2;
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const QuickActions = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ActionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const QuickActionItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-radius: 12px;
  text-decoration: none;
  color: #4b5563;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: #38b6ff;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(56, 182, 255, 0.3);
    border-color: #38b6ff;
  }
`;

const RecentSearches = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const SearchItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
`;

const SearchText = styled.span`
  color: #4b5563;
  font-size: 14px;
`;

const SearchCount = styled.span`
  color: #38b6ff;
  font-size: 12px;
  background: #f0f9ff;
  padding: 2px 8px;
  border-radius: 12px;
`;

const Dashboard: React.FC = () => {
  const [userEmail, setUserEmail] = useState('');
  const [favorites, setFavorites] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<any[]>([]);
  const [totalPropertiesAvailable, setTotalPropertiesAvailable] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and has paid
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const paymentCompleted = localStorage.getItem('paymentCompleted') === 'true';
    const email = localStorage.getItem('userEmail');

    if (!isLoggedIn || !paymentCompleted) {
      navigate('/login');
      return;
    }

    setUserEmail(email || '');

    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    // Fetch total properties available from real database
    const fetchTotalProperties = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/properties?limit=1`);
        const data = await response.json();

        if (response.ok) {
          setTotalPropertiesAvailable(data.pagination?.total || 0);
        } else {
          setTotalPropertiesAvailable(0);
        }
      } catch (error) {
        console.error('Error fetching total properties:', error);
        setTotalPropertiesAvailable(0);
      }
    };

    fetchTotalProperties();

    // Load recent searches - first check localStorage for user's actual searches
    const loadRecentSearches = async () => {
      const savedSearches = localStorage.getItem('recentSearches');
      if (savedSearches) {
        const userSearches = JSON.parse(savedSearches);
        // Update counts for user's searches with real data
        if (userSearches.length > 0) {
          const updatedSearches = await Promise.all(
            userSearches.map(async (search: any) => {
              try {
                const response = await fetch(`${API_BASE_URL}/properties/city/${search.query}`);
                if (response.ok) {
                  const data = await response.json();
                  return { ...search, count: data.count };
                }
                return search;
              } catch (error) {
                console.error('Error updating search count:', error);
                return search;
              }
            })
          );
          setRecentSearches(updatedSearches);
        } else {
          setRecentSearches([]);
        }
      } else {
        // No saved searches - show empty array instead of mock data
        setRecentSearches([]);
      }
    };

    loadRecentSearches();
  }, [navigate]);

  const removeFavorite = (propertyId: string) => {
    const updatedFavorites = favorites.filter(fav => fav.id !== propertyId);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const userFirstName = userEmail.split('@')[0] || 'Gebruiker';

  return (
    <PageContainer>
      <Container>
        <Header>
          <WelcomeTitle>Welkom terug, {userFirstName}!</WelcomeTitle>
          <WelcomeSubtitle>
            Hier is een overzicht van je huurwoning zoektocht en opgeslagen favorieten.
          </WelcomeSubtitle>

          <StatsGrid>
            <StatCard>
              <StatNumber>{favorites.length}</StatNumber>
              <StatLabel>Favoriete woningen</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{recentSearches.length}</StatNumber>
              <StatLabel>Recente zoekopdrachten</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{totalPropertiesAvailable}</StatNumber>
              <StatLabel>Beschikbare woningen</StatLabel>
            </StatCard>
            <StatCard style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
              <StatNumber>✓</StatNumber>
              <StatLabel>Premium Actief</StatLabel>
            </StatCard>
          </StatsGrid>
        </Header>

        <MainContent>
          <ContentSection>
            <SectionTitle>
              <SectionIcon></SectionIcon>
              Favoriete Woningen
            </SectionTitle>

            {favorites.length > 0 ? (
              <FavoritesList>
                {favorites.map((property) => (
                  <FavoriteItem key={property.id}>
                    <PropertyImage
                      src={property.images?.[0] || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=300&h=200&fit=crop'}
                      alt={property.title}
                    />
                    <PropertyInfo>
                      <PropertyTitle>{property.title}</PropertyTitle>
                      <PropertyDetails>
                        {property.address?.city} • {property.rooms} kamers • {property.size} m²
                      </PropertyDetails>
                      <PropertyPrice>€{property.price?.toLocaleString()} per maand</PropertyPrice>
                    </PropertyInfo>
                    <RemoveButton onClick={() => removeFavorite(property.id)}>
                      ×
                    </RemoveButton>
                  </FavoriteItem>
                ))}
              </FavoritesList>
            ) : (
              <EmptyState>
                <div className="icon"></div>
                <div className="title">Nog geen favorieten</div>
                <div className="description">
                  Begin met zoeken en sla interessante woningen op als favoriet.
                </div>
                <ActionButton to="/woning">Woningen Bekijken</ActionButton>
              </EmptyState>
            )}
          </ContentSection>

          <Sidebar>
            <QuickActions>
              <SectionTitle>
                <SectionIcon></SectionIcon>
                Snelle Acties
              </SectionTitle>
              <ActionList>
                <QuickActionItem to="/woning">
                  Woningen Zoeken
                </QuickActionItem>
                <QuickActionItem to="/dashboard/profile">
                  Profiel Bewerken
                </QuickActionItem>
                <QuickActionItem to="/dashboard/search-alerts">
                  Zoek Alerts
                </QuickActionItem>
                <QuickActionItem to="/dashboard/conversations">
                  Mijn Reacties
                </QuickActionItem>
              </ActionList>
            </QuickActions>

            <RecentSearches>
              <SectionTitle>
                <SectionIcon></SectionIcon>
                Recente Zoekopdrachten
              </SectionTitle>
              {recentSearches.length > 0 ? (
                recentSearches.map((search, index) => (
                  <SearchItem key={index}>
                    <SearchText>{search.query}</SearchText>
                    <SearchCount>{search.count} woningen</SearchCount>
                  </SearchItem>
                ))
              ) : (
                <div style={{
                  textAlign: 'center',
                  color: '#6b7280',
                  fontSize: '14px',
                  padding: '20px 0',
                  fontStyle: 'italic'
                }}>
                  Nog geen zoekopdrachten uitgevoerd
                </div>
              )}
            </RecentSearches>
          </Sidebar>
        </MainContent>
      </Container>
    </PageContainer>
  );
};

export default Dashboard;
