// src/components/booking/PassengerInfoCard.tsx
import { useState, ChangeEvent, useEffect } from "react";
// 我们需要引入 Check 和 X 图标用于保存和取消
import { Pencil, Mail, Phone, Check, X } from "lucide-react";
import type { PassengerInfo } from "../../mockData/shbbookingData";

interface Props {
  data: PassengerInfo;
  // 添加一个 onSave 回调 prop，用于通知父组件保存数据
  onSave: (updatedData: PassengerInfo) => void;
}

const PassengerInfoCard = ({ data, onSave }: Props) => {
  // 用于切换“查看模式”和“编辑模式”的状态
  const [isEditing, setIsEditing] = useState(false);
  // 用于在编辑时保存表单数据的状态
  const [formData, setFormData] = useState<PassengerInfo>(data);

  // 这个 Effect 的作用是，当父组件传入的 data prop 发生变化时，
  // 同步更新本地的 formData。这能确保表单数据始终与最新的外部数据保持一致。
  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData); // 调用父组件传入的 onSave 方法，更新数据
    setIsEditing(false); // 退出编辑模式
  };

  const handleCancel = () => {
    setFormData(data); // 将表单数据重置为原始数据
    setIsEditing(false); // 退出编辑模式
  };

  // 如果处于编辑模式，渲染编辑表单
  if (isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3 w-full">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
            <div className="space-y-2 w-full">
              {/* 表单输入框 */}
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="font-semibold text-gray-800 border-b-2 border-slate-200 focus:border-blue-500 outline-none w-full"
              />
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="text-sm text-gray-500 border-b border-slate-200 focus:border-blue-500 outline-none w-full"
                />
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="text-sm text-gray-500 border-b border-slate-200 focus:border-blue-500 outline-none w-full"
                />
              </div>
            </div>
          </div>
          {/* 保存和取消按钮 */}
          <div className="flex flex-col gap-2 ml-2">
            <button onClick={handleSave}>
              <Check size={20} className="text-green-500" />
            </button>
            <button onClick={handleCancel}>
              <X size={20} className="text-red-500" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 默认渲染信息展示视图 (你的原始代码)
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div>
            <p className="font-semibold text-gray-800">{data.name}</p>
            <p className="text-sm text-gray-500 flex items-center gap-2 mt-2">
              <Mail size={16} /> {data.email}
            </p>
            <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
              <Phone size={16} /> {data.phone}
            </p>
          </div>
        </div>
        {/* 编辑按钮现在会切换到编辑模式 */}
        <button onClick={() => setIsEditing(true)}>
          <Pencil size={18} className="text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default PassengerInfoCard;
