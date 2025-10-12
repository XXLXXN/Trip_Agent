// components/travel/TravelOptionCard.tsx

'use client';

import { useRouter } from 'next/navigation';
import { useNavigation } from '../../context/NavigationContext';
// 确保类型导入路径与你的项目结构匹配
import type { TravelOption } from '@/mockData/trafficdata'; 

interface TravelOptionCardProps {
  option: TravelOption;
}

export default function TravelOptionCard({ option }: TravelOptionCardProps) {
  const router = useRouter();
  const navigation = useNavigation();

  const handleCardClick = () => {
    navigation.push(option.path, "forward");
  };

  return (
    <>
      <div className="option-card" onClick={handleCardClick}>
        
        {/* Column 1: Departure */}
        <div className="column departure-column">
          <span className="time">{option.departureTime}</span>
          <span className="station-name">{option.departureStation}</span>
        </div>

        {/* Column 2: Middle Info */}
        <div className="column middle-column">
          <span className="travel-number">{option.travelNumber}</span>
          <div className="travel-line"></div>
          <span className="duration">{option.duration}</span>
        </div>

        {/* Column 3: Arrival */}
        <div className="column arrival-column">
          <span className="time">{option.arrivalTime}</span>
          <span className="station-name">{option.arrivalStation}</span>
        </div>

        {/* Column 4: Price & Airline */}
        <div className="column price-column">
          <div className="price-wrapper">
            <span className="price-symbol">¥</span>
            <span className="price-amount">{option.price}</span>
            <span className="price-tag">起</span>
          </div>
          {option.type === 'fly' && option.airline ? (
            <span className="airline-name">{option.airline}</span>
          ) : (
            <span className="airline-name">&nbsp;</span>
          )}
        </div>
      </div>
      <style jsx>{`
        .option-card {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          width: 343px;
          height: 114px;
          padding: 24px 16px;
          background-color: white;
          border-radius: 16px;
          border: 1px solid #f3f4f6;
          box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.05);
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-sizing: border-box;
        }
        .option-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08);
        }

        .column {
          display: flex;
          flex-direction: column;
          gap: 4px; /* 减小了这里的间距 */
          flex-shrink: 0;
        }
        
        .departure-column { width: 85px; align-items: flex-start; }
        .arrival-column { width: 85px; align-items: flex-end; /* 修改为右对齐 */ transform: translateX(-15px);}
        .price-column { width: 85px; align-items: flex-end; /* 修改为右对齐 */ transform: translateX(-8px);}

        .middle-column {
          width: 55px;
          align-items: center;
          gap: 6px;
          padding-top: 5px;
          transform: translateX(-9px);
        }

        .time {
          font-family: 'Inter', sans-serif;
          font-size: 20px;
          font-weight: 600;
          color: #111827;
        }
        .station-name, .airline-name {
          font-size: 13px;
          color: #4b5563;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .travel-number, .duration {
          font-size: 12px;
          color: #6b7280;
        }
        .travel-line {
          width: 50px;
          height: 1px;
          background-color: #d1d5db;
          position: relative;
        }
        .travel-line::before,
        .travel-line::after {
          content: '';
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: #d1d5db;
        }
        .travel-line::before { left: -2px; }
        .travel-line::after { right: -2px; }

        .price-wrapper {
          display: flex;
          align-items: baseline;
          color: #f97316;
        }
        .price-symbol { font-size: 14px; font-weight: 500; margin-right: 1px; }
        .price-amount { font-size: 20px; font-weight: 600; }
        .price-tag { font-size: 12px; color: #6b7280; margin-left: 2px; }
      `}</style>
    </>
  );
}