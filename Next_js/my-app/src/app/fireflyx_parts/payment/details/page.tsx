"use client";

import React from "react";
import { PageHeader, PageContainer, ScrollableContent, ItineraryCard, FixedBottomButton } from "../../components";
import { itineraryData } from "../../data/itineraryData";

export default function PaymentDetails() {
  const [selectedTransport2, setSelectedTransport2] = React.useState("步行");
  const [selectedTransport3, setSelectedTransport3] = React.useState("地铁");

  return (
    <PageContainer>
      <PageHeader title="行程表" backHref="/" />

      <ScrollableContent hasBottomButton className="space-y-4">
        {/* Day 1 header */}
        <div className="flex items-center gap-3">
          <div className="text-black font-semibold text-[18px] leading-[22px]" style={{ fontFamily: 'Inter' }}>第一天</div>
          <div className="text-[#858585] font-semibold text-[14px] leading-[17px]" style={{ fontFamily: 'Inter' }}>上午6：00</div>
        </div>

        {/* Transport 1: 上海 → 北京 */}
        <ItineraryCard
          type="transport"
          data={itineraryData.transport[0]}
          showImage={true}
        />

        {/* Transport 2: 飞机场 → 颐和园 */}
        <ItineraryCard
          type="transport"
          data={itineraryData.transport[1]}
          showImage={false}
        />

        {/* Transport Tags Row 2 */}
        <div className="flex gap-3 justify-between px-2 py-3">
          {["地铁", "步行", "骑行", "驾车"].map((option) => (
            <button
              key={option}
              onClick={() => setSelectedTransport2(option)}
              className={`w-16 h-8 rounded-full text-[12px] font-semibold flex items-center justify-center transition-colors touch-manipulation cursor-pointer ${
                selectedTransport2 === option
                  ? "bg-[#0768FD] text-white"
                  : "bg-[#DDDDDD] text-[#1B1446] hover:bg-[#CCCCCC]"
              }`}
              style={{ 
                fontFamily: 'Inter',
                minHeight: '32px',
                minWidth: '64px',
                touchAction: 'manipulation'
              }}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Sight 1 header */}
        <div className="flex items-center gap-3 mt-2">
          <div className="text-[#1B1446] font-semibold text-[20px] leading-[24px]" style={{ fontFamily: 'Inter' }}>景点一</div>
          <div className="text-[#808080] font-semibold text-[14px] leading-[17px]" style={{ fontFamily: 'Inter' }}>上午10：00</div>
        </div>

        {/* Attraction Card */}
        <ItineraryCard
          type="attraction"
          data={itineraryData.attractions[0]}
        />

        {/* Transport 3: 颐和园 → 景点二 */}
        <ItineraryCard
          type="transport"
          data={itineraryData.transport[2]}
          showImage={false}
        />

        {/* Transport Tags Row 3 */}
        <div className="flex gap-3 justify-between px-2 py-3">
          {["地铁", "步行", "骑行", "驾车"].map((option) => (
            <button
              key={option}
              onClick={() => setSelectedTransport3(option)}
              className={`w-16 h-8 rounded-full text-[12px] font-semibold flex items-center justify-center transition-colors touch-manipulation cursor-pointer ${
                selectedTransport3 === option
                  ? "bg-[#0768FD] text-white"
                  : "bg-[#DDDDDD] text-[#1B1446] hover:bg-[#CCCCCC]"
              }`}
              style={{ 
                fontFamily: 'Inter',
                minHeight: '32px',
                minWidth: '64px',
                touchAction: 'manipulation'
              }}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Sight 2 header */}
        <div className="flex items-center gap-3 mt-2">
          <div className="text-[#1B1446] font-semibold text-[20px] leading-[24px]" style={{ fontFamily: 'Inter' }}>景点二</div>
          <div className="text-[#808080] font-semibold text-[14px] leading-[17px]" style={{ fontFamily: 'Inter' }}>下午14：00</div>
        </div>

        {/* Attraction Card 2 */}
        <ItineraryCard
          type="attraction"
          data={itineraryData.attractions[1]}
        />

        {/* Hotel header */}
        <div className="flex items-center gap-3 mt-2">
          <div className="text-[#1B1446] font-semibold text-[20px] leading-[24px]" style={{ fontFamily: 'Inter' }}>酒店</div>
          <div className="text-[#808080] font-semibold text-[14px] leading-[17px]" style={{ fontFamily: 'Inter' }}>下午18：00</div>
        </div>

        {/* Hotel Card */}
        <ItineraryCard
          type="hotel"
          data={itineraryData.hotels[0]}
        />

        {/* Day 2 header */}
        <div className="flex items-center gap-3 mt-2">
          <div className="text-black font-semibold text-[18px] leading-[22px]" style={{ fontFamily: 'Inter' }}>第二天</div>
          <div className="text-[#858585] font-semibold text-[14px] leading-[17px]" style={{ fontFamily: 'Inter' }}>上午10：00</div>
        </div>

        {/* Transport 4: 颐和园 → 景点二 */}
        <ItineraryCard
          type="transport"
          data={itineraryData.transport[3]}
          showImage={false}
        />
      </ScrollableContent>

      <FixedBottomButton href="/fireflyx_parts/payment/confirm">
        立即预订
      </FixedBottomButton>
    </PageContainer>
  );
}