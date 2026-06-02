'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Eye, Trash2, ShieldCheck, Flag, AlertCircle } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function ContentPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiRequest('lessons/reports');
      setReports(data);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch content reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleResolve = async (id: string, action: 'DISMISS' | 'TAKEDOWN') => {
    try {
      await apiRequest(`lessons/reports/${id}/resolve`, {
        method: 'POST',
        body: JSON.stringify({ action }),
      });
      fetchReports();
    } catch (err: any) {
      alert(`Action failed: ${err.message}`);
    }
  };

  const filteredReports = reports.filter((r) => {
    if (r.reviewed_at) return false; // Hide resolved reports
    
    // Severity logic: if the reason is long, call it HIGH, else LOW (for simple classification)
    const severity = r.reason.length > 30 ? 'HIGH' : 'LOW';
    return severityFilter === 'All' || severity === severityFilter.toUpperCase();
  });

  const highSeverityCount = reports.filter(r => !r.reviewed_at && r.reason.length > 30).length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold theme-text-primary tracking-tight">Content Moderation & Reports</h1>
          <p className="text-sm mt-1 theme-text-secondary">Review flagged lessons, audit AI-generated summaries, and manage curriculum compliance.</p>
        </div>
        <div className="flex gap-2">
          <div className="glass-panel px-4 py-2 rounded-xl text-xs font-semibold theme-border border theme-text-secondary flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full badge-glow-red animate-pulse" />
            {highSeverityCount} High Severity Reports
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/25 rounded-2xl text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Flagged Feed List */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-xl theme-border border">
        <div className="p-6 border-b theme-border bg-slate-100/50 dark:bg-[#0d1223]/30 flex items-center justify-between">
          <h2 className="text-lg font-bold theme-text-primary flex items-center gap-2">
            <Flag className="w-5 h-5 text-red-400" />
            Active Reports Queue
          </h2>
          <div className="flex gap-2">
            <select 
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#090b16] border theme-border text-sm theme-text-secondary focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Severities</option>
              <option value="High">High</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div className="divide-y theme-border min-h-[200px]">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <span className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-20 theme-text-secondary">
              No reports in moderation queue.
            </div>
          ) : (
            filteredReports.map((report) => {
              const severity = report.reason.length > 30 ? 'HIGH' : 'LOW';
              return (
                <div key={report.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 theme-item-hover transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-red-500/10 border border-red-500/25 text-red-400 rounded-2xl flex-shrink-0">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-bold theme-text-primary text-base">{report.lesson?.title || 'Unknown Lesson'}</h3>
                        <span className="text-[10px] font-mono theme-text-secondary bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">{report.id.substring(0, 8)}</span>
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full border ${
                          severity === 'HIGH' 
                            ? 'bg-red-500/10 text-red-400 border-red-500/20 badge-glow-red' 
                            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 badge-glow-yellow'
                        }`}>
                          {severity}
                        </span>
                      </div>
                      
                      <div className="theme-text-secondary text-sm max-w-2xl leading-relaxed">
                        "{report.reason}"
                      </div>

                      <div className="flex items-center gap-4 text-xs theme-text-secondary mt-2 flex-wrap">
                        <span>Teacher: <strong className="theme-text-primary">{report.lesson?.teacher?.display_name || report.lesson?.teacher?.email || 'Unknown'}</strong></span>
                        <span className="opacity-40">•</span>
                        <span>Flagged by: <strong className="theme-text-primary">{report.student?.display_name || report.student?.email || 'Student'}</strong></span>
                        <span className="opacity-40">•</span>
                        <span>{new Date(report.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 self-end md:self-center">
                    <button 
                      onClick={() => alert(`Opening stream asset ID: ${report.lesson?.mux_asset_id || 'N/A'}`)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold theme-text-secondary hover:theme-text-primary theme-item-bg theme-item-hover border theme-border rounded-xl transition-all duration-200"
                    >
                      <Eye className="w-4 h-4" /> Review Video
                    </button>
                    <button 
                      onClick={() => handleResolve(report.id, 'DISMISS')}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-emerald-400 hover:text-white bg-emerald-500/10 hover:bg-emerald-600 border border-emerald-500/20 hover:border-emerald-600 rounded-xl transition-all duration-200"
                    >
                      <ShieldCheck className="w-4 h-4" /> Dismiss Report
                    </button>
                    <button 
                      onClick={() => handleResolve(report.id, 'TAKEDOWN')}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-red-400 hover:text-white bg-red-500/10 hover:bg-red-600 border border-red-500/20 hover:border-red-600 rounded-xl transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" /> Take Down
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
