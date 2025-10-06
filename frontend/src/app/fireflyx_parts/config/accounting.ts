// frontend/src/app/fireflyx_parts/config/accounting.ts

/**
 * 记账功能配置
 * 开发者可以通过修改这些配置来控制记账功能的行为
 */

export const ACCOUNTING_CONFIG = {
  // 是否在关闭账本页面时自动清除记账记录
  // true: 自动清除（默认）
  // false: 不清除，保留记录
  AUTO_CLEAR_ON_PAGE_CLOSE: false,
  
  // 是否在组件卸载时清除记录
  // true: 清除（默认）
  // false: 不清除
  AUTO_CLEAR_ON_UNMOUNT: false,
  
  // 是否在页面刷新时清除记录
  // true: 清除（默认）
  // false: 不清除
  AUTO_CLEAR_ON_REFRESH: false,
  
  // 是否在服务器关闭时清除记录
  // true: 清除（新增）
  // false: 不清除
  AUTO_CLEAR_ON_SERVER_SHUTDOWN: true,
  
  // 是否在页面切换时清除记录（新增）
  // true: 清除
  // false: 不清除（推荐）
  AUTO_CLEAR_ON_PAGE_NAVIGATION: false,
} as const;

/**
 * 获取自动清除配置
 */
export const getAutoClearConfig = () => {
  return {
    onPageClose: ACCOUNTING_CONFIG.AUTO_CLEAR_ON_PAGE_CLOSE,
    onUnmount: ACCOUNTING_CONFIG.AUTO_CLEAR_ON_UNMOUNT,
    onRefresh: ACCOUNTING_CONFIG.AUTO_CLEAR_ON_REFRESH,
    onServerShutdown: ACCOUNTING_CONFIG.AUTO_CLEAR_ON_SERVER_SHUTDOWN,
  };
};
