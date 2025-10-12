"use client";

import React from "react";
import { ActivityData, POIDetails } from "../../types/tripData";

interface SpotDetailInfoProps {
  activity: ActivityData;
  poiDetails: POIDetails | null;
}

export default function SpotDetailInfo({
  activity,
  poiDetails,
}: SpotDetailInfoProps) {
  const name = poiDetails?.name || activity.title || "景点";
  const rating = poiDetails?.rating || "4.5";
  const cost = poiDetails?.cost || activity.cost;

  return (
    <div className="spot-detail-info">
      <div className="info-card">
        <h2 className="spot-name">{name}</h2>
        
        <div className="info-row">
          <div className="info-item">
            <div className="info-label">评分</div>
            <div className="info-value">
              <span className="rating-score">{rating}</span>
              <span className="rating-star">★</span>
            </div>
          </div>
          
          <div className="info-item">
            <div className="info-label">费用</div>
            <div className="info-value">¥{cost}</div>
          </div>
        </div>

        <div className="info-row">
          <div className="info-item">
            <div className="info-label">时间</div>
            <div className="info-value">
              {activity.start_time} - {activity.end_time}
            </div>
          </div>
          
          <div className="info-item">
            <div className="info-label">类型</div>
            <div className="info-value">景点</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .spot-detail-info {
          padding: 0 16px;
          margin-top: -20px;
          position: relative;
          z-index: 10;
        }

        .info-card {
          background-color: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .spot-name {
          font-family: "Inter", sans-serif;
          font-size: 20px;
          font-weight: 600;
          color: #1b1446;
          margin: 0 0 16px 0;
        }

        .info-row {
          display: flex;
          gap: 16px;
          margin-bottom: 12px;
        }

        .info-row:last-child {
          margin-bottom: 0;
        }

        .info-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .info-label {
          font-family: "Inter", sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: #808080;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-value {
          font-family: "Inter", sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #1b1446;
        }

        .rating-score {
          color: #ff9141;
          font-weight: 600;
        }

        .rating-star {
          color: #ff9141;
          margin-left: 4px;
        }
      `}</style>
    </div>
  );
}
