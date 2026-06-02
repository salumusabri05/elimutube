'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, AlertCircle, RefreshCw, DollarSign, Users, CreditCard, ArrowUpRight } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await apiRequest('revenue/analytics');
      setData(result);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch revenue analytics.');
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
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/25 rounded-2xl text-red-400">
          <AlertCircle className="w-5 h-5" /><span>{error}</span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const maxRevenue = Math.max(...(data.monthlyRevenue?.map((m: any) => m.revenue) || [1]));

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold theme-text-primary tracking-tight flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-indigo-500" />
            Revenue Analytics
          </h1>
          <p className="text-sm mt-1 theme-text-secondary">Financial performance, growth metrics, and platform revenue breakdown.</p>
        </div>
        <button onClick={fetchAnalytics} className="flex items-center gap-2 px-4 py-2.5 theme-item-bg theme-item-hover border theme-border theme-text-secondary hover:theme-text-primary text-sm font-semibold rounded-xl transition-all duration-200">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Top-level KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `TSh ${(data.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'text-emerald-400', bg: 'from-emerald-500/10' },
          { label: 'Platform Share (30%)', value: `TSh ${(data.platformShare || 0).toLocaleString()}`, icon: CreditCard, color: 'text-indigo-400', bg: 'from-indigo-500/10' },
          { label: 'Teacher Payouts (70%)', value: `TSh ${(data.teacherShare || 0).toLocaleString()}`, icon: Users, color: 'text-violet-400', bg: 'from-violet-500/10' },
          { label: 'Total Transactions', value: (data.totalPayments || 0).toLocaleString(), icon: ArrowUpRight, color: 'text-blue-400', bg: 'from-blue-500/10' },
        ].map((stat, i) => (
          <div key={i} className={`glass-panel p-6 rounded-2xl border theme-border relative overflow-hidden`}>
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${stat.bg} to-transparent rounded-bl-full pointer-events-none`} />
            <div className="flex items-center gap-2 mb-3">
              <div className={`p-2 rounded-lg theme-item-bg border theme-border ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold theme-text-secondary">{stat.label}</span>
            </div>
            <span className="text-2xl font-extrabold theme-text-primary">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Monthly Revenue Chart (Bar chart using divs) */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border theme-border">
          <h2 className="text-lg font-bold theme-text-primary mb-6">Monthly Revenue Trend</h2>
          {data.monthlyRevenue && data.monthlyRevenue.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-end gap-2 h-48">
                {data.monthlyRevenue.map((m: any, i: number) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-[9px] font-bold theme-text-secondary">
                      TSh {(m.revenue / 1000).toFixed(0)}k
                    </span>
                    <div className="w-full bg-gradient-to-t from-indigo-600 to-violet-500 rounded-t-lg transition-all duration-500 hover:from-indigo-500 hover:to-violet-400"
                      style={{ height: `${Math.max((m.revenue / maxRevenue) * 100, 5)}%`, minHeight: '8px' }}
                    />
                    <span className="text-[9px] font-mono theme-text-secondary">{m.month.substring(5)}</span>
                  </div>
                ))}
              </div>
              {/* Revenue table */}
              <div className="border-t theme-border pt-4">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="theme-text-secondary font-bold uppercase tracking-wider">
                      <th className="text-left py-2">Month</th>
                      <th className="text-right py-2">Revenue</th>
                      <th className="text-right py-2">Txns</th>
                      <th className="text-right py-2">Platform</th>
                      <th className="text-right py-2">Teachers</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y theme-border">
                    {data.monthlyRevenue.map((m: any, i: number) => (
                      <tr key={i}>
                        <td className="py-2 font-mono theme-text-primary">{m.month}</td>
                        <td className="py-2 text-right font-bold text-emerald-400">TSh {m.revenue.toLocaleString()}</td>
                        <td className="py-2 text-right theme-text-secondary">{m.transactions}</td>
                        <td className="py-2 text-right text-indigo-400">TSh {m.platformShare.toLocaleString()}</td>
                        <td className="py-2 text-right text-violet-400">TSh {m.teacherShare.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 theme-text-secondary">No revenue data yet.</div>
          )}
        </div>

        {/* Right Sidebar: Subs + Top Spenders */}
        <div className="space-y-6">
          {/* Subscription Breakdown */}
          <div className="glass-panel rounded-3xl p-6 border theme-border">
            <h3 className="text-sm font-bold theme-text-primary mb-4">Subscription Breakdown</h3>
            <div className="space-y-3">
              {[
                { label: 'Active', value: data.subscriptions?.active || 0, color: 'bg-emerald-500', textColor: 'text-emerald-400' },
                { label: 'Cancelled', value: data.subscriptions?.cancelled || 0, color: 'bg-red-500', textColor: 'text-red-400' },
                { label: 'Expired', value: data.subscriptions?.expired || 0, color: 'bg-yellow-500', textColor: 'text-yellow-400' },
              ].map((item, i) => {
                const total = (data.subscriptions?.active || 0) + (data.subscriptions?.cancelled || 0) + (data.subscriptions?.expired || 0);
                const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
                return (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="theme-text-secondary">{item.label}</span>
                      <span className={`font-bold ${item.textColor}`}>{item.value} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Spenders */}
          <div className="glass-panel rounded-3xl p-6 border theme-border">
            <h3 className="text-sm font-bold theme-text-primary mb-4">Top Spending Students</h3>
            <div className="space-y-3">
              {(data.topStudents || []).map((s: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white text-[10px] font-bold">
                      {i + 1}
                    </span>
                    <span className="text-xs font-semibold theme-text-primary truncate max-w-[120px]">{s.name}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">TSh {s.total.toLocaleString()}</span>
                </div>
              ))}
              {(!data.topStudents || data.topStudents.length === 0) && (
                <div className="text-center text-xs theme-text-secondary py-4">No spending data yet.</div>
              )}
            </div>
          </div>

          {/* User Growth */}
          <div className="glass-panel rounded-3xl p-6 border theme-border">
            <h3 className="text-sm font-bold theme-text-primary mb-4">User Growth by Month</h3>
            <div className="space-y-2">
              {(data.userGrowth || []).map((g: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b theme-border last:border-0">
                  <span className="font-mono theme-text-secondary">{g.month}</span>
                  <div className="flex gap-4">
                    <span className="text-blue-400 font-bold">{g.students} students</span>
                    <span className="text-violet-400 font-bold">{g.teachers} teachers</span>
                  </div>
                </div>
              ))}
              {(!data.userGrowth || data.userGrowth.length === 0) && (
                <div className="text-center text-xs theme-text-secondary py-4">No growth data yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
