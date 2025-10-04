import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const hotelRequestData = await request.json();

    // 验证必需字段
    const requiredFields = [
      "arr_date",
      "return_date",
      "travellers_count",
      "spot_info",
    ];
    const missingFields = requiredFields.filter(
      (field) => !(field in hotelRequestData)
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `缺少必需字段: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // 构建发送给后端的请求数据
    const backendData = {
      hotel_budget: hotelRequestData.hotel_budget || null,
      hotel_level: hotelRequestData.hotel_level || null,
      arr_date: formatDateForBackend(hotelRequestData.arr_date),
      return_date: formatDateForBackend(hotelRequestData.return_date),
      travellers_count: hotelRequestData.travellers_count,
      spot_info: hotelRequestData.spot_info,
    };

    console.log("发送给后端的酒店推荐请求数据:", backendData);

    // 发送到后端API (假设后端端口为8000)
    const backendResponse = await fetch(
      "http://localhost:8000/api/hotel-recommendation",
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

    // 返回响应
    return NextResponse.json(
      {
        success: true,
        data: result,
        message: "酒店推荐请求发送成功",
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
