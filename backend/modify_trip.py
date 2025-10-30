import json
import os
from pymongo import MongoClient
from bson import json_util
import requests
import time

# --- 1. 定义新的活动数据 (模拟LLM返回) ---
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
        "name": "北京王府井希尔ton酒店",
        "address": "北京市东城区王府井东街8号",
        "coordinates": None
    },
    "recommended_products": [],
    "poi_details": {
        "name": "北京王府井希尔顿酒店",
        "rec_reason": "地理位置优越，设施豪华，服务一流",
        "POIId": "B000A83M61",
        "description": "豪华型酒店，提供高品质的住宿体验。",
        "address": "北京市东城区王府井东街8号",
        "photos": [
            {
                "url": "http://store.is.autonavi.com/showpic/e9605432d48225237551819a467235f7",
                "title": ""
            },
            {
                "url": "http://store.is.autonavi.com/showpic/48c7326d318c8b59a3403a5313bd82e7",
                "title": ""
            },
            {
                "url": "http://store.is.autonavi.com/showpic/73946694555344376a4371c1683b7014",
                "title": ""
            }
        ],
        "rating": "4.8",
        "cost": 1500.0,
        "poi_type": "hotel"
    }
}

import certifi
import socks
import socket

# --- 代理配置 ---
# 在所有网络请求之前，全局设置 socket 模块以使用 SOCKS5 代理
socks.set_default_proxy(socks.SOCKS5, "127.0.0.1", 7890)
socket.socket = socks.socksocket
# -----------------

# --- 2. 数据库连接设置 ---
MONGO_URI = "mongodb+srv://fireflyx:UrfV1fqFHyLwuWQ0@firefly.thygnti.mongodb.net/?appName=firefly"
DB_NAME = "trip_agent"
COLLECTION_NAME = "trips"
TRIP_ID = "beijing_wenyi_trip_001"

# --- 3. 高德API设置 ---
GAODE_API_KEY = os.getenv("GAODE_API_KEY", "6f5977637358300853d71c2847234613")
SEARCH_URL = "https://restapi.amap.com/v5/place/text"
DIRECTION_URL = "https://restapi.amap.com/v5/direction/driving"

def get_db_collection():
    """建立数据库连接并返回集合对象"""
    print("Attempting to connect to MongoDB through SOCKS5 proxy...")
    ca = certifi.where()
    client = MongoClient(MONGO_URI, tlsCAFile=ca, serverSelectionTimeoutMS=30000)
    client.admin.command('ping')
    print("✅ Successfully connected to MongoDB.")
    db = client[DB_NAME]
    return db[COLLECTION_NAME], client

def parse_json(data):
    """将BSON转换为Python字典"""
    return json.loads(json_util.dumps(data))

def get_poi_location(poi_name, city):
    """使用高德API获取POI的经纬度"""
    params = {
        'key': GAODE_API_KEY,
        'keywords': poi_name,
        'region': city,
        'output': 'json'
    }
    try:
        response = requests.get(SEARCH_URL, params=params)
        response.raise_for_status()
        data = response.json()
        if data['status'] == '1' and data['pois']:
            location_str = data['pois'][0]['location']
            return location_str
    except requests.exceptions.RequestException as e:
        print(f"❌ 请求高德API时出错: {e}")
    except (KeyError, IndexError) as e:
        print(f"❌ 解析POI数据时出错: {e}")
    return None

def get_traffic_info(origin, destination, city):
    """获取两点间的交通信息"""
    params = {
        'key': GAODE_API_KEY,
        'origin': origin,
        'destination': destination,
        'city': city,
        'show_fields': 'cost'
    }
    try:
        response = requests.get(DIRECTION_URL, params=params)
        response.raise_for_status()
        data = response.json()
        if data['status'] == '1' and data['route']['paths']:
            path = data['route']['paths'][0]
            duration_seconds = int(path['duration'])
            duration_minutes = round(duration_seconds / 60)
            
            # 尝试获取出租车费用，如果不存在则设为0
            taxi_cost = 0
            if 'cost' in path and 'taxi_cost' in path['cost']:
                taxi_cost = float(path['cost']['taxi_cost'])

            return {
                "type": "transportation",
                "duration": duration_minutes,
                "distance": float(path.get('distance', 0)) / 1000, # 公里
                "cost": taxi_cost,
                "details": f"驾车约{duration_minutes}分钟"
            }
    except requests.exceptions.RequestException as e:
        print(f"❌ 请求交通信息时出错: {e}")
    except (KeyError, IndexError) as e:
        print(f"❌ 解析交通数据时出错: {e}")
    return None

