import copy
import json
import os
import tempfile
from typing import Any, Dict

from tools.connect_location2 import connect_location2


def _normalize_activity_payload(activity_payload: Dict[str, Any]) -> Dict[str, Any]:
    """规范化前端传入的活动数据，确保包含 raw_trip 所需的字段。"""
    normalized = copy.deepcopy(activity_payload or {})

    if "id" not in normalized:
        alias_id = normalized.get("activity_id")
        if alias_id:
            normalized["id"] = alias_id
        else:
            raise ValueError("new_activity 缺少 id 或 activity_id")

    if "title" not in normalized and "activity_name" in normalized:
        normalized["title"] = normalized["activity_name"]

    if "type" not in normalized:
        normalized["type"] = "activity"

    return normalized


def _replace_activity(raw_trip: Dict[str, Any], replacement: Dict[str, Any]) -> Dict[str, Any]:
    """在 raw_trip 中用 replacement 更新同 id 的活动。
    
    如果 replacement 包含 poi_details 字段，则视为完整替换；
    否则只更新提供的字段（合并模式）。
    """
    target_id = replacement["id"]
    replaced = False

    for day in raw_trip.get("days", []):
        activities = day.get("activities", [])
        for index, activity in enumerate(activities):
            if activity.get("id") == target_id:
                # 如果提供了 poi_details，说明是完整的活动数据，直接替换
                if "poi_details" in replacement:
                    activities[index] = replacement
                else:
                    # 否则只更新提供的字段
                    activities[index].update(replacement)
                replaced = True
                break
        if replaced:
            break

    if not replaced:
        raise ValueError(f"raw_trip 中未找到活动 {target_id}")

    return raw_trip


def _generate_detailed_trip(raw_trip: Dict[str, Any]) -> Dict[str, Any]:
    """调用 connect_location2 生成新的 detailed_trip。"""
    temp_file_path = None
    try:
        with tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False, encoding="utf-8") as temp_file:
            json.dump(raw_trip, temp_file, ensure_ascii=False)
            temp_file_path = temp_file.name

        detailed_trip = connect_location2(temp_file_path)
        if not detailed_trip:
            raise ValueError("connect_location2 生成 detailed_trip 失败")
        return detailed_trip
    finally:
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)


def modify_and_regenerate_trip(collection, trip_id: str, new_activity: Dict[str, Any]) -> Dict[str, Any]:
    """更新 raw_trip 中的活动，并基于 connect_location2 生成新的 detailed_trip。"""
    if not trip_id:
        raise ValueError("trip_id 不能为空")
    if not isinstance(new_activity, dict):
        raise ValueError("new_activity 必须是对象")

    trip_document = collection.find_one({"trip_id": trip_id})
    if not trip_document:
        raise ValueError(f"未找到 trip_id 为 {trip_id} 的行程")

    raw_trip = trip_document.get("raw_trip")
    if not raw_trip:
        raise ValueError(f"trip_id {trip_id} 缺少 raw_trip 数据")

    # 硬编码新的 activity_6 数据（希尔顿酒店）
    new_activity_6 = {
        "id": "activity_6",
        "start_time": "21:00:00",
        "end_time": "22:00:00",
        "description": "入住北京王府井希尔顿酒店",
        "notes": "办理入住手续，享受五星级酒店服务",
        "cost": 1500.0,
        "type": "activity",
        "title": "入住北京王府井希尔顿酒店",
        "location": {
            "name": "北京王府井希尔顿酒店",
            "address": "北京市东城区王府井东街8号",
            "coordinates": None
        },
        "recommended_products": [],
        "poi_details": {
            "name": "北京王府井希尔顿酒店",
            "rec_reason": "地理位置优越，设施豪华，服务上乘",
            "POIId": "B000A83M8C",
            "description": "北京王府井希尔顿酒店位于北京市中心，步行可达故宫与天安门。 酒店设有客房与套房，中西餐厅与酒廊，水疗、室内恒温泳池与24小时健身中心。",
            "address": "北京市东城区王府井东街8号",
            "photos": [
                {
                    "url": "https://www.hilton.com.cn/images/2020/09/24/c0a6b5a3-7d2d-456b-a829-1c7b8e5c6a1e.jpg",
                    "title": "酒店外观"
                },
                {
                    "url": "https://www.hilton.com.cn/images/2020/09/24/6f5e3d1a-3e2c-4e8b-9e4a-5b0c7c3d2e2a.jpg",
                    "title": "酒店大堂"
                },
                {
                    "url": "https://www.hilton.com.cn/images/2022/08/11/4ee5f4f8-1d2a-4d7a-8f9b-6b7d1c6e4e5e.jpg",
                    "title": "豪华套房"
                }
            ],
            "rating": "4.6",
            "cost": 1500.0,
            "poi_type": "hotel"
        }
    }
    
    print(f"[modify] 使用硬编码的希尔顿酒店数据替换 activity_6")

    updated_raw_trip = _replace_activity(copy.deepcopy(raw_trip), new_activity_6)
    print("[modify] raw_trip 中 activity 已更新")

    for day in updated_raw_trip.get("days", []):
        for activity in day.get("activities", []):
            if activity.get("id") == new_activity_6["id"]:
                print(f"[modify] 更新后的 raw activity: {json.dumps(activity, ensure_ascii=False)}")
                break

    updated_detailed_trip = _generate_detailed_trip(updated_raw_trip)
    print("[modify] detailed_trip 已重新生成")

    update_result = collection.update_one(
        {"trip_id": trip_id},
        {
            "$set": {
                "raw_trip": updated_raw_trip,
                "detailed_trip": updated_detailed_trip,
            }
        }
    )

    if update_result.modified_count == 0:
        print(f"[modify] 警告: trip_id {trip_id} 在 MongoDB 中没有产生修改")

    return updated_detailed_trip
