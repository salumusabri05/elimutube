'use client';

import { useState, useEffect } from 'react';
import { Subtitles, AlertCircle, RefreshCw, Trash2, Plus, X, ExternalLink } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function CaptionsPage() {
  const [captions, setCaptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lessonId, setLessonId] = useState('');
  const [language, setLanguage] = useState('en');
  const [vttUrl, setVttUrl] = useState('');
  const [source, setSource] = useState('AI');

  const fetchCaptions = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiRequest('captions');
      setCaptions(data);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch captions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCaptions(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonId || !vttUrl) { alert('Please fill all fields.'); return; }
    try {
      await apiRequest('captions/create', {
        method: 'POST',
        body: JSON.stringify({ lesson_id: lessonId, language, vtt_url: vttUrl, source }),
      });
      setIsModalOpen(false);
      setLessonId(''); setVttUrl('');
      fetchCaptions();
    } catch (err: any) {
      alert(`Create failed: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this caption track?')) return;
    try {
      await apiRequest(`captions/${id}/delete`, { method: 'POST' });
      fetchCaptions();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const filtered = captions.filter(c =>
    c.lesson_title.toLowerCase().includes(searchText.toLowerCase()) ||
    c.teacher_name.toLowerCase().includes(searchText.toLowerCase()) ||
    c.language.toLowerCase().includes(searchText.toLowerCase())
  );

  const enCount = captions.filter(c => c.language === 'en').length;
  const swCount = captions.filter(c => c.language === 'sw').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold theme-text-primary tracking-tight flex items-center gap-2">
            <Subtitles className="w-6 h-6 text-indigo-500" />
            Caption Management
          </h1>
          <p className="text-sm mt-1 theme-text-secondary">Manage VTT subtitle tracks for accessibility compliance across all lessons.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchCaptions} className="flex items-center gap-2 px-4 py-2.5 theme-item-bg theme-item-hover border theme-border theme-text-secondary hover:theme-text-primary text-sm font-semibold rounded-xl transition-all duration-200">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/10 transition-colors">
            <Plus className="w-4 h-4" /> Add Caption
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Tracks', value: captions.length, color: 'text-indigo-400' },
          { label: 'English (en)', value: enCount, color: 'text-blue-400' },
          { label: 'Swahili (sw)', value: swCount, color: 'text-violet-400' },
          { label: 'AI Generated', value: captions.filter(c => c.source === 'AI').length, color: 'text-emerald-400' },
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-5 rounded-2xl border theme-border">
            <span className="text-xs font-semibold theme-text-secondary">{stat.label}</span>
            <div className={`text-2xl font-extrabold ${stat.color} mt-1`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/25 rounded-2xl text-red-400">
          <AlertCircle className="w-5 h-5" /><span>{error}</span>
        </div>
      )}

      {/* Caption Table */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-xl theme-border border">
        <div className="p-6 border-b theme-border bg-slate-100/50 dark:bg-[#0d1223]/30 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          <h2 className="text-lg font-bold theme-text-primary">Caption Track Registry</h2>
          <input type="text" placeholder="Search captions..." value={searchText} onChange={(e) => setSearchText(e.target.value)}
            className="px-4 py-2 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary placeholder-slate-500 w-64" />
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <span className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 theme-text-secondary">No caption tracks found.</div>
          ) : (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b theme-border bg-slate-100/20 dark:bg-[#090b16]/30 theme-text-secondary text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Lesson</th>
                  <th className="px-6 py-4">Teacher</th>
                  <th className="px-6 py-4">Language</th>
                  <th className="px-6 py-4">Source</th>
                  <th className="px-6 py-4">VTT File</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y theme-border text-sm">
                {filtered.map((c) => (
                  <tr key={c.id} className="theme-item-hover transition-colors">
                    <td className="px-6 py-5">
                      <div className="font-semibold theme-text-primary truncate max-w-[200px]">{c.lesson_title}</div>
                    </td>
                    <td className="px-6 py-5 theme-text-secondary text-xs">{c.teacher_name}</td>
                    <td className="px-6 py-5">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                        c.language === 'en' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-violet-500/10 text-violet-400 border-violet-500/20'
                      }`}>{c.language === 'en' ? 'English' : 'Kiswahili'}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                        c.source === 'AI' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                      }`}>{c.source}</span>
                    </td>
                    <td className="px-6 py-5">
                      <a href={c.vtt_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                        <ExternalLink className="w-3.5 h-3.5" /> Open VTT
                      </a>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button onClick={() => handleDelete(c.id)}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Caption Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-3xl overflow-hidden border theme-border shadow-2xl">
            <div className="p-6 border-b theme-border flex justify-between items-center bg-slate-100/50 dark:bg-[#0d1223]/30">
              <h3 className="text-lg font-bold theme-text-primary flex items-center gap-2">
                <Subtitles className="w-5 h-5 text-indigo-400" /> Add Caption Track
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-300 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold theme-text-secondary">Lesson ID</label>
                <input type="text" value={lessonId} onChange={(e) => setLessonId(e.target.value)} placeholder="Paste lesson UUID"
                  className="w-full px-4 py-2.5 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary font-mono" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold theme-text-secondary">Language</label>
                  <select value={language} onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#090b16] border theme-border text-sm theme-text-secondary">
                    <option value="en">English</option>
                    <option value="sw">Kiswahili</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold theme-text-secondary">Source</label>
                  <select value={source} onChange={(e) => setSource(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#090b16] border theme-border text-sm theme-text-secondary">
                    <option value="AI">AI Generated</option>
                    <option value="MUX">Mux Auto</option>
                    <option value="MANUAL">Manual Upload</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold theme-text-secondary">VTT File URL</label>
                <input type="url" value={vttUrl} onChange={(e) => setVttUrl(e.target.value)} placeholder="https://cdn.example.com/captions.vtt"
                  className="w-full px-4 py-2.5 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 theme-item-bg border theme-border theme-text-secondary font-semibold rounded-xl text-sm">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-indigo-600/10">Add Track</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
