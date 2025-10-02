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

export default api;
