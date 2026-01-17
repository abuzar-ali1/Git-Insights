'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, ShieldCheck, Database, Zap, Cpu } from 'lucide-react';
import { useSettings } from '@/Context/SettingsContext';

export default function SettingsPage() {
  const { defaultRepo, saveDefaultRepo } = useSettings();
  const [inputRepo, setInputRepo] = useState(defaultRepo);

  return (
    <div className="min-h-screen bg-[#0d1117] p-4 lg:p-8 text-white max-w-4xl mx-auto">

      {/* Header */}
      <div className="mb-10 border-b border-gray-800 pb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
          <Settings className="w-8 h-8 text-gray-400" />
          System Settings
        </h1>
        <p className="text-gray-400">Configuration and status of Abuzar's Dashboard.</p>
      </div>

      {/*  STATUS CARD (Replaces the Token Input) */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#161b22] to-[#1c2128] border border-green-500/30 rounded-xl p-6 mb-8 shadow-lg relative overflow-hidden"
      >
        {/* Decorative Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="flex items-start justify-between relative z-10">
          <div className="flex gap-4">
            <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <ShieldCheck className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">System Authenticated</h2>
              <p className="text-sm text-gray-400 mt-1 max-w-md">
                This dashboard is running on <span className="text-green-400 font-bold">Abuzar Ali's Pro API Key</span>.
                High-performance mode is active (5,000 requests/hr).
              </p>
            </div>
          </div>

          <div className="hidden sm:block text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-bold border border-green-500/20">
              <Zap className="w-3 h-3" />
              ONLINE
            </div>
          </div>
        </div>

        {/* Fake System Stats to look cool */}
        <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-700/50">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Owner</p>
            <p className="font-mono text-sm text-white">@abuzar-ali1</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Access Level</p>
            <p className="font-mono text-sm text-white">Administrator</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Latency</p>
            <p className="font-mono text-sm text-green-400">24ms</p>
          </div>
        </div>
      </motion.section>

      {/* . Default Repo Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#161b22] border border-gray-800 rounded-xl p-6 mb-8"
      >
        <div className="flex gap-4 mb-6">
          <div className="p-3 bg-blue-500/10 rounded-lg">
            <Database className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Featured Repository</h2>
            <p className="text-sm text-gray-400 mt-1">
              Select which project to display on the dashboard home screen.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={inputRepo}
            onChange={(e) => setInputRepo(e.target.value)}
            placeholder="owner/repo"
            className="w-full md:flex-1 bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            onClick={() => saveDefaultRepo(inputRepo)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors shadow-lg shadow-blue-900/20"
          >
            Update
          </button>
        </div>
      </motion.section>

      {/*. Tech Specs (Visual Filler) */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="border border-gray-800 rounded-xl p-6 opacity-50 hover:opacity-100 transition-opacity"
      >
        <div className="flex items-center gap-3 text-gray-500">
          <Cpu className="w-5 h-5" />
          <p className="text-sm">AbuzarOS v2.4.0 • Built with Next.js 16 • TypeScript  • Github Rest API  • Tailwind CSS </p>
        </div>
      </motion.section>

    </div>
  );
}