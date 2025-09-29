// components/spotlist/BottomNav.tsx

'use client'; 

import { useRouter } from 'next/navigation'; 

export default function BottomNav() {
  const router = useRouter(); 

  const handleNextClick = () => {
    router.push('/traffic'); 
  };

  return (
    <>
      <div className="bottom-nav">
        <button className="next-button" onClick={handleNextClick}>
          下一步
        </button>
      </div>
      {/* 这个空白 div 用于在页面底部创建占位空间，防止列表的最后一条内容被固定的导航栏遮挡 */}
      <div className="bottom-padding"></div>
      <style jsx>{`
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 16px;
          background-color: white;
          border-top: 1px solid #FFFFFF;
          display: flex;
          justify-content: center;
          z-index: 10; /* 确保在最上层 */
        }
        .next-button {
          width: 327px;
          height: 48px;
          background-color: #0768FD;
          color: white;
          border-radius: 16px;
          font-weight: 600;
          font-size: 1rem; 
          border: none;
          cursor: pointer;
        }
        .bottom-padding {
          height: 88px; /* 预留空间，高度约等于导航栏高度 + padding */
        }
      `}</style>
    </>
  );
}