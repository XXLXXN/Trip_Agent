// components/travel/TravelOptionCard.tsx

'use client';

import { useRouter } from 'next/navigation';
import type { TravelOption } from '@/mockData/trafficdata'; // 引入数据类型

interface TravelOptionCardProps {
  option: TravelOption;
}

/**
 * 显示单个出行方式（如航班、火车）的信息卡片。
 * 点击卡片可以导航到该选项的详情页。
 */
export default function TravelOptionCard({ option }: TravelOptionCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    // 跳转到该出行选项指定的路径
    router.push(option.path);
  };

  return (
    <>
      <div className="option-card" onClick={handleCardClick}>
        <div className="option-image-container">
          {/* 这里可以放置航班或火车公司的 Logo 图片 */}
        </div>
        <div className="option-content">
          <div className="top-info">
            <h3 className="option-name">{option.name}</h3>
            <div className="option-location-wrapper">
              <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 1.58057C3.9 1.58057 2 3.19057 2 5.68057C2 7.27057 3.225 9.14057 5.67 11.2956C5.86 11.4606 6.145 11.4606 6.335 11.2956C8.775 9.14057 10 7.27057 10 5.68057C10 3.19057 8.1 1.58057 6 1.58057ZM6 6.58057C5.45 6.58057 5 6.13057 5 5.58057C5 5.03057 5.45 4.58057 6 4.58057C6.55 4.58057 7 5.03057 7 5.58057C7 6.13057 6.55 6.58057 6 6.58057Z" fill="#808080"/>
              </svg>
              <span className="option-location">{option.location}</span>
            </div>
          </div>
          <div className="bottom-info">
            <div className="option-price-wrapper">
              <span className="option-price">${option.price}</span>
              <span className="price-tag">/起</span>
            </div>
            <div className="option-rating-wrapper">
              <svg className="star-icon" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="option-rating">{option.rating}</span>
            </div>
          </div>
          
        </div>
      </div>
      <style jsx>{`
        .option-card { display: flex; width: 343px; height: 114px; background-color: white; border-radius: 16px; border: 1px solid #f3f4f6; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); overflow: hidden; cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .option-card:hover { transform: translateY(-2px); box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.08); }
        .option-image-container { width: 134px; height: 100%; background-color: #e5e7eb; flex-shrink: 0; border-radius: 12px; }
        .option-content { flex: 1; padding: 16px; display: flex; flex-direction: column; justify-content: space-between; position: relative; }
        .option-name { font-family: 'Inter', medium; font-size: 14px; font-weight: 500; color: #1B1446; }
        .option-location-wrapper { display: flex; align-items: center; gap: 4px; }
        .option-location { font-family: 'Inter', medium; font-size: 10px; font-weight: 500; color: #808080; }
        .bottom-info { display: flex; align-items: flex-end; justify-content: space-between; }
        .option-price-wrapper { display: flex; align-items: baseline; gap: 2px; }
        .option-price { font-family: 'Inter', semi-bold; font-size: 14px; font-weight: 500; color: #398B2B; }
        .price-tag { font-family: 'Inter', regular; font-size: 12px; font-weight: 500; color: #808080; }
        .option-rating-wrapper { display: flex; align-items: center; gap: 4px; }
        .star-icon { width: 18px; height: 18px; color: #FFBE41; }
        .option-rating { font-family: 'Inter', medium; font-size: 12px; font-weight: 500; color: #BFBFBF; }
        
      `}</style>
    </>
  );
}