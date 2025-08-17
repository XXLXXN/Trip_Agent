'use client'; 

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { InputField, Button } from '../common';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const router = useRouter();

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: '', password: '' };

    if (!email.includes('@')) {
      newErrors.email = '请输入有效的邮箱地址';
      valid = false;
    }

    if (password.length < 6) {
      newErrors.password = '密码至少需要6个字符';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-8">
        {/* Logo和标语 */}
        <h1 className="text-2xl font-bold text-gray-800">欢迎回来</h1>
      </div>
      
      <form onSubmit={handleSubmit}>
        <InputField
          label="邮箱"
          type="email"
          icon="" // 需要替换为图标/icon组件
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          placeholder="请输入您的邮箱"
        />
        
        <InputField
          label="密码"
          type={showPassword ? 'text' : 'password'}
          icon="" // 需要替换为图标/icon组件
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          placeholder="请输入密码"
          endAdornment={
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-500 hover:text-gray-700"
            >
              {showPassword ? '隐藏' : '显示'}
            </button>
          }
        />
        
        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded text-blue-500"
            />
            <span className="ml-2 text-sm text-gray-600">记住我</span>
          </label>
          
          <button
            type="button"
            onClick={() => router.push('/forgot-password')}
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            忘记密码？
          </button>
        </div>
        
        <Button type="submit" fullWidth>
          登录
        </Button>
        
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => router.push('/register')}
            className="text-blue-500 hover:text-blue-700 text-sm"
          >
            创建新账号
          </button>
        </div>
      </form>
    </div>
  );
}