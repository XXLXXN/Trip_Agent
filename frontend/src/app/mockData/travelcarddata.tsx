// mockData/travelcarddata.tsx

/**
 * @interface Spot
 * 定义了单个景点的类型结构。
 * isPlan 属性是可选的，用于标记该景点是否默认包含在行程计划中。
 */
export interface Spot {
  id: number;
  name: string;
  image: string;
  path: string;
  recommendationReason: string;
  isPlan?: boolean; // 新增：标记是否为默认计划内景点
}

/**
 * 导出一份用于UI展示的景点模拟数据列表。
 */
export const mockSpots: Spot[] = [
  { 
    id: 1, 
    name: "故宫博物院", 
    image: "/placeholder-spot.jpg", 
    path: "/attractions/gugong",
    recommendationReason: "探索宏伟的皇家宫殿建筑群，感受中国古代帝王的辉煌历史与深厚文化底蕴。",
    isPlan: true // 标记为默认选中
  },
  { 
    id: 2, 
    name: "颐和园", 
    image: "/placeholder-spot.jpg", 
    path: "/attractions/yiheyuan",
    recommendationReason: "漫步于皇家园林之中，欣赏昆明湖的宁静与万寿山的秀美，体验古典园林的极致魅力。"
  },
  { 
    id: 3, 
    name: "八达岭长城", 
    image: "/placeholder-spot.jpg", 
    path: "/attractions/badaling",
    recommendationReason: "登上雄伟的世界奇迹，俯瞰群山，感受“不到长城非好汉”的豪迈情怀。"
  },
  { 
    id: 4, 
    name: "天坛公园", 
    image: "/placeholder-spot.jpg", 
    path: "/attractions/tiantan",
    recommendationReason: "参观明清两代皇帝祭天、祈谷的场所，欣赏其独特的天人合一建筑理念和设计。"
  }
];