"use client";

import { useState } from "react";
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

export default function TravelPlanningPage() {
  const [priceRange, setPriceRange] = useState([200, 30000]);
  const [adultCount, setAdultCount] = useState(2);
  const [studentCount, setStudentCount] = useState(1);
  const [selectedTransport, setSelectedTransport] = useState("plane");
  const [selectedAccommodation, setSelectedAccommodation] = useState("hotel");
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showTravelerModal, setShowTravelerModal] = useState(false);
  const [editingField, setEditingField] = useState<
    "departure" | "destination" | "startDate" | "endDate" | null
  >(null);

  const [departure, setDeparture] = useState("上海");
  const [destination, setDestination] = useState("北京");
  const [startDate, setStartDate] = useState("2025.8.24");
  const [endDate, setEndDate] = useState("2025.9.15");

  const [adults, setAdults] = useState(2);
  const [elderly, setElderly] = useState(0);
  const [children, setChildren] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const toggleStyle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
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
        const errorData = await response.json();
        throw new Error(errorData.error || "请求失败");
      }

      const result = await response.json();

      // 成功后跳转到结果页面，或者根据后端响应处理
      // 这里假设后端返回的数据中包含成功状态和要跳转的页面
      if (result.success) {
        // 保存后端返回的数据到本地存储或状态管理
        localStorage.setItem("tripPlanData", JSON.stringify(result.data));
        router.push("/jingdianliebiao"); // 跳转到结果页面
      } else {
        throw new Error(result.message || "处理失败");
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

  const handleDateSave = (value: string) => {
    if (editingField === "startDate") {
      setStartDate(value);
    } else if (editingField === "endDate") {
      setEndDate(value);
    }
    setShowDateModal(false);
    setEditingField(null);
  };

  const handleTravelerSave = () => {
    setAdultCount(adults);
    setStudentCount(children);
    setShowTravelerModal(false);
  };

  const getTravelerText = () => {
    const parts = [];
    if (adults > 0) parts.push(`${adults}成人`);
    if (elderly > 0) parts.push(`${elderly}老人`);
    if (children > 0) parts.push(`${children}学生`);
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
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#f6f8fb] rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#83b4fe] rounded-full flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-white" />
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
                    <div className="w-8 h-8 bg-[#83b4fe] rounded-full flex items-center justify-center">
                      <Plane className="h-4 w-4 text-white" />
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
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#f6f8fb] rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#83b4fe] rounded-full flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-[#808080]">启程日期</p>
                      <p className="font-medium text-[#000000]">{startDate}</p>
                    </div>
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

                <div className="flex items-center justify-between p-4 bg-[#f6f8fb] rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#83b4fe] rounded-full flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-[#808080]">返程日期</p>
                      <p className="font-medium text-[#000000]">{endDate}</p>
                    </div>
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

              {/* Traveler Count */}
              <div
                className="flex items-center justify-between p-4 bg-[#f6f8fb] rounded-2xl cursor-pointer"
                onClick={() => setShowTravelerModal(true)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#83b4fe] rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-[#808080]">出行人数</p>
                    <p className="font-medium text-[#000000]">
                      {getTravelerText()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 bg-[#83b4fe] text-white hover:bg-[#0768fd]"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAdultCount(Math.max(1, adultCount - 1));
                    }}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium text-[#000000]">
                    {adults + elderly + children}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 bg-[#0768fd] text-white hover:bg-[#074ee8]"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAdultCount(adultCount + 1);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="px-3 py-1 bg-[#83b4fe] text-white rounded-full text-sm">
                    ¥{priceRange[0]}
                  </span>
                  <span className="px-3 py-1 bg-[#83b4fe] text-white rounded-full text-sm">
                    ¥{priceRange[1]}
                  </span>
                </div>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={50000}
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
                    onClick={() => setSelectedTransport("train")}
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
                    onClick={() => setSelectedTransport("bus")}
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
                    onClick={() => setSelectedTransport("plane")}
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
                      selectedAccommodation === "hotel" ? "default" : "outline"
                    }
                    className={`flex-1 flex items-center gap-2 py-3 border-2 ${
                      selectedAccommodation === "hotel"
                        ? "border-[#0768fd] text-[#000000] bg-white hover:bg-gray-50"
                        : "border-transparent bg-white text-[#000000] hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedAccommodation("hotel")}
                  >
                    <img src="/Hotel.svg" alt="酒店图标" className="h-8 w-8" />
                    住宿
                  </Button>
                  <Button
                    variant={
                      selectedAccommodation === "attractions"
                        ? "default"
                        : "outline"
                    }
                    className={`flex-1 flex items-center gap-2 py-3 border-2 ${
                      selectedAccommodation === "attractions"
                        ? "border-[#0768fd] text-[#000000] bg-white hover:bg-gray-50"
                        : "border-transparent bg-white text-[#000000] hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedAccommodation("attractions")}
                  >
                    <img
                      src="/Attraction.svg"
                      alt="景点图标"
                      className="h-8 w-8"
                    />
                    景点
                  </Button>
                  <Button
                    variant={
                      selectedAccommodation === "more" ? "default" : "outline"
                    }
                    className={`flex-1 flex items-center gap-2 py-3 border-2 ${
                      selectedAccommodation === "more"
                        ? "border-[#ff9141] text-[#000000] bg-white hover:bg-gray-50"
                        : "border-transparent bg-white text-[#000000] hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedAccommodation("more")}
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
                  placeholder="请在此输入您的需求"
                  className="min-h-[60px] bg-[#f6f8fb] border-0 resize-none text-[#000000]"
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

      {showDateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-[#000000]">
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
            <Input
              type="date"
              defaultValue={
                editingField === "startDate" ? "2025-08-24" : "2025-09-15"
              }
              className="mb-4 bg-[#f6f8fb] border-0 text-[#000000]"
              onChange={(e) => {
                const date = new Date(e.target.value);
                const formatted = `${date.getFullYear()}.${(date.getMonth() + 1)
                  .toString()
                  .padStart(2, "0")}.${date
                  .getDate()
                  .toString()
                  .padStart(2, "0")}`;
                if (editingField === "startDate") {
                  setStartDate(formatted);
                } else {
                  setEndDate(formatted);
                }
              }}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 bg-transparent border-[#dddddd] text-[#000000]"
                onClick={() => setShowDateModal(false)}
              >
                取消
              </Button>
              <Button
                className="flex-1 bg-[#0768fd] hover:bg-[#074ee8] text-white"
                onClick={() => setShowDateModal(false)}
              >
                确定
              </Button>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
}
