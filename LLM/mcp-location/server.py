from mcp.server.fastmcp import FastMCP
import httpx
import os
from typing import Dict, List
import time
from dotenv import load_dotenv

# MCP的启动和配置
mcp = FastMCP("location_server")
load_dotenv()


class LocationService:
    """
    地点服务服务函数，封装高德地图 API 的常用能力
    功能：
      1) 以当前为中心点路况查询
      3) 以当前位置为中心点查询附近景点
      3) 城市知名景点
    """
    def __init__(self):
        self.amap_api_key = os.getenv("AMAP_API_KEY")
        self.cache: Dict[str, Dict] = {}
        self.cache_timeout = 300
        self.timeout = 12.0
        self.base = "https://restapi.amap.com/v3"

    # 使用缓存
    def _get_cache(self, key: str):
        item = self.cache.get(key)
        if item and (time.time() - item["ts"] < self.cache_timeout):
            return item["data"]
        return None

    def _set_cache(self, key: str, data):
        self.cache[key] = {"data": data, "ts": time.time()}

    # 使用地理编码
    async def geocode_location(self, location: str, city_hint: str = "") -> Dict:
        """
        文本地址 -> 经纬度；失败时自动用 city_hint 再试一次。
        返回：高德原始结构；
        失败返回 {"status":"error","message":...}
        """
        cache_key = f"geo::{location}::{city_hint}"
        cached = self._get_cache(cache_key)
        if cached:
            return cached

        try:
            params = {
                "address": location if not city_hint else f"{location} {city_hint}",
                "key": self.amap_api_key,
            }
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                r = await client.get(f"{self.base}/geocode/geo", params=params)
                r.raise_for_status()
                data = r.json()

            if (not data) or data.get("status") != "1" or not data.get("geocodes"):
                if not city_hint:
                    # 没找到当前位置的编码，尝试添加城市为北京市
                    return await self.geocode_location(location, city_hint="北京市")
                return {"status": "error", "message": f"无法解析地址：{location}"}

            self._set_cache(cache_key, data)
            return data

        except Exception as e:
            return {"status": "error", "message": f"地理编码失败：{e}"}

    # 按照高德的要求划定矩形区域
    def _rectangle_from_center(self, center: str, radius_deg: float = 0.01) -> str:
        """
        根据中心点生成矩形区域（左下角;右上角）
        高德要求：rectangle = "x1,y1;x2,y2"
        """
        try:
            lng, lat = map(float, center.split(","))
            x1, y1 = lng - radius_deg, lat - radius_deg  # 左下角
            x2, y2 = lng + radius_deg, lat + radius_deg  # 右上角
            return f"{x1},{y1};{x2},{y2}"
        except Exception:
            # 兜底：天安门附近小范围
            return "116.391,39.904;116.401,39.914"

    # =========================================================
    # 1) 路况查询
    # =========================================================
    async def get_traffic_status_raw(self, center_coords: str, radius_deg: float = 0.01) -> Dict:
        """
        按中心点+范围获取矩形区域路况。
        level=6: 所有道路；extensions=all：更多细节
        """
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
            return f"{location}附近没有找到有效的交通信息（可尝试扩大范围或更换时间）。"

        status_map = {"0": "未知", "1": "畅通", "2": "缓行", "3": "拥堵", "4": "严重拥堵"}
        lines = [f"{location}附近的交通状况："]
        for r in roads[:]:
            lines.append(
                f"- {r.get('name','未知道路')}: {status_map.get(r.get('status','0'),'未知')} {r.get('direction','')}".strip()
            )
        return "\n".join(lines)

    # =========================================================
    # 3) 周边景点（按中心点）
    # =========================================================
    async def search_poi_around(self, location: str, poi_type: str = "风景名胜", radius_m: int = 5000) -> Dict:
        """
        搜索中心点周边 POI（默认 5km，不足自动扩大到 10km）
        """
        geo = await self.geocode_location(location)
        if geo.get("status") == "error":
            return geo

        center = geo["geocodes"][0]["location"]
        params = {
            "key": self.amap_api_key,
            "location": center,
            "types": poi_type,
            "radius": str(radius_m),
            "offset": "20",
            "page": "1",
            "extensions": "base",
        }
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                r = await client.get(f"{self.base}/place/around", params=params)
                r.raise_for_status()
                data = r.json()

            pois = (data or {}).get("pois", []) or []
            if (data.get("status") != "1") or not pois:
                # 扩半径再试一次
                if radius_m < 10000:
                    return await self.search_poi_around(location, poi_type, radius_m=10000)
                return {"status": "error", "message": f"未找到 {location} 附近的 {poi_type}"}

            return data
        except Exception as e:
            return {"status": "error", "message": f"周边 POI 请求失败：{e}"}

    def _format_poi_list(self, pois: List[Dict], take: int = 8) -> List[str]:
        lines = []
        for p in pois[:take]:
            name = p.get("name", "未知")
            addr = p.get("address") or p.get("adname") or ""
            dist = p.get("distance")
            if dist:
                try:
                    dist = f"约{int(dist)}米"
                except Exception:
                    dist = f"约{dist}米"
            else:
                dist = ""
            lines.append(f"- {name} {f'({dist})' if dist else ''}：{addr}".strip())
        return lines

    async def generate_poi_around_report(self, location: str) -> str:
        data = await self.search_poi_around(location, "风景名胜")
        if data.get("status") == "error":
            return data["message"]
        pois = data.get("pois", []) or []
        if not pois:
            return f"{location} 附近没有找到景点。"
        lines = [f"{location} 附近的景点推荐："]
        lines += self._format_poi_list(pois, take=8)
        return "\n".join(lines)

    # =========================================================
    # 4) 城市知名景点
    # =========================================================
    async def search_city_top_attractions(self, city: str, page_size: int = 20) -> Dict:
        """
        按城市给出"知名景点"列表。
        使用 place/text，限制 city + citylimit=true，并按类型"风景名胜"过滤。
        """
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
        """
        简单去重（按 name + adname），优先保留信息较全的 POI。
        """
        seen = set()
        ranked = []
        for p in pois:
            key = (p.get("name",""), p.get("adname",""))
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
# MCP 工具导出
# =========================
location_service = LocationService()

@mcp.tool()
async def get_traffic_status(location: str, radius_deg: float = 0.01) -> str:
    """获取指定位置附近的交通拥堵情况（默认约±0.01°，约1.1km）"""
    return await location_service.generate_traffic_report(location, radius_deg)

@mcp.tool()
async def get_nearby_attractions(location: str) -> str:
    """获取指定位置附近的景点推荐（默认按"风景名胜"）"""
    return await location_service.generate_poi_around_report(location)

@mcp.tool()
async def get_city_top_attractions(city: str) -> str:
    """根据城市名称列出该城市的知名景点（类型：风景名胜，城市内限制）"""
    return await location_service.generate_city_top_attractions_report(city)


# =========================
# 启动
# =========================
if __name__ == "__main__":
    print("位置服务 MCP 服务器启动中...")
    mcp.run()