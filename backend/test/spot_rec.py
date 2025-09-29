from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
from typing import List, Dict

# 定义请求模型
class TripPlanningRequest(BaseModel):
    destination: str
    travel_style: str
    travel_date: str
    duration: int

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
    return {
        "recommendations": SAMPLE_SPOT_RECOMMENDATIONS
    }

@app.post("/api/trip-planning")
async def post_trip_planning_recommendations(request: TripPlanningRequest):
    """
    基于旅行参数返回景点推荐数据
    """
    # 这里可以根据请求参数进行智能推荐
    # 目前暂时返回示例数据
    return {
        "destination": request.destination,
        "travel_style": request.travel_style,
        "travel_date": request.travel_date,
        "duration": request.duration,
        "recommendations": SAMPLE_SPOT_RECOMMENDATIONS
    }

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
