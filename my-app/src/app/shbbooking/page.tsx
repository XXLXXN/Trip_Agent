// src/app/page.tsx
'use client';

// 在顶部引入 useEffect
import { useState, useEffect } from 'react';
import type { NextPage } from 'next';

// 数据导入
import { flightData, passengerData as initialPassengerData, insuranceData, totalAmount, PassengerInfo } from '@/mockData/shbbookingData';

// 组件导入
import BookingHeader from '@/components/shbbooking/BookingHeader';
import SectionHeader from '@/components/shbbooking/SectionHeader';
import FlightDetailsCard from '@/components/shbbooking/FlightDetailsCard';
import PassengerInfoCard from '@/components/shbbooking/PassengerInfoCard';
import BaggageCard from '@/components/shbbooking/BaggageCard';
import InsuranceCard from '@/components/shbbooking/InsuranceCard';
import BookingFooter from '@/components/shbbooking/BookingFooter';

// 为 localStorage 定义一个唯一的键名，避免冲突
const PASSENGER_STORAGE_KEY = 'passengerData';

const BookingPage: NextPage = () => {
  // 1. useState 的初始值先用文件里的默认值
  const [passenger, setPassenger] = useState<PassengerInfo>(initialPassengerData);

  // 2. 使用 useEffect 在组件首次加载时（仅一次）从 localStorage 读取数据
  useEffect(() => {
    // 从 localStorage 获取保存的字符串
    const savedDataString = localStorage.getItem(PASSENGER_STORAGE_KEY);
    
    // 如果找到了数据
    if (savedDataString) {
      try {
        // 将字符串解析回 JavaScript 对象
        const savedData = JSON.parse(savedDataString);
        // 更新组件的状态
        setPassenger(savedData);
      } catch (error) {
        console.error("从 localStorage 解析乘客数据失败", error);
      }
    }
  }, []); // 空数组 [] 意味着这个 effect 只在组件挂载时运行一次

  // 3. 更新 handlePassengerUpdate 函数，让它在更新 state 的同时，也保存到 localStorage
  const handlePassengerUpdate = (updatedData: PassengerInfo) => {
    // 更新页面上的 state
    setPassenger(updatedData);
    
    // 将更新后的数据对象转换为 JSON 字符串并存入 localStorage
    localStorage.setItem(PASSENGER_STORAGE_KEY, JSON.stringify(updatedData));
    
    console.log("乘客信息已更新，并已保存到浏览器本地存储:", updatedData);
  };

  return (
    <div className="bg-slate-50 font-sans">
      <BookingHeader title="预订" />
      <main className="mx-auto w-full max-w-[375px] px-4 pt-20 pb-28">
        <FlightDetailsCard data={flightData} />
        <SectionHeader title="乘客信息" />
        <PassengerInfoCard data={passenger} onSave={handlePassengerUpdate} />
        <SectionHeader title="托运" />
        <BaggageCard />
        <SectionHeader title="额外保险" />
        <InsuranceCard data={insuranceData} />
      </main>
      <BookingFooter total={totalAmount} />
    </div>
  );
};

export default BookingPage;