// src/app/trainbooking/page.tsx
'use client';

import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/navigation';

// Data Imports
import { trainData, passengerData as initialPassengerData, insuranceData, totalAmount, PassengerInfo } from '@/mockData/trainBookingData';

// Component Imports
import SectionHeader from '@/components/booking/SectionHeader';
import TrainDetailsCard from '@/components/booking/TrainDetailsCard';
import PassengerInfoCard from '@/components/booking/PassengerInfoCard';
import BaggageCard from '@/components/booking/BaggageCard';
import InsuranceCard from '@/components/booking/InsuranceCard';
import BookingFooter from '@/components/booking/BookingFooter';

// fireflyx_parts components
import { PillIconButton, ArrowLeft } from '../fireflyx_parts/components';

// Define a unique key for localStorage to avoid conflicts.
const PASSENGER_STORAGE_KEY = 'trainPassengerData';

const TrainBookingPage: NextPage = () => {
  const router = useRouter();
  
  // 1. Initialize state with default data imported from the file.
  const [passenger, setPassenger] = useState<PassengerInfo>(initialPassengerData);

  // 2. On initial component mount, load passenger data from localStorage.
  useEffect(() => {
    const savedDataString = localStorage.getItem(PASSENGER_STORAGE_KEY);
    
    if (savedDataString) {
      try {
        const savedData = JSON.parse(savedDataString);
        setPassenger(savedData); // Update the component's state.
      } catch (error) {
        console.error("Failed to parse passenger data from localStorage", error);
      }
    }
  }, []); // The empty dependency array [] ensures this effect runs only once on mount.

  // 3. This handler updates the state and saves the data to localStorage.
  const handlePassengerUpdate = (updatedData: PassengerInfo) => {
    setPassenger(updatedData); // Update the component state.
    
    // Stringify and save the updated data to localStorage for persistence.
    localStorage.setItem(PASSENGER_STORAGE_KEY, JSON.stringify(updatedData));
    
    console.log("Passenger info updated and saved to localStorage:", updatedData);
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* 固定在顶部的顶端栏 */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white" style={{ paddingTop: "calc(env(safe-area-inset-top) + 1.5rem)" }}>
        <div className="flex items-center gap-4 px-5 pb-6">
          <PillIconButton width={"3.78rem"} height={"2.5rem"} onClick={() => router.back()}>
            <ArrowLeft size={16} />
          </PillIconButton>
          <div className="text-[#1B1446] font-semibold text-[20px] leading-[24px]" style={{ fontFamily: 'Inter' }}>
            火车预订
          </div>
        </div>
      </div>

      {/* 主内容区域 - 可滚动，为固定顶部栏留出空间 */}
      <div className="flex-1 overflow-y-auto pt-20">
        {/* 内容区域 */}
        <div className="bg-slate-50 px-4 pt-6 pb-32">
          <main className="mx-auto w-full max-w-[375px]">
            <TrainDetailsCard data={trainData} />
            <SectionHeader title="乘客信息" />
            <PassengerInfoCard data={passenger} onSave={handlePassengerUpdate} />
            <SectionHeader title="行李" />
            <BaggageCard />
            <SectionHeader title="额外保险" />
            <InsuranceCard data={insuranceData} />
          </main>
        </div>
      </div>
      
      {/* 固定在底部的预订栏 */}
      <BookingFooter total={totalAmount} />
    </div>
  );
};

export default TrainBookingPage;
