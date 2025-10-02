// components/Introduction.tsx
"use client";

import { useState } from 'react';

interface IntroductionProps {
  text: string;
}

/**
 * 显示简介文本的组件，当文本过长时可展开/收起。
 */
const Introduction = ({ text }: IntroductionProps) => {
  // 控制文本是否完全展开的状态
  const [isExpanded, setIsExpanded] = useState(false);
  // 文本被截断的最大长度
  const maxLength = 80;
  
  // 切换展开/收起状态
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // 根据展开状态决定显示的文本内容
  const displayText = isExpanded ? text : text.slice(0, maxLength) + (text.length > maxLength ? '...' : '');

  return (
    <div className="introduction-container">
      <h4>简介</h4>
      <p className="introduction-text">
        {displayText}
        {/* 当文本长度超过最大长度时，显示 "展开/收起" 按钮 */}
        {text.length > maxLength && (
          <span className="show-more" onClick={toggleExpanded}>
            {isExpanded ? ' 收起' : ' 展开全部'}
          </span>
        )}
      </p>
      <style jsx>{`
        /* 样式代码保持不变 */
        .introduction-container { padding: 16px; background-color: white; margin: 8px 0 8px 0; }
        h4 { font-family: 'Inter', sans-serif; font-size: 18px; font-weight: bold; color: #1B1446; margin-top: 0; height: 22px; margin-bottom: 14px; }
        .introduction-text { font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500; color: #808080; margin: 0; }
        .show-more { font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500; color: #007bff; cursor: pointer; }
      `}</style>
    </div>
  );
};

export default Introduction;