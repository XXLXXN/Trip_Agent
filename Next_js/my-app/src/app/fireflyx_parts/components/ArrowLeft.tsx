import React from "react";

export const ArrowLeft: React.FC<{ size?: number; color?: string; className?: string }> = ({ size = 16, color = "#0768FD", className }) => (
  <svg className={className} width={size} height={Math.round((size * 17) / 16)} viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M14.7912 7.505H3.62124L8.50124 2.625C8.89124 2.235 8.89124 1.595 8.50124 1.205C8.11124 0.815 7.48124 0.815 7.09124 1.205L0.50124 7.795C0.11124 8.185 0.11124 8.815 0.50124 9.205L7.09124 15.795C7.48124 16.185 8.11124 16.185 8.50124 15.795C8.89124 15.405 8.89124 14.775 8.50124 14.385L3.62124 9.505H14.7912C15.3412 9.505 15.7912 9.055 15.7912 8.505C15.7912 7.955 15.3412 7.505 14.7912 7.505Z" fill={color}/>
  </svg>
);

