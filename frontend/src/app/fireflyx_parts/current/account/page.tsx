"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTripData } from "../../hooks/useTripData";
import { useAccountingData } from "../../hooks/useAccountingData";
import { PageHeader, PageContainer, ScrollableContent } from "../../components";
import { getAutoClearConfig } from "../../config/accounting";

const CATEGORIES = [
  { id: 'tickets', name: '票务' },
  { id: 'accommodation', name: '住宿' },
  { id: 'food', name: '美食' },
  { id: 'shopping', name: '购物' },
  { id: 'transportation', name: '交通' },
];

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

export default function AccountPage() {
  const router = useRouter();
  const { tripData, loading, error } = useTripData();
  const { records: accountingRecords, loading: accountingLoading, clearRecords, addRecord } = useAccountingData();
  
  // 记账模态状态
  const [showAccountingModal, setShowAccountingModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 页面卸载时自动清除记账记录（代码控制）
  useEffect(() => {
    const config = getAutoClearConfig();
    
    const handleBeforeUnload = () => {
      // 根据配置决定是否清除
      if (config.onPageClose) {
        clearRecords().catch(console.error);
      }
    };

    if (config.onRefresh) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }
    
    return () => {
      if (config.onRefresh) {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      }
      // 组件卸载时根据配置决定是否清除
      if (config.onUnmount) {
        clearRecords().catch(console.error);
      }
    };
  }, []); // 移除 clearRecords 依赖，避免无限循环

  // 打开记账模态
  const handleOpenAccounting = () => {
    setShowAccountingModal(true);
    setTimeout(() => {
      setIsModalVisible(true);
    }, 10);
  };

  // 关闭记账模态
  const handleCloseAccounting = () => {
    setIsModalVisible(false);
    setTimeout(() => {
      setShowAccountingModal(false);
      // 重置表单
      setSelectedCategory('');
      setName('');
      setDescription('');
      setAmount('');
    }, 300);
  };

  // 保存记账记录
  const handleSaveAccounting = async () => {
    if (!selectedCategory || !name || !amount) {
      alert('请填写完整信息');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('请输入有效的金额');
      return;
    }

    try {
      await addRecord({
        category: selectedCategory as any,
        name,
        description: description || '',
        amount: amountNum,
      });
      
      // 保存成功后关闭模态
      handleCloseAccounting();
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败，请重试');
    }
  };

  // 计算总费用 - 包含记账记录
  const calculateTotalCost = () => {
    let total = 0;
    
    // 计算行程数据费用
    if (tripData) {
      tripData.days.forEach(day => {
        day.activities.forEach(activity => {
          // 交通费用：transportation + plane/train
          if (activity.type === "transportation" && (activity.mode === "plane" || activity.mode === "train") && activity.cost) {
            total += activity.cost;
          }
          // 大型交通费用：large_transportation + 从第一个adultSalePrice获取价格
          else if (activity.type === "large_transportation" && activity.traffic_details?.cabins?.[0]?.cabinPrice?.adultSalePrice) {
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
    }
    
    // 计算记账记录费用
    accountingRecords.forEach(record => {
      total += record.amount;
    });
    
    return total;
  };

  const totalCost = calculateTotalCost();

  return (
    <div className="h-full overflow-y-auto px-5 pb-24 space-y-6">
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
            {/* 票务 Section - activity(非hotel) + 手动记账(tickets) */}
            {(() => {
              // 计算行程数据中的票务费用
              const tripTicketCost = tripData.days.reduce((dayTotal, day) => 
                dayTotal + day.activities
                  .filter(activity => activity.type === "activity" && activity.mode !== "hotel" && activity.cost)
                  .reduce((activityTotal, activity) => activityTotal + (activity.cost || 0), 0), 0
              );
              
              // 计算手动记账中的票务费用
              const accountingTicketCost = accountingRecords
                .filter(record => record.category === 'tickets')
                .reduce((sum, record) => sum + record.amount, 0);
              
              const totalTicketCost = tripTicketCost + accountingTicketCost;
              
              if (totalTicketCost > 0) {
                return (
                  <TransactionGroup title="票务" total={`¥${totalTicketCost.toFixed(1)}`}>
                    {/* 行程数据中的票务 */}
                    {tripData.days.map(day => 
                      day.activities
                        .filter(activity => activity.type === "activity" && activity.mode !== "hotel" && activity.cost && activity.cost > 0)
                        .map(activity => (
                          <TransactionItem
                            key={activity.id}
                            title={activity.title || ""}
                            subtitle={activity.description || ""}
                            amount={`¥${activity.cost?.toFixed(1)}`}
                            time={activity.start_time}
                            type="expense"
                          />
                        ))
                    )}
                    {/* 手动记账中的票务 */}
                    {accountingRecords
                      .filter(record => record.category === 'tickets')
                      .map(record => (
                        <TransactionItem
                          key={record.id}
                          title={record.name}
                          subtitle={record.description || new Date(record.timestamp).toLocaleString()}
                          amount={`¥${record.amount.toFixed(1)}`}
                          time={new Date(record.timestamp).toLocaleTimeString()}
                          type="expense"
                        />
                      ))}
                  </TransactionGroup>
                );
              }
              return null;
            })()}

            {/* 住宿 Section - activity(mode: hotel) + 手动记账(accommodation) */}
            {(() => {
              // 计算行程数据中的住宿费用
              const tripHotelCost = tripData.days.reduce((dayTotal, day) => 
                dayTotal + day.activities
                  .filter(activity => activity.type === "activity" && activity.mode === "hotel" && activity.cost)
                  .reduce((activityTotal, activity) => activityTotal + (activity.cost || 0), 0), 0
              );
              
              // 计算手动记账中的住宿费用
              const accountingHotelCost = accountingRecords
                .filter(record => record.category === 'accommodation')
                .reduce((sum, record) => sum + record.amount, 0);
              
              const totalHotelCost = tripHotelCost + accountingHotelCost;
              
              if (totalHotelCost > 0) {
                return (
                  <TransactionGroup title="住宿" total={`¥${totalHotelCost.toFixed(1)}`}>
                    {/* 行程数据中的住宿 */}
                    {tripData.days.map(day => 
                      day.activities
                        .filter(activity => activity.type === "activity" && activity.mode === "hotel" && activity.cost && activity.cost > 0)
                        .map(activity => (
                          <TransactionItem
                            key={activity.id}
                            title={activity.title || ""}
                            subtitle={activity.description || ""}
                            amount={`¥${activity.cost?.toFixed(1)}`}
                            time={activity.start_time}
                            type="expense"
                          />
                        ))
                    )}
                    {/* 手动记账中的住宿 */}
                    {accountingRecords
                      .filter(record => record.category === 'accommodation')
                      .map(record => (
                        <TransactionItem
                          key={record.id}
                          title={record.name}
                          subtitle={record.description || new Date(record.timestamp).toLocaleString()}
                          amount={`¥${record.amount.toFixed(1)}`}
                          time={new Date(record.timestamp).toLocaleTimeString()}
                          type="expense"
                        />
                      ))}
                  </TransactionGroup>
                );
              }
              return null;
            })()}

            {/* 美食 Section - food + 手动记账(food) */}
            {(() => {
              // 计算行程数据中的美食费用
              const tripFoodCost = tripData.days.reduce((dayTotal, day) => 
                dayTotal + day.activities
                  .filter(activity => activity.type === "food" && activity.cost)
                  .reduce((activityTotal, activity) => activityTotal + (activity.cost || 0), 0), 0
              );
              
              // 计算手动记账中的美食费用
              const accountingFoodCost = accountingRecords
                .filter(record => record.category === 'food')
                .reduce((sum, record) => sum + record.amount, 0);
              
              const totalFoodCost = tripFoodCost + accountingFoodCost;
              
              if (totalFoodCost > 0) {
                return (
                  <TransactionGroup title="美食" total={`¥${totalFoodCost.toFixed(1)}`}>
                    {/* 行程数据中的美食 */}
                    {tripData.days.map(day => 
                      day.activities
                        .filter(activity => activity.type === "food" && activity.cost && activity.cost > 0)
                        .map(activity => (
                          <TransactionItem
                            key={activity.id}
                            title={activity.title || ""}
                            subtitle={activity.description || ""}
                            amount={`¥${activity.cost?.toFixed(1)}`}
                            time={activity.start_time}
                            type="expense"
                          />
                        ))
                    )}
                    {/* 手动记账中的美食 */}
                    {accountingRecords
                      .filter(record => record.category === 'food')
                      .map(record => (
                        <TransactionItem
                          key={record.id}
                          title={record.name}
                          subtitle={record.description || new Date(record.timestamp).toLocaleString()}
                          amount={`¥${record.amount.toFixed(1)}`}
                          time={new Date(record.timestamp).toLocaleTimeString()}
                          type="expense"
                        />
                      ))}
                  </TransactionGroup>
                );
              }
              return null;
            })()}

            {/* 购物 Section - shopping + 手动记账(shopping) */}
            {(() => {
              // 计算行程数据中的购物费用
              const tripShoppingCost = tripData.days.reduce((dayTotal, day) => 
                dayTotal + day.activities
                  .filter(activity => activity.type === "shopping" && activity.cost)
                  .reduce((activityTotal, activity) => activityTotal + (activity.cost || 0), 0), 0
              );
              
              // 计算手动记账中的购物费用
              const accountingShoppingCost = accountingRecords
                .filter(record => record.category === 'shopping')
                .reduce((sum, record) => sum + record.amount, 0);
              
              const totalShoppingCost = tripShoppingCost + accountingShoppingCost;
              
              if (totalShoppingCost > 0) {
                return (
                  <TransactionGroup title="购物" total={`¥${totalShoppingCost.toFixed(1)}`}>
                    {/* 行程数据中的购物 */}
                    {tripData.days.map(day => 
                      day.activities
                        .filter(activity => activity.type === "shopping" && activity.cost && activity.cost > 0)
                        .map(activity => (
                          <TransactionItem
                            key={activity.id}
                            title={activity.title || ""}
                            subtitle={activity.description || ""}
                            amount={`¥${activity.cost?.toFixed(1)}`}
                            time={activity.start_time}
                            type="expense"
                          />
                        ))
                    )}
                    {/* 手动记账中的购物 */}
                    {accountingRecords
                      .filter(record => record.category === 'shopping')
                      .map(record => (
                        <TransactionItem
                          key={record.id}
                          title={record.name}
                          subtitle={record.description || new Date(record.timestamp).toLocaleString()}
                          amount={`¥${record.amount.toFixed(1)}`}
                          time={new Date(record.timestamp).toLocaleTimeString()}
                          type="expense"
                        />
                      ))}
                  </TransactionGroup>
                );
              }
              return null;
            })()}

            {/* 交通 Section - transportation(plane/train) + large_transportation + 手动记账(transportation) */}
            {(() => {
              // 计算行程数据中的交通费用
              const tripTransportCost = tripData.days.reduce((dayTotal, day) => {
                let transportCost = 0;
                
                // 小型交通费用：transportation + plane/train
                transportCost += day.activities
                  .filter(activity => activity.type === "transportation" && (activity.mode === "plane" || activity.mode === "train") && activity.cost)
                  .reduce((activityTotal, activity) => activityTotal + (activity.cost || 0), 0);
                
                // 大型交通费用：large_transportation + 从第一个adultSalePrice获取价格
                transportCost += day.activities
                  .filter(activity => activity.type === "large_transportation" && activity.traffic_details?.cabins?.[0]?.cabinPrice?.adultSalePrice)
                  .reduce((activityTotal, activity) => activityTotal + (activity.traffic_details.cabins[0].cabinPrice.adultSalePrice || 0), 0);
                
                return dayTotal + transportCost;
              }, 0);
              
              // 计算手动记账中的交通费用
              const accountingTransportCost = accountingRecords
                .filter(record => record.category === 'transportation')
                .reduce((sum, record) => sum + record.amount, 0);
              
              const totalTransportCost = tripTransportCost + accountingTransportCost;
              
              if (totalTransportCost > 0) {
                return (
                  <TransactionGroup title="交通" total={`¥${totalTransportCost.toFixed(1)}`}>
                    {/* 行程数据中的小型交通 */}
                    {tripData.days.map(day => 
                      day.activities
                        .filter(activity => activity.type === "transportation" && (activity.mode === "plane" || activity.mode === "train") && activity.cost && activity.cost > 0)
                        .map(activity => (
                          <TransactionItem
                            key={activity.id}
                            title={`${activity.origin?.name} → ${activity.destination?.name}`}
                            subtitle={`${activity.mode === 'plane' ? '飞机' : '火车'}`}
                            amount={`¥${activity.cost?.toFixed(1)}`}
                            time={activity.start_time}
                            type="expense"
                          />
                        ))
                    )}
                    {/* 行程数据中的大型交通 */}
                    {tripData.days.map(day => 
                      day.activities
                        .filter(activity => activity.type === "large_transportation" && activity.traffic_details?.cabins?.[0]?.cabinPrice?.adultSalePrice)
                        .map(activity => {
                          const trafficDetails = activity.traffic_details;
                          const price = trafficDetails.cabins[0].cabinPrice.adultSalePrice;
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
                              time={activity.start_time}
                              type="expense"
                            />
                          );
                        })
                    )}
                    {/* 手动记账中的交通 */}
                    {accountingRecords
                      .filter(record => record.category === 'transportation')
                      .map(record => (
                        <TransactionItem
                          key={record.id}
                          title={record.name}
                          subtitle={record.description || new Date(record.timestamp).toLocaleString()}
                          amount={`¥${record.amount.toFixed(1)}`}
                          time={new Date(record.timestamp).toLocaleTimeString()}
                          type="expense"
                        />
                      ))}
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


      {/* Bottom Summary */}
      <div className="fixed inset-x-0 bottom-0 bg-white px-5 pt-4 shadow-[0_-1px_0_rgba(0,0,0,0.06)]" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)" }}>
        <div className="flex items-center justify-between mb-4">
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
            onClick={handleOpenAccounting}
            className="px-8 h-12 rounded-full bg-[#4285F4] text-white font-semibold text-[16px]" 
            style={{ fontFamily: 'Inter', border: 'none', cursor: 'pointer' }}
          >
            继续记账
          </button>
        </div>
      </div>

      {/* 记账模态 */}
      {showAccountingModal && (
        <div className="fixed inset-0 z-[9999] flex items-end" onClick={handleCloseAccounting}>
          {/* 背景遮罩 - 覆盖整个屏幕，上半部分更透明 */}
          <div 
            className={`absolute inset-0 transition-opacity duration-300 ${
              isModalVisible ? 'opacity-30' : 'opacity-0'
            }`}
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.5) 100%)'
            }}
          />
          
          {/* 记账面板 - 阻止点击事件冒泡，保持半覆盖高度 */}
          <div 
            className={`relative w-full bg-white rounded-t-3xl transition-transform duration-300 ${
              isModalVisible ? 'translate-y-0' : 'translate-y-full'
            }`} 
            style={{ height: '60vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              {/* 顶部拖拽条 */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1 bg-[#E5E5E5] rounded-full"></div>
              </div>
              
              {/* 标题 */}
              <div className="px-5 pb-4">
                <h2 className="text-[#1B1446] font-semibold text-[20px] text-center" style={{ fontFamily: 'Inter' }}>
                  记账
                </h2>
              </div>
              
              {/* 内容区域 */}
              <div className="flex-1 overflow-y-auto px-5 space-y-6">
                {/* 类别选择 - 五个分类排成一行 */}
                <div>
                  <h3 className="text-[#1B1446] font-semibold text-[16px] mb-3" style={{ fontFamily: 'Inter' }}>
                    选择类别
                  </h3>
                  <div className="flex gap-2">
                    {CATEGORIES.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`flex-1 py-3 px-2 rounded-xl border-2 transition-all ${
                          selectedCategory === category.id
                            ? 'border-[#0768FD] bg-[#0768FD] text-white'
                            : 'border-[#E5E5E5] bg-white text-[#1B1446]'
                        }`}
                      >
                        <div className={`font-medium text-[14px] text-center ${
                          selectedCategory === category.id ? 'text-white' : 'text-[#1B1446]'
                        }`} style={{ fontFamily: 'Inter' }}>
                          {category.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 表单 */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[#1B1446] font-medium text-[16px] mb-2" style={{ fontFamily: 'Inter' }}>
                      名称 *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="请输入名称"
                      className="w-full h-12 px-4 rounded-2xl border border-[#E5E5E5] text-[#1B1446] text-[16px] outline-none focus:border-[#0768FD]"
                      style={{ fontFamily: 'Inter' }}
                    />
                  </div>

                  <div>
                    <label className="block text-[#1B1446] font-medium text-[16px] mb-2" style={{ fontFamily: 'Inter' }}>
                      描述
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="请输入描述（可选）"
                      rows={3}
                      className="w-full px-4 py-3 rounded-2xl border border-[#E5E5E5] text-[#1B1446] text-[16px] outline-none focus:border-[#0768FD] resize-none"
                      style={{ fontFamily: 'Inter' }}
                    />
                  </div>

                  <div>
                    <label className="block text-[#1B1446] font-medium text-[16px] mb-2" style={{ fontFamily: 'Inter' }}>
                      金额 *
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="请输入金额"
                      className="w-full h-12 px-4 rounded-2xl border border-[#E5E5E5] text-[#1B1446] text-[16px] outline-none focus:border-[#0768FD]"
                      style={{ fontFamily: 'Inter' }}
                    />
                  </div>
                </div>
              </div>

              {/* 底部按钮 */}
              <div className="px-5 pb-6 pt-4">
                <button
                  onClick={handleSaveAccounting}
                  disabled={!selectedCategory || !name || !amount}
                  className="w-full h-12 rounded-2xl bg-[#0768FD] text-white font-semibold text-[16px] disabled:bg-[#D9D9D9] disabled:text-[#808080] transition-colors"
                  style={{ fontFamily: 'Inter' }}
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
