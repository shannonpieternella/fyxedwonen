import os

# Basis Scrapy instellingen (NL)
BOT_NAME = "rentbird_scraper"
SPIDER_MODULES = ["rentbird_scraper.spiders"]
NEWSPIDER_MODULE = "rentbird_scraper.spiders"

# Beleefd scrapen
# Allow override for testing: export SCRAPER_OBEY=0 to ignore robots.txt
ROBOTSTXT_OBEY = os.getenv("SCRAPER_OBEY", "1") == "1"
DOWNLOAD_DELAY = float(os.getenv("SCRAPER_DELAY", "0.75"))  # ~1 req/sec
CONCURRENT_REQUESTS = int(os.getenv("SCRAPER_CONCURRENCY", "8"))
RANDOMIZE_DOWNLOAD_DELAY = True

DEFAULT_REQUEST_HEADERS = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "nl-NL,nl;q=0.8,en-US;q=0.5,en;q=0.3",
    "User-Agent": os.getenv(
        "SCRAPER_UA",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36",
    ),
}

ITEM_PIPELINES = {
    "rentbird_scraper.pipelines.MongoPipeline": 300,
}

LOG_LEVEL = os.getenv("SCRAPER_LOG", "INFO")
