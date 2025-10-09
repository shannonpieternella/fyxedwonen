const cron = require('node-cron');
const Property = require('../models/Property');
const User = require('../models/User');
const Match = require('../models/Match');
const Analytics = require('../models/Analytics');
const notificationService = require('../services/notificationService');
const matchingService = require('../services/matchingService');

class Scheduler {
  constructor() {
    this.tasks = [];
  }

  /**
   * Daily analytics generation job
   * Runs at midnight every day
   */
  startDailyAnalytics() {
    const task = cron.schedule('0 0 * * *', async () => {
      console.log('\n⏰ Running daily analytics job...');

      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const analytics = await Analytics.getToday();

        // Count total users
        const totalUsers = await User.countDocuments();
        const newUsersToday = await User.countDocuments({
          createdAt: { $gte: today }
        });
        const activeSubscriptions = await User.countDocuments({
          'subscription.status': 'active'
        });
        const withPreferences = await User.countDocuments({
          onboardingCompleted: true
        });

        // Count properties
        const totalProperties = await Property.countDocuments({
          isStillAvailable: true
        });
        const newPropertiesToday = await Property.countDocuments({
          scrapedAt: { $gte: today }
        });
        const availableProperties = await Property.countDocuments({
          isStillAvailable: true,
          approvalStatus: 'approved'
        });

        // Count by source
        const propertiesBySource = await Property.aggregate([
          { $match: { isStillAvailable: true } },
          {
            $group: {
              _id: '$source',
              count: { $sum: 1 }
            }
          }
        ]);

        const sourceStats = {};
        propertiesBySource.forEach(item => {
          sourceStats[item._id] = item.count;
        });

        // Count matches
        const totalMatches = await Match.countDocuments();
        const newMatchesToday = await Match.countDocuments({
          createdAt: { $gte: today }
        });

        const matchStats = await Match.aggregate([
          { $match: { createdAt: { $gte: today } } },
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 }
            }
          }
        ]);

        const matchStatusCounts = {};
        matchStats.forEach(item => {
          matchStatusCounts[item._id] = item.count;
        });

        const avgScore = await Match.aggregate([
          { $match: { createdAt: { $gte: today } } },
          {
            $group: {
              _id: null,
              averageScore: { $avg: '$score' }
            }
          }
        ]);

        // Update analytics document
        analytics.users = {
          total: totalUsers,
          new: newUsersToday,
          active: activeSubscriptions,
          withPreferences: withPreferences,
          onboardingCompleted: withPreferences
        };

        analytics.properties = {
          total: totalProperties,
          new: newPropertiesToday,
          available: availableProperties,
          archived: 0, // TODO: Count archived
          bySource: sourceStats
        };

        analytics.matches = {
          total: totalMatches,
          new: newMatchesToday,
          notified: matchStatusCounts.notified || 0,
          viewed: matchStatusCounts.viewed || 0,
          interested: matchStatusCounts.interested || 0,
          dismissed: matchStatusCounts.dismissed || 0,
          averageScore: avgScore.length > 0 ? Math.round(avgScore[0].averageScore) : 0
        };

        analytics.subscriptions = {
          active: activeSubscriptions,
          inactive: totalUsers - activeSubscriptions,
          cancelled: 0 // TODO: Count cancelled
        };

        await analytics.save();

