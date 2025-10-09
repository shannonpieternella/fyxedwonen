#!/usr/bin/env node
// Analytics over matches
// Usage:
//  node server/scripts/analytics-matches.js --minutes 180
//  node server/scripts/analytics-matches.js --hours 24

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config();
const mongoose = require('mongoose');

function args() {
  const a = process.argv.slice(2);
  let minutes = 60;
  for (let i = 0; i < a.length; i++) {
    if (a[i] === '--minutes') minutes = parseInt(a[++i] || '60', 10);
    else if (a[i] === '--hours') minutes = parseInt(a[++i] || '24', 10) * 60;
  }
  return { minutes };
}

async function main() {
  const { minutes } = args();
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set');
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  const matches = db.collection('matches');
  const props = db.collection('properties');

  const since = new Date(Date.now() - minutes * 60 * 1000);

  const pipeline = [
    { $match: { createdAt: { $gte: since } } },
    { $lookup: { from: 'properties', localField: 'property', foreignField: '_id', as: 'prop' } },
    { $unwind: '$prop' },
    { $group: { _id: { status: '$status', source: '$prop.source' }, count: { $sum: 1 }, avgScore: { $avg: '$score' } } },
    { $sort: { count: -1 } },
  ];
  const rows = await matches.aggregate(pipeline).toArray();
  const total = await matches.countDocuments({ createdAt: { $gte: since } });

  console.log(`\n📈 Matches analytics (last ${minutes} min)`);
  console.log(`   Total matches: ${total}`);
  console.table(rows.map(r => ({ status: r._id.status, source: r._id.source, count: r.count, avgScore: Math.round(r.avgScore || 0) })));

  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
