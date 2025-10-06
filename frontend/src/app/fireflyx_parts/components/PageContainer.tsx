"use client";

import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  hasBottomButton?: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = "",
  hasBottomButton = false
}) => {
  return (
    <div className={`h-screen bg-white flex flex-col ${className}`}>
      {children}
    </div>
  );
};

export const ScrollableContent = React.forwardRef<HTMLDivElement, { 
  children: React.ReactNode; 
  className?: string; 
  hasBottomButton?: boolean 
}>(({ children, className = "", hasBottomButton = false }, ref) => {
  const bottomPadding = hasBottomButton ? "pb-32" : "pb-6"; // 增加底部 padding 到 128px
  
  return (
    <div ref={ref} className={`flex-1 overflow-y-auto px-5 ${bottomPadding} ${className}`}>
      {children}
    </div>
  );
});
