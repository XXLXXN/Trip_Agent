"use client";

import React from "react";
import Link from "next/link";
import { PageHeader, PageContainer, ScrollableContent, Card, PrimaryButton } from "../components";

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    send();
  }


  return (
    <PageContainer>
      <PageHeader title="联系客服" backHref="/" />

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

      {/* Input bar fixed to bottom */}
      <form onSubmit={handleSubmit}
        className="fixed inset-x-0 bottom-0 bg-white flex gap-3 px-4 pt-3 shadow-[0_-1px_0_rgba(0,0,0,0.06)] z-60"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <input
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
          className="flex-1 h-[2.75rem] rounded-[1.375rem] bg-[#EEF2F6] px-[0.875rem] text-[#1B1446] outline-none"
          style={{ boxShadow: "inset 0 0 0 1px #E6EAF0" }}
        />
        <button
          type="submit"
          disabled={busy}
          className="w-20 h-[2.75rem] rounded-[1.375rem] bg-[#0768FD] text-white font-semibold disabled:opacity-70"
        >
          发送
        </button>
      </form>
    </PageContainer>
  );
}
