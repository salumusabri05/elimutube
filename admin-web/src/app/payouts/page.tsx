import { Download, Search, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function PayoutsPage() {
  const payouts = [
    { id: 'PO-9201', teacher: 'Mwalimu Aisha Juma', period: 'May 2026', gross: 'TSh 450,000', net: 'TSh 315,000', fee: 'TSh 135,000', status: 'SETTLED' },
    { id: 'PO-9202', teacher: 'Salum Sabri', period: 'May 2026', gross: 'TSh 120,000', net: 'TSh 84,000', fee: 'TSh 36,000', status: 'PROCESSING' },
    { id: 'PO-9203', teacher: 'Josephat Mrema', period: 'May 2026', gross: 'TSh 850,000', net: 'TSh 595,000', fee: 'TSh 255,000', status: 'FAILED' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Teacher Payout Management</h1>
          <p className="text-slate-400 text-sm mt-1">Audit billing settlements, process Selcom Aggregator payouts, and balance platform ledger splits.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 text-slate-200 text-sm font-semibold rounded-xl transition-all duration-200">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/10 transition-colors">
            Process All Pending
          </button>
        </div>
      </div>

      {/* Main Ledger Table */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-xl border-white/5">
        <div className="p-6 border-b border-white/5 bg-[#0d1223]/30 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          <h2 className="text-lg font-bold text-white">Monthly Settled Receipts</h2>
          <div className="flex gap-2">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search teacher name..."
                className="pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/5 focus:outline-none focus:border-indigo-500 text-sm text-white placeholder-slate-500 w-64"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>
            <select className="px-4 py-2 rounded-xl bg-[#090b16] border border-white/5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500">
              <option>All Statuses</option>
              <option>Settled</option>
              <option>Processing</option>
              <option>Failed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-white/5 bg-[#090b16]/30 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Ref ID</th>
                <th className="px-6 py-4">Mwalimu (Teacher)</th>
                <th className="px-6 py-4">Period</th>
                <th className="px-6 py-4">Gross Revenue</th>
                <th className="px-6 py-4">Platform Share (30%)</th>
                <th className="px-6 py-4">Net Payout (70%)</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {payouts.map((p) => (
                <tr key={p.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-5 whitespace-nowrap text-xs font-mono text-slate-400">{p.id}</td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="font-semibold text-slate-200">{p.teacher}</div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-slate-400">{p.period}</td>
                  <td className="px-6 py-5 whitespace-nowrap font-medium text-slate-300">{p.gross}</td>
                  <td className="px-6 py-5 whitespace-nowrap text-red-400 font-medium">-{p.fee}</td>
                  <td className="px-6 py-5 whitespace-nowrap text-emerald-400 font-bold">{p.net}</td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      p.status === 'SETTLED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 badge-glow-green' :
                      p.status === 'PROCESSING' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 badge-glow-blue' :
                      'bg-red-500/10 text-red-400 border-red-500/20 badge-glow-red'
                    }`}>
                      {p.status === 'SETTLED' && <CheckCircle className="w-3.5 h-3.5" />}
                      {p.status === 'PROCESSING' && <Clock className="w-3.5 h-3.5" />}
                      {p.status === 'FAILED' && <AlertCircle className="w-3.5 h-3.5" />}
                      {p.status}
                    </span>
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
