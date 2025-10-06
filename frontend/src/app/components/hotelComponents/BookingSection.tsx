// components/BookingSection.tsx
"use client";

interface BookingSectionProps {
  onBook?: () => void;
}

/**
 * A fixed UI component at the bottom of the screen that displays booking
 * information and provides a primary call-to-action button.
 */
const BookingSection = ({ onBook }: BookingSectionProps) => {
  return (
    <div className="booking-section-container">
      <div className="title-bar">
        <p className="booking-title">预订</p>
      </div>

      <div className="info-bar">
        <div className="info-item">
          <span className="icon">
            <svg
              width="13"
              height="14"
              viewBox="0 0 13 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.3334 1.66659H10.6667V0.999919C10.6667 0.633252 10.3667 0.333252 10.0001 0.333252C9.63341 0.333252 9.33341 0.633252 9.33341 0.999919V1.66659H4.00008V0.999919C4.00008 0.633252 3.70008 0.333252 3.33341 0.333252C2.96675 0.333252 2.66675 0.633252 2.66675 0.999919V1.66659H2.00008C1.26008 1.66659 0.673415 2.26659 0.673415 2.99992L0.666748 12.3333C0.666748 13.0666 1.26008 13.6666 2.00008 13.6666H11.3334C12.0667 13.6666 12.6667 13.0666 12.6667 12.3333V2.99992C12.6667 2.26659 12.0667 1.66659 11.3334 1.66659ZM11.3334 11.6666C11.3334 12.0333 11.0334 12.3333 10.6667 12.3333H2.66675C2.30008 12.3333 2.00008 12.0333 2.00008 11.6666V4.99992H11.3334V11.6666ZM3.33341 6.33325H4.66675V7.66659H3.33341V6.33325ZM6.00008 6.33325H7.33341V7.66659H6.00008V6.33325ZM8.66675 6.33325H10.0001V7.66659H8.66675V6.33325Z"
                fill="#FF9141"
              />
            </svg>
          </span>
          <span>10.17-10.18</span>
        </div>
        <div className="info-item">
          <span className="icon">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.99992 4.66659H4.99992V5.99992H8.99992V4.66659Z"
                fill="#FF9141"
              />
              <path
                d="M9.42659 6.99992H4.57992C4.25992 6.99992 3.99992 7.25992 3.99992 7.57992H4.00659V8.33325H10.0066V7.57992C10.0066 7.25992 9.74659 6.99992 9.42659 6.99992Z"
                fill="#FF9141"
              />
              <path
                d="M12.3333 0.333252H1.66659C0.933252 0.333252 0.333252 0.933252 0.333252 1.66659V12.3333C0.333252 13.0666 0.933252 13.6666 1.66659 13.6666H12.3333C13.0666 13.6666 13.6666 13.0666 13.6666 12.3333V1.66659C13.6666 0.933252 13.0666 0.333252 12.3333 0.333252ZM10.4999 10.3333C10.2266 10.3333 9.99992 10.1066 9.99992 9.83325V9.33325H3.99992V9.83325C3.99992 10.1066 3.77325 10.3333 3.49992 10.3333C3.22659 10.3333 2.99992 10.1066 2.99992 9.83325V7.57992C2.99992 6.91325 3.41325 6.34659 3.99992 6.11325V4.99992C3.99992 4.26659 4.59992 3.66659 5.33325 3.66659H8.66659C9.39992 3.66659 9.99992 4.26659 9.99992 4.99992V6.11325C10.5866 6.34659 10.9999 6.91325 10.9999 7.57992V9.83325C10.9999 10.1066 10.7733 10.3333 10.4999 10.3333Z"
                fill="#FF9141"
              />
            </svg>
          </span>
          <span>1 间房</span>
        </div>
        <div className="info-item">
          <span className="icon">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.33341 0.333252C3.65341 0.333252 0.666748 3.31992 0.666748 6.99992C0.666748 10.6799 3.65341 13.6666 7.33341 13.6666C11.0134 13.6666 14.0001 10.6799 14.0001 6.99992C14.0001 3.31992 11.0134 0.333252 7.33341 0.333252ZM7.33341 2.33325C8.44008 2.33325 9.33341 3.22659 9.33341 4.33325C9.33341 5.43992 8.44008 6.33325 7.33341 6.33325C6.22675 6.33325 5.33341 5.43992 5.33341 4.33325C5.33341 3.22659 6.22675 2.33325 7.33341 2.33325ZM7.33341 11.7999C5.66675 11.7999 4.19341 10.9466 3.33341 9.65325C3.35341 8.32659 6.00008 7.59992 7.33341 7.59992C8.66008 7.59992 11.3134 8.32659 11.3334 9.65325C10.4734 10.9466 9.00008 11.7999 7.33341 11.7999Z"
                fill="#FF9141"
              />
            </svg>
          </span>
          <span>2 成人</span>
        </div>
      </div>

      <button className="add-to-trip-button" onClick={onBook}>
        添加到行程表
      </button>

      <style jsx>{`
        .booking-section-container {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 8px 24px 32px;
          gap: 16px;
          position: fixed;
          width: 100%;
          max-width: 375px;
          height: 182px;
          left: 50%;
          transform: translateX(-50%);
          bottom: 0px;
          background: #ffffff;
          border-top: 1px solid rgba(1, 34, 118, 0.05);
          z-index: 100;
        }
        .title-bar {
          height: 22px;
          margin: 8px 0 8px 0;
        }
        .booking-title {
          font-family: "Inter", sans-serif;
          font-size: 22px;
          font-weight: bold;
          letter-spacing: 0;
          color: #1b1446;
        }
        .info-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 8px 16px;
          background-color: #f8f9fa;
          border-radius: 20px;
        }
        .info-item {
          font-family: "Inter", sans-serif;
          font-size: 12px;
          line-height: 16px;
          letter-spacing: 0;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #808080;
        }
        .icon {
          display: flex;
          align-items: center;
        }
        .add-to-trip-button {
          width: 100%;
          padding: 12px 0;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 25px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default BookingSection;
