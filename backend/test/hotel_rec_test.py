import sys
import os
import json
from pathlib import Path

# 添加项目根目录到Python路径（正确的路径计算）
current_file_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(os.path.dirname(current_file_dir))
sys.path.insert(0, project_root)

from backend.tools.hotel_tools import process_hotel_recommendations
from backend.DataDefinition.DataDefinition import HotelnoPOI

def test_hotel_recommendations():
    """测试酒店推荐数据处理函数（HotelnoPOI版本）"""
    
    # 创建HotelnoPOI对象列表
    test_hotels = [
        HotelnoPOI(
            hotel_name="锦江之星(西安回民街钟楼地铁站店)", 
            rec_reason="地理位置优越，距离回民街仅246米，步行即可到达，且靠近地铁站，交通便利。", 
            description="经济型酒店，提供家庭房，适合家庭入住。"
        ),
        HotelnoPOI(
            hotel_name="莲湖区她他公寓(社会路分店)",
            rec_reason="靠近地铁站，步行即可到达回民街，适合家庭入住。",
            description="公寓式酒店，提供家庭房。"
        ),
        HotelnoPOI(
            hotel_name="西安钟鼓楼壹号公寓酒店(钟楼回民街店)",
            rec_reason="位于市中心，交通便利，适合家庭入住。",
            description="公寓式酒店，提供家庭房。"
        ),
        HotelnoPOI(
            hotel_name="西安宾至酒店公寓(钟鼓楼回民街店)",
            rec_reason="靠近地铁站和回民街，适合家庭入住。",
            description="公寓式酒店，提供家庭房。"
        )
    ]
    
    print("=== 开始测试酒店推荐数据处理（HotelnoPOI版本）===")
    print(f"测试酒店数量: {len(test_hotels)}")
    
    try:
        # 处理酒店推荐数据
        result = process_hotel_recommendations(test_hotels)
        
        print(f"\n=== 处理结果 ===")
        print(f"成功处理 {len(result)} 个酒店")
        
        # 打印每个酒店的详细信息
        for i, hotel in enumerate(result):
            print(f"\n--- 酒店 {i+1} ---")
            print(f"名称: {hotel.SpotName}")
            print(f"推荐理由: {hotel.RecReason}")
            print(f"POI ID: {hotel.POIId}")
            print(f"描述: {hotel.description}")
            print(f"地址: {hotel.address}")
            print(f"评分: {hotel.rating}")
            print(f"图片数量: {len(hotel.photos) if hotel.photos else 0}")
        
        print(f"\n=== 测试完成 ===")
        
        return result
        
    except Exception as e:
        print(f"测试过程中出现错误: {e}")
        import traceback
        traceback.print_exc()
        return None

if __name__ == "__main__":
    test_hotel_recommendations()
