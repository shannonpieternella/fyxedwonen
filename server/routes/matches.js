const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');
const { subscriptionGuard } = require('../middleware/subscription');

// Get all matches for logged-in user
router.get('/', authMiddleware, subscriptionGuard, async (req, res) => {
  try {
    const { status, limit = 50, page = 1, sortBy = 'score', fallback, live } = req.query;

    // Build query
    const query = { user: req.user.id };

    if (status) {
      query.status = status;
    }

    // Build sort
    let sort = {};
    if (sortBy === 'score') {
      sort = { score: -1, createdAt: -1 };
    } else if (sortBy === 'date') {
      sort = { createdAt: -1 };
    } else if (sortBy === 'price') {
      // Will need to populate property for this
      sort = { createdAt: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const matches = await Match.find(query)
      .populate('property')
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    const total = await Match.countDocuments(query);

    // Live mode: always compute based on current preferences (ignore stored matches)
    if (String(live) === '1' || (total === 0 && String(fallback) === '1')) {
      const user = await User.findById(req.user.id).select('preferences subscription');
      const prefs = user?.preferences || {};

      const propFilter = {
        // Don't require isActive; scraped items inserted via Python may not set this field
        approvalStatus: 'approved',
        isStillAvailable: true,
        isArchived: { $ne: true },
      };
      if (Array.isArray(prefs.cities) && prefs.cities.length > 0) {
        propFilter['address.city'] = { $in: prefs.cities };
      }
      if (prefs.minPrice || prefs.maxPrice) {
        propFilter.price = {};
        if (prefs.minPrice) propFilter.price.$gte = prefs.minPrice;
        if (prefs.maxPrice) propFilter.price.$lte = prefs.maxPrice;
      }
      if (prefs.minSize || prefs.maxSize) {
        propFilter.size = {};
        if (prefs.minSize) propFilter.size.$gte = prefs.minSize;
        if (prefs.maxSize) propFilter.size.$lte = prefs.maxSize;
      }
      if (prefs.minRooms) {
        propFilter.rooms = { $gte: prefs.minRooms };
      }

      // Limit to recent inventory (last 30 days) to keep it relevant
      const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      propFilter.scrapedAt = { $gte: since };

      const props = await require('../models/Property')
        .find(propFilter)
        .sort({ scrapedAt: -1 })
        .limit(parseInt(limit))
        .lean();

      // Use the same scoring as matchingService
      const { calculateMatchScore } = require('../services/matchingService');

      const virtual = [];
      for (const p of props) {
        const { score, reasons } = calculateMatchScore(p, prefs);
        if (score >= 60) {
          // hireChance based on recency
          const offeredSince = p.offeredSince || p.scrapedAt || new Date();
          const ageHours = Math.max(0, (Date.now() - new Date(offeredSince).getTime()) / 36e5);
          let hireChance = 'medium';
          if (ageHours <= 24) hireChance = 'high';
          else if (ageHours > 7 * 24) hireChance = 'low';
          virtual.push({
            _id: `virtual-${p._id}`,
            user: req.user.id,
            property: p,
            score,
            status: 'new',
            hireChance,
            matchReasons: reasons,
            virtual: true,
          });
        }
      }

      return res.json({
        success: true,
        matches: virtual,
        pagination: { total: virtual.length, page: 1, limit: parseInt(limit), pages: 1 },
        counts: { all: virtual.length, new: virtual.length, notified: 0, viewed: 0, interested: 0, dismissed: 0 },
      });
    }

    // Count by status
    const statusCounts = await Match.aggregate([
      { $match: { user: req.user.id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const counts = {
      all: total,
      new: 0,
      notified: 0,
      viewed: 0,
      interested: 0,
      dismissed: 0
    };

    statusCounts.forEach(item => {
      counts[item._id] = item.count;
    });

    res.json({
      success: true,
      matches,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      counts
    });
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single match by ID
router.get('/:id', authMiddleware, subscriptionGuard, async (req, res) => {
  try {
    const match = await Match.findOne({
      _id: req.params.id,
      user: req.user.id // Ensure user owns this match
    }).populate('property');

    if (!match) {
      return res.status(404).json({ error: 'Match niet gevonden' });
    }

    // Mark as viewed if not already
    if (match.status === 'new' || match.status === 'notified') {
      match.status = 'viewed';
      match.viewedAt = new Date();
      await match.save();
    }

    res.json({
      success: true,
      match
    });
  } catch (error) {
    console.error('Error fetching match:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark match as interested
router.post('/:id/interested', authMiddleware, subscriptionGuard, async (req, res) => {
  try {
    const match = await Match.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!match) {
      return res.status(404).json({ error: 'Match niet gevonden' });
    }

    match.status = 'interested';
    match.interestedAt = new Date();
    await match.save();

    res.json({
      success: true,
      message: 'Match gemarkeerd als interessant',
      match
    });
  } catch (error) {
    console.error('Error marking match as interested:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Dismiss match
router.post('/:id/dismiss', authMiddleware, subscriptionGuard, async (req, res) => {
  try {
    const match = await Match.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!match) {
      return res.status(404).json({ error: 'Match niet gevonden' });
    }

    match.status = 'dismissed';
    match.dismissedAt = new Date();
    await match.save();

    res.json({
      success: true,
      message: 'Match verwijderd',
      match
    });
  } catch (error) {
    console.error('Error dismissing match:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Track source URL click
router.post('/:id/click', authMiddleware, subscriptionGuard, async (req, res) => {
  try {
    const match = await Match.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!match) {
      return res.status(404).json({ error: 'Match niet gevonden' });
    }

    match.clickedSourceUrl = true;
    match.clickedAt = new Date();
    await match.save();

    res.json({
      success: true,
      message: 'Click geregistreerd'
    });
  } catch (error) {
    console.error('Error tracking click:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
