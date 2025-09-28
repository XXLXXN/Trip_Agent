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
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
          </svg>
        )
      case 'train':
        return (
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2c-4 0-8 .5-8 4v10c0 1.1.9 2 2 2h1v3h2v-3h2v3h2v-3h2c1.1 0 2-.9 2-2V6c0-3.5-4-4-8-4zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
          </svg>
        )
      case 'bus':
        return (
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
          </svg>
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
          <Card className="bg-[#ffffff] p-6 rounded-2xl shadow-sm border-0">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-[#000000]">{travelParams.departure}→{travelParams.destination}</h2>
              <p className="text-[#808080] text-sm tracking-wider">SUPERIOR TWIN BED</p>
            </div>

            {/* Category Icons */}
            <div className="flex justify-center gap-8 mt-2">
              {travelParams.selectedStyles.map((style, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 bg-[#ff9141] rounded-lg flex items-center justify-center">
                    {style === '文艺' && (
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
                      </svg>
                    )}
                    {style === '美食' && (
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.20-1.10-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z" />
                      </svg>
                    )}
                    {style === '自然' && (
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    )}
                  </div>
                  <span className="text-[#000000] text-sm">{style}</span>
                </div>
              ))}
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 bg-[#ff9141] rounded-lg flex items-center justify-center">
                  {getTransportIcon(travelParams.selectedTransport)}
                </div>
                <span className="text-[#000000] text-sm">{getTransportName(travelParams.selectedTransport)}</span>
              </div>
            </div>

            {/* Date Section */}
            <div className="border-t border-[#dddddd] mt-2 pt-8">
              <div className="flex justify-between items-center relative">
                <div className="flex-1">
                  <p className="text-[#808080] text-sm mb-2">启程时间</p>
                  <p className="text-[#000000] font-medium mt-1">{travelParams.startDate} {getWeekday(travelParams.startDate)}</p>
                </div>
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#0768fd] text-white px-3 py-1 rounded-full text-sm font-medium">
                  {travelDays}天
                </div>
                <div className="flex-1 text-right">
                  <p className="text-[#808080] text-sm mb-2">返程时间</p>
                  <p className="text-[#000000] font-medium mt-1">{travelParams.endDate} {getWeekday(travelParams.endDate)}</p>
                </div>
              </div>
            </div>

            {/* Special Requirements */}
            <div className="mt-2 text-center">
              <p className="text-[#808080] text-sm mb-2">特殊需求</p>
              <p className="text-[#000000]">酒店定无烟房，有轮椅</p>
            </div>

            {/* User Profile */}
            <div className="flex items-center justify-between mt-2 pt-6 border-t border-[#dddddd]">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12 bg-[#d9d9d9]">
                  <AvatarFallback className="bg-[#d9d9d9] text-[#808080]">星</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-[#000000] font-medium">星韦沪</p>
                  <p className="text-[#808080] text-sm">ID: 3******904</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-5 h-5 text-[#83b4fe]" />
                <span className="text-[#000000] text-sm">{totalTravelers}人</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#808080] text-sm">NO. 03</span>
              <div className="flex items-center gap-2">
                <span className="text-[#000000] text-sm">行程码：776476467276</span>
                <Copy className="w-4 h-4 text-[#83b4fe]" />
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
