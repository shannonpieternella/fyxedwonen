#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function parseDotEnv(txt){
  const out = {};
  txt.split(/\r?\n/).forEach((line)=>{
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) return;
    const k = m[1];
    let v = m[2];
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1,-1);
    out[k] = v;
  });
  return out;
}

const serverEnvPath = path.join(__dirname, '..', '..', 'server', '.env');
const scraperEnvPath = path.join(__dirname, '..', '.env');

let mongoUri = process.env.MONGODB_URI;
if (!mongoUri && fs.existsSync(serverEnvPath)){
  try {
    const txt = fs.readFileSync(serverEnvPath, 'utf-8');
    const kv = parseDotEnv(txt);
    mongoUri = kv.MONGODB_URI;
  } catch (e) {}
}

if (!mongoUri){
  console.error('❌ Could not find MONGODB_URI in environment or server/.env');
  process.exit(1);
}

const defaults = {
  SCRAPER_SOURCES: 'pararius,kamernet,huurwoningen',
  SCRAPER_TIMES_PER_DAY: '288',
  SCRAPER_MAX: '25',
  SCRAPER_CONCURRENCY: '3',
  SCRAPER_DELAY: '1.25',
  SCRAPER_SKIP_PIP: '1',
  SCRAPER_OBEY: '1'
};

let existing = {};
if (fs.existsSync(scraperEnvPath)){
  try { existing = parseDotEnv(fs.readFileSync(scraperEnvPath, 'utf-8')); } catch {}
}

const merged = {
  MONGODB_URI: mongoUri,
  ...defaults,
  ...existing, // keep any custom overrides already present
};

const lines = Object.entries(merged).map(([k,v])=>`${k}=${v}`);
fs.writeFileSync(scraperEnvPath, lines.join('\n')+'\n', 'utf-8');
console.log(`✅ Wrote ${scraperEnvPath} with MONGODB_URI and defaults.`);

