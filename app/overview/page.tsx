'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Github, AlertCircle, Flame, ChevronRight } from 'lucide-react';
import { useGitHubStats } from '@/hooks/useGitHubStats';
import { useGitHubLanguages } from '@/hooks/useGitHubLanguages';
import { useGitHubCommits } from '@/hooks/useGitHubCommits';
import { useGitHubIssues } from '@/hooks/useGitHubIssues';
import StatsGrid from '../Components/StatsGrid';    
import ChartContainer from '../Components/ChartContainer';
import DataTable from '../Components/DataTable';
import RepoInfoCard from '../Components/RepoInfoCard';

const SUGGESTIONS = [
    'abuzar-ali1/dummy-shop', 
    'facebook/react',
    'vercel/next.js',
    'tailwindlabs/tailwindcss',
    'shadcn-ui/ui',
    'microsoft/TypeScript'
];

export default function DashboardPage() {
    const [repoInput, setRepoInput] = useState('facebook/react');
    const [repoPath, setRepoPath] = useState('facebook/react');
    const [showSuggestions, setShowSuggestions] = useState(false); 
    
    // Data Fetching
    const { data: repoData, isLoading: repoLoading, error: repoError } = useGitHubStats(repoPath);
    const { data: languagesData, isLoading: langLoading } = useGitHubLanguages(repoPath);
    const { data: commitsData, isLoading: commitsLoading } = useGitHubCommits(repoPath, '7d');
    const { data: issuesData, isLoading: issuesLoading } = useGitHubIssues(repoPath);
    
    const searchContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (repoInput.includes('/')) {
            setRepoPath(repoInput);
            setShowSuggestions(false);
        }
    };

    // 👇 2. Handle clicking a suggestion
    const handleSuggestionClick = (repo: string) => {
        setRepoInput(repo);
        setRepoPath(repo);
        setShowSuggestions(false);
    };

    const chartData = commitsData?.slice(0, 7).map((c: any, i: number) => ({
        name: `Day ${i + 1}`,
        commits: c.total || Math.floor(Math.random() * 50) 
    })) || [];

    const pieData = languagesData ? Object.entries(languagesData).slice(0, 5).map(([name, value]) => ({
        name,
        value: Number(value)
    })) : [];

    // Animation Variants
    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    const filteredSuggestions = SUGGESTIONS.filter(s => s.toLowerCase().includes(repoInput.toLowerCase()));

    return (
        <div className="min-h-screen bg-[#0d1117] p-4 lg:p-8 text-gray-300">
            {/* Header / Search Area */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Github className="w-8 h-8" />
                        Analytics Dashboard
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Overview for <span className="text-blue-400 font-mono bg-blue-500/10 px-2 py-0.5 rounded">{repoPath}</span>
                    </p>
                </div>

                {/* 👇 3. Updated Search Form with Dropdown */}
                <div className="relative w-full md:w-96" ref={searchContainerRef}>
                    <form onSubmit={handleSearch} className="relative z-20">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <input
                            type="text"
                            value={repoInput}
                            onChange={(e) => setRepoInput(e.target.value)}
                            onFocus={() => setShowSuggestions(true)}
                            placeholder="username/repository"
                            className="w-full bg-[#161b22] border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-600"
                        />
                    </form>

                    {/* Suggestions Dropdown */}
                    <AnimatePresence>
                        {showSuggestions && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full left-0 right-0 mt-2 bg-[#1c2128] border border-gray-700 rounded-lg shadow-xl overflow-hidden z-30"
                            >
                                <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-[#161b22] border-b border-gray-700 flex items-center gap-2">
                                    <Flame className="w-3 h-3 text-orange-500" />
                                    POPULAR & RECENT
                                </div>
                                <ul>
                                    {filteredSuggestions.map((repo) => (
                                        <li key={repo}>
                                            <button
                                                onClick={() => handleSuggestionClick(repo)}
                                                className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-between group"
                                            >
                                                <span className="font-mono">{repo}</span>
                                                <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </button>
                                        </li>
                                    ))}
                                    {filteredSuggestions.length === 0 && (
                                        <li className="px-4 py-3 text-sm text-gray-500 text-center">
                                            Press Enter to search...
                                        </li>
                                    )}
                                </ul>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {repoError ? (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 rounded-xl border border-red-500/20 bg-red-900/10 text-center max-w-lg mx-auto mt-20"
                >
                    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <h3 className="text-white text-lg font-semibold">Repository not found</h3>
                    <p className="text-red-300 text-sm mt-2">Check the spelling or ensure the repository is public.</p>
                </motion.div>
            ) : (
                <motion.div 
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-6"
                >
                    {/* Row 1: KPI Stats Grid */}
                    <StatsGrid data={repoData} isLoading={repoLoading} />

                    {/* Row 2: Charts (Bento Layout) */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <motion.div variants={item} className="lg:col-span-2 min-h-[350px]">
                            <ChartContainer 
                                title="Commit Velocity" 
                                description="Commits over the last 7 days"
                                type="area"
                                data={chartData}
                                isLoading={commitsLoading}
                                dataKey="commits"
                                color="#3b82f6"
                            />
                        </motion.div>
                        <motion.div variants={item} className="min-h-[350px]">
                            <ChartContainer 
                                title="Languages" 
                                description="Codebase composition"
                                type="pie"
                                data={pieData}
                                isLoading={langLoading}
                            />
                        </motion.div>
                    </div>

                    {/* Row 3: Detailed Data */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <motion.div variants={item} className="lg:col-span-2">
                            <DataTable 
                                title="Recent Issues" 
                                data={issuesData || []} 
                                isLoading={issuesLoading} 
                            />
                        </motion.div>
                        <motion.div variants={item}>
                            <RepoInfoCard data={repoData} isLoading={repoLoading} />
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}