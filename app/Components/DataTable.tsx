// components/dashboard/DataTable.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  GitPullRequest,
  AlertCircle,
  CheckCircle,
  User,
  Calendar,
  MessageSquare,
  ExternalLink,
  Loader2,
  GitBranch
} from 'lucide-react';

interface IssueData {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed';
  user: {
    login: string;
    avatar_url?: string;
  };
  created_at: string;
  comments: number;
  html_url: string;
  pull_request?: any;
}

interface DataTableProps {
  data?: IssueData[];
  isLoading?: boolean;
  title?: string;
  description?: string;
}

export default function DataTable({ 
  data = [], 
  isLoading = false,
  title = "Recent Issues & PRs",
  description = "Latest activity from the repository"
}: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Format date to relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Determine issue/PR type and icon
  const getIssueType = (item: IssueData) => {
    if (item.pull_request) {
      return {
        type: 'PR',
        icon: <GitPullRequest className="h-4 w-4 text-purple-500" />,
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/20'
      };
    }
    return {
      type: 'Issue',
      icon: item.state === 'open' 
        ? <AlertCircle className="h-4 w-4 text-green-500" />
        : <CheckCircle className="h-4 w-4 text-gray-500" />,
      bgColor: item.state === 'open' ? 'bg-green-500/10' : 'bg-gray-500/10',
      borderColor: item.state === 'open' ? 'border-green-500/20' : 'border-gray-500/20'
    };
  };

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = data.slice(startIndex, endIndex);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur"
      >
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
        
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-16 rounded-lg bg-gray-800/50"></div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur"
      >
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
        
        <div className="text-center py-12">
          <GitBranch className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-white mb-2">No Issues Found</h4>
          <p className="text-gray-400">This repository doesn't have any issues or pull requests yet.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur"
    >
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-sm text-gray-400">{description}</p>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>Open</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 rounded-full bg-gray-500"></div>
              <span>Closed</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 rounded-full bg-purple-500"></div>
              <span>PR</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {currentItems.map((item, index) => {
          const issueType = getIssueType(item);
          
          return (
            <motion.a
              key={item.id}
              href={item.html_url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ 
                scale: 1.01,
                backgroundColor: 'rgba(55, 65, 81, 0.3)'
              }}
              className="block rounded-lg border border-gray-800 bg-gray-900/30 p-4 transition-all hover:border-gray-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-md ${issueType.bgColor} border ${issueType.borderColor}`}>
                      {issueType.icon}
                      <span className="text-xs font-medium text-white">
                        #{item.number} • {issueType.type}
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${item.state === 'open' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {item.state}
                    </span>
                  </div>
                  
                  <h4 className="text-sm font-medium text-white mb-2 truncate">
                    {item.title}
                  </h4>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-400">
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{item.user.login}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatRelativeTime(item.created_at)}</span>
                    </div>
                    {item.comments > 0 && (
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>{item.comments} comments</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="ml-4 flex-shrink-0">
                  <ExternalLink className="h-4 w-4 text-gray-500 hover:text-white" />
                </div>
              </div>
            </motion.a>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between text-sm text-gray-400">
          <div>
            Showing <span className="font-medium text-white">{startIndex + 1}-{Math.min(endIndex, data.length)}</span> of{' '}
            <span className="font-medium text-white">{data.length}</span> items
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`rounded-lg px-3 py-1 ${currentPage === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-white hover:bg-gray-800'} border border-gray-700`}
            >
              Previous
            </button>
            <div className="flex space-x-1">
              {[...Array(Math.min(3, totalPages))].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`rounded-lg px-3 py-1 ${currentPage === pageNum ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'text-white hover:bg-gray-800 border border-gray-700'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 3 && (
                <>
                  <span className="px-2 py-1">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`rounded-lg px-3 py-1 ${currentPage === totalPages ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'text-white hover:bg-gray-800 border border-gray-700'}`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`rounded-lg px-3 py-1 ${currentPage === totalPages ? 'text-gray-600 cursor-not-allowed' : 'text-white hover:bg-gray-800'} border border-gray-700`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}