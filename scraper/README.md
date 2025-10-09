# Scraper (NL)

Dit is de scrapersetup voor Fyxed Wonen (RentBird‑stijl). De scrapers halen woningen op (Pararius eerst), normaliseren de data en schrijven direct naar MongoDB. De Node backend matcht vervolgens gebruikers via de matchingservice en stuurt notificaties.

## Structuur

- `requirements.txt` – Python afhankelijkheden (Scrapy, PyMongo).
- `rentbird_scraper/` – Scrapy project
  - `spiders/pararius.py` – Pararius spider (lijst + detail)
  - `pipelines.py` – Mongo upsert (source + sourceId), veldnormalisatie, beschikbaarheid
  - `utils/normalize.py` – Helpers voor prijs, m², adres, booleans
  - `settings.py` – Scrapy instellingen (NL user agent, politeness)
- `run_pararius.py` – Runner voor lokaal draaien met stedenlijst

## Omgevingsvariabelen

- `MONGODB_URI` – Mongo verbinding (zelfde als server)
- Optioneel: `SCRAPER_CITIES` – kommagescheiden steden (bijv. `Amsterdam,Utrecht`)

## Gebruik (lokaal)

1) Python 3.10+ en een virtualenv
2) `pip install -r requirements.txt`
3) `.env` met `MONGODB_URI=` (of exporteren in shell)
4) Pararius draaien:
   - `python run_pararius.py --cities Amsterdam,Utrecht --max 100`

De spider upsert per woning op `(source, sourceId)` en zet o.a.:
- `title, address.{city,street}, price, size, rooms, furnished, images, sourceUrl, scrapedAt, isStillAvailable`

De Node cronjob matcht automatisch nieuwe woningen en verstuurt (digest/instant) notificaties.

## Opmerkingen

- HTML selectors kunnen veranderen; houd selectors in `pararius.py` up‑to‑date.
- Respecteer robots.txt en hanteer korte delays (throttle). 
- Voeg later Kamernet en Funda toe met dezelfde normalisatie en pipeline.

## Standalone gebruik (aparte scraper server)

1) Venv eenmalig aanmaken

```
cd scraper
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
deactivate
```

2) Maak `scraper/.env`

```
MONGODB_URI=mongodb+srv://...
SCRAPER_CONCURRENCY=3
SCRAPER_DELAY=1.25
SCRAPER_MAX=25
SCRAPER_SKIP_PIP=1
```

3) Run via npm‐scripts in `scraper/`

```
cd scraper
npm run scrape -- --sources pararius --cities "Amsterdam,Utrecht" --max 25
npm run kamernet -- --cities Utrecht --max 25
npm run huurwoningen -- --cities Arnhem --max 25
```

Notities
- Script leest eerst `scraper/.env`, daarna `server/.env` als fallback.
- Voor cron/systemd timers, zie `deployment/scraper/README.md`.
