#!/usr/bin/env python3
"""
独立的 FastAPI 应用，专门用于测试 /create/hotelRecommended 接口
"""

import sys
import os
import uvicorn
from datetime import date
from typing import List
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 添加项目根目录到路径
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, project_root)

from backend.DataDefinition.DataDefinition import (
    CreateHotelRequest, TravellerCount, TravellerType, Budget, POIInfo, HotelDetailInfo
)
from backend.services.prompt_builder import build_create_hotel_prompt
from backend.tools.hotel_tools import process_hotel_recommendations
from backend.services.prompt_sender import send_hotel_recommendation_prompt

# 创建独立的测试应用
test_app = FastAPI(
    title="Hotel Recommended Test API",
    description="专门用于测试酒店推荐接口的独立应用",
    version="1.0.0",
)

# 添加 CORS 中间件
test_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@test_app.post("/test/hotelRecommended", response_model=List[HotelDetailInfo])
async def test_create_hotel_recommended(request: CreateHotelRequest):
    """
    测试版本的酒店推荐接口
    """
    print("=== 开始测试酒店推荐接口 ===")
    print(f"请求数据: {request.dict()}")
    
    try:
        # 1. 构建提示词
        prompt = build_create_hotel_prompt(request)
        print(f"生成的提示词长度: {len(prompt)} 字符")
        
        # 2. 发送提示词给大模型
        print("正在发送提示词给大模型...")
        recommended_hotel_data = await send_hotel_recommendation_prompt(prompt)
        print(f"大模型返回数据: {recommended_hotel_data}")
        
        # 3. 处理酒店推荐数据
        print("正在处理酒店推荐数据...")
        detail_data = process_hotel_recommendations(recommended_hotel_data)
        print(f"最终返回数据数量: {len(detail_data)}")
        
        print("=== 接口测试完成 ===")
        return detail_data
        
    except Exception as e:
        print(f"接口调用失败: {e}")
        raise e

@test_app.get("/")
async def root():
    """根路径，返回应用信息"""
    return {
        "message": "Hotel Recommended Test API 正在运行",
        "version": "1.0.0",
        "available_endpoints": [
            "POST /test/hotelRecommended - 测试酒店推荐接口"
        ]
    }

@test_app.get("/health")
async def health_check():
    """健康检查接口"""
    return {"status": "healthy"}

@test_app.get("/example")
async def get_example_request():
    """获取示例请求数据"""
    # 创建示例POI信息
    spot_info = [
        POIInfo(name="兵马俑博物馆", id="poi_001", address="西安市临潼区"),
        POIInfo(name="大雁塔", id="poi_002", address="西安市雁塔区"),
        POIInfo(name="回民街", id="poi_003", address="西安市莲湖区")
    ]
    
    # 创建示例请求
    example_request = CreateHotelRequest(
        hotel_budget=Budget(min=200, max=500),
        hotel_level="经济型",
        arr_date=date(2025, 12, 3),
        return_date=date(2025, 12, 8),
        travellers_count=TravellerCount(
            travellers={
                TravellerType.ADULT: 2,
                TravellerType.CHILD: 1
            }
        ),
        spot_info=spot_info,
        other_requirement="需要家庭房，最好有儿童游乐设施，离地铁站近一些"
    )
    
    return {
        "example_request": example_request.dict(),
        "usage": "将此数据作为POST请求体发送到 /test/hotelRecommended 端点"
    }

if __name__ == "__main__":
    print("启动独立的酒店推荐测试应用...")
    print(f"项目根目录: {project_root}")
    print("应用将在 http://localhost:8002 上运行")
    print("访问 http://localhost:8002 查看可用接口")
    print("访问 http://localhost:8002/example 获取示例请求数据")
    
    # 运行应用
    uvicorn.run(
        "hotel_recommended_test_app:test_app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
