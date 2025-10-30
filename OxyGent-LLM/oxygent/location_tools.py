import httpx
import os
from typing import Dict, List, Optional, Tuple
import time
from dotenv import load_dotenv
from pydantic import Field
from oxygent.oxy import FunctionHub
import json
import hashlib

load_dotenv()

# 创建位置服务工具集
location_tools = FunctionHub(name="location_tools")


class LocationService:
    """
    高德地图服务函数，封装高德地图 API 的完整能力
    功能：
      1) 地理编码/逆地理编码
      2) 路径规划
      3) 周边搜索
      4) 城市知名景点
      5) 附近知名景点
      6) 路况查询
      7) IP定位
      8) 输入提示
    """

    def __init__(self):
        self.amap_api_key = os.getenv("AMAP_API_KEY")
        self.cache: Dict[str, Dict] = {}
        self.cache_timeout = 300
        self.timeout = 12.0
        self.base = "https://restapi.amap.com/v3"
        self.config_base = "https://restapi.amap.com/v4"

        # POI类型分类
        self.poi_categories = {
            "餐饮": "050000",
            "酒店": "100000",
            "购物": "060000",
            "景点": "110000",
            "交通设施": "150000",
            "金融": "160000",
            "公司企业": "170000",
            "生活服务": "180000",
            "体育休闲": "080000",
            "医疗": "090000",
            "政府机构": "130000",
            "自然地物": "190000"
        }

    # 缓存管理
    def _get_cache(self, key: str):
        item = self.cache.get(key)
        if item and (time.time() - item["ts"] < self.cache_timeout):
            return item["data"]
        return None

    def _set_cache(self, key: str, data):
        self.cache[key] = {"data": data, "ts": time.time()}

    def _generate_cache_key(self, endpoint: str, params: Dict) -> str:
        """生成缓存键"""
        param_str = json.dumps(params, sort_keys=True)
        return f"{endpoint}::{hashlib.md5(param_str.encode()).hexdigest()}"

    # 地理编码/逆地理编码
    async def geocode_location(self, location: str, city_hint: str = "") -> Dict:
        """文本地址 -> 经纬度"""
        cache_key = self._generate_cache_key("geocode", {"location": location, "city": city_hint})
        cached = self._get_cache(cache_key)
        if cached:
            return cached

        try:
            params = {
                "address": location,
                "key": self.amap_api_key,
            }
            if city_hint:
                params["city"] = city_hint

            async with httpx.AsyncClient(timeout=self.timeout) as client:
                r = await client.get(f"{self.base}/geocode/geo", params=params)
                r.raise_for_status()
                data = r.json()

            if (not data) or data.get("status") != "1" or not data.get("geocodes"):
                if not city_hint:
                    return await self.geocode_location(location, city_hint="北京市")
                return {"status": "error", "message": f"无法解析地址：{location}"}

            self._set_cache(cache_key, data)
            return data

        except Exception as e:
            return {"status": "error", "message": f"地理编码失败：{e}"}

    async def reverse_geocode(self, lng: float, lat: float) -> Dict:
        """经纬度 -> 地址信息"""
        cache_key = self._generate_cache_key("reverse_geocode", {"lng": lng, "lat": lat})
        cached = self._get_cache(cache_key)
        if cached:
            return cached

        try:
            params = {
                "location": f"{lng},{lat}",
                "key": self.amap_api_key,
                "extensions": "all",
                "poitype": "all"
            }
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                r = await client.get(f"{self.base}/geocode/regeo", params=params)
                r.raise_for_status()
                data = r.json()

            if data.get("status") != "1":
                return {"status": "error", "message": f"逆地理编码失败：{data.get('info')}"}

            self._set_cache(cache_key, data)
            return data

        except Exception as e:
            return {"status": "error", "message": f"逆地理编码请求失败：{e}"}

    # 路径规划
    async def route_planning(self, origin: str, destination: str, mode: str = "driving") -> Dict:
        """
        路径规划
        mode: 驾车, 步行, 公交, 骑行
        """
        cache_key = self._generate_cache_key("route", {
            "origin": origin, "destination": destination, "mode": mode
        })
        cached = self._get_cache(cache_key)
        if cached:
            return cached

        try:
            # 先获取起点和终点的坐标
            origin_geo = await self.geocode_location(origin)
            dest_geo = await self.geocode_location(destination)

            if origin_geo.get("status") == "error":
                return origin_geo
            if dest_geo.get("status") == "error":
                return dest_geo

            origin_coord = origin_geo["geocodes"][0]["location"]
            dest_coord = dest_geo["geocodes"][0]["location"]

            params = {
                "key": self.amap_api_key,
                "origin": origin_coord,
                "destination": dest_coord,
            }

            endpoints = {
                "driving": "/direction/driving",
                "walking": "/direction/walking",
                "bus": "/direction/transit/integrated",
                "bicycle": "/direction/bicycling"
            }

            endpoint = endpoints.get(mode, "/direction/driving")

            async with httpx.AsyncClient(timeout=self.timeout) as client:
                r = await client.get(f"{self.base}{endpoint}", params=params)
                r.raise_for_status()
                data = r.json()

            if data.get("status") != "1":
                return {"status": "error", "message": f"路径规划失败：{data.get('info')}"}

            self._set_cache(cache_key, data)
            return data

        except Exception as e:
            return {"status": "error", "message": f"路径规划请求失败：{e}"}

    def _format_route_result(self, data: Dict, mode: str) -> str:
        """格式化路径规划结果"""
        if mode == "driving":
            route = data.get("route", {})
            paths = route.get("paths", [])
            if not paths:
                return "未找到可行路线"

            path = paths[0]
            result = [
                f"驾车路线规划",
                f"总距离: {int(path.get('distance', 0))}米",
                f"预计时间: {int(int(path.get('duration', 0)) / 60)}分钟",
                f"收费: {path.get('tolls', '0')}元",
                "主要路径:"
            ]

            steps = path.get("steps", [])
            for i, step in enumerate(steps, 1):  # 只显示前5步
                instruction = step.get("instruction", "").replace("<b>", "").replace("</b>", "")
                result.append(f"{i}. {instruction}")

            return "\n".join(result)

        elif mode == "walking":
            route = data.get("route", {})
            paths = route.get("paths", [])
            if not paths:
                return "未找到步行路线"

            path = paths[0]
            return f"步行路线\n距离: {int(path.get('distance', 0))}米\n预计时间: {int(int(path.get('duration', 0)) / 60)}分钟"

        elif mode == "bus":
            route = data.get("route", {})
            transits = route.get("transits", [])
            if not transits:
                return "未找到公交路线"

            transit = transits[0]
            result = [
                f"公交路线",
                f"总距离: {transit.get('distance', 0)}米",
                f"预计时间: {int(int(transit.get('duration', 0)) / 60)}分钟",
                f"票价: {transit.get('cost', '未知')}元"
            ]

            segments = transit.get("segments", [])
            for i, segment in enumerate(segments, 1):
                if segment.get("bus", {}).get("buslines"):
                    busline = segment["bus"]["buslines"][0]
                    result.append(f"{i}. {busline.get('name', '公交')}")

            return "\n".join(result)

        elif mode == "bicycle":
            route = data.get("route", {})
            paths = route.get("paths", [])
            if not paths:
                return "未找到骑行路线"

            path = paths[0]
            return f"骑行路线\n距离: {int(path.get('distance', 0))}米\n预计时间: {int(int(path.get('duration', 0)) / 60)}分钟"

        return "未知的出行方式"

    # 周边搜索
    async def search_poi_around(self, location: str, poi_type: str = "风景名胜",
                                radius_m: int = 5000, keywords: str = "") -> Dict:
        """搜索中心点周边 POI"""
        geo = await self.geocode_location(location)
        if geo.get("status") == "error":
            return geo

        center = geo["geocodes"][0]["location"]
        type_code = self.poi_categories.get(poi_type, poi_type)

        params = {
            "key": self.amap_api_key,
            "location": center,
            "types": type_code,
            "radius": str(radius_m),
            "offset": "20",
            "page": "1",
            "extensions": "all",
        }

        if keywords:
            params["keywords"] = keywords

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                r = await client.get(f"{self.base}/place/around", params=params)
                r.raise_for_status()
                data = r.json()

            pois = (data or {}).get("pois", []) or []
            if (data.get("status") != "1") or not pois:
                if radius_m < 10000:
                    return await self.search_poi_around(location, poi_type, radius_m=10000, keywords=keywords)
                return {"status": "error", "message": f"未找到 {location} 附近的 {poi_type}"}

            return data
        except Exception as e:
            return {"status": "error", "message": f"周边 POI 请求失败：{e}"}

    def _format_poi_list(self, pois: List[Dict], take: int = 8) -> List[str]:
        """格式化POI列表"""
        lines = []
        for p in pois[:take]:
            name = p.get("name", "未知")
            addr = p.get("address") or p.get("adname") or ""
            dist = p.get("distance")
            tel = p.get("tel", "")

            if dist:
                try:
                    if int(dist) > 1000:
                        dist = f"约{float(dist) / 1000:.1f}公里"
                    else:
                        dist = f"约{int(dist)}米"
                except Exception:
                    dist = f"约{dist}米"
            else:
                dist = ""

            line = f"- {name}"
            if dist:
                line += f" ({dist})"
            if addr:
                line += f"：{addr}"
            if tel:
                line += f" 📞{tel}"

            lines.append(line.strip())
        return lines

    # IP定位
    async def ip_location(self, ip: str = "") -> Dict:
        """IP定位"""
        cache_key = self._generate_cache_key("ip_location", {"ip": ip})
        cached = self._get_cache(cache_key)
        if cached:
            return cached

        try:
            params = {
                "key": self.amap_api_key,
            }
            if ip:
                params["ip"] = ip

            async with httpx.AsyncClient(timeout=self.timeout) as client:
                r = await client.get(f"{self.base}/ip", params=params)
                r.raise_for_status()
                data = r.json()

            if data.get("status") != "1":
                return {"status": "error", "message": f"IP定位失败：{data.get('info')}"}

            self._set_cache(cache_key, data)
            return data

        except Exception as e:
            return {"status": "error", "message": f"IP定位请求失败：{e}"}

    # 输入提示
    async def input_tips(self, keywords: str, city: str = "全国") -> Dict:
        """输入提示"""
        cache_key = self._generate_cache_key("input_tips", {"keywords": keywords, "city": city})
        cached = self._get_cache(cache_key)
        if cached:
            return cached

        try:
            params = {
                "key": self.amap_api_key,
                "keywords": keywords,
                "city": city,
                "citylimit": "true" if city != "全国" else "false"
            }
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                r = await client.get(f"{self.base}/assistant/inputtips", params=params)
                r.raise_for_status()
                data = r.json()

            if data.get("status") != "1":
                return {"status": "error", "message": f"输入提示失败：{data.get('info')}"}

            self._set_cache(cache_key, data)
            return data

        except Exception as e:
            return {"status": "error", "message": f"输入提示请求失败：{e}"}

    # =========================================================
    # 原有功能保持
    # =========================================================
    def _rectangle_from_center(self, center: str, radius_deg: float = 0.01) -> str:
        """根据中心点生成矩形区域"""
        try:
            lng, lat = map(float, center.split(","))
            x1, y1 = lng - radius_deg, lat - radius_deg
            x2, y2 = lng + radius_deg, lat + radius_deg
            return f"{x1},{y1};{x2},{y2}"
        except Exception:
            return "116.391,39.904;116.401,39.914"

    async def get_traffic_status_raw(self, center_coords: str, radius_deg: float = 0.01) -> Dict:
        """路况查询"""
        rectangle = self._rectangle_from_center(center_coords, radius_deg)
        params = {
            "key": self.amap_api_key,
            "rectangle": rectangle,
            "level": "6",
            "extensions": "all",
        }
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                r = await client.get(f"{self.base}/traffic/status/rectangle", params=params)
                r.raise_for_status()
                data = r.json()
                if data.get("status") != "1":
                    return {"status": "error", "message": f"路况接口错误：{data.get('info')}"}
                return data
        except Exception as e:
            return {"status": "error", "message": f"路况请求失败：{e}"}

    async def get_traffic_status(self, location: str, radius_deg: float = 0.01) -> Dict:
        """文本地址转坐标后取路况"""
        geo = await self.geocode_location(location)
        if geo.get("status") == "error":
            return geo
        center = geo["geocodes"][0]["location"]
        return await self.get_traffic_status_raw(center, radius_deg)

    async def generate_traffic_report(self, location: str, radius_deg: float = 0.01) -> str:
        """生成简明路况报告"""
        data = await self.get_traffic_status(location, radius_deg)
        if data.get("status") == "error":
            return data["message"]

        roads = data.get("trafficinfo", {}).get("roads", []) or []
        if not roads:
            return f"{location}附近没有找到有效的交通信息。"

        status_map = {"0": "未知", "1": "畅通", "2": "缓行", "3": "拥堵", "4": "严重拥堵"}
        lines = [f"{location}附近的交通状况："]
        for r in roads[:8]:
            lines.append(
                f"- {r.get('name', '未知道路')}: {status_map.get(r.get('status', '0'), '未知')} {r.get('direction', '')}".strip()
            )
        return "\n".join(lines)

    async def generate_poi_around_report(self, location: str, poi_type: str = "风景名胜", keywords: str = "") -> str:
        """生成周边POI报告"""
        data = await self.search_poi_around(location, poi_type, keywords=keywords)
        if data.get("status") == "error":
            return data["message"]
        pois = data.get("pois", []) or []
        if not pois:
            return f"{location} 附近没有找到{poi_type}。"
        lines = [f"{location} 附近的{poi_type}："]
        lines += self._format_poi_list(pois, take=8)
        return "\n".join(lines)

    async def search_city_top_attractions(self, city: str, page_size: int = 20) -> Dict:
        """城市知名景点"""
        params = {
            "key": self.amap_api_key,
            "keywords": "",
            "types": "风景名胜",
            "city": city,
            "citylimit": "true",
            "offset": str(page_size),
            "page": "1",
            "extensions": "base",
        }
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                r = await client.get(f"{self.base}/place/text", params=params)
                r.raise_for_status()
                data = r.json()
            if data.get("status") != "1" or not data.get("pois"):
                return {"status": "error", "message": f"未能获取到 {city} 的知名景点。"}
            return data
        except Exception as e:
            return {"status": "error", "message": f"城市景点请求失败：{e}"}

    def _dedup_and_rank_pois(self, pois: List[Dict], max_take: int = 15) -> List[Dict]:
        """POI去重排序"""
        seen = set()
        ranked = []
        for p in pois:
            key = (p.get("name", ""), p.get("adname", ""))
            if key in seen:
                continue
            seen.add(key)
            score = 0
            if p.get("tel"): score += 1
            if p.get("type"): score += 1
            if p.get("pname"): score += 1
            if p.get("cityname"): score += 1
            ranked.append((score, p))
        ranked.sort(key=lambda x: x[0], reverse=True)
        return [p for _, p in ranked[:max_take]]

    async def generate_city_top_attractions_report(self, city: str) -> str:
        """生成城市景点报告"""
        data = await self.search_city_top_attractions(city)
        if data.get("status") == "error":
            return data["message"]
        pois = data.get("pois", []) or []
        if not pois:
            return f"{city} 暂未找到知名景点。"
        pois = self._dedup_and_rank_pois(pois, max_take=12)
        lines = [f"{city} 的知名景点："]
        lines += self._format_poi_list(pois, take=12)
        return "\n".join(lines)


