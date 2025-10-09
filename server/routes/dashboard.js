const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const User = require('../models/User');
const Match = require('../models/Match');
const Property = require('../models/Property');

function median(arr) {
  if (!arr || arr.length === 0) return null;
  const s = [...arr].sort((a,b)=>a-b);
  const mid = Math.floor(s.length/2);
  return s.length % 2 ? s[mid] : Math.round((s[mid-1] + s[mid]) / 2);
}

router.get('/metrics', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('createdAt preferences subscription');
    if (!user) return res.status(404).json({ success:false, error:'Gebruiker niet gevonden' });

    const prefs = user.preferences || {};
    const now = Date.now();
    const dayMs = 24*60*60*1000;

    // Counts
    const [totalMatches, viewedMatches, interestedCount] = await Promise.all([
      Match.countDocuments({ user: userId }),
      Match.countDocuments({ user: userId, viewedAt: { $ne: null } }),
      Match.countDocuments({ user: userId, interestedAt: { $ne: null } })
    ]);

    // Expected matches per week
    const minScore = parseInt(process.env.MATCH_MIN_SCORE || '60', 10);
    const since14 = new Date(now - 14*dayMs);
    const recentCount = await Match.countDocuments({ user: userId, createdAt: { $gte: since14 } });
    let expectedPerWeek;
    if (recentCount > 0) {
      expectedPerWeek = Math.max(1, Math.round((recentCount / 14) * 7));
    } else {
      // Fallback: estimate from recent inventory using preferences + scoring
      const propFilter = {
        approvalStatus: 'approved',
        isStillAvailable: true,
        isArchived: { $ne: true },
        scrapedAt: { $gte: new Date(now - 7*dayMs) }
      };
      if (Array.isArray(prefs.cities) && prefs.cities.length > 0) {
        propFilter['address.city'] = { $in: prefs.cities };
      }
      if (prefs.minPrice || prefs.maxPrice) {
        propFilter.price = {};
        if (prefs.minPrice != null) propFilter.price.$gte = prefs.minPrice;
        if (prefs.maxPrice != null) propFilter.price.$lte = prefs.maxPrice;
      }
      if (prefs.minSize || prefs.maxSize) {
        propFilter.size = {};
        if (prefs.minSize != null) propFilter.size.$gte = prefs.minSize;
        if (prefs.maxSize != null) propFilter.size.$lte = prefs.maxSize;
      }
      if (prefs.minRooms) propFilter.rooms = { $gte: prefs.minRooms };

      const props = await Property.find(propFilter).sort({ scrapedAt: -1 }).limit(150).lean();
      const { calculateMatchScore } = require('../services/matchingService');
      let count = 0;
      for (const p of props) {
        const { score } = calculateMatchScore(p, prefs);
        if (score >= minScore) count++;
      }
      expectedPerWeek = count; // last 7 days ≈ per week
    }

    // Speed: median open/react times
    const since60 = new Date(now - 60*dayMs);
    const openDocs = await Match.find({
      user: userId,
      notifiedAt: { $ne: null },
      viewedAt: { $ne: null },
      createdAt: { $gte: since60 }
    }).select('notifiedAt viewedAt').lean();
    const openMsArr = openDocs.map(m => new Date(m.viewedAt).getTime() - new Date(m.notifiedAt).getTime()).filter(ms => ms >= 0);
    const openMs = median(openMsArr);

    const reactDocs = await Match.find({
      user: userId,
      notifiedAt: { $ne: null },
      interestedAt: { $ne: null },
      createdAt: { $gte: since60 }
    }).select('notifiedAt interestedAt').lean();
    const reactMsArr = reactDocs.map(m => new Date(m.interestedAt).getTime() - new Date(m.notifiedAt).getTime()).filter(ms => ms >= 0);
    const reactMs = median(reactMsArr);

    const speedLabel = (openMs != null && openMs < 10*60*1000) ? 'Je bent redelijk snel' : 'Verbeter je snelheid';

    // Onboarding/progress
    let progress = 0;
    if (Array.isArray(prefs.cities) && prefs.cities.length) progress += 25;
    if (user.subscription?.status === 'active') progress += 25;
    if (viewedMatches > 0) progress += 25;
    if (interestedCount > 0) progress += 25;

    const daysSinceSignup = Math.max(1, Math.round((now - new Date(user.createdAt).getTime()) / dayMs));

    res.json({
      success: true,
      searches: prefs.cities || [],
      metrics: {
        expectedPerWeek,
        speed: { openMs, reactMs, label: openMs != null ? speedLabel : 'Reageer voor een indicatie' },
        counts: { totalMatches, viewedMatches, interestedCount },
        daysSinceSignup,
        progressPercent: progress
      }
    });
  } catch (e) {
    console.error('dashboard metrics error:', e);
    res.status(500).json({ success:false, error:'Server error' });
  }
});

module.exports = router;