        console.log('✅ Daily analytics generated successfully\n');

      } catch (error) {
        console.error('❌ Error generating daily analytics:', error);
      }
    });

    this.tasks.push(task);
    console.log('✅ Daily analytics job scheduled (runs at midnight)');
  }

  /**
   * Cleanup old listings job
   * Runs daily at 2 AM
   */
  startCleanupJob() {
    const task = cron.schedule('0 2 * * *', async () => {
      console.log('\n⏰ Running cleanup job...');

      try {
        const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        // Mark properties as unavailable if not checked in 48 hours
        const unavailableResult = await Property.updateMany(
          {
            lastCheckedAt: { $lt: twoDaysAgo },
            isStillAvailable: true
          },
          {
            $set: { isStillAvailable: false }
          }
        );

        console.log(`   Marked ${unavailableResult.modifiedCount} properties as unavailable`);

        // Archive properties not checked in 7 days
        const archivedResult = await Property.updateMany(
          {
            lastCheckedAt: { $lt: sevenDaysAgo },
            isArchived: false
          },
          {
            $set: {
              isStillAvailable: false,
              isArchived: true
            }
          }
        );

        console.log(`   Archived ${archivedResult.modifiedCount} old properties`);

        // Deactivate expired subscriptions
        const now = new Date();
        const expiredSubs = await User.updateMany(
          {
            'subscription.status': 'active',
            'subscription.endDate': { $lt: now }
          },
          {
            $set: { 'subscription.status': 'inactive' }
          }
        );

        console.log(`   Deactivated ${expiredSubs.modifiedCount} expired subscriptions`);

        console.log('✅ Cleanup job completed\n');

      } catch (error) {
        console.error('❌ Error in cleanup job:', error);
      }
    });

    this.tasks.push(task);
    console.log('✅ Cleanup job scheduled (runs daily at 2 AM)');
  }

  /**
   * Daily digest notifications
   * Runs at 9 AM every day
   */
  startDailyDigestJob() {
    const task = cron.schedule('0 9 * * *', async () => {
      console.log('\n⏰ Running daily digest job...');

      try {
        await notificationService.sendDailyDigests();
        console.log('✅ Daily digest job completed\n');
      } catch (error) {
        console.error('❌ Error in daily digest job:', error);
      }
    });

    this.tasks.push(task);
    console.log('✅ Daily digest job scheduled (runs at 9 AM)');
  }

  /**
   * Weekly digest notifications
   * Runs at 10 AM every Monday
   */
  startWeeklyDigestJob() {
    const task = cron.schedule('0 10 * * 1', async () => {
      console.log('\n⏰ Running weekly digest job...');

      try {
        await notificationService.sendWeeklyDigests();
        console.log('✅ Weekly digest job completed\n');
      } catch (error) {
        console.error('❌ Error in weekly digest job:', error);
      }
    });

    this.tasks.push(task);
    console.log('✅ Weekly digest job scheduled (runs Mondays at 10 AM)');
  }

  /**
   * Frequent matching voor nieuw gescrapete woningen
   * Draait elke 5 minuten: match woningen die recent gescrapet zijn
   */
  startFrequentMatchingJob() {
    const everyMin = Math.max(1, parseInt(process.env.MATCH_INTERVAL_MINUTES || '5', 10));
    const lookbackMin = Math.max(1, parseInt(process.env.MATCH_LOOKBACK_MINUTES || '120', 10));
    const expr = `*/${everyMin} * * * *`;
    const task = cron.schedule(expr, async () => {
      console.log('\n⏰ Running frequent matching job...');

      try {
        const since = new Date(Date.now() - lookbackMin * 60 * 1000);
        let batch = await Property.find({
          scrapedAt: { $gte: since },
          $or: [
            { matchingCheckedAt: { $exists: false } },
            { $expr: { $lt: ['$matchingCheckedAt', '$scrapedAt'] } }
          ]
        })
          .sort({ scrapedAt: -1 })
          .limit(50);

        if (batch.length === 0) {
          // Fallback: pak een kleine batch zonder tijdsfilter om achterstanden in te halen
          batch = await Property.find({
            $or: [
              { matchingCheckedAt: { $exists: false } },
              { $expr: { $lt: ['$matchingCheckedAt', '$scrapedAt'] } }
            ]
          })
            .sort({ scrapedAt: -1 })
            .limit(25);
          if (batch.length === 0) {
            console.log('   Geen nieuwe woningen om te matchen');
            return;
          }
        }

        console.log(`   Te matchen woningen: ${batch.length}`);

        for (const prop of batch) {
          try {
            await matchingService.findMatchesForProperty(prop);
            await Property.updateOne({ _id: prop._id }, { $set: { matchingCheckedAt: new Date() } });
          } catch (err) {
            console.error(`   ❌ Fout bij matchen property ${prop._id}:`, err.message);
          }
        }

        console.log('✅ Frequent matching job afgerond');

      } catch (error) {
        console.error('❌ Error in frequent matching job:', error);
      }
    });

    this.tasks.push(task);
    console.log(`✅ Frequent matching job scheduled (every ${everyMin} min, lookback ${lookbackMin} min)`);
  }

  /**
   * Start all scheduled jobs
   */
  startAll() {
    console.log('\n🕐 Starting all cron jobs...\n');

    this.startDailyAnalytics();
    this.startCleanupJob();
    this.startDailyDigestJob();
    this.startWeeklyDigestJob();
    const matcherEnabled = (process.env.MATCHER_ENABLED || '1') === '1';
    if (matcherEnabled) {
      this.startFrequentMatchingJob();
    } else {
      console.log('⏸️ Frequent matching job disabled (set MATCHER_ENABLED=1 to enable)');
    }

    console.log(`\n✅ ${this.tasks.length} cron jobs started successfully\n`);
  }

  /**
   * Stop all scheduled jobs
   */
  stopAll() {
    this.tasks.forEach(task => task.stop());
    this.tasks = [];
    console.log('⏹️ All cron jobs stopped');
  }
}

module.exports = new Scheduler();
