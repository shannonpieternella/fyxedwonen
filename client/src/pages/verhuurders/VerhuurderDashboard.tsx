import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 20px 0;
`;

const DashboardHeader = styled.div`
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: white;
  padding: 40px 0;
  text-align: center;
  margin-bottom: 40px;
`;

const HeaderTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 10px;
  font-weight: 600;
`;

const HeaderSubtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: bold;
  color: #1e40af;
  margin-bottom: 10px;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 1.1rem;
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const SectionHeader = styled.div`
  padding: 20px 30px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SectionTitle = styled.h3`
  font-size: 1.3rem;
  color: #333;
  margin: 0;
`;

const SectionContent = styled.div`
  padding: 30px;
`;

const PropertyList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const PropertyItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #fafafa;
`;

const PropertyInfo = styled.div`
  flex: 1;
`;

const PropertyTitle = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
`;

const PropertyDetails = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const PropertyActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  padding: 5px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &.edit {
    background-color: #28a745;
    color: white;

    &:hover {
      background-color: #218838;
    }
  }

  &.delete {
    background-color: #dc3545;
    color: white;

    &:hover {
      background-color: #c82333;
    }
  }
`;

const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const MessageItem = styled.div<{ isRead: boolean }>`
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: ${props => props.isRead ? '#fafafa' : '#fff3cd'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const MessageFrom = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
`;

const MessageProperty = styled.div`
  color: #1e40af;
  font-size: 0.9rem;
  margin-bottom: 8px;
`;

const MessageText = styled.div`
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const MessageDate = styled.div`
  color: #999;
  font-size: 0.8rem;
  margin-top: 8px;
`;

const AddButton = styled.button`
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: #666;
  padding: 40px 20px;
