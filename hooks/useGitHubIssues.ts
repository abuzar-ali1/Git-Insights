'use client';
import { useQuery } from '@tanstack/react-query';

const fetchIssues = async (repoPath: string) => {
    const [owner, repo] = repoPath.split('/');
    const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/issues?state=all&per_page=5&sort=updated`,
        {
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
            },
        }
    );
    if (!response.ok) throw new Error('Failed to fetch issues');
    return response.json();
};

export const useGitHubIssues = (repoPath: string) => {
    return useQuery({
        queryKey: ['github-issues', repoPath],
        queryFn: () => fetchIssues(repoPath),
        staleTime: 2 * 60 * 1000, // Shorter cache for frequently updated issues
    });
};