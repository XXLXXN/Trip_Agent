// app/travel/page.tsx

'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import Header from '@/components/traffic/Header';
import TravelTypeSelector from '@/components/traffic/TravelTypeSelector';
import TravelOptionCard from '@/components/traffic/TravelOptionCard';
import BottomNav from '@/components/traffic/BottomNav';

import { mockTravelOptions } from '@/mockData/trafficdata';
import type { TravelOption } from '@/mockData/trafficdata';


export default function TravelSelectionPage() {
  const router = useRouter();

  const [selectedType, setSelectedType] = useState('all'); // 默认显示所有

  const getFilteredOptions = () => {
    if (selectedType === 'all') return mockTravelOptions;
    if (selectedType === 'self') return [];
    return mockTravelOptions.filter(option => option.type === selectedType);
  };

  const filteredTravelOptions = getFilteredOptions();

  const handleBackClick = () => router.push('/jingdianliebiao');
  const handleSkipClick = () => router.push('/hotel');
  
  // 计算BottomNav的实际高度，用于给滚动区域增加底部内边距
  const bottomNavHeight = "88px";

  return (
    <div className="page-wrapper">
      <div className="scroll-container">

        {/* Header部分，它会正常随页面滚动消失 */}
        <Header onBackClick={handleBackClick} onSkipClick={handleSkipClick} />

        {/* 出行类别选择器的包裹容器，这个容器将实现悬浮效果 */}
        <div className="sticky-selector">
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
      </div>

      <BottomNav />
      
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
          background-color: white;
          flex-grow: 1;
          overflow-y: auto;
          /* 关键：为固定的底部导航留出空间 */
          padding-bottom: ${bottomNavHeight};
        }
        
        /* 关键：包裹选择器的容器样式 */
        .sticky-selector {
          position: sticky;
          top: 2px;
          z-index: 10;
          background-color: recommendations; /* 背景色，防止下方内容透视 */
          padding-bottom: 8px;
        }

        .recommendations-section { 
          padding: 16px; 
          background-color: #f9fafb; /* 为内容区添加背景色 */
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
        .option-list { 
          display: flex; 
          flex-direction: column; 
          gap: 16px; 
          align-items: center; 
        }
        .no-results { 
          text-align: center; 
          color: #9ca3af; 
          padding: 20px 0; 
        }
      `}</style>
    </div>
  );
}