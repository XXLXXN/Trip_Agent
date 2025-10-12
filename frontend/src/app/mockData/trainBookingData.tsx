// src/mockData/trainBookingData.tsx

// Define types for train booking data
export interface TrainDetails {
  trainNumber: string;
  trainType: string;
  date: string;
  amenities: {
    seatType: string;
    wifi: boolean;
    food: boolean;
  };
  departure: {
    station: string;
    time: string;
  };
  arrival: {
    station: string;
    time: string;
  };
  duration: string;
}

export interface PassengerInfo {
  name: string;
  email: string;
  phone: string;
}

export interface InsuranceInfo {
  price: number;
  benefits: string[];
}

// Export the actual train data
export const trainData: TrainDetails = {
  trainNumber: 'G1234',
  trainType: '高铁',
  date: '2025.8.24',
  amenities: {
    seatType: '二等座',
    wifi: true,
    food: true,
  },
  departure: {
    station: '上海虹桥',
    time: '08:30',
  },
  arrival: {
    station: '北京南',
    time: '13:45',
  },
  duration: '运行时间 5h 15m',
};

export const passengerData: PassengerInfo = {
  name: '星韦沪',
  email: 'wayneenterprise@mail.com',
  phone: '+86 133 2239 2286',
};

export const insuranceData: InsuranceInfo = {
  price: 80,
  benefits: ['意外险金额达15万', '保障您的安全'],
};

export const totalAmount = 680;
