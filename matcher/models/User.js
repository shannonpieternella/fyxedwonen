const path = require('path');
let mongoose;
try {
  const resolved = require.resolve('mongoose', { paths: [path.join(__dirname, '..', 'server')] });
  mongoose = require(resolved);
} catch (_) {
  mongoose = require('mongoose');
}
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  phone: { type: String },
  isActive: { type: Boolean, default: true },
  role: { type: String, enum: ['user', 'landlord', 'admin'], default: 'user' },
  savedProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  welcomeEmailSent: { type: Boolean, default: false },
  paymentCompleted: { type: Boolean, default: false },
  subscription: {
    tier: { type: String, enum: ['1_month', '2_months', '3_months'], default: null },
    status: { type: String, enum: ['active', 'inactive', 'cancelled', 'past_due'], default: 'inactive' },
    startDate: Date,
    endDate: Date,
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    stripePriceId: String,
    cancelAtPeriodEnd: { type: Boolean, default: false }
  },
  preferences: {
    cities: [{ type: String }],
    minPrice: { type: Number, default: 0 },
    maxPrice: { type: Number, default: 3000 },
    minRooms: { type: Number, default: 1 },
    minSize: { type: Number, default: 0 },
    maxSize: { type: Number, default: 500 },
    furnished: { type: String, enum: ['yes', 'no', 'both'], default: 'both' },
    petsAllowed: { type: Boolean, default: false },
    features: [{ type: String, enum: ['balcony', 'garden', 'parking', 'elevator', 'storage'] }],
    availableFrom: Date
  },
  notifications: {
    email: { type: Boolean, default: true },
    frequency: { type: String, enum: ['instant', 'daily', 'weekly'], default: 'instant' },
    lastSent: Date
  },
  onboardingCompleted: { type: Boolean, default: false },
  totalMatches: { type: Number, default: 0 },
  lastActiveAt: { type: Date, default: Date.now }
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
