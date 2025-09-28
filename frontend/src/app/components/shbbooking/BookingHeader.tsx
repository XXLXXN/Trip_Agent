// src/components/booking/BookingHeader.tsx
import { ArrowLeft } from 'lucide-react';

const BookingHeader = ({ title }: { title: string }) => (
  // Changed to fixed position, top-0
  // It will be constrained by the parent's max-width
  <header className="fixed top-0 left-0 right-0 z-20 mx-auto h-14 max-w-[375px] bg-white/80 backdrop-blur-sm flex items-center justify-center">
    <button className="absolute left-4">
      <ArrowLeft size={24} className="text-gray-800" />
    </button>
    <h1 className="text-xl font-bold text-gray-900">{title}</h1>
  </header>
);

export default BookingHeader;