import re
from typing import Optional


def to_int(text: Optional[str]) -> Optional[int]:
    if not text:
        return None
    digits = re.sub(r"[^0-9]", "", text)
    return int(digits) if digits else None


def parse_price(text: Optional[str]) -> Optional[int]:
    """Extract a plausible monthly rent from arbitrary text.
    - Finds all euro-like numbers
    - Picks the first value in a plausible rent range (200..20000)
    - Falls back to minimal number if none are in range
    """
    if not text:
        return None
    # find numbers possibly formatted with . or , as thousands separators
    nums = re.findall(r"\€\s*([0-9][0-9\.,]*)", text)
    candidates = []
    for n in nums:
        val = int(re.sub(r"[^0-9]", "", n)) if n else None
        if val:
            candidates.append(val)
    if not candidates:
        # Fallback: any integer digits
        base = to_int(text)
        return base
    # Prefer plausible rents
    for v in candidates:
        if 200 <= v <= 20000:
            return v
    # Fallback to smallest number (often monthly vs yearly elsewhere)
    return min(candidates)


def parse_size(text: Optional[str]) -> Optional[int]:
    # Voorbeeld: "65 m²"
    return to_int(text)


def parse_rooms(text: Optional[str]) -> Optional[float]:
    # Voorbeeld: "3 kamers" of "2,5 kamers"
    if not text:
        return None
    m = re.search(r"([0-9]+(?:[\.,][0-9])?)", text)
    if not m:
        return None
    return float(m.group(1).replace(",", "."))


def parse_bool(text: Optional[str]) -> Optional[bool]:
    if not text:
        return None
    t = text.strip().lower()
    if t in {"ja", "yes", "true"}:
        return True
    if t in {"nee", "no", "false"}:
        return False
    return None
