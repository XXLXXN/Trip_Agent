"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import styles from "@/styles/HistoryList.module.css";

type TripStatus = "completed" | "cancelled";

interface TripItem {
  id: string;
  date: string;
  country: string;
  city?: string;
  people: number;
  days: number;
  price: number;
  rating: number;
  status: TripStatus;
  thumb?: string;
}

const TRIPS: TripItem[] = [
  {
    id: "t1",
    date: "2025-09-15",
    country: "中国",
    city: "北京",
    people: 2,
    days: 3,
    price: 1250,
    rating: 4.5,
    status: "completed",
    thumb: "/images/Beijing.png",
  },
  {
    id: "t2",
    date: "2025-03-25",
    country: "加拿大",
    people: 3,
    days: 14,
    price: 3900,
    rating: 4.5,
    status: "cancelled",
    thumb: "/images/Canada.png",
  },
  {
    id: "t3",
    date: "2024-06-30",
    country: "中国",
    city: "山东",
    people: 1,
    days: 7,
    price: 4530,
    rating: 4.5,
    status: "completed",
    thumb: "/images/Shandong.png",
  },
];

function splitDate(isoDate: string) {
  const [y, m, d] = isoDate.split("-").map(Number);
  return { year: y, month: m, day: d };
}

export default function HistoryPage() {
  const [q, setQ] = useState("");
  const [selectedTrip, setSelectedTrip] = useState<TripItem | null>(null);

  const list = useMemo(() => {
    const kw = q.trim();
    if (!kw) return TRIPS;
    return TRIPS.filter((t) => {
      const place = `${t.country}${t.city ? "," + t.city : ""}`;
      return (
        place.includes(kw) ||
        String(t.people).includes(kw) ||
        String(t.days).includes(kw)
      );
    });
  }, [q]);

  const handleBack = () => alert("返回上一页");
  
  const handleTripClick = (trip: TripItem) => {
    setSelectedTrip(trip);
  };
  
  const closeModal = () => {
    setSelectedTrip(null);
  };
  const handleReview = () => {
    alert("回顾该行程");
    closeModal();
  };

  const handleReuse = () => {
    alert("再次使用此行程");
    closeModal();
  };

  const handleDelete = () => {
    alert("删除此行程记录");
    closeModal();
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
          <h1 className={styles.headerTitle}>历史记录</h1>
        </div>

        {/* 搜索框 */}
        <div className={styles.searchWrap}>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon} aria-hidden="true">
              <svg width="20" height="21" viewBox="0 0 20 21" fill="none">
                <path d="M9.16667 16.3333C12.8486 16.3333 15.8333 13.3486 15.8333 9.66667C15.8333 5.98477 12.8486 3 9.16667 3C5.48477 3 2.5 5.98477 2.5 9.66667C2.5 13.3486 5.48477 16.3333 9.16667 16.3333Z" stroke="#0768FD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17.5 18L13.875 14.375" stroke="#0768FD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜索"
              className={styles.searchInput}
            />
          </div>
        </div>
      </div>

      {/* 列表 */}
      <div className={styles.list}>
        {list.map((t) => {
          const { year, month, day } = splitDate(t.date);
          const place = `${t.country}${t.city ? "，" + t.city : ""}`;
          return (
            <div key={t.id} className={styles.row} onClick={() => handleTripClick(t)}>
              {/* 左侧日期 */}
              <div className={styles.dateCol}>
                <div className={styles.dateMD}>
                  {month}/{day}
                </div>
                <div className={styles.dateYear}>{year}</div>
              </div>

              {/* 右侧卡片 */}
              <div className={styles.card}>
                {/* 状态角标 */}
                <div
                  className={`${styles.status} ${
                    t.status === "completed" ? styles.done : styles.cancel
                  }`}
                >
                  {t.status === "completed" ? "已完成" : "已取消"}
                </div>

                {/* 左图：如果有 thumb 渲染图片，否则占位 */}
                <div className={styles.thumb}>
                  {t.thumb ? (
                    <Image
                      src={t.thumb}
                      alt=""
                      fill
                      sizes="96px"
                      priority={false}
                    />
                  ) : (
                    <div className={styles.thumbPlaceholder} />
                  )}
                </div>

                {/* 文本区 */}
                <div className={styles.meta}>
                  <div className={styles.place}>{place}</div>
                  <div className={styles.subline}>
                    {t.people}人，{t.days}天
                  </div>

                  <div className={styles.cardFooter}>
                    <div className={styles.price}>¥{t.price}</div>
                    <div className={styles.rating}>
                      <svg
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        aria-hidden="true"
                        className={styles.star}
                      >
                        <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                      <span>{t.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {list.length === 0 && (
          <div className={styles.empty}>没有匹配的记录</div>
        )}
      </div>
      
      {/* 底部行程详情模态框 */}
      {selectedTrip && (
        <div className={styles.bottomModalOverlay} onClick={closeModal}>
          <div className={styles.bottomModalContent} onClick={(e) => e.stopPropagation()}>  
            {/* 行程图片 */}
            <div className={styles.modalImage}>
              {selectedTrip.thumb ? (
                <Image
                  src={selectedTrip.thumb}
                  alt={`${selectedTrip.country} ${selectedTrip.city || ""}`}
                  fill
                  style={{objectFit: "cover"}}
                />
              ) : (
                <div className={styles.modalImagePlaceholder} />
              )}
            </div>
                        
            {/* 操作按钮 - 垂直排列 */}
            <div className={styles.actionButtons}>
              <button className={styles.reviewButton} onClick={handleReview}>
                行程回顾
              </button>

              <button className={styles.reuseButton} onClick={handleReuse}>
                再次使用
              </button>

              <button className={styles.deleteButton} onClick={handleDelete}>
                删除记录
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}