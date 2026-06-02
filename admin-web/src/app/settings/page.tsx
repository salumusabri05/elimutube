'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, Shield, Key, Sliders, CheckCircle, Database } from 'lucide-react';

export default function SettingsPage() {
  const [success, setSuccess] = useState(false);
  
  // Settings Form State
  const [agoraAppId, setAgoraAppId] = useState('4ab82910cde839201fba293028e');
  const [agoraCert, setAgoraCert] = useState('********************************');
  const [selcomMerchant, setSelcomMerchant] = useState('SELCOM_MERCH_0921');
  const [selcomApiKey, setSelcomApiKey] = useState('********************************');
  const [platformFee, setPlatformFee] = useState(30);
  const [muxTokenId, setMuxTokenId] = useState('mux-token-id-elimu-2026');
  const [dbBackupInterval, setDbBackupInterval] = useState('Daily');

  useEffect(() => {
    // Load existing settings if configured
    const savedFee = localStorage.getItem('platform_fee');
    if (savedFee) setPlatformFee(Number(savedFee));

    const savedAgora = localStorage.getItem('agora_app_id');
    if (savedAgora) setAgoraAppId(savedAgora);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    localStorage.setItem('platform_fee', String(platformFee));
    localStorage.setItem('agora_app_id', agoraAppId);

    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold theme-text-primary tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-500" />
            Global Platform Settings
          </h1>
          <p className="text-sm mt-1 theme-text-secondary">Configure Agora API keys, Selcom payment credentials, revenue splits, and database backups.</p>
        </div>
      </div>

      {success && (
        <div className="flex items-center gap-2 p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl text-emerald-400">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>Settings successfully updated and applied!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* API & Keys panel */}
        <div className="glass-panel rounded-3xl p-6 border theme-border space-y-6">
          <h2 className="text-lg font-bold theme-text-primary flex items-center gap-2 border-b theme-border pb-4">
            <Key className="w-5 h-5 text-indigo-400" /> Integration Credentials
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold theme-text-secondary">Agora App ID</label>
              <input 
                type="text" 
                value={agoraAppId}
                onChange={(e) => setAgoraAppId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold theme-text-secondary">Agora Primary Certificate</label>
              <input 
                type="password" 
                value={agoraCert}
                onChange={(e) => setAgoraCert(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold theme-text-secondary">Selcom Aggregator Merchant ID</label>
              <input 
                type="text" 
                value={selcomMerchant}
                onChange={(e) => setSelcomMerchant(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold theme-text-secondary">Selcom Secret API Key</label>
              <input 
                type="password" 
                value={selcomApiKey}
                onChange={(e) => setSelcomApiKey(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary font-mono"
              />
            </div>
          </div>
        </div>

        {/* Ledger Splits */}
        <div className="glass-panel rounded-3xl p-6 border theme-border space-y-6">
          <h2 className="text-lg font-bold theme-text-primary flex items-center gap-2 border-b theme-border pb-4">
            <Sliders className="w-5 h-5 text-indigo-400" /> Platform Split Rates
          </h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="theme-text-secondary">Platform Revenue Share Fee</span>
                <span className="text-indigo-400">{platformFee}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={platformFee}
                onChange={(e) => setPlatformFee(Number(e.target.value))}
                className="w-full accent-indigo-500 bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-[11px] theme-text-secondary mt-1">
                The percentage of course subscriptions that ElimuTube retains. Teachers receive the remaining {100 - platformFee}%.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold theme-text-secondary">Mux Token ID</label>
              <input 
                type="text" 
                value={muxTokenId}
                onChange={(e) => setMuxTokenId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary font-mono"
              />
            </div>
          </div>
        </div>

        {/* Database backup settings */}
        <div className="glass-panel rounded-3xl p-6 border theme-border space-y-6">
          <h2 className="text-lg font-bold theme-text-primary flex items-center gap-2 border-b theme-border pb-4">
            <Database className="w-5 h-5 text-indigo-400" /> Database & Backup Policies
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold theme-text-secondary">Prisma Database Type</label>
              <input 
                type="text" 
                value="PostgreSQL (Hosted on Railway)" 
                disabled 
                className="w-full px-4 py-2.5 rounded-xl theme-item-bg border theme-border text-sm theme-text-secondary font-mono opacity-60"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold theme-text-secondary">Backup Schedule Interval</label>
              <select
                value={dbBackupInterval}
                onChange={(e) => setDbBackupInterval(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#090b16] border theme-border text-sm theme-text-secondary focus:outline-none focus:border-indigo-500"
              >
                <option value="Hourly">Every Hour</option>
                <option value="Daily">Daily at Midnight (00:00 UTC)</option>
                <option value="Weekly">Weekly (Sunday)</option>
                <option value="Never">No Auto Backups</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Trigger */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/10 transition-colors text-sm"
          >
            <Save className="w-4 h-4" /> Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
