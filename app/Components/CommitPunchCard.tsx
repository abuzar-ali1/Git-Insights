'use client';

import { motion } from 'framer-motion';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  Tooltip,
  CartesianGrid 
} from 'recharts';
import { Loader2, AlertCircle } from 'lucide-react';
import { PunchCardData } from '@/hooks/useCommits';

interface Props {
  data: PunchCardData[];
  isLoading: boolean;
  error?: string;
}

// Helpers for labels
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const formatHour = (tick: number) => {
  if (tick === 0) return '12am';
  if (tick === 12) return '12pm';
  return tick > 12 ? `${tick - 12}pm` : `${tick}am`;
};

export default function CommitPunchCard({ data, isLoading, error }: Props) {
  
  // Custom Tooltip Design
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { day, hour, count } = payload[0].payload;
      return (
        <div className="bg-[#161b22] border border-gray-700 p-3 rounded-lg shadow-xl text-xs">
          <p className="font-bold text-white mb-1">
            {DAYS[day]} at {formatHour(hour)}
          </p>
          <p className="text-blue-400">
            {count} {count === 1 ? 'commit' : 'commits'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-[#161b22] border border-gray-800 rounded-xl p-4 lg:p-8 shadow-xl"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white">Commit Punch Card</h3>
        <p className="text-gray-400 text-sm">
          Circle size represents activity. Find your most productive hours.
        </p>
      </div>

      <div className="h-[400px] w-full relative flex items-center justify-center bg-[#0d1117]/50 rounded-lg border border-gray-800/50">
        
        {isLoading && (
          <div className="flex flex-col items-center gap-2 text-blue-500">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-sm">Calculating work hours...</span>
          </div>
        )}

        {error && !isLoading && (
           <div className="text-center px-4 text-red-400">
             <AlertCircle className="w-8 h-8 mx-auto mb-2" />
             <p>{error}</p>
           </div>
        )}

        {!isLoading && !error && (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363d" horizontal={true} vertical={false} />
              
              {/* X-Axis: Hours (0-23) */}
              <XAxis 
                type="number" 
                dataKey="hour" 
                name="Hour" 
                domain={[0, 23]} 
                tickCount={8} 
                tickFormatter={formatHour}
                stroke="#8b949e" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              
              {/* Y-Axis: Days (0-6) */}
              <YAxis 
                type="number" 
                dataKey="day" 
                name="Day" 
                domain={[0, 6]} 
                tickCount={7} 
                tickFormatter={(tick) => DAYS[tick]}
                stroke="#8b949e" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                reversed // Puts Sunday at top, Saturday at bottom
              />
              
              {/* Z-Axis: Controls Bubble Size */}
              <ZAxis type="number" dataKey="count" range={[0, 500]} name="Commits" />
              
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
              
              {/* The Bubbles */}
              <Scatter 
                data={data.filter(d => d.count > 0)} // Only draw dots if count > 0
                fill="#3b82f6" 
                shape="circle" 
              />
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}