// components/BookingSection.tsx
"use client";

import { useState } from 'react';
import Calendar from './Calendar'; // 引入日历组件

interface BookingSectionProps {
  price: number;
  onBook: () => void;
}

const BookingSection = ({ price, onBook }: BookingSectionProps) => {
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
  const [bookingType, setBookingType] = useState<'single' | 'multiple'>('single');
  const [selectedDates, setSelectedDates] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null
  });

  const handleDateSelect = (dates: { startDate: Date | null; endDate: Date | null }) => {
    setSelectedDates(dates);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const getDisplayDate = () => {
    if (bookingType === 'single' && selectedDates.startDate) {
      return formatDate(selectedDates.startDate);
    } else if (bookingType === 'multiple' && selectedDates.startDate && selectedDates.endDate) {
      return `${formatDate(selectedDates.startDate)} - ${formatDate(selectedDates.endDate)}`;
    }
    return '选择日期';
  };

  const toggleCalendar = () => {
    setIsCalendarExpanded(!isCalendarExpanded);
  };

  const handleCloseCalendar = () => {
    setIsCalendarExpanded(false);
  };

  return (
    <div className="booking-section-container">
      <div className="date-selector-wrapper">
        <p className="booking-title">预约日期</p>
        <div className="date-display" onClick={toggleCalendar}>
          <span>{getDisplayDate()}</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className={isCalendarExpanded ? "expanded" : ""}
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </div>
      </div>

      <div className={`calendar-expandable ${isCalendarExpanded ? "expanded" : ""}`}>
        <Calendar
          onDateSelect={handleDateSelect}
          bookingType={bookingType}
          onBookingTypeChange={setBookingType}
          onClose={handleCloseCalendar}
        />
      </div>

      <div className="booking-footer">
        <div className="price-info">
          <p className="person-count">1人</p>
          <p className="price-amount">¥{price}</p>
        </div>
        <button className="book-button" onClick={onBook}>预约</button>
      </div>
      
      <style jsx>{`
        .booking-section-container {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          background-color: white;
          padding: 15px 20px 20px;
          box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
          z-index: 100;
          transition: padding-bottom 0.3s ease;
        }
        .booking-title { 
          font-weight: bold; 
          margin-bottom: 10px; 
          margin-top: 0;
          font-size: 16px;
        }
        .date-display {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px;
          background-color: #f8f9fa;
          border-radius: 8px;
          cursor: pointer;
          margin-bottom: 15px;
        }
        .date-display svg {
          width: 20px;
          height: 20px;
          color: #666;
          transition: transform 0.3s ease;
        }
        .date-display svg.expanded {
          transform: rotate(180deg);
        }
        .calendar-expandable {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }
        .calendar-expandable.expanded {
          max-height: 500px; /* Adjust based on calendar's max height */
        }
        .booking-footer { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          margin-top: 15px;
        }
        .price-info { 
          display: flex; 
          align-items: center; 
          gap: 10px; 
        }
        .person-count { 
          color: #999; 
          margin: 0;
          font-size: 14px;
        }
        .price-amount { 
          font-size: 24px; 
          font-weight: bold; 
          color: #ff4500; 
          margin: 0;
        }
        .book-button {
          padding: 12px 25px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 50px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default BookingSection;