const Match = require('../models/Match');
const User = require('../models/User');
const Property = require('../models/Property');
const Analytics = require('../models/Analytics');
const notificationService = require('./notificationService');

class MatchingService {
  /**
   * Find matches for a new property
   * @param {Object} property - Property document
   * @returns {Promise<Array>} - Array of created matches
   */
  async findMatchesForProperty(property) {
    try {
      console.log(`🔍 Finding matches for property: ${property.title} in ${property.address.city}`);

      // Build a flexible user query (configurable via env):
      // - Require onboarding/subscription only if enabled
      // - City match (supports case-insensitive match when enabled)
      // - Only filter by price when property.price is a valid number
      const requireActive = (process.env.MATCH_REQUIRE_ACTIVE_SUBSCRIPTION || '1') === '1';
      const requireOnboarding = (process.env.MATCH_REQUIRE_ONBOARDING || '1') === '1';
      const cityCaseInsensitive = (process.env.MATCH_CITY_CASE_INSENSITIVE || '0') === '1';

      const userQuery = {};
      if (requireOnboarding) userQuery.onboardingCompleted = true;
      if (requireActive) userQuery['subscription.status'] = 'active';

      const city = property?.address?.city || '';
      if (cityCaseInsensitive) {
        // Case-insensitive exact match against elements of preferences.cities (array)
        const escaped = city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        userQuery['preferences.cities'] = new RegExp(`^${escaped}$`, 'i');
      } else {
        userQuery['preferences.cities'] = city;
      }
      if (typeof property?.price === 'number' && !Number.isNaN(property.price)) {
        userQuery['preferences.minPrice'] = { $lte: property.price };
        userQuery['preferences.maxPrice'] = { $gte: property.price };
      }

      const potentialUsers = await User.find(userQuery);

      console.log(`   Found ${potentialUsers.length} potential users`);
      if ((process.env.MATCH_DEBUG || '0') === '1') {
        console.log('   userQuery =', JSON.stringify(userQuery));
      }

      const matches = [];

      for (const user of potentialUsers) {
        // Calculate match score
        const { score, reasons } = this.calculateMatchScore(property, user.preferences);

        // Only create match if score >= threshold
        const minScore = parseInt(process.env.MATCH_MIN_SCORE || '60', 10);
        if (score >= minScore) {
          try {
            // Check if match already exists
            const existingMatch = await Match.findOne({
              user: user._id,
              property: property._id
            });

            if (existingMatch) {
              console.log(`   ⏩ Match already exists for user ${user.email}`);
              continue;
            }

            // Chance based on recency
            const offeredSince = property.offeredSince || property.scrapedAt || new Date();
            const ageHours = Math.max(0, (Date.now() - new Date(offeredSince).getTime()) / 36e5);
            let hireChance = 'medium';
            if (ageHours <= 24) hireChance = 'high';
            else if (ageHours > 24*7) hireChance = 'low';

            // Add reason for user transparency
            if (hireChance === 'high') {
              reasons.push('Nieuw aanbod — hoge kans op huur');
            } else if (hireChance === 'low') {
              reasons.push('Ouder aanbod — lagere kans op huur');
            }

            // Create new match
            const match = await Match.create({
              user: user._id,
              property: property._id,
              score,
              matchReasons: reasons,
              hireChance,
              status: 'new'
            });

            matches.push(match);

            // Update user's total matches count
            await User.updateOne(
              { _id: user._id },
              { $inc: { totalMatches: 1 } }
            );

            console.log(`   ✅ Created match for ${user.email} (${score}% match)`);

          } catch (error) {
            if (error.code === 11000) {
              // Duplicate key error (match already exists)
              console.log(`   ⏩ Duplicate match skipped for user ${user.email}`);
            } else {
              console.error(`   ❌ Error creating match for user ${user.email}:`, error.message);
            }
          }
        }
      }

      // Update analytics
      if (matches.length > 0) {
        await Analytics.increment('matches.total', matches.length);
        await Analytics.increment('matches.new', matches.length);
      }

      console.log(`   🎯 Created ${matches.length} new matches`);

      // Send instant notifications for new matches
      if (matches.length > 0) {
        await notificationService.sendBatchNotifications(matches);
      }

      return matches;

    } catch (error) {
      console.error('❌ Error in findMatchesForProperty:', error);
      throw error;
    }
  }

