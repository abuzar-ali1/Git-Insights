'use client';
import { useQuery } from '@tanstack/react-query';

const fetchRepoData = async (repoPath: string) => {
  const [owner, repo] = repoPath.split('/');
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
      },
    }
  );
  if (!response.ok) throw new Error('Failed to fetch repo data');
  return response.json();
};


export const useGitHubStats = (repoPath: string) => {
  return useQuery({
    queryKey: ['github-stats', repoPath], 
    queryFn: () => fetchRepoData(repoPath),
    staleTime: 5 * 60 * 1000, 
  });
};