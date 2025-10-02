import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { propertyApi } from '../services/api';
import { Property } from '../types';

const PageContainer = styled.div`
  min-height: 100vh;
  background: #ffffff;
`;

const TopSection = styled.section`
  padding: 40px 0;
  background: #ffffff;
`;

const MainLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const ImageSection = styled.div`
  position: relative;
`;

const PropertyImageContainer = styled.div`
  width: 100%;
  height: 500px;
  position: relative;
  background: linear-gradient(135deg, #38b6ff, #2196f3);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  overflow: hidden;
`;

const PropertyImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 24px;
`;

const PropertyImagePlaceholder = styled.div`
  color: white;
  font-size: 48px;
  font-weight: bold;
`;

const ImageOverlay = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.9);
  padding: 12px 20px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 500;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: translateY(-2px);
  }
`;

const PhotoGalleryContainer = styled.div`
  position: relative;
  width: 100%;
  height: 500px;
  border-radius: 24px;
  overflow: hidden;
  background: linear-gradient(135deg, #38b6ff, #2196f3);
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
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
  z-index: 2;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: translateY(-50%) scale(1.1);
  }

  &.prev {
    left: 15px;
  }

  &.next {
    right: 15px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      transform: translateY(-50%);
    }
  }
`;

const PhotoCounter = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  backdrop-filter: blur(10px);
`;

const ThumbnailContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 15px;
  overflow-x: auto;
  padding: 8px 0;
`;

const ThumbnailImage = styled.img<{ active: boolean }>`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid ${props => props.active ? '#38b6ff' : 'transparent'};
  opacity: ${props => props.active ? 1 : 0.7};
  transition: all 0.3s ease;

  &:hover {
    opacity: 1;
    border-color: #38b6ff;
  }
`;

const ContactSection = styled.div`
  position: sticky;
  top: 100px;
  height: fit-content;

  @media (max-width: 1024px) {
    position: static;
  }
`;

const ContactHeader = styled.div`
  margin-bottom: 24px;
`;

const ContactTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
`;

const PropertyTitle = styled.h3`
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 16px;
  line-height: 1.5;
`;

const PropertyPrice = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 24px;

  .period {
    font-size: 16px;
    font-weight: 500;
    color: #6b7280;
  }
`;

const PropertyLocation = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 8px 0 16px 0;
  color: #6b7280;
  font-size: 16px;
  font-weight: 500;
`;

const LocationIcon = styled.span`
  font-size: 18px;
`;

const CityName = styled.span`
  color: #38b6ff;
  font-weight: 600;
`;

const PropertySpecs = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
`;

const SpecItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 8px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
`;

const SpecIcon = styled.div`
  width: 32px;
  height: 32px;
  background: #e5e7eb;
  border-radius: 8px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
`;

const SpecValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
`;

const SpecLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
  text-align: center;
`;

const AvailabilityBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #dcfce7;
  border: 1px solid #bbf7d0;
  border-radius: 12px;
  margin-bottom: 24px;

  &::before {
    content: '✓';
    color: #16a34a;
    font-weight: bold;
  }
`;

const AvailabilityText = styled.span`
  color: #16a34a;
  font-weight: 500;
  font-size: 14px;
`;

const LoginPromptBox = styled.div`
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  margin-bottom: 24px;
`;

const LoginText = styled.p`
  color: #4b5563;
  margin-bottom: 16px;
  line-height: 1.5;
`;

const AuthLinks = styled.div`
  display: flex;
  gap: 4px;
  justify-content: center;
  align-items: center;

  button {
    color: #38b6ff;
    text-decoration: underline;
    font-weight: 500;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    font-size: inherit;

    &:hover {
      color: #2196f3;
    }
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
`;

const SocialIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;

  &.whatsapp {
    background: #25d366;
    &:hover { background: #20b954; }
  }

  &.facebook {
    background: #1877f2;
    &:hover { background: #166fe5; }
  }

  &.email {
    background: #6b7280;
    &:hover { background: #4b5563; }
  }
`;

const FeaturesSection = styled.section`
  padding: 60px 0;
  background: #f8fafc;
`;

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const FeaturesTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 40px;
  text-align: center;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
`;

const FeatureCategory = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 2px solid #e5e7eb;
  transition: all 0.3s ease;

  &:hover {
    border-color: #38b6ff;
    transform: translateY(-2px);
  }
`;

const CategoryTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e5e7eb;
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FeatureItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
`;

const FeatureLabel = styled.span`
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
`;

const FeatureValue = styled.span`
  color: #1f2937;
  font-weight: 600;
  font-size: 14px;
  text-align: right;
`;

const LoginFeatureValue = styled.span`
  color: #38b6ff;
  font-weight: 500;
  font-size: 14px;
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: #2196f3;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const FavoriteButton = styled.button<{ isFavorite: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: 2px solid ${props => props.isFavorite ? '#ef4444' : '#e5e7eb'};
  background: ${props => props.isFavorite ? '#fef2f2' : 'white'};
  color: ${props => props.isFavorite ? '#ef4444' : '#6b7280'};
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${props => props.isFavorite ? '#dc2626' : '#38b6ff'};
    color: ${props => props.isFavorite ? '#dc2626' : '#38b6ff'};
  }
`;

const ShareButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  background: white;
  color: #6b7280;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #38b6ff;
    color: #38b6ff;
  }
`;

const ShareDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const ShareMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
  min-width: 150px;
`;

const ShareMenuItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #f3f4f6;
  }

  &:first-child {
    border-radius: 8px 8px 0 0;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
  }
`;

const ContactForm = styled.form`
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  margin-top: 16px;
`;

const ContactTextarea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  margin-bottom: 16px;

  &:focus {
    outline: none;
    border-color: #38b6ff;
  }
`;

const ContactButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const SubmitButton = styled.button`
  background: #38b6ff;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #2196f3;
  }
`;

const CancelButton = styled.button`
  background: #f3f4f6;
  color: #6b7280;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e5e7eb;
    color: #374151;
  }
`;

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProperty(id);
    }

    // Check authentication status
    const checkAuthStatus = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const paymentCompleted = localStorage.getItem('paymentCompleted') === 'true';
      const verhuurderLoggedIn = localStorage.getItem('verhuurderLoggedIn') === 'true';

      // User is considered logged in if they're either a regular user with payment OR a verhuurder
      setIsLoggedIn((loggedIn && paymentCompleted) || verhuurderLoggedIn);
    };

    checkAuthStatus();

    // Listen for authentication changes
    const handleAuthChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('authStatusChanged', handleAuthChange);

    // Check if property is in favorites
    if (id) {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorite(favorites.some((fav: any) => fav.id === id));
    }

    // Cleanup
    return () => {
      window.removeEventListener('authStatusChanged', handleAuthChange);
    };
  }, [id]);


  const toggleFavorite = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

    if (isFavorite) {
      // Remove from favorites
      const updatedFavorites = favorites.filter((fav: any) => fav.id !== id);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setIsFavorite(false);
    } else {
      // Add to favorites
      if (property) {
        const updatedFavorites = [...favorites, property];
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        setIsFavorite(true);
      }
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (!contactMessage.trim()) {
      alert('Vul een bericht in.');
      return;
    }

    try {
      // Get user info from localStorage
      const userEmail = localStorage.getItem('userEmail');
      const userName = localStorage.getItem('userName') || 'Geïnteresseerde';

      if (!userEmail) {
        alert('Je moet ingelogd zijn om een bericht te sturen.');
        navigate('/login');
        return;
      }

      // Send message to API
      const API_BASE_URL = process.env.REACT_APP_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5001' : 'https://fyxedwonen.nl');
      const response = await fetch(`${API_BASE_URL}/api/properties/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId: id,
          verhuurderEmail: property?.verhuurderEmail || property?.contact?.email,
          userEmail: userEmail,
          userName: userName,
          message: contactMessage,
          propertyTitle: property?.title
        })
      });

      if (response.ok) {
        // Also store locally for user's dashboard
        const applications = JSON.parse(localStorage.getItem('applications') || '[]');
        const newApplication = {
          id: Date.now().toString(),
          propertyId: id,
          propertyTitle: property?.title,
          message: contactMessage,
          date: new Date().toISOString(),
          status: 'sent'
        };

        applications.push(newApplication);
        localStorage.setItem('applications', JSON.stringify(applications));

        // Reset form and show success
        setContactMessage('');
        setShowContactForm(false);
        alert('Je reactie is verzonden naar de verhuurder!');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Er ging iets mis bij het versturen van je bericht.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Er ging iets mis bij het versturen van je bericht.');
    }
  };

  const shareProperty = (platform: string) => {
    const url = window.location.href;
    const title = property?.title || 'Bekijk deze woning';

    switch(platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(title + ' - ' + url)}`);
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
    }
  };

  const nextImage = () => {
    if (property?.images && currentImageIndex < property.images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const fetchProperty = async (propertyId: string) => {
    try {
      setLoading(true);

      // Call real API instead of mock data
      const API_BASE_URL = process.env.REACT_APP_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5001' : 'https://fyxedwonen.nl');
      const response = await fetch(`${API_BASE_URL}/api/properties/${propertyId}`);
      const data = await response.json();

      if (response.ok) {
        setProperty(data as Property);
      } else {
        console.error('API Error:', data.message);
        setProperty(null);
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      setProperty(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div style={{ padding: '100px 0', textAlign: 'center', fontSize: '18px', maxWidth: '1200px', margin: '0 auto' }}>
          Loading...
        </div>
      </PageContainer>
    );
  }

  if (!property) {
    return (
      <PageContainer>
        <div style={{ padding: '100px 0', textAlign: 'center', fontSize: '18px', maxWidth: '1200px', margin: '0 auto' }}>
          Property not found
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <TopSection>
        <MainLayout>
          <ImageSection>
            {property.images && property.images.length > 0 ? (
              <div>
                <PhotoGalleryContainer>
                  <PropertyImage
                    src={property.images[currentImageIndex].startsWith('http')
                      ? property.images[currentImageIndex]
                      : `${process.env.REACT_APP_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5001' : 'https://fyxedwonen.nl')}${property.images[currentImageIndex]}`
                    }
                    alt={`${property.title} - foto ${currentImageIndex + 1}`}
                  />

                  {property.images.length > 1 && (
                    <>
                      <NavigationButton
                        className="prev"
                        onClick={prevImage}
                        disabled={currentImageIndex === 0}
                      >
                        ‹
                      </NavigationButton>

                      <NavigationButton
                        className="next"
                        onClick={nextImage}
                        disabled={currentImageIndex === property.images.length - 1}
                      >
                        ›
                      </NavigationButton>

                      <PhotoCounter>
                        {currentImageIndex + 1} / {property.images.length}
                      </PhotoCounter>
                    </>
                  )}

                  {!isLoggedIn && (
                    <ImageOverlay>
                      Inloggen voor meer foto's
                    </ImageOverlay>
                  )}
                </PhotoGalleryContainer>

                {property.images.length > 1 && (
                  <ThumbnailContainer>
                    {property.images.map((image, index) => (
                      <ThumbnailImage
                        key={index}
                        src={image.startsWith('http')
                          ? image
                          : `${process.env.REACT_APP_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5001' : 'https://fyxedwonen.nl')}${image}`
                        }
                        alt={`Thumbnail ${index + 1}`}
                        active={index === currentImageIndex}
                        onClick={() => goToImage(index)}
                      />
                    ))}
                  </ThumbnailContainer>
                )}
              </div>
            ) : (
              <PropertyImageContainer>
                <PropertyImagePlaceholder>🏠</PropertyImagePlaceholder>
                {!isLoggedIn && (
                  <ImageOverlay>
                    Inloggen voor meer foto's
                  </ImageOverlay>
                )}
              </PropertyImageContainer>
            )}
          </ImageSection>

          <ContactSection>
            <ContactHeader>
              <ContactTitle>Contacteer de verhuurder</ContactTitle>
              <PropertyTitle>
                {property.title}
              </PropertyTitle>
              <PropertyLocation>
                <LocationIcon>📍</LocationIcon>
                <CityName>{property.address.city}</CityName>
              </PropertyLocation>
              <PropertyPrice>
                € {property.price.toLocaleString()} <span className="period">per maand</span>
              </PropertyPrice>

              <ActionButtons>
                <FavoriteButton isFavorite={isFavorite} onClick={toggleFavorite}>
                  <span>{isFavorite ? '❤️' : '🤍'}</span>
                  {isFavorite ? 'Uit favorieten' : 'Aan favorieten toevoegen'}
                </FavoriteButton>

                <ShareDropdown>
                  <ShareButton onClick={() => setShowShareMenu(!showShareMenu)}>
                    <span>📤</span>
                    Delen
                  </ShareButton>
                  {showShareMenu && (
                    <ShareMenu>
                      <ShareMenuItem onClick={() => { shareProperty('whatsapp'); setShowShareMenu(false); }}>
                        <span>📱</span>
                        WhatsApp
                      </ShareMenuItem>
                      <ShareMenuItem onClick={() => { shareProperty('email'); setShowShareMenu(false); }}>
                        <span>📧</span>
                        E-mail
                      </ShareMenuItem>
                      <ShareMenuItem onClick={() => { shareProperty('facebook'); setShowShareMenu(false); }}>
                        <span>📘</span>
                        Facebook
                      </ShareMenuItem>
                    </ShareMenu>
                  )}
                </ShareDropdown>
              </ActionButtons>
            </ContactHeader>

            <PropertySpecs>
              <SpecItem>
                <SpecIcon>🏠</SpecIcon>
                <SpecValue>{property.rooms}</SpecValue>
                <SpecLabel>kamer(s)</SpecLabel>
              </SpecItem>
              <SpecItem>
                <SpecIcon>📅</SpecIcon>
                <SpecValue>{property.yearBuilt || '1950'}</SpecValue>
                <SpecLabel>bouwjaar</SpecLabel>
              </SpecItem>
              <SpecItem>
                <SpecIcon>📐</SpecIcon>
                <SpecValue>{property.size} m²</SpecValue>
                <SpecLabel>oppervlakte</SpecLabel>
              </SpecItem>
            </PropertySpecs>

            <AvailabilityBadge>
              <AvailabilityText>Huis beschikbaar</AvailabilityText>
            </AvailabilityBadge>

            {!isLoggedIn ? (
              <LoginPromptBox>
                <LoginText>
                  Je hebt geen actief abonnement.<br />
                  Je kunt niet reageren op deze woning.
                </LoginText>
                <AuthLinks>
                  <button onClick={() => navigate('/login')}>Inloggen</button> | <button onClick={() => navigate('/register')}>Registreren</button>.
                </AuthLinks>
              </LoginPromptBox>
            ) : (
              <div>
                {!showContactForm ? (
                  <button
                    onClick={() => setShowContactForm(true)}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: '#38b6ff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      marginBottom: '16px'
                    }}
                  >
                    Reageer op deze woning
                  </button>
                ) : (
                  <ContactForm onSubmit={handleContactSubmit}>
                    <h3 style={{ margin: '0 0 16px 0', color: '#1f2937' }}>
                      Interesse in deze woning?
                    </h3>
                    <ContactTextarea
                      placeholder="Vertel iets over jezelf en waarom je geïnteresseerd bent in deze woning..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      required
                    />
                    <ContactButtons>
                      <SubmitButton type="submit">
                        Bericht Verzenden
                      </SubmitButton>
                      <CancelButton
                        type="button"
                        onClick={() => {
                          setShowContactForm(false);
                          setContactMessage('');
                        }}
                      >
                        Annuleren
                      </CancelButton>
                    </ContactButtons>
                  </ContactForm>
                )}
              </div>
            )}

            <SocialIcons>
              <SocialIcon className="whatsapp">
                <span style={{ fontSize: '20px' }}>📱</span>
              </SocialIcon>
              <SocialIcon className="facebook">
                <span style={{ fontSize: '20px' }}>📘</span>
              </SocialIcon>
              <SocialIcon className="email">
                <span style={{ fontSize: '20px' }}>✉️</span>
              </SocialIcon>
            </SocialIcons>
          </ContactSection>
        </MainLayout>
      </TopSection>

      <FeaturesSection>
        <FeaturesContainer>
          <FeaturesTitle>Kenmerken</FeaturesTitle>
          <FeaturesGrid>
            <FeatureCategory>
              <CategoryTitle>Overdracht</CategoryTitle>
              <FeatureList>
                <FeatureItem>
                  <FeatureLabel>Huurprijs</FeatureLabel>
                  <FeatureValue>€ {property.price.toLocaleString()} per maand</FeatureValue>
                </FeatureItem>
                <FeatureItem>
                  <FeatureLabel>Huurovereenkomst</FeatureLabel>
                  <FeatureValue>Onbepaalde tijd</FeatureValue>
                </FeatureItem>
                <FeatureItem>
                  <FeatureLabel>Aangeboden sinds</FeatureLabel>
                  <LoginFeatureValue onClick={() => navigate('/login')}>Log in om te bekijken</LoginFeatureValue>
                </FeatureItem>
                <FeatureItem>
                  <FeatureLabel>Status</FeatureLabel>
                  <FeatureValue>Te huur</FeatureValue>
                </FeatureItem>
                <FeatureItem>
                  <FeatureLabel>Aanvaarding</FeatureLabel>
                  <FeatureValue>Per direct</FeatureValue>
                </FeatureItem>
              </FeatureList>
            </FeatureCategory>

            <FeatureCategory>
              <CategoryTitle>Oppervlakte en inhoud</CategoryTitle>
              <FeatureList>
                <FeatureItem>
                  <FeatureLabel>Woonoppervlakte</FeatureLabel>
                  <FeatureValue>{property.size} m²</FeatureValue>
                </FeatureItem>
                <FeatureItem>
                  <FeatureLabel>Inhoud</FeatureLabel>
                  <FeatureValue>{Math.round(property.size * 3.5)} m³</FeatureValue>
                </FeatureItem>
              </FeatureList>
            </FeatureCategory>

            <FeatureCategory>
              <CategoryTitle>Bouw</CategoryTitle>
              <FeatureList>
                <FeatureItem>
                  <FeatureLabel>Type woning</FeatureLabel>
                  <FeatureValue>Huis</FeatureValue>
                </FeatureItem>
                <FeatureItem>
                  <FeatureLabel>Soort bouw</FeatureLabel>
                  <FeatureValue>Bestaande bouw</FeatureValue>
                </FeatureItem>
                <FeatureItem>
                  <FeatureLabel>Bouwjaar</FeatureLabel>
                  <FeatureValue>{property.yearBuilt || '1950'}</FeatureValue>
                </FeatureItem>
              </FeatureList>
            </FeatureCategory>

            <FeatureCategory>
              <CategoryTitle>Indeling</CategoryTitle>
              <FeatureList>
                <FeatureItem>
                  <FeatureLabel>Aantal kamers</FeatureLabel>
                  <FeatureValue>{property.rooms}</FeatureValue>
                </FeatureItem>
                <FeatureItem>
                  <FeatureLabel>Aantal slaapkamers</FeatureLabel>
                  <FeatureValue>{property.bedrooms}</FeatureValue>
                </FeatureItem>
                <FeatureItem>
                  <FeatureLabel>Aantal badkamers</FeatureLabel>
                  <FeatureValue>1</FeatureValue>
                </FeatureItem>
              </FeatureList>
            </FeatureCategory>

            <FeatureCategory>
              <CategoryTitle>Energie</CategoryTitle>
              <FeatureList>
                <FeatureItem>
                  <FeatureLabel>Energielabel</FeatureLabel>
                  <FeatureValue>{property.energyLabel || 'D'}</FeatureValue>
                </FeatureItem>
                <FeatureItem>
                  <FeatureLabel>Isolatie</FeatureLabel>
                  <FeatureValue>Volledig</FeatureValue>
                </FeatureItem>
              </FeatureList>
            </FeatureCategory>

            <FeatureCategory>
              <CategoryTitle>Overig</CategoryTitle>
              <FeatureList>
                <FeatureItem>
                  <FeatureLabel>Ligging</FeatureLabel>
                  <FeatureValue>Nabij centrum</FeatureValue>
                </FeatureItem>
                <FeatureItem>
                  <FeatureLabel>Schuur/berging</FeatureLabel>
                  <FeatureValue>Eigen berging/ schuur</FeatureValue>
                </FeatureItem>
                <FeatureItem>
                  <FeatureLabel>Parkeergelegenheid</FeatureLabel>
                  <FeatureValue>{property.parking ? 'Eigen parking' : 'Geen parking'}</FeatureValue>
                </FeatureItem>
              </FeatureList>
            </FeatureCategory>
          </FeaturesGrid>
        </FeaturesContainer>
      </FeaturesSection>
    </PageContainer>
  );
};

export default PropertyDetail;