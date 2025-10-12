// components/spotlist/SpotCard.tsx

"use client";

import { useRouter } from "next/navigation";
import { useNavigation } from "../../context/NavigationContext";
import { Spot } from "@/mockData/travelcarddata";

interface SpotCardProps {
  spot: Spot;
  isSelected: boolean; // 新增：告诉卡片当前是否被选中
  onButtonClick: (spotId: number) => void; // 新增：处理 +/- 按钮点击的回调函数
}

export default function SpotCard({
  spot,
  isSelected,
  onButtonClick,
}: SpotCardProps) {
  const router = useRouter();
  const navigation = useNavigation();

  // 处理整个卡片的点击，用于页面跳转
  const handleCardClick = () => {
    navigation.push(spot.path, "forward");
  };

  // 处理右上角 +/- 按钮的点击
  const handleActionButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡，防止点击按钮时也触发 handleCardClick
    onButtonClick(spot.id);
  };

  return (
    <>
      <div className="spot-card" onClick={handleCardClick}>
        <div className="spot-image-container">
          <img
            src={spot.image}
            alt={spot.name}
            className="spot-image"
            onError={(e) => {
              // 图片加载失败时使用默认图片
              e.currentTarget.src = "/placeholder-spot.jpg";
            }}
          />
        </div>
        <div className="spot-content">
          <h3 className="spot-name">{spot.name}</h3>
          <p className="recommendation-reason">{spot.recommendationReason}</p>
          <button className="action-button" onClick={handleActionButtonClick}>
            {isSelected ? (
              // 如果已选中，显示减号
              <div className="icon-minus"></div>
            ) : (
              // 如果未选中，显示加号
              <svg
                className="icon-plus"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 3.33331V12.6666"
                  stroke="#0768FD"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3.33331 8H12.6666"
                  stroke="#0768FD"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
      <style jsx>{`
        /* 主卡片容器 */
        .spot-card {
          width: 343px;
          height: 114px;
          background-color: white;
          border-radius: 16px;
          border: 1px solid #f3f4f6;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          display: flex;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          position: relative; /* 为按钮定位提供上下文 */
        }
        .spot-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.08);
        }

        .spot-image-container {
          width: 134px;
          height: 100%;
          background-color: #e5e7eb;
          flex-shrink: 0;
          border-radius: 12px;
          overflow: hidden;
        }
        .spot-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .spot-content {
          flex: 1;
          padding: 16px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          gap: 8px;
          position: relative;
        }
        .spot-name {
          width: 150px;
          font-family: "Inter", sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #1b1446;
          margin: 0;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .recommendation-reason {
          font-family: "Inter", sans-serif;
          font-size: 12px;
          color: #6b7280;
          line-height: 1.5;
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        /* 操作按钮样式 */
        .action-button {
          position: absolute;
          top: 16px;
          right: 16px;
          padding: 4px;
          background: none;
          border: none;
          cursor: pointer;
          z-index: 5;
        }
        .icon-minus {
          width: 14px;
          height: 3px;
          background-color: #0768FD;
          border-radius: 2px;
          position: relative; /* 添加相对定位 */
          top: 3px;          /* 将图标向下移动7px */
          right: 4px;  
        }
        .icon-plus { width: 20px;
                     height: 20px;
                     position: relative; /* 添加相对定位 */ 
                     top:-4px;}
      `}</style>
    </>
  );
}
