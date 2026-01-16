'use client';

import { useState, useCallback } from 'react';

export function useNetwork() {
  const [data, setData] = useState({ nodes: [] as any, links: [] as any });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchNetwork = useCallback(async (repoPath: string) => {
    setIsLoading(true);
    setError('');
    // Clear old data temporarily
    setData({ nodes: [], links: [] });

    try {
      const [owner, repo] = repoPath.split('/');
      if (!owner || !repo) throw new Error("Invalid format");

      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=100`
      );

      if (!response.ok) throw new Error('Repo not found or limited.');

      const users = await response.json();

      const nodes: any[] = [
        { id: "Repository", val: 50, color: "#fff", isCenter: true }
      ];
      
      const links: any[] = [];

      users.forEach((user: any) => {
        nodes.push({
          id: user.login,
          val: Math.sqrt(user.contributions) * 2, // Scale size sensibly
          img: user.avatar_url,
          isCenter: false
        });

        links.push({
          source: "Repository",
          target: user.login
        });
      });

      setData({ nodes, links } );

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading, error, fetchNetwork };
}