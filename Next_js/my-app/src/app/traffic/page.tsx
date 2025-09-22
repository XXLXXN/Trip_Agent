// app/page.tsx

'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// 导入新的选择器和卡片组件
import TravelTypeSelector from '@/components/traffic/SearchBar';
import HotelCard from '@/components/traffic/HotelCard'; // 我们继续使用HotelCard这个名字，但它现在显示出行方式
import BottomNav from '@/components/traffic/BottomNav';
import Header from '@/components/traffic/Header'; // 假设您还想保留顶部的Header

// 从新的数据文件导入数据和类型
import { mockTravelOptions, TravelOption } from '@/mockData/trafficdata';

export default function TravelSelectionPage() {
  const router = useRouter();

  // 1. 创建状态来管理当前选中的出行类别，默认值为 'fly'（航空）
  const [selectedType, setSelectedType] = useState('fly');

  // 2. 根据 selectedType 筛选列表
  const getFilteredOptions = () => {
    if (selectedType === 'all') {
      // 如果选 '不限'，返回所有数据
      return mockTravelOptions;
    }
    if (selectedType === 'self') {
      // 如果选 '自行安排'，返回空数组
      return [];
    }
    // 否则，只返回 type 匹配的数据
    return mockTravelOptions.filter(option => option.type === selectedType);
  };

  const filteredTravelOptions = getFilteredOptions();

  // Header 的点击事件 (如果保留Header)
  const handleBackClick = () => router.push('/home');
  const handleSkipClick = () => router.push('/next-step');

  return (
    <div className="page-container">
      
      {/* 顶部区域 (Header 和新的选择器) */}
      <div className="top-section">
        <Header onBackClick={handleBackClick} onSkipClick={handleSkipClick} />
        {/* 3. 使用新的选择器组件，并传入状态和状态更新函数 */}
        <TravelTypeSelector 
          selectedType={selectedType}
          onTypeChange={setSelectedType} 
        />
      </div>

      {/* 推荐区域 */}
      <div className="recommendations-section">
        <div className="recommendations-header">
          {/* 标题已更新 */}
          <h2 className="recommendations-title">推荐出行方式</h2>
          
        </div>

        {/* 4. 渲染筛选后的列表 */}
        <div className="hotel-list">
          {filteredTravelOptions.length > 0 ? (
            filteredTravelOptions.map((option) => (
              // HotelCard 现在接收的是 TravelOption 类型的数据
              <HotelCard key={option.id} hotel={option as any} /> 
            ))
          ) : (
            // 当列表为空时显示提示信息
            <p className="no-results">没有可用的出行方式。</p> 
          )}
        </div>
      </div>

      <BottomNav />
      
      <style jsx>{`
        .page-container { min-height: 100vh; background-color: #ffffff; }
        .top-section { background-color: #D9D9D9; padding-bottom: 8px; }
        .recommendations-section { padding: 16px; background-color: #ffffff; }
        .recommendations-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .recommendations-title { font-size: 1.125rem; font-weight: 600; color: #111827; }
        
        .hotel-list { display: flex; flex-direction: column; gap: 16px; }
        .no-results { text-align: center; color: #9ca3af; padding: 20px 0; }
      `}</style>
    </div>
  );
}