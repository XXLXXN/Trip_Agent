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

  // 获取被选中的景点信息（用于发送给后端）
  const getSelectedSpotInfo = () => {
    return convertedSpots
      .filter((spot) => selectedSpotIds.includes(spot.id))
      .map((spot) => ({
        name: spot.name,
        id: spot.poiId,
        address: spot.address,
      }));
  };

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

  return (
    <div className="page-container">
      <div className="top-section">
        <Header onBackClick={handleBackClick} onSkipClick={handleSkipClick} />
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* 内容区域，分为两个部分 */}
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
                isSelected={true} // 标记为已选，显示 '-' 按钮
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
                isSelected={false} // 标记为未选，显示 '+' 按钮
                onButtonClick={handleSpotAction}
              />
            ))}
          </div>
        </div>
      </div>

      <BottomNav />

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
          gap: 24px; /* 两个 section 之间的间距 */
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
