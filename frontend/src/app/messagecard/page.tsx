"use client"

import { ArrowLeft, Copy, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useMemo, Suspense } from "react"
import { useTripPlan } from "../context/TripPlanContext"
import { useNavigation } from "../context/NavigationContext"
import { FixedBottomBar } from "../fireflyx_parts/components/FixedBottomBar"

interface TravelParams {
  departure: string
  destination: string
  startDate: string
  endDate: string
  adults: number
  elderly: number
  children: number
  selectedTransport: string
  selectedAccommodation: string
  selectedStyles: string[]
  priceRange: [number, number]
}

function TravelInfoCardContent() {
  const searchParams = useSearchParams()
  const navigation = useNavigation()
  const { getTripPlan } = useTripPlan()
  
  const travelParams = useMemo((): TravelParams => {
    // 优先从TripPlanContext获取数据
    const tripPlanData = getTripPlan()
    
    if (tripPlanData) {
      return {
        departure: tripPlanData.departure,
        destination: tripPlanData.destination,
        startDate: tripPlanData.startDate,
        endDate: tripPlanData.endDate,
        adults: tripPlanData.adults,
        elderly: tripPlanData.elderly,
        children: tripPlanData.children,
        selectedTransport: tripPlanData.selectedTransport,
        selectedAccommodation: tripPlanData.selectedAccommodation,
        selectedStyles: tripPlanData.selectedStyles,
        priceRange: tripPlanData.priceRange as [number, number]
      }
    }
    
    // 如果没有context数据，则从URL参数获取（向后兼容）
    const departure = searchParams.get('departure') || '上海'
    const destination = searchParams.get('destination') || '北京'
    const startDate = searchParams.get('startDate') || '2025.8.24'
    const endDate = searchParams.get('endDate') || '2025.8.26'
    const adults = parseInt(searchParams.get('adults') || '2')
    const elderly = parseInt(searchParams.get('elderly') || '0')
    const children = parseInt(searchParams.get('children') || '1')
    const selectedTransport = searchParams.get('selectedTransport') || 'plane'
    const selectedAccommodation = searchParams.get('selectedAccommodation') || 'hotel'
    const selectedStyles = searchParams.get('selectedStyles')?.split(',').filter(Boolean) || ['文艺']
    const priceRange = searchParams.get('priceRange')?.split(',').map(Number) as [number, number] || [200, 30000]
    
    return {
      departure,
      destination,
      startDate,
      endDate,
      adults,
      elderly,
      children,
      selectedTransport,
      selectedAccommodation,
      selectedStyles,
      priceRange
    }
  }, [searchParams, getTripPlan])

  // 计算总人数
  const totalTravelers = travelParams.adults + travelParams.elderly + travelParams.children
  
  // 计算旅行天数
  const calculateDays = (start: string, end: string) => {
    const startDate = new Date(start.replace(/\./g, '-'))
    const endDate = new Date(end.replace(/\./g, '-'))
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }
  
  const travelDays = calculateDays(travelParams.startDate, travelParams.endDate)
  
  // 获取星期几
  const getWeekday = (dateStr: string) => {
    const date = new Date(dateStr.replace(/\./g, '-'))
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return weekdays[date.getDay()]
  }
  
  // 获取交通方式图标
  const getTransportIcon = (transport: string) => {
    switch (transport) {
      case 'plane':
        return (
          <img src="/Flight.svg" alt="飞机图标" />
        )
      case 'train':
        return (
          <img src="/Train.svg" alt="火车图标" />
        )
      case 'bus':
        return (
          <img src="/Bus.svg" alt="汽车图标" />
        )
      default:
        return (
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
          </svg>
        )
    }
  }
  
  // 获取交通方式名称
  const getTransportName = (transport: string) => {
    switch (transport) {
      case 'plane': return '飞机'
      case 'train': return '火车'
      case 'bus': return '汽车'
      default: return '飞机'
    }
  }
  return (
    <div className="min-h-screen bg-[#f6f8fb] mx-auto relative">
      {/* 顶部白色背景 */}
      <div
        className="absolute top-0 left-0 w-full"
        style={{
          height: "10vh",
          background: "#FFFFFF",
          zIndex: 0,
        }}
      />
      {/* Header */}
      <div className="relative z-10">
        <div className="flex items-center px-4 py-6">
          <button onClick={() => navigation.push("/planning", "backward")}>
            <img
              src="/BackButton2.svg"
              alt="后退图标"
              className="h-12 w-12"
            />
          </button>
          <h1 className="ml-2 text-lg font-medium text-[#000000]">信息卡片</h1>
        </div>

        {/* Main Content */}
        <div className="px-4 space-y-6 pb-32">
          {/* Route Card */}
          <Card className="bg-[#ffffff] p-4 rounded-3xl border-0">
            <div className="space-y-0">
              <h2 className="text-xl font-semibold text-[#000000]">{travelParams.departure}→{travelParams.destination}</h2>
              <p className="text-[#808080] text-sm tracking-wider">SUPERIOR TWIN BED</p>
            </div>
            <Card className="bg-[#ffffff] p-2 rounded-3xl border-0 gap-2">
              {/* Category Icons */}
              <div className="flex justify-center gap-4 flex-wrap">
                {travelParams.selectedStyles.map((style, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-lg flex items-center justify-center">
                      {style === '文艺' && (
                        <img src="/wenyi.svg" alt="文艺图标" className="h-6 w-6" />
                      )}
                      {style === '美食' && (
                        <svg className="w-4 h-4 text-[#0768fd]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.20-1.10-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z" />
                        </svg>
                      )}
                      {style === '自然' && (
                        <svg className="w-4 h-4 text-[#0768fd]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      )}
                      {style === '历史' && (
                        <svg className="w-4 h-4 text-[#0768fd]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                      )}
                      {style === '冒险' && (
                        <svg className="w-4 h-4 text-[#0768fd]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      )}
                      {style === '休闲' && (
                        <svg className="w-4 h-4 text-[#0768fd]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                        </svg>
                      )}
                      {style === '购物' && (
                        <svg className="w-4 h-4 text-[#0768fd]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                        </svg>
                      )}
                      {style === '摄影' && (
                        <svg className="w-4 h-4 text-[#0768fd]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                      )}
                      {style === '运动' && (
                        <svg className="w-4 h-4 text-[#0768fd]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                      )}
                      {style === '文化' && (
                        <svg className="w-4 h-4 text-[#0768fd]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      )}
                      {style === '浪漫' && (
                        <svg className="w-4 h-4 text-[#0768fd]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      )}
                      {style === '家庭' && (
                        <svg className="w-4 h-4 text-[#0768fd]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      )}
                    </div>
                    <span className="text-[#000000] text-xs">{style}</span>
                  </div>
                ))}
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded-lg flex items-center justify-center">
                    {getTransportIcon(travelParams.selectedTransport)}
                  </div>
                  <span className="text-[#000000] text-xs">{getTransportName(travelParams.selectedTransport)}</span>
                </div>
              </div>
              
              {/* Date Section */}
              <div className="border-t border-[#dddddd] pt-4">
                <div className="flex justify-between items-center relative">
                  <div className="flex-1">
                    <p className="text-[#808080] text-sm mb-1">启程时间</p>
                    <p className="text-[#000000] font-medium mt-1">{travelParams.startDate} {getWeekday(travelParams.startDate)}</p>
                  </div>
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-[#0768fd] px-3 py-1 rounded-full text-sm font-medium border-1 flex items-center gap-2">
                    <img src="moon.svg" alt="月亮" />
                    <span>{travelDays}天</span>
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-[#808080] text-sm mb-1">返程时间</p>
                    <p className="text-[#000000] font-medium mt-1">{travelParams.endDate} {getWeekday(travelParams.endDate)}</p>
                  </div>
                </div>
              </div>
              
              {/* Special Requirements */}
              <div className="mt-1 text-center border-t border-[#dddddd] pt-2">
                <p className="text-[#808080] text-sm mb-1">特殊需求</p>
                <p className="text-[#000000]">酒店定无烟房，有轮椅</p>
              </div>
            </Card>

            

            {/* User Profile */}
            <div className="flex items-center justify-between mt-1 pt-4 border-t border-[#dddddd]">
              <div className="flex items-center gap-2">
                <Avatar className="w-12 h-12 bg-[#d9d9d9]">
                  <AvatarFallback className="bg-[#d9d9d9] text-[#808080]">星</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-[#000000] font-medium">用户名</p>
                  <p className="text-[#808080] text-sm">ID: </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <img src="/supervisor_account.svg" alt="人数图标" className="h-6 w-6" />
                <span className="text-[#000000] text-sm">{totalTravelers}人</span>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <div className="flex items-center gap-1">
                <span className="text-[#000000] text-sm">行程码：{/*需要添加行程码参数*/}</span>
                <img src="/content_copy.svg" alt="复制图标" className="h-4 w-4" />
              </div>
            </div>
          </Card>

          {/* Itinerary Code */}
          

          
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <FixedBottomBar>
        <Link href="/fireflyx_parts/trip_payment/details" className="block">
          <Button 
            className="w-full bg-[#0768fd] hover:bg-[#074ee8] text-white h-12 rounded-2xl text-[16px] font-semibold"
            style={{ fontFamily: 'Inter' }}
          >
            开始规划
          </Button>
        </Link>
      </FixedBottomBar>
    </div>
  )
}

export default function TravelInfoCard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f6f8fb] max-w-sm mx-auto flex items-center justify-center">
        <div className="text-[#808080] text-[16px]" style={{ fontFamily: "Inter" }}>
          加载中...
        </div>
      </div>
    }>
      <TravelInfoCardContent />
    </Suspense>
  )
}
