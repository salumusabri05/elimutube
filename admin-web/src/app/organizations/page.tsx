'use client';

import { useState, useEffect } from 'react';
import { Building2, Plus, Users, Trash2, Mail, MapPin, X, PlusCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrg, setSelectedOrg] = useState<any | null>(null);
  const [orgDetails, setOrgDetails] = useState<any | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Form states for Organization creation
  const [showCreateOrg, setShowCreateOrg] = useState(false);
  const [newOrg, setNewOrg] = useState({
    name: '',
    country: 'TZ',
    city: '',
    contact_email: '',
    contact_phone: '',
    logo_url: '',
  });

  // Member management states
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberUserId, setNewMemberUserId] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('STUDENT');

  // Student Group states
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiRequest('organizations');
      setOrganizations(data);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch organizations. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrgDetails = async (org: any) => {
    setSelectedOrg(org);
    setDetailsLoading(true);
    try {
      const data = await apiRequest(`organizations/${org.id}`);
      setOrgDetails(data);
    } catch (err) {
      console.error(err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('organizations', {
        method: 'POST',
        body: JSON.stringify(newOrg),
      });
      setShowCreateOrg(false);
      setNewOrg({
        name: '',
        country: 'TZ',
        city: '',
        contact_email: '',
        contact_phone: '',
        logo_url: '',
      });
      fetchOrganizations();
    } catch (err: any) {
      alert(`Registration failed: ${err.message}`);
    }
  };

  const handleDeleteOrg = async (id: string) => {
    if (!confirm('Are you sure you want to delete this organization? All member associations and groups will be removed.')) return;
    try {
      await apiRequest(`organizations/${id}`, { method: 'DELETE' });
      if (selectedOrg?.id === id) {
        setSelectedOrg(null);
        setOrgDetails(null);
      }
      fetchOrganizations();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrg || !newMemberUserId.trim()) return;
    try {
      await apiRequest(`organizations/${selectedOrg.id}/members`, {
        method: 'POST',
        body: JSON.stringify({ user_id: newMemberUserId, role: newMemberRole }),
      });
      setNewMemberUserId('');
      setShowAddMember(false);
      fetchOrgDetails(selectedOrg);
    } catch (err: any) {
      alert(`Failed to add member: ${err.message}`);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!confirm('Remove this member from school?')) return;
    try {
      await apiRequest(`organizations/${selectedOrg.id}/members/${userId}`, { method: 'DELETE' });
      fetchOrgDetails(selectedOrg);
    } catch (err: any) {
      alert(`Failed to remove member: ${err.message}`);
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrg || !newGroupName.trim()) return;
    try {
      await apiRequest(`organizations/${selectedOrg.id}/groups`, {
        method: 'POST',
        body: JSON.stringify({ name: newGroupName, description: newGroupDescription }),
      });
      setNewGroupName('');
      setNewGroupDescription('');
      setShowCreateGroup(false);
      fetchOrgDetails(selectedOrg);
    } catch (err: any) {
      alert(`Failed to create classroom group: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold theme-text-primary tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-indigo-500" />
            Institutional B2B Portals
          </h1>
          <p className="text-sm mt-1 theme-text-secondary">Register partner schools, create student classrooms, allocate subscription plans, and manage licenses.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchOrganizations} className="flex items-center gap-2 px-4 py-2.5 theme-item-bg theme-item-hover border theme-border theme-text-secondary hover:theme-text-primary text-sm font-semibold rounded-xl transition-all duration-200">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button onClick={() => setShowCreateOrg(true)} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all duration-200">
            <Plus className="w-4 h-4" /> Register School
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/25 rounded-2xl text-red-400">
          <AlertCircle className="w-5 h-5" /><span>{error}</span>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Organization list */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-bold theme-text-primary flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-400" /> Partner Schools
          </h2>

          {loading ? (
            <div className="flex justify-center py-20">
              <span className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : organizations.length === 0 ? (
            <div className="text-center py-20 text-xs theme-text-secondary border border-dashed theme-border rounded-2xl">
              No registered schools found. Click Register School to add one.
            </div>
          ) : (
            <div className="space-y-3">
              {organizations.map((org) => (
                <div 
                  key={org.id}
                  onClick={() => fetchOrgDetails(org)}
                  className={`glass-panel p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    selectedOrg?.id === org.id ? 'border-indigo-500 bg-indigo-500/5' : 'theme-border hover:border-indigo-500/50'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                        {org.country}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteOrg(org.id);
                        }}
                        className="p-1 rounded text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="font-bold theme-text-primary text-sm line-clamp-1">{org.name}</h3>
                    <div className="space-y-1 mt-2">
                      <div className="flex items-center gap-1.5 text-xs theme-text-secondary">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400" /> {org.city || 'Tanzania'}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs theme-text-secondary">
                        <Mail className="w-3.5 h-3.5 text-indigo-400" /> {org.contact_email}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t theme-border text-xs theme-text-secondary">
                    <span>{org._count?.members || 0} members</span>
                    <span>{org._count?.groups || 0} classes</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Organization Member & Group details */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold theme-text-primary flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" /> Portal Controls
          </h2>

          {!selectedOrg ? (
            <div className="glass-panel p-8 rounded-2xl border theme-border text-center theme-text-secondary h-64 flex flex-col justify-center items-center">
              <Building2 className="w-8 h-8 mb-2 text-indigo-500/30" />
              <span>Select a partner school to manage its workspace portal.</span>
            </div>
          ) : detailsLoading ? (
            <div className="flex justify-center items-center py-20">
              <span className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Member Panel */}
              <div className="glass-panel p-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold theme-text-primary text-sm flex items-center gap-1.5">
                    <Users className="w-4.5 h-4.5 text-violet-400" /> Members list ({orgDetails?.members?.length || 0})
                  </h3>
                  <button onClick={() => setShowAddMember(true)} className="p-1 text-indigo-400 hover:underline text-xs flex items-center gap-0.5">
                    <Plus className="w-3.5 h-3.5" /> Add User
                  </button>
                </div>

                {showAddMember && (
                  <form onSubmit={handleAddMember} className="p-3.5 theme-item-bg border theme-border rounded-xl space-y-3">
                    <input 
                      type="text" 
                      placeholder="Enter User UUID" 
                      value={newMemberUserId}
                      onChange={(e) => setNewMemberUserId(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-xs theme-text-primary"
                      required
                    />
                    <select 
                      value={newMemberRole}
                      onChange={(e) => setNewMemberRole(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-xs theme-text-primary"
                    >
                      <option value="STUDENT">Student</option>
                      <option value="MANAGER">Teacher/Manager</option>
                      <option value="ADMIN">Admin Coordinator</option>
                    </select>
                    <div className="flex justify-end gap-2 text-[10px]">
                      <button type="button" onClick={() => setShowAddMember(false)} className="theme-text-secondary">Cancel</button>
                      <button type="submit" className="px-2.5 py-1 bg-indigo-600 text-white rounded font-semibold">Add Member</button>
                    </div>
                  </form>
                )}

                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                  {orgDetails?.members?.map((m: any) => (
                    <div key={m.id} className="p-3 theme-item-bg border theme-border rounded-xl flex justify-between items-center">
                      <div>
                        <p className="font-bold text-xs theme-text-primary">{m.user?.display_name || 'Anonymous'}</p>
                        <p className="text-[10px] theme-text-secondary">{m.user?.email || 'No email'}</p>
                        <span className="text-[9px] font-bold text-indigo-400 uppercase">{m.role}</span>
                      </div>
                      <button onClick={() => handleRemoveMember(m.user_id)} className="p-1 rounded text-red-400 hover:bg-red-500/10 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Classroom Group Panel */}
              <div className="glass-panel p-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold theme-text-primary text-sm flex items-center gap-1.5">
                    <Building2 className="w-4.5 h-4.5 text-violet-400" /> Classroom Groups ({orgDetails?.groups?.length || 0})
                  </h3>
                  <button onClick={() => setShowCreateGroup(true)} className="p-1 text-indigo-400 hover:underline text-xs flex items-center gap-0.5">
                    <Plus className="w-3.5 h-3.5" /> New Group
                  </button>
                </div>

                {showCreateGroup && (
                  <form onSubmit={handleCreateGroup} className="p-3.5 theme-item-bg border theme-border rounded-xl space-y-3">
                    <input 
                      type="text" 
                      placeholder="Class Name (e.g. Form I A)" 
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-xs theme-text-primary"
                      required
                    />
                    <input 
                      type="text" 
                      placeholder="Brief description (optional)" 
                      value={newGroupDescription}
                      onChange={(e) => setNewGroupDescription(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-xs theme-text-primary"
                    />
                    <div className="flex justify-end gap-2 text-[10px]">
                      <button type="button" onClick={() => setShowCreateGroup(false)} className="theme-text-secondary">Cancel</button>
                      <button type="submit" className="px-2.5 py-1 bg-indigo-600 text-white rounded font-semibold">Create Group</button>
                    </div>
                  </form>
                )}

                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                  {orgDetails?.groups?.map((g: any) => (
                    <div key={g.id} className="p-3 theme-item-bg border theme-border rounded-xl space-y-1">
                      <h4 className="font-bold text-xs theme-text-primary">{g.name}</h4>
                      {g.description && <p className="text-[10px] theme-text-secondary">{g.description}</p>}
                      <span className="text-[9px] font-bold text-indigo-400 uppercase">{g._count?.members || 0} students assigned</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>

      {/* Register Organization Modal */}
      {showCreateOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-panel border border-indigo-500/20 max-w-lg w-full rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold theme-text-primary flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-500" /> Register Partner School
              </h3>
              <button onClick={() => setShowCreateOrg(false)} className="p-1 rounded-lg hover:bg-slate-800 theme-text-secondary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrg} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold theme-text-secondary">School Name</label>
                <input 
                  type="text" 
                  value={newOrg.name} 
                  onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
                  placeholder="e.g. Jangwani Secondary School" 
                  className="w-full px-4 py-2.5 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold theme-text-secondary">City</label>
                  <input 
                    type="text" 
                    value={newOrg.city} 
                    onChange={(e) => setNewOrg({ ...newOrg, city: e.target.value })}
                    placeholder="e.g. Dar es Salaam" 
                    className="w-full px-4 py-2.5 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold theme-text-secondary">Country</label>
                  <input 
                    type="text" 
                    value={newOrg.country} 
                    onChange={(e) => setNewOrg({ ...newOrg, country: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold theme-text-secondary">Contact Email</label>
                  <input 
                    type="email" 
                    value={newOrg.contact_email} 
                    onChange={(e) => setNewOrg({ ...newOrg, contact_email: e.target.value })}
                    placeholder="e.g. admin@jangwani.sc.tz" 
                    className="w-full px-4 py-2.5 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold theme-text-secondary">Contact Phone</label>
                  <input 
                    type="text" 
                    value={newOrg.contact_phone} 
                    onChange={(e) => setNewOrg({ ...newOrg, contact_phone: e.target.value })}
                    placeholder="e.g. +255 712 345 678" 
                    className="w-full px-4 py-2.5 rounded-xl theme-item-bg border theme-border focus:outline-none focus:border-indigo-500 text-sm theme-text-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowCreateOrg(false)} className="px-4 py-2.5 text-sm font-semibold theme-text-secondary theme-item-bg border theme-border rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl">
                  Register Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
