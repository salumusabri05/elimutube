'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, AlertCircle, RefreshCw, Trash2, ChevronDown, ChevronUp, CheckCircle, Brain, Users } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedQuiz, setExpandedQuiz] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiRequest('quizzes');
      setQuizzes(data);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch quizzes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuizzes(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this quiz and all its questions/results? This cannot be undone.')) return;
    try {
      await apiRequest(`quizzes/${id}/delete`, { method: 'POST' });
      fetchQuizzes();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const filtered = quizzes.filter(q =>
    q.lesson_title.toLowerCase().includes(searchText.toLowerCase()) ||
    q.teacher_name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold theme-text-primary tracking-tight flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-indigo-500" />
            Quiz Management
          </h1>
          <p className="text-sm mt-1 theme-text-secondary">Review lesson quizzes, inspect questions and options, and manage quiz lifecycle.</p>
        </div>
        <button onClick={fetchQuizzes} className="flex items-center gap-2 px-4 py-2.5 theme-item-bg theme-item-hover border theme-border theme-text-secondary hover:theme-text-primary text-sm font-semibold rounded-xl transition-all duration-200">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Quizzes', value: quizzes.length, color: 'text-indigo-400' },
          { label: 'AI Generated', value: quizzes.filter(q => q.generated_by === 'AI').length, color: 'text-violet-400' },
          { label: 'Total Questions', value: quizzes.reduce((sum, q) => sum + q.question_count, 0), color: 'text-blue-400' },
          { label: 'Total Attempts', value: quizzes.reduce((sum, q) => sum + q.attempts, 0), color: 'text-emerald-400' },
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

      {/* Search */}
      <div className="flex gap-2">
        <input type="text" placeholder="Search by lesson or teacher..." value={searchText} onChange={(e) => setSearchText(e.target.value)}
          className="px-4 py-2.5 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary placeholder-slate-500 w-80" />
      </div>

      {/* Quiz Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 theme-text-secondary glass-panel rounded-3xl border theme-border">No quizzes found.</div>
        ) : filtered.map((q) => (
          <div key={q.id} className="glass-panel rounded-2xl border theme-border overflow-hidden">
            {/* Quiz Header */}
            <div className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors"
              onClick={() => setExpandedQuiz(expandedQuiz === q.id ? null : q.id)}>
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold theme-text-primary">{q.lesson_title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs theme-text-secondary">
                    <span>by {q.teacher_name}</span>
                    <span>•</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      q.generated_by === 'AI' ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>{q.generated_by}</span>
                    <span>•</span>
                    <span>{q.question_count} questions</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {q.attempts} attempts</span>
                    {q.avg_score > 0 && <>
                      <span>•</span>
                      <span>Avg: {q.avg_score}%</span>
                    </>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); handleDelete(q.id); }}
                  className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
                {expandedQuiz === q.id ? <ChevronUp className="w-5 h-5 theme-text-secondary" /> : <ChevronDown className="w-5 h-5 theme-text-secondary" />}
              </div>
            </div>

            {/* Expanded Questions */}
            {expandedQuiz === q.id && (
              <div className="border-t theme-border p-5 space-y-4 bg-slate-50/50 dark:bg-[#0a0d1a]/50">
                {q.questions.map((question: any, qi: number) => (
                  <div key={question.id} className="glass-panel p-4 rounded-xl border theme-border">
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-bold flex-shrink-0">
                        {qi + 1}
                      </span>
                      <div className="flex-1 space-y-3">
                        <p className="font-semibold theme-text-primary text-sm">{question.question_text_en}</p>
                        {question.question_text_sw && (
                          <p className="text-xs theme-text-secondary italic">SW: {question.question_text_sw}</p>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {question.options.map((opt: any, oi: number) => (
                            <div key={opt.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs border ${
                              oi === question.correct_answer_index
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-bold'
                                : 'theme-item-bg theme-border theme-text-secondary'
                            }`}>
                              {oi === question.correct_answer_index && <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />}
                              <span>{String.fromCharCode(65 + oi)}) {opt.option_text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