# =========================
# 工具函数注册
# =========================
location_service = LocationService()


# 原有基础功能
@location_tools.tool(
    description="获取指定位置附近的交通拥堵情况。输入位置名称（如'天安门'、'北京市朝阳区'等），返回该区域的道路交通状况。"
)
async def get_traffic_status(
        location: str = Field(description="要查询交通状况的位置名称或地址"),
        radius_deg: float = Field(default=0.01, description="查询范围（经纬度度数，默认约1.1km半径）")
) -> str:
    return await location_service.generate_traffic_report(location, radius_deg)


@location_tools.tool(
    description="获取指定位置附近的景点推荐。输入位置名称，返回周边5公里内的风景名胜景点信息。"
)
async def get_nearby_attractions(
        location: str = Field(description="要查询周边景点的位置名称或地址")
) -> str:
    return await location_service.generate_poi_around_report(location)


@location_tools.tool(
    description="根据城市名称列出该城市的知名景点。输入城市名（如'北京'、'上海'），返回该城市内的主要风景名胜。"
)
async def get_city_top_attractions(
        city: str = Field(description="要查询景点的城市名称")
) -> str:
    return await location_service.generate_city_top_attractions_report(city)


# 新增功能
@location_tools.tool(
    description="路径规划功能，支持驾车、步行、公交、骑行四种方式。输入起点和终点位置，返回最佳路线。"
)
async def route_planning(
        origin: str = Field(description="起点位置名称或地址"),
        destination: str = Field(description="终点位置名称或地址"),
        mode: str = Field(default="driving",
                          description="出行方式: driving(驾车), walking(步行), bus(公交), bicycle(骑行)")
) -> str:
    data = await location_service.route_planning(origin, destination, mode)
    if data.get("status") == "error":
        return data["message"]
    return location_service._format_route_result(data, mode)

