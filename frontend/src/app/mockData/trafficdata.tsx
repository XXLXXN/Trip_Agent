// data/traveldata.tsx

// 定义出行选项的数据结构
export interface TravelOption {
  id: number;
  name: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  path: string;
  type: 'fly' | 'train'; // 出行方式类型
}

// 模拟的出行选项数据
export const mockTravelOptions: TravelOption[] = [
  { id: 1, name: "西南航空", location: "SLEMAN, DIY", price: 125, rating: 4.5, image: "", path: "/travel/southwest-air", type: 'fly' },
  { id: 2, name: "春秋航空", location: "PARANGTRITIS", price: 125, rating: 4.5, image: "", path: "/travel/spring-air", type: 'fly' },
  { id: 3, name: "复兴号 G1 次", location: "北京南站", price: 90, rating: 4.8, image: "", path: "/travel/fuxing-g1", type: 'train' },
  { id: 4, name: "和谐号 D311 次", location: "上海虹桥", price: 75, rating: 4.6, image: "", path: "/travel/hexie-d311", type: 'train' },
  { id: 5, name: "东方航空", location: "CAPETOWN", price: 150, rating: 4.4, image: "", path: "/travel/eastern-air", type: 'fly' },
];