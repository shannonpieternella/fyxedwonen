const Match = require('../models/Match');
const User = require('../models/User');
const Property = require('../models/Property');
const Analytics = require('../models/Analytics');
const { sendMatchNotification } = require('../utils/emailService');

class NotificationService {
  /**
   * Send notification for a new match
   * @param {Object} match - Match document
   * @returns {Promise<void>}
   */
  async sendMatchNotification(match) {
    try {
      // Populate match with user and property details
      await match.populate('user property');

      const user = match.user;
      const property = match.property;

      // Quality gates to avoid sending emails for low-quality or suspicious listings
      // 1) Only approved and available listings
      if (property?.approvalStatus && property.approvalStatus !== 'approved') {
        console.log('   ⏩ Skipping email: property not approved');
        return;
      }
      if (property?.isArchived === true || property?.isStillAvailable === false) {
        console.log('   ⏩ Skipping email: property archived/unavailable');
        return;
      }
      // 2) Allowed sources filter (optional)
      const allowedSources = (process.env.NOTIFY_SOURCES || '')
        .split(',').map(s=>s.trim()).filter(Boolean);
      if (allowedSources.length && !allowedSources.includes(property?.source)) {
        console.log(`   ⏩ Skipping email: source ${property?.source} not in NOTIFY_SOURCES`);
        return;
      }
      // 3) Minimum images (optional)
      const minImages = Math.max(0, parseInt(process.env.NOTIFY_MIN_IMAGES || '0', 10));
      if (minImages > 0) {
        const num = Array.isArray(property?.images) ? property.images.length : 0;
        if (num < minImages) {
          console.log(`   ⏩ Skipping email: only ${num} images (< ${minImages})`);
          return;
        }
      }
      // 4) Image domain blocklist (optional)
      const blocklist = (process.env.NOTIFY_IMAGE_BLOCKLIST || '')
        .split(',').map(s=>s.trim()).filter(Boolean);
      if (blocklist.length && Array.isArray(property?.images) && property.images.length) {
        const bad = property.images.some(url => blocklist.some(b => url.includes(b)));
        if (bad) {
          console.log('   ⏩ Skipping email: image matches blocklist domain');
          return;
        }
      }

      // Check if user wants instant notifications
      if (!user.notifications || !user.notifications.email) {
        console.log(`   ⏩ User ${user.email} has email notifications disabled`);
        return;
      }

      if (user.notifications.frequency !== 'instant') {
        console.log(`   ⏩ User ${user.email} wants ${user.notifications.frequency} notifications, skipping instant`);
        return;
      }

      // Send email
      console.log(`   📧 Sending match notification to ${user.email}...`);
      await sendMatchNotification(user, match, property);

      // Update match status
      match.status = 'notified';
      match.notifiedAt = new Date();
      match.notificationSent = true;
      await match.save();

      // Update analytics
      await Analytics.increment('notifications.emailsSent');

      console.log(`   ✅ Notification sent successfully to ${user.email}`);

    } catch (error) {
      console.error(`   ❌ Error sending notification for match ${match._id}:`, error.message);

      // Update analytics for failed email
      await Analytics.increment('notifications.emailsFailed');

      // Don't throw - we don't want to break the matching process
    }
  }

