import { AlertTriangle, PlayCircle, Eye, Trash2, ShieldCheck, Flag } from 'lucide-react';

export default function ContentPage() {
  const contentReports = [
    { 
      id: 'REP-708', 
      lesson: 'Physics Form 4: Optics & Reflection', 
      teacher: 'Mwalimu Aisha Juma', 
      reporter: 'Gabriel J. (Student)',
      reason: 'Low audio levels in the second half of the video.', 
      severity: 'LOW',
      date: 'Today, 2:15 PM' 
    },
    { 
      id: 'REP-705', 
      lesson: 'Advanced Organic Chemistry', 
      teacher: 'Salum Sabri', 
      reporter: 'Anonymous (Student)',
      reason: 'Incorrect formula written at 14:22. The calculation contradicts NECTA syllabus guidelines.', 
      severity: 'HIGH',
      date: 'Yesterday' 
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Content Moderation & Reports</h1>
          <p className="text-slate-400 text-sm mt-1">Review flagged lessons, audit AI-generated summaries, and manage curriculum compliance.</p>
        </div>
        <div className="flex gap-2">
          <div className="glass-panel px-4 py-2 rounded-xl text-xs font-semibold border-white/5 text-slate-300 flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full badge-glow-red animate-pulse" />
            2 High Severity Reports
          </div>
        </div>
      </div>

      {/* Flagged Feed List */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-xl border-white/5">
        <div className="p-6 border-b border-white/5 bg-[#0d1223]/30 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Flag className="w-5 h-5 text-red-400" />
            Active Reports Queue
          </h2>
          <div className="flex gap-2">
            <select className="px-4 py-2 rounded-xl bg-[#090b16] border border-white/5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500">
              <option>All Severities</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {contentReports.map((report) => (
            <div key={report.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-white/5 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex-shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-bold text-slate-200 text-base">{report.lesson}</h3>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">{report.id}</span>
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full border ${
                      report.severity === 'HIGH' 
                        ? 'bg-red-500/10 text-red-400 border-red-500/20 badge-glow-red' 
                        : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 badge-glow-yellow'
                    }`}>
                      {report.severity}
                    </span>
                  </div>
                  
                  <div className="text-slate-400 text-sm max-w-2xl leading-relaxed">
                    "{report.reason}"
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 mt-2 flex-wrap">
                    <span>Teacher: <strong className="text-slate-300">{report.teacher}</strong></span>
                    <span className="text-slate-700">•</span>
                    <span>Flagged by: <strong className="text-slate-300">{report.reporter}</strong></span>
                    <span className="text-slate-700">•</span>
                    <span>{report.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 self-end md:self-center">
                <button className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all duration-200">
                  <Eye className="w-4 h-4" /> Review Video
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-emerald-400 hover:text-white bg-emerald-500/10 hover:bg-emerald-600 border border-emerald-500/20 hover:border-emerald-600 rounded-xl transition-all duration-200">
                  <ShieldCheck className="w-4 h-4" /> Dismiss Report
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-red-400 hover:text-white bg-red-500/10 hover:bg-red-600 border border-red-500/20 hover:border-red-600 rounded-xl transition-all duration-200">
                  <Trash2 className="w-4 h-4" /> Take Down
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
