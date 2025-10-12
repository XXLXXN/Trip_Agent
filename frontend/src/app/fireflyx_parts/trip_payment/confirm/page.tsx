"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useNavigation } from "../../../context/NavigationContext";
import { PageHeader, PageContainer, ScrollableContent } from "../../components";
import { useTripData } from "../../hooks/useTripData";

// 时间格式化函数
const formatTimeWithDate = (timeStr: string, dayDate: string) => {
  // 如果时间字符串包含日期信息，直接使用
  if (timeStr.includes('-') || timeStr.includes('/')) {
    return timeStr;
  }
  
  // 如果只是时间格式（如 "08:00" 或 "10:30:00"），需要结合日期
  const timeOnly = timeStr.split(' ')[0]; // 处理 "10:30:00" 格式
  return `${dayDate} ${timeOnly}`;
};

// 统一的交易记录组件
const TransactionItem = ({ title, subtitle, amount, time, type }: {
  title: string;
  subtitle: string;
  amount: string;
  time: string;
  type: 'expense' | 'income';
}) => (
  <div className="flex items-center justify-between py-3 px-4 bg-white rounded-lg">
    <div className="flex-1">
      <div className="text-[#1B1446] font-medium text-[16px]" style={{ fontFamily: 'Inter' }}>
        {title}
      </div>
      <div className="text-[#808080] text-[14px] mt-1" style={{ fontFamily: 'Inter' }}>
        {subtitle}
      </div>
    </div>
    <div className="text-right">
      <div className={`font-semibold text-[16px] ${type === 'expense' ? 'text-[#FF4444]' : 'text-[#00C851]'}`} style={{ fontFamily: 'Inter' }}>
        {type === 'expense' ? '-' : '+'}{amount}
      </div>
      <div className="text-[#808080] text-[12px] mt-1" style={{ fontFamily: 'Inter' }}>
        {time}
      </div>
    </div>
  </div>
);

