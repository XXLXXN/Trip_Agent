import json
import os
import tempfile
import time
from typing import Any, Dict, Tuple
import httpx
import requests

from tools.connect_location2 import connect_location2

# modify_agent 服务地址
MODIFY_AGENT_URL = "http://127.0.0.1:8085/chat"

# 高德 API 配置
AMAP_API_KEY = "794ffc804bdb7d0d5e8fa6191f034ad9"
AMAP_POI_DETAIL_URL = "https://restapi.amap.com/v3/place/detail"
AMAP_POI_SEARCH_URL = "https://restapi.amap.com/v5/place/text"
AMAP_POI_SEARCH_URL_V3 = "https://restapi.amap.com/v3/place/text"


def _fetch_poi_detail(poi_id: str) -> Dict | None:
    """通过 POI ID 获取详情（含照片）。"""
    try:
        resp = requests.get(AMAP_POI_DETAIL_URL, params={
            "key": AMAP_API_KEY,
            "id": poi_id,
            "show_fields": "business,photos",
            "output": "json",
        }, timeout=10)
        if resp.status_code == 200:
            data = resp.json()
            if data.get("status") == "1" and data.get("pois"):
                p = data["pois"][0]
                return {
                    "poi_id": p.get("id", poi_id),
                    "photos": [
                        {"url": ph.get("url", ""), "title": ph.get("title", ph.get("name", ""))}
                        for ph in (p.get("photos") or [])[:5]
                    ],
                    "rating": p.get("business", {}).get("rating", ""),
                    "address": p.get("address", ""),
                }
    except Exception as e:
        print(f"[enrich_poi] 详情请求异常: {e}")
    return None


def _search_poi_by_name(name: str, city: str = "") -> Dict | None:
    """通过名称搜索 POI，返回第一个结果的详情。"""
    if not name:
        return None
    try:
        # 先用 v5 搜索获取真实 POI ID
        params = {
            "key": AMAP_API_KEY,
            "keywords": name,
            "output": "json",
            "offset": 3,
        }
        if city:
            params["city"] = city
        resp = requests.get(AMAP_POI_SEARCH_URL, params=params, timeout=10)
        if resp.status_code == 200:
            data = resp.json()
            if data.get("status") == "1" and data.get("pois"):
                real_id = data["pois"][0]["id"]
                return _fetch_poi_detail(real_id)
    except Exception as e:
        print(f"[enrich_poi] 搜索异常: {e}")
    return None


def _enrich_poi_photos(trip: Dict[str, Any]) -> None:
    """为 detailed_trip 中缺少图片的 activity 补齐高德 POI 照片。

    先尝试 activity 自带的 POIId，无效则用名称搜索匹配。
    """
    if not trip:
        return

    destination = trip.get("destination", "")

    for day in trip.get("days", []):
        for act in day.get("activities", []):
            if not isinstance(act, dict):
                continue
            if act.get("type") == "transportation":
                continue

            poi = act.get("poi_details")
            if not poi:
                # 创建空的 poi_details
                act["poi_details"] = {}
                poi = act["poi_details"]

            # 已有照片则跳过
            if poi.get("photos"):
                continue

            poi_id = poi.get("POIId", "")
            poi_name = poi.get("name", "") or act.get("title", "") or act.get("location", {}).get("name", "")

            info = None

            # 先尝试 AI 给的 POI ID
            if poi_id:
                info = _fetch_poi_detail(poi_id)

            # POI ID 无效则按名称搜索
            if not info and poi_name:
                print(f"[enrich_poi] POI ID '{poi_id}' 无效，按名称搜索 '{poi_name}'...")
                info = _search_poi_by_name(poi_name, destination)

            if info:
                if info["photos"]:
                    poi["photos"] = info["photos"]
                    print(f"[enrich_poi] {poi_name}: {len(info['photos'])} 张照片")
                if info["rating"] and not poi.get("rating"):
                    poi["rating"] = info["rating"]
                if info["address"] and not poi.get("address"):
                    poi["address"] = info["address"]
                # 如果 POI ID 变了，更新为真实 ID
                if info["poi_id"] and info["poi_id"] != poi_id:
                    poi["POIId"] = info["poi_id"]
            else:
                print(f"[enrich_poi] {poi_name}: 未找到 POI 信息")


def _strip_transportation(trip: Dict[str, Any]) -> Dict[str, Any]:
    """移除每个 day 中的 transportation 类型 activity，返回干净的行程副本。

    modify_agent 返回的 activities 数组已包含交通条目。connect_location2 会
    在所有相邻 activity 之间重新插入真实交通数据（通过高德 API），因此必须先
    清除已有的交通条目，避免重复。
    """
    import copy
    cleaned = copy.deepcopy(trip)
    for day in cleaned.get("days", []):
        day["activities"] = [
            a for a in day.get("activities", [])
            if a.get("type") != "transportation"
        ]
    return cleaned


