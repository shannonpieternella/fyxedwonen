import os
import re
import json
import scrapy
from bs4 import BeautifulSoup
from urllib.parse import urlparse
from ...spiders.base import BaseListingSpider, city_to_slug
from rentbird_scraper.utils.normalize import parse_price, parse_size, parse_rooms


def normalize_city_from_slug(slug: str) -> str:
    s = (slug or '').strip().lower().replace('-', ' ')
    # Quick special cases
    mapping = {
        'den haag': 'Den Haag',
        "'s hertogenbosch": "S-Hertogenbosch",
        's hertogenbosch': 'S-Hertogenbosch',
        'the hague': 'Den Haag',
    }
    if s in mapping:
        return mapping[s]
    # Title case words, keep common lowercase words as is if needed
    return ' '.join(w.capitalize() for w in s.split())


class Spider(scrapy.Spider, BaseListingSpider):
    name = "rebogroep"

    def __init__(self, cities: str = None, max_items: int = 0, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.source = "rebogroep"
        self._yielded = 0
        self.max_items = int(max_items or 0)

        conf_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), 'config', 'sources')
        with open(os.path.join(conf_dir, f"{self.source}.json"), 'r') as f:
            self.cfg = json.load(f)

        # Cities filter
        if cities:
            self.allowed_cities = {c.strip().lower() for c in cities.split(',') if c.strip()}
        else:
            # If none provided, allow all (no filtering)
            self.allowed_cities = None

        pat = self.cfg.get('hrefPattern')
        self.href_re = re.compile(pat) if pat else None

        # Optional: seed detail URLs via env var (comma-separated) for testing
        seeds = os.getenv('SCRAPER_SEED_URLS')
        self.seed_urls = [u.strip() for u in seeds.split(',')] if seeds else []

    def start_requests(self):
        if self.seed_urls:
            for u in self.seed_urls:
                yield scrapy.Request(u, callback=self.parse_detail)
        else:
            for url in self.cfg.get('startUrlTemplates', ["https://www.rebogroep.nl/nl/aanbod"]):
                yield scrapy.Request(url, callback=self.parse_list)

    def parse_list(self, response: scrapy.http.Response):
        soup = BeautifulSoup(response.text, 'html.parser')
        sel = self.cfg.get('list', {})
        item_sel = sel.get('itemLink', "a[href^='/nl/aanbod/']")
        anchors = list(soup.select(item_sel))
        # Fallback: scan all anchors if none found
        if len(anchors) == 0:
            anchors = soup.find_all('a')
        try:
            self.logger.debug(f"[rebogroep] anchors found: {len(anchors)} on {response.url}")
            for a in anchors[:8]:
                self.logger.debug(f"  href: {a.get('href')}")
        except Exception:
            pass

        seen = set()
        for a in anchors:
            href = a.get('href')
            if not href:
                continue
            full = response.urljoin(href)
            if full in seen:
                continue
            seen.add(full)
            # Filter to real detail pages only
            allow = True
            if self.href_re:
                allow = bool(self.href_re.search(urlparse(full).path))
            else:
                allow = '/nl/aanbod/' in urlparse(full).path
            if not allow:
                continue
            yield scrapy.Request(full, callback=self.parse_detail)

        next_sel = sel.get('next')
        if next_sel:
            nxt = soup.select_one(next_sel)
            if nxt and nxt.get('href'):
                yield scrapy.Request(response.urljoin(nxt['href']), callback=self.parse_list)

    def parse_detail(self, response: scrapy.http.Response):
        if self.max_items and self._yielded >= self.max_items:
            return

        parsed = urlparse(response.url)
        segs = [s for s in parsed.path.split('/') if s]
        # segs like ["nl", "aanbod", "gen-041666-oudenoord-262-3513ev-utrecht"]
        source_id = None
        if len(segs) >= 3:
            tail = segs[2]
            parts = tail.split('-')
            if tail.startswith('gen-') and len(parts) >= 2:
                source_id = '-'.join(parts[:2])  # e.g., gen-041666 or gen-vgo0026694
            else:
                source_id = parts[0]  # e.g., r20204564401003

        # City from last slug segment as fallback
        city_slug = None
        if len(segs) >= 3:
            tail = segs[2]
            parts = tail.split('-')
            if parts:
                city_slug = parts[-1]
        city_name = normalize_city_from_slug(city_slug or '')

        # Optional stricter city extraction: scan page text for address city if needed
        soup = BeautifulSoup(response.text, 'html.parser')
        title_el = soup.select_one(self.cfg.get('detail', {}).get('title', 'h1'))
        title = title_el.get_text(strip=True) if title_el else 'Woning'

        # Price via page text; size/rooms via targeted regex near units/keywords
        page_text = soup.get_text(' ', strip=True)
        price = parse_price(page_text)

        size = None
        try:
            m2 = re.search(r"(\d{1,4})\s*(?:m²|m2|m\u00b2)", page_text, flags=re.IGNORECASE)
            if m2:
                size = int(m2.group(1))
        except Exception:
            size = None

        rooms = None
        try:
            r = re.search(r"(\d{1,2})\s*(?:kamers?|slaapkamers?)", page_text, flags=re.IGNORECASE)
            if r:
                rooms = float(r.group(1))
        except Exception:
            rooms = None

        # Images
        images = []
        for img in soup.select(self.cfg.get('detail', {}).get('images', 'img')):
            src = img.get('src') or img.get('data-src')
            if src and src.startswith('http'):
                images.append(src)

        # Filter by requested cities if provided
        if self.allowed_cities:
            if city_name and city_name.lower() not in self.allowed_cities:
                return

        item = {
            'source': self.source,
            'sourceId': source_id or parsed.path,
            'title': title,
            'sourceUrl': response.url,
            'address': {
                'city': city_name or None,
                'street': None
            },
            'price': price,
            'size': size,
            'rooms': rooms,
            'images': images[:12],
        }

        self._yielded += 1
        yield item
