"use client";

import React from "react";
import { ActivityData, POIDetails } from "../../types/tripData";

interface SpotDetailHeaderProps {
  activity: ActivityData;
  poiDetails: POIDetails | null;
  onBack: () => void;
}

export default function SpotDetailHeader({
  activity,
  poiDetails,
  onBack,
}: SpotDetailHeaderProps) {
  const name = poiDetails?.name || activity.title || "景点";
  const featuredImage = poiDetails?.photos?.[0]?.url || "/placeholder-spot.jpg";

  return (
    <div className="spot-detail-header">
      {/* 返回按钮 */}
      <button className="back-button" onClick={onBack}>
        <svg
          width="16"
          height="17"
          viewBox="0 0 16 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.7912 7.5051H3.62124L8.50124 2.6251C8.89124 2.2351 8.89124 1.5951 8.50124 1.2051C8.11124 0.815098 7.48124 0.815098 7.09124 1.2051L0.50124 7.7951C0.11124 8.1851 0.11124 8.8151 0.50124 9.2051L7.09124 15.7951C7.48124 16.1851 8.11124 16.1851 8.50124 15.7951C8.89124 15.4051 8.89124 14.7751 8.50124 14.3851L3.62124 9.5051H14.7912C15.3412 9.5051 15.7912 9.0551 15.7912 8.5051C15.7912 7.9551 15.3412 7.5051 14.7912 7.5051Z"
            fill="white"
          />
        </svg>
      </button>

      {/* 景点名称 */}
      <h1 className="spot-title">{name}</h1>

      {/* 背景图片 */}
      <div
        className="header-background"
        style={{ backgroundImage: `url(${featuredImage})` }}
      />

      <style jsx>{`
        .spot-detail-header {
          position: relative;
          height: 200px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 20px;
          color: white;
          overflow: hidden;
        }

        .back-button {
          position: absolute;
          top: 20px;
          left: 20px;
          width: 40px;
          height: 40px;
          background-color: rgba(0, 0, 0, 0.3);
          border-radius: 20px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
        }

        .spot-title {
          font-family: "Inter", sans-serif;
          font-size: 24px;
          font-weight: 600;
          color: white;
          margin: 0;
          z-index: 10;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .header-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-size: cover;
          background-position: center;
          z-index: 1;
        }

        .header-background::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(0, 0, 0, 0.4) 100%
          );
          z-index: 2;
        }
      `}</style>
    </div>
  );
}
