"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer, ScrollableContent } from "../fireflyx_parts/components";

export default function PaymentSuccess() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState('19:02');

  useEffect(() => {
    // 更新时间
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // 每分钟更新一次

    return () => clearInterval(interval);
  }, []);

  const handleAction = (actionName: string) => {
    if (actionName === '返回主页') {
      router.push('/');
    } else {
      alert(`执行操作: ${actionName}`);
    }
  };

  const copyOrderNumber = () => {
    navigator.clipboard.writeText('776476467276')
      .then(() => {
        alert('订单号已复制到剪贴板');
      })
      .catch(err => {
        console.error('无法复制文本: ', err);
      });
  };

  return (
    <PageContainer>
      <ScrollableContent className="space-y-4 pt-8 pb-4" hasBottomButton={false}>
        {/* 成功图标 */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="w-32 h-32 flex items-center justify-center">
            <svg width="146" height="125" viewBox="0 0 146 125" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="11.6017" y="0.976562" width="124" height="124" rx="62" fill="url(#paint0_linear_17_2829)"/>
              <mask id="mask0_17_2829" style={{maskType: 'alpha'}} maskUnits="userSpaceOnUse" x="11" y="0" width="125" height="125">
                <rect x="11.6017" y="0.976562" width="124" height="124" rx="62" fill="#D9D9D9"/>
              </mask>
              <g mask="url(#mask0_17_2829)">
                <rect x="34.1017" y="28" width="79" height="126" rx="14" fill="white"/>
                <path d="M97.6017 23C108.924 23 118.102 32.1782 118.102 43.5V140.5C118.102 151.822 108.924 161 97.6017 161H49.6017C38.2798 161 29.1017 151.822 29.1017 140.5V43.5C29.1017 32.1782 38.2798 23 49.6017 23H97.6017ZM49.6017 32C43.2504 32 38.1017 37.1487 38.1017 43.5V140.5C38.1017 146.851 43.2504 152 49.6017 152H97.6017C103.953 152 109.102 146.851 109.102 140.5V43.5C109.102 37.1487 103.953 32 97.6017 32H90.7806C89.7614 32 88.9053 32.7664 88.7928 33.7793L88.4972 36.4414C88.2721 38.4671 86.5598 40 84.5216 40H61.6818C59.6436 40 57.9313 38.4671 57.7062 36.4414L57.4106 33.7793C57.2981 32.7664 56.4419 32 55.4228 32H49.6017Z" fill="url(#paint1_linear_17_2829)"/>
              </g>
              <rect opacity="0.2" x="49.2034" y="56.5566" width="48.7967" height="48.7967" rx="24.3983" fill="url(#paint2_radial_17_2829)"/>
              <rect x="57.844" y="65.1973" width="31.5149" height="31.5149" rx="15.7575" fill="url(#paint3_linear_17_2829)"/>
              <rect opacity="0.32" x="60.77" y="68.1239" width="25.6613" height="25.6613" rx="12.8306" stroke="url(#paint4_linear_17_2829)" strokeWidth="0.886452"/>
              <path d="M69.6023 86.4342L65.0134 81.8453C64.5149 81.3468 64.5149 80.5415 65.0134 80.043C65.5119 79.5445 66.3172 79.5445 66.8157 80.043L70.5098 83.7243L79.3041 74.93C79.8026 74.4315 80.6079 74.4315 81.1064 74.93C81.6049 75.4285 81.6049 76.2338 81.1064 76.7324L71.4046 86.4342C70.9189 86.9327 70.1008 86.9327 69.6023 86.4342Z" fill="white"/>
              <rect x="104.728" y="14.1191" width="27.254" height="25.5938" fill="white"/>
              <path d="M116.769 3.77929L101.275 10.6633C99.6809 11.3717 98.6405 12.9654 98.6405 14.7141V25.1176C98.6405 37.4026 107.14 48.8908 118.562 51.6798C129.984 48.8908 138.484 37.4026 138.484 25.1176V14.7141C138.484 12.9654 137.443 11.3717 135.85 10.6633L120.355 3.77929C119.226 3.27018 117.898 3.27018 116.769 3.77929Z" fill="url(#paint5_linear_17_2829)"/>
              <path opacity="0.6" d="M117.154 6.00586C118.039 5.60679 119.085 5.60686 119.970 6.00586L119.974 6.00781L134.392 12.4131C135.647 12.971 136.468 14.2281 136.468 15.6045V25.2861C136.468 34.5629 131.123 43.3409 123.377 47.4814C120.382 49.0822 116.744 49.0821 113.749 47.4814C106.002 43.3411 100.657 34.5631 100.657 25.2861V15.6045C100.657 14.3143 101.377 13.1292 102.502 12.5264L102.732 12.4131L117.151 6.00781L117.154 6.00586Z" stroke="url(#paint6_linear_17_2829)" strokeWidth="1.26487"/>
              <path d="M123.871 22.8193H122.986V21.0496C122.986 18.6075 121.004 16.6255 118.562 16.6255C116.12 16.6255 114.138 18.6075 114.138 21.0496V22.8193H113.253C112.28 22.8193 111.484 23.6156 111.484 24.5889V33.4372C111.484 34.4105 112.28 35.2069 113.253 35.2069H123.871C124.845 35.2069 125.641 34.4105 125.641 33.4372V24.5889C125.641 23.6156 124.845 22.8193 123.871 22.8193ZM118.562 30.7827C117.589 30.7827 116.793 29.9864 116.793 29.0131C116.793 28.0398 117.589 27.2434 118.562 27.2434C119.536 27.2434 120.332 28.0398 120.332 29.0131C120.332 29.9864 119.536 30.7827 118.562 30.7827ZM115.908 22.8193V21.0496C115.908 19.5808 117.093 18.3951 118.562 18.3951C120.031 18.3951 121.217 19.5808 121.217 21.0496V22.8193H115.908Z" fill="white"/>
              <circle cx="10.5" cy="47.5" r="10.5" fill="#FFBE66"/>
              <circle cx="133.5" cy="95" r="6" fill="url(#paint7_linear_17_2829)"/>
              <defs>
                <linearGradient id="paint0_linear_17_2829" x1="73.6017" y1="0.976562" x2="73.6017" y2="124.977" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#E4E9F3"/>
                  <stop offset="1" stopColor="#E4E9F3" stopOpacity="0"/>
                </linearGradient>
                <linearGradient id="paint1_linear_17_2829" x1="73.6017" y1="23" x2="73.6017" y2="161" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#4991FF"/>
                  <stop offset="1" stopColor="#0768FD"/>
                </linearGradient>
                <radialGradient id="paint2_radial_17_2829" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(73.6017 80.955) rotate(90) scale(24.3983)">
                  <stop offset="0.479973" stopColor="#FFC46B" stopOpacity="0"/>
                  <stop offset="1" stopColor="#FF9141"/>
                </radialGradient>
                <linearGradient id="paint3_linear_17_2829" x1="73.6015" y1="65.1973" x2="73.6015" y2="96.7122" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFC46B"/>
                  <stop offset="1" stopColor="#FF9141"/>
                </linearGradient>
                <linearGradient id="paint4_linear_17_2829" x1="73.6006" y1="67.6807" x2="73.6006" y2="94.2284" gradientUnits="userSpaceOnUse">
                  <stop stopColor="white"/>
                  <stop offset="1" stopColor="white" stopOpacity="0"/>
                </linearGradient>
                <linearGradient id="paint5_linear_17_2829" x1="118.562" y1="3.39746" x2="118.562" y2="51.6798" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFC46B"/>
                  <stop offset="1" stopColor="#FF9141"/>
                </linearGradient>
                <linearGradient id="paint6_linear_17_2829" x1="118.562" y1="5.07422" x2="118.562" y2="50.0037" gradientUnits="userSpaceOnUse">
                  <stop stopColor="white"/>
                  <stop offset="1" stopColor="white" stopOpacity="0"/>
                </linearGradient>
                <linearGradient id="paint7_linear_17_2829" x1="133.5" y1="89" x2="133.5" y2="101" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#4991FF"/>
                  <stop offset="1" stopColor="#0768FD"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        
        {/* 标题 */}
        <h1 className="text-[#1B1446] font-semibold text-[20px] text-center" style={{ fontFamily: 'Inter' }}>
          完成支付
        </h1>
        
        {/* 步骤进度 */}
        <div className="flex justify-between items-center relative px-5">
          <div className="absolute top-2 left-8 right-8 h-2 bg-[#83B4FE] rounded-full z-0"></div>
          <div className="flex flex-col items-center z-10">
            <div className="w-6 h-6 bg-[#0768FD] rounded-full flex items-center justify-center mb-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="white"/>
              </svg>
            </div>
            <span className="text-[#1B1446] text-[12px]" style={{ fontFamily: 'Inter' }}>预订</span>
          </div>
          
          <div className="flex flex-col items-center z-10">
            <div className="w-6 h-6 bg-[#0768FD] rounded-full flex items-center justify-center mb-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="white"/>
              </svg>
            </div>
            <span className="text-[#1B1446] text-[12px]" style={{ fontFamily: 'Inter' }}>支付</span>
          </div>
          
          <div className="flex flex-col items-center z-10">
            <div className="w-6 h-6 bg-[#0768FD] rounded-full flex items-center justify-center mb-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="white"/>
              </svg>
            </div>
            <span className="text-[#1B1446] text-[12px]" style={{ fontFamily: 'Inter' }}>完成</span>
          </div>
        </div>
        
        {/* 订单信息 */}
        <div className="bg-white rounded-lg p-3 flex items-center justify-center gap-2">
          <span className="text-[#1B1446] text-[15px] font-medium" style={{ fontFamily: 'Inter' }}>
            订单号：
          </span>
          <span className="text-[#1B1446] text-[15px] font-semibold" style={{ fontFamily: 'Inter' }}>
            776476467276
          </span>
          <button onClick={copyOrderNumber} className="ml-2 p-1">
            <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.83337 12.3335H2.16671V3.66683C2.16671 3.30016 1.86671 3.00016 1.50004 3.00016C1.13337 3.00016 0.833374 3.30016 0.833374 3.66683V12.3335C0.833374 13.0668 1.43337 13.6668 2.16671 13.6668H8.83337C9.20004 13.6668 9.50004 13.3668 9.50004 13.0002C9.50004 12.6335 9.20004 12.3335 8.83337 12.3335ZM12.1667 9.66683V1.66683C12.1667 0.933496 11.5667 0.333496 10.8334 0.333496H4.83337C4.10004 0.333496 3.50004 0.933496 3.50004 1.66683V9.66683C3.50004 10.4002 4.10004 11.0002 4.83337 11.0002H10.8334C11.5667 11.0002 12.1667 10.4002 12.1667 9.66683ZM10.8334 9.66683H4.83337V1.66683H10.8334V9.66683Z" fill="#0768FD"/>
            </svg>
          </button>
        </div>
        
        {/* 二维码 */}
        <div className="flex justify-center">
          <div className="w-36 h-36 bg-white rounded-2xl border-2 border-[#E7E7E7] flex items-center justify-center shadow-sm">
            <img src="/images/double_code.png" alt="二维码" className="w-32 h-32" />
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="px-5 pt-2 pb-2">
        <div className="space-y-2">
          <button 
            onClick={() => handleAction('返回主页')}
            className="w-full h-12 bg-white border-2 border-[#E2E3E6] rounded-2xl text-[#0768FD] font-medium text-[16px] flex items-center justify-center gap-2 hover:bg-[#F0F8FF] transition-colors"
            style={{ fontFamily: 'Inter' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z" fill="#0768FD"/>
            </svg>
            返回主页
          </button>
          
          <button 
            onClick={() => handleAction('同步到日历')}
            className="w-full h-12 bg-[#0768FD] rounded-2xl text-white font-medium text-[16px] flex items-center justify-center gap-2 hover:bg-[#0656D1] transition-colors"
            style={{ fontFamily: 'Inter' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM19 8H5V6H19V8ZM9 14H7V12H9V14ZM13 14H11V12H13V14ZM17 14H15V16H17V14ZM9 18H7V16H9V18ZM13 18H11V16H13V18ZM17 18H15V16H17V18Z" fill="white"/>
            </svg>
            同步到日历
          </button>
          
          <button 
            onClick={() => handleAction('分享')}
            className="w-full h-12 bg-[#0768FD] rounded-2xl text-white font-medium text-[16px] flex items-center justify-center gap-2 hover:bg-[#0656D1] transition-colors"
            style={{ fontFamily: 'Inter' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 16.08C17.24 16.08 16.56 16.38 16.04 16.85L8.91 12.7C8.96 12.47 9 12.24 9 12C9 11.76 8.96 11.53 8.91 11.3L15.96 7.19C16.5 7.69 17.21 8 18 8C19.66 8 21 6.66 21 5C21 3.34 19.66 2 18 2C16.34 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L8.04 9.81C7.5 9.31 6.79 9 6 9C4.34 9 3 10.34 3 12C3 13.66 4.34 15 6 15C6.79 15 7.5 14.69 8.04 14.19L15.16 18.34C15.11 18.55 15.08 18.77 15.08 19C15.08 20.61 16.39 21.91 18 21.91C19.61 21.91 20.92 20.61 20.92 19C20.92 17.39 19.61 16.08 18 16.08Z" fill="white"/>
            </svg>
            分享
          </button>
        </div>
        </div>
      </ScrollableContent>
    </PageContainer>
  );
};