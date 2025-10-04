"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isProfile = pathname?.startsWith("/profile") ?? false;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-20 pt-4 px-2">
      <div className="flex justify-around items-center">
        {/* 首页 */}
        <Link href="/" className="flex flex-col items-center justify-center">
          {/* 使用蓝色表示当前选中状态 */}
          <svg
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.8728 19.3275V14.3275H14.8728V19.3275C14.8728 19.8775 15.3228 20.3275 15.8728 20.3275H18.8728C19.4228 20.3275 19.8728 19.8775 19.8728 19.3275V12.3275H21.5728C22.0328 12.3275 22.2528 11.7575 21.9028 11.4575L13.5428 3.92749C13.1628 3.58749 12.5828 3.58749 12.2028 3.92749L3.84278 11.4575C3.50278 11.7575 3.71278 12.3275 4.17278 12.3275H5.87278V19.3275C5.87278 19.8775 6.32278 20.3275 6.87278 20.3275H9.87278C10.4228 20.3275 10.8728 19.8775 10.8728 19.3275Z"
              fill={isHome ? "#0768FD" : "#1B1446"}
              opacity={isHome ? 1 : 0.16}
            />
          </svg>

          <span className={`text-[12px] font-medium mt-1 ${isHome ? "text-blue-600" : "text-[#808080]"}`}>
            主页
          </span>
        </Link>

        {/* 喜欢 */}
        <div className="flex flex-col items-center">
          <svg
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.16">
              <path
                d="M3.69373 5.25757C3.69373 4.15757 4.59373 3.25757 5.69373 3.25757H12.6937C12.0637 4.09757 11.6937 5.12757 11.6937 6.25757C11.6937 9.01757 13.9337 11.2576 16.6937 11.2576C17.0337 11.2576 17.3737 11.2276 17.6937 11.1576V19.7376C17.6937 20.4576 16.9637 20.9376 16.3037 20.6576L10.6937 18.2576L5.08373 20.6576C4.42373 20.9476 3.69373 20.4576 3.69373 19.7376V5.25757ZM20.7637 3.59757C21.1537 3.98757 21.1537 4.61757 20.7637 5.00757L17.2237 8.54757C16.8337 8.93757 16.2037 8.93757 15.8137 8.54757L14.4037 7.13757C14.0137 6.74757 14.0137 6.11757 14.4037 5.72757C14.7937 5.33757 15.4237 5.33757 15.8137 5.72757L16.5237 6.43757L19.3537 3.60757C19.7437 3.20757 20.3737 3.20757 20.7637 3.59757Z"
                fill="#1B1446"
              />
            </g>
          </svg>

          <span className="text-[12px] text-[#808080] mt-1">喜欢</span>

        </div>

        {/* 我的 */}
        <Link href="/profile" className="flex flex-col items-center">
          <svg
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity={isProfile ? 1 : 0.16}>
              <path
                d="M12.125 12C14.335 12 16.125 10.21 16.125 8C16.125 5.79 14.335 4 12.125 4C9.915 4 8.125 5.79 8.125 8C8.125 10.21 9.915 12 12.125 12ZM12.125 14C9.455 14 4.125 15.34 4.125 18V19C4.125 19.55 4.575 20 5.125 20H19.125C19.675 20 20.125 19.55 20.125 19V18C20.125 15.34 14.795 14 12.125 14Z"
                fill={isProfile ? "#0768FD" : "#1B1446"}
              />
            </g>
          </svg>
          <span className={`text-[12px] mt-1 ${isProfile ? "text-blue-600" : "text-[#808080]"}`}>我的</span>
        </Link>
      </div>
    </nav>
  );
};
export default BottomNav;
