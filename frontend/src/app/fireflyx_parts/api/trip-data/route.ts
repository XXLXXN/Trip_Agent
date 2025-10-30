import { NextResponse } from "next/server";

// 配置为动态路由
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 从后端API获取数据
    // 注意：这里的 trip_id 是硬编码的，将来可以根据请求参数动态获取
    const backendUrl = "http://127.0.0.1:8000/get_trip_by_id?trip_id=beijing_wenyi_trip_001";
    const response = await fetch(backendUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend API error:", errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch trip data:", error);
    return NextResponse.json(
      { message: "Failed to fetch trip data", error: error.message },
      { status: 500 }
    );
  }
}
