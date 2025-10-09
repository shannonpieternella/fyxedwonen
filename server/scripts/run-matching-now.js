#!/usr/bin/env node
// One-off runner to force matching on recently scraped properties.
// Usage: node server/scripts/run-matching-now.js [minutesBack]
// Default window: 120 minutes back.

const path = require('path');
// Load server/.env explicitly
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config();
const mongoose = require('mongoose');
const Property = require('../models/Property');
const matchingService = require('../services/matchingService');

async function main() {
  const mins = parseInt(process.argv[2] || '120', 10);
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI not set');
    process.exit(1);
  }
  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB');

  try {
    const since = new Date(Date.now() - mins * 60 * 1000);
    const batch = await Property.find({
      scrapedAt: { $gte: since },
      $or: [
        { matchingCheckedAt: { $exists: false } },
        { $expr: { $lt: ['$matchingCheckedAt', '$scrapedAt'] } }
      ]
    }).sort({ scrapedAt: -1 }).limit(100);

    console.log(`🔎 Found ${batch.length} properties to match (last ${mins} min)`);
    for (const prop of batch) {
      try {
        await matchingService.findMatchesForProperty(prop);
        await Property.updateOne({ _id: prop._id }, { $set: { matchingCheckedAt: new Date() } });
        console.log('   ✅ matched', prop._id.toString(), prop.title);
      } catch (e) {
        console.error('   ❌ match error', prop._id.toString(), e.message);
      }
    }
    console.log('✅ Done.');
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
