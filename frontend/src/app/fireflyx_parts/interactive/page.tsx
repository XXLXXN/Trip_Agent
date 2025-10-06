"use client";

import React from "react";
import Link from "next/link";
import { PageHeader, PageContainer, ScrollableContent, Card, PrimaryButton, FixedBottomBar } from "../components";

// 扩展 Window 接口以支持语音识别
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type Message = { id: string; role: "system" | "user"; text: string };

type FaqItem = { id: string; text: string; slug: string };

const initialFaq: FaqItem[] = [
  { id: "q1", text: "如何重置密码？", slug: "reset-password" },
  { id: "q2", text: "如何查看订单？", slug: "view-orders" },
  { id: "q3", text: "如何申请退款？", slug: "refund" },
];

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-fit inline-flex items-center rounded-[0.875rem] bg-white text-[#1B1446] px-[0.875rem] py-[0.75rem] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] whitespace-pre-wrap">
      {children}
    </div>
  );
}

export default function ContactSupportInteractive() {
  const [faq, setFaq] = React.useState(initialFaq);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  const [composing, setComposing] = React.useState(false);
  const [showScrollHint, setShowScrollHint] = React.useState(false);
  const [isRecording, setIsRecording] = React.useState(false);
  const [recognition, setRecognition] = React.useState<any>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollHint(false);
  };

  const isNearBottom = () => {
    if (!scrollContainerRef.current) return true;
    const container = scrollContainerRef.current;
    const threshold = 100; // 距离底部100px内认为是在底部
    return container.scrollTop + container.clientHeight >= container.scrollHeight - threshold;
  };

  // 初始化语音识别
  React.useEffect(() => {
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
            setInput(prev => prev + transcript);
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

  React.useEffect(() => {
    // 只在用户发送消息时自动滚动，系统回复时检查是否需要显示提示
    if (messages.length > 0 && messages[messages.length - 1].role === "user") {
      scrollToBottom();
    } else if (messages.length > 0 && messages[messages.length - 1].role === "system") {
      // 如果当前不在底部附近，才显示提示
      if (!isNearBottom()) {
        setShowScrollHint(true);
      }
    }
  }, [messages]);

  function shuffle() {
    setFaq((prev) => [...prev].reverse());
  }

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

  async function send() {
    if (!input.trim() || busy) return;
    const text = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { id: String(Date.now()), role: "user", text }]);
    setBusy(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: String(Date.now()), role: "system", text: "收到，我们会尽快回复您。" },
      ]);
      setBusy(false);
    }, 400);
  }



  return (
    <PageContainer>
      <PageHeader title="联系客服" />

      <ScrollableContent hasBottomButton ref={scrollContainerRef}>
        {/* FAQ Card */}
        <Card className="rounded-2xl border-[#E6EAF0]">
          <div className="px-4 pt-[1.125rem] pb-2 text-[#111827] text-[1.25rem] font-bold">常见问题</div>
          <div>
            {faq.map((item, idx) => (
              <Link key={item.id} href={`/fireflyx_parts/interactive/faq/${item.slug}`} className="no-underline">
                <div className={`flex items-center h-14 px-4 text-[#808080] text-[0.875rem] font-semibold ${idx === 0 ? "" : "border-t border-[rgba(0,0,0,0.06)]"}`}>
                  <span>{item.text}</span>
                  <div className="ml-auto text-[#0768FD]">›</div>
                </div>
              </Link>
            ))}
          </div>
          <div className="p-4">
            <PrimaryButton onClick={shuffle} className="w-full h-[2.875rem]">换一换</PrimaryButton>
          </div>
        </Card>

        {/* Conversation */}
        <div className="pt-4 grid gap-3">
          <Chip>Hi，很高兴为您服务。</Chip>
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[17.5rem] px-[0.875rem] py-[0.75rem] rounded-[0.875rem] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] ${m.role === "user" ? "bg-[#A9CDFE]" : "bg-white"} text-[#1B1446]`}
              >
                {m.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Scroll Hint Button */}
        {showScrollHint && (
          <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50">
            <button
              onClick={scrollToBottom}
              className="bg-[#0768FD] text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 14L12 9L17 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              新消息
            </button>
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
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="请输入您要咨询的问题"
              onCompositionStart={() => setComposing(true)}
              onCompositionEnd={() => setComposing(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !composing) {
                  e.preventDefault();
                  send();
                }
              }}
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
              onClick={send}
              disabled={busy || !input.trim()}
              className="w-full h-12 rounded-2xl bg-[#0768FD] text-white font-semibold text-[16px] whitespace-nowrap transition-colors hover:bg-[#0656D1] disabled:bg-[#D9D9D9] disabled:text-[#808080]"
              style={{ fontFamily: 'Inter' }}
            >
              发送
            </button>
          </div>
        </div>
      </FixedBottomBar>
    </PageContainer>
  );
}
