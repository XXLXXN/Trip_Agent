import sys
import os
# 添加项目根目录到Python路径（正确的路径计算）
current_file_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(os.path.dirname(current_file_dir))
sys.path.insert(0, project_root)

from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
from typing import List, Dict, Optional
from datetime import date

from backend.DataDefinition.DataDefinition import TravellerCount, Budget, CreateHotelRequest, POIInfo

# 定义响应模型
class HotelRecommendation(BaseModel):
    SpotName: str
    RecReason: str
    POIId: str
    description: str
    address: str
    photos: Optional[List[Dict]] = None
    rating: Optional[str] = None
    cost: Optional[float] = None

class HotelRecommendationResponse(BaseModel):
    recommendations: List[HotelRecommendation]

# FastAPI 应用实例
app = FastAPI()

# 示例数据 - 基于之前的测试数据
SAMPLE_HOTEL_RECOMMENDATIONS = [
    {
        "SpotName": "锦江之星(西安回民街钟楼地铁站店)",
        "RecReason": "地理位置优越，距离回民街仅246米，步行即可到达，且靠近地铁站，交通便利。",
        "POIId": "B0FFFVBUVM",
        "description": "经济型酒店，提供家庭房，适合家庭入住。",
        "address": "东大街骡马市商业步行街26号(兴正元广场正对面)",
        "photos": [
            {
                "url": "http://store.is.autonavi.com/showpic/b2beb67677f0b8e6915d39e7498418a2",
                "title": "酒店外观"
            },
            {
                "url": "https://aos-comment.amap.com/B0FFFVBUVM/comment/557c3972457a6eb101dffdc32b2a731c_2048_2048_80.jpg",
                "title": ""
            },
            {
                "url": "http://store.is.autonavi.com/showpic/65468e765c306dcfcb632682f56fbc2e",
                "title": "风雅商务房"
            }
        ],
        "rating": "4.7",
        "cost": None
    },
    {
        "SpotName": "莲湖区她他公寓(社会路分店)",
        "RecReason": "靠近地铁站，步行即可到达回民街，适合家庭入住。",
        "POIId": "B001D14BBZ",
        "description": "公寓式酒店，提供家庭房。",
        "address": "北大街1号宏府嘉会公寓A座8021室",
        "photos": [
            {
                "url": "http://store.is.autonavi.com/showpic/9353eb33bfd32f26860e6c167a7ab420",
                "title": ""
            },
            {
                "url": "http://store.is.autonavi.com/showpic/fe7f1e3418f241a725be7a607adebdc6",
                "title": ""
            },
            {
                "url": "http://store.is.autonavi.com/showpic/7ddddb22e8cebf4b2f5c63898239682e",
                "title": "外观"
            }
        ],
        "rating": "4.7",
        "cost": None
    },
    {
        "SpotName": "西安钟鼓楼壹号公寓酒店(钟楼回民街店)",
        "RecReason": "位于市中心，交通便利，适合家庭入住。",
        "POIId": "B0ID6H10OI",
        "description": "公寓式酒店，提供家庭房。",
        "address": "宏府嘉会广场B座11楼11035室(钟楼地铁站A口旁)",
        "photos": [
            {
                "url": "http://store.is.autonavi.com/showpic/1e4161cfbbb35b14449908d45ad78dab",
                "title": "Logo"
            },
            {
                "url": "http://store.is.autonavi.com/showpic/d10262b50ac93768ed6c166376a4c494",
                "title": "客房"
            },
            {
                "url": "https://store.is.autonavi.com/showpic/2a655e0213e03060612ac13fb46ba042",
                "title": ""
            }
        ],
        "rating": "4.2",
        "cost": None
    },
    {
        "SpotName": "西安宾至酒店公寓(钟鼓楼回民街店)",
        "RecReason": "靠近地铁站和回民街，适合家庭入住。",
        "POIId": "B0KDPX7WEI",
        "description": "公寓式酒店，提供家庭房。",
        "address": "西华门十字北大街宏府嘉会公寓A座5楼5054室",
        "photos": [
            {
                "url": "http://store.is.autonavi.com/showpic/151d2a8667cb09bb243d247887ba12bb",
                "title": "Logo"
            },
            {
                "url": "http://store.is.autonavi.com/showpic/bd22c238c93b147eea6f73266eb86e3a",
                "title": "Logo"
            },
            {
                "url": "https://store.is.autonavi.com/showpic/b2863ff3af23c954a88932acb0cfced2",
                "title": "客房"
            }
        ],
        "rating": "3.5",
        "cost": None
    }
]

# API 端点
@app.get("/api/hotel-recommendation")
async def get_hotel_recommendations():
    """
    返回酒店推荐数据
    """
    return SAMPLE_HOTEL_RECOMMENDATIONS
   

@app.post("/api/hotel-recommendation")
async def post_hotel_recommendations(request: CreateHotelRequest):
    """
    基于酒店搜索参数返回酒店推荐数据
    """
    # 打印接收到的请求数据以便调试
    print("Received hotel recommendation request:")
    print(f"Hotel Budget: {request.hotel_budget}")
    print(f"Hotel Level: {request.hotel_level}")
    print(f"Arrival Date: {request.arr_date}")
    print(f"Return Date: {request.return_date}")
    print(f"Travellers: {request.travellers_count.travellers}")
    print(f"Spot Info: {request.spot_info}")
    print(f"Other Requirements: {request.other_requirement}")
    
    # 这里可以根据请求参数进行智能推荐
    # 目前暂时返回示例数据
    return SAMPLE_HOTEL_RECOMMENDATIONS


# 健康检查端点
@app.get("/")
async def root():
    return {"message": "Hotel Recommendation API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    print("Starting Hotel Recommendation FastAPI server...")
    print("GET endpoint: http://127.0.0.1:8001/api/hotel-recommendation")
    print("POST endpoint: http://127.0.0.1:8001/api/hotel-recommendation")
    print("Health check: http://127.0.0.1:8001/health")
    uvicorn.run(app, host="127.0.0.1", port=8001)
