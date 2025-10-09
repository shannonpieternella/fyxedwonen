import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { API_BASE_URL } from '../../services/api';

const Container = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 20px 0;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%);
  color: white;
  padding: 30px 0;
  text-align: center;
  margin-bottom: 30px;
`;

const HeaderTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 10px;
`;

const HeaderSubtitle = styled.p`
  opacity: 0.9;
`;

const ContentContainer = styled.div`
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
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e40af;
  margin-bottom: 10px;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 1rem;
  font-weight: 500;
`;

const Section = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow: hidden;
  margin-bottom: 30px;
`;

const SectionHeader = styled.div`
  padding: 20px 30px;
  background: #f8f9fa;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin: 0;
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 10px;
`;

const ToggleButton = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border: 2px solid #1e40af;
  border-radius: 5px;
  background: ${props => props.active ? '#1e40af' : 'white'};
  color: ${props => props.active ? 'white' : '#1e40af'};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? '#1d4ed8' : '#ffe6e6'};
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;

  ${props => {
    switch(props.status) {
      case 'approved':
        return `
          background: #d5f4e6;
          color: #27ae60;
        `;
      case 'rejected':
        return `
          background: #ffeaa7;
          color: #d63031;
        `;
      case 'pending':
        return `
          background: #fd79a8;
          color: white;
        `;
      default:
        return `
          background: #ddd;
          color: #666;
        `;
    }
  }}
`;

const PropertyGrid = styled.div`
  display: grid;
  gap: 20px;
  padding: 20px;
`;

const PropertyCard = styled.div`
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 20px;
  background: #fafafa;
`;

const PropertyHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const PropertyInfo = styled.div`
  flex: 1;
`;

const PropertyTitle = styled.h3`
  font-size: 1.2rem;
  color: #333;
  margin: 0 0 5px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const PropertyDetails = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const PropertyPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e40af;
`;

const PropertyActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;

  &.approve {
    background: #27ae60;
    color: white;

    &:hover {
      background: #229954;
    }
  }

  &.reject {
    background: #1e40af;
    color: white;

    &:hover {
      background: #1d4ed8;
    }
  }

  &.view {
    background: #3498db;
    color: white;

    &:hover {
      background: #2980b9;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
`;

const RejectModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const RejectModalContent = styled.div`
  background: white;
  border-radius: 10px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
`;

const RejectModalTitle = styled.h3`
  color: #333;
  margin-bottom: 20px;
`;

const RejectTextarea = styled.textarea`
  width: 100%;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  min-height: 100px;
  font-family: inherit;
  margin-bottom: 20px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #1e40af;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-end;
`;

const ModalButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;

  &.cancel {
    background: #6c757d;
    color: white;

    &:hover {
      background: #5a6268;
    }
  }

  &.confirm {
    background: #1e40af;
    color: white;

    &:hover {
      background: #1d4ed8;
    }
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
  description: string;
  images: string[];
  verhuurderEmail: string;
  verhuurderName: string;
  createdAt: string;
  approvalStatus: string;
  sourceUrl?: string;
  offeredSince?: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'pending' | 'all'>('pending');
  const [rejectModal, setRejectModal] = useState<{ isOpen: boolean; property: Property | null }>({
    isOpen: false,
    property: null
  });
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchProperties();
    fetchAllProperties();
  }, [viewMode]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const endpoint = viewMode === 'pending'
        ? `${API_BASE_URL}/verhuurders/admin/properties/pending`
        : `${API_BASE_URL}/verhuurders/admin/properties/all`;

      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProperties = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/verhuurders/admin/properties/all`);
      if (response.ok) {
        const data = await response.json();
        setAllProperties(data);
      }
    } catch (error) {
      console.error('Error fetching all properties:', error);
    }
  };

  const handleApprove = async (propertyId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/verhuurders/admin/properties/${propertyId}/approve`, {
        method: 'PUT'
      });

      if (response.ok) {
        alert('Property goedgekeurd!');
        fetchProperties(); // Refresh the list
        fetchAllProperties(); // Refresh stats
      } else {
        alert('Er ging iets mis bij het goedkeuren.');
      }
    } catch (error) {
      console.error('Error approving property:', error);
      alert('Er ging iets mis bij het goedkeuren.');
    }
  };

  const handleRejectClick = (property: Property) => {
    setRejectModal({ isOpen: true, property });
    setRejectReason('');
  };

  const handleRejectConfirm = async () => {
    if (!rejectModal.property || !rejectReason.trim()) {
      alert('Vul een reden voor afwijzing in.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/verhuurders/admin/properties/${rejectModal.property._id}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: rejectReason })
      });

      if (response.ok) {
        alert('Property afgewezen!');
        setRejectModal({ isOpen: false, property: null });
        setRejectReason('');
        fetchProperties(); // Refresh the list
        fetchAllProperties(); // Refresh stats
      } else {
        alert('Er ging iets mis bij het afwijzen.');
      }
    } catch (error) {
      console.error('Error rejecting property:', error);
      alert('Er ging iets mis bij het afwijzen.');
    }
  };

  const handleViewProperty = (propertyId: string) => {
    window.open(`/woning/${propertyId}`, '_blank');
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <HeaderTitle>Admin Dashboard</HeaderTitle>
          <HeaderSubtitle>Beheer pending properties</HeaderSubtitle>
        </Header>
        <ContentContainer>
          <LoadingState>
            <h3>Properties laden...</h3>
          </LoadingState>
        </ContentContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderTitle>Admin Dashboard</HeaderTitle>
        <HeaderSubtitle>Beheer pending properties</HeaderSubtitle>
      </Header>

      <ContentContainer>
        <StatsGrid>
          <StatCard>
            <StatNumber>{allProperties.filter(p => !p.approvalStatus || p.approvalStatus === 'pending').length}</StatNumber>
            <StatLabel>Pending Properties</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{allProperties.filter(p => p.approvalStatus === 'approved').length}</StatNumber>
            <StatLabel>Approved Properties</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{allProperties.filter(p => p.approvalStatus === 'rejected').length}</StatNumber>
            <StatLabel>Rejected Properties</StatLabel>
          </StatCard>
        </StatsGrid>

        <Section>
          <SectionHeader>
            <SectionTitle>
              {viewMode === 'pending' ? `Te Beoordelen Properties (${properties.length})` : `Alle Properties (${properties.length})`}
            </SectionTitle>
            <ViewToggle>
              <ToggleButton
                active={viewMode === 'pending'}
                onClick={() => setViewMode('pending')}
              >
                Pending Only
              </ToggleButton>
              <ToggleButton
                active={viewMode === 'all'}
                onClick={() => setViewMode('all')}
              >
                All Properties
              </ToggleButton>
            </ViewToggle>
          </SectionHeader>

          {properties.length > 0 ? (
            <PropertyGrid>
              {properties.map((property) => (
                <PropertyCard key={property._id}>
                  <PropertyHeader>
                    <PropertyInfo>
                      <PropertyTitle>
                        {property.title}
                        <StatusBadge status={property.approvalStatus || 'pending'}>
                          {property.approvalStatus || 'pending'}
                        </StatusBadge>
                      </PropertyTitle>
                      <PropertyDetails>
                        📍 {property.address.street}, {property.address.city}<br/>
                        🏠 {property.rooms} kamers • {property.size} m² • {property.bedrooms} slaapkamers<br/>
                        👤 {property.verhuurderName} ({property.verhuurderEmail})<br/>
                        📅 {new Date(property.createdAt).toLocaleDateString('nl-NL')}
                      </PropertyDetails>
                      {property.description && (
                        <PropertyDetails style={{ marginTop: '10px', fontStyle: 'italic' }}>
                          "{property.description.substring(0, 150)}{property.description.length > 150 ? '...' : ''}"
                        </PropertyDetails>
                      )}
                    </PropertyInfo>
                    <PropertyPrice>
                      € {property.price.toLocaleString()}/maand
                    </PropertyPrice>
                  </PropertyHeader>

                  <PropertyActions>
                    {property.approvalStatus !== 'approved' && (
                      <ActionButton
                        className="approve"
                        onClick={() => handleApprove(property._id)}
                      >
                        ✅ Goedkeuren
                      </ActionButton>
                    )}
                    {property.approvalStatus !== 'rejected' && (
                      <ActionButton
                        className="reject"
                        onClick={() => handleRejectClick(property)}
                      >
                        ❌ Afwijzen
                      </ActionButton>
                    )}
                    <ActionButton
                      className="view"
                      onClick={() => handleViewProperty(property._id)}
                    >
                      👁️ Bekijken
                    </ActionButton>
                  </PropertyActions>
                </PropertyCard>
              ))}
            </PropertyGrid>
          ) : (
            <EmptyState>
              <h3>Geen pending properties</h3>
              <p>Alle properties zijn beoordeeld.</p>
            </EmptyState>
          )}
        </Section>
      </ContentContainer>

      {/* Reject Modal */}
      {rejectModal.isOpen && (
        <RejectModal onClick={() => setRejectModal({ isOpen: false, property: null })}>
          <RejectModalContent onClick={(e) => e.stopPropagation()}>
            <RejectModalTitle>Property Afwijzen</RejectModalTitle>
            <p>Property: <strong>{rejectModal.property?.title}</strong></p>
            <RejectTextarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Geef een reden op waarom deze property wordt afgewezen..."
            />
            <ModalActions>
              <ModalButton
                className="cancel"
                onClick={() => setRejectModal({ isOpen: false, property: null })}
              >
                Annuleren
              </ModalButton>
              <ModalButton
                className="confirm"
                onClick={handleRejectConfirm}
              >
                Afwijzen
              </ModalButton>
            </ModalActions>
          </RejectModalContent>
        </RejectModal>
      )}
    </Container>
  );
};

export default AdminDashboard;
