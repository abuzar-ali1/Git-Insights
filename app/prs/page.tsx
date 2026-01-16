'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitPullRequest, Github, Search, Flame } from 'lucide-react';
import { usePullRequests } from '@/hooks/usePullRequests';
import PullRequestCharts from '../Components/PullRequestCharts';

const SUGGESTIONS = [
  'facebook/react',
  'vercel/next.js',
  'tailwindlabs/tailwindcss',
  'shadcn-ui/ui',
  'microsoft/TypeScript'
];

export default function PullsPage() {
  const [inputValue, setInputValue] = useState('facebook/react');
  const [activeRepo, setActiveRepo] = useState('facebook/react');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Call the hook
  const { data, isLoading, error, fetchPRs } = usePullRequests();
  const containerRef = useRef<HTMLDivElement>(null);

  // Initial Load
  useEffect(() => {
    fetchPRs('facebook/react');
    
    // Click outside listener for dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [fetchPRs]);

  const handleSubmit = (e: React.FormEvent | string) => {
    if (typeof e !== 'string') e.preventDefault();
    const targetRepo = typeof e === 'string' ? e : inputValue;

    if (targetRepo.includes('/')) {
      setInputValue(targetRepo);
      setActiveRepo(targetRepo);
      fetchPRs(targetRepo);
      setShowSuggestions(false);
    }
  };

  const filteredSuggestions = SUGGESTIONS.filter(repo => 
    repo.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0d1117] p-4 lg:p-8 text-white">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
            <GitPullRequest className="w-8 h-8 text-purple-500" />
            Pull Requests
          </h1>
          <p className="text-gray-400">
            Analyzing delivery speed for <span className="font-mono text-purple-400 bg-purple-500/10 px-2 py-1 rounded">{activeRepo}</span>
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-96" ref={containerRef}>
          <form onSubmit={handleSubmit} className="relative">
            <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              placeholder="owner/repo..."
              className="w-full bg-[#161b22] border border-gray-700 rounded-lg py-3 pl-10 pr-24 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder:text-gray-600"
            />
            <button 
              type="submit"
              disabled={isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-xs font-bold text-white px-4 py-1.5 rounded-md transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Analyze'}
            </button>
          </form>

          {/* Suggestions Dropdown */}
          <AnimatePresence>
            {showSuggestions && (filteredSuggestions.length > 0 || inputValue === '') && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-50 w-full mt-2 bg-[#1c2128] border border-gray-700 rounded-lg shadow-xl overflow-hidden"
              >
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-[#161b22] border-b border-gray-700 flex items-center gap-2">
                  <Flame className="w-3 h-3 text-orange-500" />
                  POPULAR EXAMPLES
                </div>
                {filteredSuggestions.map((repo) => (
                  <button
                    key={repo}
                    onClick={() => handleSubmit(repo)}
                    className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-purple-500/10 hover:text-purple-400 transition-colors flex items-center gap-2 group"
                  >
                    <Search className="w-3 h-3 text-gray-600 group-hover:text-purple-400" />
                    {repo}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Charts Section */}
      <PullRequestCharts stats={data} isLoading={isLoading} error={error} />
      
    </div>
  );
}