// hooks/useDashboardData.ts
'use client';

import { useQuery } from '@tanstack/react-query';

async function fetchDashboardData(range: string) {
  // Simulate API call with mock data
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real app, you would fetch from your API
  // const response = await fetch(`/api/dashboard?range=${range}`);
  // return response.json();
  
  return {
    revenue: 42580,
    users: 12847,
    conversion: 3.2,
    sessionTime: '4m 32s'
  };
}

export function useDashboardData(range: string) {
  return useQuery({
    queryKey: ['dashboard', range],
    queryFn: () => fetchDashboardData(range),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}