'use client';

import { motion } from 'framer-motion';
import { Star, GitFork, Calendar, ExternalLink, Lock, Globe } from 'lucide-react';
import { Repository } from '@/hooks/useRepositories';

// Color map for popular languages
const languageColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Vue: '#41b883',
  React: '#61dafb',
  default: '#8b949e'
};

export default function RepoCard({ repo, index }: { repo: Repository; index: number }) {
  const langColor = languageColors[repo.language] || languageColors.default;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group flex flex-col justify-between h-full bg-[#161b22] border border-gray-800 rounded-xl p-5 hover:border-gray-600 hover:shadow-xl transition-all"
    >
      <div>
        {/* Header: Visibility Badge & Name */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {repo.private ? (
              <Lock className="w-4 h-4 text-yellow-500" />
            ) : (
              <Globe className="w-4 h-4 text-gray-500" />
            )}
            <span className={`text-xs px-2 py-0.5 rounded-full border ${repo.private ? 'border-yellow-500/20 bg-yellow-500/10 text-yellow-400' : 'border-gray-700 bg-gray-800 text-gray-400'}`}>
              {repo.private ? 'Private' : 'Public'}
            </span>
          </div>
          <a 
            href={repo.html_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-white transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-blue-400 group-hover:underline mb-2 truncate">
          {repo.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-400 line-clamp-2 mb-4 h-10">
          {repo.description || "No description provided."}
        </p>
      </div>

      {/* Footer: Stats */}
      <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-800 pt-4 mt-auto">
        <div className="flex items-center gap-4">
          {repo.language && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: langColor }} />
              <span>{repo.language}</span>
            </div>
          )}
          
          <div className="flex items-center gap-1 hover:text-yellow-400 transition-colors">
            <Star className="w-4 h-4" />
            <span>{repo.stargazers_count}</span>
          </div>

          <div className="flex items-center gap-1 hover:text-blue-400 transition-colors">
            <GitFork className="w-4 h-4" />
            <span>{repo.forks_count}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>{new Date(repo.updated_at).toLocaleDateString()}</span>
        </div>
      </div>
    </motion.div>
  );
}