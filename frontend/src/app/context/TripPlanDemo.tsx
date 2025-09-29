"use client";

import React, { useState, useEffect } from "react";
import { useTripPlan, SpotRecommendation } from "./TripPlanContext";

/**
 * 演示如何使用TripPlanContext的组件
 * 这个组件展示了如何访问和使用存储的旅行规划数据
 */
export function TripPlanDemo() {
  const { getTripPlan, getSpotRecommendations, state } = useTripPlan();

  const [tripPlanData, setTripPlanData] = useState(getTripPlan());
  const [spotRecommendations, setSpotRecommendations] = useState<
    SpotRecommendation[] | null
  >(null);

  // 当数据变化时更新状态
  useEffect(() => {
    setTripPlanData(getTripPlan());
    setSpotRecommendations(getSpotRecommendations());
  }, [getTripPlan, getSpotRecommendations, state]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">
        TripPlanContext 使用示例
      </h2>

      {/* 显示状态信息 */}
      <div className="mb-4 p-3 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">状态信息:</h3>
        <p>加载中: {state.isLoading ? "是" : "否"}</p>
        <p>错误: {state.error || "无"}</p>
      </div>

      {/* 显示旅行规划数据 */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">旅行规划数据:</h3>
        {tripPlanData ? (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p>
                <strong>出发地:</strong> {tripPlanData.departure}
              </p>
              <p>
                <strong>目的地:</strong> {tripPlanData.destination}
              </p>
              <p>
                <strong>日期:</strong> {tripPlanData.startDate} -{" "}
                {tripPlanData.endDate}
              </p>
            </div>
            <div>
              <p>
                <strong>成人:</strong> {tripPlanData.adults}
              </p>
              <p>
                <strong>老人:</strong> {tripPlanData.elderly}
              </p>
              <p>
                <strong>儿童:</strong> {tripPlanData.children}
              </p>
            </div>
            <div>
              <p>
                <strong>预算范围:</strong> ¥{tripPlanData.priceRange[0]} - ¥
                {tripPlanData.priceRange[1]}
              </p>
              <p>
                <strong>交通方式:</strong> {tripPlanData.selectedTransport}
              </p>
              <p>
                <strong>住宿偏好:</strong> {tripPlanData.selectedAccommodation}
              </p>
            </div>
            <div>
              <p>
                <strong>旅行风格:</strong>{" "}
                {tripPlanData.selectedStyles.join(", ")}
              </p>
              <p>
                <strong>其他需求:</strong>{" "}
                {tripPlanData.additionalRequirements || "无"}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 italic">暂无旅行规划数据</p>
        )}
      </div>

      {/* 显示景点推荐数据 */}
      <div>
        <h3 className="text-xl font-semibold mb-3">景点推荐数据:</h3>
        {spotRecommendations && spotRecommendations.length > 0 ? (
          <div className="space-y-4">
            {spotRecommendations.map((spot, index) => (
              <div
                key={index}
                className="p-3 border border-gray-200 rounded-lg"
              >
                <h4 className="font-semibold text-lg text-blue-700">
                  {spot.SpotName}
                </h4>
                <p className="text-gray-600 mt-1">{spot.RecReason}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">暂无景点推荐数据</p>
        )}
      </div>

      {/* 使用示例代码 */}
      <div className="mt-6 p-4 bg-blue-50 rounded">
        <h4 className="font-semibold mb-2">使用代码示例:</h4>
        <pre className="text-sm bg-black text-green-400 p-3 rounded overflow-x-auto">
          {`// 1. 导入Hook
import { useTripPlan } from "./context/TripPlanContext";

// 2. 在组件中使用
function MyComponent() {
  const { 
    getTripPlan, 
    getSpotRecommendations,
    saveTripPlan,
    clearTripPlan 
  } = useTripPlan();

  // 3. 获取数据
  const tripData = getTripPlan();
  const spots = getSpotRecommendations();

  // 4. 使用数据
  return (
    <div>
      {tripData && (
        <p>目的地: {tripData.destination}</p>
      )}
      {spots && spots.map(spot => (
        <div key={spot.SpotName}>
          <h3>{spot.SpotName}</h3>
          <p>{spot.RecReason}</p>
        </div>
      ))}
    </div>
  );
}`}
        </pre>
      </div>
    </div>
  );
}

/**
 * 演示页面组件，展示完整的使用场景
 */
export default function TripPlanDemoPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-800">
          TripPlanContext 数据存储演示
        </h1>

        <TripPlanDemo />

        <div className="mt-8 p-6 bg-yellow-50 border-l-4 border-yellow-400">
          <h3 className="font-semibold text-yellow-800">使用说明:</h3>
          <ul className="list-disc list-inside mt-2 text-yellow-700">
            <li>数据会自动从sessionStorage恢复</li>
            <li>页面刷新后数据仍然存在（会话期间）</li>
            <li>关闭浏览器后数据自动清除</li>
            <li>支持完整的TypeScript类型检查</li>
            <li>包含错误处理机制</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
