// components/travel/Header.tsx

"use client";

import { PillIconButton, ArrowLeft } from "../../fireflyx_parts/components";

interface HeaderProps {
  onBackClick: () => void;
  onSkipClick: () => void;
}

/**
 * 通用的页面顶部栏，包含返回按钮、标题和跳过按钮。
 */
export default function Header({ onBackClick, onSkipClick }: HeaderProps) {
  return (
    <>
      <div className="header-container">
        <div className="header-left">
          <PillIconButton width={"3.78rem"} height={"2.5rem"} onClick={onBackClick}>
            <ArrowLeft size={16} color="#0768FD" />
          </PillIconButton>
          <h1 className="header-title">出行选择</h1>
        </div>
        <button className="skip-button" onClick={onSkipClick}>
          一键规划
        </button>
      </div>
      <style jsx>{`
        .header-container {
          padding: calc(env(safe-area-inset-top) + 1.5rem) 20px 24px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #d9d9d9;
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .header-title {
          font-family: "Inter", semi-bold;
          font-size: 20px;
          font-weight: 500;
          color: #ffffff;
        }
        .skip-button {
          width: 79px;
          height: 37px;
          font-family: "Inter", semi-bold;
          font-size: 14px;
          font-weight: 500;
          color: #ffffff;
          background-color: #0768fd;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}
