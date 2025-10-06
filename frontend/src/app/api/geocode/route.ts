// app/api/geocode/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { address } = body;

    if (!address) {
      return NextResponse.json({ error: '地址不能为空' }, { status: 400 });
    }

    // 【核心改动】使用新的、带 NEXT_PUBLIC_ 前缀的变量名
    const apiKey = process.env.NEXT_PUBLIC_AMAP_KEY;
    
    if (!apiKey) {
      console.error("API 路由错误: 环境变量 NEXT_PUBLIC_AMAP_KEY 未在 .env.local 中配置");
      return NextResponse.json({ error: '服务器配置错误' }, { status: 500 });
    }

    const url = `https://restapi.amap.com/v3/geocode/geo?address=${encodeURIComponent(address)}&key=${apiKey}`;
    const amapResponse = await fetch(url);
    const amapData = await amapResponse.json();

    if (amapData.status === '1' && amapData.geocodes.length > 0) {
      const location = amapData.geocodes[0].location;
      const [longitude, latitude] = location.split(',').map(Number);
      return NextResponse.json({ coordinates: [longitude, latitude] });
    } else {
      console.error("高德地理编码失败:", amapData.info);
      return NextResponse.json({ error: '无法解析地址' }, { status: 404 });
    }
  } catch (error) {
    console.error("API 路由出错:", error);
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
  }
}