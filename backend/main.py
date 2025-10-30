from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from bson import ObjectId
import os

from services.trip_modifier import modify_and_regenerate_trip

import socks
import socket

# --- 代理配置 ---
# 在所有网络请求之前，全局设置 socket 模块以使用 SOCKS5 代理
socks.set_default_proxy(socks.SOCKS5, "127.0.0.1", 7890)
socket.socket = socks.socksocket
# -----------------

# --- 配置 ---
MONGO_URI = os.environ.get("MONGO_URI", "mongodb+srv://fireflyx:UrfV1fqFHyLwuWQ0@firefly.thygnti.mongodb.net/?appName=firefly")
DB_NAME = "trip_agent"
COLLECTION_NAME = "trips"

# --- FastAPI 应用实例 ---
app = FastAPI()

# --- CORS 中间件 ---
# 允许所有来源的请求，方便本地开发
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 在生产环境中应限制为您的前端域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 数据库连接 ---
# 添加 certifi 以确保 SSL 证书的正确性
import certifi
ca = certifi.where()
client = MongoClient(MONGO_URI, tlsCAFile=ca)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

# --- API 端点 ---

@app.get("/")
def read_root():
    return {"message": "Welcome to the Trip Agent API"}

@app.get("/get_trip_by_id")
def get_trip_by_id(trip_id: str):
    """
    根据 trip_id 从 MongoDB 中获取详细的旅行数据 (detailed_trip)。
    """
    try:
        trip_document = collection.find_one({"trip_id": trip_id})

        if trip_document and "detailed_trip" in trip_document:
            detailed_trip = trip_document["detailed_trip"]
            
            if "_id" in detailed_trip and isinstance(detailed_trip["_id"], ObjectId):
                detailed_trip["_id"] = str(detailed_trip["_id"])
            
            return detailed_trip
        else:
            raise HTTPException(status_code=404, detail=f"Detailed trip for id '{trip_id}' not found")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/modify_activity")
async def modify_activity(payload: dict = Body(...)):
    """替换指定活动并基于 connect_location2 重新生成 detailed_trip。"""
    trip_id = payload.get("trip_id")
    new_activity = payload.get("new_activity")

    if not trip_id:
        raise HTTPException(status_code=400, detail="缺少 trip_id")
    if not isinstance(new_activity, dict):
        raise HTTPException(status_code=400, detail="new_activity 必须是对象")

    try:
        updated_detailed_trip = modify_and_regenerate_trip(collection, trip_id, new_activity)
        return updated_detailed_trip
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"服务器内部错误: {exc}")


# --- 运行服务器的指令 ---
# 要运行此服务，请在终端中进入 backend 目录，然后执行:
# uvicorn main:app --reload --port 8000
