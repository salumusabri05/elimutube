'use client';

import { useState, useEffect } from 'react';
import { Users, Search, AlertCircle, RefreshCw, BookOpen, Clock, Award, CreditCard } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('');

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiRequest('students');
      setStudents(data);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch students.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const filtered = students.filter(s => {
    const name = (s.display_name || '').toLowerCase();
    const email = (s.email || '').toLowerCase();
    return name.includes(searchText.toLowerCase()) || email.includes(searchText.toLowerCase());
  });

  const totalWatchHours = Math.round(students.reduce((sum, s) => sum + s.total_watch_seconds, 0) / 3600);
  const totalCompleted = students.reduce((sum, s) => sum + s.lessons_completed, 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold theme-text-primary tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-500" />
            Student Management
          </h1>
          <p className="text-sm mt-1 theme-text-secondary">Browse, search, and review student engagement across the platform.</p>
        </div>
        <button onClick={fetchStudents} className="flex items-center gap-2 px-4 py-2.5 theme-item-bg theme-item-hover border theme-border theme-text-secondary hover:theme-text-primary text-sm font-semibold rounded-xl transition-all duration-200">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: students.length.toLocaleString(), icon: Users, color: 'text-blue-400' },
          { label: 'Lessons Completed', value: totalCompleted.toLocaleString(), icon: BookOpen, color: 'text-emerald-400' },
          { label: 'Total Watch Hours', value: `${totalWatchHours}h`, icon: Clock, color: 'text-violet-400' },
          { label: 'Avg Quiz Score', value: students.length > 0 ? `${Math.round(students.filter(s => s.quizzes_taken > 0).reduce((sum, s) => sum + s.avg_quiz_score, 0) / (students.filter(s => s.quizzes_taken > 0).length || 1))}%` : '0%', icon: Award, color: 'text-amber-400' },
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-5 rounded-2xl border theme-border">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-xs font-semibold theme-text-secondary">{stat.label}</span>
            </div>
            <span className="text-2xl font-extrabold theme-text-primary">{stat.value}</span>
          </div>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/25 rounded-2xl text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" /><span>{error}</span>
        </div>
      )}

      {/* Student Table */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-xl theme-border border">
        <div className="p-6 border-b theme-border bg-slate-100/50 dark:bg-[#0d1223]/30 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          <h2 className="text-lg font-bold theme-text-primary">Student Registry</h2>
          <div className="relative">
            <input type="text" placeholder="Search by name or email..." value={searchText} onChange={(e) => setSearchText(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary placeholder-slate-500 w-72" />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <span className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 theme-text-secondary">No students found.</div>
          ) : (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b theme-border bg-slate-100/20 dark:bg-[#090b16]/30 theme-text-secondary text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Lessons Done</th>
                  <th className="px-6 py-4">Watch Time</th>
                  <th className="px-6 py-4">Quizzes</th>
                  <th className="px-6 py-4">Avg Score</th>
                  <th className="px-6 py-4">Subscriptions</th>
                  <th className="px-6 py-4">Total Spent</th>
                  <th className="px-6 py-4">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y theme-border text-sm">
                {filtered.map((s) => (
                  <tr key={s.id} className="theme-item-hover transition-colors">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1b1e35] to-[#252a4e] flex items-center justify-center font-bold text-blue-400 border border-blue-500/10">
                          {(s.display_name || s.email).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold theme-text-primary">{s.display_name || 'Student'}</div>
                          <div className="text-xs theme-text-secondary font-mono mt-0.5">{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="font-bold theme-text-primary">{s.lessons_completed}</span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap theme-text-secondary">
                      {Math.round(s.total_watch_seconds / 60)}m
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap theme-text-secondary">{s.quizzes_taken}</td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {s.quizzes_taken > 0 ? (
                        <span className={`px-2 py-0.5 text-xs font-bold rounded-full border ${
                          s.avg_quiz_score >= 70 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          s.avg_quiz_score >= 40 ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                          'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>{s.avg_quiz_score}%</span>
                      ) : <span className="theme-text-secondary text-xs">—</span>}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-full border ${
                        s.active_subscriptions > 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                      }`}>{s.active_subscriptions} active</span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap font-semibold text-emerald-400">
                      {s.total_spent > 0 ? `TSh ${s.total_spent.toLocaleString()}` : '—'}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-xs theme-text-secondary">
                      {new Date(s.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
