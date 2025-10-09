from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any


@dataclass
class PropertyItem:
    source: str
    sourceId: str
    title: str
    sourceUrl: str
    address: Dict[str, Optional[str]]
    price: Optional[int] = None
    size: Optional[int] = None
    rooms: Optional[float] = None
    furnished: Optional[bool] = None
    petsAllowed: Optional[bool] = None
    images: List[str] = field(default_factory=list)
    description: Optional[str] = None
    scrapedAt: Optional[str] = None
    isStillAvailable: bool = True
    raw: Dict[str, Any] = field(default_factory=dict)

