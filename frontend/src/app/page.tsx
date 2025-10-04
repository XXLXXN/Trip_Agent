"use client";

import React, { useState, useEffect } from "react";
import NearbyPlaceCard from "@/components/NearbyPlaceCard";
import DestinationCard from "@/components/DestinationCard";
import BottomNav from "@/components/BottomNav";
import { nearbyPlaces, destinations } from "@/mockData/HomePage.js";
import Link from "next/link";

// 位置信息类型定义
interface LocationData {
  latitude: number;
  province: string;
  longitude: number;
  city: string;
  country: string;
  isp: string;
  source: string;
}

interface AddressData {
  full_address: string;
  city: string;
  country: string;
  components: any;
  street?: string;
  province?: string;
  neighbourhood?: string;
  county?: string;
  postcode?: string;
}

export default function Home() {
  const [mainLocation, setMainLocation] = useState("定位中...");
  const [currentLocation, setCurrentLocation] = useState("定位中...");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 通过IP获取位置信息的函数
  const getLocationByIp = async (): Promise<LocationData | null> => {
    try {
      const services = [
        'http://ip-api.com/json/?lang=zh-CN',
        'https://ipapi.co/json/',
        'http://www.geoplugin.net/json.gp'
      ];

      for (const service of services) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          const response = await fetch(service, { 
            signal: controller.signal 
          });
          clearTimeout(timeoutId);

          if (response.ok) {
            const data = await response.json();

            if (service.includes('ip-api.com') && data.status === 'success') {
              return {
                latitude: data.lat,
                longitude: data.lon,
                city: data.city,    
                province: data.regionName,
                country: data.country,
                isp: data.isp,
                source: 'ip-api.com'
              };
            } else if (service.includes('ipapi.co')) {
              return {
                latitude: data.latitude,
                longitude: data.longitude,
                city: data.city,
                province: data.regionName,
                country: data.country_name,
                isp: data.org,
                source: 'ipapi.co'
              };
            } else if (service.includes('geoplugin.net')) {
              return {
                latitude: parseFloat(data.geoplugin_latitude),
                longitude: parseFloat(data.geoplugin_longitude),
                city: data.geoplugin_city,
                province: data.regionName,
                country: data.geoplugin_countryName,
                isp: '未知',
                source: 'geoplugin'
              };
            }
          }
        } catch (error) {
          console.log(`服务 ${service} 失败:`, error);
          continue;
        }
      }

      throw new Error('所有IP地理位置服务均不可用');
    } catch (error) {
      console.error('获取IP位置时出错:', error);
      return null;
    }
  };

  // 通过经纬度获取详细地址的函数
  const getDetailedAddress = async (latitude: number, longitude: number): Promise<AddressData | null> => {
    const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;
    
    if (!apiKey) {
      console.error('OpenCage API密钥未配置');
      return null;
    }

    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=${apiKey}&language=zh&pretty=1`;

    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();

        if (data.status.code === 200 && data.results.length > 0) {
          const result = data.results[0];
          const address = result.formatted;
          const components = result.components;
          
          // 从地址组件中提取城市和国家
          const street = components.roadnum || '';
          const city = components.city || components.town || components.village || components.county || '';
          const province = components.state || components.province || components.region || components.territory || '';
          const country = components.country || '';
          const postcode = components.postcode || '';
          const neighbourhood = components.neighbourhood || components.suburb || components.village || components.city || '';
          
          console.log('完整地址:', address);
          console.log('城市:', city, '国家:', country);
          
          return {
            full_address: address,
            neighbourhood: neighbourhood,
            street: street,
            city: city,
            province: province,
            country: country,
            postcode: postcode,
            components: components 
          };
        } else {
          throw new Error('无法获取地址信息');
        }
      } else {
        throw new Error(`OpenCage API请求失败，状态码: ${response.status}`);
      }
    } catch (error) {
      console.error('获取详细地址时出错:', error);
      return null;
    }
  };

  // 统一的位置信息处理函数
  const processLocationData = async (lat: number, lon: number, source: string) => {
    try {
      setLatitude(lat);
      setLongitude(lon);
      
      // 首先尝试获取详细地址信息
      const addressInfo = await getDetailedAddress(lat, lon);
      
      if (addressInfo) {
        setMainLocation(`${addressInfo.province}, ${addressInfo.country}`);
        
        if (addressInfo.full_address) {
          const addressParts = addressInfo.full_address.split(',').map(part => part.trim());
          
          // 根据地址长度决定取多少个字段
          let locationText = '';
          if (addressParts.length >= 2) {
            // 取最后两个字段，这样显示更具体
            locationText = addressParts.slice(-1).join(', ');
          } else if (addressParts.length === 1) {
            // 只有一个字段时直接使用
            locationText = addressParts[0];
          } else {
            // 没有字段时使用备选方案
            locationText =  addressInfo.street || '未知位置';
          }
          
          setCurrentLocation(locationText);
        } else {
          // 回退到原来的逻辑
          setCurrentLocation(`${addressInfo.street}, ${addressInfo.neighbourhood}`);
        }
      } else {
        // 如果获取详细地址失败，回退到IP定位信息
        const ipLocation = await getLocationByIp();
        if (ipLocation) {
          setMainLocation(`${ipLocation.province}, ${ipLocation.country}`);
          setCurrentLocation(`${ipLocation.city}`);
        } else {
          throw new Error('无法获取位置信息');
        }
      }
    } catch (error) {
      console.error('处理位置数据时出错:', error);
      throw error;
    }
  };

  // 使用浏览器定位
  const getBrowserLocation = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            await processLocationData(latitude, longitude, 'browser');
            resolve(true);
          } catch (error) {
            console.error('浏览器定位处理失败:', error);
            resolve(false);
          }
        },
        (error) => {
          console.warn('浏览器定位失败:', error);
          resolve(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  };

  // 使用IP定位
  const getIPLocation = async (): Promise<boolean> => {
    try {
      const locationInfo = await getLocationByIp();
      if (locationInfo) {
        await processLocationData(locationInfo.latitude, locationInfo.longitude, 'ip');
        return true;
      }
      return false;
    } catch (error) {
      console.error('IP定位失败:', error);
      return false;
    }
  };

  // 使用默认位置
  const useDefaultLocation = () => {
    const defaultLat = 39.90873966065374;
    const defaultLon = 116.3974673500868;
    setLatitude(defaultLat);
    setLongitude(defaultLon);
    setMainLocation("北京, 中国");
    setCurrentLocation("北京市东城区天安门广场");
    setIsLoading(false);
  };

  // 统一的位置获取函数
  const fetchLocation = async () => {
    setIsLoading(true);
    
    try {
      // 首先尝试浏览器定位
      const browserSuccess = await getBrowserLocation();
      
      if (!browserSuccess) {
        // 浏览器定位失败，尝试IP定位
        const ipSuccess = await getIPLocation();
        
        if (!ipSuccess) {
          // 所有定位方式都失败，使用默认位置
          useDefaultLocation();
        }
      }
    } catch (error) {
      console.error('获取位置信息失败:', error);
      useDefaultLocation();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  // 手动刷新位置
  const refreshLocation = async () => {
    setIsLoading(true);
    setMainLocation("定位中...");
    setCurrentLocation("定位中...");
    
    await fetchLocation();
  };  
  return (
    <main className="min-h-screen bg-white">
      {/* 顶部区域 */}
      <div className="grid w-full h-39">
        {/* 顶部渐变背景 */}
        <div className="bg-[url('/Home_Top.svg')] h-31 bg-cover bg-center grid grid-cols-1 gap-y-4 pt-[5px]">
          {/* 状态栏占位 */}
          <div className="h-12"></div>
          {/* 位置信息 */}
          <div className="px-4 h-[54px] flex py-2">
            <div className="text-white flex-1">
              <p className="text-[10px] uppercase tracking-wide">
                美好的旅程始于现在
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <h1 className="text-xl font-semibold">
                    {isLoading ? "定位中..." : mainLocation}
                  </h1>
                </div>
              </div>
            </div>
            <Link href="/fireflyx_parts/interactive">
              <button className="bg-[#E4F1FF] backdrop-blur-lg rounded-full px-4 py-3 text-sm font-semibold flex items-center justify-center text-[#2065A9]">
                联系客服
              </button>
            </Link>
          </div>
        </div>
      </div>
      {/* 旅游规划提示 */}
      <section className="h-29 felx px-4">
        <Link href="/planning">
          <div className="bg-[url('/HomePage/TripPlan_Placeholder.jpg')] bg-cover rounded-xl h-full ">
            <h3 className="text-base font-semibold text-[#1E1E1E] pt-4 pl-4 mb-1">
              旅游规划
            </h3>
            <p className="text-xs text-[#8C8C8C] pl-4">点击开启美好旅程</p>
          </div>
        </Link>
      </section>
      {/* 主要内容区域 */}
      <section className="h-116 flex flex-col gap-4">
        {/* 当前规划区域 */}
        <section className="pt-7 px-4">
          <div className="flex mb-4 justify-between flex-grow h-[34px]">
            <div className="flex items-center py-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.791 3.1153L3.55767 8.23196C2.86601 8.52363 2.88267 9.50696 3.57434 9.77363L8.02434 11.4986C8.24101 11.582 8.41601 11.757 8.49934 11.9736L10.216 16.4153C10.4827 17.1153 11.4743 17.132 11.766 16.4403L16.891 4.2153C17.166 3.52363 16.4743 2.83196 15.791 3.1153Z"
                  fill="#FF9141"
                />
              </svg>

              <h2 className="text-sm font-semibold text-[#1B1446] pl-1">当前</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-col items-end">
                <div className="text-[10px] text-[#808080] text-right uppercase tracking-wide">
                  当前位置
                </div>
                <div className="flex items-center">
                  <div className="text-xs font-semibold text-[#1B1446]">
                    {currentLocation}
                  </div>
                </div>
              </div>
              <button 
                className="bg-[#0768FD]/10 rounded-lg h-full px-[2px]"
                onClick={refreshLocation}
                disabled={isLoading}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_1_1313)">
                    <path
                      d="M8.00002 5.33329C6.52669 5.33329 5.33335 6.52663 5.33335 7.99996C5.33335 9.47329 6.52669 10.6666 8.00002 10.6666C9.47335 10.6666 10.6667 9.47329 10.6667 7.99996C10.6667 6.52663 9.47335 5.33329 8.00002 5.33329ZM13.96 7.33329C13.6534 4.55329 11.4467 2.34663 8.66669 2.03996V1.33329C8.66669 0.966626 8.36669 0.666626 8.00002 0.666626C7.63335 0.666626 7.33335 0.966626 7.33335 1.33329V2.03996C4.55335 2.34663 2.34669 4.55329 2.04002 7.33329H1.33335C0.966687 7.33329 0.666687 7.63329 0.666687 7.99996C0.666687 8.36663 0.966687 8.66663 1.33335 8.66663H2.04002C2.34669 11.4466 4.55335 13.6533 7.33335 13.96V14.6666C7.33335 15.0333 7.63335 15.3333 8.00002 15.3333C8.36669 15.3333 8.66669 15.0333 8.66669 14.6666V13.96C11.4467 13.6533 13.6534 11.4466 13.96 8.66663H14.6667C15.0334 8.66663 15.3334 8.36663 15.3334 7.99996C15.3334 7.63329 15.0334 7.33329 14.6667 7.33329H13.96ZM8.00002 12.6666C5.42002 12.6666 3.33335 10.58 3.33335 7.99996C3.33335 5.41996 5.42002 3.33329 8.00002 3.33329C10.58 3.33329 12.6667 5.41996 12.6667 7.99996C12.6667 10.58 10.58 12.6666 8.00002 12.6666Z"
                      fill="#0768FD"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1_1313">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </button>
            </div>
          </div>
          <Link href="fireflyx_parts/current">
            <div className="space-y-3">
              {nearbyPlaces.map((place, index) => (
                <NearbyPlaceCard key={index} {...place} />
              ))}
            </div>
          </Link>
        </section>

        {/* 推荐目的地区域 */}
        <section className="px-4 h-65">
          {/* 好地推荐标题与按钮 */}
          <div className="flex items-center justify-between h-6 mb-4">
            {/* 好地推荐与图标 */}
            <div className="flex items-center gap-1 flex-grow">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.8333 1.42395H4.16667C3.25 1.42395 2.5 2.17395 2.5 3.09062V14.7573C2.5 15.674 3.25 16.424 4.16667 16.424H7.5L9.40833 18.3323C9.73333 18.6573 10.2583 18.6573 10.5833 18.3323L12.5 16.424H15.8333C16.75 16.424 17.5 15.674 17.5 14.7573V3.09062C17.5 2.17395 16.75 1.42395 15.8333 1.42395ZM11.5667 10.4906L10 13.924L8.43333 10.4906L5 8.92395L8.43333 7.35728L10 3.92395L11.5667 7.35728L15 8.92395L11.5667 10.4906Z"
                  fill="#FF9141"
                />
              </svg>

              <h2 className="text-[14px] font-semibold text-[#1B1B446]">
                好地推荐
              </h2>
            </div>

            <button className="bg-[#0768FD]/10 rounded-full px-2 h-full flex items-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.00002 6.71063C8.61002 7.10063 8.61002 7.73063 9.00002 8.12063L12.88 12.0006L9.00002 15.8806C8.61002 16.2706 8.61002 16.9006 9.00002 17.2906C9.39002 17.6806 10.02 17.6806 10.41 17.2906L15 12.7006C15.39 12.3106 15.39 11.6806 15 11.2906L10.41 6.70063C10.03 6.32063 9.39002 6.32063 9.00002 6.71063Z"
                  fill="#0768FD"
                />
              </svg>
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {destinations.map((destination, index) => (
              <DestinationCard key={index} {...destination} />
            ))}
          </div>
        </section>
      </section>

      {/* 底部导航栏 */}
      <BottomNav />
    </main>
  );
}