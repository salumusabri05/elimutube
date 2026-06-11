'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Search, AlertCircle, RefreshCw, Eye, EyeOff, Star, MessageSquare, Brain, Subtitles, Video, FileText, Plus, X } from 'lucide-react';
import { apiRequest, getApiBase } from '@/lib/api';

export default function LessonsPage() {
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Create Lesson Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createTitle, setCreateTitle] = useState('');
  const [createTitleSw, setCreateTitleSw] = useState('');
  const [createSubject, setCreateSubject] = useState('MATH');
  const [createFormLevel, setCreateFormLevel] = useState('FORM_1');
  const [createType, setCreateType] = useState('VIDEO');
  const [createPdfUrl, setCreatePdfUrl] = useState('');
  const [createMuxAssetId, setCreateMuxAssetId] = useState('');
  const [createIsFree, setCreateIsFree] = useState(true);
  const [createDurationMin, setCreateDurationMin] = useState('30');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Upload Mode States
  const [pdfSourceMode, setPdfSourceMode] = useState<'upload' | 'url'>('upload');
  const [videoSourceMode, setVideoSourceMode] = useState<'upload' | 'url'>('upload');
  const [selectedPdfFile, setSelectedPdfFile] = useState<File | null>(null);
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'PDF' | 'VIDEO') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'PDF') {
      setSelectedPdfFile(file);
    } else {
      setSelectedVideoFile(file);
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const API_BASE = getApiBase();
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_BASE}/admin/upload-asset`, true);
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          if (response.success && response.url) {
            if (type === 'PDF') {
              setCreatePdfUrl(response.url);
            } else {
              setCreateMuxAssetId(response.url);
            }
            setUploadProgress(100);
          } else {
            setUploadError('Upload failed: Invalid response from server.');
          }
        } else {
          setUploadError(`Upload failed with status: ${xhr.status}`);
        }
        setIsUploading(false);
      };

      xhr.onerror = () => {
        setUploadError('Network error occurred during upload.');
        setIsUploading(false);
      };

      xhr.send(formData);
    } catch (err: any) {
      setUploadError(err.message || 'An error occurred during file upload.');
      setIsUploading(false);
    }
  };

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

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createTitle.trim()) return;
    try {
      setIsSubmitting(true);
      await apiRequest('admin/lessons/create', {
        method: 'POST',
        body: JSON.stringify({
          title: createTitle.trim(),
          title_sw: createTitleSw.trim() || undefined,
          subject: createSubject,
          form_level: createFormLevel,
          type: createType,
          pdf_url: createType === 'PDF' ? createPdfUrl.trim() : undefined,
          mux_asset_id: createType === 'VIDEO' ? (createMuxAssetId.trim() || undefined) : undefined,
          is_free: createIsFree,
          duration_sec: parseInt(createDurationMin) * 60,
        }),
      });
      setShowCreateModal(false);
      // Reset form
      setCreateTitle('');
      setCreateTitleSw('');
      setCreateSubject('MATH');
      setCreateFormLevel('FORM_1');
      setCreateType('VIDEO');
      setCreatePdfUrl('');
      setCreateMuxAssetId('');
      setCreateIsFree(true);
      setCreateDurationMin('30');
      setSelectedPdfFile(null);
      setSelectedVideoFile(null);
      setUploadProgress(null);
      setUploadError('');
      setPdfSourceMode('upload');
      setVideoSourceMode('upload');
      
      fetchLessons();
    } catch (err: any) {
      alert(`Failed to create lesson: ${err.message}`);
    } finally {
      setIsSubmitting(false);
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
        <div className="flex gap-2">
          <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/20">
            <Plus className="w-4 h-4" /> Add Lesson
          </button>
          <button onClick={fetchLessons} className="flex items-center gap-2 px-4 py-2.5 theme-item-bg theme-item-hover border theme-border theme-text-secondary hover:theme-text-primary text-sm font-semibold rounded-xl transition-all duration-200">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
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

      {/* Create Lesson Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-2xl rounded-3xl border theme-border flex flex-col max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in duration-200 bg-white dark:bg-[#090d16]">
            {/* Header */}
            <div className="p-6 border-b theme-border flex items-center justify-between bg-slate-100/50 dark:bg-[#0d1223]/30">
              <h3 className="text-lg font-bold theme-text-primary flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-500" />
                Upload New Class / Lesson
              </h3>
              <button type="button" onClick={() => setShowCreateModal(false)} className="p-1.5 rounded-lg theme-text-secondary hover:theme-text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateLesson} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title EN */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold theme-text-secondary">Title (English) *</label>
                  <input type="text" required value={createTitle} onChange={(e) => setCreateTitle(e.target.value)}
                    placeholder="e.g. Introduction to Quadratic Equations"
                    className="w-full px-4 py-2.5 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary placeholder-slate-500" />
                </div>
                {/* Title SW */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold theme-text-secondary">Title (Swahili)</label>
                  <input type="text" value={createTitleSw} onChange={(e) => setCreateTitleSw(e.target.value)}
                    placeholder="e.g. Utangulizi wa Milinganyo ya Kipeo cha Pili"
                    className="w-full px-4 py-2.5 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary placeholder-slate-500" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Subject */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold theme-text-secondary">Subject Area</label>
                  <select value={createSubject} onChange={(e) => setCreateSubject(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary">
                    {['MATH', 'PHYSICS', 'CHEMISTRY', 'BIOLOGY', 'ENGLISH', 'KISWAHILI', 'HISTORY', 'GEOGRAPHY', 'ACCOUNTS'].map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
                {/* Form Level */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold theme-text-secondary">Form Level</label>
                  <select value={createFormLevel} onChange={(e) => setCreateFormLevel(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary">
                    {['FORM_1', 'FORM_2', 'FORM_3', 'FORM_4', 'FORM_5', 'FORM_6', 'STD_1', 'STD_2', 'STD_3', 'STD_4', 'STD_5', 'STD_6', 'STD_7'].map(lvl => (
                      <option key={lvl} value={lvl}>{lvl.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
                {/* Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold theme-text-secondary">Content Type</label>
                  <select value={createType} onChange={(e) => setCreateType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary">
                    <option value="VIDEO">VIDEO</option>
                    <option value="PDF">PDF</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Duration */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold theme-text-secondary">Duration (Minutes)</label>
                  <input type="number" required value={createDurationMin} onChange={(e) => setCreateDurationMin(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary" />
                </div>
                {/* Access */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold theme-text-secondary">Pricing / Access</label>
                  <div className="flex items-center gap-4 mt-2">
                    <label className="flex items-center gap-2 text-sm theme-text-primary cursor-pointer">
                      <input type="radio" checked={createIsFree} onChange={() => setCreateIsFree(true)} className="text-indigo-600 focus:ring-indigo-500" />
                      Free Access
                    </label>
                    <label className="flex items-center gap-2 text-sm theme-text-primary cursor-pointer">
                      <input type="radio" checked={!createIsFree} onChange={() => setCreateIsFree(false)} className="text-indigo-600 focus:ring-indigo-500" />
                      Premium Access
                    </label>
                  </div>
                </div>
              </div>

              {/* Conditional Inputs */}
              {createType === 'PDF' ? (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold theme-text-secondary">PDF Document Source</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button type="button" onClick={() => setPdfSourceMode('upload')}
                        className={`py-2 text-xs font-bold rounded-xl border transition-all ${pdfSourceMode === 'upload' ? 'bg-indigo-600/15 border-indigo-500 text-indigo-400' : 'theme-border theme-text-secondary hover:theme-text-primary theme-item-bg'}`}>
                        Upload PDF to R2
                      </button>
                      <button type="button" onClick={() => setPdfSourceMode('url')}
                        className={`py-2 text-xs font-bold rounded-xl border transition-all ${pdfSourceMode === 'url' ? 'bg-indigo-600/15 border-indigo-500 text-indigo-400' : 'theme-border theme-text-secondary hover:theme-text-primary theme-item-bg'}`}>
                        Enter URL manually
                      </button>
                    </div>
                  </div>

                  {pdfSourceMode === 'upload' ? (
                    <div className="border border-dashed theme-border rounded-2xl p-6 text-center space-y-3 bg-slate-100/50 dark:bg-[#0d1223]/30">
                      <input type="file" accept="application/pdf" id="pdf-upload" className="hidden" onChange={(e) => handleFileChange(e, 'PDF')} />
                      <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center gap-2">
                        <FileText className="w-10 h-10 text-indigo-400 animate-pulse" />
                        <span className="text-xs font-semibold theme-text-primary">
                          {selectedPdfFile ? selectedPdfFile.name : 'Choose a PDF file to upload'}
                        </span>
                        <span className="text-[10px] theme-text-secondary opacity-60">Max size: 50MB</span>
                      </label>
                      
                      {uploadProgress !== null && (
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                      )}

                      {isUploading && <span className="text-[11px] text-indigo-400">Uploading to Cloudflare R2...</span>}
                      {uploadError && <span className="text-[11px] text-rose-400">{uploadError}</span>}
                      {createPdfUrl && !isUploading && <span className="text-[11px] text-emerald-400 font-medium">Uploaded! PDF URL generated successfully.</span>}
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold theme-text-secondary">PDF Document URL *</label>
                      <input type="url" required value={createPdfUrl} onChange={(e) => setCreatePdfUrl(e.target.value)}
                        placeholder="https://pub-34ad9122863347229d18978333b69706.r2.dev/uploads/notes.pdf"
                        className="w-full px-4 py-2.5 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary placeholder-slate-500" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold theme-text-secondary">Video Content Source</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button type="button" onClick={() => setVideoSourceMode('upload')}
                        className={`py-2 text-xs font-bold rounded-xl border transition-all ${videoSourceMode === 'upload' ? 'bg-indigo-600/15 border-indigo-500 text-indigo-400' : 'theme-border theme-text-secondary hover:theme-text-primary theme-item-bg'}`}>
                        Upload Video to R2
                      </button>
                      <button type="button" onClick={() => setVideoSourceMode('url')}
                        className={`py-2 text-xs font-bold rounded-xl border transition-all ${videoSourceMode === 'url' ? 'bg-indigo-600/15 border-indigo-500 text-indigo-400' : 'theme-border theme-text-secondary hover:theme-text-primary theme-item-bg'}`}>
                        Enter Video URL / ID manually
                      </button>
                    </div>
                  </div>

                  {videoSourceMode === 'upload' ? (
                    <div className="border border-dashed theme-border rounded-2xl p-6 text-center space-y-3 bg-slate-100/50 dark:bg-[#0d1223]/30">
                      <input type="file" accept="video/mp4,video/mkv,video/webm" id="video-upload" className="hidden" onChange={(e) => handleFileChange(e, 'VIDEO')} />
                      <label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center gap-2">
                        <Video className="w-10 h-10 text-indigo-400 animate-pulse" />
                        <span className="text-xs font-semibold theme-text-primary">
                          {selectedVideoFile ? selectedVideoFile.name : 'Choose a Video file (MP4/MKV) to upload'}
                        </span>
                        <span className="text-[10px] theme-text-secondary opacity-60">Max size: 250MB</span>
                      </label>
                      
                      {uploadProgress !== null && (
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                      )}

                      {isUploading && <span className="text-[11px] text-indigo-400">Uploading to Cloudflare R2...</span>}
                      {uploadError && <span className="text-[11px] text-rose-400">{uploadError}</span>}
                      {createMuxAssetId && !isUploading && <span className="text-[11px] text-emerald-400 font-medium">Uploaded! Video URL/ID set to Cloudflare R2 resource.</span>}
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold theme-text-secondary">Video URL or Asset ID *</label>
                      <input type="text" required value={createMuxAssetId} onChange={(e) => setCreateMuxAssetId(e.target.value)}
                        placeholder="e.g. Mux Asset ID or https://pub-34ad9122863347229d18978333b69706.r2.dev/video.mp4"
                        className="w-full px-4 py-2.5 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary placeholder-slate-500" />
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t theme-border">
                <button type="button" onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border theme-border theme-text-secondary hover:theme-text-primary text-sm font-semibold transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all">
                  {isSubmitting ? 'Uploading...' : 'Upload Lesson'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
