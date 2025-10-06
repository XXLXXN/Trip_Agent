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
import { useTripPlan } from "../../context/TripPlanContext";

export default function SpotDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const poiid = params.poiid as string;

  const { getSpotRecommendations } = useTripPlan();
  const [spotData, setSpotData] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 【新增】为经纬度坐标创建一个新的 state
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);

  const locationRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  // 第一个 useEffect：获取景点基础数据 (逻辑不变)
  useEffect(() => {
    const backendSpots = getSpotRecommendations();
    if (backendSpots && backendSpots.length > 0) {
      const foundSpot = backendSpots.find((spot) => spot.POIId === poiid);
      if (foundSpot) {
        const convertedData: LocationData = {
          name: foundSpot.SpotName,
          address: foundSpot.address || mockLocationData.address,
          rating: parseFloat(foundSpot.rating) || mockLocationData.rating,
          reviewCount: mockLocationData.reviewCount,
          featuredImage: foundSpot.photos?.[0]?.url || mockLocationData.featuredImage,
          photos: foundSpot.photos?.map((photo) => photo.url) || mockLocationData.photos,
          introduction: foundSpot.description || mockLocationData.introduction,
          amenitiesStatus: mockLocationData.amenitiesStatus,
          reviews: mockLocationData.reviews,
          price: mockLocationData.price,
        };
        setSpotData(convertedData);
      } else {
        setSpotData(mockLocationData);
      }
    } else {
      setSpotData(mockLocationData);
    }
    setIsLoading(false);
  }, [poiid]);

  // 【新增】第二个 useEffect：当景点数据加载后，调用内部API获取经纬度
  useEffect(() => {
    if (spotData?.address) {
      const fetchCoordinates = async () => {
        try {
          // 我们复用之前创建的同一个 API 接口
          const response = await fetch('/api/geocode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address: spotData.address }),
          });
          if (response.ok) {
            const data = await response.json();
            if (data.coordinates) {
              setCoordinates(data.coordinates);
            }
          } else {
            console.error("获取坐标失败:", await response.text());
          }
        } catch (error) {
          console.error("请求坐标 API 时出错:", error);
        }
      };
      fetchCoordinates();
    }
  }, [spotData]); // 这个 effect 依赖于 spotData

  // 滚动函数 (逻辑不变)
  const scrollToLocation = () => locationRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToReviews = () => reviewsRef.current?.scrollIntoView({ behavior: "smooth" });

  // 【修改】导航到地图页面，现在使用高德地图URL
  const handleOpenMap = () => {
    if (coordinates && spotData) {
      const [lng, lat] = coordinates;
      window.open(`https://uri.amap.com/marker?position=${lng},${lat}&name=${encodeURIComponent(spotData.name)}`, '_blank');
    } else {
      alert("正在获取地图坐标，请稍候...");
    }
  };

  const handleViewAllReviews = () => router.push("/reviews");
  const handleBook = () => router.push("/jiudiantuijian");

  if (isLoading) {
    // ... loading UI ... (不变)
    return (
        <div className="loading-container">...</div>
    );
  }

  const currentData = spotData || mockLocationData;

  return (
    <div className="container">
      <Head>
        <title>{currentData.name} - 详情</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
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

        <div ref={locationRef}>
          {/* 【修改】将坐标 state 传递给 LocationSection */}
          <LocationSection
            address={currentData.address}
            onOpenMap={handleOpenMap}
            coordinates={coordinates}
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

      <style jsx global>{`/* 全局样式 */`}</style>
      <style jsx>{`
        .container { min-height: 100vh; position: relative; background:white; }
        .content { padding-bottom: 240px; }
      `}</style>
    </div>
  );
}