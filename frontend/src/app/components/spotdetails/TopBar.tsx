// components/TopBar.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface TopBarProps {
  featuredImage: string;
}

const TopBar = ({ featuredImage }: TopBarProps) => {
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(false);

  const handleBackClick = () => {
    router.push("/spotslist");
  };

  const handleFavoriteClick = async () => {
    // Optimistically update UI and send request to the server.
    setIsFavorited(!isFavorited);
    try {
      await fetch("/api/favorite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ favorited: !isFavorited }),
      });
    } catch (error) {
      console.error("Favorite action failed:", error);
      // Optional: Revert UI state on API failure.
      setIsFavorited(isFavorited);
    }
  };

  return (
    <div className="top-bar-container">
      <div className="top-bar-buttons">
        <button className="back-button" onClick={handleBackClick}>
          <svg
            width="56"
            height="37"
            viewBox="0 0 56 37"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="56"
              height="37"
              rx="18.5"
              fill="white"
              fillOpacity="0.2"
            />
            <path
              d="M34.7912 17.505H23.6212L28.5012 12.625C28.8912 12.235 28.8912 11.595 28.5012 11.205C28.1112 10.815 27.4812 10.815 27.0912 11.205L20.5012 17.795C20.1112 18.185 20.1112 18.815 20.5012 19.205L27.0912 25.795C27.4812 26.185 28.1112 26.185 28.5012 25.795C28.8912 25.405 28.8912 24.775 28.5012 24.385L23.6212 19.505H34.7912C35.3412 19.505 35.7912 19.055 35.7912 18.505C35.7912 17.955 35.3412 17.505 34.7912 17.505Z"
              fill="white"
            />
          </svg>
        </button>

        <button className="favorite-button" onClick={handleFavoriteClick}>
          <svg
            width="56"
            height="37"
            viewBox="0 0 56 37"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="56"
              height="37"
              rx="18.5"
              fill="white"
              fillOpacity="0.2"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={isFavorited ? "#FF4500" : "white"}
              stroke={isFavorited ? "#FF4500" : "white"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              x="16" // Horizontally centered: (56-24)/2 = 16
              y="6.5" // Vertically centered: (37-24)/2 = 6.5
            >
              <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
            </svg>
          </svg>
        </button>
      </div>
      <style jsx>{`
        .top-bar-container {
          background-color: rgba(0, 0, 0, 0.4);
          position: relative;
          width: 100%;
          height: 293px;
          background-image: url(${featuredImage});
          background-size: cover;
          background-position: center;
        }
        .top-bar-buttons {
          position: absolute;
          top: 60px;
          width: 100%;
          display: flex;
          justify-content: space-between;
          padding: 0 16px;
        }
        .back-button,
        .favorite-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }
      `}</style>
    </div>
  );
};

export default TopBar;
