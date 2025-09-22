// components/travel/HotelCard.tsx

'use client'; // 1. 添加 'use client' 指令以使用 hook

import { useRouter } from 'next/navigation'; // 2. 引入 useRouter

// 3. 更新 Hotel 类型，与 data.tsx 保持一致
interface Hotel {
  id: number;
  name: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  path: string; // 确保这里也有 path
}

interface HotelCardProps {
  hotel: Hotel;
}

export default function HotelCard({ hotel }: HotelCardProps) {
  const router = useRouter(); // 4. 初始化 router

  // 5. 创建点击事件处理函数
  const handleCardClick = () => {
    // 点击时，跳转到 hotel 对象中定义的 path
    router.push(hotel.path);
  };

  return (
    <>
      {/* 6. 将 onClick 事件绑定到主卡片容器上 */}
      <div className="hotel-card" onClick={handleCardClick}>
        {/* 左侧图片区域 */}
        <div className="hotel-image-container">
          {/* 这里可以替换为 <img /> 标签 */}
        </div>

        {/* 右侧内容区域 */}
        <div className="hotel-content">
          {/* 内容的上半部分：标题和位置 */}
          <div className="top-info">
            <h3 className="hotel-name">{hotel.name}</h3>
            <div className="hotel-location-wrapper">
              <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 1.58057C3.9 1.58057 2 3.19057 2 5.68057C2 7.27057 3.225 9.14057 5.67 11.2956C5.86 11.4606 6.145 11.4606 6.335 11.2956C8.775 9.14057 10 7.27057 10 5.68057C10 3.19057 8.1 1.58057 6 1.58057ZM6 6.58057C5.45 6.58057 5 6.13057 5 5.58057C5 5.03057 5.45 4.58057 6 4.58057C6.55 4.58057 7 5.03057 7 5.58057C7 6.13057 6.55 6.58057 6 6.58057Z" fill="#808080"/>
              </svg>
              <span className="hotel-location">{hotel.location}</span>
            </div>
          </div>

          {/* 内容的下半部分：价格和评分 */}
          <div className="bottom-info">
            <div className="hotel-price-wrapper">
              <span className="hotel-price">${hotel.price}</span>
              <span className="price-per-night">/night</span>
            </div>
            <div className="hotel-rating-wrapper">
              <svg className="star-icon" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="hotel-rating">{hotel.rating}</span>
            </div>
          </div>
          
          {/* 右上角的选择按钮 */}
          <button className="select-button">
            <div className="select-icon"></div>
          </button>
        </div>
      </div>
      <style jsx>{`
        /* 主卡片容器 */
        .hotel-card {
          width: 343px;
          height: 114px;
          background-color: white;
          border-radius: 16px;
          border: 1px solid #f3f4f6;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          display: flex;
          overflow: hidden;
          cursor: pointer; /* 7. 添加手型光标，提示用户可以点击 */
          transition: transform 0.2s ease, box-shadow 0.2s ease; /* 添加悬停动效 */
        }
        .hotel-card:hover {
          transform: translateY(-2px); /* 鼠标悬停时轻微上浮 */
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.08); /* 悬停时阴影加深 */
        }

        /* 左侧图片容器 */
        .hotel-image-container {
          width: 134px;
          height: 100%;
          background-color: #e5e7eb;
          flex-shrink: 0;
          border-radius: 12px;
        }

        /* (其余样式保持不变) */
        .hotel-content { flex: 1; padding: 16px; display: flex; flex-direction: column; justify-content: space-between; position: relative; }
        .hotel-name { font-family: 'Inter', medium; font-size: 14px; font-weight: 500; line-height: auto; letter-spacing: 0.00em; color: #1B1446; }
        .hotel-location-wrapper { display: flex; align-items: center; gap: 4px; }
        .hotel-location { font-family: 'Inter', medium; font-size: 10px; font-weight: 500; line-height: auto; letter-spacing: 0.08em; color: #808080; }
        .bottom-info { display: flex; align-items: flex-end; justify-content: space-between; }
        .hotel-price-wrapper { display: flex; align-items: baseline; gap: 2px; }
        .hotel-price { font-family: 'Inter', semi-bold; font-size: 14px; font-weight: 500; line-height: auto; letter-spacing: 0.00em; color: #398B2B; }
        .price-per-night { font-family: 'Inter', regular; font-size: 12px; font-weight: 500; line-height: auto; letter-spacing: 0.00em; color: #808080; }
        .hotel-rating-wrapper { display: flex; align-items: center; gap: 4px; }
        .star-icon { width: 18px; height: 18px; color: #FFBE41; }
        .hotel-rating { font-family: 'Inter', medium; font-size: 12px; font-weight: 500; line-height: auto; letter-spacing: 0.00em; color: #BFBFBF; }
        .select-button { position: absolute; top: 16px; right: 16px; padding: 0; background: none; border: none; cursor: pointer; }
        .select-icon { width: 20px; height: 4px; background-color: #3b82f6; border-radius: 2px; }
      `}</style>
    </>
  );
}