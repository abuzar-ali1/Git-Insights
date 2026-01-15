'use client';

import { motion } from 'framer-motion';
import { Search, Filter, ArrowUpDown, LayoutGrid, Loader2, FolderGit2 , AlertCircle } from 'lucide-react';
import { useRepositories } from '@/hooks/useRepositories';
import RepoCard from '../Components/RepoCard';
// import RepoCard from '@/components/RepoCard';

export default function ReposPage() {
  const { 
    repos, 
    isLoading, 
    isError, 
    search, setSearch, 
    sort, setSort, 
    filterType, setFilterType 
  } = useRepositories('facebook'); // Replace 'facebook' with your username later

  // Skeleton Loader Component
  const RepoSkeleton = () => (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-5 h-48 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="w-8 h-8 bg-gray-800 rounded-full" />
        <div className="w-16 h-6 bg-gray-800 rounded-full" />
      </div>
      <div className="w-3/4 h-6 bg-gray-800 rounded mb-2" />
      <div className="w-full h-4 bg-gray-800 rounded mb-2" />
      <div className="w-1/2 h-4 bg-gray-800 rounded" />
    </div>
  );

  if (isError) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-400">
      <AlertCircle className="w-12 h-12 mb-4" />
      <h2 className="text-xl font-bold">Failed to load repositories</h2>
      <p className="text-sm opacity-80">Please try again later.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0d1117] p-4 lg:p-8">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FolderGit2 className="w-8 h-8 text-blue-500" />
            Repositories
          </h1>
          <p className="text-gray-400 mt-1">
            Manage and view your projects. Total: <span className="text-white font-mono">{repos.length}</span>
          </p>
        </div>

        {/* Controls Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Find a repository..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 bg-[#161b22] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <select 
              value={sort}
              onChange={(e) => setSort(e.target.value as 'stars' | 'updated')}
              className="w-full sm:w-auto bg-[#161b22] border border-gray-700 rounded-lg py-2 pl-10 pr-8 text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
            >
              <option value="updated">Last Updated</option>
              <option value="stars">Most Stars</option>
            </select>
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full sm:w-auto bg-[#161b22] border border-gray-700 rounded-lg py-2 pl-10 pr-8 text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Repository Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <RepoSkeleton key={i} />)}
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {repos.length > 0 ? (
            repos.map((repo, index) => (
              <RepoCard key={repo.id} repo={repo} index={index} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="bg-gray-800/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-white">No repositories found</h3>
              <p className="text-gray-500">Try adjusting your search or filters.</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}