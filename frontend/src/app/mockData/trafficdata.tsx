export interface TravelOption {
  id: number;
  type: "fly" | "train";
  path: string;

  departureTime: string;
  arrivalTime: string;

  departureStation: string;
  arrivalStation: string;

  travelNumber: string;
  duration: string;

  price: number;
  airline: string | null;
}

export const mockTravelOptions: TravelOption[] = [
  {
    id: 2,
    type: "train",
    path: "/travel/train-details/g135",
    departureTime: "17:45",
    arrivalTime: "18:21",
    departureStation: "无锡东",
    arrivalStation: "上海虹桥",
    travelNumber: "G135",
    duration: "36分",
    price: 53,
    airline: null,
  },
  {
    id: 1,
    type: "fly",
    path: "/travel/flight-details/ca1832",
    departureTime: "08:00",
    arrivalTime: "10:15",
    departureStation: "首都 T3",
    arrivalStation: "虹桥 T2",
    travelNumber: "CA1832",
    duration: "2h 15m",
    price: 480,
    airline: "中国国际航空",
  },
  {
    id: 3,
    type: "train",
    path: "/travel/train-details/d2281",
    departureTime: "09:12",
    arrivalTime: "11:45",
    departureStation: "杭州东",
    arrivalStation: "温州南",
    travelNumber: "D2281",
    duration: "2h 33m",
    price: 115,
    airline: null,
  },
  {
    id: 4,
    type: "fly",
    path: "/travel/flight-details/mu5104",
    departureTime: "14:30",
    arrivalTime: "16:55",
    departureStation: "大兴",
    arrivalStation: "虹桥 T1",
    travelNumber: "MU5104",
    duration: "2h 25m",
    price: 520,
    airline: "东方航空",
  },
];
