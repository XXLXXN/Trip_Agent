"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useNavigation } from '../context/NavigationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, register, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();

  // 如果已登录，重定向到首页
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigation.push('/', 'forward');
    }
  }, [isAuthenticated, isLoading, navigation]);

  // 表单验证
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.username.trim()) {
      newErrors.username = '用户名不能为空';
    }

    if (!isLogin && !formData.email.trim()) {
      newErrors.email = '邮箱不能为空';
    } else if (!isLogin && formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '邮箱格式不正确';
    }

    if (!formData.password) {
      newErrors.password = '密码不能为空';
    } else if (formData.password.length < 6) {
      newErrors.password = '密码至少6位';
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次密码输入不一致';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      let success = false;
      
      if (isLogin) {
        success = await login(formData.username, formData.password);
        
        // 如果登录失败，提供更具体的提示
        if (!success) {
          console.log('登录失败，用户名:', formData.username, '密码:', formData.password);
          if (formData.username !== 'admin') {
            setErrors({ 
              general: '用户名错误，请使用管理员账户 admin' 
            });
          } else if (formData.password !== '123456') {
            setErrors({ 
              general: '密码错误，请使用密码 123456' 
            });
          } else {
            setErrors({ 
              general: '登录失败，请检查用户名和密码是否正确' 
            });
          }
        }
      } else {
        success = await register(formData.username, formData.email, formData.password);
        if (!success) {
          setErrors({ 
            general: '注册失败，请重试' 
          });
        }
      }

      if (success) {
        navigation.push('/', 'forward');
      }
    } catch (error) {
      console.error('登录错误:', error);
      setErrors({ 
        general: '网络错误，请重试' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // 只有在用户开始输入时才清除通用错误提示
    // 这样可以避免在登录失败后立即清除错误提示
    if (errors.general && value.length > 0) {
      // 延迟清除错误提示，让用户能看到错误信息
      setTimeout(() => {
        setErrors(prev => ({
          ...prev,
          general: ''
        }));
      }, 100);
    }
  };

  // 切换登录/注册模式
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      

      <div className="flex flex-col items-center justify-center px-4 py-20">
        {/* 应用品牌区域 */}
        <div className="text-center mb-12">
          {/* 应用图标 */}
          <div className="mx-auto w-30 h-30 rounded-full flex items-center justify-center mb-6 relative">
            <img src="logo.svg" alt="logo" />
          </div>
          
          {/* 应用名称 */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">行迹智策</h1>
          <p className="text-sm text-gray-500">AI懂旅行,行程秒就绪</p>
        </div>

        {/* 登录表单 */}
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
          {/* 邮箱/手机号输入 */}
          <div className="relative">
            <div className="absolute left-3 top-2 z-10 flex items-center h-6">
              <img src="account_circle.svg" alt="account" />
            </div>
            <Input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              className={`w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-lg text-black ${errors.username ? 'ring-2 ring-red-500' : ''}`}
              placeholder="邮箱/手机号"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.username}
              </p>
            )}
          </div>

          {/* 密码输入 */}
          <div className="relative">
            <div className="absolute left-3 top-2 z-10 flex items-center h-6">
              <img src="lock.svg" alt="lock" />
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-lg text-black ${errors.password ? 'ring-2 ring-red-500' : ''}`}
              placeholder="密码"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.password}
              </p>
            )}
          </div>

          {/* 邮箱输入（仅注册时显示） */}
          {!isLogin && (
            <div className="relative">
              <div className="absolute left-3 top-2 z-10 flex items-center h-6">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-lg text-black ${errors.email ? 'ring-2 ring-red-500' : ''}`}
                placeholder="邮箱地址"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>
          )}

          {/* 确认密码输入（仅注册时显示） */}
          {!isLogin && (
            <div className="relative">
              <div className="absolute left-3 top-2 z-10 flex items-center h-6">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-lg text-black ${errors.confirmPassword ? 'ring-2 ring-red-500' : ''}`}
                placeholder="确认密码"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          )}

          {/* 通用错误提示 */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {errors.general}
            </div>
          )}

          {/* 登录按钮 */}
          <Button
            type="submit"
            className={`w-full font-medium py-3 px-4 rounded-lg transition-all duration-200 transform ${
              isSubmitting 
                ? 'bg-blue-500 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95'
            } text-white shadow-lg hover:shadow-xl`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                <span className="animate-pulse">{isLogin ? '登录中...' : '注册中...'}</span>
              </div>
            ) : (
              <span className="flex items-center justify-center">
                {isLogin ? 'Sign In' : '注册'}
              </span>
            )}
          </Button>

        </form>

        {/* 忘记密码 */}
        <div className="text-center mt-4">
          <button className="text-sm text-gray-500 hover:text-gray-700">
            忘记密码?
          </button>
        </div>

        {/* 其他登录方式 */}
        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">用其他方式登录</span>
          </div>
        </div>

        {/* 第三方登录图标 */}
        <div className="flex justify-center space-x-4 mt-6">
          {/* 微信 */}
          <button className="w-12 h-12 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50">
            <img src="wx.svg" alt="wx" />
          </button>

          {/* Google */}
          <button className="w-12 h-12 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50">
            <img src="Google.svg" alt="Google" />
          </button>

          {/* QQ */}
          <button className="w-12 h-12 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50">
            <img src="qq.svg" alt="qq" />
          </button>
        </div>

        {/* 注册提示 */}
        <div className="text-center text-sm text-gray-500 mt-6">
          还没有账户?点击注册 <span className="text-blue-600 cursor-pointer hover:text-blue-700">立即注册</span>
        </div>
      </div>
    </div>
  );
}
