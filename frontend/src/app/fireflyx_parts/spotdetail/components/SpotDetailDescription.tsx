"use client";

import React, { useState } from "react";

interface SpotDetailDescriptionProps {
  description: string;
}

export default function SpotDetailDescription({
  description,
}: SpotDetailDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 100;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const displayText = isExpanded
    ? description
    : description.slice(0, maxLength) +
      (description.length > maxLength ? "..." : "");

  return (
    <div className="spot-detail-description">
      <div className="description-card">
        <h3 className="description-title">简介</h3>
        <p className="description-text">
          {displayText}
          {description.length > maxLength && (
            <span className="expand-button" onClick={toggleExpanded}>
              {isExpanded ? " 收起" : " 展开全部"}
            </span>
          )}
        </p>
      </div>

      <style jsx>{`
        .spot-detail-description {
          padding: 0 16px;
        }

        .description-card {
          background-color: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .description-title {
          font-family: "Inter", sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #1b1446;
          margin: 0 0 12px 0;
        }

        .description-text {
          font-family: "Inter", sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: #808080;
          line-height: 1.6;
          margin: 0;
        }

        .expand-button {
          font-family: "Inter", sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #0768fd;
          cursor: pointer;
          margin-left: 4px;
        }

        .expand-button:hover {
          color: #0656d1;
        }
      `}</style>
    </div>
  );
}
