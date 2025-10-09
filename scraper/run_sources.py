#!/usr/bin/env python3
"""
NL: Multi-source runner op basis van config.
Gebruik:
  python run_sources.py --sources pararius --cities Amsterdam,Utrecht --max 50
Als --cities ontbreekt, wordt config/cities_nl.json gebruikt.
"""
import argparse
import json
import os
import importlib
from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings
from rentbird_scraper.spiders.config_spider import ConfigSpider


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--sources', type=str, default='pararius')
    parser.add_argument('--cities', type=str, default=None)
    parser.add_argument('--max', type=int, default=0)
    args = parser.parse_args()

    sources = [s.strip() for s in args.sources.split(',') if s.strip()]

    # Ensure Scrapy loads our project settings (pipelines, UA, delays)
    os.environ.setdefault('SCRAPY_SETTINGS_MODULE', 'rentbird_scraper.settings')
    settings = get_project_settings()
    process = CrawlerProcess(settings)

    def load_custom_spider(source_name: str):
        try:
            mod = importlib.import_module(f"rentbird_scraper.sources.{source_name}.spider")
        except ModuleNotFoundError:
            return None
        # Prefer attribute 'Spider', else try <Source>Spider
        spider_cls = getattr(mod, 'Spider', None)
        if spider_cls is None:
            alt_name = f"{source_name.capitalize()}Spider"
            spider_cls = getattr(mod, alt_name, None)
        return spider_cls

    for s in sources:
        spider_cls = load_custom_spider(s)
        if spider_cls:
            process.crawl(spider_cls, cities=args.cities, max_items=args.max)
        else:
            process.crawl(ConfigSpider, source=s, cities=args.cities, max_items=args.max)

    process.start()


if __name__ == '__main__':
    main()
