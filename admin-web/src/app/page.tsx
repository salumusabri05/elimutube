import { Users, Video, CreditCard, Activity, ArrowUpRight, Award, Flame, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { 
      title: 'Verified Teachers', 
      value: '1,234', 
      change: '+12% this month', 
      icon: Award, 
      color: 'text-violet-400', 
      glow: 'shadow-violet-500/10',
      chartPath: "M 0 20 Q 20 5 40 15 T 80 5 T 120 18 T 160 8"
    },
    { 
      title: 'Active Students', 
      value: '45.2K', 
      change: '+28% this month', 
      icon: Users, 
      color: 'text-blue-400', 
      glow: 'shadow-blue-500/10',
      chartPath: "M 0 18 Q 20 10 40 5 T 80 15 T 120 5 T 160 2"
    },
    { 
      title: 'Published Lessons', 
      value: '8,439', 
      change: '+8% this week', 
      icon: Video, 
      color: 'text-indigo-400', 
      glow: 'shadow-indigo-500/10',
      chartPath: "M 0 15 Q 20 18 40 10 T 80 20 T 120 12 T 160 5"
    },
    { 
      title: 'Platform Volume', 
      value: 'TSh 14.2M', 
      change: '+15.4% vs last mo', 
      icon: CreditCard, 
      color: 'text-emerald-400', 
      glow: 'shadow-emerald-500/10',
      chartPath: "M 0 20 Q 20 15 40 8 T 80 5 T 120 2 T 160 0"
    },
  ];

  const verificationRequests = [
    { name: 'Mwalimu Mussa Ramadhani', subject: 'Mathematics (NECTA Form IV)', docs: 'Degree & NECTA ID', date: 'Just now' },
    { name: 'Amina Selemani', subject: 'Chemistry & Biology', docs: 'Diploma Certificate', date: '10 mins ago' },
    { name: 'Dr. Josephat Mrema', subject: 'Physics (ACSEE Form VI)', docs: 'PhD & Academic Transcripts', date: '2 hours ago' },
  ];

  const recentTransactions = [
    { id: 'TXN-9018', user: 'Said Hamis', amount: 'TSh 15,000', plan: 'Monthly Premium Pack', method: 'M-PESA', status: 'Success' },
    { id: 'TXN-9017', user: 'Neema John', amount: 'TSh 5,000', plan: 'Single Lesson Pay', method: 'Tigo Pesa', status: 'Success' },
    { id: 'TXN-9016', user: 'Baraka Lazaro', amount: 'TSh 20,000', plan: 'Live Class Ticket', method: 'Airtel Money', status: 'Success' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-[#0e122b] to-[#120f2b] p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-400">
            <Flame className="w-4 h-4 animate-bounce text-amber-500" />
            System Live Status
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            ElimuTube Control Hub
          </h1>
          <p className="text-slate-400 max-w-md text-sm leading-relaxed">
            Real-time control over verification flows, ledger entries, Agora classroom channels, and Content Service audits.
          </p>
        </div>
        <div className="relative z-10 flex gap-3">
          <div className="glass-panel px-4 py-3 rounded-2xl flex flex-col justify-center border-white/5">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Gateway Load</span>
            <span className="text-sm font-bold text-emerald-400 mt-0.5">Optimal (14ms)</span>
          </div>
          <div className="glass-panel px-4 py-3 rounded-2xl flex flex-col justify-center border-white/5">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Active Streams</span>
            <span className="text-sm font-bold text-indigo-400 mt-0.5">42 Agora Channels</span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between shadow-lg relative overflow-hidden group">
            {/* Ambient background light */}
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/5 to-transparent rounded-bl-full pointer-events-none group-hover:from-indigo-500/10 transition-all duration-300`} />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-400">{stat.title}</span>
              <div className={`p-2.5 rounded-xl bg-white/5 ${stat.color} border border-white/5`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            
            <div className="mt-4 flex items-end justify-between">
              <div>
                <span className="text-3xl font-extrabold text-white tracking-tight">{stat.value}</span>
                <span className="block text-[11px] font-medium text-slate-500 mt-1">{stat.change}</span>
              </div>

              {/* Aesthetic Sparkline SVG */}
              <div className="w-24 h-12">
                <svg className="w-full h-full" viewBox="0 0 160 30" fill="none">
                  <path 
                    d={stat.chartPath}
                    stroke="url(#sparkline-grad)" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                  <defs>
                    <linearGradient id="sparkline-grad" x1="0" y1="0" x2="160" y2="0">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Verification Queue Panel */}
        <div className="glass-panel p-6 rounded-3xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Pending Verifications</h2>
              <p className="text-xs text-slate-500 mt-0.5">Verification requests from teacher candidates</p>
            </div>
            <button className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
              View Audit Queue <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-4">
            {verificationRequests.map((req, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-200">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#1b1e35] to-[#252a4e] flex items-center justify-center font-bold text-indigo-400 border border-indigo-500/10">
                    {req.name.charAt(8)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{req.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{req.subject}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="text-[10px] text-slate-500 font-medium">{req.date}</span>
                  <button className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 shadow-md shadow-indigo-600/10 transition-colors">
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Ledger / Transaction Feed */}
        <div className="glass-panel p-6 rounded-3xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Payment Ledger Feed</h2>
              <p className="text-xs text-slate-500 mt-0.5">Selcom STK pushes and ledger state updates</p>
            </div>
            <button className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
              Open Ledger <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-4">
            {recentTransactions.map((tx, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-200">
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-200">{tx.user}</span>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">{tx.id}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{tx.plan} via {tx.method}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="text-sm font-bold text-slate-200">{tx.amount}</span>
                  <span className="px-2 py-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 rounded-full border border-emerald-500/20 badge-glow-green">
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
