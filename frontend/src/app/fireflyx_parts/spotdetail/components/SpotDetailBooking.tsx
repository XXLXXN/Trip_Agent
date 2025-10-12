"use client";

import React from "react";

interface SpotDetailBookingProps {
  cost: number;
  onBook: () => void;
}

export default function SpotDetailBooking({
  cost,
  onBook,
}: SpotDetailBookingProps) {
  return (
    <div className="spot-detail-booking">
      <div className="booking-card">
        <div className="booking-info">
          <div className="booking-price">¥{cost}</div>
          <div className="booking-label">门票价格</div>
        </div>
        <button className="booking-button" onClick={onBook}>
          立即预订
        </button>
      </div>

      <style jsx>{`
        .spot-detail-booking {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: white;
          border-top: 1px solid #e5e7eb;
          padding: 16px;
          z-index: 50;
        }

        .booking-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 375px;
          margin: 0 auto;
        }

        .booking-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .booking-price {
          font-family: "Inter", sans-serif;
          font-size: 20px;
          font-weight: 600;
          color: #1b1446;
        }

        .booking-label {
          font-family: "Inter", sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: #808080;
        }

        .booking-button {
          background-color: #0768fd;
          color: white;
          border: none;
          border-radius: 12px;
          padding: 12px 24px;
          font-family: "Inter", sans-serif;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .booking-button:hover {
          background-color: #0656d1;
        }

        .booking-button:active {
          background-color: #054bb8;
        }
      `}</style>
    </div>
  );
}
