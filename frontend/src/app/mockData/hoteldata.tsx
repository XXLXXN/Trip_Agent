// mockData/hotelData.ts

export interface Hotel {
  id: number;
  name: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  path: string;
  /** 用于标记酒店是否属于初始推荐方案 */
  isPlan?: boolean;
}

export const mockHotelData: Hotel[] = [
  // “推荐酒店方案”中的项目
  { id: 1, name: "Hyatt Regency", location: "SLEMAN, DIY", price: 125, rating: 4.5, image: "", path: "/attractions/hyatt-regency", isPlan: true },
  
  // “推荐酒店”中的项目 (isPlan 默认为 false 或未定义)
  { id: 2, name: "Hyattyy Regency", location: "SLEMAN, DIY", price: 125, rating: 4.5, image: "", path: "/attractions/hyatt-regency-2" },
  { id: 3, name: "Argo Hotel", location: "PARANGTRITIS", price: 125, rating: 4.5, image: "", path: "/attractions/argo-hotel" },
  { id: 4, name: "Astor Hotel", location: "PARANGTRITIS", price: 125, rating: 4.5, image: "", path: "/attractions/astor-hotel-1" },
  { id: 5, name: "Astor Hotel", location: "PARANGTRITIS", price: 125, rating: 4.5, image: "", path: "/attractions/astor-hotel-2" }
];