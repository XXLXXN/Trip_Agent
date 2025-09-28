// src/components/booking/BaggageCard.tsx
import { Luggage, Plus } from 'lucide-react';

const BaggageCard = () => (
  <div className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center">
    <div className="flex items-center gap-3">
      <Luggage size={24} className="text-orange-400" />
      <div>
        <p className="font-semibold text-gray-800">行李</p>
        <p className="text-sm text-gray-500">添加额外行李</p>
      </div>
    </div>
    <button className="text-blue-500"><Plus size={24} /></button>
  </div>
);
export default BaggageCard;