// app/page.tsx

'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// 确保这里的组件路径是正确的
import Header from '@/components/hotel/Header';
import SearchBar from '@/components/hotel/SearchBar';
import HotelCard from '@/components/hotel/HotelCard';
import BottomNav from '@/components/hotel/BottomNav';

// 从您的数据文件导入
import { mockHotels } from '@/mockData/hoteldata';

export default function TravelSelectionPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  // 1. STATE: 管理已选择的酒店 ID 列表
  const [selectedHotelIds, setSelectedHotelIds] = useState(
    mockHotels.filter(h => h.isPlan).map(h => h.id)
  );

  // 2. HANDLER: 处理 +/- 按钮点击
  const handleHotelAction = (hotelId: number) => {
    setSelectedHotelIds(prevIds => {
      if (prevIds.includes(hotelId)) {
        return prevIds.filter(id => id !== hotelId);
      } else {
        return [...prevIds, hotelId];
      }
    });
  };

  // 3. FILTERING: 根据状态和搜索词筛选数据
  const selectedHotels = mockHotels.filter(h => selectedHotelIds.includes(h.id));
  const recommendedHotels = mockHotels.filter(h => 
    !selectedHotelIds.includes(h.id) &&
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) // 应用搜索过滤
  );

  // Header 点击事件
  const handleBackClick = () => router.push('/traffic');
  const handleSkipClick = () => router.push('/messagecard');

  return (
    <div className="page-container">
      
      {/* 顶部区域: Header 和 SearchBar 保持不变 */}
      <div className="top-section">
        <Header onBackClick={handleBackClick} onSkipClick={handleSkipClick} />
        <SearchBar value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>

      {/* 内容区域: 现在渲染两个列表 */}
      <div className="content-area">
        {/* 分区 1: 推荐酒店方案 */}
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">推荐酒店方案</h2>
          </div>
          <div className="card-list">
            {selectedHotels.map(hotel => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                isSelected={true} // 显示 '-'
                onButtonClick={handleHotelAction}
              />
            ))}
          </div>
        </div>

        {/* 分区 2: 推荐酒店 */}
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">推荐酒店</h2>
          </div>
          <div className="card-list">
            {recommendedHotels.map(hotel => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                isSelected={false} // 显示 '+'
                onButtonClick={handleHotelAction}
              />
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
      
      <style jsx>{`
        /* 保留您的 page 和 top-section 样式 */
        .page-container {
          min-height: 100vh;
          background-color: #ffffff;
        }
        .top-section {
          background-color: #D9D9D9;
          padding-bottom: 5px;
        }

        /* 这是新的内容区域样式 */
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