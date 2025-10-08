"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// 用户信息类型定义
interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

// 身份验证上下文类型
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<boolean>;
}

// 创建身份验证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 身份验证提供者组件
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 检查是否已登录
  const isAuthenticated = !!user;

  // 从localStorage恢复登录状态
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const savedUser = localStorage.getItem('user');
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        
        if (savedUser && isLoggedIn === 'true') {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('恢复登录状态失败:', error);
        // 清除可能损坏的数据
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // 登录函数
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // 模拟登录API调用
      
      // 管理员账户验证
      if (username === 'admin' && password === '123456') {
        const userData: User = {
          id: '1',
          username: 'admin',
          email: 'admin@example.com',
          avatar: '/placeholder-user.jpg'
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('isLoggedIn', 'true');
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('登录失败:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 注册函数
  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // 模拟注册API调用
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟网络延迟
      
      // 简单的模拟验证
      if (username && email && password) {
        const userData: User = {
          id: Date.now().toString(),
          username: username,
          email: email,
          avatar: '/placeholder-user.jpg'
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('isLoggedIn', 'true');
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('注册失败:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 登出函数
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    router.push('/login');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 使用身份验证上下文的Hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth必须在AuthProvider内部使用');
  }
  return context;
}
