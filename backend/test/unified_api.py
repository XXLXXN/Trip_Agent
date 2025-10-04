import sys
import os
# 添加项目根目录到Python路径
current_file_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(os.path.dirname(current_file_dir))  # 获取项目根目录
sys.path.insert(0, project_root)

from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
from typing import List, Dict, Optional
from datetime import date

from backend.DataDefinition.DataDefinition import (
    TravellerCount, 
    Budget, 
    CreateSpotsRequest,
    CreateHotelRequest,
    POIInfo,
    SpotDetailInfo,  # 景点推荐响应模型
    HotelDetailInfo   # 酒店推荐响应模型
)

# 使用DataDefinition中定义的响应模型
class UnifiedResponse(BaseModel):
    spot_recommendations: Optional[List[SpotDetailInfo]] = None
    hotel_recommendations: Optional[List[HotelDetailInfo]] = None
    message: str

# FastAPI 应用实例
app = FastAPI(title="Trip Agent Unified API", version="1.0.0")

# 示例数据 - 景点推荐
SAMPLE_SPOT_RECOMMENDATIONS = [
    {
        "SpotName": "798艺术区",
        "RecReason": "798艺术区是北京著名的文艺街区，汇集了众多画廊、艺术工作室和创意店铺，非常适合文艺爱好者。",
        "POIId": "B000A81FY5",
        "description": "798艺术区位于北京市朝阳区酒仙桥路2号，是一个由旧工厂改造而成的艺术区，汇集了众多画廊、艺术工作室和创意店铺，是文艺爱好者的天堂。",
        "address": "酒仙桥路4号",
        "photos": [
            {
                "url": "http://store.is.autonavi.com/showpic/42a5f4dfacfbf2d38d20905cdc15f5ff",
                "title": ""
            },
            {
                "url": "http://store.is.autonavi.com/showpic/ee391e3f551fdd027e641c5c040e30bc",
                "title": ""
            },
            {
                "url": "http://store.is.autonavi.com/showpic/8a076e086d57c7e50f5d46477083b649",
                "title": ""
            }
        ],
        "rating": "4.8"
    },
    {
        "SpotName": "南锣鼓巷",
        "RecReason": "南锣鼓巷是北京最具文艺气息的胡同之一，街道两旁有许多特色小店和美食，适合漫步和品尝地道小吃。",
        "POIId": "B0FFFAH7I9",
        "description": "南锣鼓巷位于北京市东城区，是北京最具文艺气息的胡同之一，街道两旁有许多特色小店和美食，适合漫步和品尝地道小吃。",
        "address": "交道口街道南大街(南锣鼓巷地铁站E西北口旁)",
        "photos": [
            {
                "url": "http://store.is.autonavi.com/showpic/6aa94c24640267a56c22af0b9629030a",
                "title": ""
            },
            {
                "url": "http://store.is.autonavi.com/showpic/f2325d7c11c9453d8d7eccc96db7e77c",
                "title": ""
            },
            {
                "url": "http://store.is.autonavi.com/showpic/173b3acc0bb5c70d3710a43a137c17a7",
                "title": ""
            }
        ],
        "rating": "4.8"
    },
    {
        "SpotName": "簋街",
        "RecReason": "簋街是北京著名的美食街，汇集了各种地道的中式美食，尤其是麻辣小龙虾和火锅，非常适合美食爱好者。",
        "POIId": "B0FFHF130I",
        "description": "簋街位于北京市东城区东直门内大街，是北京著名的美食街，汇集了各种地道的中式美食，尤其是麻辣小龙虾和火锅，非常适合美食爱好者。",
        "address": "东直门大街5-11号",
        "photos": [
            {
                "url": "https://aos-comment.amap.com/B0FFHF130I/comment/bc8f5cc556907b887a8470ca7181a9ce_2048_2048_80.jpg",
                "title": ""
            },
            {
                "url": "https://aos-comment.amap.com/B0FFHF130I/comment/6c95100d15a81296c8e661ef33990d06_2048_2048_80.jpg",
                "title": ""
            },
            {
                "url": "https://aos-comment.amap.com/B0FFHF130I/comment/d5685f1564da211696b715f38f985ebe_2048_2048_80.jpg",
                "title": ""
            }
        ],
        "rating": "4.8"
    },
    {
        "SpotName": "相遇时光·文艺餐厅",
        "RecReason": "这家餐厅位于宋庄艺术区，环境文艺且菜品精致，适合文艺风格的用餐体验。",
        "POIId": "B0FFLMYPFF",
        "description": "相遇时光·文艺餐厅位于北京市通州区宋庄镇大巢艺术区北门135号，是一家环境文艺、菜品精致的餐厅，适合文艺风格的用餐体验。",
        "address": "宋庄镇大巢艺术区北门135号",
        "photos": [
            {
                "url": "https://aos-comment.amap.com/B0FFLMYPFF/headerImg/31465374dfe52e301990410a54cb38e8_2048_2048_80.jpg",
                "title": ""
            },
            {
                "url": "https://aos-comment.amap.com/B0FFLMYPFF/headerImg/d08a6c5e9ad0eb8ae42208cff8761f89_2048_2048_80.jpg",
                "title": ""
            },
            {
                "url": "https://aos-comment.amap.com/B0FFLMYPFF/headerImg/145e2bb25df2bd6c3107c11674a404dc_2048_2048_80.jpg",
                "title": ""
            }
        ],
        "rating": "4.3"
    },
    {
        "SpotName": "什刹海",
        "RecReason": "什刹海是北京的著名风景区，周边有许多文艺酒吧和特色餐厅，适合夜晚漫步和享受美食。",
        "POIId": "B000A7O5PK",
        "description": "什刹海位于北京市西城区，是北京的著名风景区，周边有许多文艺酒吧和特色餐厅，适合夜晚漫步和享受美食。",
        "address": "地安门西大街49号",
        "photos": [
            {
                "url": "http://store.is.autonavi.com/showpic/dd97c0390e296f47a20b72063ec86990",
                "title": ""
            },
            {
                "url": "http://store.is.autonavi.com/showpic/a996834a98e84fd852162b2551c374f0",
                "title": ""
            },
            {
                "url": "https://aos-comment.amap.com/B000A7O5PK/comment/content_media_external_file_5734_1759220682721_18610854.jpg",
                "title": ""
            }
        ],
        "rating": "4.9"
    },
    {
        "SpotName": "很文艺食堂",
        "RecReason": "这家餐厅以其独特的文艺氛围和精致菜品著称，适合文艺风格的用餐体验。",
        "POIId": "B0I1R6UJ9L",
        "description": "很文艺食堂位于北京市7克拉北门东110米，是一家以文艺氛围和精致菜品著称的餐厅，适合文艺风格的用餐体验。",
        "address": "7克拉北门东110米",
        "photos": [
            {
                "url": "https://aos-comment.amap.com/B0I1R6UJ9L/comment/f61e84e2c07bba62953c55e00ca9fc30_2048_2048_80.jpg",
                "title": ""
            },
            {
                "url": "https://aos-comment.amap.com/B0I1R6UJ9L/comment/78ef96dc7e61178efa433b6d5f938f8d_2048_2048_80.jpg",
                "title": ""
            },
            {
                "url": "http://store.is.autonavi.com/showpic/996d90f31d5b3954ff82c8d6ba7aedef",
                "title": ""
            }
        ],
        "rating": "4.1"
    },
    {
        "SpotName": "止观小馆",
        "RecReason": "这家餐厅融合了传统与现代的文艺风格，菜品精致且环境优雅，适合文艺爱好者。",
        "POIId": "B0FFGWGO81",
        "description": "止观小馆位于北京市金鱼胡同12号，是一家融合传统与现代文艺风格的餐厅，菜品精致且环境优雅，适合文艺爱好者。",
        "address": "金鱼胡同12号(金鱼胡同地铁站B东口步行280米)",
        "photos": [
            {
                "url": "https://aos-comment.amap.com/B0FFGWGO81/comment/87182bec6a346bdbdece8ec78cacbba1_2048_2048_80.jpg",
                "title": ""
            },
            {
                "url": "https://aos-comment.amap.com/B0FFGWGO81/comment/content_media_external_file_2832_1752932450345_57025635.jpg",
                "title": ""
            },
            {
                "url": "https://aos-comment.amap.com/B0FFGWGO81/comment/content_media_external_file_125970_ss__1753419699316_00687879.jpg",
                "title": ""
            }
        ],
        "rating": "4.6"
    }
]

