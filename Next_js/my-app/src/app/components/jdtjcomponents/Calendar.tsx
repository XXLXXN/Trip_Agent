// components/Calendar.tsx
"use client";

import { useState, useEffect } from 'react';

interface CalendarProps {
  onDateSelect: (dates: { startDate: Date | null; endDate: Date | null }) => void;
  bookingType: 'single' | 'multiple';
  onBookingTypeChange: (type: 'single' | 'multiple') => void;
  onClose: () => void;
}

const Calendar = ({ onDateSelect, bookingType, onBookingTypeChange, onClose }: CalendarProps) => {
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tempEndDate, setTempEndDate] = useState<Date | null>(null);

  useEffect(() => {
    if (bookingType === 'single') {
      setSelectedEndDate(null);
      setTempEndDate(null);
    }
  }, [bookingType]);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    if (bookingType === 'single') {
      setSelectedStartDate(clickedDate);
      setSelectedEndDate(null);
      onDateSelect({
        startDate: clickedDate,
        endDate: null
      });
      onClose();
    } else {
      if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
        setSelectedStartDate(clickedDate);
        setSelectedEndDate(null);
        setTempEndDate(null);
      } else if (clickedDate < selectedStartDate) {
        setSelectedStartDate(clickedDate);
        setSelectedEndDate(selectedStartDate);
        setTempEndDate(selectedStartDate);
      } else {
        setSelectedEndDate(clickedDate);
        setTempEndDate(clickedDate);
      }
    }
  };

  const isDateInRange = (day: number) => {
    if (!selectedStartDate || bookingType === 'single') return false;
    
    const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const start = selectedStartDate;
    const end = tempEndDate || selectedEndDate;
    
    if (!end) return false;
    
    return currentDate > start && currentDate < end;
  };

  const isDateSelected = (day: number) => {
    const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

    if (bookingType === 'single') {
      return selectedStartDate && currentDate.toDateString() === selectedStartDate.toDateString();
    } else {
      const isStart = selectedStartDate && currentDate.toDateString() === selectedStartDate.toDateString();
      const isEnd = (tempEndDate || selectedEndDate) && 
                   currentDate.toDateString() === (tempEndDate || selectedEndDate)?.toDateString();
      return isStart || isEnd;
    }
  };

  const handleConfirm = () => {
    onDateSelect({
      startDate: selectedStartDate,
      endDate: bookingType === 'multiple' ? (tempEndDate || selectedEndDate) : null
    });
    onClose();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    const isSelected = isDateSelected(day);
    const isInRange = isDateInRange(day);
    
    days.push(
      <div
        key={day}
        className={`calendar-day ${isSelected ? 'selected' : ''} ${isInRange ? 'in-range' : ''}`}
        onClick={() => handleDateClick(day)}
      >
        {day}
      </div>
    );
  }

  const canConfirm = bookingType === 'single' ? 
    selectedStartDate !== null : 
    selectedStartDate !== null && (tempEndDate !== null || selectedEndDate !== null);

  return (
    <div className="inline-calendar">
      <div className="calendar-header">
        <button onClick={() => navigateMonth('prev')} className="nav-button">‹</button>
        <h3>{year}年{month + 1}月</h3>
        <button onClick={() => navigateMonth('next')} className="nav-button">›</button>
      </div>
      
      <div className="calendar-weekdays">
        {['日', '一', '二', '三', '四', '五', '六'].map(day => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>
      
      <div className="calendar-grid">{days}</div>

      <div className="booking-type-selection">
        <label className="booking-type-option">
          <input
            type="radio"
            name="bookingType"
            value="single"
            checked={bookingType === 'single'}
            onChange={() => onBookingTypeChange('single')}
          />
          <span>单日</span>
        </label>
        <label className="booking-type-option">
          <input
            type="radio"
            name="bookingType"
            value="multiple"
            checked={bookingType === 'multiple'}
            onChange={() => onBookingTypeChange('multiple')}
          />
          <span>多日</span>
        </label>
      </div>

      {bookingType === 'multiple' && (
        <div className="selection-info">
          {!selectedStartDate ? (
            <p>请选择起始日期</p>
          ) : !(tempEndDate || selectedEndDate) ? (
            <p>请选择结束日期</p>
          ) : (
            (() => {
              const endDate = tempEndDate || selectedEndDate;
              if (!endDate) return null;
              return (
                <p>已选择 {selectedStartDate.getMonth()+1}月{selectedStartDate.getDate()}日 - {endDate.getMonth()+1}月{endDate.getDate()}日</p>
              );
            })()
          )}
        </div>
      )}

      <div className="calendar-actions">
        <button className="cancel-button" onClick={onClose}>取消</button>
        <button 
          className="confirm-button" 
          onClick={handleConfirm}
          disabled={!canConfirm}
        >确认</button>
      </div>

      <style jsx>{`
        .inline-calendar { padding: 15px 0; border-top: 1px solid #f0f0f0; margin-top: 15px; }
        .calendar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .nav-button { background: none; border: none; font-size: 20px; cursor: pointer; padding: 5px 10px; }
        .calendar-header h3 { margin: 0; font-size: 16px; font-weight: bold; }
        .calendar-weekdays { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-weight: bold; margin-bottom: 10px; font-size: 12px; }
        .weekday { padding: 5px; }
        .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; margin-bottom: 15px; }
        .calendar-day { height: 35px; display: flex; align-items: center; justify-content: center; cursor: pointer; border-radius: 8px; transition: all 0.2s ease; position: relative; font-size: 14px; }
        .calendar-day:hover:not(.empty) { background-color: #f0f0f0; }
        .calendar-day.selected { background-color: #007bff; color: white; font-weight: bold; }
        .calendar-day.in-range { background-color: #e3f2fd; }
        .calendar-day.in-range:not(.selected):hover { background-color: #bbdefb; }
        .calendar-day.empty { cursor: default; visibility: hidden; }
        .booking-type-selection { display: flex; gap: 20px; margin: 15px 0; justify-content: center; }
        .booking-type-option { display: flex; align-items: center; gap: 5px; cursor: pointer; font-size: 14px; }
        .selection-info { text-align: center; margin: 10px 0; font-size: 14px; color: #666; }
        .selection-info p { margin: 0; }
        .calendar-actions { display: flex; justify-content: space-between; margin-top: 15px; }
        .cancel-button { background-color: #f8f9fa; color: #333; border: 1px solid #ddd; padding: 10px 20px; border-radius: 8px; cursor: pointer; flex: 1; margin-right: 10px; }
        .confirm-button { background-color: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; flex: 1; }
        .confirm-button:disabled { background-color: #ccc; cursor: not-allowed; }
      `}</style>
    </div>
  );
};

export default Calendar;