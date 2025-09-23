// components/LocationDetails.tsx

interface LocationDetailsProps {
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
  photos: string[];
  onScrollToLocation: () => void;
  onScrollToReviews: () => void;
}

const LocationDetails = ({ name, address, rating, reviewCount, photos, onScrollToLocation, onScrollToReviews }: LocationDetailsProps) => {
  return (
    <div className="location-details-container">
      <h2>{name}</h2>
      
      <div className="address-box" onClick={onScrollToLocation}>
        <div className="address-icon">
          <svg width="16" height="21" viewBox="0 0 16 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 0.661133C3.8 0.661133 0 3.88113 0 8.86113C0 12.0411 2.45 15.7811 7.34 20.0911C7.72 20.4211 8.29 20.4211 8.67 20.0911C13.55 15.7811 16 12.0411 16 8.86113C16 3.88113 12.2 0.661133 8 0.661133ZM8 10.6611C6.9 10.6611 6 9.76113 6 8.66113C6 7.56113 6.9 6.66113 8 6.66113C9.1 6.66113 10 7.56113 10 8.66113C10 9.76113 9.1 10.6611 8 10.6611Z" fill="#83B4FE"/>
          </svg>
        </div>
        <div className="address-content">
          <div className="address-label">地址</div>
          <div className="address-text">{address}</div>
        </div>
        <div className="address-arrow">
          <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.00002 1.21051C0.61002 1.60051 0.61002 2.23051 1.00002 2.62051L4.88002 6.50051L1.00002 10.3805C0.61002 10.7705 0.61002 11.4005 1.00002 11.7905C1.39002 12.1805 2.02002 12.1805 2.41002 11.7905L7.00002 7.20051C7.39002 6.81051 7.39002 6.18051 7.00002 5.79051L2.41002 1.20051C2.03002 0.82051 1.39002 0.82051 1.00002 1.21051Z" fill="#0768FD"/>
          </svg>
        </div>
      </div>

      <div className="rating-box" onClick={onScrollToReviews}>
        <span className="rating-icon">
          <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.00007 14.0195L13.1501 16.5295C13.9101 16.9895 14.8401 16.3095 14.6401 15.4495L13.5401 10.7295L17.2101 7.54952C17.8801 6.96952 17.5201 5.86952 16.6401 5.79952L11.8101 5.38952L9.92007 0.929522C9.58007 0.119521 8.42007 0.119521 8.08007 0.929522L6.19007 5.37952L1.36007 5.78952C0.480073 5.85952 0.120073 6.95952 0.790073 7.53952L4.46007 10.7195L3.36007 15.4395C3.16007 16.2995 4.09007 16.9795 4.85007 16.5195L9.00007 14.0195Z" fill="#FF9141"/>
          </svg>
        </span>
        <div className="rating-content">
          <div className="rating-label">评分</div>
          <div className="rating-info">
            <span className="rating-score">{rating}</span>
            <span className="review-count">({reviewCount} 条评价)</span>
          </div>
        </div>
        <div className="rating-arrow">
          <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.00002 1.21051C0.61002 1.60051 0.61002 2.23051 1.00002 2.62051L4.88002 6.50051L1.00002 10.3805C0.61002 10.7705 0.61002 11.4005 1.00002 11.7905C1.39002 12.1805 2.02002 12.1805 2.41002 11.7905L7.00002 7.20051C7.39002 6.81051 7.39002 6.18051 7.00002 5.79051L2.41002 1.20051C2.03002 0.82051 1.39002 0.82051 1.00002 1.21051Z" fill="#0768FD"/>
          </svg>
        </div>
      </div>

      <div className="photos-title">
        <h3>照片</h3>
      </div>
      <div className="photo-gallery-container">
        {photos.map((photo, index) => (
          <div key={index} className="photo-item" style={{ backgroundImage: `url(${photo})` }}></div>
        ))}
      </div>

      <style jsx>{`
        .location-details-container {
          border: 1px solid rgba(1, 34, 118, 0.05);
          padding: 16px;
          margin: 8px; 
          height: 297px;
          background-color: white;
          border-radius: 16px;
          margin-top: -46px;
          position: relative;
        }
        h2 {
          font-size: 24px;
          height: 29px;
          font-family: 'Inter', semi-bold;
          font-weight: 500;
          margin-bottom: 16px;
        }
        .address-box, .rating-box {
          display: flex;
          align-items: center;
          height: 51px;
          padding: 8px;
          border-radius: 12px;
          border: 1px solid rgba(1, 34, 118, 0.05);
          margin-bottom: 12px;
          cursor: pointer;
        }
        .address-icon, .rating-icon {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 24px;
          height: 24px;
          margin-right: 4px;
        }
        .address-content, .rating-content {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }
        .address-label, .rating-label {
          width: 255px;
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          font-weight: 500;
          line-height: 14px;
          letter-spacing: 0.08em;
          padding: 0 0 4px 0;
          color: #8C8C8C;
        }
        .address-text {
          width: 255px;
        }
        .address-text, .rating-score, .review-count {
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 500;
          line-height: 17px;
          letter-spacing: 0;
          color: #1B1446;
        }
        .rating-info {
          width: 255px;
          display: flex;
          align-items: baseline;
        }
        .address-arrow, .rating-arrow {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .photos-title h3 {
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          font-weight: 500;
          line-height: 14px;
          letter-spacing: 0.08em;
          color: #808080;
          padding: 0 0 8px 0;
        }
        .photo-gallery-container {
          display: flex;
          gap: 9px;
          overflow-x: auto;
          padding-bottom: 16px;
        }
        .photo-item {
          min-width: 100px;
          height: 72px;
          border-radius: 8px;
          background-size: cover;
          background-position: center;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
};

export default LocationDetails;