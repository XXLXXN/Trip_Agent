"use client";

import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useNavigation } from '../context/NavigationContext';

interface AuthGuardProps {
  children: React.ReactNode;
}

// 不需要身份验证的页面路径
const publicPaths = ['/login'];

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();
  const pathname = usePathname();

  useEffect(() => {
    // 如果正在加载，不进行重定向
    if (isLoading) {
      return;
    }

    // 检查当前路径是否为公开路径
    const isPublicPath = publicPaths.includes(pathname);

    // 如果未登录且不在公开页面，重定向到登录页
    if (!isAuthenticated && !isPublicPath) {
      navigation.push('/login', 'forward');
    }

    // 如果已登录且在登录页，重定向到首页
    if (isAuthenticated && pathname === '/login') {
      navigation.push('/', 'forward');
    }
  }, [isAuthenticated, isLoading, pathname, navigation]);

  // 如果正在加载，显示加载界面
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">验证身份中...</p>
        </div>
      </div>
    );
  }

  // 如果未登录且不在公开页面，不渲染内容（等待重定向）
  if (!isAuthenticated && !publicPaths.includes(pathname)) {
    return null;
  }

  // 如果已登录且在登录页，不渲染内容（等待重定向）
  if (isAuthenticated && pathname === '/login') {
    return null;
  }

  return <>{children}</>;
}