@location_tools.tool(
    description="根据IP地址定位地理位置。可输入特定IP或使用当前IP进行定位。"
)
async def ip_location(
        ip: str = Field(default="", description="要定位的IP地址，留空则使用当前IP")
) -> str:
    data = await location_service.ip_location(ip)
    if data.get("status") == "error":
        return data["message"]

    location_info = data.get("rectangle", "") or data.get("city", "")
    return f"IP定位结果: {location_info}"


@location_tools.tool(
    description="搜索指定位置周边的各类POI点，包括餐饮、酒店、购物、景点等。可指定类型和关键词。"
)
async def search_around_poi(
        location: str = Field(description="中心位置名称或地址"),
        poi_type: str = Field(default="餐饮", description="POI类型: 餐饮, 酒店, 购物, 景点, 交通设施等"),
        keywords: str = Field(default="", description="搜索关键词，如'星巴克','万达广场'等")
) -> str:
    return await location_service.generate_poi_around_report(location, poi_type, keywords)


@location_tools.tool(
    description="输入提示功能，根据关键词和城市返回相关的地址建议。"
)
async def input_tips(
        keywords: str = Field(description="搜索关键词"),
        city: str = Field(default="全国", description="限制城市范围，默认全国")
) -> str:
    data = await location_service.input_tips(keywords, city)
    if data.get("status") == "error":
        return data["message"]

    tips = data.get("tips", [])
    if not tips:
        return "未找到相关建议"

    result = [f"'{keywords}' 的建议结果:"]
    for tip in tips[:5]:
        name = tip.get("name", "")
        district = tip.get("district", "")
        result.append(f"- {name} ({district})")

    return "\n".join(result)


@location_tools.tool(
    description="逆地理编码，将经纬度坐标转换为具体的地址信息。"
)
async def reverse_geocode(
        longitude: float = Field(description="经度坐标"),
        latitude: float = Field(description="纬度坐标")
) -> str:
    data = await location_service.reverse_geocode(longitude, latitude)
    if data.get("status") == "error":
        return data["message"]

    regeocode = data.get("regeocode", {})
    address = regeocode.get("formatted_address", "未知地址")
    return f"坐标({longitude}, {latitude})对应的地址: {address}"