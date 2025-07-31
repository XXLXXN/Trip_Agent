from typing import List, Union, Optional
from pydantic import BaseModel, Field
from datetime import date, time


class Coordinates(BaseModel):
    """经纬度坐标"""
    latitude: float
    longitude: float

class Location(BaseModel):
    """地点信息"""
    name: str
    address: str
    coordinates: Optional[Coordinates] = None  # 坐标是可选的

class RecommendedProduct(BaseModel):
    """推荐产品信息"""
    name: str
    price: float
    description: str
    url: Optional[str] = None

class TicketInfo(BaseModel):
    """票务信息"""
    price: float
    url: Optional[str] = None
    description: Optional[str] = None


class TripItem(BaseModel):
    """所有行程项的基类"""
    id: str
    start_time: time
    end_time: time
    description: Optional[str] = None
    notes: Optional[str] = None
    cost: Optional[float] = None

    class Config:
        use_enum_values = True
        json_schema_extra = {
            "example": {
                "id": "item_1",
                "start_time": "09:00",
                "end_time": "12:00",
                "description": "行程描述",
                "notes": "注意保暖",
                "cost": 100
            }
        }


class Activity(TripItem):
    """游玩活动模型"""
    type: str = Field(default="activity", frozen=True)
    title: str
    location: Location
    recommended_products: Optional[List[RecommendedProduct]] = None



class Transportation(TripItem):
    """交通模型"""
    type: str = Field(default="transportation", frozen=True)
    mode: str
    origin: Location
    destination: Location
    route_points: Optional[List[Location]] = None
    ticket_info: Optional[TicketInfo] = None


# 使用 Union 来定义一个项目可以是 Activity 或 Transportation
DayActivity = Union[Activity, Transportation]

class Day(BaseModel):
    """每日行程模型"""
    date: date
    day_of_week: str
    day_index: int
    total_cost: Optional[float] = None
    activities: List[DayActivity] = []

class Trip(BaseModel):
    """整个行程模型"""
    trip_id: str
    trip_name: str
    destination: str
    start_date: date
    end_date: date
    days: List[Day] = []