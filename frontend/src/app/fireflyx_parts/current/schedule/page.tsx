"use client";

import React, { useState, useEffect } from "react";
import { ItineraryCard, FixedBottomBar, PageContainer, SpotCardForList, ScrollableContent } from "../../components";
import { useTripData } from "../../hooks/useTripData";
import { convertToItineraryData, getTransportOptions, formatTime, getFirstActivityTime, convertToSpotCardData } from "../../utils/dataConverter";

// 扩展 Window 接口以支持语音识别
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function SchedulePage() {
  // 获取动态行程数据
  const { tripData, loading, error } = useTripData();
  
  // 交通方式选择状态
  const [selectedTransports, setSelectedTransports] = useState<Record<string, string>>({});
  
  // 语音识别状态
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [inputValue, setInputValue] = useState("");

  // 初始化语音识别
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = 'zh-CN';
        
        recognitionInstance.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInputValue(prev => prev + transcript);
          }
        };
        
        recognitionInstance.onerror = (event: any) => {
          console.error('语音识别错误:', event.error);
          setIsRecording(false);
        };
        
        recognitionInstance.onend = () => {
          setIsRecording(false);
        };
        
        setRecognition(recognitionInstance);
      }
    }
  }, []);

  // 当数据加载完成后，设置默认选择步行
  useEffect(() => {
    if (tripData && Object.keys(selectedTransports).length === 0) {
      const defaultSelections: Record<string, string> = {};
      tripData.days.forEach(day => {
        day.activities.forEach(activity => {
          if (activity.type === "transportation") {
            const originName = activity.origin?.name;
            const destinationName = activity.destination?.name;
            if (originName && destinationName) {
              const routeKey = `${originName}-${destinationName}`;
              if (!defaultSelections[routeKey]) {
                defaultSelections[routeKey] = "walk"; // 默认选择步行
              }
            }
          }
        });
      });
      setSelectedTransports(defaultSelections);
    }
  }, [tripData, selectedTransports]);

  // 开始语音录制
  const startRecording = () => {
    if (recognition && !isRecording) {
      setIsRecording(true);
      recognition.start();
    }
  };

  // 停止语音录制
  const stopRecording = () => {
    if (recognition && isRecording) {
      recognition.stop();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <ScrollableContent className="space-y-6" hasBottomButton={true}>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-[#808080] text-[16px]" style={{ fontFamily: 'Inter' }}>加载中...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-[#FF4444] text-[16px]" style={{ fontFamily: 'Inter' }}>{error}</div>
          </div>
        ) : tripData ? (
          tripData.days.map((day, dayIndex) => (
            <div key={day.day_index} className="space-y-4">
                    {/* 第n天标题 */}
                    <div className="flex items-center gap-3">
                      <div className="text-[#1B1446] font-bold text-[24px]" style={{ fontFamily: 'Inter' }}>
                        第{day.day_index}天
                      </div>
                    </div>

              {/* 活动列表 */}
              <div className="space-y-4">
                {(() => {
                  let attractionIndex = 0; // 景点计数器
                  
                  return day.activities.map((activity, activityIndex) => {
                    // 对于 activity 类型，直接显示
                    if (activity.type === "activity") {
                      attractionIndex++; // 递增活动计数器
                      const spotData = convertToSpotCardData(activity, false); // schedule 页面不显示跳转
                      
                      return (
                        <div key={activity.id} className="space-y-3">
                          {/* 活动标题和时间 */}
                          <div className="flex items-center gap-3">
                            <div className="text-[#1B1446] font-semibold text-[20px] leading-[24px]" style={{ fontFamily: 'Inter' }}>
                              活动{attractionIndex}
                            </div>
                            <div className="text-[#808080] font-semibold text-[14px] leading-[17px]" style={{ fontFamily: 'Inter' }}>
                              {formatTime(activity.start_time)}
                            </div>
                          </div>
                          
                          {/* 景点卡片 */}
                          <SpotCardForList
                            spot={spotData}
                            isSelected={true}
                            onButtonClick={() => console.log('Spot clicked')}
                          />
                        </div>
                      );
                    }

                    // 对于 transportation 类型，处理交通选择
                    if (activity.type === "transportation") {
                      // 找到这个交通活动对应的景点对
                      const originName = activity.origin?.name;
                      const destinationName = activity.destination?.name;
                      
                      // 检查是否是第一个 transportation activity（用于显示选择器）
                      const transportationActivities = day.activities.filter(a => 
                        a.type === "transportation" && 
                        a.origin?.name === originName && 
                        a.destination?.name === destinationName
                      );
                      
                      const isFirstTransportForThisRoute = transportationActivities.indexOf(activity) === 0;
                      
                      if (isFirstTransportForThisRoute) {
                        const transportOptions = getTransportOptions(activity.mode || "");
                        const showTransportOptions = transportOptions.length > 0;
                        
                        // 对于 plane 和 train，直接显示交通卡片
                        if (activity.mode === "plane" || activity.mode === "train") {
                          const transportData = convertToItineraryData(activity);
                          return transportData ? (
                            <ItineraryCard
                              key={activity.id}
                              type="transport"
                              data={transportData.data}
                            />
                          ) : null;
                        }
                        
                        return (
                          <div key={activity.id} className="space-y-3">
                            {/* 交通方式选择器（只显示一次） */}
                            {showTransportOptions && (
                              <div className="flex gap-3 justify-between py-3">
                                {transportOptions.map((option) => {
                                  // 将中文选项映射到对应的 mode
                                  const optionToMode: Record<string, string> = {
                                    "公交": "bus",
                                    "步行": "walk", 
                                    "骑行": "cycling",
                                    "驾车": "driving"
                                  };
                                  
                                  return (
                                    <button
                                      key={option}
                                      onClick={() => {
                                        const currentSelection = selectedTransports[`${originName}-${destinationName}`];
                                        const optionMode = optionToMode[option];
                                        
                                        // 如果当前已选中，则取消选择；否则选择新的
                                        if (currentSelection === optionMode) {
                                          setSelectedTransports(prev => {
                                            const newState = { ...prev };
                                            delete newState[`${originName}-${destinationName}`];
                                            return newState;
                                          });
                                        } else {
                                          setSelectedTransports(prev => ({
                                            ...prev,
                                            [`${originName}-${destinationName}`]: optionMode
                                          }));
                                        }
                                      }}
                                      className={`w-16 h-8 rounded-full text-[12px] font-semibold flex items-center justify-center transition-colors touch-manipulation cursor-pointer ${
                                        selectedTransports[`${originName}-${destinationName}`] === optionToMode[option]
                                          ? "bg-[#0768FD] text-white"
                                          : "bg-[#DDDDDD] text-[#1B1446] hover:bg-[#CCCCCC]"
                                      }`}
                                      style={{ 
                                        fontFamily: 'Inter',
                                        minHeight: '32px',
                                        minWidth: '64px',
                                      }}
                                    >
                                      {option}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                            
                            {/* 交通卡片（根据选择显示） */}
                            {(() => {
                              const selectedMode = selectedTransports[`${originName}-${destinationName}`];
                              if (!selectedMode) return null; // 没有选择交通方式时不显示卡片
                              
                              // 找到对应 mode 的 transportation activity
                              const matchingTransport = day.activities.find(a => 
                                a.type === "transportation" && 
                                a.mode === selectedMode &&
                                a.origin?.name === originName &&
                                a.destination?.name === destinationName
                              );
                              
                              if (!matchingTransport) return null;
                              
                              const transportData = convertToItineraryData(matchingTransport);
                              return transportData ? (
                                <ItineraryCard
                                  type="transport"
                                  data={transportData.data}
                                />
                              ) : null;
                            })()}
                          </div>
                        );
                      } else {
                        // 其他 transportation activities 不显示
                        return null;
                      }
                    }
                    
                    return null;
                  });
                })()}
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center py-8">
            <div className="text-[#808080] text-[16px]" style={{ fontFamily: 'Inter' }}>暂无行程数据</div>
          </div>
        )}
      </ScrollableContent>

      {/* 底部输入栏和按钮 */}
      <FixedBottomBar>
               <div className="flex items-center gap-3">
                 {/* Input - 75% */}
                 <div className="relative w-[75%]">
                   <input
                     type="text"
                     value={inputValue || ""}
                     onChange={(e) => setInputValue(e.target.value)}
                     placeholder="请输入需求"
                     className="w-full h-12 rounded-2xl border border-[#EBEBEB] pl-4 pr-12 text-[14px] text-[#404040] outline-none"
                     style={{ fontFamily: 'Inter' }}
                   />
                   <button 
                     className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
                       isRecording ? 'bg-red-100' : 'hover:bg-gray-100'
                     }`}
                     onMouseDown={startRecording}
                     onMouseUp={stopRecording}
                     onMouseLeave={stopRecording}
                     onTouchStart={startRecording}
                     onTouchEnd={stopRecording}
                     title={isRecording ? "正在录音..." : "长按说话"}
                   >
                     <svg width="11" height="16" viewBox="0 0 11 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path d="M0 7.9028V6.38505C0 6.23053 0.0563708 6.09844 0.169113 5.98879C0.281854 5.87913 0.417657 5.8243 0.576520 5.8243C0.740508 5.8243 0.878873 5.87913 0.991614 5.98879C1.10436 6.09844 1.16073 6.23053 1.16073 6.38505V7.85794C1.16073 8.7053 1.34009 9.44798 1.69881 10.086C2.05754 10.724 2.56231 11.2199 3.21314 11.5738C3.86396 11.9227 4.62753 12.0972 5.50384 12.0972C6.38015 12.0972 7.14116 11.9227 7.78686 11.5738C8.43769 11.2199 8.94246 10.724 9.30119 10.086C9.65991 9.44798 9.83927 8.7053 9.83927 7.85794V6.38505C9.83927 6.23053 9.89564 6.09844 10.0084 5.98879C10.1211 5.87913 10.2595 5.8243 10.4235 5.8243C10.5823 5.8243 10.7181 5.87913 10.8309 5.98879C10.9436 6.09844 11 6.23053 11 6.38505V7.9028C11 8.87975 10.7925 9.74704 10.3774 10.5047C9.96739 11.2623 9.39343 11.8704 8.65549 12.329C7.91754 12.7826 7.05917 13.0492 6.08036 13.129V14.871H8.93222C9.09620 14.871 9.23457 14.9259 9.34731 15.0355C9.46005 15.1452 9.51642 15.2798 9.51642 15.4393C9.51642 15.5938 9.46005 15.7259 9.34731 15.8355C9.23457 15.9452 9.09620 16 8.93222 16H2.06778C1.90380 16 1.76543 15.9452 1.65269 15.8355C1.53995 15.7259 1.48358 15.5938 1.48358 15.4393C1.48358 15.2798 1.53995 15.1452 1.65269 15.0355C1.76543 14.9259 1.90380 14.871 2.06778 14.871H4.91964V13.129C3.94083 13.0492 3.08246 12.7826 2.34451 12.329C1.60657 11.8704 1.03005 11.2623 0.614955 10.5047C0.204985 9.74704 0 8.87975 0 7.9028ZM2.70580 7.63365V2.93084C2.70580 2.35763 2.82367 1.85171 3.05940 1.41308C3.29513 0.969470 3.62311 0.623053 4.04333 0.373832C4.46355 0.124611 4.95038 0 5.50384 0C6.05218 0 6.53646 0.124611 6.95667 0.373832C7.37689 0.623053 7.70487 0.969470 7.94060 1.41308C8.17633 1.85171 8.29420 2.35763 8.29420 2.93084V7.63365C8.29420 8.20685 8.17633 8.71527 7.94060 9.15888C7.70487 9.59751 7.37689 9.94143 6.95667 10.1907C6.53646 10.4399 6.05218 10.5645 5.50384 10.5645C4.95038 10.5645 4.46355 10.4399 4.04333 10.1907C3.62311 9.94143 3.29513 9.59751 3.05940 9.15888C2.82367 8.71527 2.70580 8.20685 2.70580 7.63365ZM3.86653 7.63365C3.86653 8.18692 4.01514 8.62804 4.31237 8.95701C4.61472 9.28598 5.01188 9.45047 5.50384 9.45047C5.99581 9.45047 6.39040 9.28598 6.68763 8.95701C6.98486 8.62804 7.13347 8.18692 7.13347 7.63365V2.93084C7.13347 2.37757 6.98486 1.93645 6.68763 1.60748C6.39040 1.27850 5.99581 1.11402 5.50384 1.11402C5.01188 1.11402 4.61472 1.27850 4.31237 1.60748C4.01514 1.93645 3.86653 2.37757 3.86653 2.93084V7.63365Z" fill={isRecording ? "#FF4444" : "#0768FD"}/>
                     </svg>
                   </button>
                 </div>
                 {/* Button - 25% */}
                 <div className="w-[25%]">
                   <button 
                     onClick={() => console.log('修改')} 
                     className="w-full h-12 rounded-2xl bg-[#0768FD] text-white font-semibold text-[16px] whitespace-nowrap transition-colors hover:bg-[#0656D1]"
                     style={{ fontFamily: 'Inter' }}
                   >
                     修改
                   </button>
                 </div>
               </div>
      </FixedBottomBar>
    </div>
  );
}
