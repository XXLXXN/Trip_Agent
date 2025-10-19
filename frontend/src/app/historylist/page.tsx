"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import styles from "@/styles/HistoryList.module.css";
import Link from "next/link";
import { useNavigation } from "../context/NavigationContext";

// 前端 UI 使用的数据类型
type TripStatus = "completed" | "cancelled" | "upcoming";

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

// 从后端获取的、经过清洗的简单数据类型
interface BackendTrip {
  user_id: string;
  trip_id: string;
  trip_name: string;
  destination?: string;
  start_date: string;
  end_date: string;
  days_count: number;
}

// 辅助函数：根据城市名获取图片
function getThumbForCity(city: string): string {
  if (city.includes("北京")) return "/images/Beijing.png";
  if (city.includes("加拿大")) return "/images/Canada.png";
  if (city.includes("山东")) return "/images/Shandong.png";
  return "/images/placeholder.png";
}

// 辅助函数：解析日期字符串
function splitDate(isoDate: string) {
  const [y, m, d] = isoDate.split("-").map(Number);
  return { year: y, month: m, day: d };
}

export default function HistoryPage() {
  const navigation = useNavigation();
  const [q, setQ] = useState("");
  
  const [trips, setTrips] = useState<TripItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const userId = "test_user_beijing_001"; 
      
      try {
        const response = await fetch(`http://localhost:8000/get/itineraries/by_user/${userId}`);
        if (!response.ok) { throw new Error("网络请求失败"); }
        const data: BackendTrip[] = await response.json();

        // 占位数据，让列表看起来更丰富
        const placeholderData = [
          { people: 2, price: 1250, status: "completed" as TripStatus },
          { people: 3, price: 3900, status: "cancelled" as TripStatus },
          { people: 1, price: 4530, status: "completed" as TripStatus },
        ];

        const formattedTrips = data.map((trip, index): TripItem => ({
          id: trip.trip_id,
          date: trip.start_date,
          country: "中国",
          city: trip.destination,
          people: placeholderData[index]?.people || 2,
          days: trip.days_count,
          price: placeholderData[index]?.price || 2000,
          rating: 4.5,
          status: placeholderData[index]?.status || (new Date(trip.end_date) < new Date() ? "completed" : "upcoming"),
          thumb: getThumbForCity(trip.destination || ""),
        }));
                
        setTrips(formattedTrips);
      } catch (error) {
        console.error("获取历史记录失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const list = useMemo(() => {
    const kw = q.trim();
    if (!kw) return trips;
    return trips.filter((t) => {
      const place = `${t.country}${t.city ? "," + t.city : ""}`;
      return (
        place.includes(kw) ||
        String(t.people).includes(kw) ||
        String(t.days).includes(kw)
      );
    });
  }, [q, trips]);

  const handleBack = () => navigation.push("/profile", "backward");

  return (
    <div className={styles.container}>
      {/* 顶部栏 - 恢复了完整的 Header 结构 */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <button className={styles.backBtn} aria-label="返回" onClick={handleBack}>
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
              <path
                d="M14.8 7H3.62l4.88-4.88a1.1 1.1 0 0 0-1.56-1.56L.5 7.02a1 1 0 0 0 0 1.4l6.44 6.44a1.1 1.1 0 1 0 1.56-1.56L3.62 9h11.18a1 1 0 1 0 0-2Z"
                fill="#0768FD"
              />
            </svg>
          </button>
          <h1 className={styles.headerTitle}>历史记录</h1>
        </div>

        {/* 搜索框 - 恢复了完整的搜索框结构 */}
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

      {/* 列表 - 恢复了完整的卡片布局 */}
      <div className={styles.list}>
        {loading ? (
          <div className={styles.empty}>正在加载历史记录...</div>
        ) : list.length > 0 ? (
          list.map((t) => {
            const { year, month, day } = splitDate(t.date);
            const place = `${t.country}${t.city ? "，" + t.city : ""}`;
            return (
              <Link href={`/fireflyx_parts/current/${t.id}`} key={t.id}>
                <div className={styles.row}>
                  <div className={styles.dateCol}>
                    <div className={styles.dateMD}>{month}/{day}</div>
                    <div className={styles.dateYear}>{year}</div>
                  </div>
                  <div className={styles.card}>
                    <div className={`${styles.status} ${t.status === "completed" ? styles.done : styles.cancel}`}>
                      {t.status === "completed" ? "已完成" : "已取消"}
                    </div>
                    <div className={styles.thumb}>
                      {t.thumb ? (<Image src={t.thumb} alt="" fill sizes="96px" priority={false} />) : (<div className={styles.thumbPlaceholder} />)}
                    </div>
                    <div className={styles.meta}>
                      <div className={styles.place}>{place}</div>
                      <div className={styles.subline}>{t.people}人，{t.days}天</div>
                      <div className={styles.cardFooter}>
                        <div className={styles.price}>¥{t.price}</div>
                        <div className={styles.rating}>
                          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" className={styles.star}>
                            <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                          <span>{t.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className={styles.empty}>没有匹配的记录</div>
        )}
      </div>
    </div>
  );
}