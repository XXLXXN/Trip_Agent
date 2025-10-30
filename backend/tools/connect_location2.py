#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
connect_location2.py - 从JSON文件加载Trip数据，独立地连接活动，自动添加交通信息。
"""

import os
import sys
import requests
import time
import json
import concurrent.futures
from typing import List, Optional, Union
from dataclasses import dataclass

# 添加上级目录到路径
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from DataDefinition.DataDefinition import Location, Transportation


# 从 connect_location.py 复制所需的辅助类和函数
# 这使得 connect_location2.py 成为一个独立的文件

@dataclass
class TransportOption:
    mode: str
    duration: int
    distance: int
    cost: float
    description: str
    notes: str
    time_str: str = ""
    distance_str: str = ""

def format_time_distance(duration: int, distance: int) -> tuple[str, str]:
    hours = duration // 3600
    minutes = (duration % 3600) // 60
    if hours > 0:
        time_str = f"{hours}小时{minutes}分钟"
    else:
        time_str = f"{minutes}分钟"

    distance_km = distance / 1000
    if distance_km >= 1:
        distance_str = f"{distance_km:.1f}公里"
    else:
        distance_str = f"{distance}米"

    return time_str, distance_str

class AmapAPI:
    """高德地图API封装（POI版本）"""
    
    def __init__(self):
        self.api_key = "bb641a14c7c2363e10866497c6113bd1"
        self.base_url = "https://restapi.amap.com"
        self._poi_cache = {}
    
    def search_poi(self, poi_name: str, city: str = "上海", limit: int = 1) -> List[dict]:
        url = f"{self.base_url}/v5/place/text"
        params = {
            "key": self.api_key,
            "keywords": poi_name,
            "city": city,
            "output": "json",
            "page": 1,
            "offset": limit
        }
        try:
            response = requests.get(url, params=params, timeout=10)
            if response.status_code == 200:
                result = response.json()
                if result.get('status') == '1' and result.get('pois'):
                    return result['pois']
            return []
        except Exception as e:
            print(f"POI搜索失败: {e}")
            return []
    
    def get_poi_detail(self, poi_id: str) -> Optional[dict]:
        if poi_id in self._poi_cache:
            return self._poi_cache[poi_id]
        url = f"{self.base_url}/v3/place/detail"
        params = {"key": self.api_key, "id": poi_id, "output": "json"}
        try:
            response = requests.get(url, params=params, timeout=10)
            if response.status_code == 200:
                result = response.json()
                if result.get('status') == '1' and result.get('pois'):
                    detail = result['pois'][0]
                    self._poi_cache[poi_id] = detail
                    return detail
            return None
        except Exception as e:
            print(f"获取POI详情失败: {e}")
            return None
    
    def get_poi_coords(self, poi_id: str) -> Optional[str]:
        detail = self.get_poi_detail(poi_id)
        if detail:
            return detail.get('location', '')
        return None
    
    def _make_request(self, url: str, params: dict) -> Optional[dict]:
        """统一的请求发送和错误处理函数"""
        params['key'] = self.api_key
        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            if data.get('status') != '1':
                print(f"🚨 Amap API Error: URL={response.url}, Response={data}")
            return data
        except requests.exceptions.RequestException as e:
            print(f"💥 请求高德API时发生异常: {e}")
            return None

    def get_transit_route_by_poi(self, origin_poi_id: str, dest_poi_id: str, city: str = "021") -> Optional[dict]:
        origin_coords = self.get_poi_coords(origin_poi_id)
        dest_coords = self.get_poi_coords(dest_poi_id)
        if not origin_coords or not dest_coords: return None
        url = f"{self.base_url}/v5/direction/transit/integrated"
        params = {
            "origin": origin_coords, "destination": dest_coords,
            "originpoi": origin_poi_id, "destinationpoi": dest_poi_id, "city1": city, "city2": city,
            "strategy": "0", "AlternativeRoute": "5", "max_trans": "3", "nightflag": "0",
            "show_fields": "cost,navi", "output": "json"
        }
        return self._make_request(url, params)

    def get_walking_route_by_poi(self, origin_poi_id: str, dest_poi_id: str) -> Optional[dict]:
        origin_coords = self.get_poi_coords(origin_poi_id)
        dest_coords = self.get_poi_coords(dest_poi_id)
        if not origin_coords or not dest_coords: return None
        url = f"{self.base_url}/v5/direction/walking"
        params = {"origin": origin_coords, "destination": dest_coords, "isindoor": "0", "show_fields": "cost"}
        return self._make_request(url, params)

    def get_cycling_route_by_poi(self, origin_poi_id: str, dest_poi_id: str) -> Optional[dict]:
        origin_coords = self.get_poi_coords(origin_poi_id)
        dest_coords = self.get_poi_coords(dest_poi_id)
        if not origin_coords or not dest_coords: return None
        url = f"{self.base_url}/v5/direction/bicycling"
        params = {"origin": origin_coords, "destination": dest_coords, "show_fields": "cost"}
        return self._make_request(url, params)

    def get_driving_route_by_poi(self, origin_poi_id: str, dest_poi_id: str) -> Optional[dict]:
        origin_coords = self.get_poi_coords(origin_poi_id)
        dest_coords = self.get_poi_coords(dest_poi_id)
        if not origin_coords or not dest_coords: return None
        url = f"{self.base_url}/v5/direction/driving"
        params = {"strategy": "32", "show_fields": "cost", "output": "json", "origin": origin_coords, "destination": dest_coords}
        return self._make_request(url, params)

def parse_transit_cost_v5(transit: dict) -> float:
    try:
        return float(transit.get('cost', {}).get('transit_fee', 0))
    except (ValueError, TypeError):
        return 0.0

def parse_transit_duration_v5(transit: dict) -> int:
    try:
        return int(transit.get('cost', {}).get('duration', 0))
    except (ValueError, TypeError):
        return 0

def parse_detailed_transit_description_v5(transit: dict) -> str:
    try:
        segments = transit.get('segments', [])
        if not segments: return "公交出行"
        route_parts = []
        for segment in segments:
            if isinstance(segment, dict):
                if 'bus' in segment and 'buslines' in segment['bus'] and segment['bus']['buslines']:
                    busline = segment['bus']['buslines'][0]
                    route_parts.append(f"在{busline.get('departure_stop', {}).get('name', '')}站乘坐{busline.get('name', '')}到{busline.get('arrival_stop', {}).get('name', '')}站")
                elif 'walking' in segment and 'distance' in segment['walking'] and int(segment['walking']['distance']) > 0:
                    route_parts.append(f"步行{segment['walking']['distance']}米")
        return " → ".join(route_parts) if route_parts else "公交出行"
    except Exception as e:
        print(f"解析详细描述失败: {e}")
        return "公交出行"

def get_transport_info_from_api_by_poi(amap_api: AmapAPI, origin_poi_id: str, dest_poi_id: str, destination_city: str = "上海") -> Optional[dict]:
    city_code_map = {"上海": "021", "北京": "010", "广州": "020", "深圳": "0755", "杭州": "0571", "南京": "025", "苏州": "0512", "成都": "028", "武汉": "027", "西安": "029", "威海": "0631"}
    city_code = city_code_map.get(destination_city, "021")
    
    options = []
    
    # 改为串行调用，并增加延时
    try:
        time.sleep(0.25) # 调用前延时
        transit_data = amap_api.get_transit_route_by_poi(origin_poi_id, dest_poi_id, city_code)
        if transit_data and transit_data.get('status') == '1' and 'route' in transit_data and 'transits' in transit_data['route'] and transit_data['route']['transits']:
            transit = transit_data['route']['transits'][0]
            options.append({'mode': 'bus', 'cost': parse_transit_cost_v5(transit), 'duration': parse_transit_duration_v5(transit), 'distance': int(transit.get('distance', 0)), 'description': parse_detailed_transit_description_v5(transit), 'notes': '🚇 公共交通方案'})
    except Exception as e:
        print(f"💥 获取公交方案时发生异常: {e}")

    try:
        time.sleep(0.25) # 调用前延时
        walking_data = amap_api.get_walking_route_by_poi(origin_poi_id, dest_poi_id)
        if walking_data and walking_data.get('status') == '1' and 'paths' in walking_data['route'] and walking_data['route']['paths']:
            path = walking_data['route']['paths'][0]
            duration, distance = int(path.get('cost', {}).get('duration', 0)), int(path.get('distance', 0))
            if duration > 0 and distance > 0:
                options.append({'mode': 'walk', 'cost': 0.0, 'duration': duration, 'distance': distance, 'description': f"步行约{duration//60}分钟（距离{round(distance/1000, 1)}公里）", 'notes': '步行时间较长' if duration > 1800 else '舒适鞋子'})
    except Exception as e:
        print(f"💥 获取步行方案时发生异常: {e}")

    try:
        time.sleep(0.25) # 调用前延时
        cycling_data = amap_api.get_cycling_route_by_poi(origin_poi_id, dest_poi_id)
        if cycling_data and cycling_data.get('status') == '1' and 'paths' in cycling_data['route'] and cycling_data['route']['paths']:
            path = cycling_data['route']['paths'][0]
            duration, distance = int(path.get('duration', 0)), int(path.get('distance', 0))
            if duration > 0 and distance > 0:
                cost = round(1.5 + max(0, (duration - 900 + 899) // 900) * 1.0, 1)
                options.append({'mode': 'cycling', 'cost': cost, 'duration': duration, 'distance': distance, 'description': f"骑行约{duration//60}分钟（距离{round(distance/1000, 1)}公里）", 'notes': f'共享单车费用约{cost}元'})
    except Exception as e:
        print(f"💥 获取骑行方案时发生异常: {e}")

    try:
        time.sleep(0.25) # 调用前延时
        driving_data = amap_api.get_driving_route_by_poi(origin_poi_id, dest_poi_id)
        if driving_data and driving_data.get('status') == '1' and 'paths' in driving_data['route'] and driving_data['route']['paths']:
            path = driving_data['route']['paths'][0]
            duration, distance, fee = int(path.get('cost', {}).get('duration', 0)), int(path.get('distance', 0)), float(path.get('cost', {}).get('taxi_fee', 0))
            if duration > 0 and distance > 0:
                options.append({'mode': 'driving', 'cost': fee, 'duration': duration, 'distance': distance, 'description': f"驾车约{duration//60}分钟（距离{round(distance/1000, 1)}公里）", 'notes': f'出租车费用约{fee}元' if fee > 0 else '自驾'})
    except Exception as e:
        print(f"💥 获取驾车方案时发生异常: {e}")

    return {'transport_options': options, 'has_options': bool(options), 'total_options': len(options)} if options else None

def get_location_poi_id(amap_api: AmapAPI, activity_dict: dict, destination_city: str = "上海", force_api_search: bool = False) -> Optional[str]:
    """从字典格式的location获取POI ID，优先使用并验证 poi_details 中的 POIId"""
    try:
        # 如果不强制API搜索，则尝试使用并验证已有的POI ID
        if not force_api_search:
            poi_details = activity_dict.get('poi_details', {})
            if poi_details and poi_details.get('POIId'):
                poi_id = poi_details['POIId']
                # 验证POI ID的有效性
                if isinstance(poi_id, str) and poi_id.startswith('B'):
                    print(f"  ℹ️ 发现已有的 POI ID: {poi_id}，正在验证...")
                    coords = amap_api.get_poi_coords(poi_id)
                    if coords:
                        print(f"  ✅ POI ID {poi_id} 验证成功。")
                        return poi_id
                    else:
                        print(f"  ⚠️ 已有的 POI ID '{poi_id}' 验证失败或已失效，将重新搜索。")
                else:
                    print(f"  ⚠️ 已有的 POI ID '{poi_id}' 格式无效，将重新搜索。")

        # 如果没有或无效，或被强制，则回退到搜索
        location = activity_dict.get('location', {})
        location_name = location.get('name')
        location_address = location.get('address')
        
        print(f"🔍 开始查询POI ID: 名称='{location_name}', 城市='{destination_city}'")
        
        time.sleep(0.25) # API调用延时
        
        if location_name:
            pois = amap_api.search_poi(location_name, destination_city, limit=1)
            if pois:
                poi_id = pois[0]['id']
                print(f"  ✅ 通过名称 '{location_name}' 找到 POI ID: {poi_id}")
                return poi_id
            else:
                print(f"  ⚠️ 通过名称 '{location_name}' 未找到POI。")

        if location_address:
            print(f"  ℹ️ 尝试使用地址 '{location_address}' 进行搜索...")
            pois = amap_api.search_poi(location_address, destination_city, limit=1)
            if pois:
                poi_id = pois[0]['id']
                print(f"  ✅ 通过地址 '{location_address}' 找到 POI ID: {poi_id}")
                return poi_id
            else:
                print(f"  ⚠️ 通过地址 '{location_address}' 也未找到POI。")

        print(f"  ❌ 查询失败: '{location_name}'")
        return None
    except Exception as e:
        print(f"💥 获取POI ID时发生异常: {e}")
        return None

def create_transportation_with_api(amap_api: AmapAPI, current_activity_id: str, next_activity_id: str, origin_activity_dict: dict, dest_activity_dict: dict, start_time: str, end_time: str, destination_city: str = "上海", poi_id_cache: dict = None) -> List[dict]:
    try:
        if poi_id_cache is None:
            poi_id_cache = {}

        # 检查缓存或获取新的 origin_poi_id
        if current_activity_id in poi_id_cache:
            origin_poi_id = poi_id_cache[current_activity_id]
            print(f"  ℹ️ 从缓存获取源POI ID: {origin_poi_id} (for {current_activity_id})")
        else:
            origin_poi_id = get_location_poi_id(amap_api, origin_activity_dict, destination_city)
            if origin_poi_id:
                poi_id_cache[current_activity_id] = origin_poi_id

        # 检查缓存或获取新的 dest_poi_id
        if next_activity_id in poi_id_cache:
            dest_poi_id = poi_id_cache[next_activity_id]
            print(f"  ℹ️ 从缓存获取目标POI ID: {dest_poi_id} (for {next_activity_id})")
        else:
            dest_poi_id = get_location_poi_id(amap_api, dest_activity_dict, destination_city)
            if dest_poi_id:
                poi_id_cache[next_activity_id] = dest_poi_id
        
        # 城市一致性检查和纠错
        if origin_poi_id and dest_poi_id:
            origin_detail = amap_api.get_poi_detail(origin_poi_id)
            dest_detail = amap_api.get_poi_detail(dest_poi_id)
            
            origin_city = origin_detail.get('cityname') if origin_detail else None
            dest_city = dest_detail.get('cityname') if dest_detail else None

            if origin_city and dest_city and origin_city != dest_city:
                print(f"🚨 检测到跨城市地点: '{origin_activity_dict.get('location', {}).get('name')}' ({origin_city}) -> '{dest_activity_dict.get('location', {}).get('name')}' ({dest_city})。将强制在目标城市 '{destination_city}' 内重新搜索。")
                
                # 清除缓存并强制重新搜索
                poi_id_cache.pop(current_activity_id, None)
                poi_id_cache.pop(next_activity_id, None)
                
                origin_poi_id = get_location_poi_id(amap_api, origin_activity_dict, destination_city, force_api_search=True)
                if origin_poi_id: poi_id_cache[current_activity_id] = origin_poi_id
                
                dest_poi_id = get_location_poi_id(amap_api, dest_activity_dict, destination_city, force_api_search=True)
                if dest_poi_id: poi_id_cache[next_activity_id] = dest_poi_id

        origin_location_dict = origin_activity_dict.get('location', {})
        dest_location_dict = dest_activity_dict.get('location', {})

        if not origin_poi_id or not dest_poi_id:
            print(f"⚠️ 无法获取POI ID，跳过交通规划: {origin_location_dict.get('name')} -> {dest_location_dict.get('name')}")
            return []
        
        transport_info = get_transport_info_from_api_by_poi(amap_api, origin_poi_id, dest_poi_id, destination_city)
        if not transport_info or not transport_info.get('has_options'):
            return []
        
        transportations = []
        from datetime import datetime, timedelta
        
        try:
            start_dt_time = datetime.strptime(start_time, '%H:%M:%S').time()
        except ValueError:
            try:
                start_dt_time = datetime.strptime(start_time, '%H:%M').time()
            except ValueError:
                print(f"无法解析开始时间: {start_time}, 使用午夜。")
                start_dt_time = datetime.min.time()
        
        start_dt = datetime.combine(datetime.today(), start_dt_time)

        for i, option in enumerate(transport_info['transport_options']):
            duration = option.get('duration', 0)
            actual_end_dt = start_dt + timedelta(seconds=duration)
            actual_end_time_str = actual_end_dt.strftime('%H:%M:%S')
            
            mode_icons = {'walk': '🚶', 'cycling': '🚴', 'driving': '🚗', 'bus': '🚌', 'subway': '🚇'}
            icon = mode_icons.get(option['mode'], '🚌')
            
            # 直接创建字典，避免Pydantic模型转换
            trans_dict = {
                "id": f"transportation_{current_activity_id}_{next_activity_id}_{i+1}",
                "start_time": start_time,
                "end_time": actual_end_time_str,
                "description": option['description'],
                "notes": f"{icon} {option.get('notes', '')}",
                "cost": option['cost'],
                "type": "transportation",  # 确保type字段存在
                "mode": option['mode'],
                "origin": origin_location_dict,
                "destination": dest_location_dict,
                "ticket_info": None
            }
            transportations.append(trans_dict)
            
        return transportations
    except Exception as e:
        print(f"💥 创建交通信息时发生异常: {e}")
        return []

def connect_location2(json_file_path: str) -> dict:
    """
    从JSON文件加载Trip数据，独立地连接活动，自动添加交通信息，并返回更新后的Trip字典。
    """
    try:
        print(f"开始独立处理文件: {json_file_path}")
        with open(json_file_path, 'r', encoding='utf-8') as f:
            trip_data = json.load(f)
        print("✅ JSON文件读取成功。")

        amap_api = AmapAPI()
        destination_city = trip_data.get("destination", "上海")
        poi_id_cache = {} # 在函数级别创建缓存

        for day in trip_data.get('days', []):
            activities = day.get('activities', [])
            if len(activities) < 2: continue

            new_activities_list = []
            for i in range(len(activities)):
                current_activity_dict = activities[i]
                new_activities_list.append(current_activity_dict)
                
                if i < len(activities) - 1:
                    next_activity_dict = activities[i + 1]
                    
                    # 检查当前或下一个活动是否为 large_transportation
                    if current_activity_dict.get('type') == 'large_transportation' or next_activity_dict.get('type') == 'large_transportation':
                        print(f"ℹ️ 跳过城际交通和活动之间的交通规划: {current_activity_dict.get('title', current_activity_dict.get('id'))} -> {next_activity_dict.get('title', next_activity_dict.get('id'))}")
                        continue
                    
                    transportations = create_transportation_with_api(
                        amap_api,
                        current_activity_dict.get('id'),
                        next_activity_dict.get('id'),
                        current_activity_dict, # 传递整个活动字典
                        next_activity_dict,    # 传递整个活动字典
                        current_activity_dict.get('end_time'),
                        next_activity_dict.get('start_time'),
                        destination_city,
                        poi_id_cache=poi_id_cache # 传递缓存
                    )
                    
                    if transportations:
                        current_activity_location_dict = current_activity_dict.get('location', {})
                        next_activity_location_dict = next_activity_dict.get('location', {})
                        new_activities_list.extend(transportations)
                        print(f"✓ 添加交通: {current_activity_location_dict.get('name')} -> {next_activity_location_dict.get('name')} (共{len(transportations)}个方案)")
                    else:
                        current_activity_location_dict = current_activity_dict.get('location', {})
                        next_activity_location_dict = next_activity_dict.get('location', {})
                        print(f"⚠️ 无法获取交通信息: {current_activity_location_dict.get('name')} -> {next_activity_location_dict.get('name')}")
            
            day['activities'] = new_activities_list
        
        print("✅ 地点连接和交通信息添加独立完成。")
        return trip_data
        
    except FileNotFoundError:
        print(f"❌ 错误: 文件未找到 - {json_file_path}")
    except json.JSONDecodeError:
        print(f"❌ 错误: JSON文件格式无效 - {json_file_path}")
    except Exception as e:
        import traceback
        print(f"❌ 处理过程中发生未知错误: {e}")
        traceback.print_exc()
    return {}

if __name__ == '__main__':
    # 示例：如何使用 connect_location2
    # 假设我们有一个名为 'trip_without_transport.json' 的文件
    
    # 1. 创建一个不含交通的示例JSON文件
    sample_trip_data = {
      "user_id": "test_user_beijing_001",
      "trip_id": "beijing_wenyi_trip_001_no_trans",
      "trip_name": "北京文艺两日游(无交通)",
      "destination": "北京",
      "start_date": "2025-03-15",
      "end_date": "2025-03-16",
      "days": [
        {
          "date": "2025-03-15",
          "day_index": 1,
          "activities": [
            {
              "id": "activity_1",
              "start_time": "10:30:00",
              "end_time": "11:00:00",
              "description": "到达北京首都机场",
              "type": "activity",
              "title": "到达北京首都机场",
              "location": {"name": "北京首都国际机场", "address": "北京市顺义区首都机场路"}
            },
            {
              "id": "activity_2",
              "start_time": "12:00:00",
              "end_time": "14:00:00",
              "description": "游览798艺术区",
              "type": "activity",
              "title": "798艺术区游览",
              "location": {"name": "798艺术区", "address": "酒仙桥路4号"}
            }
          ]
        }
      ]
    }
    
    input_filename = "trip_without_transport.json"
    output_filename = "trip_with_transport.json"
    
    with open(input_filename, 'w', encoding='utf-8') as f:
        json.dump(sample_trip_data, f, ensure_ascii=False, indent=2)
    print(f"✅ 示例输入文件已创建: {input_filename}")
    
    # 2. 调用函数处理文件
    updated_trip = connect_location2(input_filename)
    
    # 3. 保存结果
    if updated_trip:
        with open(output_filename, 'w', encoding='utf-8') as f:
            json.dump(updated_trip, f, ensure_ascii=False, indent=2)
        print(f"✅ 处理完成，结果已保存到: {output_filename}")
    else:
        print("❌ 处理失败，未生成输出文件。")
