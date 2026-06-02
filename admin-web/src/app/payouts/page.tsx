'use client';

import { useState, useEffect } from 'react';
import { Download, Search, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function PayoutsPage() {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchPayouts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiRequest('payouts');
      setPayouts(data);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch payouts feed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  const handleProcessAll = async () => {
    try {
      await apiRequest('payouts/process-all', { method: 'POST' });
      alert('All pending payouts successfully moved to SETTLED status!');
      fetchPayouts();
    } catch (err: any) {
      alert(`Failed to process payouts: ${err.message}`);
    }
  };

  const filteredPayouts = payouts.filter((p) => {
    const teacher = (p.teacher || '').toLowerCase();
    const matchesSearch = teacher.includes(searchText.toLowerCase());

    const matchesStatus = statusFilter === 'All' || p.status === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold theme-text-primary tracking-tight">Teacher Payout Management</h1>
          <p className="text-sm mt-1 theme-text-secondary">Audit billing settlements, process Selcom Aggregator payouts, and balance platform ledger splits.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => alert('CSV Export is not configured for local dev environment.')}
            className="flex items-center gap-2 px-4 py-2.5 theme-item-bg theme-item-hover border theme-border theme-text-secondary hover:theme-text-primary text-sm font-semibold rounded-xl transition-all duration-200"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button 
            onClick={handleProcessAll}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/10 transition-colors"
          >
            Process All Pending
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/25 rounded-2xl text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Ledger Table */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-xl theme-border border">
        <div className="p-6 border-b theme-border bg-slate-100/50 dark:bg-[#0d1223]/30 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          <h2 className="text-lg font-bold theme-text-primary">Monthly Settled Receipts</h2>
          <div className="flex gap-2">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search teacher name..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary placeholder-slate-500 w-64"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#090b16] border theme-border text-sm theme-text-secondary focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Statuses</option>
              <option value="Settled">Settled</option>
              <option value="Processing">Processing</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <span className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredPayouts.length === 0 ? (
            <div className="text-center py-20 theme-text-secondary">
              No payout entries found.
            </div>
          ) : (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b theme-border bg-slate-100/20 dark:bg-[#090b16]/30 theme-text-secondary text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Ref ID</th>
                  <th className="px-6 py-4">Mwalimu (Teacher)</th>
                  <th className="px-6 py-4">Period</th>
                  <th className="px-6 py-4">Gross Revenue</th>
                  <th className="px-6 py-4">Platform Share (30%)</th>
                  <th className="px-6 py-4">Net Payout (70%)</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y theme-border text-sm">
                {filteredPayouts.map((p) => (
                  <tr key={p.id} className="theme-item-hover transition-colors">
                    <td className="px-6 py-5 whitespace-nowrap text-xs font-mono theme-text-secondary">{p.id.substring(0, 8)}</td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="font-semibold theme-text-primary">{p.teacher}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap theme-text-secondary">{p.period}</td>
                    <td className="px-6 py-5 whitespace-nowrap font-medium theme-text-primary">{p.gross}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-red-400 font-medium">-{p.fee}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-emerald-400 font-bold">{p.net}</td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        p.status === 'SETTLED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 badge-glow-green' :
                        p.status === 'PROCESSING' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 badge-glow-blue' :
                        'bg-red-500/10 text-red-400 border-red-500/20 badge-glow-red'
                      }`}>
                        {p.status === 'SETTLED' && <CheckCircle className="w-3.5 h-3.5" />}
                        {p.status === 'PROCESSING' && <Clock className="w-3.5 h-3.5" />}
                        {p.status === 'FAILED' && <AlertCircle className="w-3.5 h-3.5" />}
                        {p.status}
                      </span>
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
