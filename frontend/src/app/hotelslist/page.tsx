// app/hotellist/page.tsx

"use client";

// 酒店数据接口定义
interface Hotel {
  id: number;
  name: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  path: string;
  isPlan?: boolean;
}

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import SelectionHeader from "@/components/hotel/SelectionHeader";
import SearchBar from "@/components/hotel/SearchBar";
import HotelCard from "@/components/hotel/HotelCard";
import BottomActionNav from "@/components/hotel/BottomActionNav";

import { useTripPlan, HotelRecommendation } from "../context/TripPlanContext";

export default function HotelSelectionPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const {
    getTripPlan,
    getSelectedSpots,
    saveHotelRecommendations,
    getHotelRecommendations,
  } = useTripPlan();

  // State: 跟踪已选择酒店的ID列表
  const [selectedHotelIds, setSelectedHotelIds] = useState<number[]>([]);

  // 从API获取酒店数据
  useEffect(() => {
    const fetchHotelRecommendations = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 获取旅行规划数据
        const tripPlan = getTripPlan();
        const selectedSpots = getSelectedSpots();

        if (!tripPlan || !selectedSpots) {
          throw new Error("缺少必要的旅行规划数据");
        }

        // 检查是否已经有酒店数据，避免重复请求
        const existingHotelRecommendations = getHotelRecommendations();
        if (
          existingHotelRecommendations &&
          existingHotelRecommendations.length > 0
        ) {
          console.log("已有酒店推荐数据，跳过API请求");

          // 直接使用已有的数据
          const convertedHotels: Hotel[] = existingHotelRecommendations.map(
            (hotel: HotelRecommendation, index: number) => ({
              id: index + 1,
              name: hotel.SpotName,
              location: hotel.address,
              price: hotel.cost || 200,
              rating: parseFloat(hotel.rating) || 4.0,
              image: hotel.photos?.[0]?.url || "/placeholder-hotel.jpg",
              path: `/hoteldetails/${hotel.POIId}`,
              isPlan: index === 0,
            })
          );

          setHotels(convertedHotels);

          // 默认选择第一个酒店（推荐方案）
          if (convertedHotels.length > 0) {
            setSelectedHotelIds([convertedHotels[0].id]);
          }

          setIsLoading(false);
          return;
        }

        // 构建请求数据
        const requestData = {
          arr_date: tripPlan.startDate,
          return_date: tripPlan.endDate,
          travellers_count: {
            travellers: {
              成人: tripPlan.adults,
              老人: tripPlan.elderly,
              儿童: tripPlan.children,
              学生: 0,
            },
          },
          spot_info: selectedSpots.map((spot) => ({
            name: spot.SpotName,
            id: spot.POIId,
            address: spot.address,
          })),
        };

        console.log("发送酒店推荐请求:", requestData);

        // 调用API
        const response = await fetch("/api/hotel-recommendation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          throw new Error(`API请求失败: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || "API返回错误");
        }

        // 转换后端返回的数据格式为前端需要的格式
        console.log("后端返回的完整响应:", result);
        const hotelData = result.data || result; // 兼容两种格式
        console.log("实际的酒店数据:", hotelData);

        const convertedHotels: Hotel[] = hotelData.map(
          (hotel: any, index: number) => ({
            id: index + 1,
            name: hotel.SpotName,
            location: hotel.address,
            price: hotel.cost || 200, // 如果没有价格信息，设为默认值200
            rating: parseFloat(hotel.rating) || 4.0, // 如果没有评分，设为默认值4.0
            image: hotel.photos?.[0]?.url || "/placeholder-hotel.jpg",
            path: `/hoteldetails/${hotel.POIId}`,
            isPlan: index === 0, // 第一个酒店设为推荐方案
          })
        );
        console.log("转换后的酒店数据:", convertedHotels);

        setHotels(convertedHotels);

        // 保存酒店推荐数据到TripPlanContext，供详情页使用
        const hotelRecommendations: HotelRecommendation[] = hotelData.map(
          (hotel: any) => ({
            SpotName: hotel.SpotName,
            RecReason: hotel.RecReason || "推荐酒店",
            POIId: hotel.POIId,
            description: hotel.description || "酒店详情信息",
            address: hotel.address || "地址信息",
            photos: hotel.photos || [],
            rating: hotel.rating || "0",
            cost: hotel.cost || 0,
          })
        );
        saveHotelRecommendations(hotelRecommendations);

        // 默认选择第一个酒店（推荐方案）
        if (convertedHotels.length > 0) {
          setSelectedHotelIds([convertedHotels[0].id]);
        }
      } catch (err) {
        console.error("获取酒店推荐失败:", err);
        setError(err instanceof Error ? err.message : "获取酒店推荐失败");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotelRecommendations();
  }, []); // 空依赖数组，确保只执行一次

  // Handler: 处理酒店卡片上的添加/移除操作
  const toggleHotelSelection = (hotelId: number) => {
    setSelectedHotelIds((prevIds) => {
      if (prevIds.includes(hotelId)) {
        // 如果已存在，则移除
        return prevIds.filter((id) => id !== hotelId);
      } else {
        // 如果不存在，则添加
        return [...prevIds, hotelId];
      }
    });
  };

  // 根据当前选择状态和搜索词，派生出两个列表
  const selectedHotels = hotels.filter((h) => selectedHotelIds.includes(h.id));
  const availableHotels = hotels.filter(
    (h) =>
      !selectedHotelIds.includes(h.id) &&
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) // 应用搜索过滤
  );

  // Header 按钮的导航处理
  const handleBackClick = () => router.push("/traffic");
  const handleSkipClick = () => router.push("/messagecard");

  // 加载状态和错误处理
  if (isLoading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <p>正在加载酒店推荐...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-container">
          <p>加载失败: {error}</p>
          <button onClick={() => window.location.reload()}>重试</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="top-section">
        <SelectionHeader
          onBackClick={handleBackClick}
          onSkipClick={handleSkipClick}
        />
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <main className="content-area">
        {/* 分区 1: 已选的酒店方案 */}
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">推荐酒店方案</h2>
          </div>
          <div className="card-list">
            {selectedHotels.map((hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                isSelected={true} // 属于已选列表，显示 '-'
                onToggleSelection={toggleHotelSelection}
              />
            ))}
          </div>
        </section>

        {/* 分区 2: 其他可供选择的酒店 */}
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">推荐酒店</h2>
          </div>
          <div className="card-list">
            {availableHotels.map((hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                isSelected={false} // 属于可选列表，显示 '+'
                onToggleSelection={toggleHotelSelection}
              />
            ))}
          </div>
        </section>
      </main>

      <BottomActionNav />

      <style jsx>{`
        .page-container {
          min-height: 100vh;
          background-color: #ffffff;
        }
        .top-section {
          background-color: #d9d9d9;
          padding-bottom: 5px;
        }
        .content-area {
          padding: 16px;
          background-color: #ffffff;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .section-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
        }
        .card-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .loading-container,
        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 50vh;
          text-align: center;
        }
        .error-container button {
          margin-top: 16px;
          padding: 8px 16px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .error-container button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
}
