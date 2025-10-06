// frontend/src/app/fireflyx_parts/components/FixedBottomBar.tsx
"use client";

import React from "react";

interface FixedBottomBarProps {
  children: React.ReactNode;
}

export const FixedBottomBar: React.FC<FixedBottomBarProps> = ({ children }) => {
  return (
    <div 
      className="fixed inset-x-0 bottom-0 bg-white px-5 pt-3 shadow-[0_-1px_0_rgba(0,0,0,0.06)]" 
      style={{ 
        paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)",
        zIndex: 9999,
        position: 'fixed' // Explicitly set position to fixed
      }}
    >
      {children}
    </div>
  );
};
