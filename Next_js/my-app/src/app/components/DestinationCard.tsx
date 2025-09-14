"use client";
import React from "react";

const DestinationCard: React.FC<{
  image: string;
  title: string;
  location: string;
  rating: number;
  price: string;
  discount?: string;
}> = ({ image, title, location, rating, price, discount }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm w-[161px] flex-shrink-0">
      {/* 图片区域 */}
      <div className="h-32 bg-gray-200 rounded-xl">
        <div
          className="w-full h-full bg-cover"
          style={{ backgroundImage: `url('${image}')` }}
        />
      </div>

      {/* 内容区域 */}
      <div className="p-2">
        <h3 className="text-[14px] font-medium text-[#1B1446] mb-1">{title}</h3>
        <div className="flex items-center gap-1">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 1.08057C3.9 1.08057 2 2.69057 2 5.18057C2 6.77057 3.225 8.64057 5.67 10.7956C5.86 10.9606 6.145 10.9606 6.335 10.7956C8.775 8.64057 10 6.77057 10 5.18057C10 2.69057 8.1 1.08057 6 1.08057ZM6 6.08057C5.45 6.08057 5 5.63057 5 5.08057C5 4.53057 5.45 4.08057 6 4.08057C6.55 4.08057 7 4.53057 7 5.08057C7 5.63057 6.55 6.08057 6 6.08057Z"
              fill="#808080"
            />
          </svg>
          <span className="text-[10px] text-[#808080] mb-1">{location}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex-grow">
            {discount ? (
              <div>
                <div className="text-[9px] text-[#BFBFBF] line-through font-Italic">
                  {price}
                </div>
                <div className="text-[14px] font-semibold text-[#398B2B] mt-[-4px]">
                  {discount}
                </div>
              </div>
            ) : (
              <span className="text-[14px] font-semibold text-[#0768FD]">
                {price}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <svg
              className="mt-[-2px]"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.99999 11.6798L10.7667 13.3531C11.2733 13.6598 11.8933 13.2064 11.76 12.6331L11.0267 9.48643L13.4733 7.36643C13.92 6.97976 13.68 6.24643 13.0933 6.19976L9.87332 5.92643L8.61332 2.9531C8.38665 2.4131 7.61332 2.4131 7.38665 2.9531L6.12665 5.91976L2.90665 6.1931C2.31999 6.23976 2.07999 6.9731 2.52665 7.35976L4.97332 9.47976L4.23999 12.6264C4.10665 13.1998 4.72665 13.6531 5.23332 13.3464L7.99999 11.6798Z"
                fill="#FFBE41"
              />
            </svg>

            <span className="text-[12px] text-[#BFBFBF]">{rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
