import { CheckCircle, XCircle, Clock, Eye, Download, ShieldAlert } from 'lucide-react';

export default function TeachersPage() {
  const teachers = [
    { 
      id: 'TCH-201', 
      name: 'Mwalimu Aisha Juma', 
      email: 'aisha.j@elimutube.ac.tz',
      subjects: ['Biology', 'Chemistry'], 
      level: 'Form IV & VI', 
      status: 'PENDING',
      docs: [
        { name: 'University Degree (UDSM).pdf', size: '2.4 MB' },
        { name: 'NECTA Teaching License.jpg', size: '1.1 MB' }
      ]
    },
    { 
      id: 'TCH-102', 
      name: 'Salum Sabri', 
      email: 'salum.sabri@elimutube.ac.tz',
      subjects: ['Physics', 'Mathematics'], 
      level: 'Form II & IV', 
      status: 'APPROVED',
      docs: [
        { name: 'B.Sc Education (UDOM).pdf', size: '3.1 MB' }
      ]
    },
    { 
      id: 'TCH-089', 
      name: 'Josephat Mrema', 
      email: 'j.mrema@elimutube.ac.tz',
      subjects: ['Geography', 'History'], 
      level: 'Form I-IV', 
      status: 'REJECTED',
      docs: [
        { name: 'National ID copy.pdf', size: '890 KB' }
      ]
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Teacher Control Panel</h1>
          <p className="text-slate-400 text-sm mt-1">Audit verification documents, manage teacher profiles, and handle subject assignments.</p>
        </div>
        <div className="flex gap-3">
          <div className="glass-panel px-4 py-2 rounded-xl text-xs font-semibold border-white/5 text-slate-300 flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full badge-glow-yellow animate-pulse" />
            14 Pending Verifications
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-xl border-white/5">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-[#0d1223]/30">
          <h2 className="text-lg font-bold text-white">Teacher Registration Queue</h2>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Filter by name or subject..."
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 focus:outline-none focus:border-indigo-500 text-sm text-white placeholder-slate-500 w-64"
            />
            <select className="px-4 py-2 rounded-xl bg-[#090b16] border border-white/5 focus:outline-none focus:border-indigo-500 text-sm text-slate-300">
              <option>All Statuses</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-white/5 bg-[#090b16]/30 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Mwalimu (Teacher)</th>
                <th className="px-6 py-4">Specialization</th>
                <th className="px-6 py-4">Verification Documents</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {teachers.map((t) => (
                <tr key={t.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1b1e35] to-[#252a4e] flex items-center justify-center font-bold text-indigo-400 border border-indigo-500/10">
                        {t.name.split(' ').pop()?.charAt(0) || 'M'}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-200">{t.name}</div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">{t.id} • {t.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-slate-200 font-medium">{t.subjects.join(', ')}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{t.level}</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-1.5">
                      {t.docs.map((doc, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-400 hover:text-indigo-400 cursor-pointer transition-colors">
                          <Eye className="w-3.5 h-3.5" />
                          <span className="underline decoration-slate-600 underline-offset-2">{doc.name}</span>
                          <span className="text-[10px] text-slate-600 font-mono">({doc.size})</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      t.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 badge-glow-green' :
                      t.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 badge-glow-yellow' :
                      'bg-red-500/10 text-red-400 border-red-500/20 badge-glow-red'
                    }`}>
                      {t.status === 'APPROVED' && <CheckCircle className="w-3.5 h-3.5" />}
                      {t.status === 'PENDING' && <Clock className="w-3.5 h-3.5" />}
                      {t.status === 'REJECTED' && <XCircle className="w-3.5 h-3.5" />}
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-right text-xs font-semibold space-x-2">
                    <button className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-slate-200 transition-colors">
                      Audit
                    </button>
                    {t.status === 'PENDING' && (
                      <>
                        <button className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/10 transition-colors">
                          Approve
                        </button>
                        <button className="px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600 border border-red-500/20 text-red-400 hover:text-white transition-all duration-200">
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
