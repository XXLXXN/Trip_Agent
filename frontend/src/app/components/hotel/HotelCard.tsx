// components/hotel/HotelCard.tsx

"use client";
import { useRouter } from "next/navigation";
import { Hotel } from "@/mockData/hoteldata"; // 建议将类型定义集中管理

interface HotelCardProps {
  /** 酒店数据对象 */
  hotel: Hotel;
  /** 卡片是否处于选中状态，用于决定显示'+'或'-'图标 */
  isSelected: boolean;
  /** 当用户点击 +/- 按钮时触发的回调函数 */
  onToggleSelection: (hotelId: number) => void;
  /** (可选) 调整 +/- 按钮的垂直位置（单位：像素），默认为 16 */
  buttonVerticalOffset?: number;
}

export default function HotelCard({
  hotel,
  isSelected,
  onToggleSelection,
  buttonVerticalOffset = 16, // 为新属性设置默认值
}: HotelCardProps) {
  const router = useRouter();

  // 处理整个卡片的点击，用于页面跳转
  const handleCardClick = () => {
    router.push(hotel.path);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    // 阻止事件冒泡，以免触发卡片本身的点击跳转
    e.stopPropagation();
    onToggleSelection(hotel.id);
  };

  return (
    <>
      <div className="hotel-card" onClick={handleCardClick}>
        {/* 酒店图片容器 */}
        <div className="hotel-image-container">
          {hotel.image && hotel.image !== "/placeholder-hotel.jpg" ? (
            <img src={hotel.image} alt={hotel.name} className="hotel-image" />
          ) : (
            <div className="hotel-image-placeholder"></div>
          )}
        </div>
        <div className="hotel-info">
          <h3 className="hotel-name">{hotel.name}</h3>
          <div className="hotel-location-wrapper">
            <svg
              width="12"
              height="13"
              viewBox="0 0 12 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 1.58057C3.9 1.58057 2 3.19057 2 5.68057C2 7.27057 3.225 9.14057 5.67 11.2956C5.86 11.4606 6.145 11.4606 6.335 11.2956C8.775 9.14057 10 7.27057 10 5.68057C10 3.19057 8.1 1.58057 6 1.58057ZM6 6.58057C5.45 6.58057 5 6.13057 5 5.58057C5 5.03057 5.45 4.58057 6 4.58057C6.55 4.58057 7 5.03057 7 5.58057C7 6.13057 6.55 6.58057 6 6.58057Z"
                fill="#808080"
              />
            </svg>
            <span className="hotel-location">{hotel.location}</span>
          </div>
          <div className="price-and-rating-wrapper">
            <div className="hotel-price-wrapper">
              <span className="hotel-price">${hotel.price}</span>
              <span className="price-per-night">/night</span>
            </div>
            <div className="hotel-rating-wrapper">
              <svg
                className="star-icon"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="hotel-rating">{hotel.rating}</span>
            </div>
          </div>
        </div>
        {/* 使用内联 style 将 props 变量应用到 CSS */}
        <button
          className="action-button"
          onClick={handleButtonClick}
          style={{ top: `${buttonVerticalOffset}px` }}
        >
          {isSelected ? (
            <div className="icon-minus"></div>
          ) : (
            <svg
              className="icon-plus"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 3.33331V12.6666"
                stroke="#0768FD"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3.33331 8H12.6666"
                stroke="#0768FD"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>
      <style jsx>{`
        /* 调整 .hotel-card 以适应新的图片尺寸 (114px 高度) */
        .hotel-card {
          background-color: white;
          border-radius: 16px;
          /* 保持 SpotCard 的尺寸: width: 343px, height: 114px */
          width: 343px;
          height: 114px; /* 强制高度为 114px */

          border: 1px solid #f3f4f6; /* 添加 SpotCard 的边框 */
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* 调整阴影 */

          padding: 0; /* 移除 padding, 因为内容区和图片容器各自有 padding 或尺寸控制 */
          display: flex;
          align-items: stretch; /* 确保子项（如图片容器）能占满高度 */
          gap: 0; /* 移除 gap，让图片和内容紧贴 */
          position: relative;
          overflow: hidden; /* 确保圆角生效 */
          cursor: pointer; /* 确保可点击 */
        }

        /* 酒店图片容器样式 */
        .hotel-image-container {
          width: 134px;
          height: 100%; /* 高度占满父容器 (114px) */
          flex-shrink: 0;
          border-radius: 12px; /* 圆角应该只在容器内部生效，这里设置了 border-radius，但由于父容器 overflow: hidden，子容器的圆角会由父容器的圆角控制。 */
          overflow: hidden;
          background-color: #e5e7eb; /* 默认背景色 */
        }
        /* 酒店图片样式 */
        .hotel-image {
          width: 100%;
          height: 100%;
          object-fit: cover; /* 保持图片比例并填充容器 */
        }
        /* 确保占位符能填满容器 */
        .hotel-image-placeholder {
          width: 100%;
          height: 100%;
          background-color: #e5e7eb;
          border-radius: 12px; /* 仅图片占位符有圆角 */
        }

        /* 调整内容区的 padding 和布局 */
        .hotel-info {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between; /* 确保价格等信息在底部 */
          gap: 6px;
          /* 关键改动 (1): 增加右侧内边距，防止内容与按钮重叠 */
          padding: 16px 48px 16px 16px;
        }

        /* 保持原有的文本样式 */
        .hotel-name {
          width: 150px;
          font-size: 16px; /* 调整为 SpotCard 的字体大小 */
          font-weight: 600; /* 调整为 SpotCard 的字体粗细 */
          color: #1b1446;
          margin: 0;
          line-height: 1.2;
          white-space: nowrap; /* 单行显示 */
          overflow: hidden;
          text-overflow: ellipsis; /* 超出部分显示省略号 */
        }
        .hotel-location-wrapper {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 4px;
        }
        .hotel-location {
          font-size: 12px;
          color: #6b7280;
          text-transform: none; /* 移除大写 */
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 150px; /* 限制位置文本宽度 */
        }
        .price-and-rating-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
          min-height: 20px; /* 确保价格和评分区域有最小高度 */
        }
        .hotel-price-wrapper {
          display: flex;
          align-items: baseline;
          gap: 2px;
        }
        .hotel-price {
          font-size: 14px;
          font-weight: 600;
          color: #398b2b;
        }
        .price-per-night {
          font-size: 12px;
          color: #808080;
        }
        .hotel-rating-wrapper {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .star-icon {
          width: 16px;
          height: 16px;
          color: #ffbe41;
        }
        .hotel-rating {
          font-size: 12px;
          color: #bfbfbf;
        }

        /* 保持按钮样式 */
        .action-button {
          position: absolute;
          right: 16px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }
        .icon-minus {
          width: 14px;
          height: 3px;
          background-color: #0768fd;
          border-radius: 2px;
          position: relative; /* 添加相对定位 */
          top: 3px; /* 将图标向下移动7px */
          right: 3px;
        }
        .icon-plus {
          width: 20px;
          height: 20px;
          position: relative;
          top: -5px;
        }
      `}</style>
    </>
  );
}
