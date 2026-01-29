'use client';
import { useQuery } from '@tanstack/react-query';

const fetchCommits = async (repoPath: string, range: string) => {
    // 1. Guard Clause: Don't fetch if input is invalid
    if (!repoPath || !repoPath.includes('/')) return [];

    const [owner, repo] = repoPath.split('/');
    
    try {
        const response = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json' 
                },
            }
        );

        if (!response.ok) {
            console.warn(`GitHub API Error: ${response.status} for ${repoPath}`);
            return [];
        }

        if (response.status === 202) {
            return []; 
        }

        const data = await response.json();

       
        if (!Array.isArray(data)) {
            return [];
        }

        return data;

    } catch (error) {
        console.error("Fetch Commits Error:", error);
        return [];
    }
};

export const useGitHubCommits = (repoPath: string, range: string) => {
    return useQuery({
        queryKey: ['github-commits', repoPath, range],
        queryFn: () => fetchCommits(repoPath, range),
        // Retry less often if it fails, to avoid hitting rate limits
        retry: 1, 
        staleTime: 5 * 60 * 1000,
        initialData: [], 
    });
};