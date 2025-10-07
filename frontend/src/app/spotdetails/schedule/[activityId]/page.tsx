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
import { useTripData } from "../../../fireflyx_parts/hooks/useTripData";
import { ActivityData } from "../../../fireflyx_parts/types/tripData";

export default function ScheduleSpotDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const activityId = params.activityId as string;

  const { tripData, loading, error } = useTripData();
  const [spotData, setSpotData] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);

  const locationRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  // 从tripData中查找对应的活动数据
  useEffect(() => {
    if (tripData && !loading) {
      // 在所有天的活动中查找匹配的活动
      let foundActivity: ActivityData | null = null;

      for (const day of tripData.days) {
        const activity = day.activities.find((a) => a.id === activityId);
        if (activity) {
          foundActivity = activity;
          break;
        }
      }

      if (foundActivity && foundActivity.poi_details) {
        const poi = foundActivity.poi_details;
        const convertedData: LocationData = {
          name: poi.name || foundActivity.title || "景点",
          address: poi.address || "地址信息缺失",
          rating: parseFloat(poi.rating || "4.5") || 4.5,
          reviewCount: mockLocationData.reviewCount,
          featuredImage: poi.photos?.[0]?.url || mockLocationData.featuredImage,
          photos:
            poi.photos?.map((photo) => photo.url) || mockLocationData.photos,
          introduction:
            poi.description ||
            foundActivity.description ||
            mockLocationData.introduction,
          amenitiesStatus: mockLocationData.amenitiesStatus,
          reviews: mockLocationData.reviews,
          price: poi.cost || foundActivity.cost || mockLocationData.price,
        };
        setSpotData(convertedData);
      } else {
        // 如果没有找到对应的POI详情，使用模拟数据
        setSpotData(mockLocationData);
      }
      setIsLoading(false);
    }
  }, [tripData, loading, activityId]);

  // 获取坐标
  useEffect(() => {
    if (spotData?.address) {
      const fetchCoordinates = async () => {
        try {
          const response = await fetch("/api/geocode", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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
  }, [spotData]);

  // 滚动函数
  const scrollToLocation = () =>
    locationRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToReviews = () =>
    reviewsRef.current?.scrollIntoView({ behavior: "smooth" });

  // 导航到地图页面
  const handleOpenMap = () => {
    if (coordinates && spotData) {
      const [lng, lat] = coordinates;
      window.open(
        `https://uri.amap.com/marker?position=${lng},${lat}&name=${encodeURIComponent(
          spotData.name
        )}`,
        "_blank"
      );
    } else {
      alert("正在获取地图坐标，请稍候...");
    }
  };

  const handleViewAllReviews = () => router.push("/reviews");
  const handleBook = () => router.push("/jiudiantuijian");

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="flex items-center justify-center h-screen">
          <div
            className="text-[#808080] text-[16px]"
            style={{ fontFamily: "Inter" }}
          >
            加载中...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="flex items-center justify-center h-screen">
          <div
            className="text-[#FF4444] text-[16px]"
            style={{ fontFamily: "Inter" }}
          >
            {error}
          </div>
        </div>
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

        <div ref={locationRef}>
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

      <style jsx global>{`
        /* 全局样式 */
      `}</style>
      <style jsx>{`
        .container {
          min-height: 100vh;
          position: relative;
          background: white;
        }
        .content {
          padding-bottom: 240px;
        }
      `}</style>
    </div>
  );
}
