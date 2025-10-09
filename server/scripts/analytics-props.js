#!/usr/bin/env node
// Analytics over properties (scraped listings)
// Usage:
//  node server/scripts/analytics-props.js              # last 60 minutes
//  node server/scripts/analytics-props.js --minutes 180
//  node server/scripts/analytics-props.js --hours 24
//  node server/scripts/analytics-props.js --since 2025-10-06T12:00:00Z
//  node server/scripts/analytics-props.js --source pararius

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config();
const mongoose = require('mongoose');

function parseArgs() {
  const args = process.argv.slice(2);
  const out = { minutes: 60, source: null, since: null };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--minutes') out.minutes = parseInt(args[++i] || '60', 10);
    else if (a === '--hours') out.minutes = parseInt(args[++i] || '24', 10) * 60;
    else if (a === '--since') out.since = new Date(args[++i]);
    else if (a === '--source') out.source = String(args[++i] || '').trim();
  }
  return out;
}

async function main() {
  const { minutes, since, source } = parseArgs();
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set');
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  const col = db.collection('properties');

  const from = since || new Date(Date.now() - minutes * 60 * 1000);
  const match = { scrapedAt: { $gte: from } };
  if (source) match.source = source;

  const total = await col.countDocuments(match);
  const inserted = await col.countDocuments({ ...match, createdAt: { $gte: from } });
  const updated = total - inserted;

  const bySource = await col.aggregate([
    { $match: match },
    { $group: { _id: '$source', count: { $sum: 1 }, latest: { $max: '$scrapedAt' } } },
    { $sort: { count: -1 } },
  ]).toArray();

  const byCity = await col.aggregate([
    { $match: match },
    { $group: { _id: { city: '$address.city', source: '$source' }, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]).toArray();

  console.log(`\n📊 Properties analytics since ${from.toISOString()} ${source ? `(source=${source})` : ''}`);
  console.log(`   Total: ${total} | Inserted: ${inserted} | Updated: ${updated}`);
  console.log('\nBy source:');
  console.table(bySource.map(d => ({ source: d._id, count: d.count, latest: d.latest?.toISOString?.() || d.latest })));
  console.log('\nTop cities:');
  console.table(byCity.map(d => ({ city: d._id.city, source: d._id.source, count: d.count })));

  const sample = await col.find(match, { projection: { title: 1, source: 1, sourceUrl: 1, price: 1, scrapedAt: 1 } })
    .sort({ scrapedAt: -1 }).limit(5).toArray();
  console.log('\nRecent sample:');
  console.table(sample.map(s => ({ source: s.source, price: s.price, title: (s.title || '').slice(0, 48), when: s.scrapedAt?.toISOString?.() || s.scrapedAt })));

  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
