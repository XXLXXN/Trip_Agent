// frontend/src/app/fireflyx_parts/types/tripData.ts

// 从 SAMPLE_TRIP_DATA_2.py 映射的数据类型
export interface TripData {
  user_id?: string; // 添加 user_id 字段
  trip_id: string;
  trip_name: string;
  destination: string;
  start_date: string;
  end_date: string;
  days: DayData[];
}

export interface DayData {
  date: string;
  day_of_week: string;
  day_index: number;
  total_cost: number;
  activities: ActivityData[];
}

export interface ActivityData {
  id: string;
  type:
    | "transportation"
    | "activity"
    | "large_transportation"
    | "food"
    | "shopping";
  mode?:
    | "plane"
    | "train"
    | "maglev_train"
    | "subway"
    | "taxi"
    | "bus"
    | "walking"
    | "walk"
    | "cycling"
    | "driving"
    | "hotel"
    | "attraction";
  start_time: string;
  end_time: string;
  title?: string;
  origin?: LocationData;
  destination?: LocationData;
  location?: LocationData;
  description: string;
  notes?: string;
  cost: number;
  ticket_info?: TicketInfo;
  recommended_products?: ProductData[];
  traffic_details?: TrafficDetails; // 添加大型交通详情
  poi_details?: POIDetails; // 添加POI详情信息
}

export interface POIDetails {
  name: string;
  rec_reason: string;
  POIId: string;
  description: string;
  address: string;
  photos?: Array<{ url: string; title?: string }>;
  rating?: string;
  cost?: number;
  poi_type: "spot" | "hotel";
}

export interface TrafficDetails {
  traffic_type: "flight" | "train" | "self_arrange";
  flightNo?: string;
  airlineCompany?: string;
  fromAirportName?: string;
  toAirportName?: string;
  fromDateTime?: string;
  toDateTime?: string;
  flyDuration?: string;
  cabins?: CabinInfo[];
  trainCode?: string;
  fromStation?: string;
  toStation?: string;
  runTime?: string;
  trainsTypeName?: string;
  Seats?: SeatInfo[];
  note?: string;
}

export interface CabinInfo {
  cabinName: string;
  cabinPrice: {
    adultSalePrice: number;
  };
}

export interface SeatInfo {
  seatTypeName: string;
  ticketPrice: number;
}

export interface LocationData {
  name: string;
  address: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface TicketInfo {
  price: number;
  url?: string;
  description: string;
}

export interface ProductData {
  name: string;
  price: number;
  description: string;
  url?: string;
}
