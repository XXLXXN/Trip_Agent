// src/components/booking/FlightDetailsCard.tsx
import { Luggage, Wifi, Utensils, Plane, Calendar, ChevronDown } from 'lucide-react';
import type { FlightDetails } from '@/data/bookingData';

interface Props {
  data: FlightDetails;
}

const FlightDetailsCard = ({ data }: Props) => (
  <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-200 rounded-md"></div>
        <div>
          <p className="font-bold text-gray-800">{data.airline}</p>
          <p className="text-xs text-gray-500">{data.date}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 text-xs text-gray-600">
        <span className="flex items-center gap-1"><Luggage size={14} className="text-orange-400"/> {data.amenities.baggage}</span>
        {data.amenities.wifi && <span className="flex items-center gap-1"><Wifi size={14} className="text-orange-400"/> WIFI</span>}
        {data.amenities.food && <span className="flex items-center gap-1"><Utensils size={14} className="text-orange-400"/> FOOD</span>}
      </div>
    </div>

    <div className="flex items-center justify-between mb-4">
      <div className="text-center">
        <p className="text-xs text-gray-500">{data.departure.city}</p>
        <p className="text-2xl font-bold text-gray-800">{data.departure.time}</p>
      </div>
      <div className="flex-grow flex flex-col items-center mx-4">
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-dashed border-gray-300"></div></div>
          <div className="relative flex justify-center"><div className="bg-white px-2"><div className="bg-blue-100 rounded-full p-1"><Plane size={16} className="text-blue-500 transform -rotate-45" /></div></div></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">{data.duration}</p>
      </div>
      <div className="text-center">
        <p className="text-xs text-gray-500">{data.arrival.city}</p>
        <p className="text-2xl font-bold text-gray-800">{data.arrival.time}</p>
      </div>
    </div>

    <div className="border-t border-gray-100 pt-3 flex justify-between items-center text-sm text-gray-600">
      <div className="flex items-center gap-2"><Calendar size={16} /><span>选择航班</span></div>
      <ChevronDown size={20} className="text-blue-500" />
    </div>
  </div>
);
export default FlightDetailsCard;