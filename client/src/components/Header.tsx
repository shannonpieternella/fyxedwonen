import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;

  @media (max-width: 768px) {
    padding: 0 15px;
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;

  img {
    height: 45px;
    width: auto;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }
  }

  @media (max-width: 768px) {
    img {
      height: 40px;
    }
  }
`;

const Nav = styled.nav<{ isOpen?: boolean }>`
  display: flex;
  align-items: center;
  gap: 30px;

  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    position: absolute;
    top: 70px;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    padding: 20px;
    border-bottom: 1px solid #e5e7eb;
    gap: 20px;
  }
`;

const NavLink = styled(Link)`
  color: #4b5563;
  font-weight: 500;
  padding: 8px 0;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;

  &:hover {
    color: #38b6ff;
    border-bottom-color: #38b6ff;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const LoginButton = styled(Link)`
  color: #4b5563;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;

  &:hover {
    background-color: #f3f4f6;
    color: #38b6ff;
  }
`;

const RegisterButton = styled(Link)`
  background-color: #38b6ff;
  color: white;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 6px;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;

  &:hover {
    background-color: #2196f3;
    transform: translateY(-1px);
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const UserInfo = styled.span`
  color: #16a34a;
  font-weight: 600;
  font-size: 14px;
  background: #f0fdf4;
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid #bbf7d0;

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 4px 8px;
  }
`;

const LogoutButton = styled.button`
  color: #ef4444;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #fef2f2;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  flex-direction: column;
  gap: 4px;
  padding: 8px;

  @media (max-width: 768px) {
    display: flex;
  }

  span {
    width: 24px;
    height: 2px;
    background-color: #4b5563;
    transition: all 0.3s ease;
  }
`;

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVerhuurderLoggedIn, setIsVerhuurderLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [verhuurderEmail, setVerhuurderEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = () => {
      // Check regular user auth
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const email = localStorage.getItem('userEmail') || '';
      setIsLoggedIn(loggedIn);
      setUserEmail(email);

      // Check verhuurder auth
      const verhuurderLoggedIn = localStorage.getItem('verhuurderLoggedIn') === 'true';
      const verhuurderEmailStored = localStorage.getItem('verhuurderEmail') || '';
      setIsVerhuurderLoggedIn(verhuurderLoggedIn);
      setVerhuurderEmail(verhuurderEmailStored);
    };

    checkAuthStatus();

    // Listen for storage changes (when user logs in/out in different tabs)
    window.addEventListener('storage', checkAuthStatus);

    // Listen for custom auth events (for same-tab updates)
    window.addEventListener('authStatusChanged', checkAuthStatus);

    return () => {
      window.removeEventListener('storage', checkAuthStatus);
      window.removeEventListener('authStatusChanged', checkAuthStatus);
    };
  }, []);

  const handleLogout = () => {
    // Clear user auth
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('paymentCompleted');
    setIsLoggedIn(false);
    setUserEmail('');

    // Trigger custom event for real-time updates
    window.dispatchEvent(new Event('authStatusChanged'));

    navigate('/');
  };

  const handleVerhuurderLogout = () => {
    // Clear verhuurder auth
    localStorage.removeItem('verhuurderLoggedIn');
    localStorage.removeItem('verhuurderEmail');
    localStorage.removeItem('verhuurderToken');
    setIsVerhuurderLoggedIn(false);
    setVerhuurderEmail('');

    // Trigger custom event for real-time updates
    window.dispatchEvent(new Event('authStatusChanged'));

    navigate('/verhuurders/login');
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">
          <img src="/logo.png" alt="Fyxed Wonen" />
        </Logo>

        <Nav isOpen={isMenuOpen}>
          <NavLink to="/woning">Huurwoningen</NavLink>

          <AuthButtons>
            {isVerhuurderLoggedIn ? (
              <UserMenu>
                <NavLink to="/verhuurders/dashboard">Dashboard</NavLink>
                <UserInfo>🟠 {verhuurderEmail}</UserInfo>
                <LogoutButton onClick={handleVerhuurderLogout}>Uitloggen</LogoutButton>
              </UserMenu>
            ) : isLoggedIn ? (
              <UserMenu>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <UserInfo>🟢 {userEmail}</UserInfo>
                <LogoutButton onClick={handleLogout}>Uitloggen</LogoutButton>
              </UserMenu>
            ) : (
              <>
                <LoginButton to="/login">Inloggen</LoginButton>
                <RegisterButton to="/register">Registreren</RegisterButton>
              </>
            )}
          </AuthButtons>
        </Nav>

        <MobileMenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span />
          <span />
          <span />
        </MobileMenuButton>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;