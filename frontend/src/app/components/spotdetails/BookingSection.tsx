// components/BookingSection.tsx
"use client";

import { useState } from 'react';
import Calendar from './Calendar'; // 引入日历组件

interface BookingSectionProps {
  price: number;
  onBook: () => void;
}

/**
 * 页面底部的固定预约操作栏组件。
 * 包含日期选择、价格显示和预约按钮。
 */
const BookingSection = ({ price, onBook }: BookingSectionProps) => {
  // 控制日历是否展开的状态
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
  // 控制预约类型是“单日”还是“多日”
  const [bookingType, setBookingType] = useState<'single' | 'multiple'>('single');
  // 存储用户选择的开始和结束日期
  const [selectedDates, setSelectedDates] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null
  });

  // 从 Calendar 子组件接收选定的日期并更新状态
  const handleDateSelect = (dates: { startDate: Date | null; endDate: Date | null }) => {
    setSelectedDates(dates);
  };

  // 格式化日期对象为 "M月D日" 字符串
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  // 根据预约类型和所选日期，生成要显示的日期字符串
  const getDisplayDate = () => {
    if (bookingType === 'single' && selectedDates.startDate) {
      return formatDate(selectedDates.startDate);
    } else if (bookingType === 'multiple' && selectedDates.startDate && selectedDates.endDate) {
      return `${formatDate(selectedDates.startDate)} - ${formatDate(selectedDates.endDate)}`;
    }
    return '选择日期';
  };

  // 切换日历的展开/收起状态
  const toggleCalendar = () => {
    setIsCalendarExpanded(!isCalendarExpanded);
  };

  // 关闭日历（通常由子组件调用）
  const handleCloseCalendar = () => {
    setIsCalendarExpanded(false);
  };

  return (
    <div className="booking-section-container">
      {/* 日期选择器部分 */}
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

      {/* 可展开的日历容器 */}
      <div className={`calendar-expandable ${isCalendarExpanded ? "expanded" : ""}`}>
        <Calendar
          onDateSelect={handleDateSelect}
          bookingType={bookingType}
          onBookingTypeChange={setBookingType}
          onClose={handleCloseCalendar}
        />
      </div>

      {/* 底部价格和预约按钮 */}
      <div className="booking-footer">
        <div className="price-info">
          <p className="person-count">1人</p>
          <p className="price-amount">¥{price}</p>
        </div>
        <button className="book-button" onClick={onBook}>预约</button>
      </div>

      <style jsx>{`
        /* 样式代码保持不变 */
        .booking-section-container {
          position: fixed; bottom: 0; left: 0; width: 100%;
          background-color: white; padding: 15px 20px 20px;
          box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1); z-index: 100;
          transition: padding-bottom 0.3s ease;
        }
        .booking-title { font-weight: bold; margin-bottom: 10px; margin-top: 0; font-size: 16px; }
        .date-display { display: flex; align-items: center; justify-content: space-between; padding: 12px; background-color: #f8f9fa; border-radius: 8px; cursor: pointer; margin-bottom: 15px; }
        .date-display svg { width: 20px; height: 20px; color: #666; transition: transform 0.3s ease; }
        .date-display svg.expanded { transform: rotate(180deg); }
        .calendar-expandable { max-height: 0; overflow: hidden; transition: max-height 0.3s ease; }
        .calendar-expandable.expanded { max-height: 500px; }
        .booking-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 15px; }
        .price-info { display: flex; align-items: center; gap: 10px; }
        .person-count { color: #999; margin: 0; font-size: 14px; }
        .price-amount { font-size: 24px; font-weight: bold; color: #ff4500; margin: 0; }
        .book-button { padding: 12px 25px; background-color: #007bff; color: white; border: none; border-radius: 50px; font-size: 16px; font-weight: bold; cursor: pointer; }
      `}</style>
    </div>
  );
};

export default BookingSection;