def add_transportation_to_trip(trip_data):
    """为行程数据添加交通信息"""
    city = trip_data.get("destination", "北京")
    detailed_trip = trip_data.copy()
    universal_counter = 0

    for day in detailed_trip.get("days", []):
        new_activities = []
        # 获取当天所有活动的POI位置
        for i, activity in enumerate(day.get("activities", [])):
            if activity.get("type") == "activity" and "location" in activity and "name" in activity["location"]:
                poi_name = activity["location"]["name"]
                location = get_poi_location(poi_name, city)
                if location:
                    activity["location"]["coordinates"] = location
                time.sleep(0.1) # 防止API超频

        # 在活动之间插入交通
        for i in range(len(day.get("activities", [])) - 1):
            current_activity = day["activities"][i]
            next_activity = day["activities"][i+1]
            new_activities.append(current_activity)

            if current_activity.get("type") == "activity" and next_activity.get("type") == "activity":
                origin_coords = current_activity.get("location", {}).get("coordinates")
                dest_coords = next_activity.get("location", {}).get("coordinates")

                if origin_coords and dest_coords:
                    traffic_info = get_traffic_info(origin_coords, dest_coords, city)
                    if traffic_info:
                        universal_counter += 1
                        transport_activity = {
                            "id": f"transport_{universal_counter}",
                            "type": "transportation",
                            "description": f"从 {current_activity['title']} 到 {next_activity['title']}",
                            "traffic_details": traffic_info
                        }
                        new_activities.append(transport_activity)
                    time.sleep(0.1)

        if day.get("activities"):
            new_activities.append(day["activities"][-1])
        day["activities"] = new_activities

    return detailed_trip

def main():
    """主执行函数"""
    collection, client = get_db_collection()

    try:
        # --- 步骤 1: 读取并更新 raw_trip ---
        print("🔄 1. 正在读取并更新 raw_trip...")
        trip_document = collection.find_one({"trip_id": TRIP_ID})
        if not trip_document:
            print(f"❌ 未找到 trip_id 为 {TRIP_ID} 的行程。")
            return

        raw_trip_data = parse_json(trip_document.get("raw_trip", {}))
        
        activity_updated = False
        for day in raw_trip_data.get("days", []):
            for i, activity in enumerate(day.get("activities", [])):
                if activity.get("id") == "activity_6":
                    day["activities"][i] = new_activity_6
                    activity_updated = True
                    break
            if activity_updated:
                break
        
        if not activity_updated:
            print("❌ 在 raw_trip 中未找到 activity_6。")
            return

        # 将更新后的 raw_trip 写回数据库
        collection.update_one(
            {"trip_id": TRIP_ID},
            {"$set": {"raw_trip": raw_trip_data}}
        )
        print("✅ 1. raw_trip 更新成功！")

        # --- 步骤 2: 基于更新后的 raw_trip 生成新的 detailed_trip ---
        print("\n🔄 2. 正在为更新后的 raw_trip 添加交通信息以生成 new_detailed_trip...")
        new_detailed_trip = add_transportation_to_trip(raw_trip_data)
        print("✅ 2. new_detailed_trip 生成成功！")

        # --- 步骤 3: 将新的 detailed_trip 更新到数据库 ---
        print("\n🔄 3. 正在将 new_detailed_trip 更新到数据库...")
        collection.update_one(
            {"trip_id": TRIP_ID},
            {"$set": {"detailed_trip": new_detailed_trip}}
        )
        print("✅ 3. detailed_trip 更新成功！")
        print("\n🎉 所有操作已成功完成！")
    finally:
        if client:
            client.close()
            print("MongoDB connection closed.")

if __name__ == "__main__":
    main()
