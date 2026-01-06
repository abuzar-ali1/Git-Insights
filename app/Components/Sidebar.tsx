'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Home, 
  TrendingUp, 
  Users, 
  Settings, 
  Database, 
  FileText,
  Shield,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  PieChart,
  LineChart as LineChartIcon,
  Activity,
  Globe,
  Zap,
  CreditCard,
  Calendar,
  Download,
  Star,
  Menu,
  X
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Dashboard');
  const pathname = usePathname();

  const navigationItems = [
    {
      category: 'Main',
      items: [
        { name: 'Dashboard', icon: <Home className="w-5 h-5" />, path: '/dashboard', badge: null },
        { name: 'Analytics', icon: <BarChart3 className="w-5 h-5" />, path: '/analytics', badge: 'New' },
        { name: 'Reports', icon: <FileText className="w-5 h-5" />, path: '/reports', badge: null },
        { name: 'Live Data', icon: <Activity className="w-5 h-5" />, path: '/live', badge: 'Live' },
      ]
    },
    {
      category: 'Charts',
      items: [
        { name: 'Line Charts', icon: <LineChartIcon className="w-5 h-5" />, path: '/charts/line' },
        { name: 'Pie Charts', icon: <PieChart className="w-5 h-5" />, path: '/charts/pie' },
        { name: 'Bar Charts', icon: <BarChart3 className="w-5 h-5" />, path: '/charts/bar' },
        { name: 'Trends', icon: <TrendingUp className="w-5 h-5" />, path: '/trends' },
      ]
    },
    {
      category: 'Data',
      items: [
        { name: 'Databases', icon: <Database className="w-5 h-5" />, path: '/data' },
        { name: 'Export', icon: <Download className="w-5 h-5" />, path: '/export' },
        { name: 'Integrations', icon: <Zap className="w-5 h-5" />, path: '/integrations', badge: '3' },
      ]
    },
    {
      category: 'Admin',
      items: [
        { name: 'Users', icon: <Users className="w-5 h-5" />, path: '/users' },
        { name: 'Billing', icon: <CreditCard className="w-5 h-5" />, path: '/billing' },
        { name: 'Calendar', icon: <Calendar className="w-5 h-5" />, path: '/calendar' },
        { name: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/settings' },
      ]
    }
  ];

  const quickStats = [
    { label: 'Active Users', value: '1,248', change: '+12%', icon: <Users className="w-4 h-4" /> },
    { label: 'API Calls', value: '42.5K', change: '+24%', icon: <Zap className="w-4 h-4" /> },
    { label: 'Data Points', value: '2.4M', change: '+8%', icon: <Database className="w-4 h-4" /> },
  ];

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
        setIsCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const sidebarVariants = {
    expanded: { width: 280, x: 0 },
    collapsed: { width: 80, x: 0 },
    mobile: { width: 280, x: 0 },
    hidden: { width: 280, x: -280 }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsMobileOpen(true)}
        className="fixed bottom-6 left-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30 lg:hidden"
      >
        <Menu className="h-6 w-6 text-white" />
      </motion.button>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={ 
            isMobileOpen
            ? (isMobileOpen ? "mobile" : "hidden") 
            : (isCollapsed ? "collapsed" : "expanded")
        }
        variants={sidebarVariants}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 z-40 h-screen border-r border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/80 lg:relative lg:h-auto"
      >
        <div className="flex h-full flex-col">
          {/* Logo and Toggle */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <AnimatePresence mode="wait">
              {!isCollapsed || window.innerWidth < 1024 ? (
                <motion.div
                  key="logo-expanded"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center space-x-3"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600"
                  >
                    <BarChart3 className="h-6 w-6 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      InsightFlow
                    </h2>
                    <p className="text-xs text-gray-400">Analytics Pro</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="logo-collapsed"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex justify-center w-full"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600"
                  >
                    <BarChart3 className="h-6 w-6 text-white" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleSidebar}
              className="hidden lg:flex items-center justify-center rounded-lg p-2 text-gray-400 hover:text-white hover:bg-gray-800"
            >
              {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </motion.button>

            {/* Close button for mobile */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto py-6">
            {navigationItems.map((section, sectionIndex) => (
              <div key={section.category} className="mb-8">
                <AnimatePresence>
                  {(!isCollapsed || window.innerWidth < 1024) && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="px-6 mb-3"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        {section.category}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-1 px-3">
                  {section.items.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={item.path}
                        onClick={() => {
                          setActiveItem(item.name);
                          if (window.innerWidth < 1024) setIsMobileOpen(false);
                        }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.02, x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          className={`
                            flex items-center rounded-lg px-3 py-3 transition-all
                            ${activeItem === item.name
                              ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border-l-4 border-blue-500'
                              : 'text-gray-400 hover:text-white hover:bg-gray-800'
                            }
                          `}
                        >
                          <div className="flex items-center justify-center w-8">
                            {item.icon}
                          </div>
                          <AnimatePresence mode="wait">
                            {(!isCollapsed || window.innerWidth < 1024) && (
                              <motion.div
                                key={`text-${item.name}`}
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                className="ml-3 flex-1 flex items-center justify-between"
                              >
                                <span className="text-sm font-medium">{item.name}</span>
                                {item.badge && (
                                  <span className={`
                                    text-xs px-2 py-1 rounded-full
                                    ${item.badge === 'New' ? 'bg-green-500/20 text-green-400' : 
                                      item.badge === 'Live' ? 'bg-red-500/20 text-red-400' : 
                                      'bg-blue-500/20 text-blue-400'}
                                  `}>
                                    {item.badge}
                                  </span>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Quick Stats (Collapsed View) */}
          <AnimatePresence>
            {!isCollapsed || window.innerWidth < 1024 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="border-t border-gray-800 p-6"
              >
                <h3 className="text-sm font-semibold text-white mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  {quickStats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between rounded-lg bg-gray-800/50 p-3"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="rounded-lg bg-blue-500/10 p-2">
                          {stat.icon}
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">{stat.label}</p>
                          <p className="text-lg font-bold text-white">{stat.value}</p>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-green-400">{stat.change}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="border-t border-gray-800 p-4"
              >
                <div className="space-y-4">
                  {quickStats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      whileHover={{ scale: 1.1 }}
                      className="flex flex-col items-center space-y-1"
                      title={`${stat.label}: ${stat.value} (${stat.change})`}
                    >
                      <div className="rounded-lg bg-blue-500/10 p-2">
                        {stat.icon}
                      </div>
                      <span className="text-xs font-bold text-white">{stat.value}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* User Profile & Settings */}
          <div className="border-t border-gray-800 p-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
              <AnimatePresence>
                {(!isCollapsed || window.innerWidth < 1024) && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="flex-1 overflow-hidden"
                  >
                    <p className="text-sm font-medium text-white">Alex Johnson</p>
                    <p className="text-xs text-gray-400">Admin</p>
                  </motion.div>
                )}
              </AnimatePresence>
              <button className="text-gray-400 hover:text-white">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            animate={{
              y: [0, 100, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -right-10 top-20 h-32 w-32 rounded-full bg-gradient-to-r from-blue-500/5 to-purple-500/5 blur-3xl"
          />
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;