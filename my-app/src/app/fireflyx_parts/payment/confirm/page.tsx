"use client";

import React from "react";
import { PageHeader, PageContainer, ScrollableContent, TransportCard, AttractionCard, HotelCard } from "../../components";
import { 
  BlueTicket24,
  BlueCalendar24,
  OrangeClock12
} from "../../components/Icons";

export default function PaymentConfirm() {
  return (
    <PageContainer>
      <PageHeader title="预订" backHref="/fireflyx_parts/payment/details" />

      <ScrollableContent hasBottomButton className="space-y-4">
        
        {/* Transport Card */}
        <TransportCard>
          <div className="flex items-center gap-2">
            <div className="w-20 h-16 rounded-[7px] bg-[#DDDDDD]" />
            <div className="w-px self-stretch bg-[rgba(1,34,118,0.10)] mx-1" />
            <div className="flex-1 grid gap-2">
              <div className="flex items-center text-[18px] font-semibold text-[#1B1446]" style={{ fontFamily: 'Inter' }}>
                <span>上海</span>
                <svg className="text-[#0768FD] mx-1" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.00002 6.71051C8.61002 7.10051 8.61002 7.73051 9.00002 8.12051L12.88 12.0005L9.00002 15.8805C8.61002 16.2705 8.61002 16.9005 9.00002 17.2905C9.39002 17.6805 10.02 17.6805 10.41 17.2905L15 12.7005C15.39 12.3105 15.39 11.6805 15 11.2905L10.41 6.70051C10.03 6.32051 9.39002 6.32051 9.00002 6.71051Z" fill="currentColor"/>
                </svg>
                <span>北京</span>
              </div>
              <div className="grid gap-1 text-[10px] text-[#808080] uppercase font-medium" style={{ fontFamily: 'Inter', letterSpacing: '0.8px' }}>
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.5 2H9V1.5C9 1.225 8.775 1 8.5 1C8.225 1 8 1.225 8 1.5V2H4V1.5C4 1.225 3.775 1 3.5 1C3.225 1 3 1.225 3 1.5V2H2.5C1.945 2 1.505 2.45 1.505 3L1.5 10C1.5 10.55 1.945 11 2.5 11H9.5C10.05 11 10.5 10.55 10.5 10V3C10.5 2.45 10.05 2 9.5 2ZM9 10H3C2.725 10 2.5 9.775 2.5 9.5V4.5H9.5V9.5C9.5 9.775 9.275 10 9 10ZM4 5.5H5.5C5.775 5.5 6 5.725 6 6V7.5C6 7.775 5.775 8 5.5 8H4C3.725 8 3.5 7.775 3.5 7.5V6C3.5 5.725 3.725 5.5 4 5.5Z" fill="#FF9141"/>
                    </svg>
                    2025.8.24 周五
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 1C3.25 1 1 3.25 1 6C1 8.75 3.25 11 6 11C8.75 11 11 8.75 11 6C11 3.25 8.75 1 6 1ZM7.775 7.9L5.735 6.645C5.585 6.555 5.495 6.395 5.495 6.22V3.875C5.5 3.67 5.67 3.5 5.875 3.5C6.08 3.5 6.25 3.67 6.25 3.875V6.1L8.17 7.255C8.35 7.365 8.41 7.6 8.3 7.78C8.19 7.955 7.955 8.01 7.775 7.9Z" fill="#FF9141"/>
                    </svg>
                    06.00 PM
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="inline-flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.12 3.88C7.535 3.295 6.77 3 6 3V6L3.88 8.12C5.05 9.29 6.95 9.29 8.125 8.12C9.295 6.95 9.295 5.05 8.12 3.88ZM6 1C3.24 1 1 3.24 1 6C1 8.76 3.24 11 6 11C8.76 11 11 8.76 11 6C11 3.24 8.76 1 6 1ZM6 10C3.79 10 2 8.21 2 6C2 3.79 3.79 2 6 2C8.21 2 10 3.79 10 6C10 8.21 8.21 10 6 10Z" fill="#FF9141"/>
                    </svg>
                    3小时
                  </span>
                </div>
              </div>
            </div>
          </div>
        </TransportCard>

        {/* Hotel Card */}
        <HotelCard>
          <div className="flex items-center gap-2">
            <div className="w-20 h-16 rounded-[7px] bg-[#D9D9D9]" />
            <div className="w-px self-stretch bg-[rgba(1,34,118,0.10)] mx-1" />
            <div className="flex-1 grid gap-1">
              <div className="text-[#1B1446] font-semibold text-[18px] leading-[22px]" style={{ fontFamily: 'Inter' }}>
                希尔顿酒店
              </div>
              <div className="grid gap-1 text-[12px] leading-[16px] text-[#808080]" style={{ fontFamily: 'Inter' }}>
                <div className="flex items-center">
                  <span className="inline-flex items-center gap-1">
                    <span className="inline-flex w-4 h-4 items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.5 4.25H4.5V5.25H7.5V4.25Z" fill="#FF9141"/>
                        <path d="M7.82 6H4.185C3.945 6 3.75 6.195 3.75 6.435H3.755V7H8.255V6.435C8.255 6.195 8.06 6 7.82 6Z" fill="#FF9141"/>
                        <path d="M10 1H2C1.45 1 1 1.45 1 2V10C1 10.55 1.45 11 2 11H10C10.55 11 11 10.55 11 10V2C11 1.45 10.55 1 10 1ZM8.625 8.5C8.42 8.5 8.25 8.33 8.25 8.125V7.75H3.75V8.125C3.75 8.33 3.58 8.5 3.375 8.5C3.17 8.5 3 8.33 3 8.125V6.435C3 5.935 3.31 5.51 3.75 5.335V4.5C3.75 3.95 4.2 3.5 4.75 3.5H7.25C7.8 3.5 8.25 3.95 8.25 4.5V5.335C8.69 5.51 9 5.935 9 6.435V8.125C9 8.33 8.83 8.5 8.625 8.5Z" fill="#FF9141"/>
                      </svg>
                    </span>
                    双床房
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center gap-1">
                    <span className="inline-flex w-4 h-4 items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.5 2H9V1.5C9 1.225 8.775 1 8.5 1C8.225 1 8 1.225 8 1.5V2H4V1.5C4 1.225 3.775 1 3.5 1C3.225 1 3 1.225 3 1.5V2H2.5C1.945 2 1.505 2.45 1.505 3L1.5 10C1.5 10.55 1.945 11 2.5 11H9.5C10.05 11 10.5 10.55 10.5 10V3C10.5 2.45 10.05 2 9.5 2ZM9 10H3C2.725 10 2.5 9.775 2.5 9.5V4.5H9.5V9.5C9.5 9.775 9.275 10 9 10ZM4 5.5H5.5C5.775 5.5 6 5.725 6 6V7.5C6 7.775 5.775 8 5.5 8H4C3.725 8 3.5 7.775 3.5 7.5V6C3.5 5.725 3.725 5.5 4 5.5Z" fill="#FF9141"/>
                      </svg>
                    </span>
                    2025.8.24 周五
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="inline-flex w-4 h-4 items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.15705 1.14967C7.34705 0.85467 8.49705 1.01467 9.47205 1.46967C9.64705 1.54967 9.67705 1.78967 9.52205 1.89967C8.22205 2.79967 7.37205 4.29967 7.37205 5.99967C7.37205 7.69967 8.22205 9.19967 9.52205 10.0997C9.68205 10.2097 9.65205 10.4497 9.47705 10.5297C8.83705 10.8297 8.12205 10.9997 7.37205 10.9997C4.34705 10.9997 1.94705 8.30967 2.43705 5.19967C2.74205 3.23967 4.23205 1.61967 6.15705 1.14967Z" fill="#FF9141"/>
                      </svg>
                    </span>
                    2晚
                  </span>
                </div>
              </div>
            </div>
          </div>
        </HotelCard>

        {/* Attraction Booking Details */}
        <AttractionCard className="grid gap-3">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[8px] bg-[#DDDDDD]" />
            <div className="flex-1 text-[#1B1446] font-semibold text-[14px] leading-[17px]" style={{ fontFamily: 'Inter' }}>
              北京颐和园门票
            </div>
          </div>
          <div className="h-px bg-[rgba(0,0,0,0.06)]" />
          <div className="grid gap-2">
            <div className="flex items-start gap-2 text-[14px] leading-[17px] text-[#1B1446]" style={{ fontFamily: 'Inter' }}>
              <span className="inline-flex items-center justify-center w-6 h-6 mt-0">
                <BlueTicket24 />
              </span>
              <div className="grid gap-1">
                <div>入场门票</div>
                <div className="text-[#808080] flex items-center gap-2 text-[10px]">
                  <span>3张</span>
                  <span className="inline-flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 1C5.17 1 4.5 1.67 4.5 2.5S5.17 4 6 4S7.5 3.33 7.5 2.5S6.83 1 6 1ZM6 8.5C4.34 8.5 2.5 9.17 2.5 10V10.5H9.5V10C9.5 9.17 7.66 8.5 6 8.5ZM6 7C7.38 7 8.5 5.88 8.5 4.5S7.38 2 6 2S3.5 3.12 3.5 4.5S4.62 7 6 7Z" fill="#FF9141"/>
                    </svg>
                    2成人，1学生
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
                  <span>2025.8.25</span>
                  <span className="inline-flex items-center gap-1">
                    <OrangeClock12 />
                    19.00 PM
                  </span>
                </div>
              </div>
            </div>
          </div>
        </AttractionCard>
      </ScrollableContent>

      {/* Bottom CTA */}
      <div className="fixed inset-x-0 bottom-0 bg-white px-5 pt-4 shadow-[0_-1px_0_rgba(0,0,0,0.06)]" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)" }}>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-[#808080] text-[14px] font-medium" style={{ fontFamily: 'Inter' }}>总计</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.825 6.9126L10 10.7293L6.175 6.9126L5 8.0876L10 13.0876L15 8.0876L13.825 6.9126Z" fill="#0768FD"/>
              </svg>
            </div>
            <div className="text-[#1B1446] font-bold text-[24px]" style={{ fontFamily: 'Inter' }}>¥2560</div>
          </div>
          <button className="px-8 h-12 rounded-full bg-[#4285F4] text-white font-semibold text-[16px]" style={{ fontFamily: 'Inter' }}>
            立即支付
          </button>
        </div>
      </div>
    </PageContainer>
  );
}