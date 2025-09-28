"use client";

import React from "react";
import { TransportCard, AttractionCard, HotelCard } from "./Card";
import { TransportButton, transportOptions } from "./TransportButton";
import {
  OrangeCalendar12,
  OrangeTimeSlice12,
  OrangeClock12,
  OrangeBed12,
  OrangeMoon12,
  BlueTicket24,
  BlueCalendar24,
  BlueChevronRight24,
  OrangePerson12
} from "./Icons";

interface TransportInfo {
  from: string;
  to: string;
  date?: string;
  time?: string;
  duration?: string;
  imageUrl?: string;
}

interface AttractionInfo {
  name: string;
  imageUrl?: string;
  tickets: {
    type: string;
    count: string;
    people: string;
  };
  showTime: {
    date: string;
    time: string;
  };
}

interface HotelInfo {
  name: string;
  imageUrl?: string;
  roomType: string;
  checkIn: string;
  nights: string;
}

interface ItineraryCardProps {
  type: "transport" | "attraction" | "hotel";
  data: TransportInfo | AttractionInfo | HotelInfo;
  showImage?: boolean;
}

export const ItineraryCard: React.FC<ItineraryCardProps> = ({
  type,
  data,
  showImage = true
}) => {
  if (type === "transport") {
    const transportData = data as TransportInfo;
    return (
      <>
        <TransportCard>
          <div className="flex items-center gap-2">
            {showImage && <div className="w-20 h-16 rounded-[7px] bg-[#DDDDDD]" />}
            {showImage && <div className="w-px self-stretch bg-[rgba(1,34,118,0.10)] mx-1" />}
            <div className="flex-1 grid gap-2">
              <div className="flex items-center text-[18px] font-semibold text-[#1B1446]" style={{ fontFamily: 'Inter' }}>
                <span>{transportData.from}</span>
                <BlueChevronRight24 className="text-[#0768FD] mx-1" />
                <span>{transportData.to}</span>
              </div>
              <div className="grid gap-1 text-[10px] text-[#808080] uppercase font-medium" style={{ fontFamily: 'Inter', letterSpacing: '0.8px' }}>
                {transportData.date && transportData.time && (
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center gap-1">
                      <OrangeCalendar12 />
                      {transportData.date}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <OrangeClock12 />
                      {transportData.time}
                    </span>
                  </div>
                )}
                {transportData.time && !transportData.date && (
                  <div className="flex items-center">
                    <span className="inline-flex items-center gap-1">
                      <OrangeClock12 />
                      {transportData.time}
                    </span>
                  </div>
                )}
                {transportData.duration && (
                  <div className="flex items-center">
                    <span className="inline-flex items-center gap-1">
                      <OrangeTimeSlice12 />
                      {transportData.duration}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TransportCard>
      </>
    );
  }

  if (type === "attraction") {
    const attractionData = data as AttractionInfo;
    return (
      <AttractionCard className="grid gap-3">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-[8px] bg-[#DDDDDD]" />
          <div className="flex-1 text-[#1B1446] font-semibold text-[14px] leading-[17px]" style={{ fontFamily: 'Inter' }}>
            {attractionData.name}
          </div>
        </div>
        <div className="h-px bg-[rgba(0,0,0,0.06)]" />
        <div className="grid gap-2">
          <div className="flex items-start gap-2 text-[14px] leading-[17px] text-[#1B1446]" style={{ fontFamily: 'Inter' }}>
            <span className="inline-flex items-center justify-center w-6 h-6 mt-0">
              <BlueTicket24 />
            </span>
            <div className="grid gap-1">
              <div>{attractionData.tickets.type}</div>
              <div className="text-[#808080] flex items-center gap-2 text-[10px]">
                <span>{attractionData.tickets.count}</span>
                <span className="inline-flex items-center gap-1">
                  <OrangePerson12 />
                  {attractionData.tickets.people}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2 text-[14px] leading-[17px] text-[#1B1446]" style={{ fontFamily: 'Inter' }}>
            <span className="inline-flex items-center justify-center w-6 h-6 mt-0">
              <BlueCalendar24 />
            </span>
            <div className="grid gap-1">
              <div>演出时间</div>
              <div className="text-[#808080] flex items-center gap-2 text-[10px]">
                <span>{attractionData.showTime.date}</span>
                <span className="inline-flex items-center gap-1">
                  <OrangeClock12 />
                  {attractionData.showTime.time}
                </span>
              </div>
            </div>
          </div>
        </div>
      </AttractionCard>
    );
  }

  if (type === "hotel") {
    const hotelData = data as HotelInfo;
    return (
      <HotelCard>
        <div className="flex items-center gap-2">
          <div className="w-20 h-16 rounded-[7px] bg-[#DDDDDD]" />
          <div className="w-px self-stretch bg-[rgba(1,34,118,0.10)] mx-1" />
          <div className="flex-1 grid gap-1">
            <div className="text-[#1B1446] font-semibold text-[18px] leading-[22px]" style={{ fontFamily: 'Inter' }}>
              {hotelData.name}
            </div>
            <div className="grid gap-1 text-[12px] leading-[16px] text-[#808080]" style={{ fontFamily: 'Inter' }}>
              <div className="flex items-center">
                <span className="inline-flex items-center gap-1">
                  <span className="inline-flex w-4 h-4 items-center justify-center">
                    <OrangeBed12 />
                  </span>
                  {hotelData.roomType}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center gap-1">
                  <span className="inline-flex w-4 h-4 items-center justify-center">
                    <OrangeCalendar12 />
                  </span>
                  {hotelData.checkIn}
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="inline-flex w-4 h-4 items-center justify-center">
                    <OrangeMoon12 />
                  </span>
                  {hotelData.nights}
                </span>
              </div>
            </div>
          </div>
        </div>
      </HotelCard>
    );
  }

  return null;
};
