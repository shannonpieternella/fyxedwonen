import axios from 'axios';
import { Property, SearchFilters, User } from '../types';

// Determine API base URL:
// - Use REACT_APP_API_URL if provided
// - Use local server during development
// - Use same-origin '/api' in production (works on mobile and desktop)
export const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5001/api'
    : '/api');

// Origin (without /api) for static resources like images
export const API_ORIGIN =
  (process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.replace(/\/api$/, '')) ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5001'
    : '');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralized error handling: if auth fails, clear token and redirect
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      try {
        localStorage.removeItem('token');
        localStorage.setItem('isLoggedIn', 'false');
      } catch {}
      if (typeof window !== 'undefined') {
        // Avoid infinite loops if already on login
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const propertyApi = {
  getProperties: async (filters: SearchFilters = {}) => {
    const response = await api.get('/properties', { params: filters });
    return response.data;
  },

  getProperty: async (id: string): Promise<Property> => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  createProperty: async (propertyData: Partial<Property>) => {
    const response = await api.post('/properties', propertyData);
    return response.data;
  },

  getCityCount: async (city: string) => {
    const response = await api.get(`/properties/city/${city}`);
    return response.data;
  },
};

export const userApi = {
  register: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
  }) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/users/login', credentials);
    return response.data;
  },
};

// Voorkeuren API (RentBird)
export const preferencesApi = {
  get: async () => {
    const response = await api.get('/preferences');
    return response.data;
  },
  save: async (prefs: any) => {
    const response = await api.post('/preferences', prefs);
    return response.data;
  },
};

// Matches API (RentBird)
export const matchesApi = {
  list: async (params: any = {}) => {
    const response = await api.get('/matches', { params });
    return response.data;
  },
  get: async (id: string) => {
    const response = await api.get(`/matches/${id}`);
    return response.data;
  },
  markInterested: async (id: string) => {
    const response = await api.post(`/matches/${id}/interested`);
    return response.data;
  },
  markViewed: async (id: string) => {
    const response = await api.post(`/matches/${id}/viewed`);
    return response.data;
  },
  dismiss: async (id: string) => {
    const response = await api.post(`/matches/${id}/dismiss`);
    return response.data;
  },
};

// Abonnement API (RentBird)
export const subscriptionApi = {
  status: async () => {
    const response = await api.get('/subscription/status');
    return response.data;
  },
  pricing: async () => {
    const response = await api.get('/subscription/pricing');
    return response.data;
  },
  createCheckout: async (tier: string) => {
    const response = await api.post('/subscription/create-checkout', { tier });
    return response.data;
  },
  verifyPayment: async (sessionId: string) => {
    const response = await api.post('/subscription/verify-payment', { sessionId });
    return response.data;
  },
  cancel: async () => {
    const response = await api.post('/subscription/cancel');
    return response.data;
  },
};

// Dashboard metrics
export const dashboardApi = {
  metrics: async () => {
    const response = await api.get('/dashboard/metrics');
    return response.data;
  },
};

export default api;
