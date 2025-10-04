// app/travel/page.tsx

'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import Header from '@/components/traffic/Header';
import TravelTypeSelector from '@/components/traffic/TravelTypeSelector';
import TravelOptionCard from '@/components/traffic/TravelOptionCard';
import BottomNav from '@/components/traffic/BottomNav';

// =================================================================
// 1. 数据调用过程
//    下面的 import 语句就是从本地文件 "调用" (导入) 模拟数据的过程。
//    在实际应用中，这里会被替换为从 API 获取数据的逻辑，
//    例如使用 useEffect 和 fetch。
//    请确保 `@/data/trafficdata` 这个路径与你的项目文件结构一致。
// =================================================================
import { mockTravelOptions } from '@/mockData/trafficdata';
import type { TravelOption } from '@/mockData/trafficdata';


export default function TravelSelectionPage() {
  const router = useRouter();

  const [selectedType, setSelectedType] = useState('all'); // 默认显示所有

  // 2. 数据处理和筛选
  //    这里基于导入的数据进行筛选，逻辑保持不变。
  const getFilteredOptions = () => {
    if (selectedType === 'all') return mockTravelOptions;
    if (selectedType === 'self') return [];
    return mockTravelOptions.filter(option => option.type === selectedType);
  };

  const filteredTravelOptions = getFilteredOptions();

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
          {/* 3. 数据渲染
              筛选后的数据在这里被 map 遍历，并传递给 TravelOptionCard 组件进行渲染。
          */}
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
        .page-container { min-height: 100vh; background-color: #f9fafb; }
        .top-section { background-color: #D9D9D9; padding-bottom: 8px; }
        .recommendations-section { padding: 16px; }
        .recommendations-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .recommendations-title { font-size: 1.125rem; font-weight: 600; color: #111827; }
        .option-list { display: flex; flex-direction: column; gap: 16px; align-items: center; }
        .no-results { text-align: center; color: #9ca3af; padding: 20px 0; }
      `}</style>
    </div>
  );
}