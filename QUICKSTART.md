# Quick Start (NL)

## Benodigdheden
- Node.js 18+
- Python 3.10+
- MongoDB (Atlas URI) – zet in `server/.env`
- Zoho SMTP + Stripe keys (optioneel voor lokale test kun je demo/`EMAIL_MODE=log` gebruiken)

## 1) Omgevingen
- Server: kopieer `server/.env.example` → `server/.env` en vul in:
  - `MONGODB_URI`, `APP_BASE_URL`, `CLIENT_URL`
  - Zoho: `EMAIL_*` (of `EMAIL_MODE=log` voor console preview)
  - Stripe: `STRIPE_*` (demo of live)
  - Scraper: `SCRAPER_TIMES_PER_DAY=24`, `SCRAPER_SOURCES=pararius,kamernet,funda` etc.
- Client: maak `client/.env` (optioneel)
  - `REACT_APP_API_URL=http://localhost:5001/api`
  - `REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_demo`

## 2) Installeren
```
npm install --prefix server
npm install --prefix client
```

## 3) Starten (eenvoudig)
- Eén command voor server + client:
```
node dev.js
```
- Of via npm script:
```
npm run easy
```

Client: http://localhost:3000  ·  API: http://localhost:5001

## 4) Basisflow testen
1. Registreer op `/register` → door naar `/payment` → kies demo tier op `/subscription`.
2. Na success is je abonnement actief → naar `/preferences` en sla voorkeuren op.
3. Wacht tot de matching job (max. 5 min) of run een scrape handmatig:
```
# alle bronnen, alle steden (respecteert env throttling)
npm run scrape
```
4. Bekijk `/matches` (nieuwe matches). E‑mail: zet `EMAIL_MODE=log` voor console preview of configureer Zoho SMTP.

## 5) Scraper frequentie en throttling
- `SCRAPER_TIMES_PER_DAY` (bijv. 24 = elk uur); Node scheduler plant automatisch.
- `SCRAPER_CITY_SLEEP_MS` pauze tussen steden, standaard 5000 ms.
- `SCRAPER_DELAY` en `SCRAPER_CONCURRENCY` sturen Scrapy throttling.
- `SCRAPER_SOURCES` (comma‑separated) bepaalt bronnen (pararius,kamernet,funda).

## 6) Handy commands
```
# Start server + client
npm run easy

# Alleen server (hot reload als geconfigureerd)
npm run server

# Alleen client
npm run client

# Scrape nu (optionele ENV: SCRAPER_CITIES, SCRAPER_MAX_PER_CITY)
SCRAPER_CITIES=Amsterdam,Utrecht npm run scrape
```

## 7) Production notes
- Gebruik PM2/systemd voor `server/index.js`.
- Laat Node scheduler aan voor periodieke scrapes of gebruik OS cron met `scraper/run_sources.py`.
- Configureer Stripe webhook en Zoho SMTP in productie.
