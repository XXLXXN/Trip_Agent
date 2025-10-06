// components/hotelComponents/LocationSection.tsx
"use client";

// 导入高德地图组件
import GaodeMapComponent from './GaodeMapComponent';

// 定义 Props，确保它能接收 coordinates
interface LocationSectionProps {
  address: string;
  onOpenMap: () => void;
  coordinates: [number, number] | null; 
}

const LocationSection = ({ address, onOpenMap, coordinates }: LocationSectionProps) => {
  console.log("LocationSection收到的坐标是:", coordinates);
  return (
    <div className="location-section-container">
      <div className="location-header">
        <h4>位置</h4>
        <p className="map-link" onClick={onOpenMap}>在地图中打开</p>
      </div>
      
      {/* 
        核心改动在这里：
        我们不再使用一个固定的灰色div，而是进行条件渲染。
        - 如果 coordinates 存在，就显示真正的地图组件 GaodeMapComponent。
        - 如果 coordinates 是 null（正在加载），就显示提示文字。
      */}
      <div className="map-placeholder">
        {coordinates ? (
          <GaodeMapComponent coordinates={coordinates} address={address} />
        ) : (
          <p style={{ color: '#888', textAlign: 'center' }}>地图加载中...</p>
        )}
      </div>

      {/* 样式保持不变，但现在 map-placeholder 成了地图的容器 */}
      <style jsx>{`
        .location-section-container {
          padding: 16px;
          background-color: white;
          margin: 0;
        }
        .location-header {
          display: flex;
          height: 22px;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }
        h4 {
          font-family: 'Inter', sans-serif;
          font-size: 18px;
          font-weight: bold;
          line-height: 22px;
          letter-spacing: 0;
          color: #1B1446;
          margin: 0;
        }
        .map-placeholder {
          width: 100%; /* 使用 100% 宽度以适应不同屏幕 */
          height: 150px; /* 可以根据需要调整高度 */
          background-color: #f0f0f0; 
          border-radius: 8px;
          overflow: hidden; /* 确保地图不会超出圆角范围 */
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .map-link {
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 500;
          line-height: 17px;
          letter-spacing: 0;
          color: #0768FD;
          cursor: pointer;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default LocationSection;
