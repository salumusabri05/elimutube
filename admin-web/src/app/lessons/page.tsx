'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Search, AlertCircle, RefreshCw, Eye, EyeOff, Star, MessageSquare, Brain, Subtitles, Video, FileText } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function LessonsPage() {
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchLessons = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiRequest('admin/lessons');
      setLessons(data);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch lessons.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLessons(); }, []);

  const handleTogglePublish = async (id: string, isPublished: boolean) => {
    try {
      await apiRequest(`admin/lessons/${id}/${isPublished ? 'unpublish' : 'publish'}`, { method: 'POST' });
      fetchLessons();
    } catch (err: any) {
      alert(`Action failed: ${err.message}`);
    }
  };

  const subjects = [...new Set(lessons.map(l => l.subject))];

  const filtered = lessons.filter(l => {
    const matchesSearch = l.title.toLowerCase().includes(searchText.toLowerCase()) || l.teacher_name.toLowerCase().includes(searchText.toLowerCase());
    const matchesSubject = subjectFilter === 'All' || l.subject === subjectFilter;
    const matchesStatus = statusFilter === 'All' || (statusFilter === 'Published' && l.published_at) || (statusFilter === 'Draft' && !l.published_at);
    return matchesSearch && matchesSubject && matchesStatus;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold theme-text-primary tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-500" />
            Lesson Library
          </h1>
          <p className="text-sm mt-1 theme-text-secondary">Browse all lessons, manage publishing status, and review engagement metrics.</p>
        </div>
        <button onClick={fetchLessons} className="flex items-center gap-2 px-4 py-2.5 theme-item-bg theme-item-hover border theme-border theme-text-secondary hover:theme-text-primary text-sm font-semibold rounded-xl transition-all duration-200">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Lessons', value: lessons.length, color: 'text-indigo-400' },
          { label: 'Published', value: lessons.filter(l => l.published_at).length, color: 'text-emerald-400' },
          { label: 'Drafts', value: lessons.filter(l => !l.published_at).length, color: 'text-yellow-400' },
          { label: 'Flagged', value: lessons.filter(l => l.report_count > 0).length, color: 'text-red-400' },
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-5 rounded-2xl border theme-border">
            <span className="text-xs font-semibold theme-text-secondary">{stat.label}</span>
            <div className={`text-2xl font-extrabold ${stat.color} mt-1`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/25 rounded-2xl text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" /><span>{error}</span>
        </div>
      )}

      {/* Lesson Table */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-xl theme-border border">
        <div className="p-6 border-b theme-border bg-slate-100/50 dark:bg-[#0d1223]/30 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          <h2 className="text-lg font-bold theme-text-primary">Curriculum Catalog</h2>
          <div className="flex gap-2 flex-wrap">
            <div className="relative">
              <input type="text" placeholder="Search lessons..." value={searchText} onChange={(e) => setSearchText(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary placeholder-slate-500 w-56" />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>
            <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#090b16] border theme-border text-sm theme-text-secondary focus:outline-none">
              <option value="All">All Subjects</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#090b16] border theme-border text-sm theme-text-secondary focus:outline-none">
              <option value="All">All Status</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <span className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 theme-text-secondary">No lessons found.</div>
          ) : (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b theme-border bg-slate-100/20 dark:bg-[#090b16]/30 theme-text-secondary text-xs font-bold uppercase tracking-wider">
                  <th className="px-5 py-4">Lesson</th>
                  <th className="px-5 py-4">Subject</th>
                  <th className="px-5 py-4">Type</th>
                  <th className="px-5 py-4">Teacher</th>
                  <th className="px-5 py-4">Rating</th>
                  <th className="px-5 py-4">Views</th>
                  <th className="px-5 py-4">Extras</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y theme-border text-sm">
                {filtered.map((l) => (
                  <tr key={l.id} className="theme-item-hover transition-colors">
                    <td className="px-5 py-4 max-w-[250px]">
                      <div className="font-semibold theme-text-primary truncate" title={l.title}>{l.title}</div>
                      <div className="text-[11px] theme-text-secondary mt-0.5">
                        {l.form_level.replace('_', ' ')} • {l.is_free ? 'Free' : 'Premium'}
                        {l.duration_sec ? ` • ${Math.round(l.duration_sec / 60)}min` : ''}
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">{l.subject}</span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="flex items-center gap-1 text-xs theme-text-secondary">
                        {l.type === 'VIDEO' ? <Video className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                        {l.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-xs theme-text-primary">{l.teacher_name}</td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {l.avg_rating ? (
                        <span className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" /> {l.avg_rating}
                        </span>
                      ) : <span className="text-xs theme-text-secondary">—</span>}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-xs">
                      <span className="theme-text-primary font-bold">{l.total_views}</span>
                      <span className="theme-text-secondary"> ({l.completions} done)</span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex gap-1.5">
                        {l.quiz_count > 0 && <span title="Has quizzes" className="p-1 bg-violet-500/10 text-violet-400 rounded border border-violet-500/20"><MessageSquare className="w-3 h-3" /></span>}
                        {l.has_ai_summary && <span title="Has AI summary" className="p-1 bg-blue-500/10 text-blue-400 rounded border border-blue-500/20"><Brain className="w-3 h-3" /></span>}
                        {l.has_captions && <span title="Has captions" className="p-1 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20"><Subtitles className="w-3 h-3" /></span>}
                        {l.report_count > 0 && <span title={`${l.report_count} reports`} className="p-1 bg-red-500/10 text-red-400 rounded border border-red-500/20 text-[9px] font-bold">{l.report_count}</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                        l.published_at ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>{l.published_at ? 'LIVE' : 'DRAFT'}</span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <button onClick={() => handleTogglePublish(l.id, !!l.published_at)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                          l.published_at
                            ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                        }`}>
                        {l.published_at ? <><EyeOff className="w-3.5 h-3.5" /> Unpublish</> : <><Eye className="w-3.5 h-3.5" /> Publish</>}
                      </button>
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
