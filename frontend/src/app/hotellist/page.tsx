// app/hotellist/page.tsx

'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import SelectionHeader from '@/components/hotel/SelectionHeader';
import SearchBar from '@/components/hotel/SearchBar';
import HotelCard from '@/components/hotel/HotelCard';
import BottomActionNav from '@/components/hotel/BottomActionNav';

import { mockHotelData } from '@/mockData/hoteldata';

export default function HotelSelectionPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  // State: 跟踪已选择酒店的ID列表，初始值为数据中标记为isPlan的酒店
  const [selectedHotelIds, setSelectedHotelIds] = useState(
    mockHotelData.filter(h => h.isPlan).map(h => h.id)
  );

  // Handler: 处理酒店卡片上的添加/移除操作
  const toggleHotelSelection = (hotelId: number) => {
    setSelectedHotelIds(prevIds => {
      if (prevIds.includes(hotelId)) {
        // 如果已存在，则移除
        return prevIds.filter(id => id !== hotelId);
      } else {
        // 如果不存在，则添加
        return [...prevIds, hotelId];
      }
    });
  };

  // 根据当前选择状态和搜索词，派生出两个列表
  const selectedHotels = mockHotelData.filter(h => selectedHotelIds.includes(h.id));
  const availableHotels = mockHotelData.filter(h => 
    !selectedHotelIds.includes(h.id) &&
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) // 应用搜索过滤
  );

  // Header 按钮的导航处理
  const handleBackClick = () => router.push('/traffic');
  const handleSkipClick = () => router.push('/messagecard');

  return (
    <div className="page-container">
      
      <div className="top-section">
        <SelectionHeader onBackClick={handleBackClick} onSkipClick={handleSkipClick} />
        <SearchBar value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>

      <main className="content-area">
        {/* 分区 1: 已选的酒店方案 */}
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">推荐酒店方案</h2>
          </div>
          <div className="card-list">
            {selectedHotels.map(hotel => (
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
            {availableHotels.map(hotel => (
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
          background-color: #D9D9D9;
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
      `}</style>
    </div>
  );
}