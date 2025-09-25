import asyncio
from typing import Any, Coroutine

from backend.Agents.SpotRecommendation import get_spot_recommendation
from backend.Agents.HotelRecommendation import get_hotel_recommendation
from backend.Agents.TrafficRecommendation import get_traffic_recommendation
from backend.Agents.TripRecommendation import get_trip_recommendation
from backend.Agents.BudgetRecommendation import get_budget_recommendation
from backend.tools.map_tools import search_and_add_poi
import json

async def send_spot_recommendation_prompt(prompts:str)-> list:
    data=await get_spot_recommendation(prompts)
    spot_rec_str=data[0].content
    try:
        spot_rec=json.loads(spot_rec_str)
        search_and_add_poi(spot_rec)
    except json.JSONDecodeError as e:
        print(f"解析错误: {e}")
        
    return data

def search_and_add_poi(spot_rec):
    print("POI 添加:", spot_rec)

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


async def send_trip_recommendation_prompt(prompt: str) -> list:
    data = await get_trip_recommendation(prompt)
    spot_rec_str = data[0]["content"]
    try:
        spot_rec = json.loads(spot_rec_str)
        search_and_add_poi(spot_rec)
    except json.JSONDecodeError as e:
        print(f"解析错误: {e}")
    return data

async def send_budget_recommendation_prompt(prompt: str) -> list:
    data = await get_budget_recommendation(prompt)
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
    
    
    
