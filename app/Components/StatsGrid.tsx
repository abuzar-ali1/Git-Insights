'use client';

import KpiCard from './KpiCard';

interface StatsGridProps {
  data: any;
  isLoading: boolean;
}

export default function StatsGrid({ data, isLoading }: StatsGridProps) {
  const metrics = [
    {
      title: "Total Stars",
      value: data?.stargazers_count,
      icon: "star" as const,
    },
    {
      title: "Forks",
      value: data?.forks_count,
      icon: "fork" as const,
    },
    {
      title: "Open Issues",
      value: data?.open_issues_count,
      icon: "issue" as const,
    },
    {
      title: "Watchers",
      value: data?.watchers_count,
      icon: "eye" as const,
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <KpiCard
          key={metric.title}
          title={metric.title}
          value={metric.value}
          icon={metric.icon}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}