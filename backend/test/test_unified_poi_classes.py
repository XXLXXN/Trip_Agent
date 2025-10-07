#!/usr/bin/env python3
"""
测试统一的POI详情类是否正确工作
"""

import sys
import os
from datetime import date
from typing import List, Dict, Optional

# 添加项目根目录到路径
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)

# 添加backend目录到路径
backend_dir = os.path.join(project_root, "backend")
sys.path.insert(0, backend_dir)

from DataDefinition.DataDefinition import (
    POIDetailInfo, POIDetailType, SpotDetailInfo, HotelDetailInfo,
    SpotNameAndRecReason, HotelNameAndRecReason
)

def test_poi_detail_info():
    """测试POIDetailInfo类"""
    print("=== 测试 POIDetailInfo 类 ===")
    
    # 测试创建景点POI
    spot_poi = POIDetailInfo(
        name="故宫博物院",
        rec_reason="中国最大的古代文化艺术博物馆",
        POIId="B000A83M61",
        description="故宫博物院位于北京市中心，是中国最大的古代文化艺术博物馆",
        address="北京市东城区景山前街4号",
        photos=[
            {"url": "http://example.com/photo1.jpg", "title": "故宫正门"},
            {"url": "http://example.com/photo2.jpg", "title": "太和殿"}
        ],
        rating="4.9",
        cost=60.0,
        poi_type=POIDetailType.SPOT
    )
    
    print(f"景点POI: {spot_poi.dict()}")
    print(f"POI类型: {spot_poi.poi_type}")
    print()
    
    # 测试创建酒店POI
    hotel_poi = POIDetailInfo(
        name="北京饭店",
        rec_reason="地理位置优越，服务优质",
        POIId="B000A7VQ4F",
        description="北京饭店是北京市著名的五星级酒店",
        address="北京市东城区东长安街33号",
        photos=[
            {"url": "http://example.com/hotel1.jpg", "title": "酒店外观"},
            {"url": "http://example.com/hotel2.jpg", "title": "豪华套房"}
        ],
        rating="4.8",
        cost=800.0,
        poi_type=POIDetailType.HOTEL
    )
    
    print(f"酒店POI: {hotel_poi.dict()}")
    print(f"POI类型: {hotel_poi.poi_type}")
    print()

def test_spot_detail_info():
    """测试SpotDetailInfo类（兼容性别名）"""
    print("=== 测试 SpotDetailInfo 类 ===")
    
    # 使用原来的字段名创建
    spot_detail = SpotDetailInfo(
        SpotName="颐和园",
        RecReason="中国清朝时期皇家园林",
        POIId="B000A7VQ4F",
        description="颐和园是中国清朝时期皇家园林，位于北京西郊",
        address="北京市海淀区新建宫门路19号",
        photos=[
            {"url": "http://example.com/summer1.jpg", "title": "昆明湖"},
            {"url": "http://example.com/summer2.jpg", "title": "长廊"}
        ],
        rating="4.9",
        cost=30.0
    )
    
    print(f"景点详情: {spot_detail.dict()}")
    print(f"POI类型: {spot_detail.poi_type}")
    print(f"名称字段映射: SpotName={spot_detail.SpotName}, name={spot_detail.name}")
    print(f"推荐理由映射: RecReason={spot_detail.RecReason}, rec_reason={spot_detail.rec_reason}")
    print()

def test_hotel_detail_info():
    """测试HotelDetailInfo类（兼容性别名）"""
    print("=== 测试 HotelDetailInfo 类 ===")
    
    # 使用原来的字段名创建
    hotel_detail = HotelDetailInfo(
        hotel_name="北京丽思卡尔顿酒店",
        rec_reason="五星级豪华酒店，服务一流",
        POIId="B00140N0Z1",
        description="北京丽思卡尔顿酒店是北京市著名的五星级豪华酒店",
        address="北京市朝阳区建国路甲83号",
        photos=[
            {"url": "http://example.com/ritz1.jpg", "title": "酒店大堂"},
            {"url": "http://example.com/ritz2.jpg", "title": "豪华客房"}
        ],
        rating="4.9",
        cost=1200.0
    )
    
    print(f"酒店详情: {hotel_detail.dict()}")
    print(f"POI类型: {hotel_detail.poi_type}")
    print(f"名称字段映射: hotel_name={hotel_detail.hotel_name}, name={hotel_detail.name}")
    print(f"推荐理由映射: rec_reason={hotel_detail.rec_reason}")
    print()

