"use client";

import React from "react";
import { ItineraryCard, FixedBottomButton } from "../../components";
import { itineraryData } from "../../data/itineraryData";

export default function AccountPage() {
  return (
    <div className="h-full overflow-y-auto px-5 pb-24 space-y-4">
      {/* 票务 Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between py-4 border-b border-[#C2C2C2]">
          <div className="text-[#1B1446] font-semibold text-[16px]" style={{ fontFamily: 'Inter' }}>票务</div>
          <div className="text-[#1B1446] font-semibold text-[16px]" style={{ fontFamily: 'Inter' }}>¥1800</div>
        </div>
        
        {/* 票务详细信息卡片 */}
        <div className="space-y-4">
          {/* Transport Card */}
          <ItineraryCard
            type="transport"
            data={itineraryData.transport[0]}
          />

          {/* Hotel Card */}
          <ItineraryCard
            type="hotel"
            data={itineraryData.hotels[0]}
          />

          {/* Attraction Card */}
          <ItineraryCard
            type="attraction"
            data={itineraryData.attractions[0]}
          />
        </div>
      </div>

      {/* 美食 Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between py-4 border-b border-[#C2C2C2]">
          <div className="text-[#1B1446] font-semibold text-[16px]" style={{ fontFamily: 'Inter' }}>美食</div>
          <div className="text-[#1B1446] font-semibold text-[16px]" style={{ fontFamily: 'Inter' }}>¥420</div>
        </div>
        
        {/* 美食详细信息 - 暂时没有记录 */}
        <div className="rounded-[16px] border border-[rgba(1,34,118,0.05)] bg-white p-4">
          <div className="text-[#808080] text-[14px]" style={{ fontFamily: 'Inter' }}>暂无美食记录</div>
        </div>
      </div>

      {/* Bottom Summary */}
      <div className="fixed inset-x-0 bottom-0 bg-white px-5 pt-4 shadow-[0_-1px_0_rgba(0,0,0,0.06)]" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-[#808080] text-[14px] font-medium" style={{ fontFamily: 'Inter' }}>总计</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.825 6.9126L10 10.7293L6.175 6.9126L5 8.0876L10 13.0876L15 8.0876L13.825 6.9126Z" fill="#0768FD"/>
              </svg>
            </div>
            <div className="text-[#1B1446] font-bold text-[24px]" style={{ fontFamily: 'Inter' }}>¥2560</div>
          </div>
          <button className="px-8 h-12 rounded-full bg-[#4285F4] text-white font-semibold text-[16px]" style={{ fontFamily: 'Inter', border: 'none', cursor: 'pointer' }}>
            继续记账
          </button>
        </div>
      </div>
    </div>
  );
}