from symtable import Class
from typing import List, Union, Optional, Literal, Any

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

# 定义交通方式枚举
class TransportationMode(str, Enum):
    BUS = "bus"
    DRIVING = "driving"
    WALK = "walk"
    CYCLING = "cycling"
    FLIGHT = "flight"
    TRAIN = "train"

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

class POIDetailType(str, Enum):
    """POI类型枚举"""
    SPOT = "spot"
    HOTEL = "hotel"

class POIDetailInfo(BaseModel):
    """统一的POI详情信息类"""
    name: str = Field(..., description="POI名称")
    rec_reason: str = Field(..., description="推荐理由")
    POIId: str = Field(..., description="POI ID")
    description: str = Field(..., description="描述信息")
    address: str = Field(..., description="地址")
    photos: Optional[List[Dict]] = Field(None, description="图片列表，每个dict包含url和title")
    rating: Optional[str] = Field(None, description="评分")
    cost: Optional[float] = Field(None, description="费用")
    poi_type: POIDetailType = Field(..., description="POI类型")

# 向后兼容的别名类
class SpotDetailInfo(POIDetailInfo):
    """景点详情信息类（兼容性别名）"""
    SpotName: str = Field(..., alias="name")
    RecReason: str = Field(..., alias="rec_reason")
    
    def __init__(self, **data):
        # 创建字段映射的副本
        mapped_data = data.copy()
        
        # 转换字段名以匹配基础类的字段名
        if 'SpotName' in mapped_data:
            mapped_data['name'] = mapped_data.pop('SpotName')
        if 'RecReason' in mapped_data:
            mapped_data['rec_reason'] = mapped_data.pop('RecReason')
        
        # 确保设置正确的POI类型
        mapped_data['poi_type'] = POIDetailType.SPOT
        super().__init__(**mapped_data)

class HotelDetailInfo(POIDetailInfo):
    """酒店详情信息类（兼容性别名）"""
    hotel_name: str = Field(..., alias="name")
    rec_reason: str = Field(..., alias="rec_reason")
    
    def __init__(self, **data):
        # 创建字段映射的副本
        mapped_data = data.copy()
        
        # 转换字段名以匹配基础类的字段名
        if 'hotel_name' in mapped_data:
            mapped_data['name'] = mapped_data.pop('hotel_name')
        if 'rec_reason' in mapped_data:
            mapped_data['rec_reason'] = mapped_data.pop('rec_reason')
        
        # 确保设置正确的POI类型
        mapped_data['poi_type'] = POIDetailType.HOTEL
        super().__init__(**mapped_data)

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

#创建交通方式推荐输入的数据
class CreateTrafficRequest(BaseModel):
    departure_date: date
    return_date: date
    traffic_budget:Optional[Budget] = None
    traffic_level:Optional[str] = None
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
    duration: timedelta = Field(..., description="预计交通所需时间")


class FlightDetails(BaseTrafficDetails):
    """
    飞机推荐的具体信息。

    示例数据 (JSON格式):
    {
        "traffic_type": "flight",
        "flightNo": "CZ6925",
        "airlineCompany": "南方航空",
        "fromAirportName": "库尔勒",
        "toAirportName": "成都双流",
        "fromDateTime": "2020-06-10 09:40:00",
        "toDateTime": "2020-06-10 15:45:00",
        "flyDuration": "06:05",
        "cabins": [
            {
                "cabinName": "经济舱",
                "cabinPrice": {
                    "adultSalePrice": 2097
                }
            }
        ]
    }
    """
    traffic_type: Literal["flight"] = "flight"
    flight_number: str = Field(..., alias="flightNo", description="航班号")
    airline: str = Field(..., alias="airlineCompany", description="航空公司")
    from_airport_name: str = Field(..., alias="fromAirportName", description="出发机场名称")
    to_airport_name: str = Field(..., alias="toAirportName", description="到达机场名称")
    fly_duration: str = Field(..., alias="flyDuration", description="飞行时长")
    
    class CabinInfo(BaseModel):
        """舱位信息"""
        cabin_name: str = Field(..., alias="cabinName", description="舱位名称")
        cabin_price: dict = Field(..., alias="cabinPrice", description="舱位价格信息")
    
    cabins: List[CabinInfo] = Field(..., description="可用舱位列表")


class TrainDetails(BaseTrafficDetails):
    """
    火车推荐的具体信息。

    示例数据 (JSON格式):
    {
        "traffic_type": "train",
        "trainCode": "K289",
        "fromStation": "苏州",
        "toStation": "昆山",
        "fromDateTime": "2023-12-15 04:30",
        "toDateTime": "2023-12-15 04:54",
        "runTime": "00:24",
        "trainsTypeName": "快速",
        "Seats": [
            {
                "seatTypeName": "硬座",
                "ticketPrice": 9.0
            }
        ]
    }
    """
    traffic_type: Literal["train"] = "train"
    train_code: str = Field(..., alias="trainCode", description="车次号")
    from_station: str = Field(..., alias="fromStation", description="出发车站")
    to_station: str = Field(..., alias="toStation", description="到达车站")
    run_time: str = Field(..., alias="runTime", description="运行时间")
    train_type_name: str = Field(..., alias="trainsTypeName", description="列车类型名称")
    
    class SeatInfo(BaseModel):
        """座位信息"""
        seat_type_name: str = Field(..., alias="seatTypeName", description="座位类型名称")
        ticket_price: float = Field(..., alias="ticketPrice", description="票价")
    
    seats: List[SeatInfo] = Field(..., alias="Seats", description="可用座位列表")


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


