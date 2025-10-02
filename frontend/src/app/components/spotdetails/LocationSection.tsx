// components/LocationSection.tsx

interface LocationSectionProps {
  address: string;
  onOpenMap: () => void; // "在地图中打开"的回调函数
}

/**
 * 显示位置信息的组件，包含一个地图占位符。
 */
const LocationSection = ({ address, onOpenMap }: LocationSectionProps) => {
  return (
    <div className="location-section-container">
      <div className="location-header">
        <h4>位置</h4>
        <p className="map-link" onClick={onOpenMap}>在地图中打开</p>
      </div>
      {/* 地图占位符，未来可以替换为真实的地图组件 */}
      <div className="map-placeholder"></div>
      <style jsx>{`
        /* 样式代码保持不变 */
        .location-section-container { padding: 16px; background-color: white; margin: 0; }
        .location-header { display: flex; height: 22px; justify-content: space-between; align-items: center; margin-bottom: 14px; }
        h4 { font-family: 'Inter', sans-serif; font-size: 18px; font-weight: bold; color: #1B1446; margin: 0; }
        .map-placeholder { width: 343px; height: 121px; background-color: #e0e0e0; border-radius: 8px; }
        .map-link { font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500; color: #0768FD; cursor: pointer; margin: 0; }
      `}</style>
    </div>
  );
};

export default LocationSection;