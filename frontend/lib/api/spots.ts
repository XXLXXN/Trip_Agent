// 景点相关的API服务
export interface CreateSpotsRequest {
  departure_city: string;
  destination_city: string;
  departure_date: string;
  return_date: string;
  trip_style: string;
}

export interface Location {
  name: string;
  address: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

/**
 * 创建景点推荐请求
 */
export async function createSpotsRequest(data: CreateSpotsRequest): Promise<Location[]> {
  try {
    const res = await fetch('/api/spots', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('创建景点推荐请求失败:', error);
    throw error;
  }
}

/**
 * 更新景点信息
 */
export async function updateSpotsRequest(locations: Location[]): Promise<Location[]> {
  try {
    const res = await fetch('/api/spots', {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locations })
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('更新景点信息失败:', error);
    throw error;
  }
} 