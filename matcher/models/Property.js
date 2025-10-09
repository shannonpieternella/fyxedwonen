const path = require('path');
let mongoose;
try {
  const resolved = require.resolve('mongoose', { paths: [path.join(__dirname, '..', 'server')] });
  mongoose = require(resolved);
} catch (_) {
  mongoose = require('mongoose');
}

const PropertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  address: {
    street: String,
    city: String,
    postalCode: String,
    country: { type: String, default: 'Netherlands' }
  },
  price: { type: Number, required: true },
  size: { type: Number, required: true },
  rooms: { type: Number, required: true },
  bedrooms: { type: Number, default: 1 },
  yearBuilt: { type: Number },
  energyLabel: { type: String, enum: ['A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'] },
  description: { type: String },
  images: [{ type: String }],
  features: [{ type: String }],
  availability: { type: Date, default: Date.now },
  furnished: { type: Boolean, default: false },
  petsAllowed: { type: Boolean, default: false },
  garden: { type: Boolean, default: false },
  parking: { type: Boolean, default: false },
  balcony: { type: Boolean, default: false },
  contact: { name: String, email: String, phone: String },
  source: { type: String, enum: ['kamernet', 'pararius', 'funda', 'huurwoningen', 'manual'], required: true, default: 'manual', index: true },
  sourceUrl: { type: String },
  sourceId: { type: String, index: true },
  scrapedAt: { type: Date, index: true },
  offeredSince: { type: Date, index: true },
  lastCheckedAt: { type: Date, index: true },
  matchingCheckedAt: { type: Date, index: true },
  isStillAvailable: { type: Boolean, default: true, index: true },
  isArchived: { type: Boolean, default: false },
  verhuurderEmail: { type: String },
  verhuurderName: { type: String },
  isActive: { type: Boolean, default: true },
  approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
  approvedAt: { type: Date },
  rejectedAt: { type: Date },
  rejectionReason: { type: String }
}, { timestamps: true });

PropertySchema.index({ 'address.city': 1, price: 1, rooms: 1 });
PropertySchema.index({ source: 1, sourceId: 1 }, { unique: true, sparse: true });
PropertySchema.index({ scrapedAt: -1 });
PropertySchema.index({ isStillAvailable: 1, isArchived: 1 });

module.exports = mongoose.models.Property || mongoose.model('Property', PropertySchema);
