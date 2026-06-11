'use client';

import { useState, useEffect } from 'react';
import { Library, Plus, Trash2, Edit2, Save, X, ChevronRight, Layers, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCourse, setActiveCourse] = useState<any | null>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [modulesLoading, setModulesLoading] = useState(false);

  // Form states for Course creation
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    title_sw: '',
    description: '',
    description_sw: '',
    subject: 'MATH',
    form_level: 'FORM_1',
    teacher_id: '',
    price_tsh: 0,
    is_free: false,
  });

  // Form states for Module creation
  const [showCreateModule, setShowCreateModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState('');

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError('');
      // In the real system, it lists courses via GET /courses
      const data = await apiRequest('courses');
      setCourses(data);
    } catch (err: any) {
      console.error(err);
      setError('Failed to load courses. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const loadCourseModules = async (course: any) => {
    setActiveCourse(course);
    setModulesLoading(true);
    try {
      const data = await apiRequest(`courses/${course.id}/modules`);
      setModules(data);
    } catch (err) {
      console.error(err);
    } finally {
      setModulesLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.teacher_id) {
      alert('Please provide a valid Teacher ID.');
      return;
    }
    try {
      await apiRequest('courses', {
        method: 'POST',
        body: JSON.stringify(newCourse),
      });
      setShowCreateCourse(false);
      setNewCourse({
        title: '',
        title_sw: '',
        description: '',
        description_sw: '',
        subject: 'MATH',
        form_level: 'FORM_1',
        teacher_id: '',
        price_tsh: 0,
        is_free: false,
      });
      fetchCourses();
    } catch (err: any) {
      alert(`Error creating course: ${err.message}`);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course? This will cascade delete all modules.')) return;
    try {
      await apiRequest(`courses/${id}`, { method: 'DELETE' });
      if (activeCourse?.id === id) {
        setActiveCourse(null);
        setModules([]);
      }
      fetchCourses();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCourse || !newModuleTitle.trim()) return;
    try {
      await apiRequest(`courses/${activeCourse.id}/modules`, {
        method: 'POST',
        body: JSON.stringify({ title: newModuleTitle }),
      });
      setNewModuleTitle('');
      setShowCreateModule(false);
      loadCourseModules(activeCourse);
    } catch (err: any) {
      alert(`Error adding module: ${err.message}`);
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Delete this module?')) return;
    try {
      await apiRequest(`courses/modules/${moduleId}`, { method: 'DELETE' });
      if (activeCourse) {
        loadCourseModules(activeCourse);
      }
    } catch (err: any) {
      alert(`Error deleting module: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold theme-text-primary tracking-tight flex items-center gap-2">
            <Library className="w-6 h-6 text-indigo-500" />
            Curriculum & Courses
          </h1>
          <p className="text-sm mt-1 theme-text-secondary">Manage curriculum levels, group lessons into structured modules, and structure course pathways.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchCourses} className="flex items-center gap-2 px-4 py-2.5 theme-item-bg theme-item-hover border theme-border theme-text-secondary hover:theme-text-primary text-sm font-semibold rounded-xl transition-all duration-200">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button onClick={() => setShowCreateCourse(true)} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all duration-200">
            <Plus className="w-4 h-4" /> New Course
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/25 rounded-2xl text-red-400">
          <AlertCircle className="w-5 h-5" /><span>{error}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Courses List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold theme-text-primary flex items-center gap-2">
            <Library className="w-5 h-5 text-indigo-400" /> Available Courses
          </h2>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <span className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-20 theme-text-secondary glass-panel rounded-3xl border theme-border">
              No courses found. Create one to get started!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((course) => (
                <div 
                  key={course.id} 
                  onClick={() => loadCourseModules(course)}
                  className={`glass-panel p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    activeCourse?.id === course.id ? 'border-indigo-500 bg-indigo-500/5' : 'theme-border hover:border-indigo-500/50'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400">
                        {course.subject} • {course.form_level.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-semibold theme-text-secondary">
                        {course.is_free ? 'Free' : `${course.price_tsh.toLocaleString()} TSh`}
                      </span>
                    </div>
                    <h3 className="font-bold theme-text-primary text-base line-clamp-1">{course.title}</h3>
                    {course.title_sw && <p className="text-xs italic theme-text-secondary line-clamp-1">{course.title_sw}</p>}
                    <p className="text-xs theme-text-secondary line-clamp-2 mt-1">{course.description || 'No description provided.'}</p>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t theme-border">
                    <span className="text-xs text-indigo-400 font-semibold flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5" /> {(course.modules || []).length} Modules
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCourse(course.id);
                      }} 
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modules & Lesson Breakdown */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold theme-text-primary flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" /> Course Modules & Lessons
          </h2>

          {!activeCourse ? (
            <div className="glass-panel p-8 rounded-2xl border theme-border text-center theme-text-secondary h-64 flex flex-col justify-center items-center">
              <BookOpen className="w-8 h-8 mb-2 text-indigo-500/50" />
              <span>Select a course from the list to view and manage its curriculum breakdown.</span>
            </div>
          ) : (
            <div className="glass-panel p-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 space-y-6">
              <div>
                <h3 className="font-bold theme-text-primary text-lg">{activeCourse.title}</h3>
                <p className="text-xs theme-text-secondary mt-1">Modules list ordered by placement index.</p>
              </div>

              {modulesLoading ? (
                <div className="flex justify-center items-center py-10">
                  <span className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : modules.length === 0 ? (
                <div className="text-center py-10 theme-text-secondary border border-dashed theme-border rounded-xl">
                  No modules added yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {modules.map((m) => (
                    <div key={m.id} className="p-4 theme-item-bg border theme-border rounded-xl space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-sm theme-text-primary flex items-center gap-1.5">
                          <Layers className="w-4 h-4 text-violet-400" /> {m.title}
                        </h4>
                        <button onClick={() => handleDeleteModule(m.id)} className="p-1 rounded text-red-400 hover:bg-red-500/10 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      
                      {/* Sub-lessons */}
                      <div className="space-y-1.5 pl-6 border-l theme-border">
                        {(m.lessons || []).length === 0 ? (
                          <span className="text-[10px] italic theme-text-secondary">No lessons in this module</span>
                        ) : (
                          m.lessons.map((lesson: any) => (
                            <div key={lesson.id} className="text-xs theme-text-secondary flex justify-between items-center py-0.5">
                              <span className="truncate flex items-center gap-1">
                                <ChevronRight className="w-3 h-3 text-indigo-500" /> {lesson.title}
                              </span>
                              <span className="text-[10px] theme-text-secondary flex-shrink-0">
                                {Math.round(lesson.duration_sec / 60)}m
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {showCreateModule ? (
                <form onSubmit={handleCreateModule} className="space-y-3 pt-3 border-t theme-border">
                  <input 
                    type="text" 
                    placeholder="Module Title (e.g. Chapter 1: Introduction)" 
                    value={newModuleTitle} 
                    onChange={(e) => setNewModuleTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-xs theme-text-primary"
                    required
                  />
                  <div className="flex gap-2 justify-end">
                    <button type="button" onClick={() => setShowCreateModule(false)} className="px-2.5 py-1 text-xs theme-text-secondary hover:theme-text-primary">
                      Cancel
                    </button>
                    <button type="submit" className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg">
                      Add
                    </button>
                  </div>
                </form>
              ) : (
                <button 
                  onClick={() => setShowCreateModule(true)} 
                  className="w-full py-2 border border-dashed border-indigo-500/30 hover:border-indigo-500/60 rounded-xl text-xs text-indigo-400 font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4.5 h-4.5" /> Add Module
                </button>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Create Course Modal */}
      {showCreateCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-panel border border-indigo-500/20 max-w-lg w-full rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold theme-text-primary flex items-center gap-2">
                <Library className="w-5 h-5 text-indigo-500" /> Create New Course Pathway
              </h3>
              <button onClick={() => setShowCreateCourse(false)} className="p-1 rounded-lg hover:bg-slate-800 theme-text-secondary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold theme-text-secondary">Course Title (English)</label>
                <input 
                  type="text" 
                  value={newCourse.title} 
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  placeholder="e.g. Complete Organic Chemistry" 
                  className="w-full px-4 py-2.5 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold theme-text-secondary">Course Title (Kiswahili)</label>
                <input 
                  type="text" 
                  value={newCourse.title_sw} 
                  onChange={(e) => setNewCourse({ ...newCourse, title_sw: e.target.value })}
                  placeholder="e.g. Kemia Organiki Kamili" 
                  className="w-full px-4 py-2.5 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold theme-text-secondary">Subject Area</label>
                  <select 
                    value={newCourse.subject} 
                    onChange={(e) => setNewCourse({ ...newCourse, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary"
                  >
                    <option value="MATH">Mathematics</option>
                    <option value="PHYSICS">Physics</option>
                    <option value="CHEMISTRY">Chemistry</option>
                    <option value="BIOLOGY">Biology</option>
                    <option value="ENGLISH">English</option>
                    <option value="KISWAHILI">Kiswahili</option>
                    <option value="HISTORY">History</option>
                    <option value="GEOGRAPHY">Geography</option>
                    <option value="ACCOUNTS">Accounts</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold theme-text-secondary">Form Level</label>
                  <select 
                    value={newCourse.form_level} 
                    onChange={(e) => setNewCourse({ ...newCourse, form_level: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary"
                  >
                    <option value="FORM_1">Form I</option>
                    <option value="FORM_2">Form II</option>
                    <option value="FORM_3">Form III</option>
                    <option value="FORM_4">Form IV</option>
                    <option value="FORM_5">Form V</option>
                    <option value="FORM_6">Form VI</option>
                    <option value="STD_7">Standard 7</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold theme-text-secondary">Teacher User ID</label>
                  <input 
                    type="text" 
                    value={newCourse.teacher_id} 
                    onChange={(e) => setNewCourse({ ...newCourse, teacher_id: e.target.value })}
                    placeholder="UUID of teacher account" 
                    className="w-full px-4 py-2.5 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold theme-text-secondary">Price (TSh)</label>
                  <input 
                    type="number" 
                    value={newCourse.price_tsh} 
                    onChange={(e) => setNewCourse({ ...newCourse, price_tsh: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <label className="flex items-center gap-2 text-sm theme-text-primary cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={newCourse.is_free} 
                    onChange={(e) => setNewCourse({ ...newCourse, is_free: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 bg-slate-900 border-slate-700"
                  />
                  Mark as Free Course
                </label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setShowCreateCourse(false)} className="px-4 py-2.5 text-sm font-semibold theme-text-secondary theme-item-bg border theme-border rounded-xl">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl">
                    Create Course
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
