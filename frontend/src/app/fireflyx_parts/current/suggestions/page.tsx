"use client";

import React from "react";
import { ScrollableContent, Card } from "../../components";

export default function SuggestionsPage() {
  return (
    <ScrollableContent className="px-4">
      {/* Header Section */}
      <div className="py-4">
        <h2
          className="text-[#1B1446] font-semibold text-[18px] leading-[22px] mb-2"
          style={{ fontFamily: "Inter" }}
        >
          建议
        </h2>
        <p
          className="text-[#808080] text-[14px] leading-[17px]"
          style={{ fontFamily: "Inter" }}
        >
          去北京旅行，可以带上这些物品哦
        </p>
      </div>

      {/* Options List */}
      <div className="space-y-4">
        {/* Request Personal Data */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3
                className="text-[#1B1446] font-semibold text-[14px] leading-[17px] mb-1"
                style={{ fontFamily: "Inter" }}
              >
                防晒霜
              </h3>
              <p
                className="text-[#808080] text-[12px] leading-[15px]"
                style={{ fontFamily: "Inter" }}
              >
                七月的北京天气炎热，防晒霜可以保护皮肤免受紫外线伤害。
              </p>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 4L10 8L6 12"
                stroke="#0768FD"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </Card>

        {/* Delete Account */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3
                className="text-[#1B1446] font-semibold text-[14px] leading-[17px] mb-1"
                style={{ fontFamily: "Inter" }}
              >
                小风扇
              </h3>
              <p
                className="text-[#808080] text-[12px] leading-[15px]"
                style={{ fontFamily: "Inter" }}
              >
                景点排队大多没有遮阳，携带小风扇可以帮助降温。
              </p>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 4L10 8L6 12"
                stroke="#0768FD"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </Card>
      </div>
    </ScrollableContent>
  );
}
