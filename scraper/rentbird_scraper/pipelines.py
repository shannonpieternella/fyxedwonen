import os
import datetime as dt
from typing import Any, Dict
from pymongo import MongoClient, UpdateOne


class MongoPipeline:
    """
    Schrijft woningen naar MongoDB, upsert op (source, sourceId),
    zet beschikbaarheidsvelden en timestamps.
    """

    def open_spider(self, spider):
        uri = os.getenv("MONGODB_URI")
        if not uri:
            raise RuntimeError("MONGODB_URI ontbreekt voor scraper")
        self.client = MongoClient(uri)
        db_name = os.getenv("MONGODB_DB")
        if db_name:
            self.db = self.client.get_database(db_name)
        else:
            # Try default database from URI; fallback to 'fyxed' if none
            try:
                self.db = self.client.get_default_database()
            except Exception:
                self.db = self.client.get_database('fyxed')
        # Allow overriding target collection (for per-source staging)
        coll_name = os.getenv("SCRAPER_COLLECTION", "properties")
        self.props = self.db.get_collection(coll_name)
        self.verbose = os.getenv("SCRAPER_PIPELINE_LOG", "0") == "1"

    def close_spider(self, spider):
        try:
            if hasattr(self, 'client') and self.client:
                self.client.close()
        except Exception:
            pass

    def process_item(self, item: Dict[str, Any], spider):
        now = dt.datetime.utcnow()
        item.setdefault("scrapedAt", now)
        item.setdefault("isStillAvailable", True)

        # Sanity clamps to avoid bad parses crashing Mongo writes
        try:
            if isinstance(item.get('size'), (int, float)):
                if item['size'] <= 0 or item['size'] > 1000:
                    item['size'] = None
        except Exception:
            item['size'] = None
        try:
            if isinstance(item.get('rooms'), (int, float)):
                if item['rooms'] < 0 or item['rooms'] > 50:
                    item['rooms'] = None
        except Exception:
            item['rooms'] = None
        try:
            if isinstance(item.get('price'), (int, float)):
                if item['price'] <= 0 or item['price'] > 10_000_000:
                    item['price'] = None
        except Exception:
            item['price'] = None

        # Upsert per source + sourceId
        q = {"source": item["source"], "sourceId": item["sourceId"]}
        u = {
            "$set": {
                **item,
                "lastCheckedAt": now,
                "approvalStatus": item.get("approvalStatus", "approved"),
            },
            "$setOnInsert": {
                "createdAt": now,
            },
        }

        res = self.props.update_one(q, u, upsert=True)
        if self.verbose:
            action = 'inserted' if res.upserted_id else 'updated'
            print(f"[MongoPipeline] {action} {item.get('source')}:{item.get('sourceId')} €{item.get('price')} {item.get('address',{}).get('city')}")
        return item
