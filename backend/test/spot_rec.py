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

from backend.DataDefinition.DataDefinition import TravellerCount, Budget, CreateSpotsRequest

# 定义响应模型
class SpotRecommendation(BaseModel):
    SpotName: str
    RecReason: str

class TripPlanningResponse(BaseModel):
    recommendations: List[SpotRecommendation]

# FastAPI 应用实例
app = FastAPI()

# 示例数据
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

# API 端点
@app.get("/api/trip-planning")
async def get_trip_planning_recommendations():
    """
    返回景点推荐数据
    """
    return SAMPLE_SPOT_RECOMMENDATIONS
   

@app.post("/api/trip-planning")
async def post_trip_planning_recommendations(request: CreateSpotsRequest):
    """
    基于旅行参数返回景点推荐数据
    """
    # 打印接收到的请求数据以便调试
    print("Received trip planning request:")
    print(f"Departure City: {request.departure_city}")
    print(f"Destination City: {request.destination_city}")
    print(f"Departure Date: {request.departure_date}")
    print(f"Return Date: {request.return_date}")
    print(f"Travellers: {request.travellers_count.travellers}")
    print(f"Budget: {request.budget}")
    print(f"Trip Style: {request.trip_style}")
    print(f"Other Requirements: {request.other_requirement}")
    
    # 这里可以根据请求参数进行智能推荐
    # 目前暂时返回示例数据
    return SAMPLE_SPOT_RECOMMENDATIONS


# 健康检查端点
@app.get("/")
async def root():
    return {"message": "Spot Recommendation API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    print("Starting Spot Recommendation FastAPI server...")
    print("GET endpoint: http://127.0.0.1:8000/api/trip-planning")
    print("POST endpoint: http://127.0.0.1:8000/api/trip-planning")
    print("Health check: http://127.0.0.1:8000/health")
    uvicorn.run(app, host="127.0.0.1", port=8000)
