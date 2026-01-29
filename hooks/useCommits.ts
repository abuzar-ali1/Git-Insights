'use client';

import { useState, useCallback } from 'react';

export interface PunchCardData {
  day: number;   // 0-6 (Sun-Sat)
  hour: number;  // 0-23
  count: number; // Size of bubble
}

export function useCommits() {
  const [data, setData] = useState<PunchCardData[]>([]);
  const [totalCommits, setTotalCommits] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCommits = useCallback(async (repoPath: string) => {
    setIsLoading(true);
    setError('');
    setData([]);

    try {
      const [owner, repo] = repoPath.split('/');
      if (!owner || !repo) throw new Error("Invalid format");

      // Fetch last 100 commits
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/commits?per_page=100`
      );

      if (!response.ok) throw new Error('Repository not found or private.');

      const rawData = await response.json();
      setTotalCommits(rawData.length);

      // --- THE "MAILBOX" LOGIC ---
      
      // 1. Count commits for every slot
      const counts: Record<string, number> = {};
      
      rawData.forEach((item: any) => {
        const date = new Date(item.commit.author.date);
        const day = date.getDay();   // 0-6
        const hour = date.getHours(); // 0-23
        const key = `${day}-${hour}`;
        counts[key] = (counts[key] || 0) + 1;
      });

      // 2. Fill the empty slots (0 commits) so the grid is perfect
      const chartData: PunchCardData[] = [];
      for (let d = 0; d < 7; d++) {
        for (let h = 0; h < 24; h++) {
          const key = `${d}-${h}`;
          chartData.push({
            day: d,
            hour: h,
            count: counts[key] || 0
          });
        }
      }

      setData(chartData);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, totalCommits, isLoading, error, fetchCommits };
}