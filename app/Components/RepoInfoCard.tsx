'use client';

import { Calendar, HardDrive, Shield, Globe } from 'lucide-react';

export default function RepoInfoCard({ data, isLoading }: { data: any, isLoading: boolean }) {
  if (isLoading) return <div className="h-full bg-[#161b22] border border-gray-800 rounded-xl animate-pulse" />;

  const items = [
    { label: 'Created', value: new Date(data?.created_at).toLocaleDateString(), icon: <Calendar className="w-4 h-4" /> },
    { label: 'Size', value: `${(data?.size / 1024).toFixed(1)} MB`, icon: <HardDrive className="w-4 h-4" /> },
    { label: 'License', value: data?.license?.spdx_id || 'None', icon: <Shield className="w-4 h-4" /> },
    { label: 'Visibility', value: data?.private ? 'Private' : 'Public', icon: <Globe className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 h-full">
      <h3 className="text-white font-semibold mb-6">Repository Details</h3>
      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between group">
            <div className="flex items-center gap-3 text-gray-400 group-hover:text-blue-400 transition-colors">
              <div className="p-2 bg-gray-800 rounded-lg">{item.icon}</div>
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            <span className="text-white font-mono text-sm">{item.value}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-800">
        <p className="text-xs text-gray-500 mb-2">Description</p>
        <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
          {data?.description || "No description provided for this repository."}
        </p>
      </div>
    </div>
  );
}