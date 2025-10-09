Scraper Server Setup (Separate Host)

Goal: run Pararius, Kamernet, and Huurwoningen scrapers on a separate server so the API stays fast. Scrapers write to the same MongoDB; the API (on a different host) handles matching + notifications.

Prereqs (Ubuntu/Debian)
- sudo apt-get update && sudo apt-get install -y git python3-venv
- (Optional) sudo apt-get install -y systemd if minimal image

1) Checkout repo
- mkdir -p /opt && cd /opt
- git clone <your repo> Fyxedwonen
- cd /opt/Fyxedwonen/scraper
- python3 -m venv .venv
- source .venv/bin/activate
- pip install -r requirements.txt
- deactivate

2) Create env file for scrapers
- sudo tee /etc/fyxedwonen-scraper.env >/dev/null <<'ENV'
MONGODB_URI=<atlas-uri>
# Throttle and caps
SCRAPER_CONCURRENCY=3
SCRAPER_DELAY=1.25
SCRAPER_MAX_PER_CITY=25
# Don’t reinstall on every run
SCRAPER_SKIP_PIP=1
ENV

3A) Systemd timers (recommended)

- Edit the WorkingDirectory path below to your repo path (/opt/Fyxedwonen)
- Copy units to /etc/systemd/system and enable timers

sudo cp /opt/Fyxedwonen/deployment/scraper/fyxed-scraper-pararius.service /etc/systemd/system/
sudo cp /opt/Fyxedwonen/deployment/scraper/fyxed-scraper-pararius.timer /etc/systemd/system/
sudo cp /opt/Fyxedwonen/deployment/scraper/fyxed-scraper-kamernet.service /etc/systemd/system/
sudo cp /opt/Fyxedwonen/deployment/scraper/fyxed-scraper-kamernet.timer /etc/systemd/system/
sudo cp /opt/Fyxedwonen/deployment/scraper/fyxed-scraper-huurwoningen.service /etc/systemd/system/
sudo cp /opt/Fyxedwonen/deployment/scraper/fyxed-scraper-huurwoningen.timer /etc/systemd/system/

sudo systemctl daemon-reload
sudo systemctl enable --now fyxed-scraper-pararius.timer
sudo systemctl enable --now fyxed-scraper-kamernet.timer
sudo systemctl enable --now fyxed-scraper-huurwoningen.timer

- Check next runs: systemctl list-timers | grep fyxed

3B) Cron alternative

crontab -e

*/5 * * * * . /etc/fyxedwonen-scraper.env; cd /opt/Fyxedwonen && SCRAPER_SOURCES=pararius bash scraper/start.sh >> /var/log/scrape-pararius.log 2>&1
2-59/10 * * * * . /etc/fyxedwonen-scraper.env; cd /opt/Fyxedwonen && SCRAPER_SOURCES=kamernet bash scraper/start.sh >> /var/log/scrape-kamernet.log 2>&1
5-59/10 * * * * . /etc/fyxedwonen-scraper.env; cd /opt/Fyxedwonen && SCRAPER_SOURCES=huurwoningen bash scraper/start.sh >> /var/log/scrape-huurwoningen.log 2>&1

Notes
- API host: set SCRAPER_SCHEDULER_ENABLED=0 in server/.env and restart the API. Keep ENABLE_LISTING_WATCH=1 so new listings match instantly.
- Scraper host: you do NOT need Node; using bash scraper/start.sh is enough (Python venv runs Scrapy).
- Logs: journalctl -u fyxed-scraper-<source>.service or tail cron logs.
- Adjust schedule as needed; stagger starts to avoid peaks.

Validation
- After a run, new docs appear in MongoDB ‘properties’ with source=pararius/kamernet/huurwoningen.
- API host sends notifications as matches are created (instant via watcher or within ~5 minutes).

