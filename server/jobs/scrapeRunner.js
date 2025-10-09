const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');

class ScrapeRunner {
  constructor() {
    this.running = false;
    this.queue = [];
    this.current = null;
    this.lastTriggeredAt = null;
    this.everyMinutes = null;
  }

  getCities() {
    try {
      const citiesPath = path.join(__dirname, '..', '..', 'scraper', 'config', 'cities_nl.json');
      const raw = fs.readFileSync(citiesPath, 'utf-8');
      return JSON.parse(raw);
    } catch (e) {
      console.error('[ScrapeRunner] Kon stedenlijst niet lezen:', e.message);
      return [];
    }
  }

  async runForCity(city, sources, maxPerCity, envExtra = {}) {
    return new Promise((resolve) => {
      // Prefer project virtualenv python if available, else env override, else system python3
      let py = process.env.SCRAPER_PYTHON;
      if (!py) {
        const venvUnix = path.join(__dirname, '..', '..', 'scraper', '.venv', 'bin', 'python');
        const venvWin = path.join(__dirname, '..', '..', 'scraper', '.venv', 'Scripts', 'python.exe');
        if (fs.existsSync(venvUnix)) py = venvUnix;
        else if (fs.existsSync(venvWin)) py = venvWin;
        else py = 'python3';
      }
      const script = path.join(__dirname, '..', '..', 'scraper', 'run_sources.py');
      const args = ['--sources', sources.join(','), '--cities', city];
      if (maxPerCity) {
        args.push('--max', String(maxPerCity));
      }

      const env = {
        ...process.env,
        ...envExtra,
      };

      console.log(`[ScrapeRunner] ➜ Start scrape: ${city} [${sources.join(', ')}]`);
      console.log(`[ScrapeRunner]    Python: ${py}`);
      console.log(`[ScrapeRunner]    Cmd: ${script} ${args.join(' ')}`);
      const child = spawn(py, [script, ...args], { env });
      this.current = child;

      child.stdout.on('data', (d) => process.stdout.write(`[scraper ${city}] ${d}`));
      child.stderr.on('data', (d) => process.stderr.write(`[scraper ${city} ERROR] ${d}`));
      child.on('close', (code) => {
        console.log(`[ScrapeRunner] ⇦ Klaar: ${city} (exit ${code})`);
        this.current = null;
        resolve();
      });
    });
  }

  async processQueue() {
    if (this.running) return;
    this.running = true;
    const citySleep = parseInt(process.env.SCRAPER_CITY_SLEEP_MS || '5000', 10);
    const maxPerCity = parseInt(process.env.SCRAPER_MAX_PER_CITY || '25', 10) || undefined;
    const delay = parseFloat(process.env.SCRAPER_DELAY || '0.75');
    const concurrency = parseInt(process.env.SCRAPER_CONCURRENCY || '6', 10);
    const sources = (process.env.SCRAPER_SOURCES || 'pararius').split(',').map((s) => s.trim()).filter(Boolean);

    while (this.queue.length > 0) {
      const city = this.queue.shift();
      await this.runForCity(city, sources, maxPerCity, {
        SCRAPER_DELAY: String(delay),
        SCRAPER_CONCURRENCY: String(concurrency),
      });
      if (this.queue.length > 0) {
        await new Promise((r) => setTimeout(r, citySleep));
      }
    }

    this.running = false;
  }

  enqueueAllCities() {
    const cities = this.getCities();
    if (!cities.length) return;
    this.queue.push(...cities);
    this.lastTriggeredAt = new Date();
    this.processQueue().catch((e) => console.error('[ScrapeRunner] processQueue error:', e));
  }

  schedule() {
    const timesPerDay = Math.max(1, parseInt(process.env.SCRAPER_TIMES_PER_DAY || '24', 10));
    const everyMinutes = Math.max(1, Math.floor(1440 / timesPerDay));
    this.everyMinutes = everyMinutes;
    const expr = `*/${everyMinutes} * * * *`;
    console.log(`[ScrapeRunner] Planning scrape elke ${everyMinutes} minuten (cron: ${expr})`);
    cron.schedule(expr, () => {
      console.log('[ScrapeRunner] ⏰ Scrape geplande run start');
      this.enqueueAllCities();
    });
  }

  getStatus() {
    const last = this.lastTriggeredAt ? this.lastTriggeredAt.getTime() : null;
    let next = null;
    if (this.everyMinutes) {
      if (last) {
        next = new Date(last + this.everyMinutes * 60 * 1000);
      } else {
        // Compute next boundary from now for */everyMinutes cron
        const now = new Date();
        const remainder = now.getMinutes() % this.everyMinutes;
        const add = remainder === 0 ? this.everyMinutes : (this.everyMinutes - remainder);
        next = new Date(now);
        next.setMinutes(now.getMinutes() + add, 0, 0);
      }
    }
    return {
      enabled: true,
      timesPerDay: this.everyMinutes ? Math.round(1440 / this.everyMinutes) : null,
      everyMinutes: this.everyMinutes,
      lastTriggeredAt: this.lastTriggeredAt,
      nextPlannedAt: next,
      maxPerCity: parseInt(process.env.SCRAPER_MAX_PER_CITY || '25', 10) || null,
      running: this.running,
      queueLength: this.queue.length,
      currentCity: this.current ? 'running' : null,
      sources: (process.env.SCRAPER_SOURCES || 'pararius'),
    };
  }
}

module.exports = new ScrapeRunner();
