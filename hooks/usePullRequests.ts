'use client';

import { useState, useCallback } from 'react';

export interface PRStats {
  pieData: { name: string; value: number; color: string }[];
  scatterData: { date: string; duration: number; title: string }[];
  averageTime: string;
}

export function usePullRequests() {
  const [data, setData] = useState<PRStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPRs = useCallback(async (repoPath: string) => {
    setIsLoading(true);
    setError('');
    setData(null);

    try {
      const [owner, repo] = repoPath.split('/');
      if (!owner || !repo) throw new Error("Invalid format");

      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/pulls?state=all&per_page=100`
      );

      if (!response.ok) throw new Error('Repository not found or API rate limit exceeded.');

      const rawData = await response.json();

      let open = 0;
      let merged = 0;
      let closed = 0;
      
      const durations: number[] = [];
      const scatterPoints: any[] = [];

      rawData.forEach((pr: any) => {
        if (pr.state === 'open') {
          open++;
        } else if (pr.state === 'closed' && pr.merged_at) {
          merged++;

          const start = new Date(pr.created_at).getTime();
          const end = new Date(pr.merged_at).getTime();
          const hours = (end - start) / (1000 * 60 * 60); 

          durations.push(hours);
          scatterPoints.push({
            date: new Date(pr.merged_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric'}),
            duration: parseFloat(hours.toFixed(1)), 
            title: pr.title
          });

        } else {
          closed++;
        }
      });

      const totalHours = durations.reduce((a, b) => a + b, 0);
      const avg = durations.length ? (totalHours / durations.length).toFixed(1) : '0';

      setData({
        pieData: [
          { name: 'Merged', value: merged, color: '#8b5cf6' }, // Purple
          { name: 'Open', value: open, color: '#10b981' },   // Green
          { name: 'Closed', value: closed, color: '#ef4444' } // Red
        ],
        scatterData: scatterPoints.reverse(), // Show oldest to newest
        averageTime: avg
      });

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading, error, fetchPRs };
}