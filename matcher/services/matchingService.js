const Match = require('../models/Match');
const User = require('../models/User');
const Analytics = require('../models/Analytics');
const notificationService = require('./notificationService');

function calculateMatchScore(property, preferences) {
  let score = 0;
  const reasons = [];
  if (property.price != null && preferences.minPrice != null && preferences.maxPrice != null) {
    if (property.price >= preferences.minPrice && property.price <= preferences.maxPrice) {
      score += 30; reasons.push(`Binnen budget (€${property.price})`);
    }
  }
  if (property.rooms != null && preferences.minRooms != null) {
    if (property.rooms >= preferences.minRooms) { score += 15; reasons.push(`${property.rooms} kamers (minimaal ${preferences.minRooms})`); }
  }
  if (property.size != null) {
    if (preferences.minSize != null && preferences.maxSize != null && property.size >= preferences.minSize && property.size <= preferences.maxSize) {
      score += 15; reasons.push(`${property.size}m² (binnen bereik)`);
    } else if (preferences.minSize != null && property.size >= preferences.minSize) { score += 10; reasons.push(`${property.size}m²`); }
  }
  if (preferences.furnished === 'both') { score += 10; }
  else if ((preferences.furnished === 'yes' && property.furnished) || (preferences.furnished === 'no' && !property.furnished)) {
    score += 10; reasons.push(property.furnished ? 'Gemeubileerd' : 'Ongemeubileerd');
  }
  if (!preferences.petsAllowed || property.petsAllowed) { score += 10; }
  let featureMatches = 0;
  if (preferences.features && preferences.features.length) {
    for (const f of preferences.features) { if (property[f] === true) featureMatches++; }
    score += Math.min(featureMatches * 5, 20);
  } else { score += 20; }
  return { score: Math.min(Math.round(score), 100), reasons };
}

async function findMatchesForProperty(property) {
  const requireActive = (process.env.MATCH_REQUIRE_ACTIVE_SUBSCRIPTION || '1') === '1';
  const requireOnboarding = (process.env.MATCH_REQUIRE_ONBOARDING || '1') === '1';
  const cityCaseInsensitive = (process.env.MATCH_CITY_CASE_INSENSITIVE || '0') === '1';

  const userQuery = {};
  if (requireOnboarding) userQuery.onboardingCompleted = true;
  if (requireActive) userQuery['subscription.status'] = 'active';

  const city = property?.address?.city || '';
  if (cityCaseInsensitive) {
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
  if ((process.env.MATCH_DEBUG || '0') === '1') {
    console.log('[matcher] userQuery =', JSON.stringify(userQuery));
    console.log(`[matcher] potential users: ${potentialUsers.length}`);
  }
  const matches = [];
  for (const user of potentialUsers) {
    const { score, reasons } = calculateMatchScore(property, user.preferences || {});
    const minScore = parseInt(process.env.MATCH_MIN_SCORE || '60', 10);
    if (score >= minScore) {
      const exists = await Match.findOne({ user: user._id, property: property._id });
      if (exists) continue;
      const offeredSince = property.offeredSince || property.scrapedAt || new Date();
      const ageHours = Math.max(0, (Date.now() - new Date(offeredSince).getTime()) / 36e5);
      let hireChance = 'medium';
      if (ageHours <= 24) hireChance = 'high'; else if (ageHours > 24*7) hireChance = 'low';
      if (hireChance === 'high') reasons.push('Nieuw aanbod — hoge kans op huur');
      else if (hireChance === 'low') reasons.push('Ouder aanbod — lagere kans op huur');
      const m = await Match.create({ user: user._id, property: property._id, score, matchReasons: reasons, hireChance, status: 'new' });
      matches.push(m);
      await User.updateOne({ _id: user._id }, { $inc: { totalMatches: 1 } });
    }
  }
  if (matches.length) {
    await Analytics.increment('matches.total', matches.length);
    await Analytics.increment('matches.new', matches.length);
    await notificationService.sendBatchNotifications(matches);
  }
  return matches;
}

module.exports = { findMatchesForProperty, calculateMatchScore };
