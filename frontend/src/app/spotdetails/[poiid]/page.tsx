// app/spotdetails/[poiid]/page.tsx
"use client";

import Head from "next/head";
import { useRef, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

// 导入模拟数据和所有页面组件
import { mockLocationData, LocationData } from "@/mockData/spotdetailsdata";
import TopBar from "@/components/spotdetails/TopBar";
import LocationDetails from "@/components/spotdetails/LocationDetails";
import Introduction from "@/components/spotdetails/Introduction";
import AmenityIcons from "@/components/spotdetails/AmenityIcons";
import LocationSection from "@/components/spotdetails/LocationSection";
import ReviewSection from "@/components/spotdetails/ReviewSection";
import BookingSection from "@/components/spotdetails/BookingSection";
import { useTripPlan, SpotRecommendation } from "../../context/TripPlanContext";

/**
 * 动态地点详情页主页面组件。
 * 根据POIId从后端数据中获取对应景点的详细信息。
 */
export default function SpotDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const poiid = params.poiid as string;

  const { getSpotRecommendations } = useTripPlan();
  const [spotData, setSpotData] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 创建Ref以引用DOM元素，用于平滑滚动
  const locationRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  // 根据POIId从后端数据中查找对应的景点信息
  useEffect(() => {
    const backendSpots = getSpotRecommendations();
    if (backendSpots && backendSpots.length > 0) {
      const foundSpot = backendSpots.find((spot) => spot.POIId === poiid);
      if (foundSpot) {
        // 将后端数据转换为前端需要的格式
        const convertedData: LocationData = {
          name: foundSpot.SpotName,
          address: foundSpot.address || mockLocationData.address,
          rating: parseFloat(foundSpot.rating) || mockLocationData.rating,
          reviewCount: mockLocationData.reviewCount, // 使用mock数据
          featuredImage:
            foundSpot.photos?.[0]?.url || mockLocationData.featuredImage,
          photos:
            foundSpot.photos?.map((photo) => photo.url) ||
            mockLocationData.photos,
          introduction: foundSpot.description || mockLocationData.introduction,
          amenitiesStatus: mockLocationData.amenitiesStatus, // 使用mock数据
          reviews: mockLocationData.reviews, // 使用mock数据
          price: mockLocationData.price, // 使用mock数据
        };
        setSpotData(convertedData);
      } else {
        // 如果没有找到对应的景点，使用mock数据
        setSpotData(mockLocationData);
      }
    } else {
      // 如果没有后端数据，使用mock数据
      setSpotData(mockLocationData);
    }
    setIsLoading(false);
  }, [poiid, getSpotRecommendations]);

  // 滚动到位置区域
  const scrollToLocation = () => {
    locationRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 滚动到评论区域
  const scrollToReviews = () => {
    reviewsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 导航到地图页面
  const handleOpenMap = () => router.push("/map");

  // 导航到所有评论页面
  const handleViewAllReviews = () => router.push("/reviews");

  // 导航到预订流程页面
  const handleBook = () => router.push("/jiudiantuijian");

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>加载中...</p>
        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
          }
          .loading-spinner {
            border: 4px solid #f3f4f6;
            border-top: 4px solid #0768fd;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  const currentData = spotData || mockLocationData;

  return (
    <div className="container">
      <Head>
        <title>{currentData.name} - 详情</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>

      <TopBar featuredImage={currentData.featuredImage} />

      <main className="content">
        <LocationDetails
          {...currentData}
          onScrollToLocation={scrollToLocation}
          onScrollToReviews={scrollToReviews}
        />

        <Introduction text={currentData.introduction} />

        <AmenityIcons amenitiesStatus={currentData.amenitiesStatus} />

        {/* 将ref附加到div，以便可以滚动到它 */}
        <div ref={locationRef}>
          <LocationSection
            address={currentData.address}
            onOpenMap={handleOpenMap}
          />
        </div>

        <div ref={reviewsRef}>
          <ReviewSection
            reviews={currentData.reviews}
            onViewAllReviews={handleViewAllReviews}
          />
        </div>
      </main>

      <BookingSection price={currentData.price} onBook={handleBook} />

      <style jsx global>{`
        /* 全局样式 */
      `}</style>
      <style jsx>{`
        .container {
          min-height: 100vh;
          position: relative;
        }
        .content {
          /* 为底部的固定预约栏留出空间，防止内容被遮挡 */
          padding-bottom: 240px;
        }
      `}</style>
    </div>
  );
}
