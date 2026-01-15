'use client';

import { motion } from 'framer-motion';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { Loader2, AlertCircle } from 'lucide-react';

interface ChartProps {
  title: string;
  description: string;
  data: any[];
  isLoading: boolean;
  dataKey: string;
  color: string;
  error?: string;
}

export default function ChartFrequency({ 
  title, 
  description, 
  data, 
  isLoading, 
  dataKey, 
  color,
  error 
}: ChartProps) {

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-[400px] w-full bg-[#161b22] border border-gray-800 rounded-xl p-6 flex flex-col shadow-xl"
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
          {title}
        </h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>

      {/* Content Area */}
      <div className="flex-1 w-full min-h-0 relative flex items-center justify-center">
        
        {isLoading && (
          <div className="flex flex-col items-center gap-2 text-blue-400">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-sm">Fetching data...</span>
          </div>
        )}

        {error && !isLoading && (
           <div className="text-center px-4">
             <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
             <p className="text-red-400 text-sm">{error}</p>
           </div>
        )}

        {!isLoading && !error && data.length === 0 && (
          <p className="text-gray-500 text-sm">No data available for this repository.</p>
        )}

        {!isLoading && !error && data.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#8b949e" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
                dy={10}
                minTickGap={30}
              />
              <YAxis 
                stroke="#8b949e" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #30363d', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
                labelStyle={{ color: '#8b949e' }}
                formatter={(value: number) => [value.toLocaleString(), dataKey === 'added' ? 'Lines Added' : 'Lines Deleted']}
              />
              <Area 
                type="monotone" 
                dataKey={dataKey} 
                stroke={color} 
                fill={`url(#gradient-${dataKey})`} 
                strokeWidth={2}
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}