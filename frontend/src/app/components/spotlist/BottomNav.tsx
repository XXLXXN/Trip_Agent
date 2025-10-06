// components/spotlist/BottomNav.tsx - 保持不变，确认以下CSS属性存在且正确

"use client";

import { useRouter } from "next/navigation";
import { useTripPlan } from "../../context/TripPlanContext";
import { useState } from "react";

// 定义SpotRecommendation接口以匹配TripPlanContext中的定义
interface SpotRecommendation {
  SpotName: string;
  RecReason: string;
  POIId: string;
  description: string;
  address: string;
  photos: Array<{ url: string; title: string }>;
  rating: string;
}

export default function BottomNav() {
  const router = useRouter();
  const { getTripPlan, getSelectedSpots } = useTripPlan();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNextClick = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const tripPlan = getTripPlan();
      const selectedSpotsInfo = getSelectedSpots();

      if (!tripPlan || !selectedSpotsInfo) {
        setError("缺少必要的行程规划数据或景点选择数据，请返回重新选择");
        setIsLoading(false);
        return;
      }

      // 转换为发送给后端的格式
      const selectedSpots = selectedSpotsInfo.map((spot) => ({
        name: spot.SpotName,
        id: spot.POIId,
        address: spot.address,
      }));

      // 构建酒店推荐请求数据
      const hotelRequestData = {
        hotel_budget: null,
        hotel_level: null,
        arr_date: tripPlan.startDate,
        return_date: tripPlan.endDate,
        travellers_count: {
          travellers: {
            成人: tripPlan.adults || 0,
            老人: tripPlan.elderly || 0,
            儿童: tripPlan.children || 0,
            学生: 0, // 前端没有学生字段，设为0
          },
        },
        spot_info: selectedSpots,
      };

      console.log("发送酒店推荐请求数据:", hotelRequestData);

      // 发送酒店推荐请求
      const response = await fetch("/api/hotel-recommendation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hotelRequestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || "酒店推荐请求失败，请重试";
        setError(errorMessage);
        setIsLoading(false);
        return;
      }

      const result = await response.json();
      console.log("酒店推荐请求成功:", result);

      // 请求成功后才导航到交通页面
      router.push("/hotelslist");
    } catch (error) {
      console.error("处理下一步点击时发生错误:", error);
      setError("网络错误，请检查网络连接后重试");
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    handleNextClick();
  };

  return (
    <>
      <div className="bottom-nav">
        {error ? (
          <div className="error-section">
            <div className="error-message">{error}</div>
            <button className="retry-button" onClick={handleRetry}>
              重试
            </button>
          </div>
        ) : (
          <button
            className="next-button"
            onClick={handleNextClick}
            disabled={isLoading}
          >
            {isLoading ? "发送中..." : "下一步"}
          </button>
        )}
      </div>
      <style jsx>{`
        .bottom-nav {
          position: fixed; /* 核心：固定定位 */
          bottom: 0; /* 贴紧屏幕底部 */
          left: 0; /* 贴紧屏幕左侧 */
          right: 0; /* 贴紧屏幕右侧，使其横跨整个宽度 */
          padding: 16px; /* 内部填充 */
          background-color: white; /* 背景色 */
          border-top: 1px solid #e0e0e0; /* 顶部细边框，提供视觉分离 */
          box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05); /* 顶部阴影，增加浮动感 */
          display: flex;
          justify-content: center;
          z-index: 1000; /* 确保它在所有其他内容之上 */
        }
        .error-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          width: 100%;
        }
        .error-message {
          color: #ff4444;
          font-size: 14px;
          text-align: center;
          padding: 8px 16px;
          background-color: #fff5f5;
          border-radius: 8px;
          border: 1px solid #ffcccc;
        }
        .next-button {
          width: 327px;
          height: 48px;
          background-color: #0768fd;
          color: white;
          border-radius: 16px;
          font-weight: 600;
          font-size: 1rem;
          border: none;
          cursor: pointer;
        }
        .next-button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
        .retry-button {
          width: 327px;
          height: 48px;
          background-color: #ff4444;
          color: white;
          border-radius: 16px;
          font-weight: 600;
          font-size: 1rem;
          border: none;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}