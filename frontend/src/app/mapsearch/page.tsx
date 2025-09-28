"use client";

import { useState, useRef, useEffect } from "react";
import styles from "../styles/MapSearch.module.css";

export default function MapSearchPage() {
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const mapRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  // 分类拖拽
  const [isCatDragging, setIsCatDragging] = useState(false);
  const [catStartX, setCatStartX] = useState(0);
  const [catScrollLeft, setCatScrollLeft] = useState(0);
  const catDraggedRef = useRef(false);

  const CATEGORIES = ["全部", "博物馆", "水上乐园", "动物园", "景点", "公园", "购物中心", "餐厅", "酒店"];

  const onCatMouseDown = (e: React.MouseEvent) => {
    if (!categoriesRef.current) return;
    setIsCatDragging(true);
    setCatStartX(e.pageX - categoriesRef.current.offsetLeft);
    setCatScrollLeft(categoriesRef.current.scrollLeft);
    catDraggedRef.current = false;
  };

  const onCatMouseMove = (e: React.MouseEvent) => {
    if (!isCatDragging || !categoriesRef.current) return;
    e.preventDefault();
    const x = e.pageX - categoriesRef.current.offsetLeft;
    const walk = (x - catStartX) * 1.5;
    categoriesRef.current.scrollLeft = catScrollLeft - walk;
    if (Math.abs(walk) > 5) catDraggedRef.current = true;
  };

  const onCatMouseUp = () => {
    setIsCatDragging(false);
    setTimeout(() => (catDraggedRef.current = false), 0);
  };

  const onCatTouchStart = (e: React.TouchEvent) => {
    if (!categoriesRef.current) return;
    const t = e.touches[0];
    setIsCatDragging(true);
    setCatStartX(t.pageX - categoriesRef.current.offsetLeft);
    setCatScrollLeft(categoriesRef.current.scrollLeft);
    catDraggedRef.current = false;
  };

  const onCatTouchMove = (e: React.TouchEvent) => {
    if (!isCatDragging || !categoriesRef.current) return;
    const t = e.touches[0];
    const x = t.pageX - categoriesRef.current.offsetLeft;
    const walk = (x - catStartX) * 1.2;
    categoriesRef.current.scrollLeft = catScrollLeft - walk;
    if (Math.abs(walk) > 5) catDraggedRef.current = true;
  };

  const onCatTouchEnd = () => {
    setIsCatDragging(false);
    setTimeout(() => (catDraggedRef.current = false), 0);
  };

  const handleBack = () => {
    alert("返回上一页");
  };

  // 地图拖拽
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!mapRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - mapRef.current.offsetLeft);
    setStartY(e.pageY - mapRef.current.offsetTop);
    setScrollLeft(mapRef.current.scrollLeft);
    setScrollTop(mapRef.current.scrollTop);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !mapRef.current) return;
    e.preventDefault();
    const x = e.pageX - mapRef.current.offsetLeft;
    const y = e.pageY - mapRef.current.offsetTop;
    const walkX = (x - startX) * 2;
    const walkY = (y - startY) * 2;
    mapRef.current.scrollLeft = scrollLeft - walkX;
    mapRef.current.scrollTop = scrollTop - walkY;
  };

  const handleMouseUp = () => setIsDragging(false);

  // 点击添加
  const onAddToTrip = () => {
    alert("已添加到行程表");
  };

  return (
    <div className={styles.container}>
      {/* 顶部栏 */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <button className={styles.backBtn} onClick={handleBack} aria-label="返回">
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
              <path
                d="M14.8 7H3.62l4.88-4.88a1.1 1.1 0 0 0-1.56-1.56L.5 7.02a1 1 0 0 0 0 1.4l6.44 6.44a1.1 1.1 0 1 0 1.56-1.56L3.62 9h11.18a1 1 0 1 0 0-2Z"
                fill="#0768FD"
              />
            </svg>
          </button>
        </div>

        {/* 位置信息栏 */}
        <div className={styles.locationBar}>
          <div className={styles.locationLabel}>位置</div>
          <div className={styles.locationName}>北京</div>
          <button className={styles.changeButton}>更改</button>
        </div>

        {/* 分类筛选 - 可横向滚动（可拖拽） */}
        <div
          className={`${styles.categories} ${isCatDragging ? styles.dragging : ""}`}
          ref={categoriesRef}
          onMouseDown={onCatMouseDown}
          onMouseMove={onCatMouseMove}
          onMouseUp={onCatMouseUp}
          onMouseLeave={onCatMouseUp}
          onTouchStart={onCatTouchStart}
          onTouchMove={onCatTouchMove}
          onTouchEnd={onCatTouchEnd}
        >
          {CATEGORIES.map((category) => (
            <button
              key={category}
              className={`${styles.category} ${selectedCategory === category ? styles.active : ""}`}
              onClick={() => {
                if (catDraggedRef.current) return;
                setSelectedCategory(category);
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 地图区域 */}
      <div
        ref={mapRef}
        className={styles.mapContainer}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* 地图背景 */}
        <div className={styles.mapBackground}>
          {/* 模拟地图道路和区域 */}
          <div className={styles.roads}>
            <div className={styles.roadHorizontal} style={{ top: "30%" }} />
            <div className={styles.roadHorizontal} style={{ top: "60%" }} />
            <div className={styles.roadVertical} style={{ left: "30%" }} />
            <div className={styles.roadVertical} style={{ left: "60%" }} />
          </div>

          {/* 地图标记点 */}
          <div className={styles.marker} style={{ left: "120px", top: "200px" }}>
            <svg
              className={styles.markerIcon}
              viewBox="0 0 99 72"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g filter="url(#filter0_d_32_2938)">
                <path d="M47.732 51C46.9622 52.3333 45.0377 52.3333 44.2679 51L40.8038 45C40.034 43.6667 40.9963 42 42.5359 42H49.4641C51.0037 42 51.966 43.6667 51.1962 45L47.732 51Z" fill="#0768FD"/>
                <path d="M47.2988 50.75C46.7576 51.6873 45.4558 51.7459 44.8193 50.9258L44.7012 50.75L41.2373 44.75C40.66 43.75 41.3814 42.5 42.5361 42.5H49.4639C50.5463 42.5 51.2484 43.5983 50.8564 44.5596L50.7627 44.75L47.2988 50.75Z" stroke="#012276" strokeOpacity="0.05"/>
                <rect x="12" y="12" width="67" height="33" rx="8" fill="#0768FD"/>
                <rect x="12.5" y="12.5" width="66" height="32" rx="7.5" stroke="#012276" strokeOpacity="0.05"/>
                <path d="M32.1861 35.2727V22.5455H33.0014V35.2727H32.1861ZM34.5376 26.6172C34.4912 26.183 34.2957 25.8449 33.951 25.603C33.6096 25.361 33.1655 25.2401 32.6186 25.2401C32.2341 25.2401 31.9044 25.2981 31.6293 25.4141C31.3542 25.5301 31.1437 25.6875 30.9979 25.8864C30.852 26.0852 30.7775 26.3123 30.7741 26.5675C30.7741 26.7796 30.8222 26.9635 30.9183 27.1193C31.0178 27.2751 31.152 27.4077 31.321 27.517C31.4901 27.6231 31.6773 27.7126 31.8828 27.7855C32.0883 27.8584 32.2955 27.9197 32.5043 27.9695L33.4588 28.2081C33.8433 28.2976 34.2128 28.4186 34.5675 28.571C34.9254 28.7235 35.2453 28.9157 35.527 29.1477C35.812 29.3797 36.0374 29.6598 36.2031 29.9879C36.3688 30.3161 36.4517 30.7005 36.4517 31.1413C36.4517 31.7379 36.2992 32.2633 35.9943 32.7173C35.6894 33.1681 35.2486 33.5211 34.6719 33.7763C34.0985 34.0282 33.4041 34.1541 32.5888 34.1541C31.7966 34.1541 31.1089 34.0315 30.5256 33.7862C29.9455 33.541 29.4915 33.183 29.1634 32.7124C28.8385 32.2417 28.6629 31.6683 28.6364 30.9922H30.451C30.4775 31.3468 30.5869 31.6418 30.7791 31.8771C30.9714 32.1125 31.2216 32.2881 31.5298 32.4041C31.8414 32.5201 32.1894 32.5781 32.5739 32.5781C32.9749 32.5781 33.3262 32.5185 33.6278 32.3991C33.9328 32.2765 34.1714 32.1075 34.3438 31.892C34.5161 31.6733 34.6039 31.4181 34.6072 31.1264C34.6039 30.8613 34.526 30.6425 34.3736 30.4702C34.2211 30.2945 34.0073 30.1487 33.7322 30.0327C33.4605 29.9134 33.1423 29.8073 32.7777 29.7145L31.6193 29.4162C30.7808 29.2008 30.1179 28.8743 29.6307 28.4368C29.1468 27.996 28.9048 27.411 28.9048 26.6818C28.9048 26.0819 29.0672 25.5566 29.392 25.1058C29.7202 24.6551 30.166 24.3054 30.7294 24.0568C31.2929 23.8049 31.9309 23.679 32.6435 23.679C33.366 23.679 33.9991 23.8049 34.5426 24.0568C35.0895 24.3054 35.5187 24.6518 35.8303 25.0959C36.1418 25.5367 36.3026 26.0438 36.3125 26.6172H34.5376ZM42.138 23.8182V34H40.2935V25.6129H40.2338L37.8525 27.1342V25.4439L40.383 23.8182H42.138ZM44.5392 32.1108V30.6442L48.8596 23.8182H50.0826V25.9062H49.3368L46.4284 30.5149V30.5945H52.459V32.1108H44.5392ZM49.3965 34V31.6634L49.4164 31.0071V23.8182H51.1564V34H49.3965ZM53.8635 32.1108V30.6442L58.1838 23.8182H59.4068V25.9062H58.661L55.7527 30.5149V30.5945H61.7832V32.1108H53.8635ZM58.7207 34V31.6634L58.7406 31.0071V23.8182H60.4806V34H58.7207Z" fill="#F6F8FB"/>
              </g>
              <defs>
                <filter id="filter0_d_32_2938" x="0" y="0" width="99" height="74" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset dx="4" dy="4"/>
                  <feGaussianBlur stdDeviation="8"/>
                  <feComposite in2="hardAlpha" operator="out"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/>
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_32_2938"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_32_2938" result="shape"/>
                </filter>
              </defs>
            </svg>
          </div>
        </div>
      </div>
      {/* 固定在底部的添加按钮 */}
      <div className={styles.mapCta}>
        <button className={styles.addButton} onClick={onAddToTrip}>
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 8h14M5 12h10M5 16h8" />
          </svg>
          <span>添加到行程表</span>
        </button>
      </div>
    </div>
  );
}