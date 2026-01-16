'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  Bell,
  Search,
  User,
  Github,
  Slash,
  ChevronDown,
  Code,
  Mail
} from 'lucide-react';
import { useSettings } from '@/Context/SettingsContext';

interface HeaderProps {
  onMenuClick?: () => void;
}

const ROUTE_TITLES: Record<string, string> = {
  '/': 'Overview',
  '/frequency': 'Frequency',
  '/commits': 'Commits',
  '/pulls': 'Pull Requests',
  '/network': 'Network',
  '/languages': 'Languages',
  '/settings': 'Settings',
};

const Header = ({ onMenuClick }: HeaderProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const { defaultRepo } = useSettings();
  const pathname = usePathname();
  const currentTitle = ROUTE_TITLES[pathname] || 'Overview';
  const displayUser = defaultRepo.includes('/') ? defaultRepo.split('/')[0] : 'Guest';

  // ABUZAR'S STATIC PROFILE DATA
  const MY_PROFILE = {
    name: 'Abuzar Ali',
    role: 'Frontend Developer',
    avatar: 'https://github.com/abuzar-ali1.png', // Automatically gets your real GitHub pic
    github: 'https://github.com/abuzar-ali1',
    portfolio: 'https://abuzar-ali.vercel.app/'
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 w-full border-b border-gray-800 bg-[#0d1117]/80 backdrop-blur-md"
    >
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">

        {/* LEFT: Logo & Breadcrumbs */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-white rounded-md hover:bg-gray-800"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center text-sm">
            <span className="hidden sm:flex items-center gap-2 text-gray-400 font-medium">
              <span className="hover:text-blue-400 cursor-pointer transition-colors">
                {displayUser}
              </span>
              <Slash className="w-3 h-3 text-gray-600" />
            </span>
            <span className="font-semibold text-white ml-2 sm:ml-0 bg-gray-800/50 px-2 py-1 rounded-md capitalize">
              {currentTitle}
            </span>
          </div>
        </div>

        {/* RIGHT: Search & Profile */}
        <div className="flex items-center gap-3 sm:gap-4">

          {/* Search Bar */}
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

          <div className="flex items-center gap-2 border-l border-gray-800 pl-3 sm:pl-4">

            {/* Notification Bell (Mock) */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-blue-500 rounded-full border border-[#0d1117]" />
            </motion.button>

            {/* ABUZAR'S PROFILE DROPDOWN */}
            <div className="relative ml-1">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <img
                  src={MY_PROFILE.avatar}
                  alt="Abuzar"
                  className="h-8 w-8 rounded-full border border-gray-600 bg-gray-800"
                />
                <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''} hidden sm:block`} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    {/* Invisible Overlay to close menu when clicking outside */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsProfileOpen(false)}
                    />

                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.1 }}
                      className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl border border-gray-700 bg-[#161b22] shadow-2xl z-50 overflow-hidden"
                    >
                      {/* Abuzar's Details */}
                      <div className="px-5 py-4 border-b border-gray-700 bg-[#0d1117]">
                        <p className="text-sm font-bold text-white">{MY_PROFILE.name}</p>
                        <p className="text-xs text-blue-400 font-mono mt-0.5">{MY_PROFILE.role}</p>
                      </div>

                      <div className="p-2">
                        <a
                          href={MY_PROFILE.github}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Github className="w-4 h-4 text-gray-500" />
                          <span>View GitHub Profile</span>
                        </a>

                        <a
                          href={MY_PROFILE.portfolio}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => setIsProfileOpen(false)}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition-colors text-left">
                          <Code className="w-4 h-4 text-gray-500" />
                          <span>My Portfolio</span>
                        </a>

                        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition-colors text-left">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span>Contact Me</span>
                        </button>
                      </div>

                      <div className="px-5 py-2 bg-gray-800/30 border-t border-gray-700 text-[10px] text-gray-500 text-center">
                        Managed by Abuzar Ali
                      </div>
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