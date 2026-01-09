'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  Menu,
  X,
  Bell,
  Search,
  TrendingUp,
  User,
  Settings,
  LogOut,
  Home,
  FileText
} from 'lucide-react';
import { useComingSoon } from '@/hooks/useComingSoon';

interface HeaderProps {
  onMenuClick?: () => void;
  isSidebarOpen?: boolean;
}

const Header = ({ onMenuClick, isSidebarOpen = false }: HeaderProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Dashboard');

  const { handleComingSoon } = useComingSoon();

  const navItems = [
    { name: 'Dashboard', icon: <Home className="w-4 h-4" />, path: '/dashboard' },
    { name: 'Analytics', icon: <TrendingUp className="w-4 h-4" />, path: '/analytics' },
    { name: 'Reports', icon: <FileText className="w-4 h-4" />, path: '/reports' },
    { name: 'Settings', icon: <Settings className="w-4 h-4" />, path: '/settings' },
  ];

  const profileMenuItems = [
    { name: 'My Profile', icon: <User className="w-4 h-4" /> },
    { name: 'Settings', icon: <Settings className="w-4 h-4" /> },
    { name: 'Logout', icon: <LogOut className="w-4 h-4" /> },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: 0.1
      }}
      className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60"
    >
      <div className="mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex h-14 sm:h-16 items-center justify-between">

          {/* Left Section: Logo & Mobile Menu Button */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onMenuClick}
              className="lg:hidden rounded-lg p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-gray-800"
              aria-label="Toggle menu"
            >
              {isSidebarOpen ? (
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </motion.button>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center space-x-2 sm:space-x-3"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600"
              >
                <BarChart3 className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </motion.div>

              <div className="hidden sm:block">
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                >
                  InsightFlow
                </motion.h1>
                <p className="text-xs text-gray-400 hidden lg:block">Analytics Dashboard</p>
              </div>
            </motion.div>
          </div>

          {/* Center Section: Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                onClick={handleComingSoon}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(59, 130, 246, 0.1)"
                }}
                whileTap={{ scale: 0.95 }}
                href={"#"}
                className={`flex items-center space-x-2 rounded-lg
                 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-white hover:bg-gray-800 
                 ${activeItem === item.name
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border-l-4 border-blue-500'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </motion.a>
            ))}
          </nav>

          {/* Right Section: Search, Notifications, Profile */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="lg:hidden rounded-full p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-gray-800"
              aria-label="Search"
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            </motion.button>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search metrics..."
                  className="pl-10 pr-4 py-2 w-56 lg:w-64 rounded-lg border border-gray-700 bg-gray-800 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </motion.div>

            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 right-0 top-full lg:hidden px-4 py-3 border-b border-gray-800 bg-gray-900"
                >
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search metrics, reports..."
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                      autoFocus
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
            onClick={handleComingSoon}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative rounded-full p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -right-0.5 -top-0.5 h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-red-500"
              />
            </motion.button>

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 rounded-full p-0.5 hover:bg-gray-800"
              >
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />

                <div className="hidden sm:block text-left">
                  <p className="text-xs sm:text-sm font-medium text-white">Abuzar Ali</p>
                  <p className="text-xs text-gray-400 hidden md:block">Admin</p>
                </div>
              </motion.button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-gray-700 bg-gray-900 py-1 shadow-xl z-50"
                  >
                    {profileMenuItems.map((item) => (
                      <motion.a
                        key={item.name}
                        whileHover={{ x: 5, backgroundColor: "rgba(55, 65, 81, 0.5)" }}
                        href="#"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:text-white"
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </motion.a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="lg:hidden border-t border-gray-800">
          <div className="flex justify-around py-2">
            {navItems.slice(0, 4).map((item) => (
              <a
                key={item.name}
                href={item.path}
                className="flex flex-col items-center p-2 text-xs text-gray-400 hover:text-white transition-colors"
              >
                {item.icon}
                <span className="mt-1">{item.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;