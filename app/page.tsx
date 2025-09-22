"use client";

import React from "react";
// 附近地点推荐卡片组件
import NearbyPlaceCard from "@/app/components/NearbyPlaceCard";
import DestinationCard from "@/app/components/DestinationCard";
import BottomNav from "@/app/components/BottomNav";
import { nearbyPlaces, destinations } from "@/app/mockData/HomePage";
export default function Home() {
  return (
    /* 页面主容器 */
    <main className="min-h-screen bg-white">
      {/* 顶部区域 */}
      <div className="grid w-full h-39">
        {/* 顶部渐变背景 */}
        <div className="bg-[url('/Home_Top.svg')] h-31 bg-cover bg-center grid grid-cols-1 gap-y-4 pt-[5px]">
          {/* 状态栏占位 */}
          <div className="h-12"></div>
          {/* 位置信息 */}
          <div className="px-4 h-[54px] flex py-2">
            {/* 标语与位置字体 */}
            <div className="text-white flex-1">
              <p className="text-[10px] uppercase tracking-wide">
                美好的旅程始于现在
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <h1 className="text-xl font-semibold">上海, 中国</h1>
                  {/*figma直接复制来的svg */}
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6.35147 8.7515C6.8201 8.28287 7.5799 8.28287 8.04853 8.7515L12 12.703L15.9515 8.7515C16.4201 8.28287 17.1799 8.28287 17.6485 8.7515C18.1172 9.22013 18.1172 9.97992 17.6485 10.4486L12.8485 15.2486C12.3799 15.7172 11.6201 15.7172 11.1515 15.2486L6.35147 10.4486C5.88284 9.97992 5.88284 9.22013 6.35147 8.7515Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </div>
            </div>
            {/* 联系客服按钮 */}
            <button className="bg-[#E4F1FF] backdrop-blur-lg rounded-full px-4 py-3 text-sm font-semibold flex items-center justify-center text-[#2065A9]">
              联系客服
            </button>
          </div>
        </div>
      </div>
      {/* 旅游规划提示 */}
      <section className="h-29 felx px-4">
        <div className="bg-[url('/HomePage/TripPlan_Placeholder.jpg')] bg-cover rounded-xl h-full ">
          <h3
            className="text-base font-semibold text-[#1E1E1E]
          pt-4 pl-4 mb-1"
          >
            旅游规划
          </h3>
          <p className="text-xs text-[#8C8C8C] pl-4">点击开启美好旅程</p>
        </div>
      </section>
      {/* 主要内容区域 */}
      <section className="h-116 flex flex-col gap-4">
        {/* 当前规划区域 */}
        <section className="pt-7 px-4">
          {/* 当前位置信息 */}
          <div className="flex mb-4 justify-between flex-grow h-[34px]">
            {/* 当前图标与“当前” */}
            <div className="flex items-center py-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.791 3.1153L3.55767 8.23196C2.86601 8.52363 2.88267 9.50696 3.57434 9.77363L8.02434 11.4986C8.24101 11.582 8.41601 11.757 8.49934 11.9736L10.216 16.4153C10.4827 17.1153 11.4743 17.132 11.766 16.4403L16.891 4.2153C17.166 3.52363 16.4743 2.83196 15.791 3.1153Z"
                  fill="#FF9141"
                />
              </svg>

              <h2 className="text-sm font-semibold text-[#1B1446] pl-1">
                当前
              </h2>
            </div>
            {/* 当前位置与定位按钮 */}
            <div className="flex items-center gap-2">
              {/* 当前位置*/}
              <div className="flex-col items-end">
                <div className="text-[10px] text-[#808080] text-right uppercase tracking-wide">
                  当前位置
                </div>
                {/* 当前位置名称与下拉箭头 */}
                <div className="flex items-center">
                  <div className="text-xs font-semibold text-[#1B1446] ">
                    Sleman, Yogyakarta
                  </div>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.70503 5.10505C3.97839 4.83168 4.42161 4.83168 4.69497 5.10505L7 7.41007L9.30503 5.10505C9.57839 4.83168 10.0216 4.83168 10.295 5.10505C10.5683 5.37842 10.5683 5.82163 10.295 6.095L7.49497 8.895C7.22161 9.16837 6.77839 9.16837 6.50503 8.895L3.70503 6.095C3.43166 5.82163 3.43166 5.37842 3.70503 5.10505Z"
                      fill="#1B1446"
                    />
                  </svg>
                </div>
              </div>
              {/* 定位按钮 */}
              <button className="bg-[#0768FD]/10 rounded-lg h-full px-[2px]">
                {/*figma直接复制来的定位svg */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_1_1313)">
                    <path
                      d="M8.00002 5.33329C6.52669 5.33329 5.33335 6.52663 5.33335 7.99996C5.33335 9.47329 6.52669 10.6666 8.00002 10.6666C9.47335 10.6666 10.6667 9.47329 10.6667 7.99996C10.6667 6.52663 9.47335 5.33329 8.00002 5.33329ZM13.96 7.33329C13.6534 4.55329 11.4467 2.34663 8.66669 2.03996V1.33329C8.66669 0.966626 8.36669 0.666626 8.00002 0.666626C7.63335 0.666626 7.33335 0.966626 7.33335 1.33329V2.03996C4.55335 2.34663 2.34669 4.55329 2.04002 7.33329H1.33335C0.966687 7.33329 0.666687 7.63329 0.666687 7.99996C0.666687 8.36663 0.966687 8.66663 1.33335 8.66663H2.04002C2.34669 11.4466 4.55335 13.6533 7.33335 13.96V14.6666C7.33335 15.0333 7.63335 15.3333 8.00002 15.3333C8.36669 15.3333 8.66669 15.0333 8.66669 14.6666V13.96C11.4467 13.6533 13.6534 11.4466 13.96 8.66663H14.6667C15.0334 8.66663 15.3334 8.36663 15.3334 7.99996C15.3334 7.63329 15.0334 7.33329 14.6667 7.33329H13.96ZM8.00002 12.6666C5.42002 12.6666 3.33335 10.58 3.33335 7.99996C3.33335 5.41996 5.42002 3.33329 8.00002 3.33329C10.58 3.33329 12.6667 5.41996 12.6667 7.99996C12.6667 10.58 10.58 12.6666 8.00002 12.6666Z"
                      fill="#0768FD"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1_1313">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </button>
            </div>
          </div>

          {/* 附近地点卡片 */}
          <div className="space-y-3">
            {nearbyPlaces.map((place, index) => (
              <NearbyPlaceCard key={index} {...place} />
            ))}
          </div>
        </section>

        {/* 推荐目的地区域 */}
        <section className="px-4 h-65">
          {/* 好地推荐标题与按钮 */}
          <div className="flex items-center justify-between h-6 mb-4">
            {/* 好地推荐与图标 */}
            <div className="flex items-center gap-1 flex-grow">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.8333 1.42395H4.16667C3.25 1.42395 2.5 2.17395 2.5 3.09062V14.7573C2.5 15.674 3.25 16.424 4.16667 16.424H7.5L9.40833 18.3323C9.73333 18.6573 10.2583 18.6573 10.5833 18.3323L12.5 16.424H15.8333C16.75 16.424 17.5 15.674 17.5 14.7573V3.09062C17.5 2.17395 16.75 1.42395 15.8333 1.42395ZM11.5667 10.4906L10 13.924L8.43333 10.4906L5 8.92395L8.43333 7.35728L10 3.92395L11.5667 7.35728L15 8.92395L11.5667 10.4906Z"
                  fill="#FF9141"
                />
              </svg>

              <h2 className="text-[14px] font-semibold text-[#1B1B446]">
                好地推荐
              </h2>
            </div>

            <button className="bg-[#0768FD]/10 rounded-full px-2 h-full flex items-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.00002 6.71063C8.61002 7.10063 8.61002 7.73063 9.00002 8.12063L12.88 12.0006L9.00002 15.8806C8.61002 16.2706 8.61002 16.9006 9.00002 17.2906C9.39002 17.6806 10.02 17.6806 10.41 17.2906L15 12.7006C15.39 12.3106 15.39 11.6806 15 11.2906L10.41 6.70063C10.03 6.32063 9.39002 6.32063 9.00002 6.71063Z"
                  fill="#0768FD"
                />
              </svg>
            </button>
          </div>

          {/* 水平滚动的目的地卡片 */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {destinations.map((destination, index) => (
              <DestinationCard key={index} {...destination} />
            ))}
          </div>
        </section>
      </section>
      {/* 底部导航栏 */}
      <BottomNav />
    </main>
  );
}
