'use client';
import { useQuery } from '@tanstack/react-query';

const fetchRepoData = async (repoPath: string) => {
  // repoPath format: "facebook/react"
  const [owner, repo] = repoPath.split('/');
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    {
      headers: {
        // Securely use the token from environment variables
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
      },
    }
  );
  if (!response.ok) throw new Error('Failed to fetch repo data');
  return response.json();
  console.log(response);
};


export const useGitHubStats = (repoPath: string) => {
  return useQuery({
    queryKey: ['github-stats', repoPath], // Unique key for caching
    queryFn: () => fetchRepoData(repoPath),
    staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
  });
};