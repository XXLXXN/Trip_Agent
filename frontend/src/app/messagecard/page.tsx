"use client"

import { ArrowLeft, Copy, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useMemo } from "react"

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

export default function TravelInfoCard() {
  const searchParams = useSearchParams()
  
  const travelParams = useMemo((): TravelParams => {
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
  }, [searchParams])

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
    <div className="min-h-screen bg-[#f6f8fb] max-w-sm mx-auto relative">
      {/* 顶部1/4蓝色背景 */}
      <div
        className="absolute top-0 left-0 w-full"
        style={{
          height: "25vh",
          background: "#FFFFFF",
          zIndex: 0,
        }}
      />
      {/* Header */}
      <div className="relative z-10">
        <div className="flex items-center px-4 py-6">
          <Link href="/planning">
            <img
              src="/BackButton2.svg"
              alt="后退图标"
              className="h-12 w-12"
            />
          </Link>
          <h1 className="ml-2 text-lg font-medium text-[#000000]">信息卡片</h1>
        </div>

        {/* Main Content */}
        <div className="px-4 space-y-6">
          {/* Route Card */}
          <Card className="bg-[#ffffff] p-5 rounded-2xl shadow-sm border-0">
            <div className="space-y-0">
              <h2 className="text-xl font-semibold text-[#000000]">{travelParams.departure}→{travelParams.destination}</h2>
              <p className="text-[#808080] text-sm tracking-wider">SUPERIOR TWIN BED</p>
            </div>
            {/* Category Icons */}
            <div className="flex justify-center gap-6 mt-1">
              {travelParams.selectedStyles.map((style, index) => (
                <div key={index} className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                    {style === '文艺' && (
                      <img src="/wenyi.svg" alt="文艺图标" className="h-6 w-6" />
                    )}
                    {style === '美食' && (
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.20-1.10-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z" />
                      </svg>
                    )}{/* 后续要替换 */}
                    {style === '自然' && (
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    )}{/* 后续要替换 */}
                  </div>
                  <span className="text-[#000000] text-sm">{style}</span>
                </div>
              ))}
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                  {getTransportIcon(travelParams.selectedTransport)}
                </div>
                <span className="text-[#000000] text-sm">{getTransportName(travelParams.selectedTransport)}</span>
              </div>
            </div>

            {/* Date Section */}
            <div className="border-t border-[#dddddd] mt-1 pt-4">
              <div className="flex justify-between items-center relative">
                <div className="flex-1">
                  <p className="text-[#808080] text-sm mb-1">启程时间</p>
                  <p className="text-[#000000] font-medium mt-1">{travelParams.startDate} {getWeekday(travelParams.startDate)}</p>
                </div>
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#0768fd] text-white px-3 py-1 rounded-full text-sm font-medium">
                  {travelDays}天
                </div>
                <div className="flex-1 text-right">
                  <p className="text-[#808080] text-sm mb-1">返程时间</p>
                  <p className="text-[#000000] font-medium mt-1">{travelParams.endDate} {getWeekday(travelParams.endDate)}</p>
                </div>
              </div>
            </div>

            {/* Special Requirements */}
            <div className="mt-1 text-center">
              <p className="text-[#808080] text-sm mb-1">特殊需求</p>
              <p className="text-[#000000]">酒店定无烟房，有轮椅</p>
            </div>

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
          

          {/* CTA Button */}
          <div className="pb-8">
            <Link href="/fireflyx_parts/current">
              <Button className="w-full bg-[#0768fd] hover:bg-[#074ee8] text-white py-4 rounded-2xl text-lg font-medium">
                开始规划
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
