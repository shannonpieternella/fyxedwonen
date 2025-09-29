import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header';
import Footer from './components/Footer';
import Homepage from './pages/Homepage';
import SearchResults from './pages/SearchResults';
import PropertyDetail from './pages/PropertyDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterForm from './pages/RegisterForm';
import Payment from './pages/Payment';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Contact from './pages/Contact';
import OverOns from './pages/OverOns';
import VoorVerhuurders from './pages/VoorVerhuurders';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import PaymentSuccess from './pages/PaymentSuccess';
import VerhuurderLogin from './pages/verhuurders/VerhuurderLogin';
import VerhuurderRegister from './pages/verhuurders/VerhuurderRegister';
import VerhuurderDashboard from './pages/verhuurders/VerhuurderDashboard';
import AddProperty from './pages/verhuurders/AddProperty';
import EditProperty from './pages/verhuurders/EditProperty';
import VerhuurderMessages from './pages/verhuurders/VerhuurderMessages';
import Messages from './pages/Messages';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import Favorites from './pages/Favorites';
import Conversations from './pages/Conversations';
import GlobalStyles from './styles/GlobalStyles';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
`;

function App() {
  return (
    <Router>
      <GlobalStyles />
      <AppContainer>
        <Header />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/woning" element={<SearchResults />} />
          <Route path="/woning/:id" element={<PropertyDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-form" element={<RegisterForm />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/over-ons" element={<OverOns />} />
          <Route path="/verhuurders" element={<VoorVerhuurders />} />
          <Route path="/voorwaarden" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/verhuurders/login" element={<VerhuurderLogin />} />
          <Route path="/verhuurders/register" element={<VerhuurderRegister />} />
          <Route path="/verhuurders/dashboard" element={<VerhuurderDashboard />} />
          <Route path="/verhuurders/add-property" element={<AddProperty />} />
          <Route path="/verhuurders/edit-property/:id" element={<EditProperty />} />
          <Route path="/verhuurders/messages" element={<VerhuurderMessages />} />
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
    </Router>
  );
}

export default App;
