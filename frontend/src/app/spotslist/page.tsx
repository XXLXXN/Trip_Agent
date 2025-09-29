// app/page.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import Header from "@/components/spotlist/Header";
import SearchBar from "@/components/spotlist/SearchBar";
import SpotCard from "@/components/spotlist/spotcard";
import BottomNav from "@/components/spotlist/BottomNav";

import { mockSpots } from "@/mockData/travelcarddata";

export default function TravelSelectionPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // STATE: 管理已选择景点的 ID 列表，并根据 isPlan 初始化
  const [selectedSpotIds, setSelectedSpotIds] = useState(
    mockSpots.filter(spot => spot.isPlan).map(spot => spot.id)
  );

  // HANDLER: 处理卡片上 +/- 按钮的点击事件
  const handleSpotAction = (spotId: number) => {
    setSelectedSpotIds(prevIds => {
      if (prevIds.includes(spotId)) {
        // 如果 ID 已存在，则从列表中移除
        return prevIds.filter(id => id !== spotId);
      } else {
        // 如果 ID 不存在，则添加到列表
        return [...prevIds, spotId];
      }
    });
  };

  // FILTERING: 根据状态和搜索词，动态生成两个列表的数据
  const selectedSpots = mockSpots.filter(spot => selectedSpotIds.includes(spot.id));
  const recommendedSpots = mockSpots.filter(spot => 
    !selectedSpotIds.includes(spot.id) &&
    spot.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBackClick = () => router.push("/planning");
  const handleSkipClick = () => router.push("/traffic");

  return (
    <div className="page-container">
      <div className="top-section">
        <Header onBackClick={handleBackClick} onSkipClick={handleSkipClick} />
        <SearchBar value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>

      {/* 内容区域，分为两个部分 */}
      <div className="content-area">
        {/* 已选方案列表 */}
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">推荐景点方案</h2>
          </div>
          <div className="card-list">
            {selectedSpots.map(spot => (
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
            {recommendedSpots.map(spot => (
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
          background-color: #D9D9D9;
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