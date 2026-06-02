'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon, Bell, LogOut, Search, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [apiEnv, setApiEnv] = useState<'production' | 'local'>('production');
  const router = useRouter();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');

    const savedEnv = localStorage.getItem('api_env') as 'production' | 'local' | null;
    if (savedEnv) {
      setApiEnv(savedEnv);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  };

  const handleEnvChange = (env: 'production' | 'local') => {
    setApiEnv(env);
    localStorage.setItem('api_env', env);
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    router.push('/login');
  };

  return (
    <header className="h-16 border-b theme-border bg-[var(--nav-bg)] backdrop-blur-xl px-6 flex items-center justify-between relative z-20 transition-colors duration-300">
      {/* Search Input */}
      <div className="relative w-72">
        <input 
          type="text" 
          placeholder="Global system search..."
          className="w-full pl-9 pr-4 py-1.5 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-xs theme-text-primary placeholder-slate-500 transition-all"
        />
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2" />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Environment Switcher */}
        <div className="flex items-center gap-1 theme-item-bg border theme-border rounded-xl p-0.5 text-[11px] font-semibold">
          <button 
            onClick={() => handleEnvChange('production')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              apiEnv === 'production' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'theme-text-secondary hover:theme-text-primary'
            }`}
          >
            Prod API
          </button>
          <button 
            onClick={() => handleEnvChange('local')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              apiEnv === 'local' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'theme-text-secondary hover:theme-text-primary'
            }`}
          >
            Local API
          </button>
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-xl theme-item-bg border theme-border theme-text-secondary hover:theme-text-primary theme-item-hover transition-all"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>

        {/* Notifications */}
        <button 
          onClick={() => router.push('/notifications')}
          className="p-2 rounded-xl theme-item-bg border theme-border theme-text-secondary hover:theme-text-primary theme-item-hover transition-all relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full badge-glow-yellow" />
        </button>

        <div className="h-6 w-[1px] theme-border border-l" />

        {/* Logout */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 text-red-400 text-xs font-semibold transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log Out</span>
        </button>
      </div>
    </header>
  );
}
