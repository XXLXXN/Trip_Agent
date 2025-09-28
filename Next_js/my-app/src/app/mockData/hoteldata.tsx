// travelcarddata.ts

// 1. 在 Hotel 类型定义中添加 isPlan 属性
export interface Hotel {
  id: number;
  name: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  path: string;
  isPlan?: boolean; // 新增：标记这个酒店是否是初始方案的一部分
}

// 2. 为数据添加 isPlan 字段
export const mockHotels: Hotel[] = [
  // “推荐酒店方案”中的项目
  { id: 1, name: "Hyatt Regency", location: "SLEMAN, DIY", price: 125, rating: 4.5, image: "", path: "/attractions/hyatt-regency", isPlan: true },
  
  // “推荐酒店”中的项目 (isPlan 默认为 false 或不写)
  { id: 2, name: "Hyatt Regency", location: "SLEMAN, DIY", price: 125, rating: 4.5, image: "", path: "/attractions/hyatt-regency-2" },
  { id: 3, name: "Argo Hotel", location: "PARANGTRITIS", price: 125, rating: 4.5, image: "", path: "/attractions/argo-hotel" },
  { id: 4, name: "Astor Hotel", location: "PARANGTRITIS", price: 125, rating: 4.5, image: "", path: "/attractions/astor-hotel-1" },
  { id: 5, name: "Astor Hotel", location: "PARANGTRITIS", price: 125, rating: 4.5, image: "", path: "/attractions/astor-hotel-2" }
];