'use client';
import { useQuery } from '@tanstack/react-query';

const fetchCommits = async (repoPath: string, range: string) => {
    const [owner, repo] = repoPath.split('/');
    const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`,
        {
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
            },
        }
    );
    if (!response.ok) throw new Error('Failed to fetch commits');
    return response.json();
};

export const useGitHubCommits = (repoPath: string, range: string) => {
    return useQuery({
        queryKey: ['github-commits', repoPath, range],
        queryFn: () => fetchCommits(repoPath, range),
        staleTime: 5 * 60 * 1000,
    });
};