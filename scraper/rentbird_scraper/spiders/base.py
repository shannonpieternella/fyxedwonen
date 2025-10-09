import urllib.parse as urlparse


def city_to_slug(city: str) -> str:
    return urlparse.quote(city.lower().replace(" ", "-"))


class BaseListingSpider:
    name = "base-listing"
    source = "generic"

    def build_start_url(self, template: str, city: str) -> str:
        return template.replace("{city}", city).replace("{citySlug}", city_to_slug(city))

