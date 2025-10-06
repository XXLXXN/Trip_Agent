// app/page.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import Header from "@/components/spotlist/Header";
import SearchBar from "@/components/spotlist/SearchBar";
import SpotCard from "@/components/spotlist/spotcard";
import BottomNav from "@/components/spotlist/BottomNav";

import { useTripPlan } from "../context/TripPlanContext";

export default function TravelSelectionPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpotIds, setSelectedSpotIds] = useState<number[]>([]);
  const router = useRouter();
  const { getSpotRecommendations, saveSelectedSpots } = useTripPlan();

  // 获取后端返回的景点数据
  const backendSpots = getSpotRecommendations();

  // 使用useMemo缓存转换后的数据，避免无限循环
  const convertedSpots = React.useMemo(() => {
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
  }, [backendSpots]);

  // 初始化选择状态 - 默认选择所有景点
  React.useEffect(() => {
    if (convertedSpots.length > 0) {
      const defaultSelectedIds = convertedSpots.map((spot) => spot.id);
      setSelectedSpotIds(defaultSelectedIds);
    }
  }, [convertedSpots]);

  // 当选择状态变化时，保存完整景点信息到上下文
  React.useEffect(() => {
    if (backendSpots && selectedSpotIds.length > 0) {
      const selectedSpotsInfo = backendSpots.filter((spot, index) =>
        selectedSpotIds.includes(index + 1)
      );
      saveSelectedSpots(selectedSpotsInfo);
    }
  }, [selectedSpotIds, backendSpots]);

  // HANDLER: 处理卡片上 +/- 按钮的点击事件
  const handleSpotAction = (spotId: number) => {
    setSelectedSpotIds((prevIds) => {
      if (prevIds.includes(spotId)) {
        // 如果 ID 已存在，则从列表中移除
        return prevIds.filter((id) => id !== spotId);
      } else {
        // 如果 ID 不存在，则添加到列表
        return [...prevIds, spotId];
      }
    });
  };

  // FILTERING: 根据状态和搜索词，动态生成两个列表的数据
  const selectedSpots = convertedSpots.filter((spot) =>
    selectedSpotIds.includes(spot.id)
  );
  const recommendedSpots = convertedSpots.filter(
    (spot) =>
      !selectedSpotIds.includes(spot.id) &&
      spot.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBackClick = () => router.push("/planning");
  const handleSkipClick = () => router.push("/traffic");

  // 计算BottomNav的实际高度，用于给滚动区域增加底部内边距
  const bottomNavHeight = "88px"; 

  return (
    <div className="page-wrapper">
      <div className="scroll-container">
        {/* Header部分，它会正常随页面滚动消失 */}
        <Header onBackClick={handleBackClick} onSkipClick={handleSkipClick} />

        {/* 搜索框的包裹容器，这个容器将实现悬浮效果 */}
        <div className="sticky-search-bar">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* 内容区域，它将在悬浮的搜索框下方滚动 */}
        <div className="content-area">
          {/* 已选方案列表 */}
          <div className="section">
            <div className="section-header">
              <h2 className="section-title">推荐景点方案</h2>
            </div>
            <div className="card-list">
              {selectedSpots.map((spot) => (
                <SpotCard
                  key={spot.id}
                  spot={spot}
                  isSelected={true}
                  onButtonClick={handleSpotAction}
                />
              ))}
            </div>
          </div>

          {/* 推荐景点列表 */}
          <div className="section">
            <div className="section-header">
              <h2 className="section-title">推荐景点</h2>
            </div>
            <div className="card-list">
              {recommendedSpots.map((spot) => (
                <SpotCard
                  key={spot.id}
                  spot={spot}
                  isSelected={false}
                  onButtonClick={handleSpotAction}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 固定的底部导航 */}
      <BottomNav />

      <style jsx>{`
        /* 确保html和body不产生滚动条 */
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
          padding-bottom: ${bottomNavHeight};
        }

        /* 关键：包裹搜索框的容器样式 */
        .sticky-search-bar {
          position: sticky; /* 实现悬浮的核心属性 */
          top: 0; /* 悬浮在滚动容器的最顶部 */
          z-index: 10; /* 确保它在内容区域之上 */
          background-color: transparent; /* 背景色，防止下方内容透视 */
          padding-bottom: 5px; /* 保持与原设计一致的底部间距 */
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
      `}</style>
    </div>
  );
}