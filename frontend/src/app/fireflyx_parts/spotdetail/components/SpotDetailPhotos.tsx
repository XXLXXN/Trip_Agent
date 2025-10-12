"use client";

import React from "react";

interface SpotDetailPhotosProps {
  photos: Array<{ url: string; title?: string }>;
}

export default function SpotDetailPhotos({ photos }: SpotDetailPhotosProps) {
  return (
    <div className="spot-detail-photos">
      <div className="photos-card">
        <h3 className="photos-title">照片</h3>
        <div className="photos-gallery">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="photo-item"
              style={{ backgroundImage: `url(${photo.url})` }}
            >
              {photo.title && (
                <div className="photo-title">{photo.title}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .spot-detail-photos {
          padding: 0 16px;
        }

        .photos-card {
          background-color: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .photos-title {
          font-family: "Inter", sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #1b1446;
          margin: 0 0 16px 0;
        }

        .photos-gallery {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding-bottom: 8px;
        }

        .photo-item {
          min-width: 120px;
          height: 80px;
          border-radius: 12px;
          background-size: cover;
          background-position: center;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
        }

        .photo-title {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.7) 0%,
            transparent 100%
          );
          color: white;
          font-family: "Inter", sans-serif;
          font-size: 12px;
          font-weight: 500;
          padding: 8px 12px 8px 12px;
          text-align: center;
        }

        /* 滚动条样式 */
        .photos-gallery::-webkit-scrollbar {
          height: 4px;
        }

        .photos-gallery::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 2px;
        }

        .photos-gallery::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 2px;
        }

        .photos-gallery::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  );
}
