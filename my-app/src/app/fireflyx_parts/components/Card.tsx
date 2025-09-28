"use client";

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
  shadow?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = "", 
  padding = "md",
  shadow = true 
}) => {
  const paddingClasses = {
    sm: "p-2",
    md: "p-4", 
    lg: "p-6"
  };

  const shadowClass = shadow ? "shadow-md" : "";

  return (
    <div className={`rounded-[16px] border border-[rgba(1,34,118,0.05)] bg-white ${paddingClasses[padding]} ${shadowClass} ${className}`}>
      {children}
    </div>
  );
};

// 预定义的卡片变体
export const TransportCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <Card className={`${className}`} padding="sm">
    {children}
  </Card>
);

export const AttractionCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <Card className={`${className}`} padding="md">
    {children}
  </Card>
);

export const HotelCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <Card className={`${className}`} padding="sm">
    {children}
  </Card>
);
