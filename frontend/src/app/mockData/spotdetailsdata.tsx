// data/spotdetailsdata.ts

// 定义评论的数据结构
export interface Review {
  name: string;      // 用户名
  avatar: string;    // 用户头像URL
  rating: number;    // 评分 (1-5)
  date: string;      // 评论日期
  text: string;      // 评论内容
}

// 定义设施状态的数据结构 (1表示可用, 0表示不可用)
export interface AmenitiesStatus {
  parking: number;
  wifi: number;
  restaurant: number;
  toilet: number;
}

// 定义整个地点详情页所需的数据结构
export interface LocationData {
  name: string;           // 地点名称
  address: string;        // 地址
  rating: number;         // 平均评分
  reviewCount: number;    // 评论总数
  featuredImage: string;  // 顶部特色图片URL
  photos: string[];       // 照片列表URL
  introduction: string;   // 简介文本
  amenitiesStatus: AmenitiesStatus; // 设施状态
  reviews: Review[];      // 评论列表
  price: number;          // 价格
}

// 导出一个用于开发和测试的模拟数据对象
export const mockLocationData: LocationData = {
  name: '故宫',
  address: '北京市东城区景山前街4号',
  rating: 4.6,
  reviewCount: 450,
  featuredImage: 'https://img0.baidu.com/it/u=2618313166,1721466683&fm=253&app=138&f=JPEG?w=800&h=1422',
  photos: [
    'https://img0.baidu.com/it/u=2618313166,1721466683&fm=253&app=138&f=JPEG?w=800&h=1422',
    'https://img0.baidu.com/it/u=2618313166,1721466683&fm=253&app=138&f=JPEG?w=800&h=1422',
    'https://img0.baidu.com/it/u=2618313166,1721466683&fm=253&app=138&f=JPEG?w=800&h=1422',
    'https://img0.baidu.com/it/u=2618313166,1721466683&fm=253&app=138&f=JPEG?w=800&h=1422',
    'https://img0.baidu.com/it/u=2618313166,1721466683&fm=253&app=138&f=JPEG?w=800&h=1422',
  ],
  introduction: '位于北京市,故宫内有9999间半的殿宇,建筑群是中华传统文化的集大成者。故宫博物院保存着明清时代遗留下来的皇家宫殿和旧藏珍宝,文物藏品总数超过180万件涵盖古书画、古器物、瓷器、玉器等多个领域。故宫是中国古代宫廷建筑之精华,也是世界上现存规模最大、保存最为完整的木质结构古建筑群之一。',
  amenitiesStatus: {
    parking: 1,
    wifi: 1,
    restaurant: 0,
    toilet: 1
  },
  reviews: [
    {
      name: '爱吃奶黄包',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzODg2NjF8MHwxfHNlYXJjaHwyfHx1c2VyJTIwcHJofZmlsZXxlbnwwfHx8fDE2OTk0MjM1MjB8MA&ixlib=rb-4.0.3&q=80&w=1080',
      rating: 5,
      date: '25/5/2019',
      text: '很棒喔，喜欢去，服务态度很好，器宇轩昂的建筑震惊了我。推荐！！',
    },
    {
      name: 'Ramaya',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzODg2NjF8MHwxfHNlYXJjaHw1fHx1c2VyJTIwcHJvZmlsZXxlbnwwfHx8fDE2OTk0MjM1MjB8MA&ixlib=rb-4.0.3&q=80&w=1080',
      rating: 4,
      date: '1/6/2019',
      text: 'A great place to visit, my friends and I had a great time.',
    },
  ],
  price: 50,
};