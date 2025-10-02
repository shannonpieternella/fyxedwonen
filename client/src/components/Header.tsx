import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  position: fixed;
  top: 0;
  z-index: 9999;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  width: 100%;
  position: relative; /* anchor absolute hamburger */

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
    gap: 12px;
    align-items: stretch;
    text-align: left;
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

  @media (max-width: 768px) {
    display: block;
    width: 100%;
    padding: 12px 8px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
    align-items: stretch;
    flex-direction: column;
    gap: 10px;
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

  @media (max-width: 768px) {
    display: block;
    width: 100%;
    text-align: center;
    border: 1px solid #e5e7eb;
    background: #f9fafb;
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

  @media (max-width: 768px) {
    display: block;
    width: 100%;
    text-align: center;
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
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

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const MobileMenuButton = styled.button`
  display: flex; /* always visible */
  flex-direction: column;
  gap: 5px;
  padding: 10px;
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  z-index: 1100;
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  touch-action: manipulation;

  span {
    display: block;
    width: 24px;
    height: 3px;
    background-color: #111827;
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
                <UserInfo>{verhuurderEmail}</UserInfo>
                <LogoutButton onClick={handleVerhuurderLogout}>Uitloggen</LogoutButton>
              </UserMenu>
            ) : isLoggedIn ? (
              <UserMenu>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <UserInfo>{userEmail}</UserInfo>
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

        <MobileMenuButton aria-label="Menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span />
          <span />
          <span />
        </MobileMenuButton>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