  /**
   * Calculate match score between property and user preferences
   * @param {Object} property - Property document
   * @param {Object} preferences - User preferences object
   * @returns {Object} - { score, reasons }
   */
  calculateMatchScore(property, preferences) {
    let score = 0;
    const reasons = [];

    // 1. CITY MATCH (Must have - already filtered in query)
    // City is guaranteed to match if we got here

    // 2. PRICE RANGE (30 points)
    if (property.price >= preferences.minPrice && property.price <= preferences.maxPrice) {
      score += 30;
      reasons.push(`Binnen budget (€${property.price})`);
    }

    // 3. ROOMS (15 points)
    if (property.rooms >= preferences.minRooms) {
      score += 15;
      reasons.push(`${property.rooms} kamers (minimaal ${preferences.minRooms})`);
    } else {
      // Partial credit if close
      const roomDiff = preferences.minRooms - property.rooms;
      if (roomDiff === 1) {
        score += 7;
      }
    }

    // 4. SIZE (15 points)
    if (property.size >= preferences.minSize && property.size <= preferences.maxSize) {
      score += 15;
      reasons.push(`${property.size}m² (binnen bereik)`);
    } else if (property.size >= preferences.minSize) {
      // Partial credit if above min
      score += 10;
      reasons.push(`${property.size}m²`);
    }

    // 5. FURNISHED (10 points)
    if (preferences.furnished === 'both') {
      score += 10;
    } else if (
      (preferences.furnished === 'yes' && property.furnished) ||
      (preferences.furnished === 'no' && !property.furnished)
    ) {
      score += 10;
      reasons.push(property.furnished ? 'Gemeubileerd' : 'Ongemeubileerd');
    }

    // 6. PETS (10 points)
    if (!preferences.petsAllowed || property.petsAllowed) {
      score += 10;
      if (preferences.petsAllowed && property.petsAllowed) {
        reasons.push('Huisdieren toegestaan');
      }
    }

    // 7. FEATURES (20 points - 5 per feature match)
    let featureMatches = 0;
    if (preferences.features && preferences.features.length > 0) {
      for (const feature of preferences.features) {
        if (property[feature] === true) {
          featureMatches++;
          const featureNames = {
            'balcony': 'Balkon',
            'garden': 'Tuin',
            'parking': 'Parkeren',
            'elevator': 'Lift',
            'storage': 'Berging'
          };
          reasons.push(featureNames[feature] || feature);
        }
      }
      score += Math.min(featureMatches * 5, 20);
    } else {
      // No feature preferences, give full points
      score += 20;
    }

    // Ensure score doesn't exceed 100
    score = Math.min(Math.round(score), 100);

    return { score, reasons };
  }

  /**
   * Get top matches for a user
   * @param {String} userId - User ID
   * @param {Number} limit - Number of matches to return
   * @returns {Promise<Array>} - Array of matches with property details
   */
  async getTopMatchesForUser(userId, limit = 10) {
    const matches = await Match.find({ user: userId })
      .sort({ score: -1, createdAt: -1 })
      .limit(limit)
      .populate('property')
      .lean();

    return matches;
  }

  /**
   * Get match statistics for admin dashboard
   * @returns {Promise<Object>} - Match statistics
   */
  async getMatchStats() {
    const stats = await Match.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          averageScore: { $avg: '$score' },
          byStatus: {
            $push: '$status'
          }
        }
      }
    ]);

    if (stats.length === 0) {
      return {
        total: 0,
        averageScore: 0,
        byStatus: {
          new: 0,
          notified: 0,
          viewed: 0,
          interested: 0,
          dismissed: 0
        }
      };
    }

    const statusCounts = stats[0].byStatus.reduce((acc, status) => {
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return {
      total: stats[0].total,
      averageScore: Math.round(stats[0].averageScore),
      byStatus: {
        new: statusCounts.new || 0,
        notified: statusCounts.notified || 0,
        viewed: statusCounts.viewed || 0,
        interested: statusCounts.interested || 0,
        dismissed: statusCounts.dismissed || 0
      }
    };
  }
}

module.exports = new MatchingService();
