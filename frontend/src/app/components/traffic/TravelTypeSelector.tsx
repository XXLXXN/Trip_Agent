// components/travel/TravelTypeSelector.tsx

'use client';

import { useState, useEffect, useRef } from 'react';

interface TravelTypeSelectorProps {
  selectedType: string;
  onTypeChange: (newType: string) => void;
}

const typeLabels: { [key:string]: string } = {
  all: '不限',
  fly: '航空',
  train: '高铁',
  self: '自行安排',
};

const travelTypes = [
    { 
      key: 'all', 
      label: '不限', 
      icon: (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path fill="#555" d="M12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 11.8833 19.9958 11.7625 19.9875 11.6375C19.9792 11.5125 19.975 11.4083 19.975 11.325C19.8917 11.8083 19.6667 12.2083 19.3 12.525C18.9333 12.8417 18.5 13 18 13H16C15.45 13 14.9792 12.8042 14.5875 12.4125C14.1958 12.0208 14 11.55 14 11V10H10V8C10 7.45 10.1958 6.97917 10.5875 6.5875C10.9792 6.19583 11.45 6 12 6H13C13 5.61667 13.1042 5.27917 13.3125 4.9875C13.5208 4.69583 13.775 4.45833 14.075 4.275C13.7417 4.19167 13.4042 4.125 13.0625 4.075C12.7208 4.025 12.3667 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12H9C10.1 12 11.0417 12.3917 11.825 13.175C12.6083 13.9583 13 14.9 13 16V17H10V19.75C10.3333 19.8333 10.6625 19.8958 10.9875 19.9375C11.3125 19.9792 11.65 20 12 20Z"/>
        </svg>
      )
    },
    { 
      key: 'fly', 
      label: '航空', 
      icon: (
        <svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
          <path fill="#555" d="M5 20V17.5L8 15.4V11.8L0 15V12L8 6.4V2C8 1.45 8.19583 0.979167 8.5875 0.5875C8.97917 0.195833 9.45 0 10 0C10.55 0 11.0208 0.195833 11.4125 0.5875C11.8042 0.979167 12 1.45 12 2V6.4L20 12V15L12 11.8V15.4L15 17.5V20L10 18.5L5 20Z"/>
        </svg>
      )
    },
    { 
      key: 'train', 
      label: '高铁', 
      icon: (
        <svg viewBox="0 0 16 19" xmlns="http://www.w3.org/2000/svg">
          <path fill="#555" d="M0 13.5V4C0 3.11667 0.229167 2.4125 0.6875 1.8875C1.14583 1.3625 1.75 0.9625 2.5 0.6875C3.25 0.4125 4.10417 0.229167 5.0625 0.1375C6.02083 0.0458333 7 0 8 0C9.1 0 10.1375 0.0458333 11.1125 0.1375C12.0875 0.229167 12.9375 0.4125 13.6625 0.6875C14.3875 0.9625 14.9583 1.3625 15.375 1.8875C15.7917 2.4125 16 3.11667 16 4V13.5C16 14.4833 15.6625 15.3125 14.9875 15.9875C14.3125 16.6625 13.4833 17 12.5 17L14 18.5V19H12L10 17H6L4 19H2V18.5L3.5 17C2.51667 17 1.6875 16.6625 1.0125 15.9875C0.3375 15.3125 0 14.4833 0 13.5ZM8 2C6.23333 2 4.94167 2.10417 4.125 2.3125C3.30833 2.52083 2.75 2.75 2.45 3H13.65C13.4 2.71667 12.8625 2.47917 12.0375 2.2875C11.2125 2.09583 9.86667 2 8 2ZM2 8H7V5H2V8ZM12.5 10H2H14H12.5ZM9 8H14V5H9V8ZM4.5 14C4.93333 14 5.29167 13.8583 5.575 13.575C5.85833 13.2917 6 12.9333 6 12.5C6 12.0667 5.85833 11.7083 5.575 11.425C5.29167 11.1417 4.93333 11 4.5 11C4.06667 11 3.70833 11.1417 3.425 11.425C3.14167 11.7083 3 12.0667 3 12.5C3 12.9333 3.14167 13.2917 3.425 13.575C3.70833 13.8583 4.06667 14 4.5 14ZM11.5 14C11.9333 14 12.2917 13.8583 12.575 13.575C12.8583 13.2917 13 12.9333 13 12.5C13 12.0667 12.8583 11.7083 12.575 11.425C12.2917 11.1417 11.9333 11 11.5 11C11.0667 11 10.7083 11.1417 10.425 11.425C10.1417 11.7083 10 12.0667 10 12.5C10 12.9333 10.1417 13.2917 10.425 13.575C10.7083 13.8583 11.0667 14 11.5 14ZM3.5 15H12.5C12.9333 15 13.2917 14.8583 13.575 14.575C13.8583 14.2917 14 13.9333 14 13.5V10H2V13.5C2 13.9333 2.14167 14.2917 2.425 14.575C2.70833 14.8583 3.06667 15 3.5 15ZM8 3H13.65H2.45H8Z"/>
        </svg>
      )
    },
    { 
      key: 'self', 
      label: '自行安排', 
      icon: (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path fill="#555" d="M6 19V20C6 20.2833 5.90417 20.5208 5.7125 20.7125C5.52083 20.9042 5.28333 21 5 21H4C3.71667 21 3.47917 20.9042 3.2875 20.7125C3.09583 20.5208 3 20.2833 3 20V12L5.1 6C5.2 5.7 5.37917 5.45833 5.6375 5.275C5.89583 5.09167 6.18333 5 6.5 5H17.5C17.8167 5 18.1042 5.09167 18.3625 5.275C18.6208 5.45833 18.8 5.7 18.9 6L21 12V20C21 20.2833 20.9042 20.5208 20.7125 20.7125C20.5208 20.9042 20.2833 21 20 21H19C18.7167 21 18.4792 20.9042 18.2875 20.7125C18.0958 20.5208 18 20.2833 18 20V19H6ZM5.8 10H18.2L17.15 7H6.85L5.8 10ZM7.5 16C7.91667 16 8.27083 15.8542 8.5625 15.5625C8.85417 15.2708 9 14.9167 9 14.5C9 14.0833 8.85417 13.7292 8.5625 13.4375C8.27083 13.1458 7.91667 13 7.5 13C7.08333 13 6.72917 13.1458 6.4375 13.4375C6.14583 13.7292 6 14.0833 6 14.5C6 14.9167 6.14583 15.2708 6.4375 15.5625C6.72917 15.8542 7.08333 16 7.5 16ZM16.5 16C16.9167 16 17.2708 15.8542 17.5625 15.5625C17.8542 15.2708 18 14.9167 18 14.5C18 14.0833 17.8542 13.7292 17.5625 13.4375C17.2708 13.1458 16.9167 13 16.5 13C16.0833 13 15.7292 13.1458 15.4375 13.4375C15.1458 13.7292 15 14.0833 15 14.5C15 14.9167 15.1458 15.2708 15.4375 15.5625C15.7292 15.8542 16.0833 16 16.5 16ZM5 17H19V12H5V17Z"/>
        </svg>
      )
    },
];

