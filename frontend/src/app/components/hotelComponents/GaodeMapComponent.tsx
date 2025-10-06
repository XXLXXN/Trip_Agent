// components/hotelComponents/GaodeMapComponent.tsx
"use client";

import React, { useEffect, useRef } from 'react';

interface GaodeMapProps {
  coordinates: [number, number];
  address: string;
}

const AMAP_JS_API_KEY = process.env.NEXT_PUBLIC_AMAP_KEY;

const GaodeMapComponent = ({ coordinates, address }: GaodeMapProps) => {
  // mapContainerRef 用于引用将要挂载地图的 DOM 元素
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // mapRef 用于存储已创建的地图实例，以便后续可以销毁它
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!AMAP_JS_API_KEY) {
      console.error("高德地图的 Key (NEXT_PUBLIC_AMAP_KEY) 未在 .env.local 文件中配置！");
      return;
    }

    // 定义地图初始化函数
    const initMap = () => {
      // 确保 DOM 容器存在，并且地图实例尚未被创建
      if (mapContainerRef.current && !mapRef.current) {
        // 创建地图实例
        const map = new window.AMap.Map(mapContainerRef.current, {
          viewMode: '2D',
          zoom: 16,
          center: coordinates,
        });

        // 创建标记
        const marker = new window.AMap.Marker({
          position: coordinates,
          map: map,
        });
        map.add(marker);
        
        // 将创建好的地图实例保存到 ref 中，以便后续访问和销毁
        mapRef.current = map;
      }
    };

    // 检查高德地图 SDK 是否已经加载
    if (window.AMap) {
      // 如果已加载，直接初始化
      initMap();
    } else {
      // 如果未加载，则动态创建 script 标签
      const script = document.createElement('script');
      script.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_JS_API_KEY}`;
      script.async = true;
      // 【关键】当脚本加载完成后，再调用初始化函数
      script.onload = initMap;
      document.head.appendChild(script);
    }
    
    // 【关键的清理逻辑】
    // 这个函数会在组件被卸载时，或者在下一次 useEffect 执行前被调用
    return () => {
      if (mapRef.current) {
        console.log("销毁地图实例...");
        mapRef.current.destroy(); // 调用高德地图的销毁方法
        mapRef.current = null;      // 清空 ref
      }
    };
  }, [coordinates]); // 依赖项现在只有 coordinates，因为地址只用于标记，不影响地图本身

  // 返回一个 div，它将被用作地图的容器
  return (
    <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
  );
};

export default GaodeMapComponent;