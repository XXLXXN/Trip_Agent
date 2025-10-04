from symtable import Class
from typing import List, Union, Optional, Literal

from pydantic import BaseModel, Field
from datetime import date, time, datetime, timedelta
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
class Budget(BaseModel):
    min:int
    max:int



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

class ItemType(str, Enum):
    food = "food"
    shopping = "shopping"

class Food(BaseModel):
    type: Literal[ItemType.food] = ItemType.food
    name: str
    price: float
    description: str
    url: Optional[str] = None

class Shopping(BaseModel):
    type: Literal[ItemType.shopping] = ItemType.shopping
    name:str
    price: float
    description: str
    url: Optional[str] = None

RecommendedProduct = Union[Food, Shopping]


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
    user_id: str
    trip_id: str
    trip_name: str
    destination: str
    start_date: date
    end_date: date
    days: List[Day] = []

class POIInfo(BaseModel):
    name: str
    id: str
    address: str
#输入结构
#创建景点推荐输入的数据
class CreateSpotsRequest(BaseModel):
    """
    创建景点推荐请求的基础信息模型。
    departure_city: 出发城市
    destination_city: 目的地城市
    departure_date: 出发日期
    return_date: 返回日期
    trip_style: 旅行风格 (如：文艺, 美食, 自然, 人文, 小众)
    other_requirement: 其他文本输入要求
    """
    departure_city: str
    destination_city: str
    departure_date: date
    return_date: date
    travellers_count: TravellerCount
    budget: Optional[Budget] = None
    trip_style:str = "不限"
    other_requirement: Optional[str] = None

#创建景点推荐输出的数据
class SpotnoPOI(BaseModel):
    SpotName: str
    RecReason: str
    description: Optional[str] = None
    
class SpotNameAndRecReason(BaseModel):
    SpotName: str
    RecReason: str
    POIId:str
    description: Optional[str] = None

class SpotDetailInfo(BaseModel):
    SpotName: str
    RecReason: str
    POIId:str
    description: str
    address:str
    photos:Optional[List[Dict]] #每个dict里有url和title
    rating:Optional[str] 

#创建酒店推荐输入的数据
class CreateHotelRequest(BaseModel):
    hotel_budget:Optional[Budget] = None
    hotel_level:Optional[str] = None
    arr_date: date
    return_date: date
    travellers_count:TravellerCount
    spot_info: List[POIInfo]
    other_requirement: Optional[str] = None

#创建酒店推荐输出的数据，可能需要加List
class HotelnoPOI(BaseModel):
    hotel_name: str
    rec_reason: str
    description: Optional[str] = None
    
class HotelNameAndRecReason(BaseModel):
    hotel_name: str
    rec_reason: str
    POIId: str
    description: Optional[str] = None


class HotelDetailInfo(BaseModel):
    hotel_name: str
    rec_reason: str
    POIId:str
    description: str
    address:str
    photos:Optional[List[Dict]] #每个dict里有url和title
    rating:Optional[str] 
    cost:Optional[float]

#创建交通方式推荐输入的数据
class CreateTrafficRequest(BaseModel):
    traffic_budget:int
    traffic_level:str
    travellers_count:TravellerCount
    departure_city:str
    destination_city:str

#创建交通方式推荐输出的数据


# --- 定义具体的交通方式信息类 ---

class BaseTrafficDetails(BaseModel):
    """交通方式（飞机/火车）共享的基础信息"""
    departure_time: datetime = Field(..., description="出发时间")
    arrival_time: datetime = Field(..., description="到达时间")
    departure_location: str = Field(..., description="出发地点（机场或车站名称）")
    arrival_location: str = Field(..., description="到达地点（机场或车站名称）")
    price: float = Field(..., description="价格（人民币）")
    duration: timedelta = Field(..., description="预计交通所需时间")


class FlightDetails(BaseTrafficDetails):
    """
    飞机推荐的具体信息。

    示例数据 (JSON格式):
    {
        "traffic_type": "flight",
        "departure_time": "2025-10-01T08:00:00",
        "arrival_time": "2025-10-01T10:30:00",
        "departure_location": "北京大兴国际机场",
        "arrival_location": "上海虹桥国际机场",
        "price": 850.50,
        "flight_number": "CA1234",
        "airline": "中国国际航空",
    }
    """
    traffic_type: Literal["flight"] = "flight"
    flight_number: str = Field(..., description="航班号")
    airline: str = Field(..., description="航空公司")


class TrainDetails(BaseTrafficDetails):
    """
    火车推荐的具体信息。

    示例数据 (JSON格式):
    {
        "traffic_type": "train",
        "departure_time": "2025-10-02T14:00:00",
        "arrival_time": "2025-10-02T18:50:00",
        "departure_location": "广州南站",
        "arrival_location": "深圳北站",
        "price": 180.00,
        "train_number": "G8801",
        "seat_class": "二等座",
    }
    """
    traffic_type: Literal["train"] = "train"
    train_number: str = Field(..., description="车次号")
    seat_class: str = Field(..., description="席别（如：一等座、硬卧）")



class SelfArrange(BaseModel):
    """
    自行安排，不需要任何额外信息。

    示例数据 (JSON格式):
    {
        "traffic_type": "self_arrange",
        "note": "用户决定自驾前往。"
    }
    """
    traffic_type: Literal["self_arrange"] = "self_arrange"
    note: str = Field("用户自行安排交通。", description="说明信息")


# --- 2. 定义主推荐信息类 ---

# 定义一个联合类型，包含所有可能的交通方式信息
TrafficDetails = Union[FlightDetails, TrainDetails, SelfArrange]


class TrafficRecInfo(BaseModel):
    """
    代表给用户推荐的交通方式信息的主类。

    该类使用 Pydantic 的 Tagged Union，通过 'recommendation' 字段中的
    'traffic_type' 自动识别并解析为 FlightDetails, TrainDetails, 或 SelfArrange。
    """

    traffic_details: TrafficDetails = Field(..., description="具体的交通方式推荐详情")


#创建行程表推荐输如的数据
class CreateItineraryRequest(BaseModel):
    user_id: str
    destination_city:str
    departure_date: date
    return_date: date
    travellers_count:TravellerCount
    spots_info: List[POIInfo]
    hotels_info: List[POIInfo]
    traffic_details: List[TrafficRecInfo]



#创建行程表推荐输出的数据
#Trip类型

#扫描所需商品和支付链接的输出数据
class Goods(BaseModel):
    name: str
    pay_link:str
