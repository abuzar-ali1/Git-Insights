// components/dashboard/LiveMetrics.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  GitFork, 
  Eye, 
  GitPullRequest, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown,
  Clock,
  AlertCircle,
  Users,
  Code
} from 'lucide-react';

interface LiveMetricsProps {
  repoPath?: string;
  repoData?: any;
}

export default function LiveMetrics({ repoPath = "facebook/react", repoData }: LiveMetricsProps) {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [pollingCount, setPollingCount] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [previousData, setPreviousData] = useState<any>(null);

  // Calculate change from previous data
  const calculateChange = (current: number, previous: number) => {
    if (!previous || previous === 0) return '+0';
    const change = ((current - previous) / previous) * 100;
    return change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
  };

  // Get change data for each metric
  const getChangeData = (current: number, key: string) => {
    if (!previousData || !previousData[key]) {
      return {
        value: '+0%',
        isPositive: true,
        icon: <TrendingUp className="h-4 w-4" />
      };
    }
    
    const change = calculateChange(current, previousData[key]);
    const isPositive = !change.startsWith('-');
    
    return {
      value: change,
      isPositive,
      icon: isPositive ? 
        <TrendingUp className="h-4 w-4" /> : 
        <TrendingDown className="h-4 w-4" />
    };
  };

  // Simulate real-time updates by polling (in a real app, you'd use WebSocket)
  useEffect(() => {
    if (!repoData) return;

    const interval = setInterval(() => {
      setPollingCount(prev => prev + 1);
      setLastUpdate(new Date());
      
      // Every 10 polls, update previous data for change calculations
      if (pollingCount % 10 === 0) {
        setPreviousData(repoData);
      }
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, [repoData, pollingCount]);

  // Format large numbers
  const formatNumber = (num: number) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  // Handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // In a real app, you would call the refetch function here
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    setLastUpdate(new Date());
    setPollingCount(prev => prev + 1);
    setIsRefreshing(false);
  };

  // Repository activity metrics
  const metrics = [
    {
      label: 'Stars',
      value: repoData?.stargazers_count ? formatNumber(repoData.stargazers_count) : '0',
      rawValue: repoData?.stargazers_count || 0,
      change: getChangeData(repoData?.stargazers_count || 0, 'stargazers_count'),
      icon: <Star className="h-5 w-5 text-yellow-500" />,
      color: 'yellow',
      description: 'Total stargazers'
    },
    {
      label: 'Forks',
      value: repoData?.forks_count ? formatNumber(repoData.forks_count) : '0',
      rawValue: repoData?.forks_count || 0,
      change: getChangeData(repoData?.forks_count || 0, 'forks_count'),
      icon: <GitFork className="h-5 w-5 text-blue-500" />,
      color: 'blue',
      description: 'Repository forks'
    },
    {
      label: 'Watchers',
      value: repoData?.watchers_count ? formatNumber(repoData.watchers_count) : '0',
      rawValue: repoData?.watchers_count || 0,
      change: getChangeData(repoData?.watchers_count || 0, 'watchers_count'),
      icon: <Eye className="h-5 w-5 text-green-500" />,
      color: 'green',
      description: 'Users watching'
    },
    {
      label: 'Open Issues',
      value: repoData?.open_issues_count ? formatNumber(repoData.open_issues_count) : '0',
      rawValue: repoData?.open_issues_count || 0,
      change: getChangeData(repoData?.open_issues_count || 0, 'open_issues_count'),
      icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      color: 'red',
      description: 'Active issues & PRs'
    }
  ];

  // Calculate repository age
  const getRepoAge = () => {
    if (!repoData?.created_at) return 'N/A';
    const created = new Date(repoData.created_at);
    const now = new Date();
    const years = now.getFullYear() - created.getFullYear();
    const months = now.getMonth() - created.getMonth();
    return years > 0 ? `${years} years` : `${months} months`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 p-6"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <div className="relative">
              <div className="absolute h-3 w-3 animate-ping rounded-full bg-green-500 opacity-75" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-white">Repository Activity</h3>
          </div>
          <p className="text-sm text-gray-400">Real-time GitHub metrics</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="rounded-lg border border-gray-700 bg-gray-800 p-2 text-gray-400 hover:text-white disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </motion.button>
      </div>

      {/* Live Metrics Grid */}
      <div className="space-y-4 mb-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="rounded-lg border border-gray-800 bg-gray-900/50 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className={`rounded-lg bg-${metric.color}-500/10 p-2`}>
                  {metric.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-400">{metric.label}</p>
                  <p className="text-2xl font-bold text-white">{metric.value}</p>
                </div>
              </div>
              
              <div className={`text-sm font-medium ${metric.change.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {metric.change.value}
              </div>
            </div>
            
            <div className="text-xs text-gray-500 mb-2">{metric.description}</div>
            
            {/* Progress bar based on value */}
            <div className="h-2 w-full rounded-full bg-gray-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ 
                  width: `${Math.min((metric.rawValue / 100000) * 100, 100)}%`
                }}
                transition={{ delay: index * 0.2, duration: 1 }}
                className={`h-full rounded-full bg-gradient-to-r from-${metric.color}-500 to-${metric.color}-600`}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Repository Status */}
      <div className="space-y-4">
        <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Code className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">Repository Status</p>
                <p className="text-white">{repoData?.private ? 'Private' : 'Public'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-sm text-green-400">Active</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Clock className="h-4 w-4 text-gray-400" />
                <p className="text-sm text-gray-400">Last Updated</p>
              </div>
              <p className="text-sm text-white">
                {lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Users className="h-4 w-4 text-gray-400" />
                <p className="text-sm text-gray-400">Repo Age</p>
              </div>
              <p className="text-sm text-white">{getRepoAge()}</p>
            </div>
          </div>
        </div>

        {/* Polling Status */}
        <div className="text-xs text-gray-500 text-center pt-2">
          <div className="flex items-center justify-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span>Polling every 10 seconds</span>
          </div>
          <p>Next update in {10 - (pollingCount % 10)} seconds</p>
        </div>
      </div>
    </motion.div>
  );
}