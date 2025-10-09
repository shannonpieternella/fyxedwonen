const mongoose = require('mongoose');
const Property = require('../models/Property');
const matchingService = require('../services/matchingService');

let changeStream = null;

function isEligible(doc) {
  if (!doc) return false;
  if (doc.isArchived) return false;
  if (doc.isStillAvailable === false) return false;
  // Basic required fields for matching
  if (!doc.address || !doc.address.city) return false;
  if (!doc.price) return false;
  return true;
}

async function handleDoc(doc) {
  try {
    if (!isEligible(doc)) return;
    // Freshen mongoose doc if needed
    const prop = await Property.findById(doc._id);
    if (!prop) return;

    console.log(`👀 New/updated listing detected: ${prop.title} — ${prop.address.city}`);
    await matchingService.findMatchesForProperty(prop);
    await Property.updateOne({ _id: prop._id }, { $set: { matchingCheckedAt: new Date() } });
  } catch (err) {
    console.error('watchNewProperties handleDoc error:', err.message);
  }
}

function start() {
  if (changeStream) return;
  const coll = mongoose.connection.collection('properties');
  try {
    changeStream = coll.watch(
      [
        { $match: { operationType: { $in: ['insert', 'update', 'replace'] } } }
      ],
      { fullDocument: 'updateLookup' }
    );

    changeStream.on('change', async (change) => {
      const doc = change.fullDocument;
      await handleDoc(doc);
    });

    changeStream.on('error', (err) => {
      console.error('watchNewProperties changeStream error:', err.message);
    });

    console.log('✅ New listing watcher started (MongoDB change streams)');
  } catch (e) {
    console.error('⚠️ Could not start change stream watcher. Is MongoDB a replica set/Atlas?', e.message);
  }
}

function stop() {
  if (changeStream) {
    try { changeStream.close(); } catch {}
    changeStream = null;
  }
}

module.exports = { start, stop };

