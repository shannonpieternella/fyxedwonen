# Fyxed Wonen – Operations Guide

This guide explains how scraping, matching, and notifications work and how to manage them day‑to‑day.

## Overview
- Server: `server/index.js` (Express, Mongo, cron jobs, scraper scheduler)
- Scheduler (cron): `server/jobs/scheduler.js` (analytics, cleanup, digests, frequent matching)
- Scraper planner: `server/jobs/scrapeRunner.js` (plans runs, queues cities, spawns Python scraper)
- Python scraper: `scraper/run_sources.py` + `scraper/rentbird_scraper/spiders/*` (Scrapy)
- Storage: `scraper/rentbird_scraper/pipelines.py` upserts to Mongo on `(source, sourceId)`
- Matching: `server/services/matchingService.js` computes matches and triggers notifications
- Notifications: `server/services/notificationService.js` (instant + daily/weekly digests)
- API routes: `server/routes/*` (preferences, matches, admin, etc.)
- Client API service: `client/src/services/api.ts`

## Data Flow
1) Planner schedules based on env → `scrapeRunner.schedule()` computes `everyMinutes` and cron.
2) On each run → `enqueueAllCities()` → per city spawns Python: `run_sources.py --sources <src> --cities <city> --max <N>`
3) Scrapy spiders parse listings → pipeline upserts items to Mongo with `scrapedAt`, `lastCheckedAt`.
4) Frequent Matching job (every 5 min) processes new listings → creates matches → sends emails.
5) UI fetches preferences and “live” matches for immediate feedback.

## Scheduler & Scraping
- Frequency: set in `server/.env` using `SCRAPER_TIMES_PER_DAY`.
  - Mapping (choose one):
    - 5 min → `SCRAPER_TIMES_PER_DAY=288`
    - 10 min → `144`
    - 15 min → `96`
    - 30 min → `48`
    - 60 min → `24`
- Cap per city: `SCRAPER_MAX_PER_CITY=25` (default; change in `server/.env`).
- Sources: `SCRAPER_SOURCES=pararius` (comma‑separated if more sources configured).
- Cities: default from `scraper/config/cities_nl.json`. Override for a subset with `SCRAPER_CITIES="Amsterdam,Utrecht"`.
- Next run info (no auth):
  - `curl -sS http://localhost:5001/api/scraping-schedule`
- Admin status (requires admin JWT):
  - `curl -sS -H "Authorization: Bearer <adminJWT>" http://localhost:5001/api/admin/scraping-status`
- Force a run now (all cities):
  - `npm --prefix server run scrape`
- Force subset now:
  - `SCRAPER_CITIES="Amsterdam,Utrecht" SCRAPER_MAX=25 npm --prefix server run scrape`

## Storage & Deduplication
- Upsert key: `(source, sourceId)` prevents duplicates.
- Fields set/updated: `scrapedAt`, `lastCheckedAt`, `isStillAvailable`, `approvalStatus='approved'`.

## Matching & Emails
- Frequent matching: every 5 min (`server/jobs/scheduler.js`) on recent `scrapedAt` that haven’t been matched yet.
- Email conditions for instant alerts: user has active subscription, onboarding completed, email notifications enabled with `frequency=instant`.
- Digests: daily (9:00) and weekly (Monday 10:00) for users with those preferences.
- Backfill (re‑match recent listings):
  - `node server/scripts/run-matching-now.js 240` (last 4h; adjust minutes).

## Preferences & Live Matches
- Save/update preferences via app → stored under `user.preferences`.
- See immediate effect (ignores stored matches):
  - Matches page uses `GET /api/matches?live=1&limit=50` (user JWT required).
  - Dashboard preview also fetches with `live=1`.
- Persisted matches/emails only change when new listings arrive or after backfill.

## Logs & Troubleshooting
- Server logs show planner and per‑city scraper runs:
  - Start: `[ScrapeRunner] ➜ Start scrape: <City> [pararius]`
  - Python path/cmd printed for clarity.
  - Scrapy stats (INFO) appear on stderr; `exit 0` + `item_scraped_count` > 0 = success.
- Common issues:
  - Scrapy not installed: run `bash scraper/start.sh` once to create `.venv` and install `requirements.txt`.
  - City 404 (e.g., `zaanstad` on Pararius): use a valid city or adjust `cities_nl.json`.
  - No matches after changing preferences: use live endpoint (`/api/matches?live=1`) or run backfill.

## Key Endpoints
- Public schedule: `GET /api/scraping-schedule`
- Admin scraping status: `GET /api/admin/scraping-status`
- Preferences: `GET/POST /api/preferences`
- Matches (live): `GET /api/matches?live=1&limit=20`

## Environment Variables (server/.env)
- `SCRAPER_TIMES_PER_DAY` → run frequency (see mapping above)
- `SCRAPER_MAX_PER_CITY` → max items per city per run
- `SCRAPER_SOURCES` → sources list (e.g., `pararius`)
- `SCRAPER_CITIES` → optional subset of cities
- Politeness/perf:
  - `SCRAPER_DELAY` (default 0.75s), `SCRAPER_CONCURRENCY` (default 6), `SCRAPER_OBEY=1` (robots)
- Mongo/Stripe/Email/JWT: see existing `.env` for required settings

## Quick Commands
- Start backend: `cd server && npm start`
- Check next run: `curl -sS http://localhost:5001/api/scraping-schedule`
- Force run (all): `npm --prefix server run scrape`
- Force run (subset): `SCRAPER_CITIES="Amsterdam,Utrecht" SCRAPER_MAX=25 npm --prefix server run scrape`
- Backfill matches: `node server/scripts/run-matching-now.js 240`
- Cities list: `curl -sS http://localhost:5001/api/preferences/cities`

---
For deeper implementation details, see: `BACKEND_SETUP.md`, `DEPLOY_CHECKLIST.md`, and the files referenced above.
