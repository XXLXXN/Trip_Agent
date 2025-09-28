"use client";

import React from "react";

export const PillIconButton: React.FC<{
  onClick?: () => void;
  children: React.ReactNode;
  width?: number | string;
  height?: number | string;
}> = ({ onClick, children, width = 56, height = 44 }) => {
  const radius = typeof height === "number" ? height / 2 : "9999em";
  return (
    <button
      onClick={onClick}
      style={{
        width: width as any,
        height: height as any,
        borderRadius: radius as any,
        background: "#FFFFFF",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #E6EAF0",
        boxShadow: "0 1px 3px rgba(17,24,39,0.06)",
        cursor: "pointer",
        padding: 0,
      }}
      aria-label="icon-button"
    >
      {children}
    </button>
  );
};
