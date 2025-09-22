"use client";

import React from "react";
import Link from "next/link";
import { Button } from "./Button";

interface FixedBottomButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  className?: string;
}

export const FixedBottomButton: React.FC<FixedBottomButtonProps> = ({
  children,
  href,
  onClick,
  variant = "primary",
  className = ""
}) => {
  const buttonElement = (
    <Button
      variant={variant}
      size="lg"
      onClick={onClick}
      className={`w-full h-12 ${className}`}
    >
      {children}
    </Button>
  );

  return (
    <div className="fixed inset-x-0 bottom-0 bg-white px-5 pt-3 shadow-[0_-1px_0_rgba(0,0,0,0.06)] z-50" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}>
      {href ? (
        <Link href={href} className="block">
          {buttonElement}
        </Link>
      ) : (
        buttonElement
      )}
    </div>
  );
};
