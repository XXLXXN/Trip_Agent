"use client";

import Head from "next/head";
import { useRef, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useNavigation } from "../../../context/NavigationContext";

// 导入模拟数据和所有页面组件
import { mockLocationData, LocationData } from "@/mockData/spotdetailsdata";
import TopBar from "@/components/spotdetails/TopBar";
import LocationDetails from "@/components/spotdetails/LocationDetails";
import Introduction from "@/components/spotdetails/Introduction";
import AmenityIcons from "@/components/spotdetails/AmenityIcons";
import LocationSection from "@/components/spotdetails/LocationSection";
import { useTripData } from "../../hooks/useTripData";
import { ActivityData } from "../../types/tripData";

export default function SpotDetailPage() {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useParams();
  const activityId = params.activityId as string;

  const { tripData, loading, error } = useTripData();
  const [spotData, setSpotData] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);

  const locationRef = useRef<HTMLDivElement>(null);

  // 从tripData中查找对应的活动数据
  useEffect(() => {
    if (tripData && !loading) {
      // 在所有天的活动中查找匹配的活动
      let foundActivity: ActivityData | null = null;

      // 将 activityId 转换为数字进行比较，因为 convertToSpotCardData 中提取了数字部分
      const numericActivityId = parseInt(activityId);

      for (const day of tripData.days) {
        for (const activity of day.activities) {
          // 从 activity.id 中提取数字部分进行比较
          const idMatch = activity.id.match(/\d+/);
          const activityNumericId = idMatch ? parseInt(idMatch[0]) : 0;
          
          if (activityNumericId === numericActivityId && activity.type === "activity") {
            foundActivity = activity;
            break;
          }
        }
        if (foundActivity) break;
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
            // 如果API失败，静默处理，不影响页面正常显示
            console.warn("获取坐标失败，将使用地址搜索:", await response.text());
          }
        } catch (error) {
          // 如果请求失败，静默处理，不影响页面正常显示
          console.warn("请求坐标 API 时出错，将使用地址搜索:", error);
        }
      };
      fetchCoordinates();
    }
  }, [spotData]);

  // 滚动函数
  const scrollToLocation = () =>
    locationRef.current?.scrollIntoView({ behavior: "smooth" });

  const scrollToReviews = () => {
    // 这里可以添加滚动到评论区域的逻辑
    // 暂时使用一个简单的实现
    console.log("滚动到评论区域");
  };

  // 导航到地图页面
  const handleOpenMap = () => {
    if (coordinates && spotData) {
      // 如果有精确坐标，使用高德地图
      const [lng, lat] = coordinates;
      window.open(
        `https://uri.amap.com/marker?position=${lng},${lat}&name=${encodeURIComponent(
          spotData.name
        )}`,
        "_blank"
      );
    } else if (spotData?.address) {
      // 如果没有坐标但有地址，使用地址搜索
      window.open(
        `https://uri.amap.com/search?query=${encodeURIComponent(spotData.address)}&name=${encodeURIComponent(spotData.name)}`,
        "_blank"
      );
    } else {
      // 如果都没有，提示用户
      alert("地址信息不完整，无法打开地图");
    }
  };


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
      </main>

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
          padding-bottom: 20px;
        }
      `}</style>
    </div>
  );
}
