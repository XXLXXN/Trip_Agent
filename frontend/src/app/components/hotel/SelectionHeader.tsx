// components/hotel/SelectionHeader.tsx

"use client";

import { PillIconButton, ArrowLeft } from "../../fireflyx_parts/components";

interface SelectionHeaderProps {
  /** 返回按钮的点击事件处理函数 */
  onBackClick: () => void;
  /** 跳过按钮的点击事件处理函数 */
  onSkipClick: () => void;
}

export default function SelectionHeader({
  onBackClick,
  onSkipClick,
}: SelectionHeaderProps) {
  return (
    <>
      <div className="header-container">
        <div className="header-left">
          <PillIconButton width={"3.78rem"} height={"2.5rem"} onClick={onBackClick}>
            <ArrowLeft size={16} color="#0768FD" />
          </PillIconButton>
          <h1 className="header-title">酒店选择</h1>
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
          width: 80px;
          font-family: "Inter", semi-bold;
          font-size: 20px;
          font-weight: 500;
          line-height: 14px;
          letter-spacing: 0em;
          padding: 0 0 4px 0;
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
