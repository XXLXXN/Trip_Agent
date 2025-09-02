// 行程相关的API服务
export interface Location {
  name: string;
  address: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface Budget {
  min: number;
  max: number;
}

export interface TravellerCount {
  travellers: Record<string, number>;
}

export interface Hotel {
  name: string;
  location: Location;
  price: number;
  rating: number;
  description: string;
  recommendation_reason: string;
  url?: string;
  amenities: string[];
}

export interface CreateItineraryRequest {
  user_id: string;
  departure_city: string;
  destination_city: string;
  budget: Budget;
  departure_date: string;
  return_date: string;
  travellers_count: TravellerCount;
  transportation_preference: string;
  budget_preference: string[];
  trip_style: string;
  other_requirement: string;
  spots: Location[];
  selected_hotel?: Hotel;
}

export interface Itinerary {
  trip_id: string;
  trip_name: string;
  destination: string;
  start_date: string;
  end_date: string;
  days: any[];
}

/**
 * 生成行程
 */
export async function generateItinerary(data: CreateItineraryRequest): Promise<Itinerary> {
  try {
    const res = await fetch('/api/itinerary/generate', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('生成行程失败:', error);
    throw error;
  }
}

/**
 * 保存行程
 */
export async function saveItinerary(itinerary: Itinerary): Promise<void> {
  try {
    const res = await fetch('/api/itinerary/save', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(itinerary)
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('保存行程失败:', error);
    throw error;
  }
} 