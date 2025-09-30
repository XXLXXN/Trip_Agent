#!/usr/bin/env python3
"""
独立的 FastAPI 应用，专门用于测试 /create/spotsRecommended 接口
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
    CreateSpotsRequest, TravellerCount, TravellerType, Budget, SpotDetailInfo
)
from backend.services.prompt_builder import build_create_spot_prompt
from backend.tools.map_tools import add_detail_info
from backend.services.prompt_sender import send_spot_recommendation_prompt

# 创建独立的测试应用
test_app = FastAPI(
    title="Spot Recommended Test API",
    description="专门用于测试景点推荐接口的独立应用",
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

@test_app.post("/test/spotsRecommended", response_model=List[SpotDetailInfo])
async def test_create_spot_recommended(request: CreateSpotsRequest):
    """
    测试版本的景点推荐接口
    """
    print("=== 开始测试景点推荐接口 ===")
    print(f"请求数据: {request.dict()}")
    
    try:
        # 1. 构建提示词
        prompt = build_create_spot_prompt(request)
        print(f"生成的提示词长度: {len(prompt)} 字符")
        
        # 2. 发送提示词给大模型
        print("正在发送提示词给大模型...")
        recommended_spots_data = await send_spot_recommendation_prompt(prompt)
        print(f"大模型返回数据: {recommended_spots_data}")
        
        # 3. 添加详细信息
        print("正在添加POI详细信息...")
        detail_data = add_detail_info(recommended_spots_data)
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
        "message": "Spot Recommended Test API 正在运行",
        "version": "1.0.0",
        "available_endpoints": [
            "POST /test/spotsRecommended - 测试景点推荐接口"
        ]
    }

@test_app.get("/health")
async def health_check():
    """健康检查接口"""
    return {"status": "healthy"}

if __name__ == "__main__":
    print("启动独立的景点推荐测试应用...")
    print(f"项目根目录: {project_root}")
    print("应用将在 http://localhost:8001 上运行")
    print("访问 http://localhost:8001 查看可用接口")
    
    # 运行应用
    uvicorn.run(
        "spot_recommended_test_app:test_app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info"
    )
