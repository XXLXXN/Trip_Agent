"use clinet";
import React from "react";

const NearbyPlaceCard: React.FC<{
  image: string;
  title: string;
  location: string;
  rating: number;
  price: string;
}> = ({ image, title, location, rating, price }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden w-[343px] h-[114px] flex">
      {/* 图片区域 */}
      <div className="w-[134px] h-full bg-gray-200 rounded-lg overflow-hidden">
        <div
          className="w-full h-full bg-cover"
          style={{ backgroundImage: `url('${image}')` }}
        />
      </div>

      {/* 内容区域 */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-[14px] font-medium text-[#1B1446] mb-1">
            {title}
          </h3>
          {/* 位置和图标 */}
          <div className="flex items-center">
            <svg
              width="12"
              height="13"
              viewBox="0 0 12 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 1.58057C3.9 1.58057 2 3.19057 2 5.68057C2 7.27057 3.225 9.14057 5.67 11.2956C5.86 11.4606 6.145 11.4606 6.335 11.2956C8.775 9.14057 10 7.27057 10 5.68057C10 3.19057 8.1 1.58057 6 1.58057ZM6 6.58057C5.45 6.58057 5 6.13057 5 5.58057C5 5.03057 5.45 4.58057 6 4.58057C6.55 4.58057 7 5.03057 7 5.58057C7 6.13057 6.55 6.58057 6 6.58057Z"
                fill="#808080"
              />
            </svg>

            <span className="text-[10px] text-[#808080] uppercase tracking-wide">
              {location}
            </span>
          </div>
        </div>
        {/* 评分 */}
        <div className="flex items-center justify-end pr-1">
          <div className="flex items-center gap-1">
            <svg
              className="mt-[-2px]"
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.99999 12.1798L10.7667 13.8531C11.2733 14.1598 11.8933 13.7064 11.76 13.1331L11.0267 9.98643L13.4733 7.86643C13.92 7.47976 13.68 6.74643 13.0933 6.69976L9.87332 6.42643L8.61332 3.4531C8.38665 2.9131 7.61332 2.9131 7.38665 3.4531L6.12665 6.41976L2.90665 6.6931C2.31999 6.73976 2.07999 7.4731 2.52665 7.85976L4.97332 9.97976L4.23999 13.1264C4.10665 13.6998 4.72665 14.1531 5.23332 13.8464L7.99999 12.1798Z"
                fill="#FFBE41"
              />
            </svg>

            <span className="text-[12px] text-[#BFBFBF] flex items-center">
              {rating}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NearbyPlaceCard;
