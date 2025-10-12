// src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/navigation';

// Data Imports
import { flightData, passengerData as initialPassengerData, insuranceData, totalAmount, PassengerInfo } from '@/mockData/bookingData';

// Component Imports
import SectionHeader from '@/components/booking/SectionHeader';
import FlightDetailsCard from '@/components/booking/FlightDetailsCard';
import PassengerInfoCard from '@/components/booking/PassengerInfoCard';
import BaggageCard from '@/components/booking/BaggageCard';
import InsuranceCard from '@/components/booking/InsuranceCard';
import BookingFooter from '@/components/booking/BookingFooter';

// Define a unique key for localStorage to avoid conflicts.
const PASSENGER_STORAGE_KEY = 'passengerData';

const BookingPage: NextPage = () => {
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
    <div className="bg-slate-50 font-sans min-h-screen">
      {/* 蓝色背景层 */}
      <div
        className="absolute top-0 left-0 w-full"
        style={{
          height: "20vh",
          background: "#0768fd",
          zIndex: 0,
        }}
      />

      {/* Header - 固定在顶部 */}
      <div className="relative z-10 flex items-center px-5 pb-4 flex-shrink-0" style={{ paddingTop: "calc(env(safe-area-inset-top) + 1.5rem)" }}>
        <button onClick={() => router.back()}>
          <img src="/BackButton.svg" alt="后退图标" className="h-12 w-12" />
        </button>
        <h1 className="ml-2 text-lg font-medium text-[#FFFFFF]">飞机预订</h1>
      </div>

      {/* 主内容区域 */}
      <div className="relative z-10 bg-slate-50 rounded-t-3xl -mt-4 flex-1">
        <main className="mx-auto w-full max-w-[375px] px-4 pt-6 pb-28">
          <FlightDetailsCard data={flightData} />
          <SectionHeader title="乘客信息" />
          <PassengerInfoCard data={passenger} onSave={handlePassengerUpdate} />
          <SectionHeader title="行李" />
          <BaggageCard />
          <SectionHeader title="额外保险" />
          <InsuranceCard data={insuranceData} />
        </main>
        <BookingFooter total={totalAmount} />
      </div>
    </div>
  );
};

export default BookingPage;