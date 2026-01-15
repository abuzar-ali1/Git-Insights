'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import Header from './Components/Header';
import Sidebar from './Components/Sidebar';
import { ToastProvider } from './Components/ToasterProvider';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: 1,
      },
    },
  }));

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  const handleMenuClick = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleSidebarClose = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <div className="flex h-screen overflow-hidden bg-[#0d1117] text-gray-300">
          
          <Sidebar 
            isMobileOpen={isMobileSidebarOpen}
            onClose={handleSidebarClose}
          />

          <div className="flex flex-col flex-1 min-w-0">
            
            <Header 
              onMenuClick={handleMenuClick} 
            />
            
            {/* Main: Takes remaining space, handles Y-axis scrolling */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-6 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
              {children}
            </main>

          </div>
        </div>
      </ToastProvider>
    </QueryClientProvider>
  );
}