  /**
   * Send notifications for all new matches
   * Called after matching job completes
   * @param {Array} matches - Array of match documents
   * @returns {Promise<void>}
   */
  async sendBatchNotifications(matches) {
    if (!matches || matches.length === 0) {
      return;
    }

    console.log(`\n📧 Preparing notifications for ${matches.length} new matches...`);

    // Spread notifications: cap per user per batch
    const MAX_PER_USER = parseInt(process.env.MATCH_MAX_INSTANT_PER_BATCH || '3', 10);

    // Group by user and order by hireChance + score + recency
    const byUser = new Map();
    for (const m of matches) {
      const key = String(m.user);
      if (!byUser.has(key)) byUser.set(key, []);
      byUser.get(key).push(m);
    }

    const toSend = [];
    for (const [userId, arr] of byUser.entries()) {
      // Populate minimal fields for ordering
      // Note: m.hireChance is on match; fall back to medium
      const sorted = arr.sort((a, b) => {
        const hcRank = (hc)=> hc==='high'?2 : hc==='medium'?1 : 0;
        const r = hcRank(b.hireChance || 'medium') - hcRank(a.hireChance || 'medium');
        if (r !== 0) return r;
        if (b.score !== a.score) return (b.score||0)-(a.score||0);
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      toSend.push(...sorted.slice(0, Math.max(0, MAX_PER_USER)));
      if (sorted.length > MAX_PER_USER) {
        console.log(`   ↺ Deferring ${sorted.length - MAX_PER_USER} matches for user ${userId} to next run/digest`);
      }
    }

    console.log(`📧 Sending ${toSend.length} notifications (max ${MAX_PER_USER} per user this batch)`);

    let successCount = 0;
    let failedCount = 0;

    for (const match of toSend) {
      try {
        await this.sendMatchNotification(match);
        successCount++;
      } catch (error) {
        console.error(`Failed to send notification for match ${match._id}:`, error.message);
        failedCount++;
      }
    }

    console.log(`\n✅ Notification summary:`);
    console.log(`   - Sent: ${successCount}`);
    console.log(`   - Failed: ${failedCount}\n`);
  }

  /**
   * Send daily digest email to users who prefer daily notifications
   * @returns {Promise<void>}
   */
  async sendDailyDigests() {
    try {
      console.log('📧 Preparing daily digest emails...');

      // Find users with daily notification preference who have new matches
      const users = await User.find({
        'notifications.email': true,
        'notifications.frequency': 'daily',
        'subscription.status': 'active'
      });

      console.log(`   Found ${users.length} users with daily preference`);

      let digestsSent = 0;

      for (const user of users) {
        // Find unnotified matches from last 24 hours
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const matches = await Match.find({
          user: user._id,
          status: 'new',
          createdAt: { $gte: yesterday }
        }).populate('property');

        if (matches.length === 0) {
          continue;
        }

        // TODO: Create daily digest email template
        // For now, send individual notifications
        for (const match of matches) {
          match.user = user; // Attach user object
          await this.sendMatchNotification(match);
        }

        digestsSent++;

        // Update last sent time
        await User.updateOne(
          { _id: user._id },
          { 'notifications.lastSent': new Date() }
        );
      }

      console.log(`✅ Sent ${digestsSent} daily digest emails\n`);

    } catch (error) {
      console.error('Error sending daily digests:', error);
    }
  }

  /**
   * Send weekly digest email to users who prefer weekly notifications
   * @returns {Promise<void>}
   */
  async sendWeeklyDigests() {
    try {
      console.log('📧 Preparing weekly digest emails...');

      // Find users with weekly notification preference
      const users = await User.find({
        'notifications.email': true,
        'notifications.frequency': 'weekly',
        'subscription.status': 'active'
      });

      console.log(`   Found ${users.length} users with weekly preference`);

      let digestsSent = 0;

      for (const user of users) {
        // Find unnotified matches from last 7 days
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);

        const matches = await Match.find({
          user: user._id,
          status: 'new',
          createdAt: { $gte: lastWeek }
        }).populate('property');

        if (matches.length === 0) {
          continue;
        }

        // TODO: Create weekly digest email template
        // For now, send individual notifications
        for (const match of matches) {
          match.user = user;
          await this.sendMatchNotification(match);
        }

        digestsSent++;

        // Update last sent time
        await User.updateOne(
          { _id: user._id },
          { 'notifications.lastSent': new Date() }
        );
      }

      console.log(`✅ Sent ${digestsSent} weekly digest emails\n`);

    } catch (error) {
      console.error('Error sending weekly digests:', error);
    }
  }
}

module.exports = new NotificationService();
