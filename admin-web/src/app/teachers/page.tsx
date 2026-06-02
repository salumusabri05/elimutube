'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Eye, ShieldAlert, AlertCircle } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterText, setFilterText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiRequest('users/teachers');
      setTeachers(data);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch teachers queue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleVerify = async (id: string, status: 'APPROVED' | 'REJECTED' | 'PENDING') => {
    try {
      await apiRequest(`users/teachers/${id}/verify`, {
        method: 'POST',
        body: JSON.stringify({ status }),
      });
      fetchTeachers();
    } catch (err: any) {
      alert(`Action failed: ${err.message}`);
    }
  };

  const filteredTeachers = teachers.filter((t) => {
    const name = (t.display_name || '').toLowerCase();
    const email = (t.email || '').toLowerCase();
    const matchesText = name.includes(filterText.toLowerCase()) || email.includes(filterText.toLowerCase());
    
    const status = t.teacher_profile?.verification_status || 'PENDING';
    const matchesStatus = statusFilter === 'All' || status === statusFilter.toUpperCase();

    return matchesText && matchesStatus;
  });

  const pendingCount = teachers.filter(t => (t.teacher_profile?.verification_status || 'PENDING') === 'PENDING').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold theme-text-primary tracking-tight">Teacher Control Panel</h1>
          <p className="text-sm mt-1 theme-text-secondary">Audit verification documents, manage teacher profiles, and handle subject assignments.</p>
        </div>
        <div className="flex gap-3">
          <div className="glass-panel px-4 py-2 rounded-xl text-xs font-semibold theme-border border theme-text-secondary flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full badge-glow-yellow animate-pulse" />
            {pendingCount} Pending Verifications
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/25 rounded-2xl text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Table Card */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-xl theme-border border">
        <div className="p-6 border-b theme-border flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-slate-100/50 dark:bg-[#0d1223]/30">
          <h2 className="text-lg font-bold theme-text-primary">Teacher Registration Queue</h2>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Filter by name or email..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="px-4 py-2 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary placeholder-slate-500 w-64"
            />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#090b16] border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-secondary"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <span className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredTeachers.length === 0 ? (
            <div className="text-center py-20 theme-text-secondary">
              No teachers match the criteria.
            </div>
          ) : (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b theme-border bg-slate-100/20 dark:bg-[#090b16]/30 theme-text-secondary text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Mwalimu (Teacher)</th>
                  <th className="px-6 py-4">Bio / Specialization</th>
                  <th className="px-6 py-4">Verification Documents</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y theme-border text-sm">
                {filteredTeachers.map((t) => {
                  const status = t.teacher_profile?.verification_status || 'PENDING';
                  return (
                    <tr key={t.id} className="theme-item-hover transition-colors">
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1b1e35] to-[#252a4e] flex items-center justify-center font-bold text-indigo-400 border border-indigo-500/10">
                            {t.display_name?.charAt(0) || t.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold theme-text-primary">{t.display_name || 'Teacher Candidate'}</div>
                            <div className="text-xs theme-text-secondary font-mono mt-0.5">{t.id.substring(0, 8)} • {t.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 max-w-xs">
                        <div className="theme-text-primary line-clamp-2">{t.teacher_profile?.bio || 'No bio configured yet.'}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-1.5">
                          {t.teacher_verification_docs && t.teacher_verification_docs.length > 0 ? (
                            t.teacher_verification_docs.map((doc: any, idx: number) => (
                              <a 
                                key={idx} 
                                href={doc.document_url} 
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 text-xs theme-text-secondary hover:text-indigo-400 transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span className="underline decoration-slate-600 underline-offset-2">
                                  {doc.doc_type || 'Document'} ({idx + 1})
                                </span>
                              </a>
                            ))
                          ) : (
                            <span className="text-xs theme-text-secondary opacity-60">No documents uploaded.</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 badge-glow-green' :
                          status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 badge-glow-yellow' :
                          'bg-red-500/10 text-red-400 border-red-500/20 badge-glow-red'
                        }`}>
                          {status === 'APPROVED' && <CheckCircle className="w-3.5 h-3.5" />}
                          {status === 'PENDING' && <Clock className="w-3.5 h-3.5" />}
                          {status === 'REJECTED' && <XCircle className="w-3.5 h-3.5" />}
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right text-xs font-semibold space-x-2">
                        {status === 'PENDING' && (
                          <>
                            <button 
                              onClick={() => handleVerify(t.id, 'APPROVED')}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/10 transition-colors"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleVerify(t.id, 'REJECTED')}
                              className="px-3 py-1.5 rounded-xl bg-red-600/25 hover:bg-red-600 border border-red-500/25 text-red-400 hover:text-white transition-all duration-200"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {status !== 'PENDING' && (
                          <button 
                            onClick={() => handleVerify(t.id, 'PENDING')}
                            className="px-3 py-1.5 rounded-xl theme-item-bg border theme-border theme-item-hover theme-text-secondary hover:theme-text-primary transition-colors"
                          >
                            Reset Status
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
