#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
北京文艺两日游测试用例：为data.json添加交通信息
"""

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from tools.connect_location import connect_location
from DataDefinition.DataDefinition import Trip, Day, Activity, POIDetailInfo, POIDetailInfo, POIDetailInfo, POIDetailInfo, POIDetailInfo, POIDetailInfo, POIDetailInfo, POIDetailInfo, POIDetailInfo, POIDetailInfo, POIDetailInfo
from datetime import date, time
import json

def create_beijing_wenyi_trip():
    """创建北京文艺两日游测试行程"""
    print("=" * 80)
    print("🧪 创建北京文艺两日游测试用例")
    print("=" * 80)
    
    # 创建Trip对象
    trip = Trip(
        user_id="test_user_beijing_001",
        trip_id="beijing_wenyi_trip_001",
        trip_name="北京文艺两日游",
        origin="上海",
        destination="北京",
        start_date=date(2025, 3, 15),
        end_date=date(2025, 3, 16),
        days=[]
    )
    
    # Day 1: 北京首都机场 → 798艺术区 → 南锣鼓巷 → 什刹海 → 止观小馆 → 锦江之星酒店
    day1 = Day(
        date=date(2025, 3, 15),
        day_of_week="星期六",
        day_index=1,
        total_cost=0.0,
        activities=[
            Activity(
                id="activity_1",
                start_time=time(10, 30, 0),
                end_time=time(11, 0, 0),
                poi_details=POIDetailInfo(
                    name="北京首都国际机场",
                    rec_reason="到达北京的第一站，办理入境手续",
                    POIId="airport_pek_001",
                    description="到达北京首都机场，办理入境手续",
                    address="北京市顺义区首都机场路",
                    poi_type="spot"
                )
            ),
            Activity(
                id="activity_2",
                start_time=time(12, 0, 0),
                end_time=time(14, 0, 0),
                poi_details=POIDetailInfo(
                    name="798艺术区",
                    rec_reason="798艺术区是北京著名的文艺街区，汇集了众多画廊、艺术工作室和创意店铺，非常适合文艺爱好者。",
                    POIId="B000A81FY5",
                    description="游览798艺术区，感受文艺氛围",
                    address="酒仙桥路4号",
                    photos=[
                        {"url": "http://store.is.autonavi.com/showpic/42a5f4dfacfbf2d38d20905cdc15f5ff", "title": ""},
                        {"url": "http://store.is.autonavi.com/showpic/ee391e3f551fdd027e641c5c040e30bc", "title": ""},
                        {"url": "http://store.is.autonavi.com/showpic/8a076e086d57c7e50f5d46477083b649", "title": ""}
                    ],
                    rating="4.8",
                    poi_type="spot"
                )
            ),
            Activity(
                id="activity_3",
                start_time=time(14, 30, 0),
                end_time=time(16, 30, 0),
                poi_details=POIDetailInfo(
                    name="南锣鼓巷",
                    rec_reason="南锣鼓巷是北京最具文艺气息的胡同之一，街道两旁有许多特色小店和美食，适合漫步和品尝地道小吃。",
                    POIId="B0FFFAH7I9",
                    description="漫步南锣鼓巷，体验胡同文化",
                    address="交道口街道南大街(南锣鼓巷地铁站E西北口旁)",
                    photos=[
                        {"url": "http://store.is.autonavi.com/showpic/6aa94c24640267a56c22af0b9629030a", "title": ""},
                        {"url": "http://store.is.autonavi.com/showpic/f2325d7c11c9453d8d7eccc96db7e77c", "title": ""},
                        {"url": "http://store.is.autonavi.com/showpic/173b3acc0bb5c70d3710a43a137c17a7", "title": ""}
                    ],
                    rating="4.8",
                    poi_type="spot"
                )
            ),
            Activity(
                id="activity_4",
                start_time=time(17, 0, 0),
                end_time=time(19, 0, 0),
                poi_details=POIDetailInfo(
                    name="什刹海",
                    rec_reason="什刹海是北京的著名风景区，周边有许多文艺酒吧和特色餐厅，适合夜晚漫步和享受美食。",
                    POIId="B000A7O5PK",
                    description="游览什刹海，欣赏夜景",
                    address="地安门西大街49号",
                    photos=[
                        {"url": "http://store.is.autonavi.com/showpic/dd97c0390e296f47a20b72063ec86990", "title": ""},
                        {"url": "http://store.is.autonavi.com/showpic/a996834a98e84fd852162b2551c374f0", "title": ""},
                        {"url": "https://aos-comment.amap.com/B000A7O5PK/comment/content_media_external_file_5734_1759220682721_18610854.jpg", "title": ""}
                    ],
                    rating="4.9",
                    poi_type="spot"
                )
            ),
            Activity(
                id="activity_5",
                start_time=time(19, 30, 0),
                end_time=time(20, 30, 0),
                poi_details=POIDetailInfo(
                    name="止观小馆",
                    rec_reason="这家餐厅融合了传统与现代的文艺风格，菜品精致且环境优雅，适合文艺爱好者。",
                    POIId="B0FFGWGO81",
                    description="在止观小馆享用晚餐",
                    address="金鱼胡同12号(金鱼胡同地铁站B东口步行280米)",
                    photos=[
                        {"url": "https://aos-comment.amap.com/B0FFGWGO81/comment/87182bec6a346bdbdece8ec78cacbba1_2048_2048_80.jpg", "title": ""},
                        {"url": "https://aos-comment.amap.com/B0FFGWGO81/comment/content_media_external_file_2832_1752932450345_57025635.jpg", "title": ""},
                        {"url": "https://aos-comment.amap.com/B0FFGWGO81/comment/content_media_external_file_125970_ss__1753419699316_00687879.jpg", "title": ""}
                    ],
                    rating="4.6",
                    poi_type="spot"
                )
            ),
            Activity(
                id="activity_6",
                start_time=time(21, 0, 0),
                end_time=time(22, 0, 0),
                poi_details=POIDetailInfo(
                    name="锦江之星(北京回民街钟楼地铁站店)",
                    rec_reason="地理位置优越，交通便利，舒适住宿环境",
                    POIId="B0FFFVBUVM",
                    description="入住锦江之星酒店",
                    address="东大街骡马市商业步行街26号(兴正元广场正对面)",
                    photos=[
                        {"url": "http://store.is.autonavi.com/showpic/b2beb67677f0b8e6915d39e7498418a2", "title": "酒店外观"},
                        {"url": "https://aos-comment.amap.com/B0FFFVBUVM/comment/557c3972457a6eb101dffdc32b2a731c_2048_2048_80.jpg", "title": ""},
                        {"url": "http://store.is.autonavi.com/showpic/65468e765c306dcfcb632682f56fbc2e", "title": "风雅商务房"}
                    ],
                    rating="4.7",
                    cost=300.0,
                    poi_type="hotel"
                )
            )
        ]
    )
    
    # Day 2: 簋街 → 相遇时光·文艺餐厅 → 很文艺食堂 → 北京首都国际机场
    day2 = Day(
        date=date(2025, 3, 16),
        day_of_week="星期日",
        day_index=2,
        total_cost=0.0,
        activities=[
            Activity(
                id="activity_7",
                start_time=time(9, 0, 0),
                end_time=time(11, 0, 0),
                poi_details=POIDetailInfo(
                    name="簋街",
                    rec_reason="簋街是北京著名的美食街，汇集了各种地道的中式美食，尤其是麻辣小龙虾和火锅，非常适合美食爱好者。",
                    POIId="B0FFHF130I",
                    description="游览簋街，品尝美食",
                    address="东直门大街5-11号",
                    photos=[
                        {"url": "https://aos-comment.amap.com/B0FFHF130I/comment/bc8f5cc556907b887a8470ca7181a9ce_2048_2048_80.jpg", "title": ""},
                        {"url": "https://aos-comment.amap.com/B0FFHF130I/comment/6c95100d15a81296c8e661ef33990d06_2048_2048_80.jpg", "title": ""},
                        {"url": "https://aos-comment.amap.com/B0FFHF130I/comment/d5685f1564da211696b715f38f985ebe_2048_2048_80.jpg", "title": ""}
                    ],
                    rating="4.8",
                    poi_type="spot"
                )
            ),
            Activity(
                id="activity_8",
                start_time=time(12, 0, 0),
                end_time=time(13, 30, 0),
                poi_details=POIDetailInfo(
                    name="相遇时光·文艺餐厅",
                    rec_reason="这家餐厅位于宋庄艺术区，环境文艺且菜品精致，适合文艺风格的用餐体验。",
                    POIId="B0FFLMYPFF",
                    description="在相遇时光·文艺餐厅享用午餐",
                    address="宋庄镇大巢艺术区北门135号",
                    photos=[
                        {"url": "https://aos-comment.amap.com/B0FFLMYPFF/headerImg/31465374dfe52e301990410a54cb38e8_2048_2048_80.jpg", "title": ""},
                        {"url": "https://aos-comment.amap.com/B0FFLMYPFF/headerImg/d08a6c5e9ad0eb8ae42208cff8761f89_2048_2048_80.jpg", "title": ""},
                        {"url": "https://aos-comment.amap.com/B0FFLMYPFF/headerImg/145e2bb25df2bd6c3107c11674a404dc_2048_2048_80.jpg", "title": ""}
                    ],
                    rating="4.3",
                    poi_type="spot"
                )
            ),
            Activity(
                id="activity_9",
                start_time=time(14, 0, 0),
                end_time=time(15, 30, 0),
                poi_details=POIDetailInfo(
                    name="很文艺食堂",
                    rec_reason="这家餐厅以其独特的文艺氛围和精致菜品著称，适合文艺风格的用餐体验。",
                    POIId="B0I1R6UJ9L",
                    description="前往很文艺食堂体验",
                    address="7克拉北门东110米",
                    photos=[
                        {"url": "https://aos-comment.amap.com/B0I1R6UJ9L/comment/f61e84e2c07bba62953c55e00ca9fc30_2048_2048_80.jpg", "title": ""},
                        {"url": "https://aos-comment.amap.com/B0I1R6UJ9L/comment/78ef96dc7e61178efa433b6d5f938f8d_2048_2048_80.jpg", "title": ""},
                        {"url": "http://store.is.autonavi.com/showpic/996d90f31d5b3954ff82c8d6ba7aedef", "title": ""}
                    ],
                    rating="4.1",
                    poi_type="spot"
                )
            ),
            Activity(
                id="activity_10",
                start_time=time(17, 0, 0),
                end_time=time(17, 30, 0),
                poi_details=POIDetailInfo(
                    name="北京首都国际机场",
                    rec_reason="返程出发地，办理登机手续",
                    POIId="airport_pek_002",
                    description="办理登机手续，准备返程",
                    address="北京市顺义区首都机场路",
                    poi_type="spot"
                )
            )
        ]
    )
    
    # 添加天数到行程
    trip.days = [day1, day2]
    
    print("✅ 北京文艺两日游行程创建成功！")
    print(f"行程名称: {trip.trip_name}")
    print(f"目的地: {trip.destination}")
    print(f"行程天数: {len(trip.days)}")
    
    # 显示行程概览
    for i, day in enumerate(trip.days, 1):
        print(f"\n第{i}天 ({day.date}):")
        for j, activity in enumerate(day.activities, 1):
            # 确保 activity 是 Activity 类型
            if isinstance(activity, Activity):
                print(f"  {j}. {activity.poi_details.description} ({activity.start_time}-{activity.end_time})")
                print(f"     地点: {activity.poi_details.name}")
                print(f"     地址: {activity.poi_details.address}")
    
    return trip

def test_beijing_trip_connect():
    """测试北京文艺两日游的connect_location功能"""
    print("\n" + "=" * 80)
    print("🚀 开始执行connect_location函数 - 北京文艺两日游")
    print("=" * 80)
    
    # 创建行程
    trip = create_beijing_wenyi_trip()
    
    # 立即保存原始trip到beijing_trip_original.json（在connect_location之前）
    try:
        trip_json = trip.model_dump(mode='json')
        with open("beijing_trip_original.json", 'w', encoding='utf-8') as f:
            json.dump(trip_json, f, ensure_ascii=False, indent=2)
        print("✅ 原始北京行程（添加交通信息前）已保存到: beijing_trip_original.json")
    except Exception as e:
        print(f"❌ 原始trip保存失败: {e}")
    
    # 执行connect_location（传入副本，避免修改原始数据）
    print("\n正在连接地点，添加交通信息...")
    import copy
    trip_copy = copy.deepcopy(trip)
    result_trip = connect_location(trip_copy)
    
    if result_trip:
        print("✅ connect_location执行成功！")
        
        # 分析结果
        total_activities = sum(len(day.activities) for day in result_trip.days)
        transportation_count = sum(1 for day in result_trip.days 
                                 for activity in day.activities 
                                 if hasattr(activity, 'mode') and activity.mode)
        
        print(f"\n📊 结果统计:")
        print(f"总活动数: {total_activities}")
        print(f"交通项目数: {transportation_count}")
        
        # 保存JSON结果
        output_file = "beijing_trip_output.json"
        beijing_trip_file = "beijing_trip.json"
        
        try:
            # 使用model_dump(mode='json')来正确处理date对象
            trip_json = result_trip.model_dump(mode='json')
            
            # 保存到beijing_trip_output.json（原始输出文件）
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(trip_json, f, ensure_ascii=False, indent=2)
            
            print(f"✅ JSON结果已保存到: {output_file}")
            
            # 保存到beijing_trip.json（北京行程文件）
            with open(beijing_trip_file, 'w', encoding='utf-8') as f:
                json.dump(trip_json, f, ensure_ascii=False, indent=2)
            
            print(f"✅ 北京行程已保存到: {beijing_trip_file}")
            
            # 显示JSON结构预览
            print(f"\n📋 JSON结构预览 (前2000字符):")
            print("-" * 60)
            json_str = json.dumps(trip_json, ensure_ascii=False, indent=2)
            print(json_str[:2000])
            if len(json_str) > 2000:
                print(f"\n... (完整内容请查看文件: {output_file} 或 {beijing_trip_file})")
            
        except Exception as e:
            print(f"❌ JSON保存失败: {e}")
    
    else:
        print("❌ connect_location执行失败！")
    
    print("\n" + "=" * 80)
    print("测试完成！")
    print("=" * 80)

if __name__ == "__main__":
    test_beijing_trip_connect()
