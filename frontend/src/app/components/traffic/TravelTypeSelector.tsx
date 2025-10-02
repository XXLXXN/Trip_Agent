// components/travel/TravelTypeSelector.tsx

'use client';

interface TravelTypeSelectorProps {
  // 当前选中的出行方式，例如: 'fly'
  selectedType: string;
  // 当用户选择新的方式时触发的回调函数
  onTypeChange: (newType: string) => void;
}

// 定义出行方式及其标签
const travelTypes = [
  { key: 'all', label: '不限' },
  { key: 'fly', label: '航空' },
  { key: 'train', label: '高铁' },
  { key: 'self', label: '自行安排' },
];

/**
 * 一个分段式按钮选择器，用于在不同的出行类别之间切换。
 * 替代了原生的下拉菜单，以提供更统一和美观的用户体验。
 */
export default function TravelTypeSelector({ selectedType, onTypeChange }: TravelTypeSelectorProps) {
  return (
    <>
      <div className="selector-container">
        <div className="button-group">
          {travelTypes.map((type) => (
            <button
              key={type.key}
              className={`selector-button ${selectedType === type.key ? 'active' : ''}`}
              onClick={() => onTypeChange(type.key)}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>
      <style jsx>{`
        .selector-container {
          background-color: #D9D9D9;
          padding: 8px 16px;
        }
        .button-group {
          display: flex;
          width: 100%;
          background-color: #ffffff;
          border-radius: 9999px; /* 使用一个很大的值来创建胶囊形状 */
          padding: 4px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          border: 1px solid #e5e7eb;
        }
        .selector-button {
          flex: 1; /* 让每个按钮平分容器宽度 */
          padding: 10px 0;
          border: none;
          background-color: transparent;
          color: #4b5563; /* 未选中时的文字颜色 */
          font-size: 14px;
          font-weight: 500;
          border-radius: 9999px;
          cursor: pointer;
          transition: background-color 0.3s ease, color 0.3s ease;
          outline: none;
        }
        .selector-button.active {
          background-color: #0768FD; /* 选中时的背景色 */
          color: #ffffff; /* 选中时的文字颜色 */
          font-weight: 600;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </>
  );
}