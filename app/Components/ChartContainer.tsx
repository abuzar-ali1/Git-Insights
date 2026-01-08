'use client';

import { useState, useEffect } from 'react';
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
import { 
  MoreVertical, 
  Download, 
  Maximize2, 
  Eye, 
  Loader2, 
  ChevronDown,
  Smartphone,
  Tablet,
  Monitor
} from 'lucide-react';

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
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // Detect screen size for responsive adjustments
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      setIsTablet(width >= 640 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Calculate responsive height
  const getResponsiveHeight = () => {
    if (isMobile) return 200;
    if (isTablet) return 250;
    return height;
  };

  // Responsive chart configuration
  const chartConfig = {
    line: {
      strokeWidth: isMobile ? 1.5 : 2,
      dotSize: isMobile ? 2 : 4,
      activeDotSize: isMobile ? 6 : 8,
      fontSize: isMobile ? 10 : 12,
      legendFontSize: isMobile ? 10 : 12
    },
    bar: {
      barSize: isMobile ? 20 : 30,
      fontSize: isMobile ? 10 : 12
    },
    pie: {
      outerRadius: isMobile ? 60 : 80,
      fontSize: isMobile ? 10 : 12,
      labelFontSize: isMobile ? 9 : 11
    }
  };

  const renderChart = () => {
    const chartHeight = getResponsiveHeight();

    if (isLoading || !data || data.length === 0) {
      return (
        <div className="flex items-center justify-center" style={{ height: chartHeight }}>
          <div className="text-center">
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-gray-500 mx-auto mb-2 sm:mb-4" />
            <p className="text-xs sm:text-sm text-gray-400">Loading chart data...</p>
          </div>
        </div>
      );
    }

    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <LineChart data={data} margin={{ 
              top: 10, 
              right: isMobile ? 10 : 30, 
              left: isMobile ? -10 : 0, 
              bottom: 0 
            }}>
              <CartesianGrid 
                strokeDasharray={isMobile ? "2 2" : "3 3"} 
                stroke="#374151" 
                vertical={!isMobile}
              />
              <XAxis 
                dataKey="name" 
                stroke="#9CA3AF"
                tick={{ fontSize: chartConfig.line.fontSize }}
                interval={isMobile ? "preserveStartEnd" : 0}
              />
              <YAxis 
                stroke="#9CA3AF"
                tick={{ fontSize: chartConfig.line.fontSize }}
                width={isMobile ? 30 : 40}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  fontSize: chartConfig.line.fontSize
                }}
                formatter={(value: number | undefined) => [`${value || 0}`, 'Count']}
              />
              {!isMobile && <Legend 
                wrapperStyle={{ fontSize: chartConfig.line.legendFontSize }}
              />}
              <Line 
                type="monotone" 
                dataKey={dataKey}
                stroke="#3B82F6" 
                strokeWidth={chartConfig.line.strokeWidth}
                dot={{ 
                  fill: '#3B82F6', 
                  strokeWidth: chartConfig.line.strokeWidth,
                  r: chartConfig.line.dotSize
                }}
                activeDot={{ r: chartConfig.line.activeDotSize }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart 
              data={data} 
              margin={{ 
                top: 10, 
                right: isMobile ? 10 : 30, 
                left: isMobile ? -10 : 0, 
                bottom: 0 
              }}
            >
              <CartesianGrid 
                strokeDasharray={isMobile ? "2 2" : "3 3"} 
                stroke="#374151" 
              />
              <XAxis 
                dataKey="name" 
                stroke="#9CA3AF"
                tick={{ fontSize: chartConfig.bar.fontSize }}
                interval={isMobile ? "preserveStartEnd" : 0}
              />
              <YAxis 
                stroke="#9CA3AF"
                tick={{ fontSize: chartConfig.bar.fontSize }}
                width={isMobile ? 30 : 40}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  fontSize: chartConfig.bar.fontSize
                }}
                formatter={(value: number | undefined) => [`${value || 0}`, dataKey]}
              />
              {!isMobile && <Legend 
                wrapperStyle={{ fontSize: chartConfig.bar.fontSize }}
              />}
              <Bar 
                dataKey={dataKey} 
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
                barSize={chartConfig.bar.barSize}
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
          <ResponsiveContainer width="100%" height={chartHeight}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => isMobile ? '' : `${name}: ${value}%`}
                outerRadius={chartConfig.pie.outerRadius}
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
                  borderRadius: '8px',
                  fontSize: chartConfig.pie.fontSize
                }}
                formatter={(value: number | undefined, name: string | undefined) => [
                  `${value || 0}%`, 
                  name || ''
                ]}
              />
              {!isMobile && <Legend 
                wrapperStyle={{ fontSize: chartConfig.pie.fontSize }}
                layout={isTablet ? 'horizontal' : 'vertical'}
                verticalAlign={isTablet ? 'bottom' : 'middle'}
                align={isTablet ? 'center' : 'right'}
              />}
            </PieChart>
          </ResponsiveContainer>
        );
        
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 sm:p-6 backdrop-blur"
    >
      {/* Header with responsive layout */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-white truncate">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 truncate">
            {description}
          </p>
        </div>
        
        {/* Responsive controls */}
        <div className="flex items-center justify-between sm:justify-end space-x-2">
          {/* Mobile indicator */}
          {isMobile && (
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Smartphone className="h-3 w-3" />
              <span>Mobile</span>
            </div>
          )}
          {isTablet && !isMobile && (
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Tablet className="h-3 w-3" />
              <span>Tablet</span>
            </div>
          )}
          
          {/* Options dropdown for mobile */}
          {isMobile ? (
            <div className="relative">
              <button 
                onClick={() => setShowOptions(!showOptions)}
                className="rounded-lg p-2 text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
              
              {showOptions && (
                <div className="absolute right-0 mt-2 w-40 rounded-lg border border-gray-700 bg-gray-900 p-2 shadow-xl z-10">
                  <button className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded">
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                  <button className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded">
                    <Maximize2 className="h-4 w-4" />
                    <span>Expand</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-1">
              <button 
                className="rounded-lg p-2 text-gray-400 hover:text-white hover:bg-gray-800"
                title="Download"
              >
                <Download className="h-4 w-4 sm:h-4 sm:w-4" />
              </button>
              <button 
                className="rounded-lg p-2 text-gray-400 hover:text-white hover:bg-gray-800"
                title="Expand"
              >
                <Maximize2 className="h-4 w-4 sm:h-4 sm:w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Chart Area */}
      <div className="relative">
        {renderChart()}
      </div>
      
      {/* Footer with responsive layout */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm text-gray-400 gap-2 sm:gap-0">
        {/* Legend/Info */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          {type === 'line' && data.length > 0 && (
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span className="text-xs">Commits</span>
            </div>
          )}
          {type === 'pie' && data.slice(0, isMobile ? 2 : 3).map((item, index) => (
            <div key={item?.name || index} className="flex items-center space-x-2">
              <div 
                className="h-2 w-2 rounded-full" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-xs truncate max-w-[80px] sm:max-w-none">
                {item?.name || `Item ${index + 1}`}
              </span>
            </div>
          ))}
          {type === 'pie' && data.length > (isMobile ? 2 : 3) && (
            <span className="text-xs text-gray-500">
              +{data.length - (isMobile ? 2 : 3)} more
            </span>
          )}
        </div>
        
        {/* Status Info */}
        <div className="flex items-center space-x-2">
          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="text-xs sm:text-sm">
            {isLoading ? 'Loading...' : 'Updated just now'}
          </span>
        </div>
      </div>

      {/* Screen size indicators for debugging (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 flex items-center space-x-2 text-xs text-gray-600">
          <div className={`h-2 w-2 rounded-full ${isMobile ? 'bg-green-500' : 'bg-gray-600'}`} />
          <span>Mobile: {isMobile ? 'Yes' : 'No'}</span>
          <div className={`h-2 w-2 rounded-full ${isTablet ? 'bg-green-500' : 'bg-gray-600'}`} />
          <span>Tablet: {isTablet ? 'Yes' : 'No'}</span>
          <div className={`h-2 w-2 rounded-full ${!isMobile && !isTablet ? 'bg-green-500' : 'bg-gray-600'}`} />
          <span>Desktop: {!isMobile && !isTablet ? 'Yes' : 'No'}</span>
        </div>
      )}
    </motion.div>
  );
}