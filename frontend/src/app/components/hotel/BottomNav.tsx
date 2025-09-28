// components/travel/BottomNav.tsx

'use client'; 

import { useRouter } from 'next/navigation'; 

// 导出 BottomNav 组件
export default function BottomNav() {
  const router = useRouter(); 

  const handleNextClick = () => {
    // 您可以把 '/summary' 替换为您想跳转的任何目标页面路径
    router.push('/messagecard'); 
  };

  return (
    <>
      <div className="bottom-nav">
        <button className="next-button" onClick={handleNextClick}>
          下一步
        </button>
      </div>
      <div className="bottom-padding"></div>
      <style jsx>{`
        .bottom-nav {
          font-family: 'Inter', semi-bold;
          font-size: 14px;
          font-weight: 500;
          line-height: auto;
          letter-spacing: 0.00em;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 16px;
          background-color: white;
          border-top: 1px solid #FFFFFF;
          display: flex;
          justify-content: center;
        }
        .next-button {
          width: 327px;
          height: 48px;
          background-color: #0768FD;
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
        .bottom-padding {
          height: 88px; 
        }
      `}</style>
    </>
  );
}