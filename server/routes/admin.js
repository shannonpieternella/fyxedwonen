const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Property = require('../models/Property');
const Match = require('../models/Match');
const Analytics = require('../models/Analytics');
const { authMiddleware } = require('../middleware/auth');
const scrapeRunner = require('../jobs/scrapeRunner');
const matchingService = require('../services/matchingService');

// Admin middleware - check if user is admin
const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('role');

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Apply auth + admin middleware to all routes
router.use(authMiddleware, adminMiddleware);

// Get dashboard overview
router.get('/dashboard', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get today's analytics or create if doesn't exist
    let todayAnalytics = await Analytics.findOne({ date: today });

    if (!todayAnalytics) {
      todayAnalytics = await Analytics.create({ date: today });
    }

    // Get real-time counts
    const totalUsers = await User.countDocuments();
    const activeSubscriptions = await User.countDocuments({ 'subscription.status': 'active' });
    const totalProperties = await Property.countDocuments({ isStillAvailable: true });
    const totalMatches = await Match.countDocuments();
    const newMatchesToday = await Match.countDocuments({
      createdAt: { $gte: today }
    });

    // Get match stats
    const matchStats = await matchingService.getMatchStats();

    // Properties by source
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

    // Recent matches (last 10)
    const recentMatches = await Match.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'firstName lastName email')
      .populate('property', 'title address.city price source')
      .lean();

    res.json({
      success: true,
      overview: {
        users: {
          total: totalUsers,
          activeSubscriptions,
          newToday: todayAnalytics.users.new
        },
        properties: {
          total: totalProperties,
          newToday: todayAnalytics.properties.new,
          bySource: sourceStats
        },
        matches: {
          total: totalMatches,
          newToday: newMatchesToday,
          averageScore: matchStats.averageScore,
          byStatus: matchStats.byStatus
        },
        notifications: {
          emailsSent: todayAnalytics.notifications.emailsSent
        }
      },
      recentMatches
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get analytics for date range
router.get('/analytics', async (req, res) => {
  try {
    const { startDate, endDate, days = 7 } = req.query;

    let start, end;

    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      // Default to last N days
      end = new Date();
      end.setHours(23, 59, 59, 999);
      start = new Date();
      start.setDate(start.getDate() - parseInt(days));
      start.setHours(0, 0, 0, 0);
    }

    const analytics = await Analytics.find({
      date: { $gte: start, $lte: end }
    }).sort({ date: 1 });

    res.json({
      success: true,
      analytics,
      dateRange: {
        start,
        end
      }
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all users (paginated)
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 50, status } = req.query;

    const query = {};
    if (status === 'active') {
      query['subscription.status'] = 'active';
    } else if (status === 'inactive') {
      query['subscription.status'] = { $ne: 'active' };
    }

    const users = await User.find(query)
      .select('-password -resetPasswordToken -resetPasswordExpires')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get scraping status
router.get('/scraping-status', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayAnalytics = await Analytics.findOne({ date: today });

    // Get recent properties per source
    const recentProperties = await Property.aggregate([
      {
        $match: {
          scrapedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 },
          latest: { $max: '$scrapedAt' }
        }
      }
    ]);

    const scrapingStatus = {};
    recentProperties.forEach(item => {
      scrapingStatus[item._id] = {
        count: item.count,
        lastScrape: item.latest
      };
    });

    res.json({
      success: true,
      scrapingStatus,
      todayStats: todayAnalytics ? todayAnalytics.scraping : null
    });

  } catch (error) {
    console.error('Error fetching scraping status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get scraper schedule (next run etc.)
router.get('/scraping-schedule', (req, res) => {
  try {
    const status = scrapeRunner.getStatus();
    res.json({ success: true, schedule: status });
  } catch (error) {
    console.error('Error fetching scraping schedule:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get daily matches report
router.get('/matches/daily', async (req, res) => {
  try {
    const { date } = req.query;

    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    const endDate = new Date(targetDate);
    endDate.setHours(23, 59, 59, 999);

    const matches = await Match.find({
      createdAt: { $gte: targetDate, $lte: endDate }
    })
      .populate('user', 'firstName lastName email subscription')
      .populate('property', 'title address price source sourceUrl')
      .sort({ score: -1 })
      .lean();

    // Group by user
    const matchesByUser = {};
    matches.forEach(match => {
      const userId = match.user._id.toString();
      if (!matchesByUser[userId]) {
        matchesByUser[userId] = {
          user: match.user,
          matches: []
        };
      }
      matchesByUser[userId].matches.push(match);
    });

    res.json({
      success: true,
      date: targetDate,
      totalMatches: matches.length,
      uniqueUsers: Object.keys(matchesByUser).length,
      matches,
      matchesByUser: Object.values(matchesByUser)
    });

  } catch (error) {
    console.error('Error fetching daily matches:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user role (make someone admin)
router.post('/users/:userId/role', async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      message: `User role updated to ${role}`,
      user
    });

  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
