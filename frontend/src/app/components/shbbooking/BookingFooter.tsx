// src/components/booking/BookingFooter.tsx
import { ChevronDown } from 'lucide-react';

const BookingFooter = ({ total }: { total: number }) => (
  // 1. `fixed bottom-0` - 将其固定在浏览器窗口底部。
  // 2. `left-0 right-0` - 让其横向延展，为 mx-auto 提供计算依据。
  // 3. `z-20` - 确保它在最上层。
  // 4. `mx-auto max-w-[375px]` - 与页面主体内容使用完全相同的宽度和居中设置，实现完美对齐。
  <footer className="fixed bottom-0 left-0 right-0 z-20 mx-auto max-w-[375px] rounded-t-xl bg-white p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex justify-between items-center">
    <div>
      <div className="flex items-center gap-1 text-sm text-gray-600">
        总计 <ChevronDown size={16} />
      </div>
      <p className="text-2xl font-bold text-gray-900">¥{total}</p>
    </div>
    <button className="bg-blue-500 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-600 transition-colors">
      添加到行程表
    </button>
  </footer>
);

export default BookingFooter;