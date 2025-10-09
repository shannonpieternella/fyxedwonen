#!/usr/bin/env python3
"""
NL: Runner voor Pararius spider. Voorbeeld:
  python run_pararius.py --cities Amsterdam,Utrecht --max 50
Vereist: MONGODB_URI in omgeving of .env (via `python-dotenv` indien gewenst).
"""
import argparse
import os
import sys
from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings
from rentbird_scraper.spiders.pararius import ParariusSpider


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--cities", type=str, default=os.getenv("SCRAPER_CITIES", "Amsterdam"))
    parser.add_argument("--max", type=int, default=int(os.getenv("SCRAPER_MAX", "0") or 0))
    args = parser.parse_args()

    # Ensure Scrapy loads our project settings (pipelines, UA, delays)
    os.environ.setdefault('SCRAPY_SETTINGS_MODULE', 'rentbird_scraper.settings')
    settings = get_project_settings()
    process = CrawlerProcess(settings)
    process.crawl(ParariusSpider, cities=args.cities, max_items=args.max)
    process.start()


if __name__ == "__main__":
    main()
