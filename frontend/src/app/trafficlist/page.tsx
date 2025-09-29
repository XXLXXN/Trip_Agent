// app/travel/page.tsx

'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import Header from '@/components/traffic/Header';
import TravelTypeSelector from '@/components/traffic/TravelTypeSelector';
import TravelOptionCard from '@/components/traffic/TravelOptionCard';
import BottomNav from '@/components/traffic/BottomNav';
import { mockTravelOptions } from '@/mockData/trafficdata';

export default function TravelSelectionPage() {
  const router = useRouter();

  // 状态管理：当前选中的出行类别，默认为 'fly'
  const [selectedType, setSelectedType] = useState('fly');

  // 根据 selectedType 筛选出行方式列表
  const getFilteredOptions = () => {
    if (selectedType === 'all') return mockTravelOptions;
    if (selectedType === 'self') return [];
    return mockTravelOptions.filter(option => option.type === selectedType);
  };

  const filteredTravelOptions = getFilteredOptions();

  // 定义 Header 按钮的点击事件
  const handleBackClick = () => router.push('/jingdianliebiao');
  const handleSkipClick = () => router.push('/hotel');

  return (
    <div className="page-container">
      
      <div className="top-section">
        <Header onBackClick={handleBackClick} onSkipClick={handleSkipClick} />
        <TravelTypeSelector 
          selectedType={selectedType}
          onTypeChange={setSelectedType} 
        />
      </div>

      <main className="recommendations-section">
        <div className="recommendations-header">
          <h2 className="recommendations-title">推荐出行方式</h2>
        </div>

        <div className="option-list">
          {filteredTravelOptions.length > 0 ? (
            filteredTravelOptions.map((option) => (
              <TravelOptionCard key={option.id} option={option} /> 
            ))
          ) : (
            <p className="no-results">没有符合条件的出行方式。</p> 
          )}
        </div>
      </main>

      <BottomNav />
      
      <style jsx>{`
        .page-container { min-height: 100vh; background-color: #ffffff; }
        .top-section { background-color: #D9D9D9; padding-bottom: 8px; }
        .recommendations-section { padding: 16px; background-color: #ffffff; }
        .recommendations-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .recommendations-title { font-size: 1.125rem; font-weight: 600; color: #111827; }
        .option-list { display: flex; flex-direction: column; gap: 16px; align-items: center; }
        .no-results { text-align: center; color: #9ca3af; padding: 20px 0; }
      `}</style>
    </div>
  );
}