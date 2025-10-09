const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    index: true
  },
  status: {
    type: String,
    enum: ['new', 'notified', 'viewed', 'interested', 'dismissed'],
    default: 'new',
    index: true
  },
  hireChance: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium',
    index: true
  },

  // Match transparency - why it matched
  matchReasons: [{
    type: String
  }],

  // Notification tracking
  notifiedAt: Date,
  notificationSent: {
    type: Boolean,
    default: false
  },

  // User actions
  viewedAt: Date,
  interestedAt: Date,
  dismissedAt: Date,

  // Analytics
  clickedSourceUrl: {
    type: Boolean,
    default: false
  },
  clickedAt: Date
}, {
  timestamps: true
});

// Indexes for performance
MatchSchema.index({ user: 1, status: 1 }); // User's matches by status
MatchSchema.index({ user: 1, score: -1 }); // User's matches by score
MatchSchema.index({ property: 1 }); // Property's matches
MatchSchema.index({ user: 1, property: 1 }, { unique: true }); // Prevent duplicate matches
MatchSchema.index({ createdAt: -1 }); // Recent matches
MatchSchema.index({ status: 1, notifiedAt: 1 }); // For notification jobs

// Virtual for property details (populated)
MatchSchema.virtual('propertyDetails', {
  ref: 'Property',
  localField: 'property',
  foreignField: '_id',
  justOne: true
});

// Virtual for user details (populated)
MatchSchema.virtual('userDetails', {
  ref: 'User',
  localField: 'user',
  foreignField: '_id',
  justOne: true
});

module.exports = mongoose.model('Match', MatchSchema);
