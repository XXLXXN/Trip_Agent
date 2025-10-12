"use client";

import React from "react";

interface SpotDetailLocationProps {
  address: string;
  onOpenMap: () => void;
}

export default function SpotDetailLocation({
  address,
  onOpenMap,
}: SpotDetailLocationProps) {
  return (
    <div className="spot-detail-location">
      <div className="location-card" onClick={onOpenMap}>
        <div className="location-icon">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18Z"
              fill="#0768fd"
            />
            <path
              d="M10 5C7.79 5 6 6.79 6 9C6 11.21 7.79 13 10 13C12.21 13 14 11.21 14 9C14 6.79 12.21 5 10 5ZM10 11C8.9 11 8 10.1 8 9C8 7.9 8.9 7 10 7C11.1 7 12 7.9 12 9C12 10.1 11.1 11 10 11Z"
              fill="#0768fd"
            />
          </svg>
        </div>
        <div className="location-content">
          <div className="location-label">地址</div>
          <div className="location-address">{address}</div>
        </div>
        <div className="location-arrow">
          <svg
            width="8"
            height="13"
            viewBox="0 0 8 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.00002 1.21051C0.61002 1.60051 0.61002 2.23051 1.00002 2.62051L4.88002 6.50051L1.00002 10.3805C0.61002 10.7705 0.61002 11.4005 1.00002 11.7905C1.39002 12.1805 2.02002 12.1805 2.41002 11.7905L7.00002 7.20051C7.39002 6.81051 7.39002 6.18051 7.00002 5.79051L2.41002 1.20051C2.03002 0.82051 1.39002 0.82051 1.00002 1.21051Z"
              fill="#0768fd"
            />
          </svg>
        </div>
      </div>

      <style jsx>{`
        .spot-detail-location {
          padding: 0 16px;
        }

        .location-card {
          background-color: white;
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .location-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .location-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background-color: #f0f7ff;
          border-radius: 12px;
          flex-shrink: 0;
        }

        .location-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .location-label {
          font-family: "Inter", sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: #808080;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .location-address {
          font-family: "Inter", sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #1b1446;
          line-height: 1.4;
        }

        .location-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}
