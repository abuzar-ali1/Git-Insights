// components/dashboard/ChartContainer.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer
} from 'recharts';
import { MoreVertical, Download, Maximize2, Eye, Loader2 } from 'lucide-react';

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

interface ChartContainerProps {
  title: string;
  description: string;
  type: 'line' | 'bar' | 'pie';
  height?: number;
  data?: any[];
  isLoading?: boolean;
  dataKey?: string;
}

export default function ChartContainer({ 
  title, 
  description, 
  type, 
  height = 300,
  data = [],
  isLoading = false,
  dataKey = 'value'
}: ChartContainerProps) {
  const [timeRange, setTimeRange] = useState('week');

  // Determine chart labels based on type
  const getChartConfig = () => {
    switch (type) {
      case 'line':
        return {
          xKey: 'name',
          yKey: dataKey,
          lineColors: ['#3B82F6', '#8B5CF6'],
          lineNames: ['Commits', 'Contributors'],
          tooltipLabel: 'commits'
        };
      case 'bar':
        return {
          xKey: 'name',
          yKey: dataKey,
          barColor: '#3B82F6',
          tooltipLabel: dataKey.toLowerCase()
        };
      case 'pie':
        return {
          dataKey: 'value',
          nameKey: 'name',
          tooltipLabel: 'percentage'
        };
    }
  };

  const config = getChartConfig();

  const renderChart = () => {
    if (isLoading || !data || data.length === 0) {
      return (
        <div className="flex items-center justify-center" style={{ height }}>
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">Loading chart data...</p>
          </div>
        </div>
      );
    }

    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey={config.xKey} stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [`${value} commits`, 'Count']}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={config.yKey}
                stroke={config.lineColors[0]} 
                strokeWidth={2}
                dot={{ fill: config.lineColors[0], strokeWidth: 2 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey={config.xKey} stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [`${value}`, dataKey]}
              />
              <Bar 
                dataKey={config.yKey} 
                fill={config.barColor}
                radius={[4, 4, 0, 0]}
              >
                {data.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={`url(#colorGradient${index})`}
                  />
                ))}
              </Bar>
              <defs>
                {data.map((_, index) => (
                  <linearGradient
                    key={index}
                    id={`colorGradient${index}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.2} />
                  </linearGradient>
                ))}
              </defs>
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
                formatter={(value: number, name: string) => [`${value}%`, name]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <button 
              className="rounded-lg p-2 text-gray-400 hover:text-white hover:bg-gray-800"
              title="Download"
            >
              <Download className="h-4 w-4" />
            </button>
            <button 
              className="rounded-lg p-2 text-gray-400 hover:text-white hover:bg-gray-800"
              title="Expand"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      {renderChart()}
      
      <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center space-x-4">
          {type === 'line' && data.length > 0 && (
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span>Commits</span>
            </div>
          )}
          {type === 'pie' && data.map((item, index) => (
            <div key={item.name} className="flex items-center space-x-2">
              <div 
                className="h-2 w-2 rounded-full" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span>{item.name}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <Eye className="h-4 w-4" />
          <span>{isLoading ? 'Loading...' : 'Updated just now'}</span>
        </div>
      </div>
    </motion.div>
  );
}