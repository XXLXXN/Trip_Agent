"use client";

import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  type = "button"
}) => {
  const baseClasses = "font-semibold transition-colors touch-manipulation cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-[#0768FD] text-white hover:bg-[#0656D1]",
    secondary: "bg-[#DDDDDD] text-[#1B1446] hover:bg-[#CCCCCC]",
    outline: "border border-[#0768FD] text-[#0768FD] bg-white hover:bg-[#0768FD] hover:text-white"
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    md: "px-4 py-2 text-sm rounded-xl",
    lg: "px-6 py-3 text-base rounded-xl"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      style={{ fontFamily: 'Inter' }}
    >
      {children}
    </button>
  );
};

// 预定义的按钮变体
export const PrimaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="primary" />
);

export const SecondaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="secondary" />
);

export const OutlineButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="outline" />
);
