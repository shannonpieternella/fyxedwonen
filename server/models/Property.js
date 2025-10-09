const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  address: {
    street: String,
    city: String,
    postalCode: String,
    country: { type: String, default: 'Netherlands' }
  },
  price: {
    type: Number,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  rooms: {
    type: Number,
    required: true
  },
  bedrooms: {
    type: Number,
    default: 1
  },
  yearBuilt: {
    type: Number
  },
  energyLabel: {
    type: String,
    enum: ['A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G']
  },
  description: {
    type: String
  },
  images: [{
    type: String
  }],
  features: [{
    type: String
  }],
  availability: {
    type: Date,
    default: Date.now
  },
  furnished: {
    type: Boolean,
    default: false
  },
  petsAllowed: {
    type: Boolean,
    default: false
  },
  garden: {
    type: Boolean,
    default: false
  },
  parking: {
    type: Boolean,
    default: false
  },
  balcony: {
    type: Boolean,
    default: false
  },
  contact: {
    name: String,
    email: String,
    phone: String
  },
  // Scraping metadata (for automated listings)
  source: {
    type: String,
    enum: ['kamernet', 'pararius', 'funda', 'huurwoningen', 'manual'],
    required: true,
    default: 'manual',
    index: true
  },
  sourceUrl: {
    type: String
  },
  sourceId: {
    type: String,
    index: true
  },
  scrapedAt: {
    type: Date,
    index: true
  },
  offeredSince: {
    type: Date,
    index: true
  },
  lastCheckedAt: {
    type: Date,
    index: true
  },
  matchingCheckedAt: {
    type: Date,
    index: true
  },
  isStillAvailable: {
    type: Boolean,
    default: true,
    index: true
  },
  isArchived: {
    type: Boolean,
    default: false
  },

  // Verhuurder informatie (deprecated for scraped listings)
  verhuurderEmail: {
    type: String,
    required: false
  },
  verhuurderName: {
    type: String,
    required: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved' // Auto-approve scraped listings
  },
  approvedAt: {
    type: Date
  },
  rejectedAt: {
    type: Date
  },
  rejectionReason: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for performance - compound indexes voor snellere queries
PropertySchema.index({ 'address.city': 1, price: 1, rooms: 1 });
PropertySchema.index({ 'address.city': 1, scrapedAt: -1 }); // Stad + recentheid
PropertySchema.index({ 'address.city': 1, price: 1 }); // Stad + prijs sorting
PropertySchema.index({ source: 1, sourceId: 1 }, { unique: true, sparse: true }); // Prevent duplicates
PropertySchema.index({ scrapedAt: -1 }); // Voor finding new listings
PropertySchema.index({ isStillAvailable: 1, isArchived: 1 }); // Voor cleanup queries
PropertySchema.index({ price: 1 }); // Voor prijs sorting
PropertySchema.index({ size: 1 }); // Voor oppervlakte sorting

module.exports = mongoose.model('Property', PropertySchema);
