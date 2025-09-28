// src/data/bookingData.tsx

// Define types for our data for type safety
export interface FlightDetails {
  airline: string;
  date: string;
  amenities: {
    baggage: string;
    wifi: boolean;
    food: boolean;
  };
  departure: {
    city: string;
    time: string;
  };
  arrival: {
    city: string;
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

// Export the actual data
export const flightData: FlightDetails = {
  airline: '西南航空',
  date: '2025.8.24',
  amenities: {
    baggage: '20 KG',
    wifi: true,
    food: true,
  },
  departure: {
    city: '上海',
    time: '14.00',
  },
  arrival: {
    city: '北京',
    time: '16.40',
  },
  duration: '飞行时间 2h 34m',
};

export const passengerData: PassengerInfo = {
  name: '星韦沪',
  email: 'wayneenterprise@mail.com',
  phone: '+86 133 2239 2286',
};

export const insuranceData: InsuranceInfo = {
  price: 125,
  benefits: ['意外险金额达18万', '保障您的安全'],
};

export const totalAmount = 1860;