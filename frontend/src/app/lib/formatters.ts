// 统一的格式化工具模块

/**
 * 格式化时间：将"10:30:00"格式转换为"10:30"
 */
export const formatTime = (timeStr: string): string => {
  if (!timeStr || timeStr === "未知") return "未知";

  // 如果已经是正确格式（没有秒），直接返回
  if (timeStr.split(":").length === 2) return timeStr;

  // 去掉秒的部分
  return timeStr.split(":").slice(0, 2).join(":");
};

/**
 * 格式化用时：将"03:30"格式转换为"3h30min"
 */
export const formatDuration = (durationStr: string): string => {
  if (!durationStr || durationStr === "未知") return "未知";

  // 如果已经是"h min"格式，直接返回
  if (durationStr.includes("h") || durationStr.includes("分"))
    return durationStr;

  // 处理"03:30"格式
  const parts = durationStr.split(":");
  if (parts.length === 2) {
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);

    if (hours === 0) {
      return `${minutes}min`;
    } else if (minutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h${minutes}min`;
    }
  }

  return durationStr;
};

/**
 * 格式化日期：将前端日期格式转换为后端期望的格式
 */
export const formatDateForBackend = (dateString: string): string => {
  // 前端格式可能是 "2025.8.24" 或标准格式
  if (dateString.includes(".")) {
    const parts = dateString.split(".");
    if (parts.length === 3) {
      const year = parts[0];
      const month = parts[1].padStart(2, "0");
      const day = parts[2].padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
  }
  // 如果已经是标准格式，直接返回
  return dateString;
};

/**
 * 格式化价格：添加货币符号和格式化数字
 */
export const formatPrice = (price: number, currency: string = "¥"): string => {
  return `${currency}${price.toLocaleString()}`;
};

/**
 * 格式化评分：确保评分在0-5范围内，并保留1位小数
 */
export const formatRating = (rating: string | number): string => {
  const num = typeof rating === "string" ? parseFloat(rating) : rating;
  if (isNaN(num)) return "0.0";

  const clamped = Math.min(Math.max(num, 0), 5);
  return clamped.toFixed(1);
};

/**
 * 转换景点数据为前端格式
 */
export const convertSpotData = (backendSpots: any[]) => {
  return (
    backendSpots?.map((spot, index) => ({
      id: index + 1,
      name: spot.SpotName,
      image: spot.photos?.[0]?.url || "/placeholder-spot.jpg",
      path: `/spotdetails/${spot.POIId}`,
      recommendationReason: spot.RecReason,
      poiId: spot.POIId,
      address: spot.address,
      isPlan: true, // 默认全部都是推荐方案
    })) || []
  );
};

/**
 * 转换酒店数据为前端格式
 */
export const convertHotelData = (hotelData: any[]) => {
  return hotelData.map((hotel: any, index: number) => ({
    id: index + 1,
    name: hotel.SpotName,
    location: hotel.address,
    price: hotel.cost || 200,
    rating: parseFloat(hotel.rating) || 4.0,
    image: hotel.photos?.[0]?.url || "/placeholder-hotel.jpg",
    path: `/hoteldetails/${hotel.POIId}`,
    isPlan: index === 0,
  }));
};

/**
 * 转换交通数据为前端格式（应用时间格式化）
 */
export const convertTrafficData = (trafficData: any[]) => {
  return trafficData.map((item, index) => {
    if (item.type === "train") {
      const minPrice =
        item.Seats?.reduce(
          (min: number, seat: any) =>
            seat.ticketPrice < min ? seat.ticketPrice : min,
          item.Seats[0]?.ticketPrice || 0
        ) || 0;

      return {
        id: index + 1,
        type: "train" as const,
        path: `/travel/train-details/${
          item.trainCode?.toLowerCase() || "train"
        }`,
        departureTime: formatTime(item.fromTime || "未知"),
        arrivalTime: formatTime(item.toTime || "未知"),
        departureStation: item.fromStation || "未知",
        arrivalStation: item.toStation || "未知",
        travelNumber: item.trainCode || "未知",
        duration: formatDuration(item.runTime || "未知"),
        price: minPrice,
        airline: null,
      };
    } else if (item.type === "flight") {
      const minPrice =
        item.cabins?.reduce(
          (min: number, cabin: any) =>
            cabin.cabinPrice.adultSalePrice < min
              ? cabin.cabinPrice.adultSalePrice
              : min,
          item.cabins[0]?.cabinPrice.adultSalePrice || 0
        ) || 0;

      return {
        id: index + 1,
        type: "fly" as const,
        path: `/travel/flight-details/${
          item.flightNo?.toLowerCase() || "flight"
        }`,
        departureTime: formatTime(item.fromDateTime?.split(" ")[1] || "未知"),
        arrivalTime: formatTime(item.toDateTime?.split(" ")[1] || "未知"),
        departureStation: item.fromAirportName || "未知",
        arrivalStation: item.toAirportName || "未知",
        travelNumber: item.flightNo || "未知",
        duration: formatDuration(item.flyDuration || "未知"),
        price: minPrice,
        airline: item.airlineCompany || "未知",
      };
    } else {
      return {
        id: index + 1,
        type: "train" as const,
        path: `/travel/unknown/${index}`,
        departureTime: "未知",
        arrivalTime: "未知",
        departureStation: "未知",
        arrivalStation: "未知",
        travelNumber: "未知",
        duration: "未知",
        price: 0,
        airline: null,
      };
    }
  });
};
