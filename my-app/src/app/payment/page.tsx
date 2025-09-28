"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/Payment.module.css"; 

export default function PaymentPage() {
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
  const handleConfirmPayment = () => alert("支付确认中...");
  const handleAddCard = () => alert("添加银行卡");
  const handleBack = () => alert("返回上一页");

  return (
    <div className={styles.container}>
      {/* 顶部导航栏 */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.7912 7.0051H3.62124L8.50124 2.1251C8.89124 1.7351 8.89124 1.0951 8.50124 0.705098C8.11124 0.315098 7.48124 0.315098 7.09124 0.705098L0.50124 7.2951C0.11124 7.6851 0.11124 8.3151 0.50124 8.7051L7.09124 15.2951C7.48124 15.6851 8.11124 15.6851 8.50124 15.2951C8.89124 14.9051 8.89124 14.2751 8.50124 13.8851L3.62124 9.0051H14.7912C15.3412 9.0051 15.7912 8.5551 15.7912 8.0051C15.7912 7.4551 15.3412 7.0051 14.7912 7.0051Z"
              fill="#0768FD"
            />
          </svg>
        </button>
        <h1 className={styles.headerTitle}>选择支付方式</h1>
      </div>

      {/* 金额部分 */}
      <div className={styles.amountSection}>
        <div className={styles.amount}>¥2395</div>
      </div>

      {/* 倒计时部分 */}
      <div className={styles.timerSection}>
        <div className={styles.timer}>
          请在时间内完成支付
          <span className={styles.timeLeft}>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* 支付方式 */}
      <div className={styles.paymentSection}>
        <h2 className={styles.sectionTitle}>支付方式</h2>
        <div className={styles.methodList}>
          {/* 银联 */}
          <label
            className={`${styles.methodItem} ${
              selectedPayment === "unionpay" ? styles.selected : ""
            }`}
          >
            <div className={styles.iconContainer}>
              <img src="/images/unionpay.png" alt="银联" width="24" height="24" />
            </div>
            <div className={styles.methodTextContainer}>
              <span className={styles.methodText}>银联</span>
              <span className={styles.recommendText}>推荐</span>
            </div>
            <input
              type="radio"
              name="payment"
              checked={selectedPayment === "unionpay"}
              onChange={() => handlePaymentSelect("unionpay")}
            />
            <span className={styles.radioCustom}></span>
          </label>

          {/* 微信支付 */}
          <label
            className={`${styles.methodItem} ${
              selectedPayment === "wechat" ? styles.selected : ""
            }`}
          >
            <div className={styles.iconContainer}>
              <img src="/images/wechatpay.png" alt="微信" width="24" height="24" />
            </div>
            <span className={styles.methodText}>微信支付</span>
            <input
              type="radio"
              name="payment"
              checked={selectedPayment === "wechat"}
              onChange={() => handlePaymentSelect("wechat")}
            />
            <span className={styles.radioCustom}></span>
          </label>

          {/* 支付宝 */}
          <label
            className={`${styles.methodItem} ${
              selectedPayment === "alipay" ? styles.selected : ""
            }`}
          >
            <div className={styles.iconContainer}>
              <img src="/images/alipay.png" alt="支付宝" width="24" height="24" />
            </div>
            <span className={styles.methodText}>支付宝</span>
            <input
              type="radio"
              name="payment"
              checked={selectedPayment === "alipay"}
              onChange={() => handlePaymentSelect("alipay")}
            />
            <span className={styles.radioCustom}></span>
          </label>
        </div>
      </div>

      {/* 银行卡部分 */}
      <div className={styles.bankSection}>
        <h2 className={styles.sectionTitle}>银行卡</h2>
        <div className={styles.methodList}>
          <label
            className={`${styles.methodItem} ${
              selectedPayment === "icbc" ? styles.selected : ""
            }`}
          >
            <div className={styles.iconContainer}>
              <img src="/images/ICBCpay.png" alt="工商银行" width="24" height="24" />
            </div>
            <span className={styles.methodText}>工商银行</span>
            <input
              type="radio"
              name="payment"
              checked={selectedPayment === "icbc"}
              onChange={() => handlePaymentSelect("icbc")}
            />
            <span className={styles.radioCustom}></span>
          </label>
        </div>
      </div>

      {/* 添加银行卡 */}
      <div className={styles.addCardSection}>
        <button className={styles.addCardButton} onClick={handleAddCard}>
          <span className={styles.plusIcon}>+</span> 添加银行卡
        </button>
      </div>

      {/* 确认支付按钮 */}
      <div className={styles.confirmSection}>
        <button className={styles.confirmButton} onClick={handleConfirmPayment}>
          <span className={styles.confirmText}>确认支付</span>
        </button>
      </div>
    </div>
  );
}
