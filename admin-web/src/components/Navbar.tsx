'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon, Bell, LogOut, Search, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
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
    <header className="h-16 bg-[var(--nav-bg)] backdrop-blur-2xl px-4 md:px-6 flex items-center justify-between relative z-20 transition-colors duration-300"
            style={{ boxShadow: '0 1px 0 0 var(--surface-divider)' }}>
      
      <div className="flex items-center gap-4">
        {/* Mobile Menu Trigger */}
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-xl theme-item-hover theme-text-secondary hover:theme-text-primary md:hidden transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Input */}
        <div className="relative w-full max-w-[200px] md:max-w-[280px]">
          <input 
            type="text" 
            placeholder="Global system search..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[var(--item-bg)] focus:bg-[var(--card-bg)] border-none ring-1 ring-inset ring-[var(--surface-divider)] focus:ring-2 focus:ring-indigo-500/50 outline-none text-xs theme-text-primary placeholder-slate-500 transition-all shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Environment Switcher */}
        <div className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-[var(--item-bg)] ring-1 ring-inset ring-[var(--surface-divider)] text-[11px] font-semibold">
          <button 
            onClick={() => handleEnvChange('production')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              apiEnv === 'production' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'theme-text-secondary hover:theme-text-primary hover:bg-[var(--item-hover)]'
            }`}
          >
            Prod API
          </button>
          <button 
            onClick={() => handleEnvChange('local')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              apiEnv === 'local' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'theme-text-secondary hover:theme-text-primary hover:bg-[var(--item-hover)]'
            }`}
          >
            Local API
          </button>
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-xl theme-item-bg ring-1 ring-inset ring-[var(--surface-divider)] theme-text-secondary hover:theme-text-primary hover:bg-[var(--item-hover)] transition-all shadow-sm"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
        </button>

        {/* Notifications */}
        <button 
          onClick={() => router.push('/notifications')}
          className="p-2 rounded-xl theme-item-bg ring-1 ring-inset ring-[var(--surface-divider)] theme-text-secondary hover:theme-text-primary hover:bg-[var(--item-hover)] transition-all relative shadow-sm"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full badge-glow-yellow" />
        </button>

        <div className="h-6 w-px bg-[var(--surface-divider)] mx-1 hidden md:block" />

        {/* Logout */}
        <button 
          onClick={handleLogout}
          className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/15 text-red-500 text-xs font-semibold transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log Out</span>
        </button>
      </div>
    </header>
  );
}
