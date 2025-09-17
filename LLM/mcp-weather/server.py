from mcp.server.fastmcp import FastMCP
import httpx
import os
from typing import Optional, List, Dict
import time
from dotenv import load_dotenv

# 初始化MCP服务器
mcp = FastMCP("weather_server")
load_dotenv()

class WeatherService:
    def __init__(self):
        self.amap_api_key = os.getenv("AMAP_API_KEY")  # 高德地图API密钥
        self.cache = {}
        self.cache_timeout = 300  # 5分钟缓存

    async def _fetch_from_amap(self, city: str) -> Optional[dict]:
        """分别请求 base(实时) 与 all(预报)，合并结果。"""
        try:
            import urllib.parse
            encoded_city = urllib.parse.quote(city)

            base_url = (
                f"https://restapi.amap.com/v3/weather/weatherInfo"
                f"?city={encoded_city}&key={self.amap_api_key}&extensions=base"
            )
            all_url = (
                f"https://restapi.amap.com/v3/weather/weatherInfo"
                f"?city={encoded_city}&key={self.amap_api_key}&extensions=all"
            )

            async with httpx.AsyncClient(timeout=10.0) as client:
                # 并发请求实时与预报
                base_resp, all_resp = await client.get(base_url), await client.get(all_url)
                base_resp.raise_for_status()
                all_resp.raise_for_status()
                base_data = base_resp.json() or {}
                all_data = all_resp.json() or {}

            # 合并：优先保留 status=1；把 lives/forecasts 放一起
            merged = {
                "status": "1" if (base_data.get("status") == "1" or all_data.get("status") == "1") else "0",
                "lives": base_data.get("lives") or [],
                "forecasts": all_data.get("forecasts") or [],
            }
            # count 对用户无关紧要，可不强求；若需要可粗略计算
            merged["count"] = str(len(merged["lives"])) if merged["lives"] else (all_data.get("count") or "0")
            return merged

        except httpx.TimeoutException:
            print(f"获取天气数据超时: {city}")
            return None
        except Exception as e:
            print(f"获取天气数据失败: {e}")
            return None

    async def get_weather_data(self, city: str) -> Optional[dict]:
        """获取并缓存城市天气（含实时与预报）"""
        now = time.time()
        if city in self.cache:
            cached = self.cache[city]
            if now - cached["timestamp"] < self.cache_timeout:
                return cached["data"]

        data = await self._fetch_from_amap(city)
        if data is not None:
            self.cache[city] = {"data": data, "timestamp": now}
        return data

    @staticmethod
    def _fmt_percent(h: str) -> str:
        """把高德返回的湿度数值字符串规范为带 % 的形式。"""
        if h is None:
            return "-"
        hs = str(h).strip()
        return hs if hs.endswith("%") else f"{hs}%"

    @staticmethod
    def format_weather_text(weather_data: dict) -> str:
        """
        用高德返回的数据生成简短文本（不调用任何NLP/大模型）
        优先使用实时(lives)，否则使用预报(forecasts)的今天数据。
        """
        if not weather_data:
            return "无法生成天气报告"

        # 实时天气（含湿度）
        lives = weather_data.get('lives') or []
        if isinstance(lives, list) and len(lives) > 0:
            live = lives[0]
            province = live.get('province', '')
            city = live.get('city', '')
            weather = live.get('weather', '-')
            temperature = live.get('temperature', '-')
            humidity = WeatherService._fmt_percent(live.get('humidity'))
            winddirection = live.get('winddirection', '-')
            windpower = live.get('windpower', '-')
            reporttime = live.get('reporttime', '-')
            return (
                f"{province}{city}实时天气：{weather}，{temperature}℃，"
                f"湿度：{humidity}。"
                f"风向：{winddirection}，风力：{windpower}级。"
                f"发布时间：{reporttime}"
            )

        # 预报天气（取今天/第一天，注意：预报无湿度字段）
        forecasts = weather_data.get('forecasts') or []
        if isinstance(forecasts, list) and len(forecasts) > 0:
            f = forecasts[0]
            city = f.get('city', '')
            casts = f.get('casts') or []
            if casts:
                today = casts[0]
                date = today.get('date', '')
                dayweather = today.get('dayweather', '-')
                nightweather = today.get('nightweather', '-')
                daytemp = today.get('daytemp', '-')
                nighttemp = today.get('nighttemp', '-')
                daywind = today.get('daywind', '-')
                nightwind = today.get('nightwind', '-')
                daypower = today.get('daypower', '-')
                nightpower = today.get('nightpower', '-')
                return (
                    f"{city}（{date}）白天{dayweather}，{daytemp}℃，风向{daywind}，风力{daypower}级；"
                    f"夜间{nightweather}，{nighttemp}℃，风向{nightwind}，风力{nightpower}级。"
                )

        return "无法生成天气报告"

    @staticmethod
    def format_forecast_text(forecasts: List[Dict], city: str, days: int) -> str:
        """
        根据 forecasts 的 casts 列表，格式化多天预报文本。
        高德最多返回4天，这里会按 days 截取（预报没有湿度字段）。
        """
        if not forecasts:
            return "暂无预报数据"

        casts = forecasts[0].get("casts") or []
        if not casts:
            return "暂无预报数据"

        days = max(1, min(int(days), 4, len(casts)))  # 1~4 且不超过实际返回
        lines = [f"{city}未来{days}天天气预报："]
        for i in range(days):
            c = casts[i]
            date = c.get("date", "-")
            d_w = c.get("dayweather", "-")
            n_w = c.get("nightweather", "-")
            d_t = c.get("daytemp", "-")
            n_t = c.get("nighttemp", "-")
            d_wind = c.get("daywind", "-")
            n_wind = c.get("nightwind", "-")
            d_pow = c.get("daypower", "-")
            n_pow = c.get("nightpower", "-")
            lines.append(
                f"{date}：白天{d_w}，{d_t}℃（{d_wind}风{d_pow}级）；夜间{n_w}，{n_t}℃（{n_wind}风{n_pow}级）"
            )
        return "\n".join(lines)

# 创建天气服务实例
weather_service = WeatherService()

@mcp.tool()
async def get_recent_weather(city: str) -> str:
    """获取指定城市的实时天气情况（含湿度）"""
    data = await weather_service.get_weather_data(city)
    if not data or data.get('status') != '1':
        return f"无法获取{city}的天气信息，请检查城市名称是否正确"
    return weather_service.format_weather_text(data)

@mcp.tool()
async def get_weather_forecast(city: str, days: int = 3) -> str:
    """
    获取指定城市未来若干天（1-4天）的天气预报。
    注意：预报没有湿度字段；湿度只会出现在实时天气里。
    """
    data = await weather_service.get_weather_data(city)
    if not data or data.get('status') != '1':
        return f"无法获取{city}的天气信息，请检查城市名称是否正确"

    forecasts = data.get("forecasts") or []
    if not forecasts:
        return f"{city}暂无预报数据"

    city_name = forecasts[0].get("city", city)
    try:
        days_int = int(days)
    except Exception:
        days_int = 3
    days_int = max(1, min(days_int, 4))

    return weather_service.format_forecast_text(forecasts, city_name, days_int)

if __name__ == "__main__":
    print("天气服务MCP服务器启动中...")
    mcp.run()
