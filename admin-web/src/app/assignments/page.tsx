'use client';

import { useState, useEffect } from 'react';
import { ClipboardList, FileText, CheckCircle, RefreshCw, AlertCircle, Calendar, Star, Award } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function AssignmentsPage() {
  const [lessons, setLessons] = useState<any[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState('');
  const [assignments, setAssignments] = useState<any[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<any | null>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Grading states
  const [gradeScore, setGradeScore] = useState(0);
  const [gradeFeedback, setGradeFeedback] = useState('');

  const fetchLessons = async () => {
    try {
      setError('');
      // In the real system, it lists lessons via GET /lessons
      const data = await apiRequest('lessons');
      setLessons(data);
      if (data.length > 0) {
        setSelectedLessonId(data[0].id);
        fetchAssignments(data[0].id);
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch lessons. Make sure the backend is running.');
    }
  };

  const fetchAssignments = async (lessonId: string) => {
    try {
      setLoading(true);
      const data = await apiRequest(`assignments/lesson/${lessonId}`);
      setAssignments(data);
      setSelectedAssignment(null);
      setSubmissions([]);
      setSelectedSubmission(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectAssignment = async (assignment: any) => {
    setSelectedAssignment(assignment);
    setSelectedSubmission(null);
    try {
      const data = await apiRequest(`assignments/${assignment.id}/submissions`);
      setSubmissions(data);
    } catch (err) {
      console.error(err);
    }
  };

  const selectSubmission = (sub: any) => {
    setSelectedSubmission(sub);
    setGradeScore(sub.score || 0);
    setGradeFeedback(sub.feedback || '');
  };

  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission || !selectedAssignment) return;
    try {
      await apiRequest(`assignments/submission/${selectedSubmission.id}/grade`, {
        method: 'POST',
        body: JSON.stringify({
          score: gradeScore,
          feedback: gradeFeedback,
          graded_by: 'admin-id-placeholder', // mocked user uploader id
        }),
      });
      alert('Submission graded successfully!');
      // Refresh submissions
      selectAssignment(selectedAssignment);
    } catch (err: any) {
      alert(`Grading failed: ${err.message}`);
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
            <ClipboardList className="w-6 h-6 text-indigo-500" />
            Assignment & Grading Center
          </h1>
          <p className="text-sm mt-1 theme-text-secondary">Grade open-ended submissions, read student write-ups, and review uploaded PDF/image homework.</p>
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
              fetchAssignments(e.target.value);
            }}
            className="w-full md:w-80 px-4 py-2 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary"
          >
            {lessons.map(l => (
              <option key={l.id} value={l.id}>{l.title}</option>
            ))}
          </select>
        </div>
        <button onClick={() => fetchAssignments(selectedLessonId)} className="flex items-center gap-2 px-4 py-2 theme-item-bg theme-item-hover border theme-border theme-text-secondary hover:theme-text-primary text-xs font-semibold rounded-xl transition-all duration-200">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh List
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Column 1: Assignments list */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold theme-text-primary flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-indigo-400" /> Assignments
          </h2>

          {loading ? (
            <div className="flex justify-center py-10">
              <span className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : assignments.length === 0 ? (
            <div className="text-center py-10 text-xs theme-text-secondary border border-dashed theme-border rounded-2xl">
              No assignments found for this lesson.
            </div>
          ) : (
            <div className="space-y-3">
              {assignments.map((a) => (
                <div 
                  key={a.id}
                  onClick={() => selectAssignment(a)}
                  className={`glass-panel p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedAssignment?.id === a.id ? 'border-indigo-500 bg-indigo-500/5' : 'theme-border hover:border-indigo-500/50'
                  }`}
                >
                  <h3 className="font-bold theme-text-primary text-sm line-clamp-1">{a.title}</h3>
                  <div className="flex justify-between items-center mt-3 text-[10px] theme-text-secondary">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Due: {a.due_date ? new Date(a.due_date).toLocaleDateString() : 'No Limit'}</span>
                    <span className="bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded font-bold uppercase">{a.type}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Column 2: Submissions list */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold theme-text-primary flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" /> Submissions
          </h2>

          {!selectedAssignment ? (
            <div className="glass-panel p-8 rounded-2xl border theme-border text-center theme-text-secondary text-xs">
              Select an assignment to view student submissions.
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-10 text-xs theme-text-secondary border border-dashed theme-border rounded-2xl">
              No submissions found for this assignment yet.
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((s) => (
                <div 
                  key={s.id}
                  onClick={() => selectSubmission(s)}
                  className={`glass-panel p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedSubmission?.id === s.id ? 'border-indigo-500 bg-indigo-500/5' : 'theme-border hover:border-indigo-500/50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-sm theme-text-primary truncate">{s.student?.display_name || 'Anonymous Student'}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      s.status === 'GRADED' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
                    }`}>
                      {s.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-3 text-[10px] theme-text-secondary">
                    <span>Submitted: {new Date(s.submitted_at).toLocaleDateString()}</span>
                    {s.score !== null && <span className="font-bold text-indigo-400">Score: {s.score}/{selectedAssignment.max_score}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Column 3: Grading & details panel */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold theme-text-primary flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" /> Grading Panel
          </h2>

          {!selectedSubmission ? (
            <div className="glass-panel p-8 rounded-2xl border theme-border text-center theme-text-secondary text-xs h-64 flex flex-col justify-center items-center">
              <Award className="w-8 h-8 mb-2 text-indigo-500/30" />
              <span>Select a submission from the list to review and award marks.</span>
            </div>
          ) : (
            <div className="glass-panel p-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 space-y-6">
              <div>
                <h3 className="font-bold theme-text-primary text-base">Grading: {selectedSubmission.student?.display_name || 'Student'}</h3>
                <p className="text-[10px] theme-text-secondary mt-0.5">Max Score: {selectedAssignment.max_score}</p>
              </div>

              {/* Submitted Content */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Submitted Work</span>
                {selectedSubmission.content_text && (
                  <p className="text-sm theme-text-primary leading-relaxed bg-slate-900/50 p-3.5 border theme-border rounded-xl whitespace-pre-wrap">{selectedSubmission.content_text}</p>
                )}
                {selectedSubmission.file_url && (
                  <a 
                    href={selectedSubmission.file_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    <FileText className="w-4 h-4" /> Download/View Submission File
                  </a>
                )}
              </div>

              {/* Grading Form */}
              <form onSubmit={handleGradeSubmit} className="space-y-4 pt-4 border-t theme-border">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold theme-text-secondary">Award Score</label>
                  <input 
                    type="number" 
                    max={selectedAssignment.max_score} 
                    min={0}
                    value={gradeScore}
                    onChange={(e) => setGradeScore(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary font-bold"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold theme-text-secondary">Teacher Feedback</label>
                  <textarea 
                    value={gradeFeedback} 
                    onChange={(e) => setGradeFeedback(e.target.value)}
                    placeholder="Provide constructive feedback for the student..." 
                    className="w-full h-28 px-4 py-2.5 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary resize-none"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5"
                >
                  <CheckCircle className="w-4.5 h-4.5" /> Submit Grade & Feedback
                </button>
              </form>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
