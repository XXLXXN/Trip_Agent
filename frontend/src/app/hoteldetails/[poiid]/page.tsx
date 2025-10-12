// app/hoteldetails/[poiid]/page.tsx
"use client";

import Head from "next/head";
import { useRef, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useNavigation } from "../../context/NavigationContext";

// 导入模拟数据和所有页面组件
import { mockLocationData, LocationData } from "@/mockData/hotelMockData";
import TopBar from "@/components/hotelComponents/TopBar";
import LocationDetails from "@/components/hotelComponents/LocationDetails";
import Introduction from "@/components/hotelComponents/Introduction";
import AmenityIcons from "@/components/hotelComponents/AmenityIcons";
import LocationSection from "@/components/hotelComponents/LocationSection";
import ReviewSection from "@/components/hotelComponents/ReviewSection";
import BookingSection from "@/components/hotelComponents/BookingSection";
import { useTripPlan } from "../../context/TripPlanContext";

export default function HotelDetailsPage() {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useParams();
  const poiid = params.poiid as string;

  const { getHotelRecommendations } = useTripPlan();
  const [hotelData, setHotelData] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 【新增】为经纬度坐标创建一个新的 state
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);

  const locationRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  // 第一个 useEffect：获取酒店基础数据
  useEffect(() => {
    const backendHotels = getHotelRecommendations();
    if (backendHotels && backendHotels.length > 0) {
      const foundHotel = backendHotels.find(
        (hotel: any) => hotel.POIId === poiid
      );
      if (foundHotel) {
        const convertedData: LocationData = {
          name: foundHotel.SpotName,
          address: foundHotel.address || mockLocationData.address,
          rating: parseFloat(foundHotel.rating) || mockLocationData.rating,
          reviewCount: mockLocationData.reviewCount,
          featuredImage: foundHotel.photos?.[0]?.url || mockLocationData.featuredImage,
          photos: foundHotel.photos?.map((photo: any) => photo.url) || mockLocationData.photos,
          introduction: foundHotel.description || mockLocationData.introduction,
          amenitiesStatus: mockLocationData.amenitiesStatus,
          reviews: mockLocationData.reviews,
          price: foundHotel.cost || mockLocationData.price,
        };
        setHotelData(convertedData);
      } else {
        setHotelData(mockLocationData);
      }
    } else {
      setHotelData(mockLocationData);
    }
    setIsLoading(false);
  }, [poiid, getHotelRecommendations]);

  // 【新增】第二个 useEffect：当酒店数据加载后，调用内部API获取经纬度
  useEffect(() => {
    if (hotelData?.address) {
      const fetchCoordinates = async () => {
        try {
          const response = await fetch('/api/geocode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address: hotelData.address }),
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
  }, [hotelData]);

  // 事件处理函数
  const scrollToLocation = () => locationRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToReviews = () => reviewsRef.current?.scrollIntoView({ behavior: "smooth" });

  // 【修改】导航到地图页面，现在使用高德地图URL
  const handleOpenMap = () => {
    if (coordinates && hotelData) {
      const [lng, lat] = coordinates;
      window.open(`https://uri.amap.com/marker?position=${lng},${lat}&name=${encodeURIComponent(hotelData.name)}`, '_blank');
    } else {
      alert("正在获取地图坐标，请稍候...");
    }
  };

  const handleViewAllReviews = () => navigation.push("/reviews", "forward");
  const handleBook = () => navigation.push("/booking", "forward");

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>加载中...</p>
        {/* 加载动画的 CSS */}
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

  const currentData = hotelData || mockLocationData;

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
          name={currentData.name}
          address={currentData.address}
          rating={currentData.rating}
          reviewCount={currentData.reviewCount}
          photos={currentData.photos}
          onScrollToLocation={scrollToLocation}
          onScrollToReviews={scrollToReviews}
        />

        <Introduction text={currentData.introduction} />

        <AmenityIcons amenitiesStatus={currentData.amenitiesStatus} />

        <div ref={locationRef}>
          {/* 【修改】将坐标传递给 LocationSection */}
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

      <BookingSection onBook={handleBook} />

      {/* --- 您的 CSS 代码，原封不动 --- */}
      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
          background-color: #ffffffff;
        }
        a {
          color: inherit;
          text-decoration: none;
        }
        * {
          box-sizing: border-box;
        }
        /* Hide scrollbars for a cleaner look on elements with overflow */
        ::-webkit-scrollbar {
          display: none;
        }
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