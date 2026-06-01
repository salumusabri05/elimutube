'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, BookOpen, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Mock Authentication matching admin credentials
    setTimeout(() => {
      if (email === 'admin@elimutube.com' && password === 'admin123') {
        localStorage.setItem('isAdminAuthenticated', 'true');
        router.push('/');
      } else {
        setError('Invalid admin credentials. Hint: admin@elimutube.com / admin123');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#060813] relative overflow-hidden px-4">
      {/* Background Orbs */}
      <div className="glow-orb-purple top-[-100px] left-[-100px]" />
      <div className="glow-orb-blue bottom-[-100px] right-[-100px]" />
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl relative z-10 shadow-2xl border-white/5 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 mx-auto">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
          <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
            ElimuTube Console Access
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/25 rounded-2xl text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Admin Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@elimutube.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/5 focus:outline-none focus:border-indigo-500 text-sm text-white placeholder-slate-600 transition-all"
              />
              <Mail className="w-4 h-4 text-slate-600 absolute left-3 top-3.5" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/5 focus:outline-none focus:border-indigo-500 text-sm text-white placeholder-slate-600 transition-all"
              />
              <Lock className="w-4 h-4 text-slate-600 absolute left-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/15 hover:shadow-indigo-600/30 transition-all duration-200 mt-2 flex items-center justify-center"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Sign In to Console'
            )}
          </button>
        </form>

        <div className="pt-2 text-center">
          <span className="text-[10px] text-slate-600 font-mono">
            Secure admin connection. Unauthorized access is monitored.
          </span>
        </div>
      </div>
    </div>
  );
}
