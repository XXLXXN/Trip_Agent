"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Plane,
  Train,
  Bus,
  Building,
  IterationCw as Attractions,
  MoreHorizontal,
  Minus,
  Plus,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTripPlan, TripPlanData } from "../context/TripPlanContext";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { AnimatePresence, motion } from "framer-motion";
import { zhCN } from "date-fns/locale";

export default function TravelPlanningPage() {
  const [priceRange, setPriceRange] = useState([100, 10000]);
  const [adultCount, setAdultCount] = useState(2);
  const [studentCount, setStudentCount] = useState(1);
  const [selectedTransport, setSelectedTransport] = useState("plane");
  const [selectedAccommodation, setSelectedAccommodation] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showTravelerModal, setShowTravelerModal] = useState(false);
  const [showMoreModal, setShowMoreModal] = useState(false);
  const [editingField, setEditingField] = useState<
    "departure" | "destination" | "startDate" | "endDate" | "minPrice" | "maxPrice" | null
  >(null);

  const [departure, setDeparture] = useState("上海");
  const [destination, setDestination] = useState("北京");
  const [startDate, setStartDate] = useState("2025.8.24");
  const [endDate, setEndDate] = useState("2025.9.15");
  const [dateError, setDateError] = useState<string | null>(null);
  const [tempSelectedDate, setTempSelectedDate] = useState<Date | undefined>(undefined);
  const [tempStartDate, setTempStartDate] = useState<Date | undefined>(undefined);
  const [tempEndDate, setTempEndDate] = useState<Date | undefined>(undefined);
  const [currentDisplayMonth, setCurrentDisplayMonth] = useState<Date>(new Date());
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  // 点击外部关闭年份下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showYearDropdown && !target.closest('[data-year-dropdown]')) {
        setShowYearDropdown(false);
      }
    };

    if (showYearDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showYearDropdown]);

  const [adults, setAdults] = useState(2);
  const [elderly, setElderly] = useState(0);
  const [children, setChildren] = useState(1);
  const [students, setStudents] = useState(0);
  const [additionalRequirements, setAdditionalRequirements] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { saveTripPlan } = useTripPlan();

  const toggleStyle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const toggleTransport = (transport: string) => {
    setSelectedTransport(selectedTransport === transport ? "" : transport);
  };

  const toggleAccommodation = (accommodation: string) => {
    setSelectedAccommodation((prev) =>
      prev.includes(accommodation) 
        ? prev.filter((item) => item !== accommodation)
        : [...prev, accommodation]
    );
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 准备要发送的数据
      const tripData = {
        departure,
        destination,
        startDate,
        endDate,
        adults,
        elderly,
        children,
        priceRange,
        selectedTransport,
        selectedAccommodation,
        selectedStyles,
        additionalRequirements,
      };

      // 发送数据到API路由
      const response = await fetch("/api/trip-planning", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tripData),
      });

      if (!response.ok) {
        let errorMessage = `请求失败: ${response.status}`;
        try {
          const errorData = await response.json();
          console.error("API响应错误:", errorData);
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          console.error("解析错误响应失败:", parseError);
          // 如果无法解析JSON，使用状态文本
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("API响应结果:", result);

      // 检查响应格式是否正确
      if (result.success && result.data) {
        // 使用规范的存储方式保存数据
        const tripPlanData: TripPlanData = {
          departure,
          destination,
          startDate,
          endDate,
          adults,
          elderly,
          children,
          priceRange,
          selectedTransport,
          selectedAccommodation: selectedAccommodation.join(","),
          selectedStyles,
          additionalRequirements,
          backendData: result.data,
          // 直接保存景点推荐数据
          spotRecommendations: result.data,
        };

        saveTripPlan(tripPlanData);
        router.push("/spotslist"); // 跳转到结果页面
      } else {
        throw new Error(result.message || "服务器返回数据格式不正确");
      }
    } catch (err) {
      console.error("提交失败:", err);
      setError(err instanceof Error ? err.message : "未知错误，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationEdit = (field: "departure" | "destination") => {
    setEditingField(field);
    setShowLocationModal(true);
  };

  const handleDateEdit = (field: "startDate" | "endDate") => {
    setEditingField(field);
    // 预选中当前值
    const start = parseDateString(startDate);
    const end = parseDateString(endDate);
    setTempStartDate(start);
    setTempEndDate(end);
    setDateError(null);
    setShowDateModal(true);
  };

  const handleLocationSave = (value: string) => {
    if (editingField === "departure") {
      setDeparture(value);
    } else if (editingField === "destination") {
      setDestination(value);
    }
    setShowLocationModal(false);
    setEditingField(null);
  };

  const handleDateSave = () => {
    if (!tempStartDate || !tempEndDate) return;
    const startFormatted = formatDate(tempStartDate);
    const endFormatted = formatDate(tempEndDate);
    
    setStartDate(startFormatted);
    setEndDate(endFormatted);
    setShowDateModal(false);
    setTempStartDate(undefined);
    setTempEndDate(undefined);
  };

  function parseDateString(input: string): Date | undefined {
    // 期望格式: YYYY.M.DD 或 YYYY.MM.DD
    const parts = input.split(".");
    if (parts.length !== 3) return undefined;
    const [y, m, d] = parts.map((p) => parseInt(p, 10));
    if (!y || !m || !d) return undefined;
    const dt = new Date(y, m - 1, d);
    return isNaN(dt.getTime()) ? undefined : dt;
  }

  function formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}.${m}.${d}`;
  }

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const startDateObj = useMemo(() => parseDateString(startDate), [startDate]);

  const handleTravelerSave = () => {
    setAdultCount(adults);
    setStudentCount(children);
    setShowTravelerModal(false);
  };

  const handlePriceEdit = (field: "minPrice" | "maxPrice") => {
    setEditingField(field);
  };

  const handlePriceSave = (value: number, field: "minPrice" | "maxPrice") => {
    const newValue = Math.max(100, Math.min(50000, value));
    if (field === "minPrice") {
      setPriceRange([newValue, Math.max(newValue, priceRange[1])]);
    } else {
      setPriceRange([Math.min(priceRange[0], newValue), newValue]);
    }
    setEditingField(null);
  };

  const formatPrice = (price: number) => {
    if (price >= 20000) return `¥${price}`;
    return `¥${price}`;
  };

  const getTravelerText = () => {
    const parts = [];
    if (adults > 0) parts.push(`${adults}成人`);
    if (elderly > 0) parts.push(`${elderly}老人`);
    if (children > 0) parts.push(`${children}儿童`);
    if (students > 0) parts.push(`${students}学生`);
    return parts.join("，");
  };

  return (
    <div className="min-h-screen bg-[#f6f8fb] mx-auto relative">
      {/* 顶部1/5蓝色背景 */}
      <div
        className="absolute top-0 left-0 w-full"
        style={{
          height: "20vh",
          background: "#0768fd",
          zIndex: 0,
        }}
      />
      {/* Header 和主内容区加上相对定位，确保在蓝色背景之上 */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center px-4 py-6">
          <Link href="/">
            <img src="/BackButton.svg" alt="后退图标" className="h-12 w-12" />
          </Link>
          <h1 className="ml-2 text-lg font-medium text-[#FFFFFF]">旅游规划</h1>
        </div>

        {/* Main Content */}
        <div className="px-3 space-y-4">
          <div className="bg-[#ffffff] rounded-3xl p-4 border-0">
            <div className="space-y-4">
              {/* Location Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-2 bg-[#f6f8fb] rounded-3xl">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center">
                      <img src="/location_on.svg" alt="出发图标" className="h-12 w-12 ml-2" />
                    </div>
                    <div>
                      <p className="text-sm text-[#808080]">出发地</p>
                      <p className="font-medium text-[#000000]">{departure}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-[#0768fd] mr-2"
                    onClick={() => handleLocationEdit("departure")}
                  >
                    <div className="w-8 h-8 flex items-center justify-center">
                      <img
                        src="_ form action.svg"
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                  </Button>
                </div>

                <div className="flex items-center justify-between p-2 bg-[#f6f8fb] rounded-3xl">
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center">
                      <img src="/Vector.svg" alt="目的地图标" className="h-12 w-12 ml-3" />
                    </div>
                    <div>
                      <p className="text-sm text-[#808080]">目的地</p>
                      <p className="font-medium text-[#000000]">
                        {destination}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-[#0768fd] mr-2"
                    onClick={() => handleLocationEdit("destination")}
                  >
                    <div className="w-8 h-8 flex items-center justify-center">
                      <img
                        src="_ form action.svg"
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                  </Button>
                </div>
              </div>

              {/* Date Selection */}
              <div className="bg-[#f6f8fb] rounded-3xl overflow-hidden">
                <div className="flex">
                  {/* 共享的图标区域 - 与地点卡片对齐 */}
                  <div className="flex items-center justify-center pl-2 pr-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center">
                      <img src="/date_range.svg" alt="日历图标" className="h-12 w-12" />
                    </div>
                  </div>

                  {/* 右侧内容区域 */}
                  <div className="flex-1">
                    {/* 启程日期 */}
                    <div className="flex items-center justify-between py-1 pr-4">
                      <div className="flex-1">
                        <p className="text-sm text-[#808080]">启程日期</p>
                        <p className="font-medium text-[#000000]">{startDate}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-[#0768fd]"
                        onClick={() => handleDateEdit("startDate")}
                      >
                        <div className="w-7 h-7 flex items-center justify-center">
                          <img
                            src="_ form action2.svg"
                            className="w-8 h-8 object-contain"
                          />
                        </div>
                      </Button>
                    </div>

                    {/* 分割线 */}
                    <div className="border-t border-[#e0e0e0] mr-3"></div>

                    {/* 返程日期 */}
                    <div className="flex items-center justify-between py-1 pr-4">
                      <div className="flex-1">
                        <p className="text-sm text-[#808080]">返程日期</p>
                        <p className="font-medium text-[#000000]">{endDate}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-[#0768fd]"
                        onClick={() => handleDateEdit("endDate")}
                      >
                        <div className="w-7 h-7 flex items-center justify-center">
                          <img
                            src="_ form action2.svg"
                            className="w-8 h-8 object-contain"
                          />
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Traveler Count */}
              <div className="flex items-center justify-between p-2 bg-[#f6f8fb] rounded-3xl">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center">
                    <img src="/supervisor_account.svg" alt="人数图标" className="h-12 w-12 ml-2" />
                  </div>
                  <div>
                    <p className="text-sm text-[#808080]">出行人数</p>
                    <p className="font-medium text-[#000000]">
                      {getTravelerText()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#0768fd] mr-2"
                  onClick={() => setShowTravelerModal(true)}
                >
                  <div className="w-8 h-8 flex items-center justify-center">
                    <img
                      src="_ form action.svg"
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                </Button>
              </div>

              {/* Price Range */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  {editingField === "minPrice" ? (
                    <Input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        setPriceRange([value, priceRange[1]]);
                      }}
                      onBlur={() => {
                        // 输入完成后进行大小判断
                        const minValue = Math.min(priceRange[0], priceRange[1]);
                        const maxValue = Math.max(priceRange[0], priceRange[1]);
                        setPriceRange([minValue, maxValue]);
                        setEditingField(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          // 输入完成后进行大小判断
                          const minValue = Math.min(priceRange[0], priceRange[1]);
                          const maxValue = Math.max(priceRange[0], priceRange[1]);
                          setPriceRange([minValue, maxValue]);
                          setEditingField(null);
                        }
                      }}
                      className="px-3 py-1 bg-[#83b4fe] text-white rounded-full text-sm border-0 text-center w-20"
                      min="100"
                      max="50000"
                      autoFocus
                    />
                  ) : (
                    <button
                      className="px-3 py-1 bg-[#83b4fe] text-white rounded-full text-sm hover:bg-[#0768fd] transition-colors"
                      onClick={() => handlePriceEdit("minPrice")}
                    >
                      {formatPrice(priceRange[0])}
                    </button>
                  )}

                  {editingField === "maxPrice" ? (
                    <Input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        setPriceRange([priceRange[0], value]);
                      }}
                      onBlur={() => {
                        // 输入完成后进行大小判断
                        const minValue = Math.min(priceRange[0], priceRange[1]);
                        const maxValue = Math.max(priceRange[0], priceRange[1]);
                        setPriceRange([minValue, maxValue]);
                        setEditingField(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          // 输入完成后进行大小判断
                          const minValue = Math.min(priceRange[0], priceRange[1]);
                          const maxValue = Math.max(priceRange[0], priceRange[1]);
                          setPriceRange([minValue, maxValue]);
                          setEditingField(null);
                        }
                      }}
                      className="px-3 py-1 bg-[#83b4fe] text-white rounded-full text-sm border-0 text-center w-20"
                      min="100"
                      max="50000"
                      autoFocus
                    />
                  ) : (
                    <button
                      className="px-3 py-1 bg-[#83b4fe] text-white rounded-full text-sm hover:bg-[#0768fd] transition-colors"
                      onClick={() => handlePriceEdit("maxPrice")}
                    >
                      {formatPrice(priceRange[1])}
                    </button>
                  )}
                </div>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={priceRange[1] >= 20000 ? priceRange[1] : 20000}
                  min={100}
                  step={100}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="px-3 py-3 space-y-4">
          <div className="border-0">
            <div className="space-y-4">
              {/* Transportation Preferences */}
              <div className="space-y-3">
                <h3 className="font-medium text-[#000000] ml-2">交通偏好</h3>
                <div className="flex gap-3">
                  <Button
                    variant={
                      selectedTransport === "train" ? "default" : "outline"
                    }
                    className={`flex-1 flex items-center gap-2 py-6 rounded-2xl border-2 ${
                      selectedTransport === "train"
                        ? "border-[#0768fd] text-[#000000] bg-white hover:bg-gray-50"
                        : "border-transparent bg-white text-[#000000] hover:border-gray-300"
                    }`}
                    onClick={() => toggleTransport("train")}
                  >
                    <img src="/Train.svg" alt="火车图标" className="h-10 w-10" />
                    火车
                  </Button>
                  <Button
                    variant={
                      selectedTransport === "bus" ? "default" : "outline"
                    }
                    className={`flex-1 flex items-center gap-2 py-6 rounded-2xl border-2 ${
                      selectedTransport === "bus"
                        ? "border-[#0768fd] text-[#000000] bg-white hover:bg-gray-50"
                        : "border-transparent bg-white text-[#000000] hover:border-gray-300"
                    }`}
                    onClick={() => toggleTransport("bus")}
                  >
                    <img src="/Bus.svg" alt="汽车图标" className="h-10 w-10" />
                    汽车
                  </Button>
                  <Button
                    variant={
                      selectedTransport === "plane" ? "default" : "outline"
                    }
                    className={`flex-1 flex items-center gap-2 py-6 rounded-2xl border-2 ${
                      selectedTransport === "plane"
                        ? "border-[#0768fd] text-[#000000] bg-white hover:bg-gray-50"
                        : "border-transparent bg-white text-[#000000] hover:border-gray-300"
                    }`}
                    onClick={() => toggleTransport("plane")}
                  >
                    <img src="/Flight.svg" alt="飞机图标" className="h-10 w-10" />
                    飞机
                  </Button>
                </div>
              </div>

              {/* Booking Preferences */}
              <div className="space-y-3">
                <h3 className="font-medium text-[#000000] ml-2">预算偏好</h3>
                <div className="flex gap-3">
                  <Button
                    variant={
                      selectedAccommodation.includes("hotel") ? "default" : "outline"
                    }
                    className={`flex-1 flex items-center gap-2 py-6 rounded-2xl border-2 ${
                      selectedAccommodation.includes("hotel")
                        ? "border-[#0768fd] text-[#000000] bg-white hover:bg-gray-50"
                        : "border-transparent bg-white text-[#000000] hover:border-gray-300"
                    }`}
                    onClick={() => toggleAccommodation("hotel")}
                  >
                    <img src="/Hotel.svg" alt="酒店图标" className="h-10 w-10" />
                    住宿
                  </Button>
                  <Button
                    variant={
                      selectedAccommodation.includes("attractions")
                        ? "default"
                        : "outline"
                    }
                    className={`flex-1 flex items-center gap-2 py-6 rounded-2xl border-2 ${
                      selectedAccommodation.includes("attractions")
                        ? "border-[#0768fd] text-[#000000] bg-white hover:bg-gray-50"
                        : "border-transparent bg-white text-[#000000] hover:border-gray-300"
                    }`}
                    onClick={() => toggleAccommodation("attractions")}
                  >
                    <img
                      src="/Attraction.svg"
                      alt="景点图标"
                      className="h-10 w-10"
                    />
                    景点
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 flex items-center gap-2 py-6 rounded-2xl border-2 border-transparent bg-white text-[#000000] hover:border-gray-300"
                    onClick={() => setShowMoreModal(true)}
                  >
                    <img src="/More.svg" alt="更多图标" className="h-10 w-10" />
                    更多
                  </Button>
                </div>
              </div>

              {/* Travel Style */}
              <div className="space-y-3">
                <h3 className="font-medium text-[#000000] ml-2">旅行风格</h3>
                <div className="grid grid-cols-5 gap-3">
                  {[
                    "文艺", "美食", "自然", "历史", "冒险", "休闲", 
                    "购物", "摄影", "运动", "文化", "浪漫", "家庭"
                  ].map((style) => (
                    <Button
                      key={style}
                      variant="outline"
                      className={`px-3 py-2 rounded-2xl text-sm ${
                        selectedStyles.includes(style)
                          ? "bg-[#0768fd] text-white border-[#0768fd] hover:bg-[#074ee8]"
                          : "bg-white border-[#dddddd] text-[#000000] hover:bg-gray-50"
                      }`}
                      onClick={() => toggleStyle(style)}
                    >
                      {style}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Additional Requirements */}
              <div className="space-y-3">
                <h3 className="font-medium text-[#000000] ml-2">其他需求</h3>
                <Textarea
                  placeholder="请在此输入您其他任何需求"
                  className="min-h-[32px] bg-white border-0 resize-none text-[#000000]"
                  value={additionalRequirements}
                  onChange={(e) => setAdditionalRequirements(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="pb-8 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                <p className="text-red-600 text-sm">{error}</p>
                <Button
                  variant="outline"
                  className="mt-2 w-full text-red-600 border-red-200 hover:bg-red-100"
                  onClick={() => setError(null)}
                >
                  重试
                </Button>
              </div>
            )}

            <Button
              className="w-full bg-[#0768fd] hover:bg-[#074ee8] text-white py-4 rounded-2xl text-lg font-medium"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  处理中...
                </>
              ) : (
                "继续"
              )}
            </Button>
          </div>
        </div>
      </div>

      {showLocationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-[#000000]">
                {editingField === "departure" ? "选择出发地" : "选择目的地"}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowLocationModal(false)}
              >
                <X className="h-5 w-5 text-[#808080]" />
              </Button>
            </div>
            <Input
              placeholder="请输入城市名称"
              defaultValue={
                editingField === "departure" ? departure : destination
              }
              className="mb-4 bg-[#f6f8fb] border-0 text-[#000000]"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleLocationSave(e.currentTarget.value);
                }
              }}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 bg-transparent border-[#dddddd] text-[#000000]"
                onClick={() => setShowLocationModal(false)}
              >
                取消
              </Button>
              <Button
                className="flex-1 bg-[#0768fd] hover:bg-[#074ee8] text-white"
                onClick={() => {
                  const input = document.querySelector(
                    "input"
                  ) as HTMLInputElement;
                  handleLocationSave(input.value);
                }}
              >
                确定
              </Button>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showDateModal && (
          <>
            <motion.div
              key="date-backdrop"
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDateModal(false)}
            />
            <motion.div
              key="date-sheet"
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col"
                style={{ 
                  height: '600px',
                  maxHeight: '90vh'
                }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
              >
                {/* 头部 */}
                <div className="px-6 pt-6 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold text-gray-900">选择日期</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                      onClick={() => setShowDateModal(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    {tempStartDate && tempEndDate 
                      ? `${formatDate(tempStartDate)} - ${formatDate(tempEndDate)}`
                      : tempStartDate 
                      ? formatDate(tempStartDate)
                      : startDate && endDate 
                      ? `${startDate} - ${endDate}`
                      : '请选择启程和返程日期'
                    }
                  </p>
                </div>

                {/* 月份导航 */}
                <div className="flex items-center justify-center px-6 pb-4">
                  <button 
                    className="text-blue-600 text-lg font-medium"
                    onClick={() => {
                      const newDate = new Date(currentDisplayMonth);
                      newDate.setMonth(newDate.getMonth() - 1);
                      setCurrentDisplayMonth(newDate);
                    }}
                  >
                    ‹
                  </button>
                  <div className="flex items-center mx-4 relative">
                    <span className="text-lg font-medium text-gray-900">
                      {`${currentDisplayMonth.getMonth() + 1}月`}
                    </span>
                    <div className="relative ml-2" data-year-dropdown>
                      <button
                        className="flex items-center text-lg font-medium text-gray-900 hover:text-blue-600"
                        onClick={() => setShowYearDropdown(!showYearDropdown)}
                      >
                        {currentDisplayMonth.getFullYear()}
                        <svg className="w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {/* 年份下拉菜单 */}
                      {showYearDropdown && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                          {(() => {
                            const currentYear = new Date().getFullYear();
                            const years = [];
                            for (let year = currentYear - 5; year <= currentYear + 10; year++) {
                              years.push(year);
                            }
                            return years.map((year) => (
                              <button
                                key={year}
                                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                                  year === currentDisplayMonth.getFullYear() ? 'bg-blue-100 text-blue-600' : 'text-gray-900'
                                }`}
                                onClick={() => {
                                  const newDate = new Date(currentDisplayMonth);
                                  newDate.setFullYear(year);
                                  setCurrentDisplayMonth(newDate);
                                  setShowYearDropdown(false);
                                }}
                              >
                                {year}
                              </button>
                            ));
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                  <button 
                    className="text-blue-600 text-lg font-medium"
                    onClick={() => {
                      const newDate = new Date(currentDisplayMonth);
                      newDate.setMonth(newDate.getMonth() + 1);
                      setCurrentDisplayMonth(newDate);
                    }}
                  >
                    ›
                  </button>
                </div>

                {/* 星期标题 */}
                <div className="px-6 pb-2">
                  <div className="grid grid-cols-7 gap-1">
                    {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
                      <div key={day} className="text-center text-xs text-gray-500 font-medium py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 日历网格 */}
                <div className="px-6 pb-4 flex-1 overflow-y-auto">
                  <div className="grid grid-cols-7 gap-1">
                    {(() => {
                      const year = currentDisplayMonth.getFullYear();
                      const month = currentDisplayMonth.getMonth();
                      const firstDay = new Date(year, month, 1);
                      const startDate = new Date(firstDay);
                      startDate.setDate(startDate.getDate() - firstDay.getDay() + 1);
                      
                      const days = [];
                      for (let i = 0; i < 35; i++) {
                        const date = new Date(startDate);
                        date.setDate(startDate.getDate() + i);
                        const isCurrentMonth = date.getMonth() === month;
                        const isToday = date.toDateString() === new Date().toDateString();
                        const isStartDate = tempStartDate && date.toDateString() === tempStartDate.toDateString();
                        const isEndDate = tempEndDate && date.toDateString() === tempEndDate.toDateString();
                        const isInRange = tempStartDate && tempEndDate && 
                          date.getTime() >= tempStartDate.getTime() && 
                          date.getTime() <= tempEndDate.getTime();
                        
                        days.push(
                          <button
                            key={i}
                            className={`
                              w-10 h-10 rounded-lg text-sm font-medium transition-colors relative
                              ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-900 hover:bg-gray-100'}
                              ${isToday ? 'border border-blue-600' : ''}
                              ${isStartDate || isEndDate ? 'bg-blue-600 text-white' : ''}
                              ${isInRange && !isStartDate && !isEndDate ? 'bg-blue-100 text-blue-600' : ''}
                            `}
                            onClick={() => {
                              setDateError(null);
                              const picked = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                              
                              if (picked.getTime() < today.getTime()) {
                                setDateError("日期不能早于今天");
                                return;
                              }
                              
                              if (!tempStartDate) {
                                // 选择启程日期
                                setTempStartDate(picked);
                                setTempEndDate(undefined);
                              } else if (!tempEndDate) {
                                // 选择返程日期
                                if (picked.getTime() < tempStartDate.getTime()) {
                                  // 如果选择的日期早于启程日期，交换它们
                                  setTempEndDate(tempStartDate);
                                  setTempStartDate(picked);
                                } else {
                                  setTempEndDate(picked);
                                }
                              } else {
                                // 重新选择启程日期
                                setTempStartDate(picked);
                                setTempEndDate(undefined);
                              }
                            }}
                          >
                            {date.getDate()}
                            {isInRange && !isStartDate && !isEndDate && (
                              <div className="absolute inset-0 bg-blue-100 rounded-lg -z-10"></div>
                            )}
                          </button>
                        );
                      }
                      return days;
                    })()}
                  </div>
                </div>

                {dateError && (
                  <div className="px-6 pb-2">
                    <p className="text-red-600 text-sm">{dateError}</p>
                  </div>
                )}

                {/* 确认按钮 */}
                <div className="px-6 pb-6">
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg"
                    disabled={!tempStartDate || !tempEndDate}
                    onClick={handleDateSave}
                  >
                    确认日期
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {showTravelerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-[#000000]">
                选择出行人数
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowTravelerModal(false)}
              >
                <X className="h-5 w-5 text-[#808080]" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Adults */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#000000]">成人</p>
                  <p className="text-sm text-[#808080]">12岁以上</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8 bg-transparent border-[#dddddd] text-[#000000]"
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium text-[#000000]">
                    {adults}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8 bg-transparent border-[#dddddd] text-[#000000]"
                    onClick={() => setAdults(adults + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Elderly */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#000000]">老人</p>
                  <p className="text-sm text-[#808080]">65岁以上</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8 bg-transparent border-[#dddddd] text-[#000000]"
                    onClick={() => setElderly(Math.max(0, elderly - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium text-[#000000]">
                    {elderly}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8 bg-transparent border-[#dddddd] text-[#000000]"
                    onClick={() => setElderly(elderly + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#000000]">儿童</p>
                  <p className="text-sm text-[#808080]">2-12岁</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8 bg-transparent border-[#dddddd] text-[#000000]"
                    onClick={() => setChildren(Math.max(0, children - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium text-[#000000]">
                    {children}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8 bg-transparent border-[#dddddd] text-[#000000]"
                    onClick={() => setChildren(children + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Students */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#000000]">学生</p>
                  <p className="text-sm text-[#808080]">13-18岁</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8 bg-transparent border-[#dddddd] text-[#000000]"
                    onClick={() => setStudents(Math.max(0, students - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium text-[#000000]">
                    {students}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8 bg-transparent border-[#dddddd] text-[#000000]"
                    onClick={() => setStudents(students + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            

            <div className="flex gap-2 mt-6">
              <Button
                variant="outline"
                className="flex-1 bg-transparent border-[#dddddd] text-[#000000]"
                onClick={() => setShowTravelerModal(false)}
              >
                取消
              </Button>
              <Button
                className="flex-1 bg-[#0768fd] hover:bg-[#074ee8] text-white"
                onClick={handleTravelerSave}
              >
                确定
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* More Options Modal */}
      {showMoreModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-[#000000]">
                更多预算选项
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMoreModal(false)}
              >
                <X className="h-5 w-5 text-[#808080]" />
              </Button>
            </div>

            <div className="space-y-3">
              {[
                { id: "food", name: "美食", icon: "🍽️" },
                { id: "shopping", name: "购物", icon: "🛍️" },
                { id: "entertainment", name: "娱乐", icon: "🎭" },
                { id: "transport", name: "交通", icon: "🚗" },
                { id: "souvenir", name: "纪念品", icon: "🎁" },
                { id: "insurance", name: "保险", icon: "🛡️" },
              ].map((option) => (
                <Button
                  key={option.id}
                  variant={
                    selectedAccommodation.includes(option.id) ? "default" : "outline"
                  }
                  className={`w-full flex items-center gap-3 py-3 border-2 ${
                    selectedAccommodation.includes(option.id)
                      ? "border-[#0768fd] text-[#000000] bg-white hover:bg-gray-50"
                      : "border-transparent bg-white text-[#000000] hover:border-gray-300"
                  }`}
                  onClick={() => {
                    toggleAccommodation(option.id);
                  }}
                >
                  <span className="text-xl">{option.icon}</span>
                  {option.name}
                </Button>
              ))}
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                variant="outline"
                className="flex-1 bg-transparent border-[#dddddd] text-[#000000]"
                onClick={() => setShowMoreModal(false)}
              >
                取消
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
