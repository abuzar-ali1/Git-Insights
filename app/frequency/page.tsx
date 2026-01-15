'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Github, Search, Flame } from 'lucide-react';
import { useCodeFrequency } from '@/hooks/useCodeFrequency';
import ChartFrequency from '../Components/ChartFrequency';

// 1. Define your examples here
const SUGGESTIONS = [
  'facebook/react',
  'shadcn-ui/ui',
  'abuzar-ali1/dummy-shop',
  'vercel/next.js',
  'tailwindlabs/tailwindcss',
  'microsoft/TypeScript'
];

export default function FrequencyPage() {
  const [inputValue, setInputValue] = useState('shadcn-ui/ui');
  const [activeRepo, setActiveRepo] = useState('shadcn-ui/ui');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const { data, isLoading, error, fetchFrequency } = useCodeFrequency();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchFrequency('shadcn-ui/ui');

    // Close suggestions if clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [fetchFrequency]);

  const handleSubmit = (e: React.FormEvent | string) => {
    // Check if e is an event or a string (from suggestion click)
    if (typeof e !== 'string') e.preventDefault();
    
    const targetRepo = typeof e === 'string' ? e : inputValue;

    if (targetRepo.includes('/')) {
      setInputValue(targetRepo);
      setActiveRepo(targetRepo); 
      fetchFrequency(targetRepo);
      setShowSuggestions(false);
    }
  };

  // Filter suggestions based on what user is typing
  const filteredSuggestions = SUGGESTIONS.filter(repo => 
    repo.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0d1117] p-4 lg:p-8 text-white">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
            <Activity className="w-8 h-8 text-blue-500" />
            Code Frequency
          </h1>
          <p className="text-gray-400">
            Visualizing the heartbeat of <span className="font-mono text-blue-400 bg-blue-500/10 px-2 py-1 rounded">{activeRepo}</span>
          </p>
        </div>

        {/* Search Bar with Suggestions */}
        <div className="relative w-full md:w-96" ref={containerRef}>
          <form onSubmit={handleSubmit} className="relative">
            <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              placeholder="owner/repo (e.g. vercel/next.js)"
              className="w-full bg-[#161b22] border border-gray-700 rounded-lg py-3 pl-10 pr-24 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-600"
            />
            <button 
              type="submit"
              disabled={isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white px-4 py-1.5 rounded-md transition-colors disabled:opacity-50"
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
                {filteredSuggestions.length > 0 ? (
                  filteredSuggestions.map((repo) => (
                    <button
                      key={repo}
                      onClick={() => handleSubmit(repo)}
                      className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-blue-500/10 hover:text-blue-400 transition-colors flex items-center gap-2 group"
                    >
                      <Search className="w-3 h-3 text-gray-600 group-hover:text-blue-400" />
                      {repo}
                    </button>
                  ))
                ) : (
                   <div className="px-4 py-3 text-sm text-gray-500 italic">No matches found</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <ChartFrequency 
          title="Growth (Additions)" 
          description="Lines of code added to the codebase per week."
          data={data}
          isLoading={isLoading}
          error={error}
          dataKey="added"
          color="#10b981" 
        />

        <ChartFrequency 
          title="Refactoring (Deletions)" 
          description="Lines of code removed or cleaned up."
          data={data}
          isLoading={isLoading}
          error={error}
          dataKey="deleted"
          color="#ef4444" 
        />
      </div>
    </div>
  );
}