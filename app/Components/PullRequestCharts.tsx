'use client';

import { motion } from 'framer-motion';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, 
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, CartesianGrid, Legend
} from 'recharts';
import { Loader2, AlertCircle, GitPullRequest } from 'lucide-react';
import { PRStats } from '@/hooks/usePullRequests';

interface Props {
  stats: PRStats | null;
  isLoading: boolean;
  error?: string;
}

export default function PullRequestCharts({ stats, isLoading, error }: Props) {
  
  if (isLoading) return (
    <div className="h-64 flex flex-col items-center justify-center text-blue-500">
      <Loader2 className="w-8 h-8 animate-spin mb-2" />
      <span className="text-sm">Analyzing Pull Requests...</span>
    </div>
  );

  if (error) return (
    <div className="h-64 flex flex-col items-center justify-center text-red-400">
      <AlertCircle className="w-8 h-8 mb-2" />
      <p>{error}</p>
    </div>
  );

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#161b22] border border-gray-800 rounded-xl p-6 flex flex-col items-center"
      >
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <GitPullRequest className="w-5 h-5" />
          PR Status Distribution
        </h3>
        <p className="text-xs text-gray-400 mb-4">Success vs. Rejection Rate</p>
        
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats.pieData}
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {stats.pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0d1117', borderRadius: '8px', border: '1px solid #333' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-[#161b22] border border-gray-800 rounded-xl p-6"
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">Merge Speed</h3>
            <p className="text-xs text-gray-400">Time taken from Open to Merge</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-mono font-bold text-purple-400">{stats.averageTime}h</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Avg Time</p>
          </div>
        </div>

        <div className="w-full h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363d" horizontal={true} vertical={false} />
              <XAxis dataKey="date" stroke="#8b949e" fontSize={10} tickLine={false} axisLine={false} dy={10} />
              <YAxis dataKey="duration" stroke="#8b949e" fontSize={10} tickLine={false} axisLine={false} name="Hours" />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-[#0d1117] border border-gray-700 p-2 rounded text-xs text-white">
                        <p className="font-bold mb-1">{data.title}</p>
                        <p className="text-purple-400">{data.duration} hours</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter name="Merge Time" data={stats.scatterData} fill="#8b5cf6" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

    </div>
  );
}