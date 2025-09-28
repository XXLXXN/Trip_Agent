import asyncio
from typing import Any, Coroutine, Optional, List

from backend.Agents.SpotRecommendation import get_spot_recommendation
from backend.Agents.HotelRecommendation import get_hotel_recommendation
from backend.Agents.TrafficRecommendation import get_traffic_recommendation
from backend.Agents.TripRecommendation import get_trip_recommendation
from backend.Agents.BudgetRecommendation import search_goods_prices
from backend.DataDefinition.DataDefinition import SpotNameAndRecReason, Trip
from backend.tools.map_tools import search_and_add_poi
import json
# 假设 SpotNameAndRecReason 和 get_spot_recommendation, search_and_add_poi 已经定义
# from somewhere import SpotNameAndRecReason, get_spot_recommendation, search_and_add_poi

async def send_spot_recommendation_prompt(prompts: str) -> Optional[List[SpotNameAndRecReason]]:
    """
    根据用户提示获取景点推荐，并解析处理。

    Args:
        prompts: 用户输入的提示字符串。

    Returns:
        成功时返回 SpotNameAndRecReason 对象，失败时返回 None。
    """
    try:
        # 确保 get_spot_recommendation 能够处理并返回有效数据
        api_response = await get_spot_recommendation(prompts)

        # 检查响应是否为空或无效
        if not api_response or not api_response[0].content:
            print("错误：获取的推荐数据为空或无效。")
            return None

        raw_json_string: str = api_response[0].content
        spot_rec: List[SpotNameAndRecReason]= json.loads(raw_json_string)

        # 调用并处理后续逻辑
        search_and_add_poi(spot_rec)
        return spot_rec

    except json.JSONDecodeError as e:
        print(f"解析 JSON 错误: {e}")
        return None
    except IndexError:
        print("错误：API 响应格式不正确，无法访问数据。")
        return None
    except Exception as e:
        # 捕获其他未预料的错误，例如网络请求失败
        print(f"在end_spot_recommendation_prompt函数发生未知错误: {e}")
        return None



async def send_hotel_recommendation_prompt(prompt: str) -> list:
    data = await get_hotel_recommendation(prompt)
    spot_rec_str = data[0]["content"]
    try:
        spot_rec = json.loads(spot_rec_str)
        search_and_add_poi(spot_rec)
    except json.JSONDecodeError as e:
        print(f"解析错误: {e}")
    return data

async def send_traffic_recommendation_prompt(prompt: str) -> list:
    data = await get_traffic_recommendation(prompt)
    spot_rec_str = data[0]["content"]
    try:
        spot_rec = json.loads(spot_rec_str)
        search_and_add_poi(spot_rec)
    except json.JSONDecodeError as e:
        print(f"解析错误: {e}")
    return data


async def send_trip_plan_prompt(prompt: str) -> Trip:
    data = await get_trip_recommendation(prompt)
    spot_rec_str = data[0]["content"]
    try:
        spot_rec = json.loads(spot_rec_str)
        search_and_add_poi(spot_rec)
    except json.JSONDecodeError as e:
        print(f"解析错误: {e}")
    return data

async def send_goods_price_search_prompt(prompt: str) -> list:
    data = await search_goods_prices(prompt)
    spot_rec_str = data[0]["content"]
    try:
        spot_rec = json.loads(spot_rec_str)
        search_and_add_poi(spot_rec)
    except json.JSONDecodeError as e:
        print(f"解析错误: {e}")
    return data

async def main():
    prompt = """
    [用户已选定的景点]:
    故宫博物院 (The Palace Museum / Forbidden City)
    天坛公园 (Temple of Heaven Park)
    颐和园 (Summer Palace)
    八达岭长城 (Badaling Great Wall)

    [用户的旅行偏好]
    目的地城市: 北京 (Beijing)
    budget_range: "每晚 600-1000 人民币"
    hotel_needs: "4星级或同等级别的精品酒店，必须靠近地铁站，方便出行。希望酒店有比较好的评价。"
    """
    print("Prompt:", prompt)

    result = await send_hotel_recommendation_prompt(prompt)
    print("结果:", result)

if __name__ == "__main__":
    asyncio.run(main())
    
    
    
