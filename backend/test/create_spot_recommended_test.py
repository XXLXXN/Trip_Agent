#!/usr/bin/env python3
"""
create_spot_recommended 接口测试文件
测试 /create/spotsRecommended 接口功能
"""

import sys
import os
import asyncio
from datetime import date
from typing import List

# 添加项目根目录到路径
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, project_root)

# 直接导入模块
from backend.DataDefinition.DataDefinition import (
    CreateSpotsRequest, TravellerCount, TravellerType, Budget, SpotDetailInfo, SpotNameAndRecReason
)
from backend.services.prompt_builder import build_create_spot_prompt
from backend.tools.map_tools import add_detail_info

# 延迟导入 Data_Flow，因为它可能依赖其他服务
def get_create_spot_recommended_function():
    """延迟导入create_spot_recommended函数"""
    from backend.Data_Flow import create_spot_recommended
    return create_spot_recommended


def test_build_create_spot_prompt():
    """测试 prompt 构建功能"""
    print("1. 测试 build_create_spot_prompt 函数:")
    print("-" * 50)
    
    # 使用示例数据创建请求
    request = CreateSpotsRequest(
        departure_city="上海",
        destination_city="北京",
        departure_date=date(2025, 8, 24),
        return_date=date(2025, 9, 15),
        travellers_count=TravellerCount(
            travellers={
                TravellerType.ADULT: 2,
                TravellerType.CHILD: 1
            }
        ),
        budget=Budget(min=200, max=30000),
        trip_style="文艺,美食",
        other_requirement="希望酒店有游泳池，景点不要太拥挤"
    )
    
    prompt = build_create_spot_prompt(request)
    print("生成的Prompt:")
    print(prompt)
    print(f"Prompt长度: {len(prompt)} 字符")
    print("✓ Prompt构建测试完成\n")


def test_add_detail_info():
    """测试 add_detail_info 函数"""
    print("2. 测试 add_detail_info 函数:")
    print("-" * 50)
    
    # 创建模拟的景点推荐数据
    test_spots = [
        SpotNameAndRecReason(
            SpotName="故宫博物院",
            RecReason="世界文化遗产，中国最大的古代文化艺术博物馆",
            POIId="B000A7BM4H",
            description="明清两代的皇家宫殿"
        ),
        SpotNameAndRecReason(
            SpotName="天安门广场",
            RecReason="世界上最大的城市广场",
            POIId="B0FFKEPXS2", 
            description="中国的象征之一"
        )
    ]
    
    result = add_detail_info(test_spots)
    print(f"处理了 {len(test_spots)} 个景点，返回 {len(result)} 个结果")
    
    for i, spot in enumerate(result):
        print(f"结果 {i+1}:")
        print(f"  名称: {spot.SpotName}")
        print(f"  推荐理由: {spot.RecReason}")
        print(f"  POI ID: {spot.POIId}")
        print(f"  地址: {spot.address}")
        print(f"  评分: {spot.rating}")
        print()
    
    print("✓ add_detail_info 测试完成\n")


async def test_create_spot_recommended():
    """测试完整的 create_spot_recommended 接口"""
    print("3. 测试 create_spot_recommended 接口:")
    print("-" * 50)
    
    # 创建测试请求数据
    request = CreateSpotsRequest(
        departure_city="上海",
        destination_city="北京",
        departure_date=date(2025, 8, 24),
        return_date=date(2025, 9, 15),
        travellers_count=TravellerCount(
            travellers={
                TravellerType.ADULT: 2,
                TravellerType.CHILD: 1
            }
        ),
        budget=Budget(min=200, max=30000),
        trip_style="文艺,美食",
        other_requirement="希望酒店有游泳池，景点不要太拥挤"
    )
    
    print("请求数据:")
    print(f"  出发城市: {request.departure_city}")
    print(f"  目的地城市: {request.destination_city}")
    print(f"  出发日期: {request.departure_date}")
    print(f"  返回日期: {request.return_date}")
    print(f"  旅行人数: {request.travellers_count.travellers}")
    print(f"  预算范围: {request.budget.min} - {request.budget.max}")
    print(f"  旅行风格: {request.trip_style}")
    print(f"  其他要求: {request.other_requirement}")
    print()
    
    try:
        # 延迟导入接口函数
        create_spot_recommended_func = get_create_spot_recommended_function()
        
        # 调用接口函数
        result = await create_spot_recommended_func(request)
        print("接口调用成功!")
        print(f"返回数据类型: {type(result)}")
        
        if isinstance(result, list):
            print(f"返回结果数量: {len(result)}")
            for i, item in enumerate(result):
                print(f"  景点 {i+1}: {item.SpotName}")
        else:
            print("返回单个结果")
            print(f"景点名称: {result.SpotName}")
            
    except Exception as e:
        print(f"接口调用失败: {e}")
        print("这可能是由于缺少依赖服务（如Redis、大模型API等）")
    
    print("✓ 接口测试完成\n")


def test_example_data():
    """测试示例数据格式"""
    print("4. 测试示例数据格式:")
    print("-" * 50)
    
    # 导入示例数据
    from backend.test.example_request_data import BACKEND_REQUEST_EXAMPLE
    
    print("示例后端数据:")
    print(BACKEND_REQUEST_EXAMPLE)
    print()
    
    # 将示例数据转换为 CreateSpotsRequest 对象
    try:
        # 解析日期字符串
        departure_date = date.fromisoformat(BACKEND_REQUEST_EXAMPLE["departure_date"])
        return_date = date.fromisoformat(BACKEND_REQUEST_EXAMPLE["return_date"])
        
        # 创建请求对象
        request = CreateSpotsRequest(
            departure_city=BACKEND_REQUEST_EXAMPLE["departure_city"],
            destination_city=BACKEND_REQUEST_EXAMPLE["destination_city"],
            departure_date=departure_date,
            return_date=return_date,
            travellers_count=TravellerCount(
                travellers=BACKEND_REQUEST_EXAMPLE["travellers_count"]["travellers"]
            ),
            budget=Budget(
                min=BACKEND_REQUEST_EXAMPLE["budget"]["min"],
                max=BACKEND_REQUEST_EXAMPLE["budget"]["max"]
            ),
            trip_style=BACKEND_REQUEST_EXAMPLE["trip_style"],
            other_requirement=BACKEND_REQUEST_EXAMPLE["other_requirement"]
        )
        
        print("成功创建 CreateSpotsRequest 对象")
        print(f"对象类型: {type(request)}")
        print("✓ 示例数据格式测试完成")
        
    except Exception as e:
        print(f"创建请求对象失败: {e}")
        print("✗ 示例数据格式测试失败")


async def main():
    """主测试函数"""
    print("=" * 60)
    print("create_spot_recommended 接口测试")
    print("=" * 60)
    print()
    
    # 运行各个测试
    test_build_create_spot_prompt()
    test_add_detail_info()
    await test_create_spot_recommended()
    test_example_data()
    
    print("=" * 60)
    print("所有测试完成!")
    print("=" * 60)


if __name__ == "__main__":
    # 运行异步测试
    asyncio.run(main())
