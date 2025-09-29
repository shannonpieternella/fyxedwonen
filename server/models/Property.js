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
  // Verhuurder informatie
  verhuurderEmail: {
    type: String,
    required: false // Voor bestaande properties
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
    default: 'pending'
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

PropertySchema.index({ 'address.city': 1, price: 1, rooms: 1 });

module.exports = mongoose.model('Property', PropertySchema);