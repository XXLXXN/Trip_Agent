

// components/travel/SearchBar.tsx

'use client';

// 定义 SearchBar 组件需要的 props 类型
interface SearchBarProps {
  value: string; // 输入框的值
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // 输入框内容改变时的处理函数
}

// 导出 SearchBar 组件
export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <>
      <div className="search-container">
        <div className="search-frame">
          <div className="search-field">
            {/* 您的新 SVG 图标 */}
            <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.16667 16.3333C12.8486 16.3333 15.8333 13.3486 15.8333 9.66667C15.8333 5.98477 12.8486 3 9.16667 3C5.48477 3 2.5 5.98477 2.5 9.66667C2.5 13.3486 5.48477 16.3333 9.16667 16.3333Z" stroke="#0768FD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17.5 18L13.875 14.375" stroke="#0768FD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              type="text"
              placeholder="搜索酒店名称"
              value={value}
              onChange={onChange}
              className="search-input"
            />
          </div>
        </div>
      </div>
      <style jsx>{`
        .search-container {
          padding: 0 16px;
        }
        
        .search-frame {
          background-color: #ffffff;
          border-radius: 24px;
          padding: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.07);
        }

        .search-field {
          display: flex;
          align-items: center;
          background-color: #f3f4f6;
          border-radius: 16px;
          height: 53px;
          /* 1. 简化 padding，只控制左右的整体内边距 */
          padding: 0 20px;
        }

        /* 2. 直接为SVG元素设置样式，控制它和输入框的间距 */
        .search-field svg {
          flex-shrink: 0; /* 防止图标被压缩 */
          margin-right: 8px; /* 精确控制右边距 */
        }

        .search-input {
          width: 100%;
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          font-size: 1rem;
          color: #1f2937;
          /* 3. 关键：移除浏览器的默认内边距 */
          padding: 0; 
        }
        
        .search-input::placeholder {
          color: #9ca3af;
        }
      `}</style>
    </>
  );
}