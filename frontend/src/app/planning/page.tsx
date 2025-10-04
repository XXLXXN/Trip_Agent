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
  const [priceRange, setPriceRange] = useState([200, 30000]);
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

  // 打开日期卡片时禁用页面滚动，关闭时恢复
  useEffect(() => {
    if (showDateModal) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [showDateModal]);

  const [adults, setAdults] = useState(2);
  const [elderly, setElderly] = useState(0);
  const [children, setChildren] = useState(1);
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
    const current = field === "startDate" ? startDate : endDate;
    setTempSelectedDate(parseDateString(current));
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
    if (!tempSelectedDate) return;
    const formatted = formatDate(tempSelectedDate);
    if (editingField === "startDate") {
      setStartDate(formatted);
      // 新规则：返程日期不能早于启程日期 => 若返程 < 启程，则将返程对齐为启程
      const end = parseDateString(endDate);
      if (end && end.getTime() < tempSelectedDate.getTime()) {
        setEndDate(formatted);
      }
    } else if (editingField === "endDate") {
      setEndDate(formatted);
    }
    setShowDateModal(false);
    setEditingField(null);
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
    return parts.join("，");
  };

  return (
    <div className="min-h-screen bg-[#f6f8fb] max-w-sm mx-auto relative">
      {/* 顶部1/4蓝色背景 */}
      <div
        className="absolute top-0 left-0 w-full"
        style={{
          height: "25vh",
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
        <div className="px-4 space-y-6">
          <div className="bg-[#ffffff] rounded-2xl p-6 shadow-sm border-0">
            <div className="space-y-6">
              {/* Location Selection */}
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-[#f6f8fb] rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center">
                      <img src="/location_on.svg" alt="出发图标" className="h-12 w-12" />
                    </div>
                    <div>
                      <p className="text-sm text-[#808080]">出发地</p>
                      <p className="font-medium text-[#000000]">{departure}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-[#0768fd]"
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

                <div className="flex items-center justify-between p-4 bg-[#f6f8fb] rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center">
                      <img src="/Vector.svg" alt="目的地图标" className="h-12 w-12" />
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
                    className="text-[#0768fd]"
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
              <div className="bg-[#f6f8fb] rounded-2xl overflow-hidden">
                <div className="flex">
                  {/* 共享的图标区域 - 与地点卡片对齐 */}
                  <div className="flex items-center justify-center pl-4 pr-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center">
                      <img src="/date_range.svg" alt="日历图标" className="h-12 w-12" />
                    </div>
                  </div>

                  {/* 右侧内容区域 */}
                  <div className="flex-1">
                    {/* 启程日期 */}
                    <div className="flex items-center justify-between py-4 pr-4">
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
                        <div className="w-8 h-8 flex items-center justify-center">
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
                    <div className="flex items-center justify-between py-4 pr-4">
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
                        <div className="w-8 h-8 flex items-center justify-center">
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
              <div className="flex items-center justify-between p-4 bg-[#f6f8fb] rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center">
                    <img src="/supervisor_account.svg" alt="人数图标" className="h-12 w-12" />
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
                  className="text-[#0768fd]"
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
                        const value = parseInt(e.target.value) || 100;
                        setPriceRange([value, Math.max(value, priceRange[1])]);
                      }}
                      onBlur={() => setEditingField(null)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
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
                        const value = parseInt(e.target.value) || 100;
                        setPriceRange([Math.min(priceRange[0], value), value]);
                      }}
                      onBlur={() => setEditingField(null)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
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

              {/* Transportation Preferences */}
              <div className="space-y-3">
                <h3 className="font-medium text-[#000000]">交通偏好</h3>
                <div className="flex gap-3">
                  <Button
                    variant={
                      selectedTransport === "train" ? "default" : "outline"
                    }
                    className={`flex-1 flex items-center gap-2 py-3 border-2 ${
                      selectedTransport === "train"
                        ? "border-[#0768fd] text-[#000000] bg-white hover:bg-gray-50"
                        : "border-transparent bg-white text-[#000000] hover:border-gray-300"
                    }`}
                    onClick={() => toggleTransport("train")}
                  >
                    <img src="/Train.svg" alt="火车图标" className="h-8 w-8" />
                    火车
                  </Button>
                  <Button
                    variant={
                      selectedTransport === "bus" ? "default" : "outline"
                    }
                    className={`flex-1 flex items-center gap-2 py-3 border-2 ${
                      selectedTransport === "bus"
                        ? "border-[#0768fd] text-[#000000] bg-white hover:bg-gray-50"
                        : "border-transparent bg-white text-[#000000] hover:border-gray-300"
                    }`}
                    onClick={() => toggleTransport("bus")}
                  >
                    <img src="/Bus.svg" alt="汽车图标" className="h-8 w-8" />
                    汽车
                  </Button>
                  <Button
                    variant={
                      selectedTransport === "plane" ? "default" : "outline"
                    }
                    className={`flex-1 flex items-center gap-2 py-3 border-2 ${
                      selectedTransport === "plane"
                        ? "border-[#0768fd] text-[#000000] bg-white hover:bg-gray-50"
                        : "border-transparent bg-white text-[#000000] hover:border-gray-300"
                    }`}
                    onClick={() => toggleTransport("plane")}
                  >
                    <img src="/Flight.svg" alt="飞机图标" className="h-8 w-8" />
                    飞机
                  </Button>
                </div>
              </div>

              {/* Booking Preferences */}
              <div className="space-y-3">
                <h3 className="font-medium text-[#000000]">预算偏好</h3>
                <div className="flex gap-3">
                  <Button
                    variant={
                      selectedAccommodation.includes("hotel") ? "default" : "outline"
                    }
                    className={`flex-1 flex items-center gap-2 py-3 border-2 ${
                      selectedAccommodation.includes("hotel")
                        ? "border-[#0768fd] text-[#000000] bg-white hover:bg-gray-50"
                        : "border-transparent bg-white text-[#000000] hover:border-gray-300"
                    }`}
                    onClick={() => toggleAccommodation("hotel")}
                  >
                    <img src="/Hotel.svg" alt="酒店图标" className="h-8 w-8" />
                    住宿
                  </Button>
                  <Button
                    variant={
                      selectedAccommodation.includes("attractions")
                        ? "default"
                        : "outline"
                    }
                    className={`flex-1 flex items-center gap-2 py-3 border-2 ${
                      selectedAccommodation.includes("attractions")
                        ? "border-[#0768fd] text-[#000000] bg-white hover:bg-gray-50"
                        : "border-transparent bg-white text-[#000000] hover:border-gray-300"
                    }`}
                    onClick={() => toggleAccommodation("attractions")}
                  >
                    <img
                      src="/Attraction.svg"
                      alt="景点图标"
                      className="h-8 w-8"
                    />
                    景点
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 flex items-center gap-2 py-3 border-2 border-transparent bg-white text-[#000000] hover:border-gray-300"
                    onClick={() => setShowMoreModal(true)}
                  >
                    <img src="/More.svg" alt="更多图标" className="h-8 w-8" />
                    更多
                  </Button>
                </div>
              </div>

              {/* Travel Style */}
              <div className="space-y-3">
                <h3 className="font-medium text-[#000000]">旅行风格</h3>
                <div className="flex gap-3">
                  {["文艺", "美食", "自然"].map((style) => (
                    <Button
                      key={style}
                      variant="outline"
                      className={`px-6 py-2 ${
                        selectedStyles.includes(style)
                          ? "bg-[#0768fd] text-white border-[#0768fd] hover:bg-[#074ee8]"
                          : "bg-white border-[#dddddd] text-[#000000]"
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
                <h3 className="font-medium text-[#000000]">其他需求</h3>
                <Textarea
                  placeholder="请在此输入您其他任何需求"
                  className="min-h-[60px] bg-[#f6f8fb] border-0 resize-none text-[#000000]"
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
              className="fixed left-0 right-0 bottom-0 z-50"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
            >
              <div className="bg-white rounded-t-2xl p-3 pb-4 shadow-2xl max-w-sm w-full mx-auto h-[100vh]" style={{ paddingBottom: "6px" }}>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-base font-medium text-[#111111]">
                    {editingField === "startDate" ? "选择启程日期" : "选择返程日期"}
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowDateModal(false)}
                  >
                    <X className="h-5 w-5 text-[#808080]" />
                  </Button>
                </div>

                <div className="bg-[#f6f8fb] rounded-xl p-2 flex justify-center">
                  <DayPicker
                    mode="single"
                    selected={tempSelectedDate}
                    onSelect={(d) => {
                      setDateError(null);
                      if (!d) {
                        setTempSelectedDate(undefined);
                        return;
                      }
                      // 归零时分
                      const picked = new Date(d.getFullYear(), d.getMonth(), d.getDate());
                      if (editingField === "startDate") {
                        // 规则：启程日期不能早于今天 => picked >= today
                        if (picked.getTime() < today.getTime()) {
                          setDateError("启程日期不能早于今天");
                          setTempSelectedDate(undefined);
                          return;
                        }
                      } else if (editingField === "endDate") {
                        // 规则：返程日期不能早于启程日期 => end >= start
                        if (startDateObj && picked.getTime() < startDateObj.getTime()) {
                          setDateError("返程日期不能早于启程日期");
                          setTempSelectedDate(undefined);
                          return;
                        }
                      }
                      setTempSelectedDate(picked);
                    }}
                    // 禁用不合法日期
                    disabled={
                      editingField === "startDate"
                        ? [{ before: today }]
                        : startDateObj
                        ? [{ before: startDateObj }]
                        : undefined
                    }
                    locale={zhCN}
                    styles={{
                      root: { fontSize: 12.5, color: "#111111" },
                      caption_label: { fontWeight: 600, color: "#111111" },
                      head_cell: { color: "#333333", fontWeight: 500 },
                      day: { color: "#111111", width: 30, height: 30, margin: 2, padding: 0 },
                      day_selected: { backgroundColor: "#0768fd", color: "#ffffff" },
                      day_today: { border: "1px solid #0768fd" },
                      nav_button: { color: "#111111" },
                      table: { margin: 0 },
                      months: { gap: 0, justifyContent: "center", display: "flex" },
                      month: { margin: "0 auto" },
                    }}
                    modifiersClassNames={{
                      selected: "rounded-full ring-2 ring-[#0768fd] ring-offset-0",
                      today: "rounded-full",
                    }}
                    weekStartsOn={1}
                  />
                </div>

                {dateError && (
                  <p className="text-red-600 text-xs mt-2">{dateError}</p>
                )}

                <div className="flex gap-2 mt-2">
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent border-[#dddddd] text-[#111111]"
                    onClick={() => setShowDateModal(false)}
                  >
                    取消
                  </Button>
                  <Button
                    className="flex-1 bg-[#0768fd] hover:bg-[#074ee8] text-white"
                    disabled={!tempSelectedDate}
                    onClick={handleDateSave}
                  >
                    确定
                  </Button>
                </div>
              </div>
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
