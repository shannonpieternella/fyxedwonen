#!/usr/bin/env node
/*
 Standalone scraper scheduler (no external npm deps).
 Reads scraper/.env (and process.env), then runs run_sources.py every N minutes
 for the configured sources. Designed to run via `npm start` in scraper/.
*/
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const HERE = __dirname;

function loadDotEnv(file) {
  try {
    const txt = fs.readFileSync(file, 'utf-8');
    txt.split(/\r?\n/).forEach((line) => {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m) {
        const key = m[1];
        let val = m[2];
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) process.env[key] = val;
      }
    });
  } catch {}
}

// Load scraper/.env first
loadDotEnv(path.join(HERE, '.env'));
// Fallback to server/.env if present
loadDotEnv(path.join(HERE, '..', 'server', '.env'));

const SOURCES = (process.env.SCRAPER_SOURCES || 'pararius')
  .split(',').map(s => s.trim()).filter(Boolean);
const TIMES_PER_DAY = Math.max(1, parseInt(process.env.SCRAPER_TIMES_PER_DAY || '288', 10));
const EVERY_MINUTES = Math.max(1, Math.floor(1440 / TIMES_PER_DAY));
const MAX_PER_CITY = parseInt(process.env.SCRAPER_MAX || process.env.SCRAPER_MAX_PER_CITY || '25', 10);
const DELAY = process.env.SCRAPER_DELAY || '0.75';
const CONCURRENCY = process.env.SCRAPER_CONCURRENCY || '6';
const LOG = process.env.SCRAPER_LOG || 'INFO';
const OBEY = (process.env.SCRAPER_OBEY == null) ? '1' : process.env.SCRAPER_OBEY;

function pythonPath() {
  const venvUnix = path.join(HERE, '.venv', 'bin', 'python');
  const venvWin = path.join(HERE, '.venv', 'Scripts', 'python.exe');
  if (fs.existsSync(venvUnix)) return venvUnix;
  if (fs.existsSync(venvWin)) return venvWin;
  return null;
}

function pipPath() {
  const pipUnix = path.join(HERE, '.venv', 'bin', 'pip');
  const pipWin = path.join(HERE, '.venv', 'Scripts', 'pip.exe');
  if (fs.existsSync(pipUnix)) return pipUnix;
  if (fs.existsSync(pipWin)) return pipWin;
  return null;
}

async function ensureVenv() {
  if (pythonPath()) return; // exists
  await new Promise((resolve, reject) => {
    const p = spawn('python3', ['-m', 'venv', '.venv'], { cwd: HERE, stdio: 'inherit' });
    p.on('close', (code) => code === 0 ? resolve() : reject(new Error('venv create failed')));
  });
  const pip = pipPath();
  await new Promise((resolve, reject) => {
    const p = spawn(pip, ['install', '--upgrade', 'pip'], { cwd: HERE, stdio: 'inherit' });
    p.on('close', (code) => code === 0 ? resolve() : reject(new Error('pip upgrade failed')));
  });
  await new Promise((resolve, reject) => {
    const p = spawn(pip, ['install', '-r', 'requirements.txt'], { cwd: HERE, stdio: 'inherit' });
    p.on('close', (code) => code === 0 ? resolve() : reject(new Error('pip install requirements failed')));
  });
}

async function runOnce() {
  const py = pythonPath() || 'python3';
  const script = path.join(HERE, 'run_sources.py');
  const args = ['--sources', SOURCES.join(',')];
  if (MAX_PER_CITY && MAX_PER_CITY > 0) { args.push('--max', String(MAX_PER_CITY)); }
  const env = {
    ...process.env,
    SCRAPER_DELAY: String(DELAY),
    SCRAPER_CONCURRENCY: String(CONCURRENCY),
    SCRAPER_LOG: LOG,
    SCRAPER_OBEY: OBEY,
    SCRAPY_SETTINGS_MODULE: 'rentbird_scraper.settings'
  };
  console.log(`[scheduler] ➜ scrape start: sources=${SOURCES.join(',')} every=${EVERY_MINUTES}min max=${MAX_PER_CITY}`);
  await new Promise((resolve) => {
    const child = spawn(py, [script, ...args], { cwd: HERE, env, stdio: 'inherit' });
    child.on('close', () => resolve());
  });
  console.log(`[scheduler] ⇦ scrape done`);
}

(async () => {
  try {
    await ensureVenv();
  } catch (e) {
    console.error('[scheduler] venv setup failed:', e.message);
  }
  console.log(`[scheduler] planning every ${EVERY_MINUTES} minutes (times/day=${Math.round(1440/EVERY_MINUTES)})`);
  // initial run
  runOnce().catch(e => console.error('[scheduler] run error:', e.message));
  // schedule
  setInterval(() => {
    runOnce().catch(e => console.error('[scheduler] run error:', e.message));
  }, EVERY_MINUTES * 60 * 1000);
})();
