from bson import ObjectId
from pymongo import ASCENDING, DESCENDING, GEOSPHERE
from datetime import datetime


def ensure_indexes(collection):
    """创建常用索引：user_id、poi_id、复合索引和最近使用索引。"""
    try:
        collection.create_index([("user_id", ASCENDING)])
        collection.create_index([("poi_id", ASCENDING)])
        collection.create_index([("user_id", ASCENDING), ("poi_id", ASCENDING)])
        collection.create_index([("user_id", DESCENDING), ("last_used", DESCENDING)])
    except Exception:
        # 忽略索引创建失败的轻微错误（例如权限问题）
        pass

    # 如果 poi_snapshot.location 使用 GeoJSON，则尝试创建地理索引（若不适用会抛异常）
    try:
        collection.create_index([("poi_snapshot.location", GEOSPHERE)])
    except Exception:
        pass


def create_user_poi(collection, data: dict) -> str:
    """插入一条用户保存的 POI，返回插入的 _id（字符串）。"""
    if not data.get("user_id"):
        raise ValueError("missing user_id")

    doc = {
        "user_id": data["user_id"],
        "poi_id": data.get("poi_id"),
        "custom_name": data.get("custom_name"),
        "poi_snapshot": data.get("poi_snapshot"),
        "note": data.get("note"),
        "visibility": data.get("visibility", "private"),
        "tags": data.get("tags", []),
        "created_at": datetime.utcnow(),
        "last_used": data.get("last_used"),
        "user_rating": data.get("user_rating"),
    }

    res = collection.insert_one(doc)
    return str(res.inserted_id)


def get_user_pois(collection, user_id: str, limit: int = 50, page: int = 1):
    skip = max(0, (page - 1) * limit)
    # user_pois module removed - placeholder file to indicate rollback
    # Originally added by assistant during an edit; restored to empty placeholder per user request.