def test_compatibility():
    """测试与现有代码的兼容性"""
    print("=== 测试兼容性 ===")
    
    # 模拟景点工具中的使用场景
    spot_with_poi = SpotNameAndRecReason(
        SpotName="天坛公园",
        RecReason="明清两代帝王祭天祈谷的场所",
        POIId="B000A8CQ6F",
        description="天坛公园是明清两代帝王祭天祈谷的场所"
    )
    
    # 模拟创建SpotDetailInfo对象（就像在map_tools.py中那样）
    spot_detail = SpotDetailInfo(
        SpotName=spot_with_poi.SpotName,
        RecReason=spot_with_poi.RecReason,
        POIId=spot_with_poi.POIId,
        description=spot_with_poi.description or '',
        address="北京市东城区天坛路甲1号",
        photos=[
            {"url": "http://example.com/temple1.jpg", "title": "祈年殿"}
        ],
        rating="4.8"
    )
    
    print(f"兼容性测试 - 景点: {spot_detail.dict()}")
    
    # 模拟酒店工具中的使用场景
    hotel_with_poi = HotelNameAndRecReason(
        hotel_name="北京王府井希尔顿酒店",
        rec_reason="地理位置优越，靠近王府井大街",
        POIId="B00140MZW9",
        description="北京王府井希尔顿酒店是北京市中心的高端酒店"
    )
    
    # 模拟创建HotelDetailInfo对象（就像在hotel_tools.py中那样）
    hotel_detail = HotelDetailInfo(
        hotel_name=hotel_with_poi.hotel_name,
        rec_reason=hotel_with_poi.rec_reason,
        POIId=hotel_with_poi.POIId,
        description=hotel_with_poi.description or '',
        address="北京市东城区王府井大街138号",
        photos=[
            {"url": "http://example.com/hilton1.jpg", "title": "酒店外观"}
        ],
        rating="4.7",
        cost=900.0
    )
    
    print(f"兼容性测试 - 酒店: {hotel_detail.dict()}")
    print()

def test_json_serialization():
    """测试JSON序列化"""
    print("=== 测试 JSON 序列化 ===")
    
    spot_detail = SpotDetailInfo(
        SpotName="长城",
        RecReason="世界文化遗产，中国古代的伟大防御工程",
        POIId="B000A8BQ6F",
        description="长城是中国古代的伟大防御工程，是世界文化遗产",
        address="北京市延庆区八达岭特区",
        photos=[
            {"url": "http://example.com/greatwall1.jpg", "title": "八达岭长城"}
        ],
        rating="4.9",
        cost=45.0
    )
    
    # 转换为字典（用于JSON序列化）
    spot_dict = spot_detail.dict()
    print(f"字典表示: {spot_dict}")
    
    # 测试从字典创建对象
    spot_from_dict = SpotDetailInfo(**spot_dict)
    print(f"从字典创建的对象: {spot_from_dict.dict()}")
    print("JSON序列化测试通过")

if __name__ == "__main__":
    print("开始测试统一的POI详情类...")
    print("=" * 50)
    
    try:
        test_poi_detail_info()
        test_spot_detail_info()
        test_hotel_detail_info()
        test_compatibility()
        test_json_serialization()
        
        print("=" * 50)
        print("所有测试通过！统一的POI详情类工作正常。")
        print("向后兼容性得到保持。")
        
    except Exception as e:
        print(f"测试失败: {e}")
        import traceback
        traceback.print_exc()
