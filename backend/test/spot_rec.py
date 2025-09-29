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
        "SpotName": "上海迪士尼乐园",
        "RecReason": "根据您的旅行风格，这是一款非常适合亲子游的乐园，在这里您可以和您的孩子共同度过愉快的时光。这里每天还会举行各种游行，烟花秀等活动，非常适合各个年龄段的游客。"
    },
    {
        "SpotName": "东方明珠广播电视塔",
        "RecReason": "您可以从上海最著名的地标建筑俯瞰整个上海市区，尤其是在晚上灯火通明，非常适合拍照留念，非常符合您想要的现代繁华风格。"
    },
    {
        "SpotName": "浦东美术馆",
        "RecReason": "您的出行时间2025年10月10日，里面正在展出‘奥赛展’，适合去观赏梵高的优美画作"
    },
    {
        "SpotName": "武康路",
        "RecReason": "武康路是上海的一条历史文化街区，您可以体验到浓厚的文艺气息，非常适合您的文艺之旅风格。"
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
