from typing import List

from fastapi import FastAPI,HTTPException
import redis
import uuid

from services.prompt_builder import build_create_itinerary_prompt,build_create_spot_prompt,build_create_hotel_prompt
from services.send_prompt import send_prompt
from services.data_validater import validate_data,validate_create_spot_data,validate_create_hotel_data
from services.connect_location import connect_location
from services.save_to_db import save_to_db

import json
from DataDefinition.DataDefinition import CreateItineraryRequest,CreateSpotsRequest
from DataDefinition.DataDefinition import Trip,Location,HotelSpotsData
app = FastAPI(
    title="Data Flow",
    description="Data Flow 后端数据的处理流程",
    version="1.0.0",
)

redis_client = redis.Redis(host='localhost', port=6379, db=0)

@app.post("/create/spotsRecommended", response_model=List[Location])
async def create_spot_recommended(request: CreateSpotsRequest):
    """
    用户填写基础信息后，给出推荐景点，用户可增删改。
    根据用户的出发地、目的地、日期、旅行风格和额外要求，
    利用大语言模型生成并返回推荐的景点列表。
    """
    prompt= build_create_spot_prompt(request)
    llm_response = await send_prompt(prompt)
    recommended_spots_data=validate_create_spot_data(llm_response)
    return recommended_spots_data

@app.post("/create/hotelRecommended", response_model=List[Location])
async def create_hotel_recommended(request: List[Location]):
    prompt = build_create_hotel_prompt(request)
    llm_response = await send_prompt(prompt)
    recommended_hotel_data = validate_create_hotel_data(llm_response)
    #返回酒店
    return recommended_hotel_data


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
    #发送提示词给大模型
    llm_response = await send_prompt(prompts)

    # 4. 校验结果
    # 接受并校验返回格式是否正确
    try:
        validated_data = validate_data(llm_response)
    except Exception as e:
        # 5. 错误处理
        # #格式不正确的校验与错误抛出流程
        raise e
    connect_location(validated_data)
    # 给另一个大模型检查结果是否符合要求（可选）
    # model_to_verify()
    # --- 缓存数据 ---
    # 生成一个唯一的ID作为缓存键
    itinerary_id = str(uuid.uuid4())

    # 将 validated_data (Pydantic 模型) 转换为 JSON 字符串存储
    # ex 参数设置缓存过期时间，这里设置为 3600 秒 (1小时)
    # 用户需要在1小时内确认，否则数据会从缓存中移除
    try:
        redis_client.set(itinerary_id, validated_data.json(), ex=3600)
    except redis.exceptions.ConnectionError as e:
        raise HTTPException(status_code=500, detail=f"Could not connect to Redis: {e}")

    # 7. 返回结果给前端显示，并包含缓存ID
    # 前端会使用这个 itinerary_id 在用户确认时发送确认请求
    return {
        "itinerary_id": itinerary_id,
        "data": validated_data.json()  # 返回json形式的数据供前端展示
    }





@app.post("/confirm/itinerary")
async def confirm_itinerary(itinerary_id: str):
    """根据用户确认指令，从缓存中取出数据并保存到数据库"""
    # 1. 从 Redis 缓存中获取数据
    try:
        cached_json_data = redis_client.get(itinerary_id)
    except redis.exceptions.ConnectionError as e:
        raise HTTPException(status_code=500, detail=f"Could not connect to Redis: {e}")

    if not cached_json_data:
        # 数据已过期或不存在
        raise HTTPException(status_code=404, detail="Itinerary data not found or has expired. Please regenerate.")

    # 2. 将缓存的 JSON 字符串反序列化为 Python 对象 (Pydantic 模型)
    try:
        validated_data = Trip.model_validate_json(cached_json_data)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to decode cached data.")

    # 3. 将数据保存到数据库
    try:
        save_to_db(validated_data)
    except Exception as e:
        # 数据库保存失败的处理
        raise HTTPException(status_code=500, detail=f"Failed to save itinerary to database: {e}")

    # 4. 数据保存成功后，从 Redis 缓存中删除此数据
    redis_client.delete(itinerary_id)

    return {"message": "Itinerary saved successfully!"}

@app.get("get/itinerary")
async def get_itinerary_by_id(itinerary_id: str):
    """<UNK>"""

@app.post("/delete/itinerary")
async def delete_itinerary(itinerary_id: str):
    """<UNK>"""