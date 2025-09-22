"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "./ArrowLeft";
import { PillIconButton } from "./PillIconButton";

interface PageHeaderProps {
  title: string;
  backHref: string;
  rightElement?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  backHref, 
  rightElement 
}) => {
  return (
    <div className="flex items-center gap-4 px-5 pb-6" style={{ paddingTop: "calc(env(safe-area-inset-top) + 1.5rem)" }}>
      <Link href={backHref} className="no-underline">
        <PillIconButton width={"3.78rem"} height={"2.5rem"}>
          <ArrowLeft size={16} />
        </PillIconButton>
      </Link>
      <div className="text-[#1B1446] font-semibold text-[20px] leading-[24px]" style={{ fontFamily: 'Inter' }}>
        {title}
      </div>
      {rightElement && (
        <div className="ml-auto">
          {rightElement}
        </div>
      )}
    </div>
  );
};
