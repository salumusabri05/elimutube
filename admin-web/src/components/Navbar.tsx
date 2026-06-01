'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon, Bell, LogOut, Search, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const router = useRouter();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('light', savedTheme === 'light');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.classList.toggle('light', nextTheme === 'light');
  };

  const handleLogout = () => {
    // Clear mock auth state
    localStorage.removeItem('isAdminAuthenticated');
    router.push('/login');
  };

  return (
    <header className="h-16 border-b border-slate-800/50 bg-[#090b16]/80 backdrop-blur-xl px-6 flex items-center justify-between relative z-20">
      {/* Search Input */}
      <div className="relative w-72">
        <input 
          type="text" 
          placeholder="Global system search..."
          className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-white/5 border border-white/5 focus:outline-none focus:border-indigo-500 text-xs text-white placeholder-slate-500 transition-all"
        />
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2" />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-white/5 border border-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-all"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>

        {/* Notifications */}
        <button 
          className="p-2 rounded-xl bg-white/5 border border-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-all relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full badge-glow-yellow" />
        </button>

        <div className="h-6 w-[1px] bg-slate-800" />

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
