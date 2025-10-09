import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header';
import Footer from './components/Footer';
import RentbirdHome from './pages/RentbirdHome';
import RequireAuth from './components/guards/RequireAuth';
import RequireSubscription from './components/guards/RequireSubscription';
import SearchResults from './pages/SearchResults';
import { Navigate } from 'react-router-dom';
import PropertyDetail from './pages/PropertyDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterForm from './pages/RegisterForm';
import Payment from './pages/Payment';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Contact from './pages/Contact';
import OverOns from './pages/OverOns';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import PaymentSuccess from './pages/PaymentSuccess';
import Voorkeuren from './pages/Voorkeuren';
import Matches from './pages/Matches';
import Abonnement from './pages/Abonnement';
import Messages from './pages/Messages';
import HuurwoningenIndex from './pages/HuurwoningenIndex';
import HuurwoningenCity from './pages/HuurwoningenCity';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import Favorites from './pages/Favorites';
import Conversations from './pages/Conversations';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
// Verhuurder routes verwijderd in nieuw business model
import GlobalStyles from './styles/GlobalStyles';
import { AppThemeProvider } from './styles/AppThemeProvider';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
`;

function App() {
  return (
    <Router>
      <AppThemeProvider>
        <GlobalStyles />
        <AppContainer>
          <Header />
        <Routes>
          <Route path="/" element={<RentbirdHome />} />
          <Route path="/huurwoningen" element={<HuurwoningenIndex />} />
          <Route path="/huurwoningen/:city" element={<HuurwoningenCity />} />
          {/* Huurwoningen route verwijderd → redirect naar dashboard */}
          <Route path="/woning" element={<Navigate to="/dashboard" replace />} />
          <Route path="/woning/:id" element={<PropertyDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-form" element={<RegisterForm />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/preferences" element={<RequireAuth><Voorkeuren /></RequireAuth>} />
          {/* Matches is geïntegreerd in het Dashboard; maak een redirect voor bestaande links */}
          <Route path="/matches" element={<Navigate to="/dashboard" replace />} />
          <Route path="/subscription" element={<RequireAuth><Abonnement /></RequireAuth>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/over-ons" element={<OverOns />} />
          <Route path="/voorwaarden" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/subscription/success" element={<PaymentSuccess />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/conversations" element={<Conversations />} />
          <Route path="/dashboard/favorites" element={<Favorites />} />
          <Route path="/dashboard/conversations" element={<Conversations />} />
        </Routes>
          <Footer />
        </AppContainer>
      </AppThemeProvider>
    </Router>
  );
}

export default App;
