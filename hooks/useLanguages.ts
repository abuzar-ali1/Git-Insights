'use client';

import { useState, useCallback } from 'react';

// Official GitHub Colors for authenticity
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Vue: '#41b883',
  Shell: '#89e051',
  Go: '#00ADD8',
  Java: '#b07219',
  PHP: '#4F5D95',
  Rust: '#dea584',
  Swift: '#F05138',
  Ruby: '#701516',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  SCSS: '#c6538c',
  Other: '#6e7681'
};

export interface LanguageStat {
  name: string;
  value: number; // Percentage
  bytes: number;
  color: string;
}

export function useLanguages() {
  const [data, setData] = useState<LanguageStat[]>([]);
  const [topLanguage, setTopLanguage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchLanguages = useCallback(async (repoPath: string) => {
    setIsLoading(true);
    setError('');
    setData([]);

    try {
      const [owner, repo] = repoPath.split('/');
      if (!owner || !repo) throw new Error("Invalid format");

      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/languages`
      );

      if (!response.ok) throw new Error('Repo not found.');

      const rawData = await response.json();
      
      // 1. Calculate Total Bytes
      const totalBytes = Object.values(rawData).reduce((a: any, b: any) => a + b, 0) as number;

      if (totalBytes === 0) {
        setData([]);
        return;
      }

      // 2. Transform to Percentages & Add Colors
      const stats = Object.entries(rawData).map(([name, bytes]: [string, any]) => {
        return {
          name,
          bytes,
          value: parseFloat(((bytes / totalBytes) * 100).toFixed(1)), // 45.2%
          color: LANGUAGE_COLORS[name] || '#6e7681' // Fallback color
        };
      });

      // 3. Sort by biggest first
      stats.sort((a, b) => b.value - a.value);

      setData(stats);
      setTopLanguage(stats[0]?.name || '');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, topLanguage, isLoading, error, fetchLanguages };
}