# 交通推荐响应包装类，匹配示例数据结构
class TrafficRecommendationResponse(BaseModel):
    """
    交通推荐API的响应格式，匹配示例数据的结构。
    
    示例数据格式:
    {
        "data": {
            "voyage": {  # 对于飞机
                "fromCityName": "库尔勒",
                "toCityName": "成都",
                "flights": [...]
            },
            "trainLines": [...]  # 对于火车
        },
        "success": true,
        "msg": "请求成功"
    }
    """
    data: Dict[str, Any] = Field(..., description="交通数据，包含voyage或trainLines")
    success: bool = Field(..., description="请求是否成功")
    msg: str = Field(..., description="消息")


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
    poi_details:POIDetailInfo



class Transportation(TripItem):
    """小型交通模型（短途、市内交通）"""
    type: str = Field(default="transportation", frozen=True)
    description: Optional[str] = None
    notes: Optional[str] = None
    cost: Optional[float] = None
    mode: TransportationMode
    origin: Location
    destination: Location
    route_points: Optional[List[Location]] = None
    ticket_info: Optional[TicketInfo] = None


class LargeTransportation(BaseModel):
    """大型交通模型（长途、跨城市交通）"""
    type: str = Field(default="large_transportation", frozen=True)
    description: Optional[str] = None
    traffic_details: TrafficDetails = Field(..., description="具体的交通方式详情（飞机/火车/自行安排）")


# 使用 Union 来定义一个项目可以是 Activity、Transportation 或 LargeTransportation
DayActivity = Union[Activity, Transportation, LargeTransportation]

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
    origin: str
    destination: str
    start_date: date
    end_date: date
    days: List[Day] = []


#扫描所需商品和支付链接的输出数据
class Goods(BaseModel):
    order_id: str
    amount: float
    payment_url: str
    timestamp: datetime
    currency: str = "CNY"



# 1. 定义账单类型枚举 (包含“其他”类别)
class BillType(str, Enum):
    """
    账单记录的类型。
    """
    FOOD = "美食"
    HOTEL = "酒店"
    TICKET = "票务"
    TRANSPORTATION = "交通"
    SHOPPING = "购物"
    OTHER = "其他"

# 2. 定义基础账单结构
class BaseBill(BaseModel):
    """
    账单记录的基础信息结构。
    """
    # 建议使用时区感知的时间（例如：ISO 8601 格式，带 +08:00）
    transaction_time: datetime = Field(
        ...,
        description="交易发生的时间（精确到秒，建议包含时区信息）。"
    )
    name: str = Field(
        ...,
        description="账单的名称或描述（例如：'海底捞'、'银行卡年费'）。"
    )
    # 收入为正数，支出为负数
    amount: float = Field(
        ...,
        description="收支数额。收入为正数，支出为负数（例如：-128.88 表示支出 128.88 元）。"
    )
    order_id: Optional[str] = Field(
        None,
        description="可选的订单号或交易流水号。"
    )
    avatar_url: Optional[str] = Field(
        None,
        description="头像/图标图片的URL或路径（例如：商户Logo或类别图标）。"
    )

# 3. 定义完整的账单记录结构 (包含 Docstring 示例)
class BillEntry(BaseBill):
    """
    一条完整的账单记录，包含类型信息。
    """
    category: BillType = Field(
        ...,
        description="账单的种类，使用 BillType 枚举（美食、酒店、票务、交通、购物、其他）。"
    )

    class Config:
        # 在 schema_extra 中提供示例数据，Pydantic 会将其包含在生成的 Schema（Docstring）中。
        schema_extra = {
            "examples": [
                {
                    "category": "美食",
                    "transaction_time": "2025-10-05T18:30:00+08:00",
                    "name": "海底捞火锅",
                    "amount": -345.50,
                    "order_id": "ZF2025100518300123456",
                    "avatar_url": "https://images.example.com/icons/food.png"
                },
                {
                    "category": "酒店",
                    "transaction_time": "2025-10-06T15:00:00+08:00",
                    "name": "北京丽思卡尔顿酒店",
                    "amount": -1899.00,
                    "order_id": "JD2025100615000098765",
                    "avatar_url": "https://images.example.com/icons/hotel.png"
                },
                {
                    "category": "交通",
                    "transaction_time": "2025-10-07T14:45:00+08:00",
                    "name": "滴滴快车",
                    "amount": -25.60,
                    "order_id": "DD20251007144500556677",
                    "avatar_url": None
                },
                {
                    "category": "购物",
                    "transaction_time": "2025-10-07T20:10:00+08:00",
                    "name": "苹果商城购买耳机",
                    "amount": -1999.00,
                    "order_id": "AP20251007201000998877",
                    "avatar_url": "https://images.example.com/icons/shopping.png"
                },
                {
                    "category": "其他",
                    "transaction_time": "2025-10-08T10:00:00+08:00",
                    "name": "水电费缴纳",
                    "amount": -150.00,
                    "order_id": "GF20251008100000111222",
                    "avatar_url": "https://images.example.com/icons/utility.png"
                },
                {
                    "category": "其他",
                    "transaction_time": "2025-10-08T12:00:00+08:00",
                    "name": "收到的红包",
                    "amount": 50.00, # 收入示例
                    "order_id": "RP20251008120000445566",
                    "avatar_url": "https://images.example.com/icons/redpacket.png"
                },
            ]
        }
