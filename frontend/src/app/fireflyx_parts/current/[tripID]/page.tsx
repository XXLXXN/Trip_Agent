"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader, PageContainer } from "../../components"; 

import SchedulePage from "../schedule/page"; 
import AccountPage from "../account/page";
import SuggestionsPage from "../suggestions/page";

type TabType = "schedule" | "account" | "suggestions";

export default function DynamicTripPage({ params }: { params: { tripID: string } }) {
  const [activeTab, setActiveTab] = useState<TabType>("schedule");
  const [tripData, setTripData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { tripID } = params; 

  useEffect(() => {
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
        setLoading(false);
      }
    };
    fetchTripDetails();
  }, [tripID]); 

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

    // --- 关键改动 2: 在 switch 语句中使用所有真实的组件 ---
    // 我们把获取到的 tripData 传递给每一个组件
    switch (activeTab) {
      case "schedule":
        // @ts-ignore
        return <SchedulePage data={tripData} />;
      case "account":
        // @ts-ignore
        return <AccountPage data={tripData} />;
      case "suggestions":
        // @ts-ignore
        return <SuggestionsPage data={tripData} />;
      default:
         // @ts-ignore
        return <SchedulePage data={tripData} />;
    }
  };

  return (
    <PageContainer>
      <PageHeader title={loading ? "加载中..." : tripData?.trip_name || "行程详情"} />
      
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