"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader, PageContainer, ScrollableContent } from "../fireflyx_parts/components";

export default function PaymentPage() {
  const router = useRouter();
  const [selectedPayment, setSelectedPayment] = useState("");
  const [timeLeft, setTimeLeft] = useState(600);

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

  return (
    <PageContainer>
      <PageHeader title="选择支付方式" />

      <ScrollableContent className="space-y-6" hasBottomButton={true}>
        {/* 金额部分 */}
        <div className="text-center py-8">
          <div className="text-[#1B1446] font-bold text-[32px]" style={{ fontFamily: 'Inter' }}>
            ¥2395
          </div>
        </div>

        {/* 倒计时部分 */}
        <div className="bg-[#FFF3E0] rounded-lg p-4 text-center">
          <div className="text-[#FF9800] text-[14px]" style={{ fontFamily: 'Inter' }}>
            请在时间内完成支付
            <span className="ml-2 font-semibold">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* 支付方式 */}
        <div className="space-y-4">
          <h2 className="text-[#1B1446] font-semibold text-[18px]" style={{ fontFamily: 'Inter' }}>
            支付方式
          </h2>
          <div className="space-y-3">
            {/* 银联 */}
            <label className={`flex items-center justify-between p-4 bg-white rounded-lg border-2 transition-all ${
              selectedPayment === "unionpay" ? "border-[#0768FD]" : "border-[#E5E5E5]"
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center">
                  <img src="/images/unionpay.png" alt="银联" width="24" height="24" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#1B1446] font-medium text-[16px]" style={{ fontFamily: 'Inter' }}>
                    银联
                  </span>
                  <span className="bg-[#FF4444] text-white text-[12px] px-2 py-1 rounded-full" style={{ fontFamily: 'Inter' }}>
                    推荐
                  </span>
                </div>
              </div>
              <input
                type="radio"
                name="payment"
                checked={selectedPayment === "unionpay"}
                onChange={() => handlePaymentSelect("unionpay")}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-full border-2 ${
                selectedPayment === "unionpay" 
                  ? "border-[#0768FD] bg-[#0768FD]" 
                  : "border-[#E5E5E5]"
              }`}>
                {selectedPayment === "unionpay" && (
                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                )}
              </div>
            </label>

            {/* 微信支付 */}
            <label className={`flex items-center justify-between p-4 bg-white rounded-lg border-2 transition-all ${
              selectedPayment === "wechat" ? "border-[#0768FD]" : "border-[#E5E5E5]"
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center">
                  <img src="/images/wechatpay.png" alt="微信" width="24" height="24" />
                </div>
                <span className="text-[#1B1446] font-medium text-[16px]" style={{ fontFamily: 'Inter' }}>
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
              <div className={`w-5 h-5 rounded-full border-2 ${
                selectedPayment === "wechat" 
                  ? "border-[#0768FD] bg-[#0768FD]" 
                  : "border-[#E5E5E5]"
              }`}>
                {selectedPayment === "wechat" && (
                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                )}
              </div>
            </label>

            {/* 支付宝 */}
            <label className={`flex items-center justify-between p-4 bg-white rounded-lg border-2 transition-all ${
              selectedPayment === "alipay" ? "border-[#0768FD]" : "border-[#E5E5E5]"
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center">
                  <img src="/images/alipay.png" alt="支付宝" width="24" height="24" />
                </div>
                <span className="text-[#1B1446] font-medium text-[16px]" style={{ fontFamily: 'Inter' }}>
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
              <div className={`w-5 h-5 rounded-full border-2 ${
                selectedPayment === "alipay" 
                  ? "border-[#0768FD] bg-[#0768FD]" 
                  : "border-[#E5E5E5]"
              }`}>
                {selectedPayment === "alipay" && (
                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                )}
              </div>
            </label>
          </div>
        </div>

        {/* 银行卡部分 */}
        <div className="space-y-4">
          <h2 className="text-[#1B1446] font-semibold text-[18px]" style={{ fontFamily: 'Inter' }}>
            银行卡
          </h2>
          <div className="space-y-3">
            <label className={`flex items-center justify-between p-4 bg-white rounded-lg border-2 transition-all ${
              selectedPayment === "icbc" ? "border-[#0768FD]" : "border-[#E5E5E5]"
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center">
                  <img src="/images/ICBCpay.png" alt="工商银行" width="24" height="24" />
                </div>
                <span className="text-[#1B1446] font-medium text-[16px]" style={{ fontFamily: 'Inter' }}>
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
              <div className={`w-5 h-5 rounded-full border-2 ${
                selectedPayment === "icbc" 
                  ? "border-[#0768FD] bg-[#0768FD]" 
                  : "border-[#E5E5E5]"
              }`}>
                {selectedPayment === "icbc" && (
                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                )}
              </div>
            </label>
          </div>
        </div>

        {/* 添加银行卡 */}
        <div className="pt-4">
          <button 
            onClick={handleAddCard}
            className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-[#E5E5E5] rounded-lg text-[#808080] font-medium text-[16px] hover:border-[#0768FD] hover:text-[#0768FD] transition-all"
            style={{ fontFamily: 'Inter' }}
          >
            <span className="text-[20px]">+</span>
            添加银行卡
          </button>
        </div>
      </ScrollableContent>

      {/* 确认支付按钮 */}
      <div className="fixed inset-x-0 bottom-0 bg-white px-5 pt-4 shadow-[0_-1px_0_rgba(0,0,0,0.06)]" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)" }}>
        <button 
          onClick={handleConfirmPayment}
          className="w-full h-12 rounded-2xl bg-[#0768FD] text-white font-semibold text-[16px] disabled:bg-[#D9D9D9] disabled:text-[#808080] transition-colors"
          style={{ fontFamily: 'Inter' }}
        >
          确认支付
        </button>
      </div>
    </PageContainer>
  );
}
