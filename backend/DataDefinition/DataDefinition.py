from typing import List, Union, Optional
from pydantic import BaseModel, Field
from datetime import date, time
from enum import Enum
from typing import Dict


# 定义乘客类型枚举
class TravellerType(str, Enum):
    ADULT = "成人"
    CHILD = "儿童"
    SENIOR = "老人"
    STUDENT = "学生"

# 定义人数数据结构
class TravellerCount(BaseModel):
    # 使用字典来存储乘客类型和数量
    # 键是 TravellerType 枚举，值是人数（整数）
    travellers: Dict[TravellerType, int] = Field(..., description="出行人员数量，键为类型，值为人数")

#输入数据结构
class Budget:
    min:int
    max:int


class CreateItineraryRequest(BaseModel):
    user_id: str
    departure_city:str
    destination_city:str
    budget:Budget
    departure_date: date
    return_date: date
    travellers_count:TravellerCount
    transportation_preference:str #交通工具偏好，例如: "飞机", "火车", "自驾"
    budget_preference:str #预算更倾向花在哪里，吃饭，住宿，玩乐，可多选可全选
    trip_style:str #文艺，美食，自然，人文，小众等
    other_requirement:str #文本框输入




#输出数据结构
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