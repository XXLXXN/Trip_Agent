// src/components/booking/InsuranceCard.tsx
import { ShieldCheck, Check, Plus } from "lucide-react";
import type { InsuranceInfo } from "../../mockData/bookingData";

interface Props {
  data: InsuranceInfo;
}

const InsuranceCard = ({ data }: Props) => (
  <div className="bg-white rounded-xl shadow-sm p-4">
    <div className="flex justify-between items-center pb-3">
      <div className="flex items-center gap-3">
        <ShieldCheck size={24} className="text-orange-400" />
        <p className="font-semibold text-gray-800">旅行保险</p>
      </div>
      <p className="font-bold text-lg text-gray-800">¥{data.price}</p>
    </div>
    <div className="py-3 space-y-2">
      {data.benefits.map((benefit, index) => (
        <p
          key={index}
          className="text-sm text-gray-600 flex items-center gap-2"
        >
          <Check size={16} className="text-blue-500" /> {benefit}
        </p>
      ))}
    </div>
    <div className="border-t border-gray-100 pt-3 mt-1 text-center">
      <button className="text-blue-500 font-semibold text-sm flex items-center justify-center w-full gap-1">
        <Plus size={16} /> 添加保险
      </button>
    </div>
  </div>
);
export default InsuranceCard;