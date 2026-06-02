'use client';

import { useState, useEffect } from 'react';
import { Brain, AlertCircle, RefreshCw, Edit2, Trash2, Save, X, BookOpen } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function AiSummariesPage() {
  const [summaries, setSummaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editEn, setEditEn] = useState('');
  const [editSw, setEditSw] = useState('');
  const [searchText, setSearchText] = useState('');

  const fetchSummaries = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiRequest('ai-summaries');
      setSummaries(data);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch AI summaries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSummaries(); }, []);

  const handleEdit = (s: any) => {
    setEditingId(s.id);
    setEditEn(s.summary_en || '');
    setEditSw(s.summary_sw || '');
  };

  const handleSave = async () => {
    if (!editingId) return;
    try {
      await apiRequest(`ai-summaries/${editingId}/update`, {
        method: 'POST',
        body: JSON.stringify({ summary_en: editEn, summary_sw: editSw }),
      });
      setEditingId(null);
      fetchSummaries();
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this AI summary?')) return;
    try {
      await apiRequest(`ai-summaries/${id}/delete`, { method: 'POST' });
      fetchSummaries();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const filtered = summaries.filter(s =>
    s.lesson_title.toLowerCase().includes(searchText.toLowerCase()) ||
    s.teacher_name.toLowerCase().includes(searchText.toLowerCase()) ||
    (s.summary_en || '').toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold theme-text-primary tracking-tight flex items-center gap-2">
            <Brain className="w-6 h-6 text-indigo-500" />
            AI Summary Review
          </h1>
          <p className="text-sm mt-1 theme-text-secondary">Audit, edit, and manage AI-generated lesson summaries for quality control.</p>
        </div>
        <button onClick={fetchSummaries} className="flex items-center gap-2 px-4 py-2.5 theme-item-bg theme-item-hover border theme-border theme-text-secondary hover:theme-text-primary text-sm font-semibold rounded-xl transition-all duration-200">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border theme-border">
          <span className="text-xs font-semibold theme-text-secondary">Total Summaries</span>
          <div className="text-2xl font-extrabold text-indigo-400 mt-1">{summaries.length}</div>
        </div>
        <div className="glass-panel p-5 rounded-2xl border theme-border">
          <span className="text-xs font-semibold theme-text-secondary">With English</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">{summaries.filter(s => s.summary_en).length}</div>
        </div>
        <div className="glass-panel p-5 rounded-2xl border theme-border">
          <span className="text-xs font-semibold theme-text-secondary">With Swahili</span>
          <div className="text-2xl font-extrabold text-violet-400 mt-1">{summaries.filter(s => s.summary_sw).length}</div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/25 rounded-2xl text-red-400">
          <AlertCircle className="w-5 h-5" /><span>{error}</span>
        </div>
      )}

      {/* Search */}
      <input type="text" placeholder="Search summaries..." value={searchText} onChange={(e) => setSearchText(e.target.value)}
        className="px-4 py-2.5 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary placeholder-slate-500 w-80" />

      {/* Summary Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 theme-text-secondary glass-panel rounded-3xl border theme-border">No AI summaries found.</div>
        ) : filtered.map((s) => (
          <div key={s.id} className="glass-panel rounded-2xl border theme-border p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold theme-text-primary">{s.lesson_title}</h3>
                  <div className="text-xs theme-text-secondary mt-0.5">
                    by {s.teacher_name} • {s.subject} • {s.form_level.replace('_', ' ')} • Generated {new Date(s.generated_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex gap-1.5">
                {editingId !== s.id && (
                  <button onClick={() => handleEdit(s)} className="p-2 rounded-lg text-indigo-400 hover:bg-indigo-500/10 transition-all">
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => handleDelete(s.id)} className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {editingId === s.id ? (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold theme-text-secondary">English Summary</label>
                  <textarea value={editEn} onChange={(e) => setEditEn(e.target.value)}
                    className="w-full h-28 px-4 py-2.5 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary resize-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold theme-text-secondary">Swahili Summary (Muhtasari)</label>
                  <textarea value={editSw} onChange={(e) => setEditSw(e.target.value)}
                    className="w-full h-28 px-4 py-2.5 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary resize-none" />
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setEditingId(null)} className="px-3 py-1.5 text-xs font-semibold theme-text-secondary theme-item-bg border theme-border rounded-lg">
                    <X className="w-3.5 h-3.5 inline mr-1" />Cancel
                  </button>
                  <button onClick={handleSave} className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg">
                    <Save className="w-3.5 h-3.5 inline mr-1" />Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">English</span>
                  <p className="text-sm theme-text-primary leading-relaxed">{s.summary_en || <span className="theme-text-secondary italic">No English summary</span>}</p>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400">Kiswahili</span>
                  <p className="text-sm theme-text-primary leading-relaxed">{s.summary_sw || <span className="theme-text-secondary italic">Hakuna muhtasari</span>}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
