// components/LocationSection.tsx

interface LocationSectionProps {
  address: string;
  onOpenMap: () => void;
}

const LocationSection = ({ address, onOpenMap }: LocationSectionProps) => {
  return (
    <div className="location-section-container">
      <div className="location-header">
        <h4>位置</h4>
        <p className="map-link" onClick={onOpenMap}>在地图中打开</p>
      </div>
      <div className="map-placeholder"></div>
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
          width: 343px;
          height: 121px;
          background-color: #e0e0e0;
          border-radius: 8px;
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