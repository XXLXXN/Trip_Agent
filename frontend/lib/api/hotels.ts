// 酒店相关的API服务
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

export interface HotelRecommendation {
  recommended_hotels: Hotel[];
}

export interface HotelRecommendationRequest {
  destination: string;
  budget: Budget;
  trip_style: string;
  spots: Location[];
}

/**
 * 获取酒店推荐
 */
export async function getHotelRecommendations(data: HotelRecommendationRequest): Promise<HotelRecommendation> {
  try {
    const res = await fetch('/api/hotels/recommendations', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('获取酒店推荐失败:', error);
    throw error;
  }
} 