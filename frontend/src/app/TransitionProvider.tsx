"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

type TransitionProviderProps = {
  children: React.ReactNode;
};

const variants = {
  initial: { 
    opacity: 0, 
    x: 100, // 从右侧进入
    filter: "blur(4px)" 
  },
  animate: { 
    opacity: 1, 
    x: 0, // 移动到正常位置
    filter: "blur(0px)" 
  },
  exit: { 
    opacity: 0, 
    x: -100, // 向左滑出
    filter: "blur(4px)" 
  },
};

export default function TransitionProvider({ children }: TransitionProviderProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.2, ease: "easeInOut" }}
        style={{ willChange: "opacity, transform, filter" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}


