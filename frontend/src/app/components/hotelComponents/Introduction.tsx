// components/Introduction.tsx
"use client";

import { useState } from 'react';

/**
 * Props for the Introduction component.
 */
interface IntroductionProps {
  /** The full introduction text to be displayed. */
  text: string;
}

/**
 * A component to display an introduction text that can be expanded or collapsed
 * if its length exceeds a certain maximum.
 */
const Introduction = ({ text }: IntroductionProps) => {
  // State to track whether the full text is shown.
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 80;
  
  /**
   * Toggles the expanded state.
   */
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Determine the text to display based on the expanded state.
  const displayText = isExpanded ? text : text.slice(0, maxLength) + (text.length > maxLength ? '...' : '');

  return (
    <div className="introduction-container">
      <h4>简介</h4>
      <p className="introduction-text">
        {displayText}
        {text.length > maxLength && (
          <span className="show-more" onClick={toggleExpanded}>
            {isExpanded ? ' 收起' : ' 展开全部'}
          </span>
        )}
      </p>
      <style jsx>{`
        .introduction-container { padding: 16px; background-color: white; margin: 8px 0 8px 0; }
        h4 { font-family: 'Inter', sans-serif; font-size: 18px; font-weight: bold; letter-spacing: 0; color: #1B1446; margin-top: 0; height: 22px; margin-bottom: 14px; }
        .introduction-text { font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500; letter-spacing: 0; line-height: auto; color: #808080; margin: 0; }
        .show-more { font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500; letter-spacing: 0; color: #007bff; cursor: pointer; }
      `}</style>
    </div>
  );
};

export default Introduction;