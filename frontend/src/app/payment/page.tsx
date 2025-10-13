"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, PageContainer, ScrollableContent } from "../fireflyx_parts/components";
import { useTripData } from "../fireflyx_parts/hooks/useTripData";

export default function PaymentPage() {
  const router = useRouter();
  const { tripData, loading, error } = useTripData();
  const [selectedPayment, setSelectedPayment] = useState("unionpay");
  const [timeLeft, setTimeLeft] = useState(600);

  // 计算总费用 - 与confirm页面相同的逻辑
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
      });
    });
    
    return total;
  };

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePaymentSelect = (method: string) => setSelectedPayment(method);
  const handleConfirmPayment = () => {
    // 跳转到支付成功页面
    router.push('/paymentsuccess');
  };
  const handleAddCard = () => alert("添加银行卡");
  const handleBack = () => router.back();

  // 如果数据还在加载，显示加载状态
  if (loading) {
    return (
      <PageContainer>
        <PageHeader title="选择支付方式" />
        <ScrollableContent className="flex items-center justify-center">
          <div className="text-[#1B1446] text-[16px]" style={{ fontFamily: 'Inter' }}>
            加载中...
          </div>
        </ScrollableContent>
      </PageContainer>
    );
  }

  // 如果数据加载出错，显示错误状态
  if (error) {
    return (
      <PageContainer>
        <PageHeader title="选择支付方式" />
        <ScrollableContent className="flex items-center justify-center">
          <div className="text-[#FF4444] text-[16px]" style={{ fontFamily: 'Inter' }}>
            加载失败，请重试
          </div>
        </ScrollableContent>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader title="选择支付方式" />

      <ScrollableContent className="space-y-6" hasBottomButton={true}>
        {/* 金额部分 - 根据设计稿调整 */}
        <div className="text-center py-8">
          <div className="text-[#1B1446] font-semibold text-[36px] leading-[44px]" style={{ fontFamily: 'Inter' }}>
            ¥{calculateTotalCost().toFixed(0)}
          </div>
        </div>

        {/* 倒计时部分 - 根据设计稿调整 */}
        <div className="text-center -mt-4">
          <div className="text-[#8C8C8C] text-[14px] font-semibold" style={{ fontFamily: 'Inter' }}>
            请在时间内完成支付{formatTime(timeLeft)}
          </div>
        </div>

        {/* 支付方式部分 */}
        <div className="px-4 space-y-4">
          <h2 className="text-[#1B1446] font-medium text-[10px] uppercase tracking-[0.8px]" style={{ fontFamily: 'Inter' }}>
            支付方式
          </h2>
          <div className="space-y-2">
            {/* 银联 - 选中状态，带推荐标签 */}
            <label className={`flex items-center justify-between p-4 rounded-[16px] border transition-all relative ${
              selectedPayment === "unionpay" ? "border-[#0768FD]" : "border-[rgba(1,34,118,0.05)]"
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-[45px] h-8 flex items-center justify-center">
                  <img src="/images/unionpay.png" alt="银联" width="32" height="32" />
                </div>
                <span className="text-[#1B1446] font-medium text-[14px]" style={{ fontFamily: 'Inter' }}>
                  银联
                </span>
              </div>
              <input
                type="radio"
                name="payment"
                checked={selectedPayment === "unionpay"}
                onChange={() => handlePaymentSelect("unionpay")}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border ${
                selectedPayment === "unionpay" 
                  ? "border-[#0768FD] bg-[#0768FD]" 
                  : "border-[#D9D9D9]"
              }`}>
                {selectedPayment === "unionpay" && (
                  <div className="w-full h-full rounded-full bg-white scale-[0.6]"></div>
                )}
              </div>
              {/* 推荐标签 */}
              <div className="absolute -top-[10px] right-8 bg-[#EBF3EA] text-[#398B2B] text-[12px] font-medium px-1 py-[3px] rounded-[8px]" style={{ fontFamily: 'Inter' }}>
                推荐
              </div>
            </label>

            {/* 微信支付 */}
            <label className={`flex items-center justify-between p-4 rounded-[16px] border transition-all ${
              selectedPayment === "wechat" ? "border-[#0768FD]" : "border-[rgba(1,34,118,0.05)]"
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-[45px] h-8 flex items-center justify-center">
                  <img src="/images/wechatpay.png" alt="微信" width="24" height="24" />
                </div>
                <span className="text-[#1B1446] font-medium text-[14px]" style={{ fontFamily: 'Inter' }}>
                  微信支付
                </span>
              </div>
              <input
                type="radio"
                name="payment"
                checked={selectedPayment === "wechat"}
                onChange={() => handlePaymentSelect("wechat")}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border ${
                selectedPayment === "wechat" 
                  ? "border-[#0768FD] bg-[#0768FD]" 
                  : "border-[#D9D9D9]"
              }`}>
                {selectedPayment === "wechat" && (
                  <div className="w-full h-full rounded-full bg-white scale-[0.6]"></div>
                )}
              </div>
            </label>

            {/* 支付宝 */}
            <label className={`flex items-center justify-between p-4 rounded-[16px] border transition-all ${
              selectedPayment === "alipay" ? "border-[#0768FD]" : "border-[rgba(1,34,118,0.05)]"
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-[45px] h-8 flex items-center justify-center">
                  <img src="/images/alipay.png" alt="支付宝" width="24" height="24" />
                </div>
                <span className="text-[#1B1446] font-medium text-[14px]" style={{ fontFamily: 'Inter' }}>
                  支付宝
                </span>
              </div>
              <input
                type="radio"
                name="payment"
                checked={selectedPayment === "alipay"}
                onChange={() => handlePaymentSelect("alipay")}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border ${
                selectedPayment === "alipay" 
                  ? "border-[#0768FD] bg-[#0768FD]" 
                  : "border-[#D9D9D9]"
              }`}>
                {selectedPayment === "alipay" && (
                  <div className="w-full h-full rounded-full bg-white scale-[0.6]"></div>
                )}
              </div>
            </label>
          </div>
        </div>

        {/* 银行卡部分 */}
        <div className="px-4 space-y-4">
          <h2 className="text-[#1B1446] font-medium text-[10px] uppercase tracking-[0.8px]" style={{ fontFamily: 'Inter' }}>
            银行卡
          </h2>
          <div className="space-y-2">
            <label className={`flex items-center justify-between p-4 rounded-[16px] border transition-all ${
              selectedPayment === "icbc" ? "border-[#0768FD]" : "border-[rgba(1,34,118,0.05)]"
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-[45px] h-8 flex items-center justify-center">
                  <img src="/images/ICBCpay.png" alt="工商银行" width="24" height="24" />
                </div>
                <span className="text-[#1B1446] font-medium text-[14px]" style={{ fontFamily: 'Inter' }}>
                  工商银行
                </span>
              </div>
              <input
                type="radio"
                name="payment"
                checked={selectedPayment === "icbc"}
                onChange={() => handlePaymentSelect("icbc")}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border ${
                selectedPayment === "icbc" 
                  ? "border-[#0768FD] bg-[#0768FD]" 
                  : "border-[#D9D9D9]"
              }`}>
                {selectedPayment === "icbc" && (
                  <div className="w-full h-full rounded-full bg-white scale-[0.6]"></div>
                )}
              </div>
            </label>
          </div>
          
          <button 
            onClick={handleAddCard}
            className="w-full flex items-center justify-center gap-2 py-4 px-8 border border-[rgba(7,104,253,0.1)] rounded-[12px] text-[#0768FD] font-semibold text-[14px] hover:bg-[rgba(7,104,253,0.05)] transition-all"
            style={{ fontFamily: 'Inter' }}
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M6.5 0.5V12.5M0.5 6.5H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            添加银行卡
          </button>
        </div>
      </ScrollableContent>

      {/* 确认支付按钮 - 根据设计稿调整 */}
      <div className="fixed inset-x-0 bottom-0 bg-white px-6 py-4 border-t border-[rgba(1,34,118,0.05)]" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)" }}>
        <button 
          onClick={handleConfirmPayment}
          className="w-full h-12 rounded-[16px] bg-[#0768FD] text-white font-semibold text-[14px] disabled:bg-[#D9D9D9] disabled:text-[#808080] transition-colors"
          style={{ fontFamily: 'Inter' }}
        >
          确认支付
        </button>
      </div>
    </PageContainer>
  );
}
