import os
import urllib.parse as urlparse
from typing import Iterable
import scrapy
from bs4 import BeautifulSoup
from rentbird_scraper.utils.normalize import parse_price, parse_size, parse_rooms


class ParariusSpider(scrapy.Spider):
    name = "pararius"

    def __init__(self, cities: str = None, max_items: int = 0, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Steden in URL‑formaat
        conf = cities or os.getenv("SCRAPER_CITIES", "Amsterdam,Utrecht")
        self.cities = [c.strip() for c in conf.split(",") if c.strip()]
        self.max_items = int(max_items or os.getenv("SCRAPER_MAX", 0) or 0)
        self._yielded = 0

    def start_requests(self) -> Iterable[scrapy.Request]:
        for city in self.cities:
            city_slug = urlparse.quote(city.lower().replace(" ", "-"))
            url = f"https://www.pararius.nl/huurwoningen/{city_slug}"
            yield scrapy.Request(url, callback=self.parse_list, meta={"city": city, "page": 1})

    def parse_list(self, response: scrapy.http.Response):
        city = response.meta["city"]
        soup = BeautifulSoup(response.text, "html.parser")

        # Kaarten selecteren (selectors kunnen wijzigen; houd in de gaten)
        cards = soup.select("section.search-listing article") or soup.select(".listing-search-item")

        for card in cards:
            a = card.select_one("a")
            if not a:
                continue
            href = a.get("href")
            if not href:
                continue
            url = response.urljoin(href)
            yield scrapy.Request(url, callback=self.parse_detail, meta={"city": city})

        # Volgende pagina
        next_link = soup.select_one('a[rel="next"]')
        if next_link and next_link.get("href"):
            yield scrapy.Request(response.urljoin(next_link["href"]), callback=self.parse_list, meta={"city": city})

    def parse_detail(self, response: scrapy.http.Response):
        if self.max_items and self._yielded >= self.max_items:
            return

        soup = BeautifulSoup(response.text, "html.parser")

        title = (soup.select_one("h1") or {}).get_text(strip=True) if soup.select_one("h1") else None

        # Kenmerken – selectors kunnen afwijken; probeer robuust te blijven
        price_text = None
        size_text = None
        rooms_text = None
        furnished = None
        images = []

        # Voorbeelden van selectors; bij aanpassingen site, update hier.
        price_el = soup.find(text=lambda t: t and "€" in t)
        price_text = price_el.strip() if isinstance(price_el, str) else None

        # m² en kamers
        for li in soup.select("li"):
            txt = li.get_text(" ", strip=True)
            if "m²" in txt and not size_text:
                size_text = txt
            if "kamer" in txt and not rooms_text:
                rooms_text = txt
            if any(k in txt.lower() for k in ["gemeubileerd", "ongemeubileerd"]):
                furnished = "gemeubileerd" in txt.lower()

        # Afbeeldingen
        for img in soup.select("img"):
            src = img.get("src") or img.get("data-src")
            if src and src.startswith("http"):
                images.append(src)

        item = {
            "source": "pararius",
            "sourceId": response.url.split("-")[-1].split("/")[0],  # grove benadering
            "title": title or "Woning",
            "sourceUrl": response.url,
            "address": {
                "city": response.meta.get("city"),
                "street": None,
            },
            "price": parse_price(price_text),
            "size": parse_size(size_text),
            "rooms": parse_rooms(rooms_text),
            "furnished": furnished,
            "images": images[:12],
        }

        self._yielded += 1
        yield item

