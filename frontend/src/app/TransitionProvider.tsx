"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useNavigation } from "./context/NavigationContext";

type TransitionProviderProps = {
  children: React.ReactNode;
};

// 前进动画（从右向左滑入）
const slideForwardVariants = {
  initial: { 
    opacity: 0, 
    x: 100,
    filter: "blur(4px)" 
  },
  animate: { 
    opacity: 1, 
    x: 0,
    filter: "blur(0px)" 
  },
  exit: { 
    opacity: 0, 
    x: -100,
    filter: "blur(4px)" 
  },
};

// 返回动画（从左向右滑入）
const slideBackwardVariants = {
  initial: { 
    opacity: 0, 
    x: -100,
    filter: "blur(4px)" 
  },
  animate: { 
    opacity: 1, 
    x: 0,
    filter: "blur(0px)" 
  },
  exit: { 
    opacity: 0, 
    x: 100,
    filter: "blur(4px)" 
  },
};

// 淡入淡出动画（用于 fireflyx_parts，不影响 fixed 定位）
const fadeVariants = {
  initial: { 
    opacity: 0,
  },
  animate: { 
    opacity: 1,
  },
  exit: { 
    opacity: 0,
  },
};

export default function TransitionProvider({ children }: TransitionProviderProps) {
  const pathname = usePathname();
  const { direction } = useNavigation();
  
  // 检测是否是 fireflyx_parts 路由
  const isFireflyxParts = pathname.startsWith('/fireflyx_parts');
  
  // 根据路由和导航方向选择不同的动画
  let variants;
  if (isFireflyxParts) {
    variants = fadeVariants;
  } else {
    variants = direction === 'backward' ? slideBackwardVariants : slideForwardVariants;
  }
  
  const duration = isFireflyxParts ? 0.3 : 0.2; // 稍微增加 fireflyx_parts 的动画时长

  // 调试信息
  console.log('TransitionProvider - pathname:', pathname, 'direction:', direction, 'isFireflyxParts:', isFireflyxParts);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration, ease: "easeInOut" }}
        style={{ 
          willChange: isFireflyxParts ? "opacity" : "opacity, transform, filter",
          height: '100%', // Ensure motion.div takes full height
          transform: 'none', // 确保不创建新的包含块
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}


