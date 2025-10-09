# Deploy Checklist (NL)

- Server (.env)
  - `PORT=5001`
  - `MONGODB_URI=` (Mongo Atlas of eigen cluster)
  - `APP_BASE_URL=` (bv. https://fyxedwonen.nl)
  - `CLIENT_URL=` (bv. https://fyxedwonen.nl)
  - Email (Zoho):
    - `EMAIL_HOST=smtp.zoho.eu`
    - `EMAIL_PORT=587`
    - `EMAIL_SECURE=false`
    - `EMAIL_USER=...`
    - `EMAIL_PASS=...`
    - `EMAIL_FROM=...@...`
    - `EMAIL_FROM_NAME=Fyxed Wonen`
  - Stripe:
    - `STRIPE_SECRET_KEY=sk_live_...`
    - `STRIPE_PUBLISHABLE_KEY=pk_live_...`
    - `STRIPE_WEBHOOK_SECRET=whsec_...`
    - `STRIPE_PRICE_1_MONTH=price_...`
    - `STRIPE_PRICE_2_MONTHS=price_...`
    - `STRIPE_PRICE_3_MONTHS=price_...`

- Client (client/.env)
  - `REACT_APP_API_URL=https://fyxedwonen.nl/api`
  - `REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_...`

- Scraper (env)
  - `MONGODB_URI=` (zelfde als server)
  - Optioneel: `SCRAPER_CITIES`, `SCRAPER_DELAY`, `SCRAPER_CONCURRENCY`

- Processen
  - Start server (PM2/systemd): `node server/index.js`
  - Start scrapers periodiek:
    - Cron voorbeeld elke 10 min Pararius: `*/10 * * * * cd /path && /usr/bin/python3 scraper/run_sources.py --sources pararius --max 200 >> /var/log/scraper.log 2>&1`
  - Zorg dat `server/jobs/scheduler.js` draait (start via index.js) voor digests/cleanup/frequent matching.

- Validatie
  - Registreer en log in; controleer JWT en `/api/subscription/status`.
  - Kies abonnement; rond checkout af; `verify-payment` activeert subscription.
  - Stel voorkeuren in; draai scraper; zie matches in `/matches` en e-mails via Zoho.

