import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ThemeToggle } from './ThemeToggle';

const HeaderContainer = styled.header<{ $scrolled?: boolean }>`
  background-color: rgba(255,255,255,${(p)=>p.$scrolled?0.75:1});
  backdrop-filter: saturate(180%) blur(${(p)=>p.$scrolled? '12px':'0'});
  border-bottom: 1px solid #e5e7eb;
  position: fixed;
  top: 0;
  z-index: 9999;
  width: 100%;
  box-shadow: ${(p)=>p.$scrolled? '0 4px 18px rgba(0,0,0,0.06)':'0 2px 8px rgba(0,0,0,0.05)'};
  `;

const HeaderContent = styled.div`
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0 16px; /* logo netjes links met kleine gutter */
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  position: relative; /* anchor absolute hamburger */

  @media (max-width: 768px) {
    padding: 0 12px;
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
  /* Desktop: verberg het nav-menu (we tonen rechts inline buttons) */
  display: none;

  @media (max-width: 1024px) {
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

const RightCluster = styled.div`
  display: flex; align-items: center; gap: 8px;
`;

const DesktopAuth = styled(AuthButtons)`
  @media (max-width: 1024px){ display: none; }
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
  display: none;
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

  @media (max-width: 1024px) {
    display: flex;
  }

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
  const [userLabel, setUserLabel] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const checkAuthStatus = () => {
      // Check regular user auth
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const email = localStorage.getItem('userEmail') || '';
      const name = localStorage.getItem('userName') || '';
      setIsLoggedIn(loggedIn);
      const label = name || email || '';
      setUserLabel(label);

    };

    checkAuthStatus();

    // Listen for storage changes (when user logs in/out in different tabs)
    window.addEventListener('storage', checkAuthStatus);

    // Listen for custom auth events (for same-tab updates)
    window.addEventListener('authStatusChanged', checkAuthStatus);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('storage', checkAuthStatus);
      window.removeEventListener('authStatusChanged', checkAuthStatus);
    };
  }, []);

  const handleLogout = () => {
    // Clear user auth
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('paymentCompleted');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setUserLabel('');

    // Trigger custom event for real-time updates
    window.dispatchEvent(new Event('authStatusChanged'));

    navigate('/');
  };


  return (
    <HeaderContainer $scrolled={scrolled}>
      <HeaderContent>
        <Logo to="/">
          <img src="/logo.png" alt="Fyxed Wonen" />
        </Logo>

        {/* Mobile menu (in uitklap) */}
        <Nav isOpen={isMenuOpen}>
          <AuthButtons>
            {isLoggedIn ? (
              <UserMenu>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <UserInfo>● {userLabel || 'Online'}</UserInfo>
                <LogoutButton onClick={handleLogout}>Uitloggen</LogoutButton>
              </UserMenu>
            ) : (
              <LoginButton to="/login">Inloggen</LoginButton>
            )}
          </AuthButtons>
        </Nav>

        {/* Desktop rechts: auth + thema-toggle */}
        <RightCluster>
          <DesktopAuth>
            {isLoggedIn ? (
              <UserMenu>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <UserInfo>● {userLabel || 'Online'}</UserInfo>
                <LogoutButton onClick={handleLogout}>Uitloggen</LogoutButton>
              </UserMenu>
            ) : (
              <LoginButton to="/login">Inloggen</LoginButton>
            )}
          </DesktopAuth>
          <ThemeToggle />
        </RightCluster>
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
