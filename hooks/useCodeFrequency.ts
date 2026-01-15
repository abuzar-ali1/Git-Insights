'use client';

import { useState, useCallback } from 'react';

export function useCodeFrequency() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchFrequency = useCallback(async (repoPath: string) => {
    setIsLoading(true);
    setError('');
    setData([]);

    try {
      const [owner, repo] = repoPath.split('/');
      if (!owner || !repo) throw new Error("Invalid format. Use 'owner/repo'");

      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/stats/code_frequency`
      );

      if (response.status === 422) {
        throw new Error('Repository is too large for GitHub to calculate stats.');
      }
      
      if (!response.ok) {
        throw new Error('Repository not found or API rate limit exceeded.');
      }

      const rawData = await response.json();

      if (Array.isArray(rawData)) {
        const cleanData = rawData.map((item: any) => ({
          date: new Date(item[0] * 1000).toLocaleDateString(undefined, { 
            month: 'short', 
            day: 'numeric',
            year: '2-digit'
          }),
          added: item[1],
          deleted: Math.abs(item[2]), 
        }));
        
        setData(cleanData);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading, error, fetchFrequency };
}