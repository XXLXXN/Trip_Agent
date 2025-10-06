// components/hotel/BottomActionNav.tsx

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface BottomActionNavProps {
  onNextClick?: () => Promise<void> | void;
  isLoading?: boolean;
}

export default function BottomActionNav({
  onNextClick,
  isLoading = false,
}: BottomActionNavProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNextClick = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      if (onNextClick) {
        await onNextClick();
      }
      // 只有在成功执行onNextClick后才导航
      router.push("/trafficlist");
    } catch (error) {
      console.error("处理下一步点击时发生错误:", error);
      setError("请求失败，请重试");
      setIsProcessing(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    handleNextClick();
  };

  return (
    <>
      <div className="bottom-nav-container">
        {error ? (
          <div className="error-section">
            <div className="error-message">{error}</div>
            <button className="retry-button" onClick={handleRetry}>
              重试
            </button>
          </div>
        ) : (
          <button
            className="next-button"
            onClick={handleNextClick}
            disabled={isProcessing || isLoading}
          >
            {isProcessing ? "发送中..." : "下一步"}
          </button>
        )}
      </div>
      <style jsx>{`
        .bottom-nav-container {
          font-family: "Inter", semi-bold;
          font-size: 14px;
          font-weight: 500;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 16px;
          background-color: white;
          border-top: 1px solid #e0e0e0;
          display: flex;
          justify-content: center;
          z-index: 1000;
        }
        .error-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          width: 100%;
        }
        .error-message {
          color: #ff4444;
          font-size: 14px;
          text-align: center;
          padding: 8px 16px;
          background-color: #fff5f5;
          border-radius: 8px;
          border: 1px solid #ffcccc;
        }
        .next-button {
          width: 327px;
          height: 48px;
          background-color: #0768fd;
          color: white;
          padding: 0;
          border-radius: 16px;
          font-weight: 600;
          font-size: 1rem;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .next-button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
        .retry-button {
          width: 327px;
          height: 48px;
          background-color: #ff4444;
          color: white;
          border-radius: 16px;
          font-weight: 600;
          font-size: 1rem;
          border: none;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}
