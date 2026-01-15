'use client';

import { motion } from 'framer-motion';
import { Star, GitFork, AlertCircle, Eye, Loader2 } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: number | undefined;
  icon: 'star' | 'fork' | 'issue' | 'eye';
  isLoading?: boolean;
}

export default function KpiCard({ title, value, icon, isLoading }: KpiCardProps) {
  const icons = {
    star: <Star className="w-5 h-5 text-yellow-500 fill-yellow-500/20" />,
    fork: <GitFork className="w-5 h-5 text-blue-500" />,
    issue: <AlertCircle className="w-5 h-5 text-green-500" />,
    eye: <Eye className="w-5 h-5 text-purple-500" />
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
      className="p-5 bg-[#161b22] border border-gray-800 rounded-xl hover:border-gray-700 transition-colors"
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-gray-400 text-sm font-medium">{title}</span>
        <div className="p-2 bg-gray-800/50 rounded-lg">{icons[icon]}</div>
      </div>
      
      {isLoading ? (
        <Loader2 className="w-6 h-6 animate-spin text-gray-600" />
      ) : (
        <div className="flex items-end gap-2">
          <span className="text-2xl font-bold text-white">
            {value !== undefined ? formatNumber(value) : '0'}
          </span>
        </div>
      )}
    </motion.div>
  );
}