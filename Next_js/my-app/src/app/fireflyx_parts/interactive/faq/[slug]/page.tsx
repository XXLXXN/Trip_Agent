import React from "react";
import { PageHeader, PageContainer, ScrollableContent, Card } from "../../../components";

const content: Record<string, { title: string; body: string[] }> = {
  "reset-password": {
    title: "如何重置密码？",
    body: [
      "在“我的”-“账户安全”中选择重置密码。",
      "输入手机号/邮箱，获取并填写验证码。",
      "设置新密码并确认保存。",
    ],
  },
  "view-orders": {
    title: "如何查看订单？",
    body: [
      "打开“我的订单”。",
      "可按时间和状态筛选，点击订单查看详情。",
      "如需售后，可在订单详情页发起。",
    ],
  },
  refund: {
    title: "如何申请退款？",
    body: [
      "进入订单详情，点击“申请退款”。",
      "选择退款原因并补充说明。",
      "提交后会在1-3个工作日反馈结果。",
    ],
  },
};

export default async function FaqDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = content[slug] || { title: slug, body: ["暂无内容"] };
  return (
    <PageContainer>
      <PageHeader title="帮助中心" backHref="/fireflyx_parts/interactive" />

      <ScrollableContent>
        <Card className="rounded-2xl border-[#E6EAF0]">
          <h2 className="text-[#1B1446] font-semibold text-[18px] leading-[22px] mb-4" style={{ fontFamily: 'Inter' }}>{item.title}</h2>
          <ul className="space-y-3 text-[#808080] text-[14px] leading-[17px]" style={{ fontFamily: 'Inter' }}>
            {item.body.map((t, i) => (
              <li key={i} className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0768FD] mt-2 mr-3 flex-shrink-0"></span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </Card>
      </ScrollableContent>
    </PageContainer>
  );
}
