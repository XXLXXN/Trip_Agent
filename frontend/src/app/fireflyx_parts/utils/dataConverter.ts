// frontend/src/app/fireflyx_parts/utils/dataConverter.ts

import { ActivityData } from "../types/tripData";

// 将动态数据转换为 ItineraryCard 需要的格式
export const convertToItineraryData = (
  activity: ActivityData
): { type: "transport" | "attraction" | "hotel"; data: any } | null => {
  if (activity.type === "transportation") {
    // 从描述中提取距离信息
    const extractDistance = (description: string): string | undefined => {
      const distanceMatch = description.match(/距离([0-9.]+)公里/);
      if (distanceMatch) {
        return `${distanceMatch[1]}公里`;
      }
      return undefined;
    };

    return {
      type: "transport",
      data: {
        from: activity.origin?.name || "",
        to: activity.destination?.name || "",
        time: activity.start_time,
        duration: calculateDuration(activity.start_time, activity.end_time),
        mode: activity.mode, // 添加交通方式
        cost: activity.cost, // 添加费用
        distance: extractDistance(activity.description || ""), // 添加距离
        description: activity.description, // 添加描述
      },
    };
  }

  if (activity.type === "activity") {
    return {
      type: "attraction",
      data: {
        name: activity.title || "",
        tickets: {
          type: "门票",
          count: "1张",
          people: "1人",
        },
        showTime: {
          date: activity.start_time.split(" ")[0] || "",
          time: activity.start_time.split(" ")[1] || "",
        },
      },
    };
  }

  return null;
};

// 计算时间差
export const calculateDuration = (startTime: string, endTime: string): string => {
  try {
    // 处理 "HH:MM" 或 "HH:MM:SS" 格式
    const formatTime = (time: string) => {
      if (time.includes(":") && time.split(":").length === 2) {
        return `${time}:00`; // 添加秒数
      }
      return time;
    };
    
    const start = new Date(`2000-01-01 ${formatTime(startTime)}`);
    const end = new Date(`2000-01-01 ${formatTime(endTime)}`);
    const diffMs = end.getTime() - start.getTime();
    const diffMinutes = Math.round(diffMs / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes}分钟`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return minutes > 0 ? `${hours}小时${minutes}分钟` : `${hours}小时`;
    }
  } catch (error) {
    return "未知";
  }
};

// 格式化时间显示
export const formatTime = (timeString: string): string => {
  try {
    // 处理 "HH:MM" 或 "HH:MM:SS" 格式
    const timeParts = timeString.split(':');
    const hour = parseInt(timeParts[0]);
    const minute = parseInt(timeParts[1]);
    
    if (hour < 12) {
      return `上午${hour}:${minute.toString().padStart(2, '0')}`;
    } else if (hour === 12) {
      return `中午${hour}:${minute.toString().padStart(2, '0')}`;
    } else {
      return `下午${hour - 12}:${minute.toString().padStart(2, '0')}`;
    }
  } catch (error) {
    return timeString;
  }
};

// 获取第一天第一个活动的时间
export const getFirstActivityTime = (activities: ActivityData[]): string => {
  const firstActivity = activities.find(activity => 
    activity.type === "transportation" || activity.type === "activity"
  );
  return firstActivity ? formatTime(firstActivity.start_time) : "";
};

// 将 activity 数据转换为 SpotCard 需要的格式
export const convertToSpotCardData = (activity: ActivityData, showNavigation: boolean = true) => {
  // 处理不同的 ID 格式
  let id = 1;
  if (activity.id.includes("activity_")) {
    id = parseInt(activity.id.replace("activity_", "")) || 1;
  } else if (activity.id.includes("transport_")) {
    id = parseInt(activity.id.replace("transport_", "")) || 1;
  } else {
    id = parseInt(activity.id.replace(/\D/g, '')) || 1;
  }
  
  return {
    id: id,
    name: activity.title || "",
    image: "/placeholder-spot.jpg", // 默认图片
    path: showNavigation ? `/spotdetails/${activity.id}` : "", // 根据参数决定是否显示跳转
    recommendationReason: activity.description || "",
    isPlan: true
  };
};

// 获取交通方式选项
export const getTransportOptions = (mode: string) => {
  // 固定的四个选项：公交、步行、骑行、驾车
  const transportOptions = ["公交", "步行", "骑行", "驾车"];
  
  // 根据 mode 返回不同的选项
  switch (mode) {
    case "plane":
    case "train":
      return []; // 飞机和火车不需要选择交通方式
    case "bus":
    case "walking":
    case "walk":
    case "cycling":
    case "driving":
      return transportOptions; // 返回固定的四个选项
    default:
      return transportOptions;
  }
};
