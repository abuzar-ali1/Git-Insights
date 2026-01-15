'use client';

import { GitPullRequest, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DataTable({ title, data, isLoading }: { title: string, data: any[], isLoading: boolean }) {
  if (isLoading) return <div className="h-96 bg-[#161b22] border border-gray-800 rounded-xl animate-pulse" />;

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-gray-800">
        <h3 className="text-white font-semibold">{title}</h3>
      </div>
      <div className="overflow-y-auto max-h-[400px]">
        {data.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No recent activity found.</div>
        ) : (
          <table className="w-full text-left text-sm text-gray-400">
            <tbody className="divide-y divide-gray-800">
              {data.slice(0, 6).map((item, i) => (
                <motion.tr 
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {item.pull_request ? (
                        <GitPullRequest className="w-4 h-4 text-purple-500" />
                      ) : item.state === 'open' ? (
                        <AlertCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-gray-500" />
                      )}
                      <div>
                        <a href={item.html_url} target="_blank" className="font-medium text-white hover:text-blue-400 block truncate max-w-[200px] sm:max-w-md">
                          {item.title}
                        </a>
                        <span className="text-xs text-gray-500">#{item.number} opened by {item.user.login}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-2 py-1 rounded-full text-xs border ${
                      item.state === 'open' 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                    }`}>
                      {item.state}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}