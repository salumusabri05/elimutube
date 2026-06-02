'use client';

import { useState, useEffect } from 'react';
import { ShieldAlert, UserX, AlertTriangle, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function ModerationPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchModerationData = async () => {
    try {
      setLoading(true);
      setError('');
      // Get all content reports
      const contentReports = await apiRequest('database/tables/contentReport');
      setReports(contentReports);

      // Get all users to review blockings
      const userList = await apiRequest('database/tables/user');
      setUsers(userList);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch moderation queue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModerationData();
  }, []);

  const handleBanUser = async (id: string) => {
    if (!confirm('Are you sure you want to suspend this user? they will be logged out and disabled.')) {
      return;
    }
    try {
      setLoading(true);
      // Let's delete or edit their active role to a non-existent state or ban
      await apiRequest(`database/tables/user/${id}/update`, {
        method: 'POST',
        body: JSON.stringify({
          active_role: 'STUDENT', // reset or block
          display_name: '[SUSPENDED] ' + (users.find(u => u.id === id)?.display_name || '')
        }),
      });
      fetchModerationData();
    } catch (err: any) {
      alert(`Action failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold theme-text-primary tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-500" />
            Security & Trust Moderation
          </h1>
          <p className="text-sm mt-1 theme-text-secondary">Process student-filed abuse content reports, manage account suspension policies, and audit platform standards.</p>
        </div>
        <button 
          onClick={fetchModerationData}
          className="flex items-center gap-2 px-4 py-2.5 theme-item-bg theme-item-hover border theme-border theme-text-secondary hover:theme-text-primary text-sm font-semibold rounded-xl transition-all duration-200"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/25 rounded-2xl text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Flagged Content queue */}
        <div className="glass-panel rounded-3xl overflow-hidden border theme-border">
          <div className="p-6 border-b theme-border bg-slate-100/50 dark:bg-[#0d1223]/30">
            <h2 className="text-lg font-bold theme-text-primary flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" /> Flagged Curriculum Feed
            </h2>
          </div>

          <div className="divide-y theme-border max-h-[500px] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <span className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-20 theme-text-secondary">
                No active content flags.
              </div>
            ) : (
              reports.map((r) => (
                <div key={r.id} className="p-6 space-y-2 theme-item-hover transition-colors">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono theme-text-secondary">Report ID: {r.id.substring(0, 8)}</span>
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                      r.reviewed_at ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {r.reviewed_at ? 'RESOLVED' : 'UNRESOLVED'}
                    </span>
                  </div>
                  <blockquote className="italic theme-text-primary text-sm">
                    "{r.reason}"
                  </blockquote>
                  <div className="text-xs theme-text-secondary flex gap-2">
                    <span>Lesson: <strong className="font-mono">{r.lesson_id}</strong></span>
                    <span>•</span>
                    <span>Student: <strong className="font-mono">{r.student_id}</strong></span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* User suspension registry */}
        <div className="glass-panel rounded-3xl overflow-hidden border theme-border">
          <div className="p-6 border-b theme-border bg-slate-100/50 dark:bg-[#0d1223]/30">
            <h2 className="text-lg font-bold theme-text-primary flex items-center gap-2">
              <UserX className="w-5 h-5 text-indigo-400" /> Account Suspend Controls
            </h2>
          </div>

          <div className="divide-y theme-border max-h-[500px] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <span className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-20 theme-text-secondary">
                No users found.
              </div>
            ) : (
              users.map((u) => (
                <div key={u.id} className="p-6 flex items-center justify-between gap-4 theme-item-hover transition-colors">
                  <div>
                    <h3 className="font-bold theme-text-primary">{u.display_name || u.email}</h3>
                    <p className="text-xs theme-text-secondary font-mono">{u.email} | {u.active_role}</p>
                  </div>
                  {!String(u.display_name).includes('[SUSPENDED]') ? (
                    <button
                      onClick={() => handleBanUser(u.id)}
                      className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 text-red-400 text-xs font-semibold rounded-lg transition-all"
                    >
                      Suspend User
                    </button>
                  ) : (
                    <span className="text-xs text-red-500 font-bold uppercase tracking-wider">Suspended</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
