import { NextRequest, NextResponse } from 'next/server';

// 后端接口基础地址
const BASE_URL = "http://backend-server.com/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 调用后端接口
    const response = await fetch(`${BASE_URL}/spots`, {
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
    console.error('景点推荐请求失败:', error);
    return NextResponse.json(
      { error: '获取景点推荐失败' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 调用后端接口更新景点
    const response = await fetch(`${BASE_URL}/spots/update`, {
      method: 'PUT',
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
    console.error('更新景点失败:', error);
    return NextResponse.json(
      { error: '更新景点失败' },
      { status: 500 }
    );
  }
} 