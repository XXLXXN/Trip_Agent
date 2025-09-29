// components/hotel/HotelCard.tsx

'use client';
import { Hotel } from '@/mockData/hoteldata'; // 建议将类型定义集中管理

interface HotelCardProps {
  /** 酒店数据对象 */
  hotel: Hotel;
  /** 卡片是否处于选中状态，用于决定显示'+'或'-'图标 */
  isSelected: boolean;
  /** 当用户点击 +/- 按钮时触发的回调函数 */
  onToggleSelection: (hotelId: number) => void;
}

export default function HotelCard({ hotel, isSelected, onToggleSelection }: HotelCardProps) {
  
  const handleButtonClick = (e: React.MouseEvent) => {
    // 阻止事件冒泡，以免触发卡片本身的点击跳转
    e.stopPropagation();
    onToggleSelection(hotel.id);
  };

  return (
    <>
      <div className="hotel-card">
        <div className="hotel-image-placeholder"></div>
        <div className="hotel-info">
          <h3 className="hotel-name">{hotel.name}</h3>
          <div className="hotel-location-wrapper">
            <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 1.58057C3.9 1.58057 2 3.19057 2 5.68057C2 7.27057 3.225 9.14057 5.67 11.2956C5.86 11.4606 6.145 11.4606 6.335 11.2956C8.775 9.14057 10 7.27057 10 5.68057C10 3.19057 8.1 1.58057 6 1.58057ZM6 6.58057C5.45 6.58057 5 6.13057 5 5.58057C5 5.03057 5.45 4.58057 6 4.58057C6.55 4.58057 7 5.03057 7 5.58057C7 6.13057 6.55 6.58057 6 6.58057Z" fill="#808080"/>
            </svg>
            <span className="hotel-location">{hotel.location}</span>
          </div>
          <div className="price-and-rating-wrapper">
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
        </div>
        <button className="action-button" onClick={handleButtonClick}>
          {isSelected ? (
            <div className="icon-minus"></div>
          ) : (
            <svg className="icon-plus" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 3.33331V12.6666" stroke="#0768FD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.33331 8H12.6666" stroke="#0768FD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>
      <style jsx>{`
        .hotel-card { background-color: white; border-radius: 16px; padding: 16px; display: flex; align-items: center; gap: 16px; position: relative; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); }
        .hotel-image-placeholder { width: 80px; height: 80px; background-color: #e5e7eb; border-radius: 12px; flex-shrink: 0; }
        .hotel-info { flex-grow: 1; display: flex; flex-direction: column; gap: 6px; }
        .hotel-name { font-size: 14px; font-weight: 500; color: #1B1446; }
        .hotel-location-wrapper { display: flex; align-items: center; gap: 4px; }
        .hotel-location { font-size: 10px; color: #808080; text-transform: uppercase; }
        .price-and-rating-wrapper { display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
        .hotel-price-wrapper { display: flex; align-items: baseline; gap: 2px; }
        .hotel-price { font-size: 14px; font-weight: 600; color: #398B2B; }
        .price-per-night { font-size: 12px; color: #808080; }
        .hotel-rating-wrapper { display: flex; align-items: center; gap: 4px; }
        .star-icon { width: 16px; height: 16px; color: #FFBE41; }
        .hotel-rating { font-size: 12px; color: #BFBFBF; }
        .action-button { position: absolute; top: 16px; right: 16px; background: none; border: none; cursor: pointer; padding: 4px; }
        .icon-minus { width: 14px; height: 3px; background-color: #0768FD; border-radius: 2px; }
        .icon-plus { width: 16px; height: 16px; }
      `}</style>
    </>
  );
}