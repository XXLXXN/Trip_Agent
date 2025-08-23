// components/common/Card.tsx
import React from 'react';
import { FiArrowRight } from 'react-icons/fi'; // 示例图标

/**
 * Card 组件 Props 类型定义
 */
interface CardProps {
  title: string;
  description: string;
  icon?: React.ReactNode; // 支持传入任意React节点作为图标
  imageUrl?: string; // 卡片顶部图片URL（可选）
  variant?: 'default' | 'outline' | 'elevated'; // 卡片样式变体
  hoverEffect?: 'scale' | 'shadow' | 'none'; // 悬停效果
  actionText?: string; // 底部操作按钮文字（可选）
  onActionClick?: () => void; // 操作按钮点击事件
  className?: string; // 自定义类名
  children?: React.ReactNode; // 子内容
}

/**
 * 通用卡片组件
 */
const Card: React.FC<CardProps> = ({
  title,
  description,
  icon,
  imageUrl,
  variant = 'default',
  hoverEffect = 'shadow',
  actionText,
  onActionClick,
  className = '',
  children,
}) => {
  // 根据变体返回对应的样式类
  const getVariantClasses = () => {
    switch (variant) {
      case 'outline':
        return 'border border-gray-200 bg-transparent';
      case 'elevated':
        return 'bg-white shadow-lg';
      default:
        return 'bg-white shadow-sm';
    }
  };

  // 悬停效果类
  const getHoverClasses = () => {
    switch (hoverEffect) {
      case 'scale':
        return 'hover:scale-[1.02] transition-transform duration-200';
      case 'shadow':
        return 'hover:shadow-md transition-shadow duration-200';
      default:
        return '';
    }
  };

  return (
    <div
      className={`rounded-lg overflow-hidden ${getVariantClasses()} ${getHoverClasses()} ${className}`}
    >
      {/* 图片区域（如果有） */}
      {imageUrl && (
        <div className="h-40 bg-gray-100 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* 卡片内容 */}
      <div className="p-6">
        {/* 图标+标题区域 */}
        <div className="flex items-start gap-3">
          {icon && <div className="text-2xl text-blue-500 mt-0.5">{icon}</div>}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 text-gray-600">{description}</p>
          </div>
        </div>

        {/* 子内容 */}
        {children && <div className="mt-4">{children}</div>}

        {/* 操作按钮（如果有） */}
        {actionText && (
          <button
            onClick={onActionClick}
            className="mt-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            {actionText}
            <FiArrowRight className="ml-1" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;