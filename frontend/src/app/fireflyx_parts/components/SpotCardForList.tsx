"use client";

import React from "react";
import { Spot } from "@/mockData/travelcarddata";

interface SpotCardForListProps {
  spot: Spot;
  isSelected: boolean;
  onButtonClick: (spotId: number) => void;
  onClick?: () => void; // 自定义点击处理函数
}

export const SpotCardForList: React.FC<SpotCardForListProps> = ({
  spot,
  isSelected,
  onButtonClick,
  onClick,
}) => {
  // 处理整个卡片的点击
  const handleCardClick = () => {
    if (onClick) {
      onClick(); // 调用自定义点击处理函数
    }
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
              e.currentTarget.src = "/placeholder.jpg";
            }}
          />
        </div>
        <div className="spot-content">
          <h3 className="spot-name">{spot.name}</h3>
          <p className="recommendation-reason">{spot.recommendationReason}</p>
          {/* 不显示右上角的 +/- 按钮 */}
        </div>
      </div>
      <style jsx>{`
        /* 主卡片容器 */
        .spot-card {
          width: 100%;
          min-height: 114px;
          background-color: white;
          border-radius: 16px;
          border: 1px solid rgba(1, 34, 118, 0.05);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
          display: flex;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
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
          width: 100%;
          font-family: "Inter", sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #1b1446;
          margin: 0;
          line-height: 1.2;
          white-space: normal;
          overflow: visible;
          text-overflow: unset;
        }
        .recommendation-reason {
          font-family: "Inter", sans-serif;
          font-size: 12px;
          color: #6b7280;
          line-height: 1.5;
          margin: 0;
          overflow: visible;
          text-overflow: unset;
          display: block;
          -webkit-line-clamp: unset;
          -webkit-box-orient: unset;
        }
      `}</style>
    </>
  );
};
