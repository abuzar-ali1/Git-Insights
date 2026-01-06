// hooks/useGitHubLanguages.ts
'use client';
import { useQuery } from '@tanstack/react-query';

const fetchLanguages = async (repoPath: string) => {
    const [owner, repo] = repoPath.split('/');
    const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/languages`,
        {
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
            },
        }
    );
    if (!response.ok) throw new Error('Failed to fetch languages');
    return response.json();
};

export const useGitHubLanguages = (repoPath: string) => {
    return useQuery({
        queryKey: ['github-languages', repoPath],
        queryFn: () => fetchLanguages(repoPath),
        staleTime: 5 * 60 * 1000,
    });
};