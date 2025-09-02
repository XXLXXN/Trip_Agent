import { NextRequest, NextResponse } from 'next/server';

// 后端接口基础地址
const BASE_URL = "http://backend-server.com/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 调用后端接口获取酒店推荐
    const response = await fetch(`${BASE_URL}/hotels/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('获取酒店推荐失败:', error);
    return NextResponse.json(
      { error: '获取酒店推荐失败' },
      { status: 500 }
    );
  }
} 