// src/components/booking/PassengerInfoCard.tsx
import { useState, ChangeEvent, useEffect } from "react";
// Import icons for edit, save, and cancel actions
import { Pencil, Mail, Phone, Check, X } from "lucide-react";
import type { PassengerInfo } from "../../mockData/bookingData";

interface Props {
  data: PassengerInfo;
  // Callback prop to notify the parent component of data updates.
  onSave: (updatedData: PassengerInfo) => void;
}

const PassengerInfoCard = ({ data, onSave }: Props) => {
  // State to toggle between "view" and "edit" modes.
  const [isEditing, setIsEditing] = useState(false);
  // State to hold form data during editing.
  const [formData, setFormData] = useState<PassengerInfo>(data);

  // This Effect syncs the local formData with the parent's data prop whenever it changes.
  // This ensures the form is always up-to-date with the latest external data.
  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData); // Pass the updated data to the parent component.
    setIsEditing(false); // Exit edit mode.
  };

  const handleCancel = () => {
    setFormData(data); // Reset form data to the original state.
    setIsEditing(false); // Exit edit mode.
  };

  // If in edit mode, render the editing form.
  if (isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3 w-full">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
            <div className="space-y-2 w-full">
              {/* Form inputs */}
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
          {/* Save and cancel buttons */}
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

  // Default view: Displaying passenger info.
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
        {/* The edit button switches to edit mode on click. */}
        <button onClick={() => setIsEditing(true)}>
          <Pencil size={18} className="text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default PassengerInfoCard;