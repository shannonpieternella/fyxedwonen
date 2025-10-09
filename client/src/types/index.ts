export interface Property {
  _id: string;
  title: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  price: number;
  size: number;
  rooms: number;
  bedrooms: number;
  yearBuilt?: number;
  energyLabel?: string;
  description?: string;
  images: string[];
  features?: string[];
  availability: string;
  // Scraper metadata
  source?: string;
  sourceId?: string;
  sourceUrl?: string;
  scrapedAt?: string;
  offeredSince?: string; // ISO date string
  furnished: boolean;
  petsAllowed: boolean;
  garden: boolean;
  parking: boolean;
  balcony: boolean;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  // Verhuurder informatie
  verhuurderEmail?: string;
  verhuurderName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SearchFilters {
  city?: string;
  min_prijs?: number;
  max_prijs?: number;
  bedrooms?: number;
  min_size?: number;
  max_size?: number;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'user' | 'landlord' | 'admin';
}
