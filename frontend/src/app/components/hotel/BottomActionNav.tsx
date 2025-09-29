// components/hotel/BottomActionNav.tsx

'use client'; 

import { useRouter } from 'next/navigation'; 

export default function BottomActionNav() {
  const router = useRouter(); 

  const handleNextClick = () => {
    // 点击后导航到下一页
    router.push('/messagecard'); 
  };

  return (
    <>
      <div className="bottom-nav-container">
        <button className="next-button" onClick={handleNextClick}>
          下一步
        </button>
      </div>
      {/* 这是一个占位元素，防止底部导航栏遮挡页面内容 */}
      <div className="bottom-padding"></div>
      <style jsx>{`
        .bottom-nav-container {
          font-family: 'Inter', semi-bold;
          font-size: 14px;
          font-weight: 500;
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