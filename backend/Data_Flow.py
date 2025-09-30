from typing import List

from fastapi import FastAPI
import redis

from backend.database.database_operations import save_trip_to_db
from backend.services.prompt_builder import build_create_itinerary_prompt,build_create_spot_prompt,build_create_hotel_prompt,build_create_traffic_prompt
from backend.tools.connect_location import connect_location
from backend.tools.map_tools import add_detail_info
from backend.DataDefinition.DataDefinition import CreateItineraryRequest, CreateSpotsRequest, HotelNameAndRecReason, \
    CreateHotelRequest, CreateTrafficRequest, SpotDetailInfo
from backend.DataDefinition.DataDefinition import Trip

from backend.DataDefinition.DataDefinition import SpotNameAndRecReason, TrafficRecInfo
from backend.services.prompt_sender import send_spot_recommendation_prompt, send_hotel_recommendation_prompt, \
    send_traffic_recommendation_prompt, send_trip_plan_prompt, send_goods_price_search_prompt

app = FastAPI(
    title="Data Flow",
    description="Data Flow 后端数据的处理流程",
    version="1.0.0",
)

redis_client = redis.Redis(host='localhost', port=6379, db=0)

@app.post("/create/spotsRecommended", response_model=List[SpotDetailInfo])
async def create_spot_recommended(request: CreateSpotsRequest):
    """
    用户填写基础信息后，给出推荐景点，用户可增删改。
    根据用户的出发地、目的地、日期、旅行风格和额外要求，
    利用大语言模型生成并返回推荐的景点列表。
    """

    prompt= build_create_spot_prompt(request)
    recommended_spots_data= await send_spot_recommendation_prompt(prompt)
    #处理并存储大模型返回的信息，把POI加入数据里的的函数
    detail_data=add_detail_info(recommended_spots_data)
    return detail_data

@app.post("/create/hotelRecommended", response_model=List[HotelNameAndRecReason])
async def create_hotel_recommended(request: CreateHotelRequest):
    # 缓存用户输入信息的函数
    prompt = build_create_hotel_prompt(request)
    recommended_hotel_data  = await send_hotel_recommendation_prompt(prompt)
    # 处理并存储大模型返回的信息，把POI加入数据里的的函数
    #返回酒店
    return recommended_hotel_data


@app.post("/create/trafficRecommended",response_model=List[TrafficRecInfo])
async def create_traffic_recommended(request:CreateTrafficRequest):
    prompt = build_create_traffic_prompt(request)
    recommended_traffic_data = await send_traffic_recommendation_prompt(prompt)
    # 处理并存储大模型返回的信息，把POI加入数据里的的函数
    # 返回交通方式
    return recommended_traffic_data

@app.post("/create/itinerary")
async def create_itinerary(request:CreateItineraryRequest):
    """处理前端传来数据的主流程"""
    # 1. 提取参数
    # 提取前端固定填的参数，如预算，时间，目的地等
    # 提取额外的要求，如用户用自然语言给出的“文艺之旅”，“住的好点”，“相去更多有历史文化的地方”
    #在request里已被封装好
    # 2. 构建提示词
    # 构建提示词，需要根据用户要求，比如什么是不能更改的，如果有冲突按照哪个办，参数的优先级是否需要强调等
    prompts =build_create_itinerary_prompt(request)
    # 3. 发送提示词
    # 发送提示词给大模型
    trip_no_trans=await send_trip_plan_prompt(prompts)

    trip_data=connect_location(trip_no_trans)
    # 给另一个大模型检查结果是否符合要求（可选）
    # model_to_verify()
    return trip_data



@app.post("/confirm/itinerary")
async def confirm_itinerary(confirmed_data:Trip):
    """根据用户确认指令，从缓存中取出数据并保存到数据库，并进行支付链接生成和加入购物车"""
    trip_dict=confirmed_data.model_dump()
    data_id=save_trip_to_db(trip_dict)
    prompts = build_create_itinerary_prompt(request)
    #生成支付链接
    goods=await send_goods_price_search_prompt(prompts)
    #返回支付信息
    return data_id,List[goods]

@app.post("/oneClick/itinerary")
async def oneclick_itinerary(request):

    """
    用户一键式规划，生成支付链接
    根据目前用户提交的数据类型判断用户在哪个阶段一键式规划
    然后直接返回支付链接
    """

@app.post("/update/itinerary")
async def update_itinerary(request:UpdateItineraryRequest):
    prompts = update_itinerary_prompt(request)
    trip_no_trans = await send_trip_plan_prompt(prompts)
    trip_data=connect_location(trip_no_trans)
@app.get("get/itinerary")
async def get_itinerary_by_id(itinerary_id: str):
    """<UNK>"""

@app.post("/delete/itinerary")
async def delete_itinerary(itinerary_id: str):
    """<UNK>"""
