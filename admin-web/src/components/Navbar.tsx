'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon, Bell, LogOut, Search, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const router = useRouter();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    router.push('/login');
  };

  return (
    <header className="h-16 bg-white/95 dark:bg-[#0b0f19]/95 backdrop-blur-md px-4 md:px-6 flex items-center justify-between relative z-30 border-b border-slate-200/60 dark:border-slate-800/60 transition-colors duration-300">
      
      <div className="flex items-center gap-4">
        {/* Mobile Menu Trigger */}
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-250 md:hidden transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Input */}
        <div className="relative w-full max-w-[200px] md:max-w-[280px]">
          <input 
            type="text" 
            placeholder="Global system search..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 md:gap-3">

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-all shadow-sm"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>

        {/* Notifications */}
        <button 
          onClick={() => router.push('/notifications')}
          className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-all relative shadow-sm"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full badge-glow-yellow" />
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden md:block" />

        {/* Logout */}
        <button 
          onClick={handleLogout}
          className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/15 text-red-500 hover:text-red-600 text-xs font-semibold transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log Out</span>
        </button>
      </div>
    </header>
  );
}
