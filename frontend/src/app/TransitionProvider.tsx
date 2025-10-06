"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

type TransitionProviderProps = {
  children: React.ReactNode;
};

// 滑动动画（用于其他页面）
const slideVariants = {
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
  
  // 检测是否是 fireflyx_parts 路由
  const isFireflyxParts = pathname.startsWith('/fireflyx_parts');
  
  // 根据路由选择不同的动画
  const variants = isFireflyxParts ? fadeVariants : slideVariants;
  const duration = isFireflyxParts ? 0.3 : 0.2; // 稍微增加 fireflyx_parts 的动画时长

  // 调试信息
  console.log('TransitionProvider - pathname:', pathname, 'isFireflyxParts:', isFireflyxParts);

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


