// src/components/booking/BookingFooter.tsx
import { ChevronDown } from 'lucide-react';

const BookingFooter = ({ total }: { total: number }) => (
  // This footer uses fixed positioning with specific alignment properties.
  // 1. `fixed bottom-0`: Pins the footer to the bottom of the viewport.
  // 2. `left-0 right-0`: Stretches it horizontally, necessary for `mx-auto`.
  // 3. `z-20`: Ensures it stays on top of other content.
  // 4. `mx-auto max-w-[375px]`: Matches the main content's width and centering for perfect alignment.
  <footer className="fixed bottom-0 left-0 right-0 z-20 mx-auto max-w-[375px] rounded-t-xl bg-white p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex justify-between items-center">
    <div>
      <div className="flex items-center gap-1 text-sm text-gray-600">
        Total <ChevronDown size={16} />
      </div>
      <p className="text-2xl font-bold text-gray-900">¥{total}</p>
    </div>
    <button className="bg-blue-500 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-600 transition-colors">
      Add to Itinerary
    </button>
  </footer>
);

export default BookingFooter;