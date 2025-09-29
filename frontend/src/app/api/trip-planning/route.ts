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

    // 转换数据格式以符合后端API要求
    const backendData = {
      departure_city: tripData.departure,
      destination_city: tripData.destination,
      departure_date: formatDateForBackend(tripData.startDate),
      return_date: formatDateForBackend(tripData.endDate),
      travellers_count: {
        travellers: {
          成人: tripData.adults || 0,
          老人: tripData.elderly || 0,
          儿童: tripData.children || 0,
          学生: 0, // 前端没有学生字段，设为0
        },
      },
      budget: tripData.priceRange
        ? {
            min: tripData.priceRange[0],
            max: tripData.priceRange[1],
          }
        : null,
      trip_style: tripData.selectedStyles?.join(",") || null,
      other_requirement: tripData.additionalRequirements || null,
    };

    // 发送到后端API
    const backendResponse = await fetch(
      "http://localhost:8000/api/trip-planning",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(backendData),
      }
    );

    if (!backendResponse.ok) {
      throw new Error(`后端服务错误: ${backendResponse.status}`);
    }

    const result = await backendResponse.json();

    // 包装响应以符合前端期望的格式
    return NextResponse.json(
      {
        success: true,
        data: result,
        message: "行程规划成功",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API路由错误:", error);
    return NextResponse.json(
      { error: "服务器内部错误，请稍后重试" },
      { status: 500 }
    );
  }
}

// 辅助函数：将前端日期格式转换为后端期望的格式
function formatDateForBackend(dateString: string): string {
  // 前端格式：2025.8.24，后端期望：YYYY-MM-DD
  const parts = dateString.split(".");
  if (parts.length === 3) {
    const year = parts[0];
    const month = parts[1].padStart(2, "0");
    const day = parts[2].padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  // 如果已经是标准格式，直接返回
  return dateString;
}
