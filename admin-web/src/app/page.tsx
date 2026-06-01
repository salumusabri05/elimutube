'use client';

import { useState, useEffect } from 'react';
import { Users, Video, CreditCard, Activity, ArrowUpRight, Award, Flame, AlertCircle } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function Dashboard() {
  const [statsData, setStatsData] = useState({
    teachers: '0',
    students: '0',
    lessons: '0',
    totalVolume: 'TSh 0',
  });
  const [verifications, setVerifications] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setError('');
      const [stats, teachers, payments] = await Promise.all([
        apiRequest('dashboard/stats'),
        apiRequest('users/teachers'),
        apiRequest('payments'),
      ]);

      setStatsData({
        teachers: stats.teachers.toLocaleString(),
        students: stats.students.toLocaleString(),
        lessons: stats.lessons.toLocaleString(),
        totalVolume: `TSh ${stats.totalVolume.toLocaleString()}`,
      });

      // Filter teachers to find pending ones
      const pending = teachers
        .filter((t: any) => t.teacher_profile?.verification_status === 'PENDING')
        .map((t: any) => ({
          id: t.id,
          name: t.display_name || t.email,
          subject: t.teacher_profile?.bio || 'Teacher Candidate',
          docs: t.teacher_verification_docs?.map((d: any) => d.doc_type).join(' & ') || 'Pending Docs',
          date: new Date(t.created_at).toLocaleDateString(),
        }));
      setVerifications(pending);

      setTransactions(payments);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch platform metrics from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerify = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await apiRequest(`users/teachers/${id}/verify`, {
        method: 'POST',
        body: JSON.stringify({ status }),
      });
      fetchData(); // Refresh data
    } catch (err: any) {
      alert(`Verification action failed: ${err.message}`);
    }
  };

  const stats = [
    { 
      title: 'Verified Teachers', 
      value: statsData.teachers, 
      change: 'Active on platform', 
      icon: Award, 
      color: 'text-violet-400', 
      glow: 'shadow-violet-500/10',
      chartPath: "M 0 20 Q 20 5 40 15 T 80 5 T 120 18 T 160 8"
    },
    { 
      title: 'Active Students', 
      value: statsData.students, 
      change: 'Subscribed & Free tier', 
      icon: Users, 
      color: 'text-blue-400', 
      glow: 'shadow-blue-500/10',
      chartPath: "M 0 18 Q 20 10 40 5 T 80 15 T 120 5 T 160 2"
    },
    { 
      title: 'Published Lessons', 
      value: statsData.lessons, 
      change: 'Video & PDF format', 
      icon: Video, 
      color: 'text-indigo-400', 
      glow: 'shadow-indigo-500/10',
      chartPath: "M 0 15 Q 20 18 40 10 T 80 20 T 120 12 T 160 5"
    },
    { 
      title: 'Platform Volume', 
      value: statsData.totalVolume, 
      change: 'Selcom processed amount', 
      icon: CreditCard, 
      color: 'text-emerald-400', 
      glow: 'shadow-emerald-500/10',
      chartPath: "M 0 20 Q 20 15 40 8 T 80 5 T 120 2 T 160 0"
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-[#0e122b] to-[#120f2b] p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-400">
            <Flame className="w-4 h-4 animate-bounce text-amber-500" />
            System Live Status
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            ElimuTube Control Hub
          </h1>
          <p className="text-slate-400 max-w-md text-sm leading-relaxed">
            Real-time control over verification flows, ledger entries, Agora classroom channels, and Content Service audits.
          </p>
        </div>
        <div className="relative z-10 flex gap-3">
          <div className="glass-panel px-4 py-3 rounded-2xl flex flex-col justify-center border-white/5">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Gateway Load</span>
            <span className="text-sm font-bold text-emerald-400 mt-0.5">Optimal (14ms)</span>
          </div>
          <div className="glass-panel px-4 py-3 rounded-2xl flex flex-col justify-center border-white/5">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Active Streams</span>
            <span className="text-sm font-bold text-indigo-400 mt-0.5">42 Agora Channels</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/25 rounded-2xl text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between shadow-lg relative overflow-hidden group">
            {/* Ambient background light */}
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/5 to-transparent rounded-bl-full pointer-events-none group-hover:from-indigo-500/10 transition-all duration-300`} />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-400">{stat.title}</span>
              <div className={`p-2.5 rounded-xl bg-white/5 ${stat.color} border border-white/5`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            
            <div className="mt-4 flex items-end justify-between">
              <div>
                <span className="text-3xl font-extrabold text-white tracking-tight">{stat.value}</span>
                <span className="block text-[11px] font-medium text-slate-500 mt-1">{stat.change}</span>
              </div>

              {/* Aesthetic Sparkline SVG */}
              <div className="w-24 h-12">
                <svg className="w-full h-full" viewBox="0 0 160 30" fill="none">
                  <path 
                    d={stat.chartPath}
                    stroke="url(#sparkline-grad)" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                  <defs>
                    <linearGradient id="sparkline-grad" x1="0" y1="0" x2="160" y2="0">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Verification Queue Panel */}
        <div className="glass-panel p-6 rounded-3xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Pending Verifications</h2>
              <p className="text-xs text-slate-500 mt-0.5">Verification requests from teacher candidates</p>
            </div>
            <button className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
              View Audit Queue <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-4 min-h-[250px]">
            {loading ? (
              <div className="h-full flex items-center justify-center py-12">
                <span className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : verifications.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-12 text-slate-500 text-sm">
                <Award className="w-8 h-8 mb-2 opacity-50" />
                No pending verification requests.
              </div>
            ) : (
              verifications.map((req, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-200">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#1b1e35] to-[#252a4e] flex items-center justify-center font-bold text-indigo-400 border border-indigo-500/10">
                      {req.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="max-w-[200px] md:max-w-xs">
                      <p className="text-sm font-semibold text-slate-200 truncate">{req.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{req.subject}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-[10px] text-slate-500 font-medium">{req.date}</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleVerify(req.id, 'APPROVED')}
                        className="px-2.5 py-1 text-[11px] font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 shadow-md shadow-indigo-600/10 transition-colors"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleVerify(req.id, 'REJECTED')}
                        className="px-2.5 py-1 text-[11px] font-semibold text-slate-300 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Real-time Ledger / Transaction Feed */}
        <div className="glass-panel p-6 rounded-3xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Payment Ledger Feed</h2>
              <p className="text-xs text-slate-500 mt-0.5">Selcom STK pushes and ledger state updates</p>
            </div>
            <button className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
              Open Ledger <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-4 min-h-[250px]">
            {loading ? (
              <div className="h-full flex items-center justify-center py-12">
                <span className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : transactions.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-12 text-slate-500 text-sm">
                <CreditCard className="w-8 h-8 mb-2 opacity-50" />
                No transactions found.
              </div>
            ) : (
              transactions.map((tx, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-200">
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-200">{tx.user}</span>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">{tx.id}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{tx.plan} via {tx.method}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-sm font-bold text-slate-200">{tx.amount}</span>
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full border ${
                      tx.status === 'SUCCESS' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 badge-glow-green' 
                        : 'bg-red-500/10 text-red-400 border-red-500/20 badge-glow-red'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
