#!/usr/bin/env node
// Merge staged raw collection into the main 'properties' collection
// Usage:
//   node server/scripts/merge-raw-to-properties.js <rawCollection>
// Example:
//   node server/scripts/merge-raw-to-properties.js raw_kamernet

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config();
const mongoose = require('mongoose');

async function main() {
  const rawName = process.argv[2];
  if (!rawName) {
    console.error('Usage: node server/scripts/merge-raw-to-properties.js <rawCollection>');
    process.exit(2);
  }
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI not set');
    process.exit(1);
  }
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  const raw = db.collection(rawName);
  const props = db.collection('properties');

  const cursor = raw.find({}, { batchSize: 500 });
  let total = 0;
  const bulk = [];
  const flush = async () => {
    if (!bulk.length) return;
    const ops = bulk.splice(0, bulk.length);
    const res = await props.bulkWrite(ops, { ordered: false });
    total += (res.upsertedCount || 0) + (res.modifiedCount || 0) + (res.matchedCount || 0);
  };

  while (await cursor.hasNext()) {
    const doc = await cursor.next();
    if (!doc) continue;
    if (!doc.source || !doc.sourceId) continue; // skip invalid
    const now = new Date();
    const q = { source: doc.source, sourceId: doc.sourceId };
    const set = {
      ...doc,
      lastCheckedAt: now,
      approvalStatus: doc.approvalStatus || 'approved',
      isStillAvailable: doc.isStillAvailable !== false,
    };
    delete set._id; // do not carry over raw _id
    bulk.push({ updateOne: { filter: q, update: { $set: set, $setOnInsert: { createdAt: now } }, upsert: true } });
    if (bulk.length >= 500) await flush();
  }
  await flush();
  console.log(`✅ Merged into 'properties' from '${rawName}'. Total ops: ${total}`);
  await mongoose.disconnect();
}

main().catch(async (e) => { console.error(e); try { await mongoose.disconnect(); } catch {} process.exit(1); });

