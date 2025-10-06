"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "./ArrowLeft";
import { PillIconButton } from "./PillIconButton";

interface PageHeaderProps {
  title: string;
  backHref?: string; // 可选，用于指定特定返回路径
  rightElement?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  backHref, 
  rightElement 
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (backHref) {
      // 如果指定了 backHref，使用指定路径
      router.push(backHref);
    } else {
      // 否则使用浏览器历史记录返回
      router.back();
    }
  };

  return (
    <div className="flex items-center gap-4 px-5 pb-6" style={{ paddingTop: "calc(env(safe-area-inset-top) + 1.5rem)" }}>
      <PillIconButton width={"3.78rem"} height={"2.5rem"} onClick={handleBack}>
        <ArrowLeft size={16} />
      </PillIconButton>
      <div className="text-[#1B1446] font-semibold text-[20px] leading-[24px]" style={{ fontFamily: 'Inter' }}>
        {title}
      </div>
      {rightElement && (
        <div className="ml-auto">
          {rightElement}
        </div>
      )}
    </div>
  );
};