`;

const LogoutButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

interface DashboardStats {
  totalProperties: number;
  unreadMessages: number;
  totalMessages: number;
  joinDate: string;
}

interface Property {
  _id: string;
  title: string;
  price: number;
  address: {
    street?: string;
    city: string;
  };
  createdAt: string;
}

interface Message {
  _id: string;
  userName: string;
  userEmail: string;
  propertyTitle: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const VerhuurderDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    unreadMessages: 0,
    totalMessages: 0,
    joinDate: ''
  });
  const [properties, setProperties] = useState<Property[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verhuurderLoggedIn = localStorage.getItem('verhuurderLoggedIn');
    const verhuurderToken = localStorage.getItem('verhuurderToken');

    if (!verhuurderLoggedIn || !verhuurderToken) {
      navigate('/verhuurders/login');
      return;
    }

    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('verhuurderToken');

      // Fetch dashboard stats
      const dashboardResponse = await fetch('http://localhost:5001/api/verhuurders/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (dashboardResponse.ok) {
        const dashboardData = await dashboardResponse.json();
        setStats(dashboardData.stats);
        setProperties(dashboardData.recentProperties || []);
        setMessages(dashboardData.recentMessages || []);
      }

      // Fetch all properties
      const propertiesResponse = await fetch('http://localhost:5001/api/verhuurders/properties', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (propertiesResponse.ok) {
        const propertiesData = await propertiesResponse.json();
        setProperties(propertiesData.properties || []);
      }

      // Fetch all messages
      const messagesResponse = await fetch('http://localhost:5001/api/verhuurders/messages', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (messagesResponse.ok) {
        const messagesData = await messagesResponse.json();
        setMessages(messagesData.messages || []);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('verhuurderLoggedIn');
    localStorage.removeItem('verhuurderToken');
    localStorage.removeItem('verhuurderEmail');
    navigate('/verhuurders/login');
  };

  const handleMarkMessageRead = async (messageId: string) => {
    try {
      const token = localStorage.getItem('verhuurderToken');

      await fetch(`http://localhost:5001/api/verhuurders/messages/${messageId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Update local state
      setMessages(messages.map(msg =>
        msg._id === messageId ? { ...msg, isRead: true } : msg
      ));

      // Update stats
      setStats(prev => ({
        ...prev,
        unreadMessages: Math.max(0, prev.unreadMessages - 1)
      }));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (!window.confirm('Weet je zeker dat je deze woning wilt verwijderen?')) {
      return;
    }

    try {
      const token = localStorage.getItem('verhuurderToken');

      const response = await fetch(`http://localhost:5001/api/verhuurders/properties/${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setProperties(properties.filter(p => p._id !== propertyId));
        setStats(prev => ({
          ...prev,
          totalProperties: prev.totalProperties - 1
        }));
      }
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  if (loading) {
    return (
      <DashboardContainer>
        <Container>
          <div style={{ textAlign: 'center', padding: '100px 20px' }}>
            <h2>Dashboard laden...</h2>
          </div>
        </Container>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <DashboardHeader>
        <LogoutButton onClick={handleLogout}>Uitloggen</LogoutButton>
        <Container>
          <HeaderTitle>Verhuurder Dashboard</HeaderTitle>
          <HeaderSubtitle>
            Beheer je woningen en berichten
            {!stats.joinDate && (
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                padding: '8px 16px',
                borderRadius: '20px',
                marginTop: '10px',
                fontSize: '0.9rem'
              }}>
                ⏳ Account wordt beoordeeld door admin - je kunt alvast woningen toevoegen
              </div>
            )}
          </HeaderSubtitle>
        </Container>
      </DashboardHeader>

      <Container>
        <StatsGrid>
          <StatCard>
            <StatNumber>{stats.totalProperties}</StatNumber>
            <StatLabel>Actieve Woningen</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.unreadMessages}</StatNumber>
            <StatLabel>Ongelezen Berichten</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.totalMessages}</StatNumber>
            <StatLabel>Totaal Berichten</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.joinDate ? new Date(stats.joinDate).getFullYear() : 'N/A'}</StatNumber>
            <StatLabel>Lid Sinds</StatLabel>
          </StatCard>
        </StatsGrid>

        <SectionGrid>
          <Section>
            <SectionHeader>
              <SectionTitle>Mijn Woningen ({properties.length})</SectionTitle>
              <AddButton onClick={() => navigate('/verhuurders/add-property')}>
                + Woning Toevoegen
              </AddButton>
            </SectionHeader>
            <SectionContent>
              {properties.length > 0 ? (
                <PropertyList>
                  {properties.map((property) => (
                    <PropertyItem key={property._id}>
                      <PropertyInfo>
                        <PropertyTitle>{property.title}</PropertyTitle>
                        <PropertyDetails>
                          €{property.price}/maand • {property.address.city}
                        </PropertyDetails>
                      </PropertyInfo>
                      <PropertyActions>
                        <ActionButton
                          className="edit"
                          onClick={() => navigate(`/verhuurders/edit-property/${property._id}`)}
                        >
                          Bewerken
                        </ActionButton>
                        <ActionButton
                          className="delete"
                          onClick={() => handleDeleteProperty(property._id)}
                        >
                          Verwijderen
                        </ActionButton>
                      </PropertyActions>
                    </PropertyItem>
                  ))}
                </PropertyList>
              ) : (
                <EmptyState>
                  <h4>Geen woningen gevonden</h4>
                  <p>Voeg je eerste woning toe om te beginnen met verhuren.</p>
                </EmptyState>
              )}
            </SectionContent>
          </Section>

          <Section>
            <SectionHeader>
              <SectionTitle>Recente Berichten</SectionTitle>
              <AddButton onClick={() => navigate('/verhuurders/messages')}>
                Alle Berichten
              </AddButton>
            </SectionHeader>
            <SectionContent>
              {messages.length > 0 ? (
                <MessageList>
                  {messages.slice(0, 5).map((message) => (
                    <MessageItem
                      key={message._id}
                      isRead={message.isRead}
                      onClick={() => handleMarkMessageRead(message._id)}
                    >
                      <MessageFrom>{message.userName}</MessageFrom>
                      <MessageProperty>Re: {message.propertyTitle}</MessageProperty>
                      <MessageText>
                        {message.message.length > 100
                          ? `${message.message.substring(0, 100)}...`
                          : message.message
                        }
                      </MessageText>
                      <MessageDate>
                        {new Date(message.createdAt).toLocaleDateString('nl-NL')}
                      </MessageDate>
                    </MessageItem>
                  ))}
                </MessageList>
              ) : (
                <EmptyState>
                  <h4>Geen berichten</h4>
                  <p>Je hebt nog geen berichten ontvangen.</p>
                </EmptyState>
              )}
            </SectionContent>
          </Section>
        </SectionGrid>
      </Container>
    </DashboardContainer>
  );
};

export default VerhuurderDashboard;