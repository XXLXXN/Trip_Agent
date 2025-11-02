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
import { useNavigation } from "../context/NavigationContext";

export default function HotelSelectionPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const navigation = useNavigation();
  const {
    getTripPlan,
    getSelectedSpots,
    saveHotelRecommendations,
    getHotelRecommendations,
    saveTrafficRecommendations,
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
              学生: tripPlan.students,
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
  const handleBackClick = () => navigation.push("/spotslist", "backward");
  
  // 一键规划处理函数
  const handleOneClickPlanning = async () => {
    try {
      console.log("开始一键规划...");
      
      // 获取当前所有数据
      const tripPlan = getTripPlan();
      const selectedSpots = getSelectedSpots();
      const hotelRecommendations = getHotelRecommendations();
      
      // 构建请求数据（先留空，后续可以发送给大agent）
      const requestData = {
        tripPlan,
        selectedSpots,
        hotelRecommendations,
        // TODO: 后续可以添加更多数据发送给大agent
      };
      
      console.log("发送一键规划请求:", requestData);
      
      // 调用一键规划API
      const response = await fetch("/api/oneclick-planning", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      
      if (!response.ok) {
        throw new Error(`一键规划API请求失败: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || "一键规划API返回错误");
      }
      
      console.log("一键规划成功，跳转到详情页面");
      
      // 跳转到详情页面
      navigation.push("/fireflyx_parts/trip_payment/details", "forward");
      
    } catch (error) {
      console.error("一键规划失败:", error);
      alert(`一键规划失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };
  
  const handleSkipClick = handleOneClickPlanning;

  // 处理下一步按钮点击事件
  const handleNextClick = async () => {
    // 获取旅行规划数据
    const tripPlan = getTripPlan();
    if (!tripPlan) {
      throw new Error("缺少旅行规划数据");
    }

    // 构建交通推荐请求数据 - 保持与现有API路由兼容
    const trafficRequestData = {
      departure: tripPlan.departure,
      destination: tripPlan.destination,
      departureTime: tripPlan.startDate, // 使用出发日期作为出发时间
    };

    console.log("发送交通推荐请求:", trafficRequestData);

    // 调用交通推荐API
    const response = await fetch("/api/traffic-recommendation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(trafficRequestData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`交通推荐API请求失败: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "交通推荐API返回错误");
    }

    console.log("交通推荐API返回结果:", result);

    // API路由已经将数据转换为TrafficRecommendation[]格式，直接使用
    const trafficRecommendations = result.data;

    console.log(
      "API返回的交通推荐数据总数:",
      trafficRecommendations?.length || 0
    );
    console.log(
      "火车数据:",
      trafficRecommendations?.filter((item: any) => item.type === "train")
        .length || 0
    );
    console.log(
      "飞机数据:",
      trafficRecommendations?.filter((item: any) => item.type === "flight")
        .length || 0
    );

    if (trafficRecommendations && trafficRecommendations.length > 0) {
      // 保存交通推荐数据到TripPlanContext
      saveTrafficRecommendations(trafficRecommendations);
      console.log(
        "交通推荐数据已保存到context，数量:",
        trafficRecommendations.length
      );
      console.log(
        "保存到context的数据示例:",
        JSON.stringify(trafficRecommendations[0], null, 2)
      );

      // 导航到交通列表页面
      navigation.push("/trafficlist", "forward");
    } else {
      console.warn("没有找到有效的交通推荐数据");
      // 即使没有数据也导航到交通列表页面，让用户看到空状态
      navigation.push("/trafficlist", "forward");
    }
  };

  // 计算BottomNav的实际高度，用于给滚动区域增加底部内边距
  const bottomNavHeight = "88px";

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
    <div className="page-wrapper">
      <div className="scroll-container">
        {/* Header部分，它会正常随页面滚动消失 */}
        <SelectionHeader
          onBackClick={handleBackClick}
          onSkipClick={handleSkipClick}
        />

        {/* 搜索框的包裹容器，这个容器将实现悬浮效果 */}
        <div className="sticky-search-bar">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* 内容区域，它将在悬浮的搜索框下方滚动 */}
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
      </div>

      <BottomActionNav onNextClick={handleNextClick} />

      <style jsx>{`
        /* 全局样式，确保页面不产生滚动条 */
        :global(html),
        :global(body) {
          height: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }

        .page-wrapper {
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .scroll-container {
          background-color: #ffffff;
          flex-grow: 1;
          overflow-y: auto;
          /* 关键：为固定的底部导航留出空间 */
          padding-bottom: ${bottomNavHeight};
        }

        /* 关键：包裹搜索框的容器样式 */
        .sticky-search-bar {
          position: sticky;
          top: 2px;
          z-index: 10;
          background-color: transparent; /* 背景色，防止下方内容透视 */
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
