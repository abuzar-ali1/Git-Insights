// components/dashboard/KpiCard.tsx (updated)
'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
  delay?: number;
  isLoading?: boolean;
  description?: string;
}

export default function KpiCard({ 
  title, 
  value, 
  change, 
  icon, 
  color, 
  delay = 0, 
  isLoading = false,
  description 
}: KpiCardProps) {
  const isPositive = change?.startsWith('+');
  const isNegative = change?.startsWith('-');
  
  // Loading skeleton
  if (isLoading && value === '...') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="group relative overflow-hidden rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 p-6"
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="h-4 w-24 bg-gray-800 rounded animate-pulse"></div>
              <div className="h-8 w-32 bg-gray-800 rounded animate-pulse"></div>
            </div>
            <div className="h-12 w-12 bg-gray-800 rounded-lg animate-pulse"></div>
          </div>
          <div className="mt-6 flex items-center space-x-2">
            <div className="h-4 w-4 bg-gray-800 rounded animate-pulse"></div>
            <div className="h-4 w-16 bg-gray-800 rounded animate-pulse"></div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ 
        y: -8,
        scale: 1.02,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
      }}
      className="group relative overflow-hidden rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 p-6 transition-all"
    >
      {/* Animated background gradient */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${color}`} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <p className="mt-2 text-3xl font-bold text-white">{value}</p>
          </div>
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="rounded-lg bg-gray-800/50 p-3 backdrop-blur"
          >
            {icon}
          </motion.div>
        </div>
        
        <div className="mt-6 flex items-center">
          {change !== '...' ? (
            <>
              <motion.div
                animate={{ 
                  rotate: isPositive ? [0, 10, 0] : isNegative ? [0, -10, 0] : [0, 0, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {isPositive ? (
                  <TrendingUp className="h-5 w-5 text-green-400" />
                ) : isNegative ? (
                  <TrendingDown className="h-5 w-5 text-red-400" />
                ) : (
                  <TrendingUp className="h-5 w-5 text-gray-400" />
                )}
              </motion.div>
              
              <span className={`ml-2 text-sm font-medium ${
                isPositive ? 'text-green-400' : 
                isNegative ? 'text-red-400' : 
                'text-gray-400'
              }`}>
                {change}
              </span>
              <span className="ml-2 text-sm text-gray-400">from last month</span>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              <span className="text-sm text-gray-400">Calculating change...</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Progress bar */}
      {change !== '...' && (
        <div className="relative mt-4 h-1 w-full overflow-hidden rounded-full bg-gray-800">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: isPositive ? '75%' : isNegative ? '40%' : '50%' }}
            transition={{ delay: delay + 0.3, duration: 1 }}
            className={`absolute left-0 top-0 h-full rounded-full ${
              isPositive 
                ? 'bg-gradient-to-r from-green-500 to-green-400' 
                : isNegative 
                ? 'bg-gradient-to-r from-red-500 to-red-400'
                : 'bg-gradient-to-r from-gray-500 to-gray-400'
            }`}
          />
        </div>
      )}
      
      {description && (
        <p className="mt-3 text-xs text-gray-500">{description}</p>
      )}
    </motion.div>
  );
}