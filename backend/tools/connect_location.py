#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
connect_location.py - 自动为Trip对象添加Transportation项目（POI版本）
"""

import os
import sys
import time
import concurrent.futures
from typing import List, Optional, Union
from dataclasses import dataclass

# 添加上级目录到路径
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from DataDefinition.DataDefinition import Trip, Day, DayActivity, Activity, Transportation, Location, Coordinates

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
    # 时间格式化
    hours = duration // 3600
    minutes = (duration % 3600) // 60
    if hours > 0:
        time_str = f"{hours}小时{minutes}分钟"
    else:
        time_str = f"{minutes}分钟"

    # 距离格式化
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
        # 缓存POI详情，避免重复调用
        self._poi_cache = {}
    
    def search_poi(self, poi_name: str, city: str = "上海", limit: int = 1) -> List[dict]:
        """POI搜索：根据名称搜索POI"""
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
            import requests
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
        """获取POI详情（带缓存）"""
        # 检查缓存
        if poi_id in self._poi_cache:
            return self._poi_cache[poi_id]
        
        url = f"{self.base_url}/v3/place/detail"
        params = {
            "key": self.api_key,
            "id": poi_id,
            "output": "json"
        }
        
        try:
            import requests
            response = requests.get(url, params=params, timeout=10)
            if response.status_code == 200:
                result = response.json()
                if result.get('status') == '1' and result.get('pois'):
                    detail = result['pois'][0]
                    # 缓存结果
                    self._poi_cache[poi_id] = detail
                    return detail
            return None
        except Exception as e:
            print(f"获取POI详情失败: {e}")
            return None
    
    def get_poi_coords(self, poi_id: str) -> Optional[str]:
        """获取POI坐标（优化版本）"""
        detail = self.get_poi_detail(poi_id)
        if detail:
            return detail.get('location', '')
        return None
    
    def get_transit_route_by_poi(self, origin_poi_id: str, dest_poi_id: str, city: str = "021") -> Optional[dict]:
        """通过POI ID获取公交路线"""
        # 获取POI坐标
        origin_coords = self.get_poi_coords(origin_poi_id)
        dest_coords = self.get_poi_coords(dest_poi_id)
        
        if not origin_coords or not dest_coords:
            return None
        
        # 添加延迟避免API调用过于频繁
        time.sleep(2.0)
        
        url = f"{self.base_url}/v5/direction/transit/integrated"
        params = {
            "key": self.api_key,
            "origin": origin_coords,
            "destination": dest_coords,
            "originpoi": origin_poi_id,
            "destinationpoi": dest_poi_id,
            "city1": city,
            "city2": city,
            "strategy": "0",
            "AlternativeRoute": "5",
            "max_trans": "3",
            "nightflag": "0",
            "show_fields": "cost,navi",
            "output": "json"
        }
        
        try:
            import requests
            response = requests.get(url, params=params, timeout=10)
            if response.status_code == 200:
                result = response.json()
                print(f"公交API响应: {result.get('status', 'unknown')}")
                if result.get('status') != '1':
                    print(f"公交API错误: {result.get('info', 'unknown')}")
                return result
            return None
        except Exception as e:
            print(f"路线规划失败: {e}")
            return None
    
    def get_walking_route_by_poi(self, origin_poi_id: str, dest_poi_id: str) -> Optional[dict]:
        """通过POI ID获取步行路线"""
        # 获取POI坐标
        origin_coords = self.get_poi_coords(origin_poi_id)
        dest_coords = self.get_poi_coords(dest_poi_id)
        
        if not origin_coords or not dest_coords:
            return None
        
        # 添加延迟避免API调用过于频繁
        time.sleep(2.0)
        
        url = f"{self.base_url}/v5/direction/walking"
        params = {
            "key": self.api_key,
            "origin": origin_coords,
            "destination": dest_coords,
            "isindoor": "0",
            "show_fields": "cost"
        }
        
        try:
            import requests
            response = requests.get(url, params=params, timeout=10)
            if response.status_code == 200:
                result = response.json()
                print(f"步行API响应: {result.get('status', 'unknown')}")
                return result
            return None
        except Exception as e:
            print(f"步行路线获取失败: {e}")
            return None
    
    def get_cycling_route_by_poi(self, origin_poi_id: str, dest_poi_id: str) -> Optional[dict]:
        """通过POI ID获取骑行路线"""
        # 获取POI坐标
        origin_coords = self.get_poi_coords(origin_poi_id)
        dest_coords = self.get_poi_coords(dest_poi_id)
        
        if not origin_coords or not dest_coords:
            return None
        
        # 添加延迟避免API调用过于频繁
        time.sleep(2.0)
        
        url = f"{self.base_url}/v5/direction/bicycling"
        params = {
            "key": self.api_key,
            "origin": origin_coords,
            "destination": dest_coords,
            "show_fields": "cost"
        }
        
        try:
            import requests
            response = requests.get(url, params=params, timeout=10)
            if response.status_code == 200:
                result = response.json()
                print(f"骑行API响应: {result.get('status', 'unknown')}")
                return result
            return None
        except Exception as e:
            print(f"骑行路线获取失败: {e}")
            return None
    
    def get_driving_route_by_poi(self, origin_poi_id: str, dest_poi_id: str) -> Optional[dict]:
        """通过POI ID获取驾车路线"""
        # 获取POI坐标
        origin_coords = self.get_poi_coords(origin_poi_id)
        dest_coords = self.get_poi_coords(dest_poi_id)
        
        if not origin_coords or not dest_coords:
            return None
        
        # 添加延迟避免API调用过于频繁
        time.sleep(2.0)
        
        url = f"{self.base_url}/v5/direction/driving"
        params = {
            "key": self.api_key,
            "origin": origin_coords,
            "destination": dest_coords,
            "strategy": "32",  # 默认策略
            "show_fields": "cost",
            "output": "json"
        }
        
        try:
            import requests
            response = requests.get(url, params=params, timeout=10)
            if response.status_code == 200:
                result = response.json()
                print(f"驾车API响应: {result.get('status', 'unknown')}")
                if result.get('status') != '1':
                    print(f"驾车API错误: {result.get('info', 'unknown')}")
                return result
            return None
        except Exception as e:
            print(f"驾车路线获取失败: {e}")
            return None

def parse_transit_cost_v5(transit: dict) -> float:
    """解析公交费用"""
    try:
        cost_info = transit.get('cost', {})
        transit_fee = cost_info.get('transit_fee', 0)
        return float(transit_fee) if transit_fee else 0.0
    except (ValueError, TypeError):
        return 0.0

def parse_transit_duration_v5(transit: dict) -> int:
    """解析公交时间"""
    try:
        cost_info = transit.get('cost', {})
        duration = cost_info.get('duration', 0)
        return int(duration) if duration else 0
    except (ValueError, TypeError):
        return 0

def parse_transport_mode_v5(transit: dict) -> str:
    """解析交通方式"""
    try:
        segments = transit.get('segments', [])
        if not segments:
            return "bus"
        
        has_subway = False
        has_bus = False
        
        for segment in segments:
            if isinstance(segment, dict):
                if 'bus' in segment:
                    bus = segment['bus']
                    if 'buslines' in bus and bus['buslines']:
                        busline = bus['buslines'][0]
                        bus_name = busline.get('name', '')
                        if '地铁' in bus_name or '号线' in bus_name or '磁悬浮' in bus_name:
                            has_subway = True
                        else:
                            has_bus = True
                elif 'railway' in segment:
                    has_subway = True
        
        if has_subway and has_bus:
            return "complex"
        elif has_subway and not has_bus:
            return "subway"
        elif has_bus and not has_subway:
            return "bus"
        else:
            return "complex"
    except Exception as e:
        print(f"解析交通方式失败: {e}")
        return "complex"

def parse_detailed_transit_description_v5(transit: dict) -> str:
    """解析详细的公交路线描述"""
    try:
        segments = transit.get('segments', [])
        if not segments:
            return "公交出行"
        
        route_parts = []
        
        for segment in segments:
            if isinstance(segment, dict):
                if 'bus' in segment:
                    bus_data = segment['bus']
                    if 'buslines' in bus_data and bus_data['buslines']:
                        busline = bus_data['buslines'][0]
                        line_name = busline.get('name', '')
                        departure_stop = busline.get('departure_stop', {})
                        arrival_stop = busline.get('arrival_stop', {})
                        departure_name = departure_stop.get('name', '')
                        arrival_name = arrival_stop.get('name', '')
                        
                        if line_name and departure_name and arrival_name:
                            route_parts.append(f"在{departure_name}站乘坐{line_name}到{arrival_name}站")
                
                elif 'walking' in segment:
                    walking_data = segment['walking']
                    distance = walking_data.get('distance', 0)
                    try:
                        distance = int(distance) if distance else 0
                        if distance > 0:
                            route_parts.append(f"步行{distance}米")
                    except (ValueError, TypeError):
                        pass
                
                elif 'taxi' in segment:
                    # 跳过出租车段，不添加到路线描述中
                    continue
        
        if route_parts:
            return " → ".join(route_parts)
        else:
            return "公交出行"
            
    except Exception as e:
        print(f"解析详细描述失败: {e}")
        return "公交出行"

def is_pure_metro_route(transit: dict) -> bool:
    """判断是否为纯地铁路线"""
    segments = transit.get('segments', [])
    for segment in segments:
        if 'bus' in segment:
            bus = segment['bus']
            if 'buslines' in bus and bus['buslines']:
                busline = bus['buslines'][0]
                bus_name = busline.get('name', '')
                if '地铁' in bus_name or '号线' in bus_name:
                    continue
                else:
                    return False
        elif 'railway' in segment:
            continue
        elif 'walking' in segment:
            continue
        else:
            return False
    
    return True

def contains_taxi(transit: dict) -> bool:
    """判断是否包含出租车"""
    segments = transit.get('segments', [])
    for segment in segments:
        if isinstance(segment, dict) and 'taxi' in segment:
            return True
    return False

def sort_routes_by_metro_priority(transits: list) -> list:
    """按地铁优先级排序路线"""
    def route_score(transit):
        if is_pure_metro_route(transit):
            return 1000
        else:
            return 0
    
    return sorted(transits, key=route_score, reverse=True)

def get_transport_info_from_api_by_poi(
    amap_api: AmapAPI, 
    origin_poi_id: str, 
    dest_poi_id: str,
    destination_city: str = "上海"
) -> Optional[dict]:
    """通过高德地图API并发获取四种交通方案：公交、步行、骑行、驾车"""
    
    city_code_map = {
        "上海": "021", "北京": "010", "广州": "020", "深圳": "0755",
        "杭州": "0571", "南京": "025", "苏州": "0512", "成都": "028",
        "武汉": "027", "西安": "029", "威海": "0631"
    }
    
    city_code = city_code_map.get(destination_city, "021")
    
    def get_transit():
        """获取公交方案"""
        try:
            transit_data = amap_api.get_transit_route_by_poi(origin_poi_id, dest_poi_id, city_code)
            if transit_data and transit_data.get('status') == '1':
                route_info = transit_data.get('route', {})
                if 'transits' in route_info and route_info['transits']:
                    transit = route_info['transits'][0]
                    cost = parse_transit_cost_v5(transit)
                    duration = parse_transit_duration_v5(transit)
                    detailed_description = parse_detailed_transit_description_v5(transit)
                    distance = int(transit.get('distance', 0))
                    
                    return {
                        'mode': 'bus',
                        'cost': cost,
                        'duration': duration,
                        'distance': distance,
                        'description': detailed_description,
                        'notes': '🚇 公共交通方案'
                    }
        except Exception as e:
            print(f"获取公交方案失败: {e}")
        return None
    
    def get_walking():
        """获取步行方案"""
        try:
            walking_data = amap_api.get_walking_route_by_poi(origin_poi_id, dest_poi_id)
            if walking_data and walking_data.get('status') == '1':
                path = walking_data['route']['paths'][0]
                cost_info = path.get('cost', {})
                duration = int(cost_info.get('duration', 0))
                distance = int(path.get('distance', 0))
                
                if duration > 0 and distance > 0:
                    distance_km = round(distance / 1000, 1)
                    return {
                        'mode': 'walk',
                        'cost': 0.0,
                        'duration': duration,
                        'distance': distance,
                        'description': f"步行约{duration//60}分钟（距离{distance_km}公里）",
                        'notes': '步行时间较长，建议考虑其他交通方式' if duration > 1800 else '建议穿舒适的鞋子，注意天气情况'
                    }
        except Exception as e:
            print(f"获取步行方案失败: {e}")
        return None
    
    def get_cycling():
        """获取骑行方案"""
        try:
            cycling_data = amap_api.get_cycling_route_by_poi(origin_poi_id, dest_poi_id)
            if cycling_data and cycling_data.get('status') == '1':
                path = cycling_data['route']['paths'][0]
                duration = int(path.get('duration', 0))
                distance = int(path.get('distance', 0))
                
                if duration > 0 and distance > 0:
                    # 共享单车费用计算
                    cycling_cost = 1.5
                    if duration > 900:
                        extra_15min_blocks = (duration - 900 + 899) // 900
                        cycling_cost += extra_15min_blocks * 1.0
                    cycling_cost = round(cycling_cost, 1)
                    
                    distance_km = round(distance / 1000, 1)
                    return {
                        'mode': 'cycling',
                        'cost': cycling_cost,
                        'duration': duration,
                        'distance': distance,
                        'description': f"骑行约{duration//60}分钟（距离{distance_km}公里）",
                        'notes': f'共享单车费用约{cycling_cost}元，请遵守交通规则'
                    }
        except Exception as e:
            print(f"获取骑行方案失败: {e}")
        return None
    
    def get_driving():
        """获取驾车方案"""
        try:
            driving_data = amap_api.get_driving_route_by_poi(origin_poi_id, dest_poi_id)
            if driving_data and driving_data.get('status') == '1':
                path = driving_data['route']['paths'][0]
                cost_info = path.get('cost', {})
                duration = int(cost_info.get('duration', 0))
                distance = int(path.get('distance', 0))
                
                if duration > 0 and distance > 0:
                    taxi_fee = float(cost_info.get('taxi_fee', 0))
                    distance_km = round(distance / 1000, 1)
                    return {
                        'mode': 'driving',
                        'cost': taxi_fee,
                        'duration': duration,
                        'distance': distance,
                        'description': f"驾车约{duration//60}分钟（距离{distance_km}公里）",
                        'notes': f'出租车费用约{taxi_fee}元' if taxi_fee > 0 else '自驾出行'
                    }
        except Exception as e:
            print(f"获取驾车方案失败: {e}")
        return None
    
    # 使用线程池并发执行所有API调用
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
        # 提交所有任务
        transit_future = executor.submit(get_transit)
        walking_future = executor.submit(get_walking)
        cycling_future = executor.submit(get_cycling)
        driving_future = executor.submit(get_driving)
        
        # 收集结果
        transport_options = []
        
        # 获取公交方案
        transit_result = transit_future.result()
        if transit_result:
            transport_options.append(transit_result)
            print("✓ 公交方案添加成功")
        
        # 获取步行方案
        walking_result = walking_future.result()
        if walking_result:
            transport_options.append(walking_result)
            print("✓ 步行方案添加成功")
        
        # 获取骑行方案
        cycling_result = cycling_future.result()
        if cycling_result:
            transport_options.append(cycling_result)
            print("✓ 骑行方案添加成功")
        
        # 获取驾车方案
        driving_result = driving_future.result()
        if driving_result:
            transport_options.append(driving_result)
            print("✓ 驾车方案添加成功")
    
    # 如果没有获取到任何方案，返回默认步行方案
    if not transport_options:
        transport_options.append({
            'mode': 'walk',
            'cost': 0.0,
            'duration': 0,
            'distance': 0,
            'description': '步行',
            'notes': '路径较短，选择步行'
        })
    
    return {
        'transport_options': transport_options,
        'has_options': True,
        'total_options': len(transport_options)
    }

def get_location_poi_id(amap_api: AmapAPI, location: Location, destination_city: str = "上海") -> Optional[str]:
    """获取地点POI ID"""
    try:
        # 添加延迟避免API请求过于频繁
        time.sleep(1.0)
        
        # 优先使用地点名称搜索POI
        if location.name:
            pois = amap_api.search_poi(location.name, destination_city, limit=1)
            if pois:
                return pois[0]['id']
        
        # 如果名称搜索失败，尝试使用地址
        if location.address:
            pois = amap_api.search_poi(location.address, destination_city, limit=1)
            if pois:
                return pois[0]['id']
        
        return None
    except Exception as e:
        print(f"获取POI ID失败: {e}")
    return None

def create_transportation_with_api(
    amap_api: AmapAPI,
    current_activity: Activity,
    next_activity: Activity,
    start_time: str,
    end_time: str,
    destination_city: str = "上海"
) -> List[Transportation]:
    """使用API创建交通信息"""
    try:
        origin_poi_id = get_location_poi_id(amap_api, current_activity.location, destination_city)
        dest_poi_id = get_location_poi_id(amap_api, next_activity.location, destination_city)
        
        if not origin_poi_id or not dest_poi_id:
            print(f"无法获取POI ID: {current_activity.location.name} -> {next_activity.location.name}")
            return []
        
        time.sleep(1.0)
        
        # 获取POI详情来计算距离
        try:
            origin_detail = amap_api.get_poi_detail(origin_poi_id)
            dest_detail = amap_api.get_poi_detail(dest_poi_id)
            
            if origin_detail and dest_detail:
                origin_coords = origin_detail.get('location', '')
                dest_coords = dest_detail.get('location', '')
                
                if origin_coords and dest_coords:
                    origin_lat, origin_lng = map(float, origin_coords.split(','))
                    dest_lat, dest_lng = map(float, dest_coords.split(','))
                    
                    import math
                    distance_km = math.sqrt((origin_lat - dest_lat)**2 + (origin_lng - dest_lng)**2) * 111
                    
                    print(f"距离{distance_km:.2f}公里，获取四种交通方案")
                    transport_info = get_transport_info_from_api_by_poi(amap_api, origin_poi_id, dest_poi_id, destination_city)
                else:
                    print("无法获取POI坐标，使用API获取交通信息")
                    transport_info = get_transport_info_from_api_by_poi(amap_api, origin_poi_id, dest_poi_id, destination_city)
            else:
                print("无法获取POI详情，使用API获取交通信息")
                transport_info = get_transport_info_from_api_by_poi(amap_api, origin_poi_id, dest_poi_id, destination_city)
        except Exception as e:
            print(f"距离计算失败，使用API获取交通信息: {e}")
            transport_info = get_transport_info_from_api_by_poi(amap_api, origin_poi_id, dest_poi_id, destination_city)
        
        if not transport_info:
            return []
        
        transportations = []
        
        if transport_info.get('has_options', False) and transport_info.get('transport_options'):
            options = transport_info['transport_options']
            for i, option in enumerate(options):
                description = option['description']
                cost = option['cost']
                mode = option['mode']
                notes = option.get('notes', '')
                duration = option.get('duration', 0)  # 获取实际交通时间（秒）
                
                # 计算实际结束时间
                from datetime import datetime, timedelta
                # 将time对象转换为datetime对象进行计算
                start_datetime = datetime.combine(datetime.today(), start_time)
                actual_end_datetime = start_datetime + timedelta(seconds=duration)
                actual_end_time = actual_end_datetime.time()
                
                # 为不同交通方式添加图标
                mode_icons = {
                    'walk': '🚶',
                    'cycling': '🚴',
                    'driving': '🚗',
                    'public_transport': '🚇'
                }
                icon = mode_icons.get(mode, '🚌')
                
                transportation = Transportation(
                    id=f"transportation_{current_activity.id}_{next_activity.id}_{i+1}",
                    start_time=start_time,
                    end_time=actual_end_time,
                    description=description,
                    notes=f"{icon} {notes}",
                    cost=cost,
                    mode=mode,
                    origin=current_activity.location.model_dump(),
                    destination=next_activity.location.model_dump(),
                    ticket_info=None
                )
                
                transportations.append(transportation)
        else:
            description = transport_info.get('description', '')
            cost = transport_info.get('cost', 0.0)
            mode = transport_info.get('transport_mode', 'walk')
            notes = transport_info.get('notes', '')
            
            if not description or description == '步行':
                description = '步行'
                notes = '路径较短，选择步行'
                mode = 'walk'
            
            transportation = Transportation(
                id=f"transportation_{current_activity.id}_{next_activity.id}_1",
                start_time=start_time,
                end_time=end_time,
                description=description,
                notes=notes,
                cost=cost,
                mode=mode,
                origin=current_activity.location.model_dump(),
                destination=next_activity.location.model_dump(),
                ticket_info=None
            )
            
            transportations.append(transportation)
        
        return transportations
        
    except Exception as e:
        print(f"创建交通信息失败: {e}")
        return []

def connect_location(trip: Trip) -> Trip:
    """连接Trip中的活动，自动添加交通信息"""
    try:
        print("开始连接地点...")
        
        amap_api = AmapAPI()
        
        for day in trip.days:
            if len(day.activities) < 2:
                print(f"第{day.day_index}天: 活动数量不足，跳过")
                continue
            
            print(f"第{day.day_index}天: 原始活动数量: {len(day.activities)}, 过滤后活动数量: {len(day.activities)}")
            
            activities = []
            for item in day.activities:
                if isinstance(item, Activity) or item.type == 'activity' or (hasattr(item, 'title') and hasattr(item, 'location')):
                    activities.append(item)
            
            new_activities = []
            
            for i in range(len(activities)):
                current_activity = activities[i]
                new_activities.append(current_activity)
                
                if i < len(activities) - 1:
                    next_activity = activities[i + 1]
                    current_end = current_activity.end_time
                    next_start = next_activity.start_time
                    
                    transportations = create_transportation_with_api(
                        amap_api, 
                        current_activity, 
                        next_activity,
                        current_end,
                        next_start,
                        trip.destination
                    )
                    
                    if transportations:
                        for transportation in transportations:
                            new_activities.append(transportation)
                        print(f"✓ 添加交通: {current_activity.location.name} -> {next_activity.location.name} (共{len(transportations)}个方案)")
                    else:
                        print(f"⚠️ 无法获取交通信息: {current_activity.location.name} -> {next_activity.location.name}")
            
            day.activities = new_activities
        
        print("地点连接完成！")
        return trip
        
    except Exception as e:
        print(f"连接地点时发生错误: {e}")
        return trip


def create_complex_trip():
    """创建复杂的测试行程"""
    print("=" * 80)
    print("🧪 创建复杂行程测试用例")
    print("=" * 80)
    
    from datetime import date, time
    
    # 创建Trip对象
    trip = Trip(
        user_id="test_user_complex_001",
        trip_id="shanghai_complex_trip_001",
        trip_name="上海两日游",
        destination="上海",
        start_date=date(2025, 1, 15),
        end_date=date(2025, 1, 16),
        days=[]
    )
    
    # Day 1: 虹桥机场 → 华东师范大学普陀校区 → 南京路步行街 → 上海交通大学徐汇校区 → 秋果酒店
    day1 = Day(
        date=date(2025, 1, 15),
        day_of_week="星期三",
        day_index=1,
        total_cost=0.0,
        activities=[
            Activity(
                id="activity_1",
                start_time=time(10, 0, 0),
                end_time=time(10, 30, 0),
                description="到达虹桥机场，办理入境手续",
                notes="请提前准备好身份证件",
                cost=0.0,
                type="activity",
                title="到达虹桥机场",
                location=Location(
                    name="虹桥机场",
                    address="长宁区虹桥路2550号",
                    coordinates=None
                ),
                recommended_products=[]
            ),
            Activity(
                id="activity_2",
                start_time=time(11, 30, 0),
                end_time=time(13, 0, 0),
                description="参观华东师范大学普陀校区，体验校园文化",
                notes="可以参观图书馆、教学楼等标志性建筑",
                cost=0.0,
                type="activity",
                title="华东师范大学普陀校区游玩",
                location=Location(
                    name="华东师范大学普陀校区",
                    address="中山北路3663号",
                    coordinates=None
                ),
                recommended_products=[]
            ),
            Activity(
                id="activity_3",
                start_time=time(14, 0, 0),
                end_time=time(16, 0, 0),
                description="游览南京路步行街，体验上海商业文化",
                notes="可以购买、品尝小吃，感受上海风情",
                cost=0.0,
                type="activity",
                title="南京路步行街游览",
                location=Location(
                    name="南京路步行街",
                    address="上海市黄浦区南京路步行街",
                    coordinates=None
                ),
                recommended_products=[]
            ),
            Activity(
                id="activity_4",
                start_time=time(16, 30, 0),
                end_time=time(18, 0, 0),
                description="参观上海交通大学徐汇校区，了解百年学府历史",
                notes="可以参观老图书馆、工程馆等历史建筑",
                cost=0.0,
                type="activity",
                title="上海交通大学徐汇校区游玩",
                location=Location(
                    name="上海交通大学徐汇校区",
                    address="徐汇区华山路1954号",
                    coordinates=None
                ),
                recommended_products=[]
            ),
            Activity(
                id="activity_5",
                start_time=time(18, 30, 0),
                end_time=time(19, 0, 0),
                description="入住秋果酒店交通大学地铁站店",
                notes="办理入住手续，稍作休息",
                cost=0.0,
                type="activity",
                title="入住秋果酒店",
                location=Location(
                    name="秋果酒店交通大学地铁站店",
                    address="长宁区新华路24号",
                    coordinates=None
                ),
                recommended_products=[]
            )
        ]
    )
    
    # Day 2: 上海交通大学闵行校区 → 华东师范大学闵行校区 → 浦东国际机场
    day2 = Day(
        date=date(2025, 1, 16),
        day_of_week="星期四",
        day_index=2,
        total_cost=0.0,
        activities=[
            Activity(
                id="activity_6",
                start_time=time(9, 0, 0),
                end_time=time(11, 0, 0),
                description="参观上海交通大学闵行校区，体验现代化校园",
                notes="可以参观新图书馆、体育馆等现代化设施",
                cost=0.0,
                type="activity",
                title="上海交通大学闵行校区游玩",
                location=Location(
                    name="上海交通大学闵行校区",
                    address="闵行区东川路800号",
                    coordinates=None
                ),
                recommended_products=[]
            ),
            Activity(
                id="activity_7",
                start_time=time(11, 30, 0),
                end_time=time(13, 0, 0),
                description="参观华东师范大学闵行校区，体验校园生活",
                notes="可以参观教学楼、学生活动中心等",
                cost=0.0,
                type="activity",
                title="华东师范大学闵行校区游玩",
                location=Location(
                    name="华东师范大学闵行校区",
                    address="东川路500号",
                    coordinates=None
                ),
                recommended_products=[]
            ),
            Activity(
                id="activity_8",
                start_time=time(14, 0, 0),
                end_time=time(14, 30, 0),
                description="前往浦东国际机场，办理登机手续",
                notes="请提前2小时到达机场，准备好登机证件",
                cost=0.0,
                type="activity",
                title="前往浦东国际机场",
                location=Location(
                    name="浦东国际机场",
                    address="浦东新区浦东国际机场",
                    coordinates=None
                ),
                recommended_products=[]
            )
        ]
    )
    
    # 添加天数到行程
    trip.days = [day1, day2]
    
    print("✅ 复杂行程创建成功！")
    print(f"行程名称: {trip.trip_name}")
    print(f"目的地: {trip.destination}")
    print(f"行程天数: {len(trip.days)}")
    
    # 显示行程概览
    for i, day in enumerate(trip.days, 1):
        print(f"\n第{i}天 ({day.date}):")
        for j, activity in enumerate(day.activities, 1):
            print(f"  {j}. {activity.title} ({activity.start_time}-{activity.end_time})")
            print(f"     地点: {activity.location.name}")
            print(f"     地址: {activity.location.address}")
    
    return trip


def test_complex_trip_connect():
    """测试复杂行程的connect_location功能"""
    print("\n" + "=" * 80)
    print("🚀 开始执行connect_location函数")
    print("=" * 80)
    
    # 创建行程
    trip = create_complex_trip()
    
    # 立即保存原始trip到complex_trip.json（在connect_location之前）
    try:
        import json
        trip_json = trip.model_dump(mode='json')
        with open("complex_trip.json", 'w', encoding='utf-8') as f:
            json.dump(trip_json, f, ensure_ascii=False, indent=2)
        print("✅ 原始复杂用例已保存到: complex_trip.json")
    except Exception as e:
        print(f"❌ 原始trip保存失败: {e}")
    
    # 执行connect_location（传入副本，避免修改原始数据）
    print("\n正在连接地点，添加交通信息...")
    import copy
    trip_copy = copy.deepcopy(trip)
    result_trip = connect_location(trip_copy)
    
    if result_trip:
        print("✅ connect_location执行成功！")
        
        # 分析结果
        total_activities = sum(len(day.activities) for day in result_trip.days)
        transportation_count = sum(1 for day in result_trip.days 
                                 for activity in day.activities 
                                 if hasattr(activity, 'mode') and activity.mode)
        
        print(f"\n📊 结果统计:")
        print(f"总活动数: {total_activities}")
        print(f"交通项目数: {transportation_count}")
        
        # 保存JSON结果
        output_file = "complex_trip_output.json"
        complex_trip_file = "complex_trip.json"
        
        try:
            # 使用model_dump(mode='json')来正确处理date对象
            trip_json = result_trip.model_dump(mode='json')
            
            # 保存到complex_trip_output.json（原始输出文件）
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(trip_json, f, ensure_ascii=False, indent=2)
            
            print(f"✅ JSON结果已保存到: {output_file}")
            
            # 保存到complex_trip.json（复杂用例文件）
            with open(complex_trip_file, 'w', encoding='utf-8') as f:
                json.dump(trip_json, f, ensure_ascii=False, indent=2)
            
            print(f"✅ 复杂用例已保存到: {complex_trip_file}")
            
            # 显示JSON结构预览
            print(f"\n📋 JSON结构预览 (前2000字符):")
            print("-" * 60)
            json_str = json.dumps(trip_json, ensure_ascii=False, indent=2)
            print(json_str[:2000])
            if len(json_str) > 2000:
                print(f"\n... (完整内容请查看文件: {output_file} 或 {complex_trip_file})")
            
        except Exception as e:
            print(f"❌ JSON保存失败: {e}")
    
    else:
        print("❌ connect_location执行失败！")
    
    print("\n" + "=" * 80)
    print("测试完成！")
    print("=" * 80)


if __name__ == "__main__":
    test_complex_trip_connect()
