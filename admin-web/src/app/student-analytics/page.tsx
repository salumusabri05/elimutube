'use client';

import { useState, useEffect } from 'react';
import { BarChart3, AlertCircle, RefreshCw, BookOpen, Clock, Award, Users, TrendingUp } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function StudentAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await apiRequest('student-analytics');
      setData(result);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch student analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnalytics(); }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <span className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/25 rounded-2xl text-red-400">
          <AlertCircle className="w-5 h-5" /><span>{error}</span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const scoreColors: Record<string, string> = {
    '0-20': 'bg-red-500',
    '21-40': 'bg-orange-500',
    '41-60': 'bg-yellow-500',
    '61-80': 'bg-blue-500',
    '81-100': 'bg-emerald-500',
  };
  const maxScore = Math.max(...Object.values(data.scoreDistribution || {}).map(Number), 1);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold theme-text-primary tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-500" />
            Student Analytics
          </h1>
          <p className="text-sm mt-1 theme-text-secondary">Lesson progress tracking, quiz performance distribution, and subject engagement analytics.</p>
        </div>
        <button onClick={fetchAnalytics} className="flex items-center gap-2 px-4 py-2.5 theme-item-bg theme-item-hover border theme-border theme-text-secondary hover:theme-text-primary text-sm font-semibold rounded-xl transition-all duration-200">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Lessons Started', value: data.totalProgress, icon: BookOpen, color: 'text-indigo-400' },
          { label: 'Completed', value: data.totalCompleted, icon: Award, color: 'text-emerald-400' },
          { label: 'Watch Hours', value: `${data.totalWatchHours}h`, icon: Clock, color: 'text-violet-400' },
          { label: 'Quiz Attempts', value: data.totalQuizAttempts, icon: Users, color: 'text-blue-400' },
          { label: 'Avg Quiz Score', value: `${data.avgQuizScore}%`, icon: TrendingUp, color: 'text-amber-400' },
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-5 rounded-2xl border theme-border">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-xs font-semibold theme-text-secondary">{stat.label}</span>
            </div>
            <span className={`text-xl font-extrabold ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Score Distribution */}
        <div className="glass-panel rounded-3xl p-6 border theme-border">
          <h2 className="text-lg font-bold theme-text-primary mb-6">Quiz Score Distribution</h2>
          <div className="space-y-4">
            {Object.entries(data.scoreDistribution || {}).map(([range, count]) => (
              <div key={range}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold theme-text-secondary">{range}%</span>
                  <span className="font-bold theme-text-primary">{count as number} students</span>
                </div>
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${scoreColors[range] || 'bg-indigo-500'} rounded-full transition-all duration-700`}
                    style={{ width: `${Math.max(((count as number) / maxScore) * 100, 2)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Breakdown */}
        <div className="glass-panel rounded-3xl p-6 border theme-border">
          <h2 className="text-lg font-bold theme-text-primary mb-6">Subject Engagement</h2>
          {data.subjectBreakdown && data.subjectBreakdown.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="theme-text-secondary font-bold uppercase tracking-wider border-b theme-border">
                    <th className="text-left py-3">Subject</th>
                    <th className="text-right py-3">Views</th>
                    <th className="text-right py-3">Done</th>
                    <th className="text-right py-3">Rate</th>
                    <th className="text-right py-3">Avg Watch</th>
                  </tr>
                </thead>
                <tbody className="divide-y theme-border">
                  {data.subjectBreakdown.map((s: any, i: number) => (
                    <tr key={i} className="theme-item-hover">
                      <td className="py-3">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">{s.subject}</span>
                      </td>
                      <td className="py-3 text-right font-bold theme-text-primary">{s.views}</td>
                      <td className="py-3 text-right text-emerald-400 font-bold">{s.completions}</td>
                      <td className="py-3 text-right">
                        <span className={`font-bold ${s.completionRate >= 50 ? 'text-emerald-400' : 'text-yellow-400'}`}>{s.completionRate}%</span>
                      </td>
                      <td className="py-3 text-right theme-text-secondary">{s.avgWatchMin}min</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 theme-text-secondary">No subject data available.</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Performers */}
        <div className="glass-panel rounded-3xl p-6 border theme-border">
          <h2 className="text-lg font-bold theme-text-primary mb-4">Top Performers</h2>
          <div className="space-y-2">
            {(data.topPerformers || []).map((p: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl theme-item-bg border theme-border theme-item-hover transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                    i === 0 ? 'bg-gradient-to-tr from-amber-500 to-yellow-400' :
                    i === 1 ? 'bg-gradient-to-tr from-slate-400 to-slate-300' :
                    i === 2 ? 'bg-gradient-to-tr from-amber-700 to-amber-600' :
                    'bg-gradient-to-tr from-indigo-600 to-violet-500'
                  }`}>{i + 1}</span>
                  <span className="text-sm font-semibold theme-text-primary">{p.name}</span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="theme-text-secondary">{p.quizzesTaken} quizzes</span>
                  <span className={`font-bold ${p.avgScore >= 70 ? 'text-emerald-400' : p.avgScore >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {p.avgScore}%
                  </span>
                </div>
              </div>
            ))}
            {(!data.topPerformers || data.topPerformers.length === 0) && (
              <div className="text-center py-8 theme-text-secondary text-sm">No quiz data available.</div>
            )}
          </div>
        </div>

        {/* Recent Quiz Results */}
        <div className="glass-panel rounded-3xl p-6 border theme-border">
          <h2 className="text-lg font-bold theme-text-primary mb-4">Recent Quiz Submissions</h2>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {(data.recentQuizResults || []).map((r: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl theme-item-bg border theme-border">
                <div>
                  <div className="text-sm font-semibold theme-text-primary">{r.student_name}</div>
                  <div className="text-[11px] theme-text-secondary mt-0.5">{r.lesson_title}</div>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="theme-text-secondary">{new Date(r.completed_at).toLocaleDateString()}</span>
                  <span className={`px-2 py-0.5 font-bold rounded-full border ${
                    r.score >= 70 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    r.score >= 40 ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                    'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>{r.score}%</span>
                </div>
              </div>
            ))}
            {(!data.recentQuizResults || data.recentQuizResults.length === 0) && (
              <div className="text-center py-8 theme-text-secondary text-sm">No recent submissions.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
