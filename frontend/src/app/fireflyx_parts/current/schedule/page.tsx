"use client";

import React from "react";
import { ItineraryCard, Button } from "../../components";
import { itineraryData } from "../../data/itineraryData";

export default function SchedulePage() {
  const [selectedTransport2, setSelectedTransport2] = React.useState("步行");
  const [selectedTransport3, setSelectedTransport3] = React.useState("地铁");

  return (
    <div className="h-full overflow-y-auto px-5 pb-24 space-y-4">
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

      {/* Bottom Input + Action (fixed) */}
      <div className="fixed inset-x-0 bottom-0 bg-white px-5 pt-3 shadow-[0_-1px_0_rgba(0,0,0,0.06)] z-50" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="请输入需求"
              className="w-full h-12 rounded-2xl border border-[#EBEBEB] pl-4 pr-20 text-[14px] text-[#404040] outline-none"
              style={{ fontFamily: 'Inter' }}
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-md flex items-center justify-center">
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16.9028V15.385C12 15.2305 12.0564 15.0984 12.1691 14.9888C12.2819 14.8791 12.4177 14.8243 12.5765 14.8243C12.7405 14.8243 12.8789 14.8791 12.9916 14.9888C13.1044 15.0984 13.1607 15.2305 13.1607 15.385V16.8579C13.1607 17.7053 13.3401 18.448 13.6988 19.086C14.0575 19.724 14.5623 20.2199 15.2131 20.5738C15.864 20.9227 16.6275 21.0972 17.5038 21.0972C18.3802 21.0972 19.1412 20.9227 19.7869 20.5738C20.4377 20.2199 20.9425 19.724 21.3012 19.086C21.6599 18.448 21.8393 17.7053 21.8393 16.8579V15.385C21.8393 15.2305 21.8956 15.0984 22.0084 14.9888C22.1211 14.8791 22.2595 14.8243 22.4235 14.8243C22.5823 14.8243 22.7181 14.8791 22.8309 14.9888C22.9436 15.0984 23 15.2305 23 15.385V16.9028C23 17.8798 22.7925 18.747 22.3774 19.5047C21.9674 20.2623 21.3934 20.8704 20.6555 21.329C19.9175 21.7826 19.0592 22.0492 18.0804 22.129V23.871H20.9322C21.0962 23.871 21.2346 23.9259 21.3473 24.0355C21.4601 24.1452 21.5164 24.2798 21.5164 24.4393C21.5164 24.5938 21.4601 24.7259 21.3473 24.8355C21.2346 24.9452 21.0962 25 20.9322 25H14.0678C13.9038 25 13.7654 24.9452 13.6527 24.8355C13.5399 24.7259 13.4836 24.5938 13.4836 24.4393C13.4836 24.2798 13.5399 24.1452 13.6527 24.0355C13.7654 23.9259 13.9038 23.871 14.0678 23.871H16.9196V22.129C15.9408 22.0492 15.0825 21.7826 14.3445 21.329C13.6066 20.8704 13.03 20.2623 12.615 19.5047C12.205 18.747 12 17.8798 12 16.9028ZM14.7058 16.6336V11.9308C14.7058 11.3576 14.8237 10.8517 15.0594 10.4131C15.2951 9.96947 15.6231 9.62305 16.0433 9.37383C16.4635 9.12461 16.9504 9 17.5038 9C18.0522 9 18.5365 9.12461 18.9567 9.37383C19.3769 9.62305 19.7049 9.96947 19.9406 10.4131C20.1763 10.8517 20.2942 11.3576 20.2942 11.9308V16.6336C20.2942 17.2069 20.1763 17.7153 19.9406 18.1589C19.7049 18.5975 19.3769 18.9414 18.9567 19.1907C18.5365 19.4399 18.0522 19.5645 17.5038 19.5645C16.9504 19.5645 16.4635 19.4399 16.0433 19.1907C15.6231 18.9414 15.2951 18.5975 15.0594 18.1589C14.8237 17.7153 14.7058 17.2069 14.7058 16.6336ZM15.8665 16.6336C15.8665 17.1869 16.0151 17.628 16.3124 17.957C16.6147 18.286 17.0119 18.4505 17.5038 18.4505C17.9958 18.4505 18.3904 18.286 18.6876 17.957C18.9849 17.628 19.1335 17.1869 19.1335 16.6336V11.9308C19.1335 11.3776 18.9849 10.9364 18.6876 10.6075C18.3904 10.2785 17.9958 10.114 17.5038 10.114C17.0119 10.114 16.6147 10.2785 16.3124 10.6075C16.0151 10.9364 15.8665 11.3776 15.8665 11.9308V16.6336Z" fill="#0768FD"/>
              </svg>
            </button>
          </div>
          <Button onClick={() => console.log('修改')} variant="primary" size="lg" className="h-12 px-6 whitespace-nowrap">
            修改
          </Button>
        </div>
      </div>
    </div>
  );
}
