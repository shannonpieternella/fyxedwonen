#!/usr/bin/env node
// Standalone matcher scheduler (run from matcher/). No external deps.
const fs = require('fs');
const path = require('path');
function getMongoose() {
  try {
    const resolved = require.resolve('mongoose', { paths: [path.join(__dirname, '..', 'server')] });
    return require(resolved);
  } catch (_) {
    return require('mongoose');
  }
}
const mongoose = getMongoose();

function loadDotEnv(file) {
  try {
    const txt = fs.readFileSync(file, 'utf-8');
    txt.split(/\r?\n/).forEach((line) => {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (!m) return;
      const k = m[1];
      let v = m[2];
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1,-1);
      if (!process.env[k]) process.env[k] = v;
    });
  } catch {}
}

const HERE = __dirname;
// Load matcher/.env first, then fallback to server/.env
loadDotEnv(path.join(HERE, '.env'));
loadDotEnv(path.join(HERE, '..', 'server', '.env'));

const MATCH_INTERVAL_MINUTES = Math.max(1, parseInt(process.env.MATCH_INTERVAL_MINUTES || '5', 10));
const MATCH_LOOKBACK_MINUTES = Math.max(1, parseInt(process.env.MATCH_LOOKBACK_MINUTES || '180', 10));
const MATCH_LIMIT = Math.max(1, parseInt(process.env.MATCH_LIMIT || '200', 10));
const MATCH_SOURCES = (process.env.MATCH_SOURCES || '').split(',').map(s=>s.trim()).filter(Boolean);

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('[matcher] ❌ MONGODB_URI not set. Create matcher/.env or set env vars.');
  process.exit(1);
}
// Mask URI for logs
const maskedUri = mongoUri.replace(/(mongodb(?:\+srv)?:\/\/)[^:@/]+(:[^@/]+)?@/i, '$1***:***@');
console.log('[matcher] using Mongo URI:', maskedUri);

mongoose.connection.on('error', (err) => {
  console.error('[matcher] mongo connection error:', err?.message || err);
});
mongoose.connection.on('connected', () => {
  console.log('[matcher] mongo connected');
});
mongoose.connection.on('disconnected', () => {
  console.log('[matcher] mongo disconnected');
});

// Lazy require after env loaded and after connecting to ensure shared mongoose instance is used
let Property, matchingService;

async function ensureConnected() {
  if (mongoose.connection.readyState === 1) return;
  mongoose.set('bufferTimeoutMS', 30000);
  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 30000, family: 4 });
}

async function runOnce() {
  await ensureConnected();
  try {
    if (!Property) {
      // Prefer server models (share instance) and fall back to local if server models not present
      try {
        Property = require('../server/models/Property');
        matchingService = require('../server/services/matchingService');
      } catch (e) {
        Property = require('./models/Property');
        matchingService = require('./services/matchingService');
      }
    }
    const since = new Date(Date.now() - MATCH_LOOKBACK_MINUTES * 60 * 1000);
    const query = {
      scrapedAt: { $gte: since },
      price: { $gt: 0 },
      $or: [
        { matchingCheckedAt: { $exists: false } },
        { $expr: { $lt: ['$matchingCheckedAt', '$scrapedAt'] } }
      ]
    };
    if (MATCH_SOURCES.length) query.source = { $in: MATCH_SOURCES };

    const props = await Property.find(query).sort({ scrapedAt: -1 }).limit(MATCH_LIMIT);
    console.log(`[matcher] 🔎 To match: ${props.length} (lookback=${MATCH_LOOKBACK_MINUTES}min${MATCH_SOURCES.length?`, sources=${MATCH_SOURCES.join(',')}`:''})`);
    let ok=0, fail=0;
    for (const prop of props) {
      try {
        await matchingService.findMatchesForProperty(prop);
        await Property.updateOne({ _id: prop._id }, { $set: { matchingCheckedAt: new Date() } });
        ok++;
      } catch (e) {
        console.error(`[matcher] ❌ Match error ${prop._id}:`, e.message);
        fail++;
      }
    }
    console.log(`[matcher] ✅ Done. Matched ${ok}, errors ${fail}.`);
  } finally {
    // keep connection open for reuse between runs
  }
}

async function main() {
  const once = process.argv.includes('--once');
  if (once) {
    await runOnce();
    return;
  }
  console.log(`[matcher] planning every ${MATCH_INTERVAL_MINUTES} minutes`);
  await ensureConnected();
  if (!Property) {
    try {
      Property = require('../server/models/Property');
      matchingService = require('../server/services/matchingService');
    } catch (e) {
      Property = require('./models/Property');
      matchingService = require('./services/matchingService');
    }
  }
  await runOnce();
  setInterval(() => { runOnce().catch(e=>console.error('[matcher] run error:', e.message)); }, MATCH_INTERVAL_MINUTES * 60 * 1000);
}

main().catch((e)=>{ console.error(e); process.exit(1); });
