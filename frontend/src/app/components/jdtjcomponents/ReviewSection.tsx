// components/ReviewSection.tsx
import { Review } from "../../mockData/jdtjmockData";

interface ReviewSectionProps {
  reviews: Review[];
  onViewAllReviews: () => void;
}

const ReviewSection = ({ reviews, onViewAllReviews }: ReviewSectionProps) => {
  const getStarRating = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} style={{ color: i < rating ? "#ff9900" : "#ccc" }}>
          ★
        </span>
      );
    }
    return stars;
  };

  const formatUsername = (name: string): string => {
    if (name.length <= 3) {
      return name.length > 0 ? `${name.charAt(0)}**` : "***";
    } else {
      return `${name.substring(0, 3)}**`;
    }
  };

  const formatReviewText = (text: string): string => {
    const maxLength = 50;
    if (text.length <= maxLength) {
      return text;
    } else {
      return `${text.substring(0, 47)}...`;
    }
  };

  return (
    <div className="review-section-container">
      <div className="review-header">
        <h3>评价</h3>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onViewAllReviews();
          }}
        >
          查看全部
        </a>
      </div>
      <div className="review-list">
        {reviews.map((review, index) => (
          <div key={index} className="review-card">
            <div className="review-info">
              <img src={review.avatar} alt={review.name} className="avatar" />
              <div className="user-details">
                <p className="username">{formatUsername(review.name)}</p>
                <div className="stars">{getStarRating(review.rating)}</div>
              </div>
              <p className="date">{review.date}</p>
            </div>
            <p className="review-text">{formatReviewText(review.text)}</p>
          </div>
        ))}
      </div>
      <style jsx>{`
        .review-section-container {
          padding: 16px;
          background-color: white;
        }
        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }
        .review-header h3 {
          font-family: "Inter", sans-serif;
          font-size: 18px;
          font-weight: bold;
          line-height: 22px;
          letter-spacing: 0;
          color: #1b1446;
          margin: 0;
        }
        .review-header a {
          font-family: "Inter", sans-serif;
          font-size: 14px;
          font-weight: 500;
          line-height: 17px;
          letter-spacing: 0;
          color: #0768fd;
          text-decoration: none;
        }
        .review-list {
          display: flex;
          overflow-x: auto;
          gap: 15px;
          padding-bottom: 10px;
        }
        .review-card {
          flex-shrink: 0;
          width: 280px;
          border: 1px dashed rgba(1, 34, 118, 0.1);
          border-radius: 8px;
          padding: 15px;
        }
        .review-info {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 10px;
        }
        .user-details {
          flex-grow: 1;
        }
        .username,
        .stars,
        .date {
          margin: 0;
        }
        .username {
          font-family: "Inter", sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0;
          color: #1b1446;
        }
        .stars {
          color: #ff9900;
        }
        .date {
          color: #999;
          font-size: 12px;
        }
        .review-text {
          font-family: "Inter", sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0;
          color: #808080;
          line-height: 1.5;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ReviewSection;
