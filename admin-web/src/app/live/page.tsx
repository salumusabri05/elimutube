'use client';

import { useState, useEffect } from 'react';
import { Video, Plus, Calendar, Users, ShieldAlert, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function LivePage() {
  const [liveClasses, setLiveClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal states for Scheduling
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('MATH');
  const [formLevel, setFormLevel] = useState('FORM_1');
  const [scheduledAt, setScheduledAt] = useState('');
  const [maxAttendees, setMaxAttendees] = useState(100);
  const [priceTsh, setPriceTsh] = useState(5000);
  const [teacherId, setTeacherId] = useState('');

  const fetchLiveClasses = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiRequest('database/tables/liveClass');
      // Sort by scheduled time
      data.sort((a: any, b: any) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());
      setLiveClasses(data);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch scheduled live classes feed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveClasses();
  }, []);

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !scheduledAt) {
      alert('Please fill out Title and Date/Time.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Get teacher profile to associate
      let targetTeacherId = teacherId;
      if (!targetTeacherId) {
        const users = await apiRequest('database/tables/user');
        const teacher = users.find((u: any) => u.roles.includes('TEACHER'));
        if (!teacher) {
          throw new Error('No teachers exist in the system to assign this live class to.');
        }
        targetTeacherId = teacher.id;
      }

      const randomChannel = `class-channel-${Math.floor(1000 + Math.random() * 9000)}`;

      await apiRequest('database/tables/liveClass', {
        method: 'POST',
        body: JSON.stringify({
          title,
          subject,
          form_level: formLevel,
          scheduled_at: new Date(scheduledAt).toISOString(),
          max_attendees: Number(maxAttendees),
          price_tsh: Number(priceTsh),
          agora_channel: randomChannel,
          status: 'SCHEDULED',
          teacher_id: targetTeacherId,
        }),
      });

      setIsModalOpen(false);
      setTitle('');
      setScheduledAt('');
      fetchLiveClasses();
    } catch (err: any) {
      setError(`Failed to schedule class: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold theme-text-primary tracking-tight flex items-center gap-2">
            <Video className="w-6 h-6 text-indigo-500" />
            Live Classroom Sessions
          </h1>
          <p className="text-sm mt-1 theme-text-secondary">Monitor Agora WebRTC streaming channels, review live attendance levels, and manage curriculum schedules.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/10 transition-colors"
        >
          <Plus className="w-4 h-4" /> Schedule Session
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/25 rounded-2xl text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Live Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && liveClasses.length === 0 ? (
          <div className="col-span-full flex justify-center items-center py-20">
            <span className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : liveClasses.length === 0 ? (
          <div className="col-span-full text-center py-20 theme-text-secondary glass-panel rounded-3xl border theme-border">
            No live classroom sessions found.
          </div>
        ) : (
          liveClasses.map((c) => (
            <div key={c.id} className="glass-panel rounded-3xl p-6 border theme-border space-y-4 hover:shadow-lg transition-all duration-300">
              <div className="flex justify-between items-start">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  c.status === 'LIVE' ? 'bg-red-500/10 text-red-400 border-red-500/20 badge-glow-red animate-pulse' :
                  c.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  'bg-blue-500/10 text-blue-400 border-blue-500/20'
                }`}>
                  {c.status}
                </span>
                <span className="text-[10px] font-mono theme-text-secondary">{c.agora_channel || 'No Channel'}</span>
              </div>

              <div>
                <h3 className="font-bold theme-text-primary text-lg truncate" title={c.title}>{c.title}</h3>
                <div className="flex gap-2 mt-1 text-[11px] font-semibold">
                  <span className="text-indigo-400">{c.subject}</span>
                  <span className="theme-text-secondary">•</span>
                  <span className="theme-text-secondary">{c.form_level.replace('_', ' ')}</span>
                </div>
              </div>

              <div className="pt-4 border-t theme-border grid grid-cols-2 gap-4 text-xs theme-text-secondary">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <div>
                    <div className="font-bold theme-text-primary">Scheduled At</div>
                    <div>{new Date(c.scheduled_at).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <div>
                    <div className="font-bold theme-text-primary">Max Audience</div>
                    <div>{c.max_attendees || 'Unlimited'}</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="text-sm font-bold text-emerald-400">
                  {c.price_tsh === 0 ? 'Free Event' : `TSh ${c.price_tsh.toLocaleString()}`}
                </div>
                {c.status === 'SCHEDULED' && (
                  <button 
                    onClick={() => alert(`Starting Live Class Agora Channel: ${c.agora_channel}`)}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow transition-colors"
                  >
                    Go Live Now
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* CRUD Modal for Scheduling Live Session */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-3xl overflow-hidden border theme-border shadow-2xl">
            <div className="p-6 border-b theme-border flex justify-between items-center bg-slate-100/50 dark:bg-[#0d1223]/30">
              <h3 className="text-lg font-bold theme-text-primary flex items-center gap-2">
                <Video className="w-5 h-5 text-indigo-400" /> Schedule Live Classroom
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-slate-300 p-1 rounded-lg theme-item-hover"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSchedule} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold theme-text-secondary">Classroom Title / Subject Topic</label>
                <input 
                  type="text" 
                  placeholder="e.g. Advanced Calculus & Limits"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold theme-text-secondary">Subject Area</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#090b16] border theme-border text-sm theme-text-secondary focus:outline-none"
                  >
                    {['MATH', 'PHYSICS', 'CHEMISTRY', 'BIOLOGY', 'ENGLISH', 'KISWAHILI', 'HISTORY', 'GEOGRAPHY', 'ACCOUNTS'].map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold theme-text-secondary">Form Level</label>
                  <select
                    value={formLevel}
                    onChange={(e) => setFormLevel(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#090b16] border theme-border text-sm theme-text-secondary focus:outline-none"
                  >
                    {['FORM_1', 'FORM_2', 'FORM_3', 'FORM_4', 'FORM_5', 'FORM_6', 'STD_1', 'STD_2', 'STD_3', 'STD_4', 'STD_5', 'STD_6', 'STD_7'].map(lvl => (
                      <option key={lvl} value={lvl}>{lvl.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold theme-text-secondary">Schedule Time & Date</label>
                <input 
                  type="datetime-local" 
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold theme-text-secondary">Price (TSh)</label>
                  <input 
                    type="number" 
                    value={priceTsh}
                    onChange={(e) => setPriceTsh(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold theme-text-secondary">Max Attendees</label>
                  <input 
                    type="number" 
                    value={maxAttendees}
                    onChange={(e) => setMaxAttendees(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary"
                  />
                </div>
              </div>

              <div className="p-6 border-t theme-border flex justify-end gap-3 -mx-6 -mb-6 bg-slate-100/50 dark:bg-[#0d1223]/30">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 theme-item-bg border theme-border theme-text-secondary hover:theme-text-primary font-semibold rounded-xl text-sm hover:theme-item-hover transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-indigo-600/10 transition-colors"
                >
                  {loading ? 'Scheduling...' : 'Schedule Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
