'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  GitBranch,
  GitPullRequest,
  GitCommit,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  PieChart,
  Code2,
  BookOpen,
  X,
  Github
} from 'lucide-react';
import Link from 'next/link';

interface SidebarProps {
  isMobileOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isMobileOpen = false, onClose }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('Overview');
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Handle Resize
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 1024);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Handle Click Outside (Mobile)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && isMobileOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose?.();
      }
    };
    if (isMobile && isMobileOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isMobileOpen, onClose]);

  // GitHub Specific Navigation
  const navigationItems = [
    {
      category: 'General',
      items: [
        { name: 'Overview', icon: <LayoutDashboard className="w-5 h-5" />, path: '/overview' },
        { name: 'Repositories', icon: <BookOpen className="w-5 h-5" />, path: '/repos' },
        { name: 'Code Frequency', icon: <Code2 className="w-5 h-5" />, path: '/frequency' },
      ]
    },
    {
      category: 'Activity',
      items: [
        { name: 'Commits', icon: <GitCommit className="w-5 h-5" />, path: '/commits' },
        { name: 'Pull Requests', icon: <GitPullRequest className="w-5 h-5" />, path: '/pulls' },
        { name: 'Network Graph', icon: <GitBranch className="w-5 h-5" />, path: '/network' },
      ]
    },
    {
      category: 'Insights',
      items: [
        { name: 'Language Stats', icon: <PieChart className="w-5 h-5" />, path: '/languages' },
        { name: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/settings' },
      ]
    }
  ];

  const sidebarVariants = {
    desktopExpanded: { width: 260, x: 0 },
    desktopCollapsed: { width: 80, x: 0 },
    mobileOpen: { width: 260, x: 0 },
    mobileClosed: { width: 0, x: -260 }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        ref={sidebarRef}
        initial={false}
        animate={isMobile ? (isMobileOpen ? 'mobileOpen' : 'mobileClosed') : (isCollapsed ? 'desktopCollapsed' : 'desktopExpanded')}
        variants={sidebarVariants}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed lg:relative left-0 top-0 z-50 h-screen border-r border-gray-800 bg-[#0d1117] text-gray-300 overflow-hidden"
      >
        <div className="flex h-full flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 h-20 border-b border-gray-800">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-white text-black">
                 <Github className="w-5 h-5" />
              </div>
              <AnimatePresence>
                {(!isCollapsed || isMobile) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap"
                  >
                    <h2 className="text-sm font-bold text-white">GitInsights</h2>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Toggle Buttons */}
            {isMobile ? (
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            ) : (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1.5 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
              >
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-6">
            {navigationItems.map((section) => (
              <div key={section.category}>
                <AnimatePresence>
                  {(!isCollapsed || isMobile) && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="px-3 mb-2"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        {section.category}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-1">
                  {section.items.map((item) => (
                    <Link
                      key={item.name}
                      href={item.path}
                      onClick={() => setActiveItem(item.name)}
                      className={`
                        flex items-center px-3 py-2.5 rounded-md transition-all group relative
                        ${activeItem === item.name 
                          ? 'bg-gray-800 text-white' 
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}
                      `}
                    >
                      <div className="flex-shrink-0 w-5 h-5">
                        {item.icon}
                      </div>
                      
                      <AnimatePresence>
                        {(!isCollapsed || isMobile) && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="ml-3 text-sm font-medium whitespace-nowrap"
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {/* Tooltip for Collapsed State */}
                      {!isMobile && isCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                          {item.name}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* User / Footer */}
          <div className="p-4 border-t border-gray-800">
            <div className={`flex items-center ${isCollapsed && !isMobile ? 'justify-center' : 'gap-3'}`}>
              
              <img 
                src="https://github.com/abuzar-ali1.png" 
                alt="Abuzar Ali" 
                className="h-9 w-9 rounded-full border border-gray-700 flex-shrink-0 bg-gray-800"
              />
              
              <AnimatePresence>
                {(!isCollapsed || isMobile) && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="flex-1 overflow-hidden"
                  >
                    <p className="text-sm font-medium text-white truncate">Abuzar Ali</p>
                    <p className="text-xs text-gray-500 truncate">Frontend Developer</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {(!isCollapsed || isMobile) && (
                 <button className="text-gray-400 hover:text-white">
                   <LogOut className="h-4 w-4" />
                 </button>
              )}
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;