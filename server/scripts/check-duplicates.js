#!/usr/bin/env node
/**
 * Check duplicate properties (same source+sourceId) and show a short report.
 * Usage:
 *   node server/scripts/check-duplicates.js              # last 60 minutes
 *   node server/scripts/check-duplicates.js --minutes 180
 *   node server/scripts/check-duplicates.js --all       # full collection
 *   node server/scripts/check-duplicates.js --source pararius
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config();
const mongoose = require('mongoose');

function parseArgs() {
  const args = process.argv.slice(2);
  const out = { minutes: 60, all: false, source: null };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--minutes') out.minutes = parseInt(args[++i] || '60', 10);
    else if (a === '--all') out.all = true;
    else if (a === '--source') out.source = String(args[++i] || '').trim();
  }
  return out;
}

async function main() {
  const { minutes, all, source } = parseArgs();
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI not set');
    process.exit(1);
  }
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  const props = db.collection('properties');

  const match = {};
  if (!all) match.scrapedAt = { $gte: new Date(Date.now() - minutes * 60 * 1000) };
  if (source) match.source = source;

  const pipeline = [
    Object.keys(match).length ? { $match: match } : null,
    {
      $group: {
        _id: { source: '$source', sourceId: '$sourceId' },
        count: { $sum: 1 },
        ids: { $push: '$_id' },
        latest: { $max: '$scrapedAt' },
      },
    },
    { $match: { count: { $gt: 1 } } },
    { $sort: { count: -1, latest: -1 } },
  ].filter(Boolean);

  const dups = await props.aggregate(pipeline).toArray();
  console.log(`\n🔎 Duplicate report ${all ? '(full collection)' : `(last ${minutes} min)`}${source ? ` [source=${source}]` : ''}`);
  console.log(`   Duplicates count: ${dups.length}`);
  if (dups.length) {
    console.table(dups.slice(0, 20).map(d => ({
      source: d._id.source,
      sourceId: d._id.sourceId,
      occurrences: d.count,
      latest: d.latest?.toISOString?.() || d.latest,
    })));
  }

  // Also show a quick sample of recent properties
  if (!all) {
    const sample = await props
      .find(match, { projection: { title: 1, source: 1, sourceId: 1, scrapedAt: 1 } })
      .sort({ scrapedAt: -1 })
      .limit(5)
      .toArray();
    console.log('\n🧪 Recent sample:');
    console.table(sample.map(p => ({
      source: p.source,
      sourceId: p.sourceId,
      title: (p.title || '').slice(0, 50),
      scrapedAt: p.scrapedAt?.toISOString?.() || p.scrapedAt,
    })));
  }

  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