# 示例数据 - 酒店推荐
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

# 统一的请求模型
class UnifiedRequest(BaseModel):
    # 旅行基本信息
    departure_city: str
    destination_city: str
    departure_date: str
    return_date: str
    travellers_count: TravellerCount
    budget: Optional[Budget] = None
    
    # 旅行偏好
    trip_style: Optional[List[str]] = None
    other_requirement: Optional[str] = None
    
    # 酒店偏好（可选）
    hotel_budget: Optional[float] = None
    hotel_level: Optional[str] = None
    
    # 请求类型控制
    request_type: str = "both"  # "spots", "hotels", "both"

# API 端点
@app.get("/")
async def root():
    return {"message": "Trip Agent Unified API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# 保持向后兼容的独立端点
@app.post("/api/trip-planning")
async def post_trip_planning_recommendations(request: CreateSpotsRequest):
    """
    景点推荐端点（保持向后兼容）
    """
    print("Received spot recommendation request")
    return SAMPLE_SPOT_RECOMMENDATIONS

@app.post("/api/hotel-recommendation")
async def post_hotel_recommendations(request: CreateHotelRequest):
    """
    酒店推荐端点（保持向后兼容）
    """
    print("Received hotel recommendation request")
    return SAMPLE_HOTEL_RECOMMENDATIONS

@app.get("/api/trip-planning")
async def get_trip_planning_recommendations():
    """
    GET方式获取景点推荐
    """
    return SAMPLE_SPOT_RECOMMENDATIONS

@app.get("/api/hotel-recommendation")
async def get_hotel_recommendations():
    """
    GET方式获取酒店推荐
    """
    return SAMPLE_HOTEL_RECOMMENDATIONS

if __name__ == "__main__":
    print("Starting Trip Agent Unified API server...")
    print("Unified endpoint: http://127.0.0.1:8002/api/trip-recommendations")
    print("Spot endpoint: http://127.0.0.1:8002/api/trip-planning")
    print("Hotel endpoint: http://127.0.0.1:8002/api/hotel-recommendation")
    print("Health check: http://127.0.0.1:8002/health")
    uvicorn.run(app, host="127.0.0.1", port=8002)
