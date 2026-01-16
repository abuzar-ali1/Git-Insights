'use client';

import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="h-full min-h-screen w-full flex flex-col items-center justify-center bg-[#0d1117] gap-4">
      {/* Animated Icon */}
      <div className="relative">
        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin relative z-10" />
      </div>
      
      {/* Text */}
      <div className="flex flex-col items-center gap-1">
        <h3 className="text-lg font-bold text-white">Abuzar's Dashboard</h3>
        <p className="text-sm text-gray-500 animate-pulse">Navigating...</p>
      </div>
    </div>
  );
}