#!/usr/bin/env node
// Match runner per source (or multiple sources), price-required, with lookback window.
// Usage examples:
//   node server/scripts/match-source.js --source kamernet --minutes 180 --limit 200
//   node server/scripts/match-source.js --sources pararius,huurwoningen --minutes 60
// If no --source(s) given, runs for all sources.

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config();
const mongoose = require('mongoose');
const Property = require('../models/Property');
const matchingService = require('../services/matchingService');

function parseArgs(argv) {
  const args = { minutes: 120, limit: 200 };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--source' && argv[i + 1]) { args.sources = [argv[++i]]; }
    else if (a === '--sources' && argv[i + 1]) { args.sources = argv[++i].split(',').map(s=>s.trim()).filter(Boolean); }
    else if (a === '--minutes' && argv[i + 1]) { args.minutes = parseInt(argv[++i], 10) || 120; }
    else if (a === '--limit' && argv[i + 1]) { args.limit = parseInt(argv[++i], 10) || 200; }
    else if (a === '--help' || a === '-h') { args.help = true; }
  }
  return args;
}

async function main() {
  const { minutes, limit, sources, help } = parseArgs(process.argv);
  if (help) {
    console.log('Usage: node server/scripts/match-source.js [--source <src>|--sources a,b] [--minutes 120] [--limit 200]');
    process.exit(0);
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI not set');
    process.exit(1);
  }
  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB');

  try {
    const since = new Date(Date.now() - minutes * 60 * 1000);
    const query = {
      scrapedAt: { $gte: since },
      price: { $gt: 0 }, // enforce price present
      $or: [
        { matchingCheckedAt: { $exists: false } },
        { $expr: { $lt: ['$matchingCheckedAt', '$scrapedAt'] } }
      ]
    };
    if (sources && sources.length) {
      query.source = { $in: sources };
    }

    const props = await Property.find(query)
      .sort({ scrapedAt: -1 })
      .limit(limit);

    console.log(`🔎 To match: ${props.length} properties (minutes=${minutes}${sources?`, sources=${sources.join(',')}`:''})`);
    let ok = 0, fail = 0;
    for (const prop of props) {
      try {
        await matchingService.findMatchesForProperty(prop);
        await Property.updateOne({ _id: prop._id }, { $set: { matchingCheckedAt: new Date() } });
        ok++;
      } catch (e) {
        console.error(`   ❌ Match error for ${prop._id} (${prop.source}):`, e.message);
        fail++;
      }
    }
    console.log(`✅ Done. Matched ${ok}, errors ${fail}.`);
  } finally {
    await mongoose.disconnect();
  }
}

main().catch(async (e) => { console.error(e); try { await mongoose.disconnect(); } catch {} process.exit(1); });

