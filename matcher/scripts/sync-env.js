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
const matcherEnvPath = path.join(__dirname, '..', '.env');

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
  MATCH_INTERVAL_MINUTES: '5',
  MATCH_LOOKBACK_MINUTES: '180',
  MATCH_LIMIT: '200',
  MATCH_SOURCES: ''
};

let existing = {};
if (fs.existsSync(matcherEnvPath)){
  try { existing = parseDotEnv(fs.readFileSync(matcherEnvPath, 'utf-8')); } catch {}
}

const merged = {
  MONGODB_URI: mongoUri,
  ...defaults,
  ...existing,
};

const lines = Object.entries(merged).map(([k,v])=>`${k}=${v}`);
fs.writeFileSync(matcherEnvPath, lines.join('\n')+'\n', 'utf-8');
console.log(`✅ Wrote ${matcherEnvPath} with MONGODB_URI and defaults.`);

