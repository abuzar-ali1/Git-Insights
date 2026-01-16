'use client';

import { motion } from 'framer-motion';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Loader2, AlertCircle } from 'lucide-react';
import { LanguageStat } from '@/hooks/useLanguages';

interface Props {
  data: LanguageStat[];
  isLoading: boolean;
  error?: string;
}

export default function LanguageChart({ data, isLoading, error }: Props) {
  
  if (isLoading) return (
    <div className="h-[400px] flex flex-col items-center justify-center text-yellow-500 bg-[#161b22] rounded-xl border border-gray-800">
      <Loader2 className="w-10 h-10 animate-spin mb-4" />
      <p>Decoding syntax...</p>
    </div>
  );

  if (error) return (
    <div className="h-[400px] flex flex-col items-center justify-center text-red-400 bg-[#161b22] rounded-xl border border-gray-800">
      <AlertCircle className="w-10 h-10 mb-4" />
      <p>{error}</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      
      {/* 1. The Donut Chart */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="h-[400px] bg-[#161b22] border border-gray-800 rounded-xl p-6 relative"
      >
        <h3 className="text-lg font-bold text-white mb-4">Composition</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data as any}
              innerRadius={80} // Creates the "Donut" hole
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
               contentStyle={{ backgroundColor: '#0d1117', borderRadius: '8px', border: '1px solid #333' }}
               itemStyle={{ color: '#fff' }}
               formatter={(value: any) => `${value}%`}
            />\
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none pt-10">
          <div className="text-center">
            <span className="block text-3xl font-bold text-white">{data.length}</span>
            <span className="text-xs text-gray-500 uppercase">Languages</span>
          </div>
        </div>
      </motion.div>

      {/* 2. The Ingredient List */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#161b22] border border-gray-800 rounded-xl p-6 overflow-y-auto max-h-[400px]"
      >
        <h3 className="text-lg font-bold text-white mb-6">Breakdown</h3>
        <div className="space-y-4">
          {data.map((lang) => (
            <div key={lang.name} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <span 
                  className="w-3 h-3 rounded-full shadow-lg shadow-black/50" 
                  style={{ backgroundColor: lang.color }}
                />
                <span className="font-medium text-gray-200 group-hover:text-white transition-colors">
                  {lang.name}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 font-mono">
                  {(lang.bytes / 1024).toFixed(0)} KB
                </span>
                <span className="text-sm font-bold text-white w-12 text-right">
                  {lang.value}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

    </div>
  );
}