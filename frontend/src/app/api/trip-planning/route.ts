import { NextRequest, NextResponse } from "next/server";
import { formatDateForBackend } from "../../lib/formatters";

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
          学生: tripData.students || 0,
        },
      },
      budget: tripData.priceRange
        ? {
            min: tripData.priceRange[0],
            max: tripData.priceRange[1],
          }
        : null,
      trip_style: tripData.selectedStyles?.join(",") || "",
      other_requirement: tripData.additionalRequirements || null,
    };

    // 发送到后端API
    const backendResponse = await fetch(
      "http://localhost:8002/api/trip-planning",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(backendData),
      }
    );

    if (!backendResponse.ok) {
      console.error("后端响应状态:", backendResponse.status);
      const errorText = await backendResponse.text();
      console.error("后端错误响应:", errorText);
      throw new Error(`后端服务错误: ${backendResponse.status} - ${errorText}`);
    }

    const result = await backendResponse.json();
    console.log("后端API返回结果:", result);

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
      {
        error:
          error instanceof Error ? error.message : "服务器内部错误，请稍后重试",
      },
      { status: 500 }
    );
  }
}
