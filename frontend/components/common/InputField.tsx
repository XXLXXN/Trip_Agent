import React from 'react';
import { IconType } from 'react-icons';

interface InputFieldProps {
  label: string;
  type: string;
  icon?: IconType | string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  endAdornment?: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  icon,
  value,
  onChange,
  error,
  placeholder,
  endAdornment,
}) => {
  // 渲染图标逻辑
  const renderIcon = () => {
    if (!icon) return null;
    
    // 如果是字符串（例如SVG组件）
    if (typeof icon === 'string') {
      return (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <img src={icon} alt="" className="h-5 w-5" />
        </div>
      );
    }
    
    // 如果是IconType（react-icons）
    const IconComponent = icon;
    return (
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <IconComponent className="h-5 w-5 text-gray-400" />
      </div>
    );
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        {renderIcon()}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`block w-full ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border ${
            error ? 'border-red-300' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black`}
        />
        {endAdornment && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {endAdornment}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default InputField;