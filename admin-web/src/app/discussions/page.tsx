'use client';

import { useState, useEffect } from 'react';
import { MessagesSquare, Trash2, RefreshCw, AlertCircle, Pin, CheckCircle2, ThumbsUp, HelpCircle } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function DiscussionsPage() {
  const [lessons, setLessons] = useState<any[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState('');
  const [forum, setForum] = useState<any | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchLessons = async () => {
    try {
      setError('');
      // In the real system, it lists lessons via GET /lessons
      const data = await apiRequest('lessons');
      setLessons(data);
      if (data.length > 0) {
        setSelectedLessonId(data[0].id);
        fetchForum(data[0].id);
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch lessons. Make sure the backend is running.');
    }
  };

  const fetchForum = async (lessonId: string) => {
    try {
      setLoading(true);
      const data = await apiRequest(`discussions/forum/lesson/${lessonId}`);
      setForum(data);
      setSelectedTopic(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectTopic = async (topicId: string) => {
    try {
      const data = await apiRequest(`discussions/topic/${topicId}`);
      setSelectedTopic(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePin = async (topic: any) => {
    try {
      await apiRequest(`discussions/topic/${topic.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ is_pinned: !topic.is_pinned }),
      });
      // Refresh forum and selected topic
      fetchForum(selectedLessonId);
      selectTopic(topic.id);
    } catch (err: any) {
      alert(`Pin update failed: ${err.message}`);
    }
  };

  const handleDeleteTopic = async (topicId: string) => {
    if (!confirm('Are you sure you want to delete this topic and all its replies?')) return;
    try {
      await apiRequest(`discussions/topic/${topicId}`, { method: 'DELETE' });
      fetchForum(selectedLessonId);
      setSelectedTopic(null);
    } catch (err: any) {
      alert(`Delete topic failed: ${err.message}`);
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    if (!confirm('Are you sure you want to delete this reply?')) return;
    try {
      await apiRequest(`discussions/reply/${replyId}`, { method: 'DELETE' });
      if (selectedTopic) {
        selectTopic(selectedTopic.id);
      }
    } catch (err: any) {
      alert(`Delete reply failed: ${err.message}`);
    }
  };

  const handleMarkAnswer = async (replyId: string) => {
    try {
      await apiRequest(`discussions/reply/${replyId}/mark-answer`, { method: 'POST' });
      if (selectedTopic) {
        selectTopic(selectedTopic.id);
        fetchForum(selectedLessonId);
      }
    } catch (err: any) {
      alert(`Mark answer failed: ${err.message}`);
    }
  };

  const handleUpvoteReply = async (replyId: string) => {
    try {
      await apiRequest(`discussions/reply/${replyId}/upvote`, { method: 'POST' });
      if (selectedTopic) {
        selectTopic(selectedTopic.id);
      }
    } catch (err: any) {
      alert(`Upvote failed: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold theme-text-primary tracking-tight flex items-center gap-2">
            <MessagesSquare className="w-6 h-6 text-indigo-500" />
            Discussion Forums Audit
          </h1>
          <p className="text-sm mt-1 theme-text-secondary">Monitor lesson Q&A, pin class updates, delete reports, and moderate conversations.</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/25 rounded-2xl text-red-400">
          <AlertCircle className="w-5 h-5" /><span>{error}</span>
        </div>
      )}

      {/* Lesson Selector */}
      <div className="glass-panel p-5 rounded-2xl border theme-border flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <label className="text-sm font-semibold theme-text-secondary whitespace-nowrap">Filter by Lesson:</label>
          <select 
            value={selectedLessonId} 
            onChange={(e) => {
              setSelectedLessonId(e.target.value);
              fetchForum(e.target.value);
            }}
            className="w-full md:w-80 px-4 py-2 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary"
          >
            {lessons.map(l => (
              <option key={l.id} value={l.id}>{l.title}</option>
            ))}
          </select>
        </div>
        <button onClick={() => fetchForum(selectedLessonId)} className="flex items-center gap-2 px-4 py-2 theme-item-bg theme-item-hover border theme-border theme-text-secondary hover:theme-text-primary text-xs font-semibold rounded-xl transition-all duration-200">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh List
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Column 1 & 2: Topics List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold theme-text-primary flex items-center gap-2">
            <MessagesSquare className="w-5 h-5 text-indigo-400" /> Discussion Topics
          </h2>

          {loading ? (
            <div className="flex justify-center py-10">
              <span className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !forum || !forum.topics || forum.topics.length === 0 ? (
            <div className="text-center py-20 text-xs theme-text-secondary border border-dashed theme-border rounded-2xl">
              No topics created yet in this forum.
            </div>
          ) : (
            <div className="space-y-3">
              {forum.topics.map((t: any) => (
                <div 
                  key={t.id}
                  onClick={() => selectTopic(t.id)}
                  className={`glass-panel p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    selectedTopic?.id === t.id ? 'border-indigo-500 bg-indigo-500/5' : 'theme-border hover:border-indigo-500/50'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs theme-text-secondary">
                        Posted by {t.author?.display_name || 'Student'} • {new Date(t.created_at).toLocaleDateString()}
                      </span>
                      <div className="flex gap-2 items-center">
                        {t.is_pinned && <span className="flex items-center gap-0.5 text-[9px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded"><Pin className="w-3 h-3" /> PINNED</span>}
                        {t.is_resolved && <span className="flex items-center gap-0.5 text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded"><CheckCircle2 className="w-3 h-3" /> RESOLVED</span>}
                      </div>
                    </div>
                    <h3 className="font-bold theme-text-primary text-sm line-clamp-1">{t.title}</h3>
                    <p className="text-xs theme-text-secondary line-clamp-2">{t.body}</p>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t theme-border text-xs theme-text-secondary">
                    <span>{t._count?.replies || 0} replies</span>
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => handleTogglePin(t)} className="p-1 rounded text-amber-500 hover:bg-amber-500/10 transition-colors">
                        <Pin className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteTopic(t.id)} className="p-1 rounded text-red-500 hover:bg-red-500/10 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Column 3: Topic Detail & Threaded Replies list */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold theme-text-primary flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-400" /> Topic Details & Replies
          </h2>

          {!selectedTopic ? (
            <div className="glass-panel p-8 rounded-2xl border theme-border text-center theme-text-secondary text-xs h-64 flex flex-col justify-center items-center">
              <HelpCircle className="w-8 h-8 mb-2 text-indigo-500/30" />
              <span>Select a topic to view post details and manage comments thread.</span>
            </div>
          ) : (
            <div className="glass-panel p-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold theme-text-primary text-base">{selectedTopic.title}</h3>
                </div>
                <p className="text-xs theme-text-secondary">
                  by {selectedTopic.author?.display_name} • {new Date(selectedTopic.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm theme-text-primary bg-slate-900/50 p-3.5 border theme-border rounded-xl whitespace-pre-wrap">{selectedTopic.body}</p>
              </div>

              {/* Replies */}
              <div className="space-y-4 pt-4 border-t theme-border">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Replies ({selectedTopic.replies?.length || 0})</span>
                
                {selectedTopic.replies?.length === 0 ? (
                  <p className="text-xs theme-text-secondary italic">No replies in this topic.</p>
                ) : (
                  <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                    {selectedTopic.replies.map((r: any) => (
                      <div key={r.id} className={`p-3 border rounded-xl space-y-2 relative transition-all ${
                        r.is_answer ? 'border-emerald-500 bg-emerald-500/5' : 'theme-border theme-item-bg'
                      }`}>
                        <div className="flex justify-between items-center text-[10px] theme-text-secondary">
                          <span className="font-semibold">{r.author?.display_name}</span>
                          <span className="flex items-center gap-1.5">
                            {r.is_answer && <span className="text-emerald-500 font-bold uppercase flex items-center gap-0.5"><CheckCircle2 className="w-3.5 h-3.5" /> Answer</span>}
                            <span>{new Date(r.created_at).toLocaleDateString()}</span>
                          </span>
                        </div>
                        <p className="text-xs theme-text-primary whitespace-pre-wrap">{r.body}</p>
                        
                        <div className="flex justify-between items-center pt-2 mt-1 border-t border-slate-800 text-[10px] theme-text-secondary">
                          <button onClick={() => handleUpvoteReply(r.id)} className="flex items-center gap-1 hover:text-indigo-400">
                            <ThumbsUp className="w-3.5 h-3.5" /> {r.upvotes}
                          </button>
                          
                          <div className="flex gap-2">
                            {!r.is_answer && (
                              <button onClick={() => handleMarkAnswer(r.id)} className="text-emerald-500 hover:underline">
                                Mark Answer
                              </button>
                            )}
                            <button onClick={() => handleDeleteReply(r.id)} className="text-red-400 hover:underline">
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
}
