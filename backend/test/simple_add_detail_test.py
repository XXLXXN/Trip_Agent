#!/usr/bin/env python3
"""
简单测试 add_detail_info 函数
直接运行修改后的批量处理功能
"""

import sys
import os
import time

# 添加项目根目录到Python路径（当前工作目录）
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)

# 添加backend目录到Python路径
backend_dir = os.path.join(project_root, 'backend')
sys.path.insert(0, backend_dir)

# 现在可以直接从tools和DataDefinition包中导入
from tools.map_tools import add_detail_info
from DataDefinition.DataDefinition import SpotNameAndRecReason

def test_add_detail_function():
    """直接测试 add_detail_info 函数"""
    
    print("开始测试 add_detail_info 函数")
    print("=" * 60)
    
    # 使用测试文件中找到的真实POI ID
    test_spots = [
        SpotNameAndRecReason(
            SpotName="故宫博物院",
            RecReason="中国最大的古代文化艺术博物馆",
            POIId="B000A7BM4H",  # 故宫的真实POI ID
            description=""
        ),
        SpotNameAndRecReason(
            SpotName="天安门广场",
            RecReason="世界上最大的城市广场",
            POIId="B0FFKEPXS2",  # 天安门的真实POI ID
            description=""
        )
    ]
    
    print(f"测试数据: {len(test_spots)} 个景点")
    print(f"POI IDs: {[spot.POIId for spot in test_spots]}")
    print()
    
    start_time = time.time()
    
    try:
        # 直接调用修改后的 add_detail_info 函数
        result = add_detail_info(test_spots)
        end_time = time.time()
        
        print(f"函数执行完成! 耗时: {end_time - start_time:.2f}秒")
        print(f"返回结果数量: {len(result)}")
        print()
        
        print("详细结果:")
        print("-" * 40)
        
        for i, spot in enumerate(result):
            print(f"{i+1}. {spot.SpotName}")
            print(f"   POI ID: {spot.POIId}")
            print(f"   地址: {spot.address if spot.address else '未获取到地址'}")
            print(f"   评分: {spot.rating if spot.rating else '无评分'}")
            print(f"   图片数量: {len(spot.photos) if spot.photos else 0}")
            print()
            
    except Exception as e:
        print(f"函数执行失败: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_add_detail_function()
