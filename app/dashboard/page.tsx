'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    Users,
    DollarSign,
    Clock,
    Download,
    Calendar,
    Filter,
    RefreshCw,
    Eye,
    Star,
    GitFork,
    AlertCircle,
    Code,
    Globe,
    Activity,
    Zap,
    FileText,
    GitPullRequest,
    GitCommit
} from 'lucide-react';
import KpiCard from '../Components/KpiCard';
import ChartContainer from '../Components/ChartContainer';
import DataTable from '../Components/DataTable';
import LiveMetrics from '../Components/LiveMetrics';
import { useGitHubStats } from '@/hooks/useGitHubStats';
import { useGitHubLanguages } from '@/hooks/useGitHubLanguages';
import { useGitHubCommits } from '@/hooks/useGitHubCommits';
import { useGitHubIssues } from '@/hooks/useGitHubIssues';
import { useComingSoon } from '../../hooks/useComingSoon';

export default function DashboardPage() {
    const [dateRange, setDateRange] = useState('7d');
    const [repoPath, setRepoPath] = useState('facebook/react');
    const [repoInput, setRepoInput] = useState('facebook/react');
    
    // Fetch multiple GitHub data endpoints
    const { data: repoData, isLoading: repoLoading, error: repoError, refetch: refetchRepo } = useGitHubStats(repoPath);
    const { data: languagesData, isLoading: languagesLoading } = useGitHubLanguages(repoPath);
    const { data: commitsData, isLoading: commitsLoading } = useGitHubCommits(repoPath, dateRange);
    const { data: issuesData, isLoading: issuesLoading } = useGitHubIssues(repoPath);
    const {handleComingSoon} = useComingSoon()
    // Format repository size
    const formatSize = (kb: number) => {
        if (kb < 1024) return `${kb} KB`;
        const mb = kb / 1024;
        if (mb < 1024) return `${mb.toFixed(1)} MB`;
        const gb = mb / 1024;
        return `${gb.toFixed(1)} GB`;
    };

    // Transform languages data for pie chart
    const transformLanguagesForChart = () => {
        if (!languagesData) return [];
        
        const entries = Object.entries(languagesData) as [string, number][];
        const total = entries.reduce((sum, [, value]) => sum + value, 0);
        
        return entries.slice(0, 5).map(([name, value]) => ({
            name,
            value: Math.round((value / total) * 100),
            bytes: value
        }));
    };

    // Transform commit data for line chart
    const transformCommitsForChart = () => {
        if (!commitsData || !Array.isArray(commitsData)) return [];
        
        if (dateRange === '24h') {
            // Mock data for 24h view
            return [
                { name: '12 AM', commits: Math.floor(Math.random() * 20) },
                { name: '4 AM', commits: Math.floor(Math.random() * 15) },
                { name: '8 AM', commits: Math.floor(Math.random() * 40) },
                { name: '12 PM', commits: Math.floor(Math.random() * 60) },
                { name: '4 PM', commits: Math.floor(Math.random() * 50) },
                { name: '8 PM', commits: Math.floor(Math.random() * 30) },
                { name: '12 AM', commits: Math.floor(Math.random() * 10) },
            ];
        }
        
        // For weekly/monthly view, use actual commit data if available
        if (commitsData.length > 0) {
            return commitsData.slice(0, 7).map((commit: any, index: number) => ({
                name: `Day ${index + 1}`,
                commits: commit.total || Math.floor(Math.random() * 30)
            }));
        }
        
        // Fallback mock data
        return [
            { name: 'Mon', commits: 42 },
            { name: 'Tue', commits: 38 },
            { name: 'Wed', commits: 56 },
            { name: 'Thu', commits: 47 },
            { name: 'Fri', commits: 62 },
            { name: 'Sat', commits: 28 },
            { name: 'Sun', commits: 35 },
        ];
    };

    // Calculate change percentages (mock for now - you could implement real tracking)
    const calculateChange = (current: number, previous: number = current * 0.88) => {
        const change = ((current - previous) / previous) * 100;
        return `${change >= 0 ? '+' : ''}${change.toFixed(0)}%`;
    };

    const handleRepoSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (repoInput.includes('/')) {
            setRepoPath(repoInput);
        }
    };

    const handleRefresh = () => {
        refetchRepo();
    };

    if (repoError) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6 p-4 lg:p-6"
            >
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-8 text-center">
                    <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Failed to Load GitHub Data</h3>
                    <p className="text-gray-400 mb-6">
                        {repoError instanceof Error ? repoError.message : 'Unable to fetch repository data'}
                    </p>
                    <button
                        onClick={() => refetchRepo()}
                        className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 font-medium text-white hover:opacity-90"
                    >
                        Retry Connection
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 p-4 lg:p-6"
        >
            {/* Repository Selector Header */}
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 flex items-center justify-center">
                                <Globe className="h-6 w-6 text-gray-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl lg:text-3xl font-bold text-white">GitHub Analytics Dashboard</h1>
                                <p className="text-gray-400">
                                    Analyzing: <span className="text-blue-400">{repoPath}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleRepoSubmit} className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1">
                            <div className="flex">
                                <div className="flex items-center px-3 border border-r-0 border-gray-700 rounded-l-lg bg-gray-800">
                                    <span className="text-gray-400 text-sm">github.com/</span>
                                </div>
                                <input
                                    type="text"
                                    value={repoInput}
                                    onChange={(e) => setRepoInput(e.target.value)}
                                    placeholder="owner/repo-name"
                                    className="flex-1 rounded-r-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleComingSoon}
                                type="submit"
                                className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                            >
                                Analyze
                            </button>
                            <button
                            onClick={handleComingSoon}
                                type="button"
                                onClick={handleRefresh}
                                className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700"
                            >
                                <RefreshCw className="h-4 w-4" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* KPI Grid - GitHub Repository Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                <KpiCard
                    title="Repository Stars"
                    value={repoLoading ? "..." : repoData?.stargazers_count?.toLocaleString() || "0"}
                    change={repoData?.stargazers_count ? calculateChange(repoData.stargazers_count) : "+0%"}
                    icon={<Star className="h-8 w-8 text-yellow-500" />}
                    color="from-yellow-500 to-orange-500"
                />
                
                <KpiCard
                    title="Total Forks"
                    value={repoLoading ? "..." : repoData?.forks_count?.toLocaleString() || "0"}
                    change={repoData?.forks_count ? calculateChange(repoData.forks_count) : "+0%"}
                    icon={<GitFork className="h-8 w-8 text-blue-500" />}
                    color="from-blue-500 to-cyan-500"
                />
                
                <KpiCard
                    title="Open Issues"
                    value={repoLoading ? "..." : repoData?.open_issues_count?.toLocaleString() || "0"}
                    change={repoData?.open_issues_count ? calculateChange(repoData.open_issues_count) : "+0%"}
                    icon={<AlertCircle className="h-8 w-8 text-red-500" />}
                    color="from-red-500 to-pink-500"
                />
                
                <KpiCard
                    title="Repository Size"
                    value={repoLoading ? "..." : repoData?.size ? formatSize(repoData.size) : "0 KB"}
                    change={repoData?.size ? calculateChange(repoData.size) : "+0%"}
                    icon={<Code className="h-8 w-8 text-green-500" />}
                    color="from-green-500 to-emerald-500"
                />
            </motion.div>

            {/* Charts Grid - GitHub Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2"
                >
                    <ChartContainer
                        title="Commit Activity"
                        description={`Weekly commit activity for ${repoPath.split('/')[1]}`}
                        type="line"
                        height={350}
                        data={transformCommitsForChart()}
                        isLoading={commitsLoading}
                        dataKey="commits"
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <ChartContainer
                        title="Language Distribution"
                        description="Top programming languages used"
                        type="pie"
                        height={350}
                        data={transformLanguagesForChart()}
                        isLoading={languagesLoading}
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <ChartContainer
                        title="Repository Metrics"
                        description="Key repository statistics"
                        type="bar"
                        height={350}
                        data={[
                            { name: 'Stars', value: repoData?.stargazers_count || 0 },
                            { name: 'Forks', value: repoData?.forks_count || 0 },
                            { name: 'Issues', value: repoData?.open_issues_count || 0 },
                            { name: 'Watchers', value: repoData?.watchers_count || 0 },
                        ]}
                        isLoading={repoLoading}
                        dataKey="value"
                    />
                </motion.div>
            </div>

            {/* Live Metrics and Data Table */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="lg:col-span-2"
                >
                    <DataTable 
                        data={issuesData || []}
                        isLoading={issuesLoading}
                        title="Recent Issues & PRs"
                        description={`Latest activity from ${repoPath}`}
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <LiveMetrics 
                        repoPath={repoPath}
                        repoData={repoData}
                    />
                </motion.div>
            </div>

            {/* Additional GitHub Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400">Default Branch</p>
                            <p className="mt-2 text-2xl font-bold text-white">
                                {repoData?.default_branch || 'main'}
                            </p>
                        </div>
                        <div className="rounded-lg bg-blue-500/10 p-3">
                            <GitCommit className="h-6 w-6 text-blue-500" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-blue-400">
                        <Code className="h-4 w-4" />
                        <span className="ml-2 text-sm">Primary development branch</span>
                    </div>
                </div>

                <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400">Primary Language</p>
                            <p className="mt-2 text-2xl font-bold text-white">
                                {repoData?.language || 'JavaScript'}
                            </p>
                        </div>
                        <div className="rounded-lg bg-green-500/10 p-3">
                            <FileText className="h-6 w-6 text-green-500" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-green-400">
                        <TrendingUp className="h-4 w-4" />
                        <span className="ml-2 text-sm">
                            {languagesData ? `${Object.keys(languagesData).length} languages used` : 'Multiple languages'}
                        </span>
                    </div>
                </div>

                <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400">Repository Age</p>
                            <p className="mt-2 text-2xl font-bold text-white">
                                {repoData?.created_at ? 
                                    `${new Date().getFullYear() - new Date(repoData.created_at).getFullYear()} years` : 
                                    'N/A'
                                }
                            </p>
                        </div>
                        <div className="rounded-lg bg-purple-500/10 p-3">
                            <Calendar className="h-6 w-6 text-purple-500" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-purple-400">
                        <Clock className="h-4 w-4" />
                        <span className="ml-2 text-sm">
                            Created {repoData?.created_at ? new Date(repoData.created_at).toLocaleDateString() : ''}
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* Repository Details Footer */}
            {repoData && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-xl border border-gray-800 bg-gray-900/30 p-6 mt-6"
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h4 className="text-sm font-semibold text-gray-400 mb-2">Repository Details</h4>
                            <p className="text-sm text-gray-300">
                                {repoData.description || 'No description available'}
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-center">
                                <p className="text-sm text-gray-400">License</p>
                                <p className="text-sm text-white">{repoData.license?.name || 'MIT'}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-400">Visibility</p>
                                <p className="text-sm text-white">{repoData.private ? 'Private' : 'Public'}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-400">Last Updated</p>
                                <p className="text-sm text-white">
                                    {new Date(repoData.updated_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}