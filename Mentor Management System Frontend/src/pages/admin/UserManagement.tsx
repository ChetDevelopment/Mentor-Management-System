/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { User } from '../../types';
import { Shield, ShieldAlert, Trash2, Key, RefreshCcw, Search, UserPlus } from 'lucide-react';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [feedback, setFeedback] = useState('');

  // Password reset dialog state
  const [resetTargetUser, setResetTargetUser] = useState<User | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching admin users.', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleBan = async (u: User) => {
    const nextBanState = !u.isBanned;
    try {
      await api.patch(`/admin/users/${u.id}`, { isBanned: nextBanState });
      setFeedback(`Status modified: User ${u.firstName} is now ${nextBanState ? 'BANNED' : 'ACTIVE'}.`);
      setTimeout(() => setFeedback(''), 2500);
      loadUsers();
    } catch (err) {
      alert('Failed updating ban state.');
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete user record ${name}?`)) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setFeedback(`User ${name} removed from registry.`);
      setTimeout(() => setFeedback(''), 2500);
      loadUsers();
    } catch (err) {
      alert('Failed removing user record.');
    }
  };

  const handleSimulatePassReset = (u: User) => {
    setResetTargetUser(u);
  };

  const handleCommitPassReset = () => {
    if (!resetTargetUser) return;
    setFeedback(`Security passcode reset successfully for ${resetTargetUser.firstName}. Temporary lock passcode: ChangeMe123!`);
    setResetTargetUser(null);
    setTimeout(() => setFeedback(''), 4000);
  };

  const filteredUsers = users.filter(u => {
    const nameMatch = `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const roleMatch = u.role.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || emailMatch || roleMatch;
  });

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-5 h-5 border-2 border-slate-700 border-t-teal-400 rounded-full animate-spin mb-3"></div>
        <p className="text-xs font-mono text-slate-500">RETRIEVING PLATFORM IDENTITIES...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in" id="admin-users-root">
      
      {/* TITLE BLOCKS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">User Operations Registry</h1>
          <p className="text-xs text-slate-400 font-mono mt-1">PLATFORM RESIDENT MATRIX AND SUSPENSION SYSTEMS</p>
        </div>

        <button
          onClick={() => {
            // Seed a randomized standard user
            const mockEmail = `learner.${Math.floor(Math.random()*1000)}@mentorkhet.com`;
            api.post('/auth/register', {
              role: 'MENTEE',
              email: mockEmail,
              firstName: 'Simulated',
              lastName: 'User',
              phone: '+880199999999',
              interests: 'React Testing',
              learningGoals: 'Understand Docker clusters'
            }).then(() => {
              setFeedback(`Mock Mentee ${mockEmail} generated successfully.`);
              setTimeout(() => setFeedback(''), 2500);
              loadUsers();
            });
          }}
          className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-4 py-2 rounded text-xs font-mono font-bold flex items-center justify-center gap-1.5 focus:outline-none"
        >
          <UserPlus size={14} />
          <span>SIMULATE USER INFLUX</span>
        </button>
      </div>

      {feedback && (
        <div className="bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs px-3 py-2 rounded font-mono" id="users-feedback-alert">
          {feedback}
        </div>
      )}

      {/* FILTER PANEL */}
      <div className="bg-slate-900 border border-slate-800 rounded p-4">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
            <Search size={15} />
          </span>
          <input
            type="text"
            placeholder="Search matching residents by name, role, email address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-teal-400 rounded pl-9 pr-4 py-2 text-xs font-mono text-slate-200 outline-none transition-colors placeholder:text-slate-700"
            id="user-search-box"
          />
        </div>
      </div>

      {/* STAKEHOLDER REGISTRY LIST */}
      <div className="bg-slate-900 border border-slate-800 rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 font-mono border-b border-slate-800">
                <th className="p-4 uppercase tracking-wider text-[10px]">Resident Profile</th>
                <th className="p-4 uppercase tracking-wider text-[10px]">Security Email</th>
                <th className="p-4 uppercase tracking-wider text-[10px]">Access Core Role</th>
                <th className="p-4 uppercase tracking-wider text-[10px]">Status Flags</th>
                <th className="p-4 uppercase tracking-wider text-[10px] text-right">System Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-855" id="user-rows-body">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-950/20 transition-colors">
                  
                  {/* User image and name info */}
                  <td className="p-4 flex items-center gap-3">
                    <img 
                      src={u.avatar} 
                      alt={u.firstName} 
                      className="w-8 h-8 rounded bg-slate-800 object-cover border border-slate-800"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <p className="font-bold text-slate-200">{u.firstName} {u.lastName}</p>
                      <p className="text-[10px] text-slate-500 font-mono">ID: {u.id}</p>
                    </div>
                  </td>

                  {/* Mail details */}
                  <td className="p-4 font-mono text-slate-400 select-all">{u.email}</td>

                  {/* Access role */}
                  <td className="p-4">
                    <span className={`text-[10px] font-semibold font-mono tracking-wider px-2 py-0.5 border rounded uppercase ${
                      u.role === 'ADMIN' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                      u.role === 'MENTOR' ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' :
                      'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {u.role}
                    </span>
                  </td>

                  {/* Account state status locks */}
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase ${
                      u.isBanned ? 'text-rose-400 font-bold' : 'text-slate-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${u.isBanned ? 'bg-rose-500' : 'bg-teal-500'}`}></span>
                      {u.isBanned ? 'SUSPENDED LOCK' : 'ACTIVE CORE'}
                    </span>
                  </td>

                  {/* Mutate control functions */}
                  <td className="p-4 text-right space-x-1 whitespace-nowrap">
                    {u.id !== 'usr-admin' && (
                      <>
                        <button
                          onClick={() => handleToggleBan(u)}
                          className={`p-1.5 rounded border transition-colors ${
                            u.isBanned 
                              ? 'bg-teal-500/10 text-teal-400 border-teal-500/20 hover:bg-teal-500/20' 
                              : 'bg-rose-500/5 text-rose-400 border-rose-500/10 hover:bg-rose-500/15'
                          }`}
                          title={u.isBanned ? 'Re-activate Account' : 'Suspend Account'}
                          id={`ban-btn-${u.id}`}
                        >
                          <Shield size={13} />
                        </button>

                        <button
                          onClick={() => handleSimulatePassReset(u)}
                          className="p-1.5 bg-slate-950 border border-slate-855 hover:bg-slate-850 text-slate-300 rounded transition-colors"
                          title="Reset Security Passcode"
                          id={`reset-btn-${u.id}`}
                        >
                          <Key size={13} />
                        </button>

                        <button
                          onClick={() => handleDeleteUser(u.id, `${u.firstName} ${u.lastName}`)}
                          className="p-1.5 bg-rose-500/5 border border-rose-500/10 text-rose-400 hover:bg-rose-500/15 rounded transition-colors"
                          title="De-register Stakeholder Record"
                          id={`delete-btn-${u.id}`}
                        >
                          <Trash2 size={13} />
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

      {/* PASSCODE RESET MODAL DIALOG */}
      {resetTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs" id="reset-modal-mask">
          <div className="bg-slate-900 border border-slate-800 rounded p-6 max-w-sm w-full relative animate-in zoom-in-95 duration-150">
            <h4 className="text-sm font-mono uppercase font-bold text-slate-200 mb-2">Reset Gate Credentials</h4>
            <p className="text-xs text-slate-400 leading-normal mb-4">
              Triggering this override generates a temporary passcode bypass string for resident: **{resetTargetUser.firstName} {resetTargetUser.lastName}**.
            </p>

            <div className="flex justify-end gap-2 text-xs font-mono pt-3 border-t border-slate-850">
              <button
                onClick={() => setResetTargetUser(null)}
                className="text-slate-500 hover:text-slate-300"
              >
                Cancel Override
              </button>
              <button
                onClick={handleCommitPassReset}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1.5 rounded font-bold"
                id="confirm-reset-lock"
              >
                Generate Bypass Key
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
