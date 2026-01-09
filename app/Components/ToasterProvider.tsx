"use client";
import { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline';

// Define the context type
interface ToastContextType {
  showComingSoon: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [showToast, setShowToast] = useState(false);

  const showComingSoon = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <ToastContext.Provider value={{ showComingSoon }}>
      {children}
      
      {/* Toast Component */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="fixed bottom-4 right-4 z-50 bg-gray-900 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-sm border border-cyan-500/20 backdrop-blur-sm"
            role="alert"
            aria-live="polite"
          >
            <WrenchScrewdriverIcon className="w-5 h-5 text-cyan-400 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">Coming Soon</p>
              <p className="text-sm text-gray-300">Feature is under development</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
};

// Hook to use toast
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};