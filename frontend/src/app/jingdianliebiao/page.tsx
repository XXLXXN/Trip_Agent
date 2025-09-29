// app/page.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// 从组件文件夹导入所有子组件
import Header from "@/components/travelliebiao/Header";
import SearchBar from "@/components/travelliebiao/SearchBar";
import HotelCard from "@/components/travelliebiao/HotelCard";
import BottomNav from "@/components/travelliebiao/BottomNav";

// 从数据文件导入模拟数据
import { mockHotels } from "@/mockData/travelcarddata";

export default function TravelSelectionPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleBackClick = () => {
    router.push("/planning"); // 或者其他你想要跳转的路由
  };

  const handleSkipClick = () => {
    router.push("/traffic"); // 或者其他你想要跳转的路由
  };

  return (
    <div className="page-container">
      {/* 顶部区域 */}
      <div className="top-section">
        <Header onBackClick={handleBackClick} onSkipClick={handleSkipClick} />
        <SearchBar
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchQuery(e.target.value)
          }
        />
      </div>

      {/* 推荐区域 */}
      <div className="recommendations-section">
        <div className="recommendations-header">
          <h2 className="recommendations-title">推荐景点方案</h2>
        </div>

        {/* 酒店列表 */}
        <div className="hotel-list">
          {mockHotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </div>

      {/* 底部导航 */}
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
        .recommendations-section {
          padding: 16px;
          background-color: #ffffff;
        }
        .recommendations-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .recommendations-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
        }
        .hotel-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
      `}</style>
    </div>
  );
}
