#!/usr/bin/env node
// Standalone matcher script (run from scraper/). Uses server models/services.
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

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

// Load env from scraper/.env and fallback server/.env
loadDotEnv(path.join(__dirname, '..', '.env'));
loadDotEnv(path.join(__dirname, '..', '..', 'server', '.env'));

const Property = require('../../server/models/Property');
const matchingService = require('../../server/services/matchingService');

function parseArgs(argv) {
  const args = { minutes: 120, limit: 200 };
  for (let i=2;i<argv.length;i++){
    const a = argv[i];
    if (a === '--source' && argv[i+1]) { args.sources = [argv[++i]]; }
    else if (a === '--sources' && argv[i+1]) { args.sources = argv[++i].split(',').map(s=>s.trim()).filter(Boolean); }
    else if (a === '--minutes' && argv[i+1]) { args.minutes = parseInt(argv[++i],10)||120; }
    else if (a === '--limit' && argv[i+1]) { args.limit = parseInt(argv[++i],10)||200; }
    else if (a === '--help' || a === '-h') { args.help = true; }
  }
  return args;
}

async function main(){
  const { minutes, limit, sources, help } = parseArgs(process.argv);
  if (help){
    console.log('Usage: npm run match -- --source <src>|--sources a,b [--minutes 120] [--limit 200]');
    process.exit(0);
  }
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error('❌ MONGODB_URI not set'); process.exit(1); }
  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB');
  try {
    const since = new Date(Date.now() - minutes * 60 * 1000);
    const query = {
      scrapedAt: { $gte: since },
      price: { $gt: 0 },
      $or: [
        { matchingCheckedAt: { $exists: false } },
        { $expr: { $lt: ['$matchingCheckedAt', '$scrapedAt'] } }
      ]
    };
    if (sources && sources.length) query.source = { $in: sources };

    const props = await Property.find(query).sort({ scrapedAt: -1 }).limit(limit);
    console.log(`🔎 To match: ${props.length} (minutes=${minutes}${sources?`, sources=${sources.join(',')}`:''})`);
    let ok=0, fail=0;
    for (const prop of props) {
      try {
        await matchingService.findMatchesForProperty(prop);
        await Property.updateOne({ _id: prop._id }, { $set: { matchingCheckedAt: new Date() } });
        ok++;
      } catch (e) {
        console.error(`   ❌ Match error ${prop._id}:`, e.message);
        fail++;
      }
    }
    console.log(`✅ Done. Matched ${ok}, errors ${fail}.`);
  } finally {
    await mongoose.disconnect();
  }
}

main().catch(async (e)=>{ console.error(e); try{ await mongoose.disconnect(); } catch {}; process.exit(1); });

