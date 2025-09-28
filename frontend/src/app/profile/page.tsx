"use client";
import React from "react";
import BottomNav from "../components/BottomNav";
import Link from "next/link"

const ProfilePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white pb-20 font-inter">
      {/* 顶部状态栏和导航栏 */}
      <div className="bg-white pb-4 border-b border-gray-100 h-[113px] mb-4">
        {/* 状态栏占位 */}
        <div className="h-11"></div>

        {/* 导航栏 */}
        <div className="flex py-4 px-4 items-center gap-4 h-[69px]">
          {/* 返回按钮 */}
          <Link href="/">
            <button className="w-14 h-[37px] px-4 py-[6.5px] flex items-center justify-center rounded-full border border-gray-200">
              <svg
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.7912 11.9552H7.62124L12.5012 7.07517C12.8912 6.68517 12.8912 6.04517 12.5012 5.65517C12.1112 5.26517 11.4812 5.26517 11.0912 5.65517L4.50124 12.2452C4.11124 12.6352 4.11124 13.2652 4.50124 13.6552L11.0912 20.2452C11.4812 20.6352 12.1112 20.6352 12.5012 20.2452C12.8912 19.8552 12.8912 19.2252 12.5012 18.8352L7.62124 13.9552H18.7912C19.3412 13.9552 19.7912 13.5052 19.7912 12.9552C19.7912 12.4052 19.3412 11.9552 18.7912 11.9552Z"
                  fill="#0768FD"
                />
              </svg>
            </button>
          </Link>

          {/* 页面标题 */}
          <h1 className="text-xl font-semibold text-[#1B1446]">我的</h1>
        </div>
      </div>

      {/* 用户信息区域 */}
      <div className="px-4">
        <div className="flex flex-col items-center gap-4 h-[153px] mb-4">
          {/* 头像区域 */}
          <div className="relative">
            {/* 圆形虚线边框 */}
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-blue-100 flex items-center justify-center">
              {/* 头像 */}
              <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-2xl font-semibold text-gray-600">星</span>
              </div>
            </div>

            {/* 编辑按钮 */}
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center">
              <svg
                width="31"
                height="31"
                viewBox="0 0 31 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="2"
                  y="2.40063"
                  width="27"
                  height="27"
                  rx="13.5"
                  fill="#0768FD"
                />
                <rect
                  x="2"
                  y="2.40063"
                  width="27"
                  height="27"
                  rx="13.5"
                  stroke="white"
                  stroke-width="3"
                />
                <path
                  d="M9.49921 19.4014V21.9014H11.9992L19.3725 14.5281L16.8725 12.0281L9.49921 19.4014ZM21.3059 12.5948C21.5659 12.3348 21.5659 11.9148 21.3059 11.6548L19.7459 10.0948C19.4859 9.83478 19.0659 9.83478 18.8059 10.0948L17.5859 11.3148L20.0859 13.8148L21.3059 12.5948Z"
                  fill="white"
                />
              </svg>
            </button>
          </div>

          {/* 用户信息 */}
          <div className="text-center">
            <h2 className="text-[18px] font-semibold text-[#1B1446] mb-1">
              星韦沪
            </h2>
            <p className="text-[12px] text-gray-500">pamungkas17@gmail.com</p>
          </div>
        </div>
      </div>

      {/* 账户设置区域 */}
      <div className="px-4 mb-8">
        <h3 className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-3">
          账户
        </h3>

        {/* 个人信息菜单项 */}
        <div className="flex items-center justify-between py-4 px-3 bg-white rounded-xl border border-gray-100 mb-2">
          <span className="text-[14px] font-medium text-[#1B1446]">
            个人信息
          </span>
          <svg
            width="20"
            height="21"
            viewBox="0 0 20 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.49998 14.1298L10.7333 10.8965L7.49998 7.66313C7.17498 7.33813 7.17498 6.81313 7.49998 6.48813C7.82498 6.16313 8.34998 6.16313 8.67498 6.48813L12.5 10.3131C12.825 10.6381 12.825 11.1631 12.5 11.4881L8.67498 15.3131C8.34998 15.6381 7.82498 15.6381 7.49998 15.3131C7.18331 14.9881 7.17498 14.4548 7.49998 14.1298Z"
              fill="#0768FD"
            />
          </svg>
        </div>

        {/* 历史行程记录菜单项 */}
        <Link href="/historylist">
          <div className="flex items-center justify-between py-4 px-3 bg-white rounded-xl border border-gray-100">
            <span className="text-sm font-medium text-[#1B1446]">
              历史行程记录
            </span>
            <svg
              width="20"
              height="21"
              viewBox="0 0 20 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.49998 14.1298L10.7333 10.8965L7.49998 7.66313C7.17498 7.33813 7.17498 6.81313 7.49998 6.48813C7.82498 6.16313 8.34998 6.16313 8.67498 6.48813L12.5 10.3131C12.825 10.6381 12.825 11.1631 12.5 11.4881L8.67498 15.3131C8.34998 15.6381 7.82498 15.6381 7.49998 15.3131C7.18331 14.9881 7.17498 14.4548 7.49998 14.1298Z"
                fill="#0768FD"
              />
            </svg>
          </div>
        </Link>
      </div>

      {/* 分隔线 */}
      <div className="px-4">
        <div className="border-t border-gray-100"></div>
      </div>

      {/* 设定区域 */}
      <div className="px-4">
        <h3 className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">
          设定
        </h3>

        {/* 意见反馈菜单项 */}
        <div className="flex items-center justify-between py-4 px-3 bg-white rounded-xl border border-gray-100 mb-2">
          <span className="text-sm font-medium text-[#1B1446]">意见反馈</span>
          <svg
            width="20"
            height="21"
            viewBox="0 0 20 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.49998 14.1298L10.7333 10.8965L7.49998 7.66313C7.17498 7.33813 7.17498 6.81313 7.49998 6.48813C7.82498 6.16313 8.34998 6.16313 8.67498 6.48813L12.5 10.3131C12.825 10.6381 12.825 11.1631 12.5 11.4881L8.67498 15.3131C8.34998 15.6381 7.82498 15.6381 7.49998 15.3131C7.18331 14.9881 7.17498 14.4548 7.49998 14.1298Z"
              fill="#0768FD"
            />
          </svg>
        </div>

        {/* 修改密码菜单项 */}
        <div className="flex items-center justify-between py-4 px-3 bg-white rounded-xl border border-gray-100 mb-2">
          <span className="text-sm font-medium text-[#1B1446]">修改密码</span>
          <svg
            width="20"
            height="21"
            viewBox="0 0 20 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.49998 14.1298L10.7333 10.8965L7.49998 7.66313C7.17498 7.33813 7.17498 6.81313 7.49998 6.48813C7.82498 6.16313 8.34998 6.16313 8.67498 6.48813L12.5 10.3131C12.825 10.6381 12.825 11.1631 12.5 11.4881L8.67498 15.3131C8.34998 15.6381 7.82498 15.6381 7.49998 15.3131C7.18331 14.9881 7.17498 14.4548 7.49998 14.1298Z"
              fill="#0768FD"
            />
          </svg>
        </div>

        {/* 登出账户菜单项 */}
        <div className="flex items-center justify-between py-4 px-3 bg-white rounded-xl border border-gray-100">
          <span className="text-sm font-semibold text-red-500">登出账户</span>
          <svg
            width="20"
            height="21"
            viewBox="0 0 20 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.49998 14.1298L10.7333 10.8965L7.49998 7.66313C7.17498 7.33813 7.17498 6.81313 7.49998 6.48813C7.82498 6.16313 8.34998 6.16313 8.67498 6.48813L12.5 10.3131C12.825 10.6381 12.825 11.1631 12.5 11.4881L8.67498 15.3131C8.34998 15.6381 7.82498 15.6381 7.49998 15.3131C7.18331 14.9881 7.17498 14.4548 7.49998 14.1298Z"
              fill="#0768FD"
            />
          </svg>
        </div>
      </div>

      {/* 底部导航栏 */}
      <BottomNav />
    </div>
  );
};

export default ProfilePage;
