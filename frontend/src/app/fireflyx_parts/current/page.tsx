"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader, PageContainer } from "../components";
import SchedulePage from "./schedule/page";
import AccountPage from "./account/page";
import SuggestionsPage from "./suggestions/page";

type TabType = "schedule" | "account" | "suggestions";

export default function CurrentTrip() {
  const [activeTab, setActiveTab] = useState<TabType>("schedule");

  const tabs = [
    { id: "schedule" as const, label: "行程表" },
    { id: "account" as const, label: "账本" },
    { id: "suggestions" as const, label: "建议" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "schedule":
        return <SchedulePage />;
      case "account":
        return <AccountPage />;
      case "suggestions":
        return <SuggestionsPage />;
      default:
        return <SchedulePage />;
    }
  };

  return (
    <PageContainer>
      <PageHeader title="当前行程" />

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