// 交易分组组件
const TransactionGroup = ({ title, total, children }: {
  title: string;
  total: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between py-3 px-4 bg-[#F8F9FA] rounded-lg">
      <div className="text-[#1B1446] font-semibold text-[16px]" style={{ fontFamily: 'Inter' }}>
        {title}
      </div>
      <div className="text-[#1B1446] font-semibold text-[16px]" style={{ fontFamily: 'Inter' }}>
        {total}
      </div>
    </div>
    <div className="space-y-2">
      {children}
    </div>
  </div>
);

export default function PaymentConfirm() {
  const router = useRouter();
  const navigation = useNavigation();
  const { tripData, loading, error } = useTripData();

  // 计算总费用 - 只计算分类中显示的费用
  const calculateTotalCost = () => {
    if (!tripData) return 0;
    let total = 0;
    
    tripData.days.forEach(day => {
      day.activities.forEach(activity => {
        // 交通费用：transportation + plane/train
        if (activity.type === "transportation" && (activity.mode === "plane" || activity.mode === "train") && activity.cost) {
          total += activity.cost;
        }
        // 大型交通费用：large_transportation + 从第一个adultSalePrice获取价格
        else if (activity.type === "large_transportation" && activity.traffic_details?.cabins?.[0]?.cabinPrice?.adultSalePrice) {
          // 这里是安全的，因为 if 条件已经检查过
          total += activity.traffic_details.cabins[0].cabinPrice.adultSalePrice;
        }
        // 票务费用：activity + 非hotel
        else if (activity.type === "activity" && activity.mode !== "hotel" && activity.cost) {
          total += activity.cost;
        }
        // 住宿费用：activity + hotel
        else if (activity.type === "activity" && activity.mode === "hotel" && activity.cost) {
          total += activity.cost;
        }
        // 美食费用：food
        else if (activity.type === "food" && activity.cost) {
          total += activity.cost;
        }
        // 购物费用：shopping
        else if (activity.type === "shopping" && activity.cost) {
          total += activity.cost;
        }
      });
    });
    
    return total;
  };

  const totalCost = calculateTotalCost();

  return (
    <PageContainer>
      <PageHeader title="预订确认" />

      <ScrollableContent hasBottomButton className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-[#808080] text-[16px]" style={{ fontFamily: 'Inter' }}>加载中...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-[#FF4444] text-[16px]" style={{ fontFamily: 'Inter' }}>{error}</div>
          </div>
        ) : tripData ? (
          <>
            {/* 票务 Section - activity(非hotel) */}
            {(() => {
              const ticketCost = tripData.days.reduce((dayTotal, day) => 
                dayTotal + day.activities
                  .filter(activity => activity.type === "activity" && activity.mode !== "hotel" && activity.cost)
                  .reduce((activityTotal, activity) => activityTotal + (activity.cost || 0), 0), 0
              );
              
              if (ticketCost > 0) {
                return (
                  <TransactionGroup title="票务" total={`¥${ticketCost.toFixed(1)}`}>
                    {tripData.days.map(day => 
                      day.activities
                        .filter(activity => activity.type === "activity" && activity.mode !== "hotel" && activity.cost && activity.cost > 0)
                        .map(activity => (
                          <TransactionItem
                            key={activity.id}
                            title={activity.title || ""}
                            subtitle={activity.description || ""}
                            amount={`¥${activity.cost?.toFixed(1)}`}
                            time={formatTimeWithDate(activity.start_time, day.date)}
                            type="expense"
                          />
                        ))
                    )}
                  </TransactionGroup>
                );
              }
              return null;
            })()}

            {/* 住宿 Section - activity(mode: hotel) */}
            {(() => {
              const hotelCost = tripData.days.reduce((dayTotal, day) => 
                dayTotal + day.activities
                  .filter(activity => activity.type === "activity" && activity.mode === "hotel" && activity.cost)
                  .reduce((activityTotal, activity) => activityTotal + (activity.cost || 0), 0), 0
              );
              
              if (hotelCost > 0) {
                return (
                  <TransactionGroup title="住宿" total={`¥${hotelCost.toFixed(1)}`}>
                    {tripData.days.map(day => 
                      day.activities
                        .filter(activity => activity.type === "activity" && activity.mode === "hotel" && activity.cost && activity.cost > 0)
                        .map(activity => (
                          <TransactionItem
                            key={activity.id}
                            title={activity.title || ""}
                            subtitle={activity.description || ""}
                            amount={`¥${activity.cost?.toFixed(1)}`}
                            time={formatTimeWithDate(activity.start_time, day.date)}
                            type="expense"
                          />
                        ))
                    )}
                  </TransactionGroup>
                );
              }
              return null;
            })()}

            {/* 美食 Section */}
            {(() => {
              const foodCost = tripData.days.reduce((dayTotal, day) => 
                dayTotal + day.activities
                  .filter(activity => activity.type === "food" && activity.cost)
                  .reduce((activityTotal, activity) => activityTotal + (activity.cost || 0), 0), 0
              );
              
              if (foodCost > 0) {
                return (
                  <TransactionGroup title="美食" total={`¥${foodCost.toFixed(1)}`}>
                    {tripData.days.map(day => 
                      day.activities
                        .filter(activity => activity.type === "food" && activity.cost && activity.cost > 0)
                        .map(activity => (
                          <TransactionItem
                            key={activity.id}
                            title={activity.title || ""}
                            subtitle={activity.description || ""}
                            amount={`¥${activity.cost?.toFixed(1)}`}
                            time={formatTimeWithDate(activity.start_time, day.date)}
                            type="expense"
                          />
                        ))
                    )}
                  </TransactionGroup>
                );
              }
              return null;
            })()}

            {/* 购物 Section */}
            {(() => {
              const shoppingCost = tripData.days.reduce((dayTotal, day) => 
                dayTotal + day.activities
                  .filter(activity => activity.type === "shopping" && activity.cost)
                  .reduce((activityTotal, activity) => activityTotal + (activity.cost || 0), 0), 0
              );
              
              if (shoppingCost > 0) {
                return (
                  <TransactionGroup title="购物" total={`¥${shoppingCost.toFixed(1)}`}>
                    {tripData.days.map(day => 
                      day.activities
                        .filter(activity => activity.type === "shopping" && activity.cost && activity.cost > 0)
                        .map(activity => (
                          <TransactionItem
                            key={activity.id}
                            title={activity.title || ""}
                            subtitle={activity.description || ""}
                            amount={`¥${activity.cost?.toFixed(1)}`}
                            time={formatTimeWithDate(activity.start_time, day.date)}
                            type="expense"
                          />
                        ))
                    )}
                  </TransactionGroup>
                );
              }
              return null;
            })()}

            {/* 交通 Section - transportation(plane/train) + large_transportation */}
            {(() => {
              const transportCost = tripData.days.reduce((dayTotal, day) => {
                let totalTransportCost = 0;
                
                // 小型交通费用：transportation + plane/train
                totalTransportCost += day.activities
                  .filter(activity => activity.type === "transportation" && (activity.mode === "plane" || activity.mode === "train") && activity.cost)
                  .reduce((activityTotal, activity) => activityTotal + (activity.cost || 0), 0);
                
                // 大型交通费用：large_transportation + 从第一个adultSalePrice获取价格
                totalTransportCost += day.activities
                  .filter(activity => activity.type === "large_transportation" && activity.traffic_details?.cabins?.[0]?.cabinPrice?.adultSalePrice)
                  // --- 修改开始 ---
                  // 在 reduce 中也使用可选链来保证类型安全
                  .reduce((activityTotal, activity) => activityTotal + (activity.traffic_details?.cabins?.[0]?.cabinPrice?.adultSalePrice || 0), 0);
                // --- 修改结束 ---
                
                return dayTotal + totalTransportCost;
              }, 0);
              
              if (transportCost > 0) {
                return (
                  <TransactionGroup title="交通" total={`¥${transportCost.toFixed(1)}`}>
                    {/* 小型交通 */}
                    {tripData.days.map(day => 
                      day.activities
                        .filter(activity => activity.type === "transportation" && (activity.mode === "plane" || activity.mode === "train") && activity.cost && activity.cost > 0)
                        .map(activity => (
                          <TransactionItem
                            key={activity.id}
                            title={`${activity.origin?.name} → ${activity.destination?.name}`}
                            subtitle={`${activity.mode === 'plane' ? '飞机' : '火车'}`}
                            amount={`¥${activity.cost?.toFixed(1)}`}
                            time={formatTimeWithDate(activity.start_time, day.date)}
                            type="expense"
                          />
                        ))
                    )}
                    {/* 大型交通 */}
                    {tripData.days.map(day => 
                      day.activities
                        .filter(activity => activity.type === "large_transportation" && activity.traffic_details?.cabins?.[0]?.cabinPrice?.adultSalePrice)
                        .map(activity => {
                          // --- 修改开始 ---
                          // 同样地，在这里安全地访问属性
                          const trafficDetails = activity.traffic_details;
                          // 增加保护，如果 price 不存在则不渲染此项
                          const price = trafficDetails?.cabins?.[0]?.cabinPrice?.adultSalePrice;
                          if (!trafficDetails || price === undefined) {
                            return null;
                          }
                          
                          const transportType = trafficDetails.traffic_type === "flight" ? "飞机" : 
                                               trafficDetails.traffic_type === "train" ? "火车" : "交通";
                          const route = trafficDetails.traffic_type === "flight" ? 
                                       `${trafficDetails.fromAirportName} → ${trafficDetails.toAirportName}` :
                                       trafficDetails.traffic_type === "train" ?
                                       `${trafficDetails.fromStation} → ${trafficDetails.toStation}` :
                                       "交通路线";
                          
                          return (
                            <TransactionItem
                              key={activity.id}
                              title={route}
                              subtitle={transportType}
                              amount={`¥${price.toFixed(1)}`}
                              time={formatTimeWithDate(activity.start_time, day.date)}
                              type="expense"
                            />
                          );
                          // --- 修改结束 ---
                        })
                    )}
                  </TransactionGroup>
                );
              }
              return null;
            })()}
          </>
        ) : (
          <div className="flex items-center justify-center py-8">
            <div className="text-[#808080] text-[16px]" style={{ fontFamily: 'Inter' }}>暂无行程数据</div>
          </div>
        )}
      </ScrollableContent>

      {/* Bottom CTA */}
      <div className="fixed inset-x-0 bottom-0 bg-white px-5 pt-4 shadow-[0_-1px_0_rgba(0,0,0,0.06)]" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)" }}>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-[#808080] text-[14px] font-medium" style={{ fontFamily: 'Inter' }}>总计</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.825 6.9126L10 10.7293L6.175 6.9126L5 8.0876L10 13.0876L15 8.0876L13.825 6.9126Z" fill="#0768FD"/>
              </svg>
            </div>
            <div className="text-[#1B1446] font-bold text-[24px]" style={{ fontFamily: 'Inter' }}>¥{totalCost.toFixed(1)}</div>
          </div>
          <button 
            onClick={() => navigation.push('/payment', 'forward')} 
            className="px-8 h-12 rounded-full bg-[#4285F4] text-white font-semibold text-[16px]" 
            style={{ fontFamily: 'Inter' }}
          >
            立即支付
          </button>
        </div>
      </div>
    </PageContainer>
  );
}
