'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface RateLimit {
  limit: number;
  remaining: number;
  reset: number;
}

interface SettingsContextType {
  token: string;
  defaultRepo: string;
  rateLimit: RateLimit | null;
  saveDefaultRepo: (repo: string) => void;
}

const SettingsContext = createContext<SettingsContextType>({} as SettingsContextType);

export function SettingsProvider({ children }: { children: React.ReactNode }) {

  const [token] = useState(process.env.NEXT_PUBLIC_GITHUB_TOKEN || '');
  
  const [defaultRepo, setDefaultRepo] = useState('facebook/react');
  const [rateLimit, setRateLimit] = useState<RateLimit | null>(null);

  //  Load Preferences on Start
  useEffect(() => {
    const savedRepo = localStorage.getItem('gh_default_repo');
    if (savedRepo) setDefaultRepo(savedRepo);
    
    // Check system health immediately
    if (token) checkLimits(token);
  }, [token]);

  // Helper: Check GitHub Limits
  const checkLimits = async (tk: string) => {
    try {
      const res = await fetch('https://api.github.com/rate_limit', {
        headers: { Authorization: `Bearer ${tk}` }
      });
      const data = await res.json();
      if (data.rate) {
        setRateLimit({
          limit: data.rate.limit,
          remaining: data.rate.remaining,
          reset: data.rate.reset
        });
      }
    } catch (e) {
      console.error("System Check Failed:", e);
    }
  };

  // Save Default Repo (User Preference)
  const saveDefaultRepo = (repo: string) => {
    if (repo.includes('/')) {
      setDefaultRepo(repo);
      localStorage.setItem('gh_default_repo', repo);
    }
  };

  return (
    <SettingsContext.Provider value={{ token, defaultRepo, rateLimit, saveDefaultRepo }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);