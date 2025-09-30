#!/usr/bin/env python3
"""
测试调试输出功能
"""

import sys
import os
import json

# 添加项目根目录到路径
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)

from backend.tools.map_tools import add_detail_info
from backend.DataDefinition.DataDefinition import SpotNameAndRecReason

def test_debug_output():
    """测试调试输出功能"""
    print("=== 测试调试输出功能 ===")
    
    # 创建测试数据
    test_spots = [
        SpotNameAndRecReason(
            SpotName="测试景点1",
            RecReason="测试推荐理由1",
            POIId="B00156F0Y8",
            description="测试描述1"
        ),
        SpotNameAndRecReason(
            SpotName="测试景点2", 
            RecReason="测试推荐理由2",
            POIId="B00155G0Y8",
            description="测试描述2"
        )
    ]
    
    print(f"测试景点数量: {len(test_spots)}")
    
    # 调用函数
    result = add_detail_info(test_spots)
    
    print(f"\n=== 测试结果 ===")
    print(f"返回结果数量: {len(result)}")
    
    # 详细输出每个景点的信息
    for i, spot in enumerate(result):
        print(f"\n{i+1}. {spot.SpotName}")
        print(f"   POI ID: {spot.POIId}")
        print(f"   推荐理由: {spot.RecReason}")
        print(f"   描述: {spot.description}")
        print(f"   地址: {spot.address}")
        print(f"   评分: {spot.rating}")
        print(f"   图片数量: {len(spot.photos) if spot.photos else 0}")
        if spot.photos:
            for j, photo in enumerate(spot.photos[:3]):
                print(f"     图片 {j+1}: {photo.get('title', '无标题')}")
                print(f"       URL: {photo.get('url', '无URL')}")

if __name__ == "__main__":
    test_debug_output()
