import React from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export default function InteractiveLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={inter.className}
      style={{
        minHeight: "100dvh",
        backgroundColor: "#fff",
        color: "#1B1446",
        fontFamily: "Inter, sans-serif",
        display: "block",
      }}
    >
      {children}
    </div>
  );
}
