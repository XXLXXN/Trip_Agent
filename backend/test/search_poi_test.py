#!/usr/bin/env python3
"""
测试 search_and_add_poi 函数
"""

import sys
import os
from pathlib import Path

# 添加项目根目录到路径
current_dir = Path(__file__).parent
backend_dir = current_dir.parent
project_root = backend_dir.parent
sys.path.insert(0, str(project_root))

from backend.tools.map_tools import search_and_add_poi
from backend.DataDefinition.DataDefinition import SpotnoPOI

def test_search_poi():
    """测试搜索POI ID功能"""
    
    # 创建测试数据
    test_spots = [
        SpotnoPOI(
            SpotName="故宫博物院",
            RecReason="中国最大的古代文化艺术博物馆",
            description="位于北京市中心，是中国明清两代的皇家宫殿"
        ),
        SpotnoPOI(
            SpotName="颐和园", 
            RecReason="中国现存最完整的皇家园林",
            description="位于北京西郊，是以昆明湖、万寿山为基址的大型山水园林"
        ),
        SpotnoPOI(
            SpotName="长城",
            RecReason="世界文化遗产，中国古代的伟大工程",
            description="中国古代的军事防御工程，是世界七大奇迹之一"
        )
    ]
    
    print("=== 开始测试 search_and_add_poi 函数 ===")
    
    # 测试搜索（指定城市北京）
    result = search_and_add_poi(test_spots, city="北京")
    
    print(f"\n=== 测试结果 ===")
    print(f"输入景点数量: {len(test_spots)}")
    print(f"输出结果数量: {len(result)}")
    
    for i, spot in enumerate(result):
        print(f"\n景点 {i + 1}:")
        print(f"  名称: {spot.SpotName}")
        print(f"  推荐理由: {spot.RecReason}")
        print(f"  POI ID: {spot.POIId}")
        print(f"  描述: {spot.description}")
    
    # 检查是否有成功的POI ID
    successful_searches = [spot for spot in result if spot.POIId]
    print(f"\n成功找到POI ID的景点数量: {len(successful_searches)}")
    
    return result

if __name__ == "__main__":
    test_search_poi()
