#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');

const py = process.env.SCRAPER_PYTHON || 'python3';
const script = path.join(__dirname, '..', '..', 'scraper', 'run_sources.py');

const sources = (process.env.SCRAPER_SOURCES || 'pararius,kamernet,funda')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)
  .join(',');

const args = ['--sources', sources];
if (process.env.SCRAPER_MAX_PER_CITY) {
  args.push('--max', String(process.env.SCRAPER_MAX_PER_CITY));
}
if (process.env.SCRAPER_CITIES) {
  args.push('--cities', process.env.SCRAPER_CITIES);
}

console.log(`[scrape-now] running: ${py} ${script} ${args.join(' ')}`);
const child = spawn(py, [script, ...args], { stdio: 'inherit' });
child.on('close', (code) => process.exit(code));

