'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Search, AlertCircle, RefreshCw, CheckCircle, XCircle, Clock, Pause } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchSubs = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiRequest('subscriptions');
      setSubs(data);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch subscriptions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubs(); }, []);

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this subscription?')) return;
    try {
      await apiRequest(`subscriptions/${id}/cancel`, { method: 'POST' });
      fetchSubs();
    } catch (err: any) {
      alert(`Cancel failed: ${err.message}`);
    }
  };

  const filtered = subs.filter(s => {
    const matchesSearch = s.student_name.toLowerCase().includes(searchText.toLowerCase()) || s.teacher_name.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    active: subs.filter(s => s.status === 'ACTIVE').length,
    cancelled: subs.filter(s => s.status === 'CANCELLED').length,
    expired: subs.filter(s => s.status === 'EXPIRED').length,
    paused: subs.filter(s => s.status === 'PAUSED').length,
  };

  const totalMRR = subs.filter(s => s.status === 'ACTIVE').reduce((sum, s) => sum + s.price_tsh, 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold theme-text-primary tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-indigo-500" />
            Subscription Management
          </h1>
          <p className="text-sm mt-1 theme-text-secondary">Overview of all student-teacher subscriptions, billing periods, and status management.</p>
        </div>
        <button onClick={fetchSubs} className="flex items-center gap-2 px-4 py-2.5 theme-item-bg theme-item-hover border theme-border theme-text-secondary hover:theme-text-primary text-sm font-semibold rounded-xl transition-all duration-200">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Active', value: statusCounts.active, color: 'text-emerald-400', icon: CheckCircle },
          { label: 'Cancelled', value: statusCounts.cancelled, color: 'text-red-400', icon: XCircle },
          { label: 'Expired', value: statusCounts.expired, color: 'text-yellow-400', icon: Clock },
          { label: 'Paused', value: statusCounts.paused, color: 'text-blue-400', icon: Pause },
          { label: 'Monthly MRR', value: `TSh ${totalMRR.toLocaleString()}`, color: 'text-indigo-400', icon: CreditCard },
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

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/25 rounded-2xl text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" /><span>{error}</span>
        </div>
      )}

      {/* Subscriptions Table */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-xl theme-border border">
        <div className="p-6 border-b theme-border bg-slate-100/50 dark:bg-[#0d1223]/30 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          <h2 className="text-lg font-bold theme-text-primary">Subscription Ledger</h2>
          <div className="flex gap-2">
            <div className="relative">
              <input type="text" placeholder="Search student or teacher..." value={searchText} onChange={(e) => setSearchText(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary placeholder-slate-500 w-64" />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#090b16] border theme-border text-sm theme-text-secondary focus:outline-none">
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Expired">Expired</option>
              <option value="Paused">Paused</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <span className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 theme-text-secondary">No subscriptions found.</div>
          ) : (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b theme-border bg-slate-100/20 dark:bg-[#090b16]/30 theme-text-secondary text-xs font-bold uppercase tracking-wider">
                  <th className="px-5 py-4">Student</th>
                  <th className="px-5 py-4">Teacher</th>
                  <th className="px-5 py-4">Plan</th>
                  <th className="px-5 py-4">Price</th>
                  <th className="px-5 py-4">Method</th>
                  <th className="px-5 py-4">Period</th>
                  <th className="px-5 py-4">Renew</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y theme-border text-sm">
                {filtered.map((s) => (
                  <tr key={s.id} className="theme-item-hover transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap font-semibold theme-text-primary">{s.student_name}</td>
                    <td className="px-5 py-4 whitespace-nowrap theme-text-secondary">{s.teacher_name}</td>
                    <td className="px-5 py-4 max-w-[150px] truncate theme-text-secondary text-xs">{s.plan_description}</td>
                    <td className="px-5 py-4 whitespace-nowrap font-bold text-emerald-400">TSh {s.price_tsh.toLocaleString()}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-xs theme-text-secondary">{s.payment_method}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-xs theme-text-secondary">
                      {new Date(s.period_start).toLocaleDateString()} — {new Date(s.period_end).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`text-xs font-bold ${s.auto_renew ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {s.auto_renew ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                        s.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        s.status === 'CANCELLED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        s.status === 'EXPIRED' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>{s.status}</span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      {s.status === 'ACTIVE' && (
                        <button onClick={() => handleCancel(s.id)}
                          className="px-3 py-1.5 text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all">
                          Cancel
                        </button>
                      )}
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
