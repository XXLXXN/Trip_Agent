"use client";

import React from "react";

interface TransportButtonProps {
  option: string;
  isSelected: boolean;
  onClick: () => void;
}

export const TransportButton: React.FC<TransportButtonProps> = ({ 
  option, 
  isSelected, 
  onClick 
}) => (
  <button
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    }}
    className={`w-16 h-8 rounded-full text-[12px] font-semibold flex items-center justify-center transition-colors touch-manipulation cursor-pointer ${
      isSelected 
        ? "bg-[#0768FD] text-white" 
        : "bg-[#DDDDDD] text-[#1B1446] hover:bg-[#CCCCCC]"
    }`}
    style={{ 
      fontFamily: 'Inter',
      minHeight: '32px',
      minWidth: '64px',
      touchAction: 'manipulation'
    }}
  >
    {option}
  </button>
);

export const transportOptions = ["地铁", "步行", "骑行", "驾车"];
