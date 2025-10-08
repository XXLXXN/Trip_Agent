// app/page.tsx
"use client";

import Head from 'next/head';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';

// Import mock data and components
import { mockLocationData } from '@/mockData/hotelMockData';
import TopBar from '@/components/hotelComponents/TopBar';
import LocationDetails from '@/components/hotelComponents/LocationDetails';
import Introduction from '@/components/hotelComponents/Introduction';
import AmenityIcons from '@/components/hotelComponents/AmenityIcons';
import LocationSection from '@/components/hotelComponents/LocationSection';
import ReviewSection from '@/components/hotelComponents/ReviewSection';
import BookingSection from '@/components/hotelComponents/BookingSection';

/**
 * The main page component for displaying hotel details.
 * It aggregates all the individual components to build the full page.
 */
export default function Home() {
  const router = useRouter();
  // Refs to DOM elements for smooth scrolling functionality.
  const locationRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  /**
   * Scrolls the page to the location section.
   */
  const scrollToLocation = () => {
    locationRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  /**
   * Scrolls the page to the reviews section.
   */
  const scrollToReviews = () => {
    reviewsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  /**
   * Navigates to the map page.
   */
  const handleOpenMap = () => {
    // Since this is a static page, we can hardcode coordinates or show an alert.
    // For now, we'll just log it, as the component might handle the null case.
    console.log("Open map clicked, but no dynamic coordinates on this page.");
    // Or you could navigate to a generic map page if one exists
    // router.push('/map');
    alert("地图功能在此页面不可用，请通过酒店详情页查看。");
  };

  /**
   * Navigates to the all reviews page.
   */
  const handleViewAllReviews = () => {
    router.push('/reviews');
  };

  /**
   * Navigates to the booking confirmation page.
   */
  const handleBook = () => {
    router.push('/booking-confirmation');
  };

  return (
    <div className="container">
      <Head>
        <title>{mockLocationData.name} - 详情</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      <TopBar featuredImage={mockLocationData.featuredImage} />

      <main className="content">
        <LocationDetails
          name={mockLocationData.name}
          address={mockLocationData.address}
          rating={mockLocationData.rating}
          reviewCount={mockLocationData.reviewCount}
          photos={mockLocationData.photos}
          onScrollToLocation={scrollToLocation}
          onScrollToReviews={scrollToReviews}
        />

        <Introduction text={mockLocationData.introduction} />

        <AmenityIcons amenitiesStatus={mockLocationData.amenitiesStatus} />

        {/* The div below is the target for the location scroll */}
        <div ref={locationRef}>
          <LocationSection 
            address={mockLocationData.address} 
            onOpenMap={handleOpenMap}
            // 【修复】添加 coordinates prop 并设为 null 来解决类型错误
            coordinates={null} 
          />
        </div>

        {/* The div below is the target for the reviews scroll */}
        <div ref={reviewsRef}>
          <ReviewSection 
            reviews={mockLocationData.reviews} 
            onViewAllReviews={handleViewAllReviews}
          />
        </div>
      </main>

      {/* 假设 BookingSection 也有一个 onBook 回调 */}
      <BookingSection onBook={handleBook} />

      <style jsx global>{`
        html, body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
          background-color: #ffffffff;
        }
        a { color: inherit; text-decoration: none; }
        * { box-sizing: border-box; }
        /* Hide scrollbars for a cleaner look on elements with overflow */
        ::-webkit-scrollbar { display: none; }
      `}</style>
      <style jsx>{`
        .container {
          min-height: 100vh;
          position: relative;
        }
        .content {
          /* Add padding to the bottom to prevent content from being hidden by the fixed BookingSection */
          padding-bottom: 240px; 
        }
      `}</style>
    </div>
  );
}