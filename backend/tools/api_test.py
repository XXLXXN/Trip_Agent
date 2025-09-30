#!/usr/bin/env python3
"""
测试高德地图API数据提取功能
使用真实API密钥测试add_detail_info函数
"""

import sys
import os
sys.path.append('.')

from backend.DataDefinition.DataDefinition import SpotNameAndRecReason
from backend.tools.map_tools import add_detail_info, get_poi_detail_by_id

def test_api_extraction():
    """测试API数据提取功能"""
    print("开始测试高德地图API数据提取...")
    print("=" * 60)
    
    # 使用用户提供的POI ID进行测试
    test_poi_ids = ["B000A7BM4H", "B0FFKEPXS2"]
    
    # 测试单个POI详情获取
    print("1. 测试单个POI详情获取:")
    print("-" * 40)
    
    for poi_id in test_poi_ids:
        print(f"测试POI ID: {poi_id}")
        detail = get_poi_detail_by_id(poi_id)
        
        if detail:
            print("✓ API调用成功")
            print(f"  地址: {detail.get('address', 'N/A')}")
            print(f"  评分: {detail.get('rating', 'N/A')}")
            print(f"  图片数量: {len(detail.get('photos', []))}")
            
            # 显示前2张图片信息
            photos = detail.get('photos', [])
            for i, photo in enumerate(photos[:2]):
                print(f"  图片{i+1}: {photo.get('title', '无标题')}")
                print(f"    URL: {photo.get('url', '无URL')}")
        else:
            print("✗ API调用失败")
        print()
    
    # 测试add_detail_info函数
    print("2. 测试add_detail_info函数:")
    print("-" * 40)
    
    # 创建测试数据
    test_spots = [
        SpotNameAndRecReason(
            SpotName="故宫博物院",
            RecReason="世界文化遗产",
            POIId="B000A7BM4H",
            description="明清皇家宫殿"
        ),
        SpotNameAndRecReason(
            SpotName="天安门广场", 
            RecReason="世界最大城市广场",
            POIId="B0FFKEPXS2",
            description="中国象征"
        )
    ]
    
    print(f"处理 {len(test_spots)} 个景点...")
    results = add_detail_info(test_spots)
    
    print(f"成功处理 {len(results)} 个结果")
    print()
    
    for i, result in enumerate(results):
        print(f"结果 {i+1}:")
        print(f"  景点名称: {result.SpotName}")
        print(f"  推荐理由: {result.RecReason}")
        print(f"  POI ID: {result.POIId}")
        print(f"  描述: {result.description}")
        print(f"  地址: {result.address}")
        print(f"  评分: {result.rating}")
        
        if result.photos:
            print(f"  图片数量: {len(result.photos)}")
            for j, photo in enumerate(result.photos[:2]):
                print(f"    图片{j+1}: {photo.get('title', '无标题')}")
        else:
            print("  图片: 无")
        print("-" * 30)
    
    print("测试完成！")

def test_api_response_structure():
    """测试API响应数据结构"""
    print("3. 测试API响应数据结构:")
    print("-" * 40)
    
    import requests
    
    # 直接调用API查看原始响应
    test_poi_id = "B000A7BM4H"
    url = "https://restapi.amap.com/v5/place/detail"
    params = {
        'key': '794ffc804bdb7d0d5e8fa6191f034ad9',
        'id': test_poi_id,
        'show_fields': 'business,photos'
    }
    
    try:
        response = requests.get(url, params=params, timeout=10)
        print(f"API响应状态码: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"API响应状态: {data.get('status')}")
            print(f"返回信息: {data.get('info')}")
            
            if data.get('pois'):
                poi_data = data['pois'][0]
                print(f"POI名称: {poi_data.get('name')}")
                print(f"POI类型: {poi_data.get('type')}")
                print(f"地址: {poi_data.get('address')}")
                print(f"经纬度: {poi_data.get('location')}")
                
                # 检查business字段
                business = poi_data.get('business', {})
                print(f"business字段: {business}")
                print(f"评分: {business.get('rating')}")
                
                # 检查photos字段
                photos = poi_data.get('photos', [])
                print(f"图片数量: {len(photos)}")
                if photos:
                    print("第一张图片信息:")
                    print(f"  标题: {photos[0].get('title')}")
                    print(f"  URL: {photos[0].get('url')}")
            else:
                print("未找到POI数据")
        else:
            print(f"HTTP错误: {response.status_code}")
            
    except Exception as e:
        print(f"API测试错误: {e}")

if __name__ == "__main__":
    test_api_extraction()
    print("\n" + "="*60 + "\n")
    test_api_response_structure()