def _generate_detailed_trip(raw_trip: Dict[str, Any]) -> Dict[str, Any]:
    """调用 connect_location2 生成新的 detailed_trip。"""
    temp_file_path = None
    try:
        # 先移除已有交通条目，避免 connect_location2 重复添加
        clean_trip = _strip_transportation(raw_trip)

        with tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False, encoding="utf-8") as temp_file:
            json.dump(clean_trip, temp_file, ensure_ascii=False)
            temp_file_path = temp_file.name

        detailed_trip = connect_location2(temp_file_path)
        if not detailed_trip:
            raise ValueError("connect_location2 生成 detailed_trip 失败")
        return detailed_trip
    finally:
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)


def _call_modify_agent(raw_trip: Dict[str, Any], user_request: str) -> Tuple[Dict[str, Any], str]:
    """调用 modify_agent API 来处理行程修改请求。

    返回 (update_data, raw_response_text)。
    update_data 是扁平化的字典（用于 $set），raw_response_text 用于调试保存。
    """
    start_ts = time.time()
    raw_response_text = ""
    try:
        full_query = f"""
这是当前的行程JSON数据：
```json
{json.dumps(raw_trip, ensure_ascii=False, indent=2)}
```

用户修改请求：{user_request}

请按照你的提示词要求，分析并生成 update_data 字典。
"""

        print(f"[modify_agent] 调用 modify_agent API")
        print(f"[modify_agent] User request: {user_request}")

        # 增大超时时间到 300 秒（5 分钟），避免大型 LLM 响应被过早超时
        with httpx.Client(timeout=300.0) as client:
            response = client.post(MODIFY_AGENT_URL, json={"query": full_query})
            response.raise_for_status()

            try:
                result = response.json()
            except Exception:
                raw_response_text = response.text
                result = {}

            if not raw_response_text:
                raw_response_text = response.text

            # 如果返回为 dict，直接当作 update_data
            if isinstance(result, dict) and len(result) > 0:
                return result, raw_response_text

            # 否则尝试从文本中提取 JSON
            response_text = raw_response_text
            if response_text and ("{" in response_text):
                start_idx = response_text.find("{")
                end_idx = response_text.rfind("}") + 1
                if start_idx != -1 and end_idx > start_idx:
                    json_str = response_text[start_idx:end_idx]
                    update_data = json.loads(json_str)
                    return update_data, raw_response_text
                else:
                    raise ValueError("无法从响应中提取 JSON 数据")

            raise ValueError("modify_agent 响应格式异常")
    except httpx.HTTPError as e:
        raise ValueError(f"调用 modify_agent 失败: {e}")
    except json.JSONDecodeError as e:
        raise ValueError(f"解析 modify_agent 响应失败: {e}")
    finally:
        duration = time.time() - start_ts
        print(f"[modify_agent] 调用耗时: {duration:.2f}s")


def _apply_update_data_to_mongodb(collection, trip_id: str, update_data: Dict[str, Any]) -> None:
    """将扁平化的 update_data 应用到 MongoDB。"""
    if not update_data:
        return

    mongo_update = {}
    for key, value in update_data.items():
        prefixed_key = f"raw_trip.{key}"
        mongo_update[prefixed_key] = value

    collection.update_one({"trip_id": trip_id}, {"$set": mongo_update})


def modify_and_regenerate_trip(collection, trip_id: str, new_activity: Dict[str, Any]) -> Dict[str, Any]:
    """使用 modify_agent 更新 raw_trip，并基于 connect_location2 生成新的 detailed_trip。"""
    if not trip_id:
        raise ValueError("trip_id 不能为空")
    if not isinstance(new_activity, dict):
        raise ValueError("new_activity 必须是对象")

    user_request = new_activity.get("user_request", "")

    trip_document = collection.find_one({"trip_id": trip_id})
    if not trip_document:
        raise ValueError(f"未找到 trip_id 为 {trip_id} 的行程")

    raw_trip = trip_document.get("raw_trip")
    if not raw_trip:
        raise ValueError(f"trip_id {trip_id} 缺少 raw_trip 数据")

    # 发送给 agent 前先清除已有交通条目，保持数据干净
    raw_trip = _strip_transportation(raw_trip)

    update_data, raw_response = _call_modify_agent(raw_trip, user_request)

    # 保存 debug 信息
    try:
        collection.update_one({"trip_id": trip_id}, {"$set": {
            "debug.last_modify_agent_response": raw_response,
            # 也保存解析后的 update_data，便于快速查看 agent 要求修改的字段
            "debug.last_parsed_update_data": update_data
        }})
    except Exception:
        pass

    _apply_update_data_to_mongodb(collection, trip_id, update_data)

    updated_trip_document = collection.find_one({"trip_id": trip_id})
    updated_raw_trip = updated_trip_document.get("raw_trip")

    updated_detailed_trip = _generate_detailed_trip(updated_raw_trip)

    # 补齐 AI 修改后缺失的 POI 图片
    _enrich_poi_photos(updated_detailed_trip)

    collection.update_one({"trip_id": trip_id}, {"$set": {"detailed_trip": updated_detailed_trip}})

    return updated_detailed_trip
