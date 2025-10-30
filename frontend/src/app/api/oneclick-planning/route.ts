import { NextResponse } from "next/server";

// 配置为动态路由
export const dynamic = 'force-dynamic';

// 一键规划API路由
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Frontend received oneclick planning request:", body);

    // 调用后端unified_api的一键规划接口
    const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8002';
    const response = await fetch(`${backendUrl}/api/oneclick-planning`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Backend API request failed: ${response.status}`);
    }

    const result = await response.json();
    console.log("Backend response:", result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in oneclick planning API:", error);
    return NextResponse.json(
      { 
        success: false,
        message: `一键规划失败: ${error instanceof Error ? error.message : '未知错误'}`,
        data: null 
      },
      { status: 500 }
    );
  }
}

// GET方法也支持
export async function GET() {
  return POST(new Request('http://localhost', { method: 'POST', body: '{}' }));
}