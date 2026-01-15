'use client';

import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';

export interface Repository {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
  html_url: string;
  private: boolean;
  archived: boolean;
  topics: string[];
}

async function fetchRepos(username: string): Promise<Repository[]> {
  const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export function useRepositories(username: string = 'facebook') {
  const { data = [], isLoading, isError } = useQuery({
    queryKey: ['repos', username],
    queryFn: () => fetchRepos(username),
    staleTime: 1000 * 60 * 5,
  });

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'stars' | 'updated'>('updated');
  const [filterType, setFilterType] = useState<'all' | 'public' | 'private' | 'archived'>('all');

  const filteredRepos = useMemo(() => {
    let result = [...data];
    if (search) {
      result = result.filter(repo => 
        repo.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Type Filter
    if (filterType !== 'all') {
      if (filterType === 'private') result = result.filter(r => r.private);
      if (filterType === 'public') result = result.filter(r => !r.private);
      if (filterType === 'archived') result = result.filter(r => r.archived);
    }

    // Sorting
    result.sort((a, b) => {
      if (sort === 'stars') return b.stargazers_count - a.stargazers_count;
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });

    return result;
  }, [data, search, sort, filterType]);

  return { 
    repos: filteredRepos, 
    isLoading, 
    isError,
    search, setSearch,
    sort, setSort,
    filterType, setFilterType
  };
}