const PANEL_ANIMATION_DURATION = 200;
const CHEVRON_ANIMATION_DURATION = 200;

export default function TravelTypeSelector({ selectedType, onTypeChange }: TravelTypeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const openMenu = () => {
    if (isOpen) return;
    setIsOpen(true);
    setTimeout(() => { setIsVisible(true); }, 10);
  };
  
  const closeMenu = () => {
    setIsVisible(false);
    setTimeout(() => { setIsOpen(false); }, PANEL_ANIMATION_DURATION);
  };
  
  const handleToggle = () => {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  const handleSelection = (newType: string) => {
    onTypeChange(newType);
    closeMenu();
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        if (isOpen) closeMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <>
      <div className="selector-container">
        <div className="selector-frame">
          <div ref={wrapperRef} style={{ position: 'relative' }}>
            <div className="selector-field" onClick={handleToggle}>
              <svg width="24" height="24" viewBox="0 0 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" fill="#4A90E2"/>
              </svg>
              <div className="text-area">
                <span className="label">出行类别</span>
                <span className="value">{typeLabels[selectedType]}</span>
              </div>
              <svg className={`chevron ${isVisible ? 'open' : ''}`} width="12" height="8" viewBox="0 0 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.41 0.589966L6 5.16997L10.59 0.589966L12 1.99997L6 7.99997L0 1.99997L1.41 0.589966Z" fill="#0768FD"/>
              </svg>
            </div>
            
            {isOpen && (
              <div className={`options-panel ${isVisible ? 'visible' : ''}`}>
                {travelTypes.map((type) => (
                  <div key={type.key} className="option-item" onClick={() => handleSelection(type.key)}>
                    <div className="icon-wrapper">{type.icon}</div>
                    <span className="option-label">{type.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
        /* --- 原有样式 --- */
        .selector-container { background-color: transparent; padding: 0 16px; }
        .selector-frame { background-color: #ffffff; border-radius: 24px; padding: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
        .selector-field { position: relative; display: flex; align-items: center; background-color: #F0F7FF; border-radius: 16px; height: 60px; padding: 0 20px; cursor: pointer; }
        .text-area { display: flex; flex-direction: column; margin-left: 12px; flex-grow: 1; }
        .label { font-size: 12px; color: #888; }
        .value { font-size: 16px; font-weight: 600; color: #1B1446; }

        /* --- 动画与下拉框样式 --- */
        .options-panel {
          position: absolute; top: 100%; left: 0; right: 0;
          margin-top: 8px; background-color: #ffffff; border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); border: 1px solid #f0f0f0;
          padding: 8px 0;
          z-index: 100;
          transform-origin: top center;
          opacity: 0;
          transform: translateY(-10px) scale(0.98);
          transition: opacity ${PANEL_ANIMATION_DURATION}ms ease-out, transform ${PANEL_ANIMATION_DURATION}ms ease-out;
        }
        .options-panel.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        /* --- 核心对齐与图标样式 --- */
        .option-item {
          position: relative;
          display: flex;
          align-items: center;
          padding: 8px 16px;
          font-size: 16px;
          font-weight: 400;
          color: #1F1F1F;
          border-radius: 0;
          cursor: pointer;
          /* 修改1: 只保留背景色变化的过渡效果 */
          transition: background-color 0.2s ease;
        }

        .icon-wrapper {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
        }
        
        .icon-wrapper :global(svg) {
          max-width: 100%;
          max-height: 100%;
          /* fill 属性由 SVG 内部的 path 决定,CSS 不再控制颜色 */
        }
        
        .option-item:not(:last-child)::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 16px;
          right: 16px;
          height: 1px;
          background-color: rgba(0, 0, 0, 0.08);
        }
        
        .chevron {
          transition: transform ${CHEVRON_ANIMATION_DURATION}ms ease-in-out;
          transform-origin: center;
        }
        .chevron.open {
          transform: rotate(180deg);
        }
      `}</style>
    </>
  );
}