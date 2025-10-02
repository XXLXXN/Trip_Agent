// src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import type { NextPage } from 'next';

// Data Imports
import { flightData, passengerData as initialPassengerData, insuranceData, totalAmount, PassengerInfo } from '@/mockData/bookingData';

// Component Imports
import BookingHeader from '@/components/booking/BookingHeader';
import SectionHeader from '@/components/booking/SectionHeader';
import FlightDetailsCard from '@/components/booking/FlightDetailsCard';
import PassengerInfoCard from '@/components/booking/PassengerInfoCard';
import BaggageCard from '@/components/booking/BaggageCard';
import InsuranceCard from '@/components/booking/InsuranceCard';
import BookingFooter from '@/components/booking/BookingFooter';

// Define a unique key for localStorage to avoid conflicts.
const PASSENGER_STORAGE_KEY = 'passengerData';

const BookingPage: NextPage = () => {
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
    <div className="bg-slate-50 font-sans">
      <BookingHeader title="Booking" />
      <main className="mx-auto w-full max-w-[375px] px-4 pt-20 pb-28">
        <FlightDetailsCard data={flightData} />
        <SectionHeader title="Passenger Information" />
        <PassengerInfoCard data={passenger} onSave={handlePassengerUpdate} />
        <SectionHeader title="Baggage" />
        <BaggageCard />
        <SectionHeader title="Extra Insurance" />
        <InsuranceCard data={insuranceData} />
      </main>
      <BookingFooter total={totalAmount} />
    </div>
  );
};

export default BookingPage;