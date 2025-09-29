// app/page.tsx
"use client";

import Head from 'next/head';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';

// 导入数据
import { mockLocationData } from '@/mockData/jiudianmockData';

// 导入所有组件
import TopBar from '@/components/jiudiancomponents/TopBar';
import LocationDetails from '@/components/jiudiancomponents/LocationDetails';
import Introduction from '@/components/jiudiancomponents/Introduction';
import AmenityIcons from '@/components/jiudiancomponents/AmenityIcons';
import LocationSection from '@/components/jiudiancomponents/LocationSection';
import ReviewSection from '@/components/jiudiancomponents/ReviewSection';
import BookingSection from '@/components/jiudiancomponents/BookingSection';

export default function Home() {
  const router = useRouter();
  const locationRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  const scrollToLocation = () => {
    locationRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToReviews = () => {
    reviewsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenMap = () => {
    router.push('/map');
  };

  const handleViewAllReviews = () => {
    router.push('/reviews');
  };

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

        <div ref={locationRef}>
          <LocationSection 
            address={mockLocationData.address} 
            onOpenMap={handleOpenMap} 
          />
        </div>

        <div ref={reviewsRef}>
          <ReviewSection 
            reviews={mockLocationData.reviews} 
            onViewAllReviews={handleViewAllReviews}
          />
        </div>
      </main>

      <BookingSection />

      <style jsx global>{`
        html, body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          background-color: #ffffffff;
        }
        a { color: inherit; text-decoration: none; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
      `}</style>
      <style jsx>{`
        .container {
          min-height: 100vh;
          position: relative;
        }
        .content {
          padding-bottom: 240px; 
        }
      `}</style>
    </div>
  );
}