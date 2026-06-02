'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, AlertCircle, RefreshCw, Trash2, ChevronDown, ChevronUp, CheckCircle, Brain, Users, Plus, X, FileText, Image, Check, Trash } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedQuiz, setExpandedQuiz] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');

  // Create Quiz States
  const [lessons, setLessons] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLessonId, setCreateLessonId] = useState('');
  const [questions, setQuestions] = useState<any[]>([
    {
      question_text_en: '',
      question_text_sw: '',
      question_type: 'MULTIPLE_CHOICE',
      correct_answer_index: 0,
      correct_answer_text: '',
      options: ['', '', '', ''],
    }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const fetchLessons = async () => {
    try {
      const data = await apiRequest('admin/lessons');
      setLessons(data);
      if (data.length > 0) {
        setCreateLessonId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch lessons:', err);
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, {
      question_text_en: '',
      question_text_sw: '',
      question_type: 'MULTIPLE_CHOICE',
      correct_answer_index: 0,
      correct_answer_text: '',
      options: ['', '', '', ''],
    }]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, fields: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], ...fields };
    setQuestions(updated);
  };

  const updateOption = (qIndex: number, optIndex: number, val: string) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = val;
    setQuestions(updated);
  };

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createLessonId) return alert('Please select a lesson.');
    if (questions.some(q => !q.question_text_en.trim())) {
      return alert('Please fill in English text for all questions.');
    }
    try {
      setIsSubmitting(true);
      await apiRequest('quizzes/create', {
        method: 'POST',
        body: JSON.stringify({
          lesson_id: createLessonId,
          questions: questions.map(q => ({
            question_text_en: q.question_text_en.trim(),
            question_text_sw: q.question_text_sw.trim() || undefined,
            question_type: q.question_type,
            correct_answer_index: q.question_type === 'MULTIPLE_CHOICE' ? q.correct_answer_index : undefined,
            correct_answer_text: q.question_type === 'TEXT_ANSWER' ? q.correct_answer_text.trim() : undefined,
            options: q.question_type === 'MULTIPLE_CHOICE' ? q.options.filter((o: string) => o.trim() !== '') : undefined,
          })),
        }),
      });

      setShowCreateModal(false);
      // Reset form
      setQuestions([
        {
          question_text_en: '',
          question_text_sw: '',
          question_type: 'MULTIPLE_CHOICE',
          correct_answer_index: 0,
          correct_answer_text: '',
          options: ['', '', '', ''],
        }
      ]);
      fetchQuizzes();
    } catch (err: any) {
      alert(`Failed to create quiz: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
    fetchLessons();
  }, []);

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
        <div className="flex gap-2">
          <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/20">
            <Plus className="w-4 h-4" /> Create Quiz
          </button>
          <button onClick={fetchQuizzes} className="flex items-center gap-2 px-4 py-2.5 theme-item-bg theme-item-hover border theme-border theme-text-secondary hover:theme-text-primary text-sm font-semibold rounded-xl transition-all duration-200">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
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
                        <div className="flex items-center gap-2">
                          <p className="font-semibold theme-text-primary text-sm">{question.question_text_en}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            question.question_type === 'PHOTO_UPLOAD' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' :
                            question.question_type === 'TEXT_ANSWER' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' :
                            'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20'
                          }`}>
                            {question.question_type || 'MULTIPLE_CHOICE'}
                          </span>
                        </div>
                        {question.question_text_sw && (
                          <p className="text-xs theme-text-secondary italic">SW: {question.question_text_sw}</p>
                        )}
                        {question.question_type === 'MULTIPLE_CHOICE' || !question.question_type ? (
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
                        ) : null}

                        {question.question_type === 'TEXT_ANSWER' && (
                          <div className="p-3 rounded-xl theme-item-bg border theme-border text-xs">
                            <span className="font-bold text-emerald-400">Correct Answer: </span>
                            <span className="theme-text-primary">{question.correct_answer_text || 'Any text submission'}</span>
                          </div>
                        )}

                        {question.question_type === 'PHOTO_UPLOAD' && (
                          <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 text-xs text-amber-300 flex items-center gap-2">
                            <Image className="w-4 h-4 text-amber-400" />
                            <span>Requires student to upload / capture a photo response.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create Quiz Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-3xl rounded-3xl border theme-border overflow-hidden shadow-2xl my-8 animate-in zoom-in duration-200 bg-[#090d16] flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="p-6 border-b theme-border flex items-center justify-between bg-slate-100/50 dark:bg-[#0d1223]/30">
              <h3 className="text-lg font-bold theme-text-primary flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-500" />
                Create New Quiz
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1.5 rounded-lg theme-text-secondary hover:theme-text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Content */}
            <form onSubmit={handleCreateQuiz} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Select Lesson */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold theme-text-secondary">Select Associated Class / Lesson *</label>
                <select required value={createLessonId} onChange={(e) => setCreateLessonId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary bg-[#0c1222]">
                  <option value="" disabled>-- Select a Lesson --</option>
                  {lessons.map(l => (
                    <option key={l.id} value={l.id}>{l.title} ({l.subject} - {l.form_level.replace('_', ' ')})</option>
                  ))}
                </select>
              </div>

              {/* Questions Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold theme-text-primary">Questions ({questions.length})</h4>
                  <button type="button" onClick={addQuestion} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0f172a] text-indigo-400 hover:bg-indigo-600/10 text-xs font-bold rounded-lg transition-colors border border-indigo-500/25">
                    <Plus className="w-3.5 h-3.5" /> Add Question
                  </button>
                </div>

                {questions.map((q, qIndex) => (
                  <div key={qIndex} className="p-5 rounded-2xl border theme-border bg-[#0d1324]/50 space-y-4 relative">
                    <div className="absolute top-4 right-4">
                      {questions.length > 1 && (
                        <button type="button" onClick={() => removeQuestion(qIndex)} className="p-1 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded-lg">Question #{qIndex + 1}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Question EN */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold theme-text-secondary">Question (English) *</label>
                        <input type="text" required value={q.question_text_en} onChange={(e) => updateQuestion(qIndex, { question_text_en: e.target.value })}
                          placeholder="e.g. What is the value of Pi?"
                          className="w-full px-4 py-2.5 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary bg-[#0c1222]" />
                      </div>
                      {/* Question SW */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold theme-text-secondary">Question (Swahili)</label>
                        <input type="text" value={q.question_text_sw} onChange={(e) => updateQuestion(qIndex, { question_text_sw: e.target.value })}
                          placeholder="e.g. Nini thamani ya Pi?"
                          className="w-full px-4 py-2.5 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary bg-[#0c1222]" />
                      </div>
                    </div>

                    {/* Question Type */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold theme-text-secondary">Question Type</label>
                      <select value={q.question_type} onChange={(e) => updateQuestion(qIndex, { question_type: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary bg-[#0c1222]">
                        <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                        <option value="TEXT_ANSWER">Written Answer / Text</option>
                        <option value="PHOTO_UPLOAD">Photo / Upload Response</option>
                      </select>
                    </div>

                    {/* Conditional Type Forms */}
                    {q.question_type === 'MULTIPLE_CHOICE' && (
                      <div className="space-y-3 pt-2">
                        <label className="text-xs font-semibold theme-text-secondary">Options (Fill text and select correct one)</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {q.options.map((opt: string, optIndex: number) => (
                            <div key={optIndex} className="flex items-center gap-2">
                              <button type="button" onClick={() => updateQuestion(qIndex, { correct_answer_index: optIndex })}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center border font-bold text-xs transition-colors flex-shrink-0 ${
                                  q.correct_answer_index === optIndex
                                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                                    : 'theme-item-bg theme-border theme-text-secondary'
                                }`}>
                                {String.fromCharCode(65 + optIndex)}
                              </button>
                              <input type="text" required={q.question_type === 'MULTIPLE_CHOICE'} value={opt} onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                                placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                                className="w-full px-3 py-2 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-xs theme-text-primary bg-[#0c1222]" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {q.question_type === 'TEXT_ANSWER' && (
                      <div className="space-y-1.5 pt-2">
                        <label className="text-xs font-semibold theme-text-secondary">Expected Correct Answer Text</label>
                        <input type="text" value={q.correct_answer_text} onChange={(e) => updateQuestion(qIndex, { correct_answer_text: e.target.value })}
                          placeholder="e.g. 3.14"
                          className="w-full px-4 py-2.5 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary bg-[#0c1222]" />
                      </div>
                    )}

                    {q.question_type === 'PHOTO_UPLOAD' && (
                      <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 text-xs text-amber-300 flex items-center gap-2">
                        <Image className="w-4 h-4 text-amber-400 animate-pulse" />
                        <span>Requires students to submit their answers by taking or uploading a photo.</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t theme-border">
                <button type="button" onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border theme-border theme-text-secondary hover:theme-text-primary text-sm font-semibold transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all">
                  {isSubmitting ? 'Creating...' : 'Create Quiz'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
