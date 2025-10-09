const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
    index: true
  },

  // Property stats
  properties: {
    total: { type: Number, default: 0 },
    new: { type: Number, default: 0 },
    available: { type: Number, default: 0 },
    archived: { type: Number, default: 0 },
    bySource: {
      kamernet: { type: Number, default: 0 },
      pararius: { type: Number, default: 0 },
      funda: { type: Number, default: 0 },
      huurwoningen: { type: Number, default: 0 },
      manual: { type: Number, default: 0 }
    },
    byCity: {
      type: Map,
      of: Number,
      default: {}
    }
  },

  // Match stats
  matches: {
    total: { type: Number, default: 0 },
    new: { type: Number, default: 0 },
    notified: { type: Number, default: 0 },
    viewed: { type: Number, default: 0 },
    interested: { type: Number, default: 0 },
    dismissed: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 }
  },

  // User stats
  users: {
    total: { type: Number, default: 0 },
    new: { type: Number, default: 0 },
    active: { type: Number, default: 0 },
    withPreferences: { type: Number, default: 0 },
    onboardingCompleted: { type: Number, default: 0 }
  },

  // Subscription stats
  subscriptions: {
    active: { type: Number, default: 0 },
    inactive: { type: Number, default: 0 },
    cancelled: { type: Number, default: 0 },
    by_tier: {
      one_month: { type: Number, default: 0 },
      two_months: { type: Number, default: 0 },
      three_months: { type: Number, default: 0 }
    },
    revenue: {
      daily: { type: Number, default: 0 },
      monthly: { type: Number, default: 0 }
    }
  },

  // Notification stats
  notifications: {
    emailsSent: { type: Number, default: 0 },
    emailsFailed: { type: Number, default: 0 }
  },

  // Scraper stats
  scraping: {
    runsCompleted: { type: Number, default: 0 },
    runsFailed: { type: Number, default: 0 },
    propertiesScraped: { type: Number, default: 0 },
    errorsEncountered: { type: Number, default: 0 },
    bySource: {
      kamernet: {
        runs: { type: Number, default: 0 },
        success: { type: Number, default: 0 },
        properties: { type: Number, default: 0 }
      },
      pararius: {
        runs: { type: Number, default: 0 },
        success: { type: Number, default: 0 },
        properties: { type: Number, default: 0 }
      },
      funda: {
        runs: { type: Number, default: 0 },
        success: { type: Number, default: 0 },
        properties: { type: Number, default: 0 }
      },
      huurwoningen: {
        runs: { type: Number, default: 0 },
        success: { type: Number, default: 0 },
        properties: { type: Number, default: 0 }
      }
    }
  }
}, {
  timestamps: true
});

// Static method to get or create today's analytics
AnalyticsSchema.statics.getToday = async function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let analytics = await this.findOne({ date: today });

  if (!analytics) {
    analytics = await this.create({ date: today });
  }

  return analytics;
};

// Static method to increment a counter
AnalyticsSchema.statics.increment = async function(field, value = 1) {
  const analytics = await this.getToday();

  // Handle nested fields (e.g., 'properties.new')
  const update = {};
  update[field] = value;

  await this.updateOne(
    { _id: analytics._id },
    { $inc: update }
  );
};

module.exports = mongoose.model('Analytics', AnalyticsSchema);
