'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  Bell,
  Search,
  Settings,
  LogOut,
  User,
  Plus,
  Github,
  Slash,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
  title?: string; // e.g., "Overview"
}

const Header = ({ onMenuClick, title = "Overview" }: HeaderProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // GitHub-style User Menu
  const profileMenuItems = [
    { name: 'Your Profile', icon: <User className="w-4 h-4" /> },
    { name: 'Settings', icon: <Settings className="w-4 h-4" /> },
    { name: 'Sign out', icon: <LogOut className="w-4 h-4" /> },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 w-full border-b border-gray-800 bg-[#0d1117]/80 backdrop-blur-md"
    >
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        
        {/* LEFT: Mobile Menu & Breadcrumbs */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Trigger */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-white rounded-md hover:bg-gray-800"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Breadcrumb Style Title */}
          <div className="flex items-center text-sm">
            <span className="hidden sm:flex items-center gap-2 text-gray-400 font-medium">
              <span className="hover:text-blue-400 hover:underline cursor-pointer transition-colors">abuzar-ali</span>
              <Slash className="w-3 h-3 text-gray-600" />
            </span>
            <span className="font-semibold text-white ml-2 sm:ml-0 bg-gray-800/50 px-2 py-1 rounded-md">
              {title}
            </span>
          </div>
        </div>

        {/* RIGHT: Search & Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Search Bar (Command Palette Style) */}
          <div className="hidden md:block relative group">
            <div className={`
              flex items-center transition-all duration-200 ease-in-out border rounded-md px-3 py-1.5
              ${isSearchFocused 
                ? 'w-64 border-blue-500 ring-1 ring-blue-500/20 bg-[#0d1117]' 
                : 'w-48 border-gray-700 bg-gray-800/50 hover:border-gray-600'}
            `}>
              <Search className="w-4 h-4 text-gray-500 mr-2" />
              <input 
                type="text"
                placeholder="Type / to search"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="bg-transparent border-none outline-none text-sm text-white placeholder-gray-500 w-full"
              />
              <kbd className="hidden lg:block text-[10px] font-mono bg-gray-700 text-gray-400 px-1.5 py-0.5 rounded border border-gray-600">
                /
              </kbd>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 border-l border-gray-800 pl-3 sm:pl-4">
            
            {/* New Issue / Repo Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="hidden sm:flex items-center justify-center p-2 text-gray-400 hover:text-green-400 hover:bg-gray-800 rounded-md transition-colors"
              title="New..."
            >
              <Plus className="w-5 h-5" />
            </motion.button>

            {/* Notifications */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0d1117]" />
            </motion.button>

            {/* Profile Dropdown */}
            <div className="relative ml-1">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 ring-2 ring-gray-800 cursor-pointer hover:ring-gray-600 transition-all" />
                <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''} hidden sm:block`} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setIsProfileOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.1 }}
                      className="absolute right-0 mt-2 w-48 origin-top-right rounded-md border border-gray-700 bg-[#161b22] shadow-xl z-50 py-1"
                    >
                      <div className="px-4 py-2 border-b border-gray-700/50 mb-1">
                        <p className="text-xs text-gray-400">Signed in as</p>
                        <p className="text-sm font-semibold text-white">abuzar-ali</p>
                      </div>
                      
                      {profileMenuItems.map((item) => (
                        <button
                          key={item.name}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-blue-600 hover:text-white transition-colors text-left"
                        >
                          {item.icon}
                          <span>{item.name}</span>
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;