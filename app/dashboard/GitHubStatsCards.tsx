// components/dashboard/GitHubStatsCards.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  GitFork, 
  AlertCircle, 
  Code, 
  RefreshCw,
  TrendingUp,
  Globe
} from 'lucide-react';
// import KpiCard from './KpiCard';
import { useGitHubStats } from '@/hooks/useGitHubStats';
import KpiCard from '../Components/KpiCard';

interface GitHubStatsCardsProps {
  repoPath?: string; // Format: "facebook/react"
}

export default function GitHubStatsCards({ repoPath = "vercel/next.js" }: GitHubStatsCardsProps) {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [changeData, setChangeData] = useState({
    stars: '+12%',
    forks: '+8%',
    issues: '-3%',
    size: '+5%'
  });

  // Use your existing useGitHubStats hook
  const { data, isLoading, error, refetch } = useGitHubStats(repoPath);

  // Handle manual refresh
  const handleRefresh = async () => {
    await refetch();
    setLastUpdate(new Date());
  };

  // Format size from KB to readable format
  const formatSize = (kb: number) => {
    if (kb < 1024) return `${kb} KB`;
    const mb = kb / 1024;
    if (mb < 1024) return `${mb.toFixed(1)} MB`;
    const gb = mb / 1024;
    return `${gb.toFixed(1)} GB`;
  };

  // Format number with commas
  const formatNumber = (num: number) => {
    return num?.toLocaleString() || '0';
  };

  // Determine change direction and color
  const getChangeData = (change: string) => {
    const isPositive = change.startsWith('+');
    return {
      isPositive,
      value: change,
      icon: isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />
    };
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="col-span-1 sm:col-span-2 lg:col-span-4 rounded-xl border border-red-500/20 bg-red-500/5 p-8 text-center"
      >
        <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Failed to Load GitHub Data</h3>
        <p className="text-gray-400 mb-4">{error instanceof Error ? error.message : 'Unknown error'}</p>
        <button
          onClick={() => refetch()}
          className="rounded-lg bg-gradient-to-r from-red-500 to-orange-600 px-4 py-2 text-white hover:opacity-90"
        >
          Retry
        </button>
      </motion.div>
    );
  }

  // Define KPI data based on GitHub API response
  const kpiData = [
    {
      title: 'Stars',
      value: isLoading ? '...' : formatNumber(data?.stargazers_count || 0),
      change: isLoading ? '...' : changeData.stars,
      icon: <Star className="h-8 w-8 text-yellow-500" />,
      color: 'from-yellow-500 to-orange-500',
      description: 'Total stargazers',
      tooltip: 'Number of users who starred this repository'
    },
    {
      title: 'Forks',
      value: isLoading ? '...' : formatNumber(data?.forks_count || 0),
      change: isLoading ? '...' : changeData.forks,
      icon: <GitFork className="h-8 w-8 text-blue-500" />,
      color: 'from-blue-500 to-cyan-500',
      description: 'Repository forks',
      tooltip: 'Number of times this repo has been forked'
    },
    {
      title: 'Open Issues',
      value: isLoading ? '...' : formatNumber(data?.open_issues_count || 0),
      change: isLoading ? '...' : changeData.issues,
      icon: <AlertCircle className="h-8 w-8 text-red-500" />,
      color: 'from-red-500 to-pink-500',
      description: 'Active issues',
      tooltip: 'Number of open issues and pull requests'
    },
    {
      title: 'Repository Size',
      value: isLoading ? '...' : formatSize(data?.size || 0),
      change: isLoading ? '...' : changeData.size,
      icon: <Code className="h-8 w-8 text-green-500" />,
      color: 'from-green-500 to-emerald-500',
      description: 'Codebase size',
      tooltip: 'Total size of the repository in kilobytes'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header with repo info and refresh */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 flex items-center justify-center">
              <Globe className="h-6 w-6 text-gray-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {repoPath.split('/')[1] || 'Repository'}
              </h2>
              <p className="text-gray-400">
                <span className="text-blue-400">@{repoPath.split('/')[0]}</span>
                <span className="mx-2">•</span>
                <span>GitHub Analytics</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-400">Last updated</p>
            <p className="text-sm text-white">
              {lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={isLoading}
            className={`rounded-lg p-3 ${
              isLoading 
                ? 'bg-gray-800 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30'
            } border border-gray-700`}
          >
            <RefreshCw className={`h-5 w-5 ${isLoading ? 'text-gray-400 animate-spin' : 'text-white'}`} />
          </motion.button>
        </div>
      </motion.div>

      {/* GitHub Stats KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((item, index) => (
          <div key={item.title}>
            <KpiCard
              title={item.title}
              value={item.value}
              change={item.change}
              icon={item.icon}
              color={item.color}
              delay={index * 0.1}
              isLoading={isLoading}
            />
            <p className="mt-2 text-xs text-gray-500 text-center">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* Additional Repository Info */}
      {data && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6"
        >
          <div className="rounded-lg border border-gray-800 bg-gray-900/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Default Branch</p>
                <p className="text-lg font-semibold text-white">{data.default_branch}</p>
              </div>
              <div className="rounded-lg bg-gray-800 p-2">
                <Code className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-800 bg-gray-900/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Language</p>
                <p className="text-lg font-semibold text-white">{data.language || 'Multiple'}</p>
              </div>
              <div className="rounded-lg bg-gray-800 p-2">
                <Code className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-800 bg-gray-900/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Last Updated</p>
                <p className="text-lg font-semibold text-white">
                  {new Date(data.updated_at).toLocaleDateString()}
                </p>
              </div>
              <div className="rounded-lg bg-gray-800 p-2">
                <RefreshCw className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="col-span-1 sm:col-span-2 lg:col-span-4"
        >
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-400">Fetching GitHub repository data...</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}