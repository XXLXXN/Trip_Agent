// app/page.tsx
"use client";

import Head from 'next/head';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';

// 导入模拟数据和所有页面组件
import { mockLocationData } from '@/mockData/spotdetailsdata';
import TopBar from '@/components/spotdetails/TopBar';
import LocationDetails from '@/components/spotdetails/LocationDetails';
import Introduction from '@/components/spotdetails/Introduction';
import AmenityIcons from '@/components/spotdetails/AmenityIcons';
import LocationSection from '@/components/spotdetails/LocationSection';
import ReviewSection from '@/components/spotdetails/ReviewSection';
import BookingSection from '@/components/spotdetails/BookingSection';

/**
 * 地点详情页主页面组件。
 * 负责组装所有子组件并处理页面级别的逻辑，如滚动和导航。
 */
export default function Home() {
  const router = useRouter();
  // 创建Ref以引用DOM元素，用于平滑滚动
  const locationRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  // 滚动到位置区域
  const scrollToLocation = () => {
    locationRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 滚动到评论区域
  const scrollToReviews = () => {
    reviewsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 导航到地图页面
  const handleOpenMap = () => router.push('/map');

  // 导航到所有评论页面
  const handleViewAllReviews = () => router.push('/reviews');

  // 导航到预订流程页面
  const handleBook = () => router.push('/jiudiantuijian');

  return (
    <div className="container">
      <Head>
        <title>{mockLocationData.name} - 详情</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      <TopBar featuredImage={mockLocationData.featuredImage} />

      <main className="content">
        <LocationDetails
          {...mockLocationData}
          onScrollToLocation={scrollToLocation}
          onScrollToReviews={scrollToReviews}
        />

        <Introduction text={mockLocationData.introduction} />

        <AmenityIcons amenitiesStatus={mockLocationData.amenitiesStatus} />

        {/* 将ref附加到div，以便可以滚动到它 */}
        <div ref={locationRef}>
          <LocationSection
            address={mockLocationData.address}
            onOpenMap={handleOpenMap}
            coordinates={null} 
          />
        </div>

        <div ref={reviewsRef}>
          <ReviewSection
            reviews={mockLocationData.reviews}
            onViewAllReviews={handleViewAllReviews}
          />
        </div>
      </main>

      <BookingSection price={mockLocationData.price} onBook={handleBook} />

      <style jsx global>{`
        /* 全局样式 */
      `}</style>
      <style jsx>{`
        .container { min-height: 100vh; position: relative; }
        .content {
          /* 为底部的固定预约栏留出空间，防止内容被遮挡 */
          padding-bottom: 240px;
        }
      `}</style>
    </div>
  );
}