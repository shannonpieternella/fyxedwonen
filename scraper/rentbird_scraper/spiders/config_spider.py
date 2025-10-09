import json
import os
from typing import Iterable
from urllib.parse import urlparse
import re
import scrapy
from bs4 import BeautifulSoup
from .base import BaseListingSpider, city_to_slug
from rentbird_scraper.utils.normalize import parse_price, parse_size, parse_rooms


class ConfigSpider(scrapy.Spider, BaseListingSpider):
    name = "config-spider"

    def __init__(self, source: str, cities: str = None, max_items: int = 0, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.source = source
        self._yielded = 0
        self.max_items = int(max_items or 0)

        conf_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'config', 'sources')
        with open(os.path.join(conf_dir, f"{source}.json"), 'r') as f:
            self.cfg = json.load(f)
        # Optional href filter pattern to avoid non-listing pages
        self.href_re = None
        pat = self.cfg.get('hrefPattern')
        if pat:
            self.href_re = re.compile(pat)

        # Optional per-source slug overrides (skip or map special cases)
        overrides_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'config', 'slug_overrides')
        self.slug_overrides = {}
        try:
            with open(os.path.join(overrides_dir, f"{self.source}.json"), 'r') as f:
                self.slug_overrides = json.load(f) or {}
        except Exception:
            self.slug_overrides = {}

        if cities:
            self.cities = [c.strip() for c in cities.split(',') if c.strip()]
        else:
            with open(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'config', 'cities_nl.json'), 'r') as f:
                self.cities = json.load(f)

    def start_requests(self) -> Iterable[scrapy.Request]:
        templates = []
        if 'startUrlTemplates' in self.cfg and isinstance(self.cfg['startUrlTemplates'], list):
            templates = self.cfg['startUrlTemplates']
        elif 'startUrlTemplate' in self.cfg:
            templates = [self.cfg['startUrlTemplate']]

        for city in self.cities:
            for tpl in templates:
                # Apply slug override; empty override means skip this city for this source
                slug = self.slug_overrides.get(city)
                if slug is None:
                    slug = city_to_slug(city)
                if isinstance(self.slug_overrides.get(city), str) and self.slug_overrides.get(city) == '':
                    continue
                url = tpl.replace('{citySlug}', slug).replace('{city}', city)
                yield scrapy.Request(url, callback=self.parse_list, meta={'city': city})

    def parse_list(self, response: scrapy.http.Response):
        # Respect max_items early to avoid following pagination when done
        if self.max_items and self._yielded >= self.max_items:
            return
        soup = BeautifulSoup(response.text, 'html.parser')
        sel = self.cfg['list']
        seen = set()
        anchors = list(soup.select(sel['itemLink']))
        # Fallback: collect all anchors if few/no matches
        if len(anchors) < 3:
            anchors.extend(soup.find_all('a'))
        for a in anchors:
            href = a.get('href')
            if not href:
                continue
            full = response.urljoin(href)
            if full in seen:
                continue
            # Filter to true listing detail pages only
            allow = True
            if self.href_re:
                allow = bool(self.href_re.search(urlparse(full).path))
            else:
                p = urlparse(full).path
                # Default heuristic: must contain '-te-huur' or '/huren/' and must NOT be makelaars/info/etc
                allow = ((('-te-huur' in p) or ('/huren/' in p))
                         and all(seg not in p for seg in ['/makelaars', '/info', '/registreren', '/over']))
            if not allow:
                continue
            seen.add(full)
            yield scrapy.Request(full, callback=self.parse_detail, meta={'city': response.meta['city']})

        next_sel = sel.get('next')
        if next_sel and (not self.max_items or self._yielded < self.max_items):
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

        price_text = None
        if (pt := det.get('priceText')):
            # find first element containing €
            price_text = soup.find(text=lambda t: isinstance(t, str) and '€' in t)

        size_text = None
        rooms_text = None
        for li in soup.select(det.get('sizeText', 'li')):
            txt = li.get_text(' ', strip=True)
            if 'm²' in txt and not size_text:
                size_text = txt
            if 'kamer' in txt and not rooms_text:
                rooms_text = txt

        furnished = None
        furn_keys = [k.lower() for k in det.get('furnishedKeywords', [])]
        if furn_keys:
            page_text = soup.get_text(' ', strip=True).lower()
            if any(k in page_text for k in furn_keys):
                furnished = 'gemeubileerd' in page_text

        images = []
        for img in soup.select(det.get('images', 'img')):
            src = img.get('src') or img.get('data-src')
            if src and src.startswith('http'):
                images.append(src)

        # offeredSince (Aangeboden sinds dd-mm-yyyy)
        offered_since = None
        txt = soup.get_text(' ', strip=True)
        m = re.search(r"Aangeboden\s+sinds\s+(\d{2}-\d{2}-\d{4})", txt, re.IGNORECASE)
        if m:
            try:
                d, mth, y = m.group(1).split('-')
                offered_since = f"{y}-{mth}-{d}T00:00:00Z"
            except Exception:
                offered_since = None

        # Robust sourceId extraction from URL
        parsed = urlparse(response.url)
        segs = [s for s in parsed.path.split('/') if s]
        source_id = None
        # Prefer an 8-char hex segment (Pararius style)
        for s in segs:
            if re.fullmatch(r'[a-f0-9]{8}', s):
                source_id = s
                break
        # Else try trailing -digits (Kamernet style)
        if not source_id:
            m = re.search(r'-(\d{5,})$', parsed.path)
            if m:
                source_id = m.group(1)
        # Else fallback to second last segment
        if not source_id and len(segs) >= 1:
            source_id = segs[-1]

        item = {
            'source': self.source,
            'sourceId': source_id,
            'title': title,
            'sourceUrl': response.url,
            'address': {
                'city': response.meta.get('city'),
                'street': None
            },
            'price': parse_price(price_text),
            'size': parse_size(size_text),
            'rooms': parse_rooms(rooms_text),
            'furnished': furnished,
            'images': images[:12],
            'offeredSince': offered_since
        }

        self._yielded += 1
        yield item
