import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const tripData = await request.json();

    // 验证必需字段
    const requiredFields = [
      "departure",
      "destination",
      "startDate",
      "endDate",
      "adults",
      "elderly",
      "children",
      "priceRange",
      "selectedTransport",
      "selectedAccommodation",
      "selectedStyles",
    ];
    const missingFields = requiredFields.filter(
      (field) => !(field in tripData)
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `缺少必需字段: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // 这里应该转发到后端API
    // 由于后端地址未知，这里先模拟响应
    // 实际使用时需要替换为真实的后端API地址

    const backendResponse = await fetch(
      "http://localhost:8000/api/trip-planning",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tripData),
      }
    );

    if (!backendResponse.ok) {
      throw new Error(`后端服务错误: ${backendResponse.status}`);
    }

    const result = await backendResponse.json();

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("API路由错误:", error);
    return NextResponse.json(
      { error: "服务器内部错误，请稍后重试" },
      { status: 500 }
    );
  }
}
