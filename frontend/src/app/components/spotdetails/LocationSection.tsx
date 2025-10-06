// components/spotdetails/LocationSection.tsx
"use client";

// 假设 GaodeMapComponent 也在 spotdetails 文件夹中，如果不在，请调整路径
import GaodeMapComponent from './GaodeMapComponent';

// 【修改】更新 Props，让它能接收 coordinates
interface LocationSectionProps {
  address: string;
  onOpenMap: () => void;
  coordinates: [number, number] | null; 
}

const LocationSection = ({ address, onOpenMap, coordinates }: LocationSectionProps) => {
  return (
    <div className="location-section-container">
      <div className="location-header">
        <h4>位置</h4>
        <p className="map-link" onClick={onOpenMap}>在地图中打开</p>
      </div>
      
      {/* 【核心改动】进行条件渲染，有坐标就显示地图，否则显示加载提示 */}
      <div className="map-placeholder">
        {coordinates ? (
          <GaodeMapComponent coordinates={coordinates} address={address} />
        ) : (
          <p style={{ color: '#888', textAlign: 'center' }}>地图加载中...</p>
        )}
      </div>

      <style jsx>{`
        .location-section-container { padding: 16px; background-color: white; margin: 0; }
        .location-header { display: flex; height: 22px; justify-content: space-between; align-items: center; margin-bottom: 14px; }
        h4 { font-family: 'Inter', sans-serif; font-size: 18px; font-weight: bold; color: #1B1446; margin: 0; }
        .map-placeholder { 
          width: 100%; /* 使用 100% 宽度以适应不同屏幕 */
          height: 150px; /* 您可以根据需要调整高度 */
          background-color: #f0f0f0; 
          border-radius: 8px; 
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .map-link { font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500; color: #0768FD; cursor: pointer; margin: 0; }
      `}</style>
    </div>
  );
};

export default LocationSection;