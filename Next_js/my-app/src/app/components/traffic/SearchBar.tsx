// components/travel/TravelTypeSelector.tsx

'use client';

// 定义组件的 Props 类型
interface TravelTypeSelectorProps {
  // selectedType 是当前选中的值，例如 'fly'
  selectedType: string;
  // onTypeChange 是一个函数，当用户做出新选择时，会调用它并传入新的值
  onTypeChange: (newType: string) => void;
}

// 定义一个映射，将类型值（如'fly'）转换为显示的中文文本
const typeLabels: { [key: string]: string } = {
  all: '不限',
  fly: '航空',
  train: '高铁',
  self: '自行安排',
};

export default function TravelTypeSelector({ selectedType, onTypeChange }: TravelTypeSelectorProps) {
  // 当用户在下拉菜单中选择一个新选项时，这个函数会被触发
  const handleSelectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onTypeChange(event.target.value);
  };

  return (
    <>
      <div className="selector-container">
        <div className="selector-frame">
          <div className="selector-field">
            {/* 左侧的星星图标 */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" fill="#4A90E2"/>
            </svg>

            {/* 中间的文本区域 */}
            <div className="text-area">
              <span className="label">出行类别</span>
              <span className="value">{typeLabels[selectedType]}</span>
            </div>

            {/* 右侧的下拉箭头图标 */}
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.41 0.589966L6 5.16997L10.59 0.589966L12 1.99997L6 7.99997L0 1.99997L1.41 0.589966Z" fill="#0768FD"/>
            </svg>

            {/* 一个透明的、覆盖在整个区域的<select>元素，用于触发原生下拉菜单 */}
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
        .selector-container {
          background-color: #D9D9D9;
          padding: 0 16px;
        }
        .selector-frame {
          background-color: #ffffff;
          border-radius: 24px;
          padding: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.07);
        }
        /* 内部的浅蓝色选择区域 */
        .selector-field {
          position: relative; /* 为透明的 select 元素定位 */
          display: flex;
          align-items: center;
          background-color: #F0F7FF; /* 淡蓝色背景 */
          border-radius: 16px;
          height: 60px;
          padding: 0 20px;
          cursor: pointer;
        }
        .text-area {
          display: flex;
          flex-direction: column;
          margin-left: 12px;
          flex-grow: 1; /* 占据中间所有可用空间 */
        }
        .label {
          font-size: 12px;
          color: #888;
        }
        .value {
          font-size: 16px;
          font-weight: 600;
          color: #1B1446;
        }
        .native-select {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0; /* 完全透明 */
          cursor: pointer;
        }
      `}</style>
    </>
  );
}