// data/mockData.ts

export interface Review {
  name: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
}

export interface AmenitiesStatus {
  parking: number;
  wifi: number;
  restaurant: number;
}

export interface LocationData {
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
  featuredImage: string;
  photos: string[];
  introduction: string;
  amenitiesStatus: AmenitiesStatus;
  reviews: Review[];
  price: number;
}

export const mockLocationData: LocationData = {
  name: '凯悦酒店',
  address: '上海环球港',
  rating: 4.5,
  reviewCount: 120,
  featuredImage: 'https://gips1.baidu.com/it/u=3670368947,3474620720&fm=3074&app=3074&f=JPEG', // 假设一张作为精选
  photos: [
    'https://gips1.baidu.com/it/u=3670368947,3474620720&fm=3074&app=3074&f=JPEG',
    'https://gips1.baidu.com/it/u=3670368947,3474620720&fm=3074&app=3074&f=JPEG',
    'https://gips1.baidu.com/it/u=3670368947,3474620720&fm=3074&app=3074&f=JPEG',
    'https://gips1.baidu.com/it/u=3670368947,3474620720&fm=3074&app=3074&f=JPEG',
    'https://gips1.baidu.com/it/u=3670368947,3474620720&fm=3074&app=3074&f=JPEG',
  ],
  introduction: 'Ramayana Prambanan is a show that combines dance and drama without dialogue, based on the Ramayana story, it is performed near Prambanan Temple on Java Island, Indonesia. Ramayana Prambanan performs since 1961.',
  amenitiesStatus: {
    parking: 1,
    wifi: 1,
    restaurant: 1
  },
  reviews: [
    {
      name: 'Bambang Ferdy',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzODg2NjF8MHwxfHNlYXJjaHwyfHx1c2VyJTIwcHJofZmlsZXxlbnwwfHx8fDE2OTk0MjM1MjB8MA&ixlib=rb-4.0.3&q=80&w=1080',
      rating: 5,
      date: '25/5/2019',
      text: 'Hyat Regency has always been a favorite place to staycation with friend and have fun.',
    },
    {
      name: 'Bambang Ferdy',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzODg2NjF8MHwxfHNlYXJjaHw1fHx1c2VyJTIwcHJvZmlsZXxlbnwwfHx8fDE2OTk0MjM1MjB8MA&ixlib=rb-4.0.3&q=80&w=1080',
      rating: 4,
      date: '1/6/2019',
      text: 'Dufan has always been a favorite place to spend time with friends, and have fun',
    },
  ],
  price: 50,
};