// app/data.tsx

// 1. 在 Hotel 类型定义中添加 path 属性
export interface Hotel {
  id: number;
  name: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  path: string; // 新增：跳转路径
}

// 2. 为每个酒店对象添加具体的 path
export const mockHotels: Hotel[] = [
  { id: 1, name: "Hyatt Regency", location: "SLEMAN, DIY", price: 125, rating: 4.5, image: "/placeholder-hotel.jpg", path: "/attractions/hyatt-regency" },
  { id: 2, name: "Argo Hotel", location: "PARANGTRITIS", price: 125, rating: 4.5, image: "/placeholder-hotel.jpg", path: "/attractions/argo-hotel" },
  { id: 3, name: "Astor Hotel", location: "PARANGTRITIS", price: 125, rating: 4.5, image: "/placeholder-hotel.jpg", path: "/attractions/astor-hotel-1" },
  { id: 4, name: "Astor Hotel", location: "PARANGTRITIS", price: 125, rating: 4.5, image: "/placeholder-hotel.jpg", path: "/attractions/astor-hotel-2" }
];