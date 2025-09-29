// components/travel/TravelTypeSelector.tsx

'use client';

interface TravelTypeSelectorProps {
  // 当前选中的出行方式，例如: 'fly'
  selectedType: string;
  // 当用户选择新的方式时触发的回调函数
  onTypeChange: (newType: string) => void;
}

// 定义出行方式 key 到显示文本的映射
const typeLabels: { [key: string]: string } = {
  all: '不限',
  fly: '航空',
  train: '高铁',
  self: '自行安排',
};

/**
 * 一个自定义样式的下拉选择器，用于选择出行类别。
 */
export default function TravelTypeSelector({ selectedType, onTypeChange }: TravelTypeSelectorProps) {
  const handleSelectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onTypeChange(event.target.value);
  };

  return (
    <>
      <div className="selector-container">
        <div className="selector-frame">
          <div className="selector-field">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" fill="#4A90E2"/>
            </svg>
            <div className="text-area">
              <span className="label">出行类别</span>
              <span className="value">{typeLabels[selectedType]}</span>
            </div>
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.41 0.589966L6 5.16997L10.59 0.589966L12 1.99997L6 7.99997L0 1.99997L1.41 0.589966Z" fill="#0768FD"/>
            </svg>
            
            {/* 使用一个透明的 <select> 元素覆盖在上方，以调用浏览器原生的选择器 UI */}
            <select
              value={selectedType}
              onChange={handleSelectionChange}
              className="native-select"
            >
              <option value="all">不限</option>
              <option value="fly">航空</option>
              <option value="train">高铁</option>
              <option value="self">自行安排</option>
            </select>
          </div>
        </div>
      </div>
      <style jsx>{`
        .selector-container { background-color: #D9D9D9; padding: 0 16px; }
        .selector-frame { background-color: #ffffff; border-radius: 24px; padding: 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.07); }
        .selector-field { position: relative; display: flex; align-items: center; background-color: #F0F7FF; border-radius: 16px; height: 60px; padding: 0 20px; cursor: pointer; }
        .text-area { display: flex; flex-direction: column; margin-left: 12px; flex-grow: 1; }
        .label { font-size: 12px; color: #888; }
        .value { font-size: 16px; font-weight: 600; color: #1B1446; }
        .native-select { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
      `}</style>
    </>
  );
}