"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  PageContainer,
  ScrollableContent,
} from "../../components";
import { useTripData } from "../../hooks/useTripData";
import { ActivityData, POIDetails } from "../../types/tripData";

// 景点详情组件
import SpotDetailHeader from "../components/SpotDetailHeader";
import SpotDetailInfo from "../components/SpotDetailInfo";
import SpotDetailPhotos from "../components/SpotDetailPhotos";
import SpotDetailDescription from "../components/SpotDetailDescription";
import SpotDetailLocation from "../components/SpotDetailLocation";

export default function SpotDetailPage() {
  const router = useRouter();
  const params = useParams();
  const activityId = params.activityId as string;
  
  // 获取行程数据
  const { tripData, loading, error } = useTripData();
  
  // 当前活动数据
  const [currentActivity, setCurrentActivity] = useState<ActivityData | null>(null);
  const [poiDetails, setPoiDetails] = useState<POIDetails | null>(null);

  // 从行程数据中找到对应的活动
  useEffect(() => {
    if (tripData && activityId) {
      let foundActivity: ActivityData | null = null;
      
      // 将 activityId 转换为数字进行比较，因为 convertToSpotCardData 中提取了数字部分
      const numericActivityId = parseInt(activityId);
      
      // 遍历所有天和活动，找到匹配的activity
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
      
      if (foundActivity) {
        setCurrentActivity(foundActivity);
        setPoiDetails(foundActivity.poi_details || null);
      }
    }
  }, [tripData, activityId]);

  // 处理返回
  const handleBack = () => {
    router.back();
  };

  // 处理打开地图
  const handleOpenMap = () => {
    if (poiDetails?.address) {
      // 这里可以添加地图功能
      console.log("打开地图:", poiDetails.address);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-8">
          <div
            className="text-[#808080] text-[16px]"
            style={{ fontFamily: "Inter" }}
          >
            加载中...
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error || !currentActivity) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-8">
          <div
            className="text-[#FF4444] text-[16px]"
            style={{ fontFamily: "Inter" }}
          >
            {error || "未找到景点信息"}
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ScrollableContent className="space-y-4" hasBottomButton={true}>
        {/* 景点头部信息 */}
        <SpotDetailHeader
          activity={currentActivity}
          poiDetails={poiDetails}
          onBack={handleBack}
        />

        {/* 景点基本信息 */}
        <SpotDetailInfo
          activity={currentActivity}
          poiDetails={poiDetails}
        />

        {/* 景点照片 */}
        {poiDetails?.photos && poiDetails.photos.length > 0 && (
          <SpotDetailPhotos photos={poiDetails.photos} />
        )}

        {/* 景点描述 */}
        <SpotDetailDescription
          description={poiDetails?.description || currentActivity.description}
        />

        {/* 景点位置 */}
        {poiDetails?.address && (
          <SpotDetailLocation
            address={poiDetails.address}
            onOpenMap={handleOpenMap}
          />
        )}
      </ScrollableContent>

    </PageContainer>
  );
}
