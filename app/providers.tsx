'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Sidebar from './Components/Sidebar';
import { ToastProvider } from './Components/ToasterProvider';
// import { Sidebar } from './Co';

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
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
        <Header 
            onMenuClick={handleMenuClick} 
            isSidebarOpen={isMobileSidebarOpen}
          />
          <div className="flex flex-1">
            <Sidebar 
              isMobileOpen={isMobileSidebarOpen}
              onClose={handleSidebarClose}
            />
            <main className="flex-1 overflow-x-hidden">
              {children}
            </main>
          </div>
          <Footer />
          </ ToastProvider>
    </QueryClientProvider>
  );
}