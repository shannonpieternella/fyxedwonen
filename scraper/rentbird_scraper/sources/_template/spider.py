import os
import json
import scrapy
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from ..spiders.base import BaseListingSpider, city_to_slug
from rentbird_scraper.utils.normalize import parse_price, parse_size, parse_rooms


class Spider(scrapy.Spider, BaseListingSpider):
    name = "template"

    def __init__(self, cities: str = None, max_items: int = 0, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.source = "template"
        self._yielded = 0
        self.max_items = int(max_items or 0)

        # Load selectors/config from scraper/config/sources/template.json
        conf_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'config', 'sources')
        with open(os.path.join(conf_dir, f"{self.source}.json"), 'r') as f:
            self.cfg = json.load(f)

        if cities:
            self.cities = [c.strip() for c in cities.split(',') if c.strip()]
        else:
            with open(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'config', 'cities_nl.json'), 'r') as f:
                self.cities = json.load(f)

    def start_requests(self):
        templates = []
        if 'startUrlTemplates' in self.cfg and isinstance(self.cfg['startUrlTemplates'], list):
            templates = self.cfg['startUrlTemplates']
        elif 'startUrlTemplate' in self.cfg:
            templates = [self.cfg['startUrlTemplate']]
        for city in self.cities:
            for tpl in templates:
                url = tpl.replace('{citySlug}', city_to_slug(city)).replace('{city}', city)
                yield scrapy.Request(url, callback=self.parse_list, meta={'city': city})

    def parse_list(self, response: scrapy.http.Response):
        soup = BeautifulSoup(response.text, 'html.parser')
        sel = self.cfg['list']
        anchors = list(soup.select(sel['itemLink']))
        for a in anchors:
            href = a.get('href')
            if not href:
                continue
            full = response.urljoin(href)
            yield scrapy.Request(full, callback=self.parse_detail, meta={'city': response.meta['city']})

        next_sel = sel.get('next')
        if next_sel:
            nxt = soup.select_one(next_sel)
            if nxt and nxt.get('href'):
                yield scrapy.Request(response.urljoin(nxt['href']), callback=self.parse_list, meta={'city': response.meta['city']})

    def parse_detail(self, response: scrapy.http.Response):
        if self.max_items and self._yielded >= self.max_items:
            return
        soup = BeautifulSoup(response.text, 'html.parser')
        det = self.cfg['detail']
        title_el = soup.select_one(det.get('title', 'h1'))
        title = title_el.get_text(strip=True) if title_el else 'Woning'

        price_text = soup.get_text(' ', strip=True)
        size_text = price_text
        rooms_text = price_text

        item = {
            'source': self.source,
            'sourceId': response.url.split('/')[-1],
            'title': title,
            'sourceUrl': response.url,
            'address': {
                'city': response.meta.get('city'),
                'street': None
            },
            'price': parse_price(price_text),
            'size': parse_size(size_text),
            'rooms': parse_rooms(rooms_text),
            'images': [],
        }

        self._yielded += 1
        yield item

