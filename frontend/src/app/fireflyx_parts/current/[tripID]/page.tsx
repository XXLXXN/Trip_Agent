"use client";

import React, { useState, useEffect } from "react"; // <--- 修正了拼写错误
import { motion, AnimatePresence } from "framer-motion";
// 确保这个组件路径是正确的，根据你的项目结构，它可能是 "../../components"
import { PageHeader, PageContainer } from "../../components"; 

// 临时的占位组件，用于展示，你可以之后换成真正的组件
const SchedulePagePlaceholder = ({ trip }: { trip: any }) => (
  <div className="p-4">
    <h2 className="font-bold text-lg mb-2">行程表详情</h2>
    {/* 使用 pre 标签可以很好地格式化显示 JSON 数据，方便调试 */}
    <pre className="text-xs whitespace-pre-wrap bg-gray-100 p-2 rounded-md">
      {JSON.stringify(trip?.days, null, 2)}
    </pre>
  </div>
);
const AccountPagePlaceholder = () => <div className="p-4 font-bold text-lg">账本 (待开发)</div>;
const SuggestionsPagePlaceholder = () => <div className="p-4 font-bold text-lg">建议 (待开发)</div>;

type TabType = "schedule" | "account" | "suggestions";

export default function DynamicTripPage({ params }: { params: { tripID: string } }) {
  const [activeTab, setActiveTab] = useState<TabType>("schedule");
  const [tripData, setTripData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { tripID } = params; 

  useEffect(() => {
    // 如果 URL 中没有 tripID，则不执行任何操作
    if (!tripID) {
      setLoading(false);
      return;
    }

    const fetchTripDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/get/itinerary/${tripID}`);
        if (!response.ok) {
          throw new Error(`网络请求失败，状态码: ${response.status}`);
        }
        const data = await response.json();
        setTripData(data);
      } catch (error) {
        console.error("在获取行程详情时捕获到错误:", error);
      } finally {
        // 无论成功还是失败，最后都必须停止加载状态
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [tripID]); // 依赖数组确保仅在 tripID 变化时才重新运行

  const tabs = [
    { id: "schedule" as const, label: "行程表" },
    { id: "account" as const, label: "账本" },
    { id: "suggestions" as const, label: "建议" },
  ];

  const renderContent = () => {
    if (loading) {
      return <div className="p-4 text-center">正在加载行程详情...</div>;
    }
    if (!tripData) {
      return <div className="p-4 text-center text-red-500">未能加载行程数据。</div>;
    }

    switch (activeTab) {
      case "schedule":
        return <SchedulePagePlaceholder trip={tripData} />;
      case "account":
        return <AccountPagePlaceholder />;
      case "suggestions":
        return <SuggestionsPagePlaceholder />;
      default:
        return <SchedulePagePlaceholder trip={tripData} />;
    }
  };

  return (
    <PageContainer>
      <PageHeader title={loading ? "加载中..." : tripData?.trip_name || "行程详情"} />
      
      {/* Tab Navigation */}
      <div className="px-5 pb-4 pt-2">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 h-[35px] rounded-[16px] flex items-center justify-center transition-colors ${
                activeTab === tab.id
                  ? "bg-[#0768FD] text-white"
                  : "bg-[#D9D9D9] text-[#1B1446]"
              }`}
            >
              <span className="font-semibold text-[16px]" style={{ fontFamily: 'Inter' }}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </PageContainer>
  );
}