/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { MentorshipSession, SystemStats, MentorProfile } from '../types';
import { 
  ShieldCheck, 
  Users, 
  Calendar, 
  Sparkles, 
  Layers, 
  Flame, 
  Clock, 
  CheckCircle, 
  Plus, 
  MessageSquare, 
  ArrowRight, 
  AlertCircle,
  FileText
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<MentorshipSession[]>([]);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [pendingMentors, setPendingMentors] = useState<MentorProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Get user roles sessions
      const sRes = await api.get('/sessions');
      setSessions(sRes.data);

      // 2. Role specific information loading
      if (user?.role === 'ADMIN') {
        const statsRes = await api.get('/admin/stats');
        setStats(statsRes.data);

        const mRes = await api.get('/admin/mentors');
        const pMentors = mRes.data.filter((m: any) => m.verificationStatus === 'PENDING');
        setPendingMentors(pMentors);
      }
    } catch (e) {
      console.error('Error fetching dashboard systems.', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const handleSessionAction = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/sessions/${id}`, { status: newStatus });
      fetchDashboardData(); // Reload stats
    } catch (err) {
      alert('Failed updating session.');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-6 h-6 border-2 border-slate-700 border-t-teal-400 rounded-full animate-spin mb-3"></div>
        <p className="text-xs font-mono text-slate-500">POLLING DASHBOARD SECURE STATUS...</p>
      </div>
    );
  }

  // --- ADMIN PORTAL VIEW ---
  if (user?.role === 'ADMIN') {
    const activeStats = stats || { totalMentors: 0, totalMentees: 0, totalSessions: 0, pendingVerifications: 0, mostRequestedSkills: [] };
    
    return (
      <div className="space-y-8" id="admin-dashboard-root">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">Auditing Desk Control</h1>
          <p className="text-xs text-slate-400 font-mono mt-1">OPERATOR ROLE ACCESS // SECURED</p>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase">ACTIVE INSTRUCTORS</span>
              <Users size={16} className="text-teal-400" />
            </div>
            <p className="text-2xl font-mono font-bold text-slate-200">{activeStats.totalMentors}</p>
            <p className="text-[9px] font-mono text-slate-500 mt-2">NID Verified & approved</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase">STUDENTS ENROLLED</span>
              <Users size={16} className="text-teal-400" />
            </div>
            <p className="text-2xl font-mono font-bold text-slate-200">{activeStats.totalMentees}</p>
            <p className="text-[9px] font-mono text-slate-500 mt-2">Active profile holders</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase">TOTAL APPOINTMENTS</span>
              <Calendar size={16} className="text-teal-400" />
            </div>
            <p className="text-2xl font-mono font-bold text-slate-200">{activeStats.totalSessions}</p>
            <p className="text-[9px] font-mono text-slate-500 mt-2">Completed and pending runs</p>
          </div>

          <div className={`border p-4 rounded ${activeStats.pendingVerifications > 0 ? 'bg-amber-500/5 border-amber-500/20' : 'bg-slate-900 border-slate-800'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase">PENDING VERIFICATION</span>
              <ShieldCheck size={16} className={activeStats.pendingVerifications > 0 ? 'text-amber-400' : 'text-slate-500'} />
            </div>
            <p className={`text-2xl font-mono font-bold ${activeStats.pendingVerifications > 0 ? 'text-amber-400' : 'text-slate-200'}`}>
              {activeStats.pendingVerifications}
            </p>
            <p className="text-[9px] font-mono text-slate-500 mt-2">Requires National ID check</p>
          </div>
        </div>

        {/* TWO PANEL SPLIT */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* PENDING VERIFICATION LIST */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-mono tracking-wider font-bold text-slate-400 uppercase">PENDING AUDIT QUEUE</h2>
              <Link to="/admin/mentor-approvals" className="text-[11px] text-teal-400 hover:underline font-mono">View approval panel</Link>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded overflow-hidden">
              {pendingMentors.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <CheckCircle size={24} className="text-teal-400 mx-auto" />
                  <p className="text-xs font-semibold text-slate-300">All applicant profiles processed!</p>
                  <p className="text-[10px] font-mono text-slate-500">Identity security system clear of pending files.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-855">
                  {pendingMentors.map((mentor) => (
                    <div key={mentor.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex gap-3">
                        <img 
                          src={mentor.avatar} 
                          alt={mentor.firstName}
                          className="w-10 h-10 rounded bg-slate-800 object-cover border border-slate-800"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xs font-bold text-slate-200">{mentor.firstName} {mentor.lastName}</h3>
                            <span className="text-[8px] font-mono bg-amber-500/15 text-amber-400 border border-amber-500/20 px-1.5 rounded">
                              NID: {mentor.nationalId}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">{mentor.shortDescription}</p>
                          <p className="text-[9px] font-mono text-slate-500 mt-1">Exp: {mentor.experience} Years • Category: {mentor.category}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button 
                          onClick={() => navigate('/admin/mentor-approvals')}
                          className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-3 py-1 rounded text-[10px] font-mono font-bold"
                        >
                          Audit File
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* QUICK TERMINAL CONTROLS */}
          <div className="space-y-4">
            <h2 className="text-sm font-mono tracking-wider font-bold text-slate-400 uppercase font-mono">QUICK OPERATIONS</h2>
            <div className="bg-slate-900 border border-slate-800 rounded p-4 space-y-3 font-mono text-xs text-slate-300">
              <Link to="/admin/mentor-approvals" className="flex items-center justify-between p-2 hover:bg-slate-855 border border-slate-800 rounded text-left transition-colors">
                <span className="flex items-center gap-2">
                  <Sparkles size={14} className="text-teal-400" /> ID Approval Board
                </span>
                <ArrowRight size={12} />
              </Link>
              <Link to="/admin/users" className="flex items-center justify-between p-2 hover:bg-slate-855 border border-slate-800 rounded text-left transition-colors">
                <span className="flex items-center gap-2">
                  <Users size={14} className="text-teal-400" /> Ban / Edit Users
                </span>
                <ArrowRight size={12} />
              </Link>
              <Link to="/admin/categories" className="flex items-center justify-between p-2 hover:bg-slate-855 border border-slate-800 rounded text-left transition-colors">
                <span className="flex items-center gap-2">
                  <Layers size={14} className="text-teal-400" /> Skill Registries
                </span>
                <ArrowRight size={12} />
              </Link>
              <Link to="/admin/reports" className="flex items-center justify-between p-2 hover:bg-slate-855 border border-slate-800 rounded text-left transition-colors">
                <span className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-rose-400" /> Moderation Panel
                </span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // --- MENTOR EXPORT LEVEL VIEW ---
  if (user?.role === 'MENTOR') {
    const pendingSessions = sessions.filter(s => s.status === 'PENDING');
    const upcomingSessions = sessions.filter(s => s.status === 'ACCEPTED');
    const completedSessions = sessions.filter(s => s.status === 'COMPLETED');

    return (
      <div className="space-y-8" id="mentor-dashboard-root">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">Expert Workstation</h1>
          <p className="text-xs text-slate-400 font-mono mt-1">INSTRUCTOR SECURE CONSOLE</p>
        </div>

        {/* METRIC STRIP */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded">
            <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">PENDING REQUESTS</span>
            <span className={`text-2xl font-mono font-bold ${pendingSessions.length > 0 ? 'text-amber-400 animate-pulse' : 'text-slate-200'}`}>
              {pendingSessions.length}
            </span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded">
            <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">ACCEPTED RUNS</span>
            <span className="text-2xl font-mono font-bold text-slate-200">{upcomingSessions.length}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded">
            <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">COMPLETED TASKS</span>
            <span className="text-2xl font-mono font-bold text-slate-200">{completedSessions.length}</span>
          </div>
        </div>

        {/* INCOMING REQUESTS */}
        <div className="space-y-4">
          <h2 className="text-sm font-mono tracking-wider font-bold text-slate-400 uppercase">PENDING SESSION OFFERS</h2>
          <div className="bg-slate-900 border border-slate-800 rounded overflow-hidden">
            {pendingSessions.length === 0 ? (
              <p className="text-center p-8 text-xs text-slate-500 font-mono">No incoming pending slot requests.</p>
            ) : (
              <div className="divide-y divide-slate-855">
                {pendingSessions.map((session) => (
                  <div key={session.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex gap-3">
                      <img 
                        src={session.menteeAvatar} 
                        alt={session.menteeName}
                        className="w-10 h-10 rounded object-cover border border-slate-800 bg-slate-850"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-200">{session.menteeName} (Learner)</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Requested slot sequence</p>
                        <p className="text-[9px] font-mono text-teal-400 mt-1">Calendar: {session.date} @ {session.timeSlot}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button 
                        onClick={() => handleSessionAction(session.id, 'ACCEPTED')}
                        className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-3 py-1 rounded text-[10px] font-mono font-bold focus:outline-none"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => handleSessionAction(session.id, 'REJECTED')}
                        className="bg-slate-800 hover:bg-slate-750 text-slate-300 px-3 py-1 border border-slate-700 rounded text-[10px] font-mono focus:outline-none"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ACTIVE APPOINTMENTS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono tracking-wider font-bold text-slate-400 uppercase">UPCOMING SCHEDULED INTERACTS</h2>
            <Link to="/sessions" className="text-[11px] text-teal-400 hover:underline font-mono">My session desk →</Link>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded overflow-hidden">
            {upcomingSessions.length === 0 ? (
              <p className="text-center p-8 text-xs text-slate-500 font-mono">No confirmed appointments scheduled on board.</p>
            ) : (
              <div className="divide-y divide-slate-855">
                {upcomingSessions.slice(0, 3).map((session) => (
                  <div key={session.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex gap-3">
                      <img 
                        src={session.menteeAvatar} 
                        alt={session.menteeName}
                        className="w-10 h-10 rounded object-cover border border-slate-800 bg-slate-850"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-200">{session.menteeName}</h4>
                        <p className="text-[10px] text-slate-450 mt-1 font-mono text-teal-400">Date slot: {session.date} at {session.timeSlot}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link 
                        to="/chat" 
                        className="p-1.5 text-slate-400 hover:text-slate-200 border border-slate-800 rounded focus:outline-none"
                        title="Chat"
                      >
                        <MessageSquare size={13} />
                      </Link>
                      <button 
                        onClick={() => handleSessionAction(session.id, 'COMPLETED')}
                        className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-3 py-1 rounded text-[10px] font-mono font-bold focus:outline-none"
                      >
                        Mark Completed
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- MENTEE SUITE (LEARNER) VIEW ---
  const activeIncoming = sessions.find(s => s.status === 'ACCEPTED');
  const finishedSessions = sessions.filter(s => s.status === 'COMPLETED');
  const goalPercent = Math.min(100, Math.floor((finishedSessions.length / 4) * 100)); // Demo goal counts up to 4 sessions to master

  return (
    <div className="space-y-8" id="mentee-dashboard-root">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">Student Panel</h1>
          <p className="text-xs text-slate-400 font-mono mt-1">LEARNER CONSOLE DESK — SECURED</p>
        </div>

        <Link 
          to="/mentors" 
          id="btn-discover-mentors"
          className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-4 py-2 rounded text-xs font-bold font-mono tracking-wider flex items-center justify-center gap-1"
        >
          <Sparkles size={14} />
          <span>FIND NEW EXPERTS</span>
        </Link>
      </div>

      {/* QUICK STATUS TRACKING BAR */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* PROGRESS CHECKLIST */}
        <div className="bg-slate-900 border border-slate-800 rounded p-5 space-y-4 lg:col-span-1">
          <h2 className="text-[11px] font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <Flame size={14} className="text-amber-500" /> Course Progress Tracking
          </h2>
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-slate-400">Total Completed:</span>
              <span className="text-teal-400 font-semibold">{finishedSessions.length} / 4 Sessions</span>
            </div>
            
            <div className="w-full bg-slate-950 h-2 rounded overflow-hidden border border-slate-800">
              <div 
                className="bg-teal-500 h-full transition-all duration-300" 
                style={{ width: `${goalPercent}%` }}
              ></div>
            </div>
            <p className="text-[9px] font-mono text-slate-500 mt-2">Target goal threshold mapped to 4 core advisory setups.</p>
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-2">
            <p className="text-xs font-semibold text-slate-300">Active Goals Checklist:</p>
            <div className="space-y-1.5 font-mono text-[10px] text-slate-400">
              <p className="flex items-center gap-2">
                <span className={finishedSessions.length > 0 ? 'text-teal-400' : 'text-slate-600'}>✓</span> Link GitHub repositories to expert.
              </p>
              <p className="flex items-center gap-2">
                <span className={finishedSessions.length > 1 ? 'text-teal-400' : 'text-slate-600'}>✓</span> Perform first manual pull review session.
              </p>
              <p className="flex items-center gap-2">
                <span className={finishedSessions.length > 2 ? 'text-teal-400' : 'text-slate-600'}>✓</span> Audit system container with Marcus Vance.
              </p>
            </div>
          </div>
        </div>

        {/* PRIMARY ACTIVE SESSION */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-[11px] font-mono text-slate-400 uppercase tracking-widest mb-4">CONFIRMED ACTIVE ADVISOR SESSION</h2>
            
            {activeIncoming ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex gap-4">
                  <img 
                    src={activeIncoming.mentorAvatar} 
                    alt={activeIncoming.mentorName} 
                    className="w-12 h-12 rounded bg-slate-850 border border-slate-800 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-200">{activeIncoming.mentorName}</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Instruction coordinator active</p>
                    <p className="text-xs font-mono text-teal-400 mt-2 bg-teal-500/10 px-2 py-0.5 rounded inline-block">
                      Approved slot: {activeIncoming.date} at {activeIncoming.timeSlot}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
                  <Link 
                    to="/chat" 
                    className="bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-200 px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5"
                  >
                    <MessageSquare size={13} />
                    <span>Open chatroom</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <AlertCircle size={18} className="text-slate-500 mx-auto mb-2" />
                <p className="text-xs text-slate-400">No active confirmed appointments logged today.</p>
                <p className="text-[10px] font-mono text-slate-500 mt-0.5">Browse verified instructors to book time-slots instantly.</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-850 flex items-center justify-between mt-4">
            <span className="text-[10px] font-mono text-slate-500">SECURE IN-BROWSER CLASS ENVIRONMENT Active</span>
            <Link to="/sessions" className="text-xs text-teal-400 hover:underline font-mono">View session history →</Link>
          </div>
        </div>

      </div>

      {/* RECENT SESSION LOGS */}
      <div className="space-y-4">
        <h2 className="text-sm font-mono tracking-wider font-bold text-slate-400 uppercase">My Booking Sequences</h2>
        <div className="bg-slate-900 border border-slate-800 rounded overflow-hidden">
          {sessions.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <Calendar size={20} className="text-slate-500 mx-auto" />
              <p className="text-xs text-slate-400">You haven't requested any expert sessions yet.</p>
              <Link to="/mentors" className="text-xs text-teal-400 hover:underline font-mono">Explore verified instruct list →</Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-855 animate-fade-in">
              {sessions.map((session) => (
                <div key={session.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex gap-3">
                    <img 
                      src={session.mentorAvatar} 
                      alt={session.mentorName} 
                      className="w-9 h-9 rounded bg-slate-850 border border-slate-800 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{session.mentorName}</h4>
                      <p className="text-[10px] font-mono text-slate-500">Requested: {session.date} at {session.timeSlot}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-mono px-2 py-0.5 border rounded uppercase ${
                      session.status === 'ACCEPTED' ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' :
                      session.status === 'COMPLETED' ? 'bg-slate-800 text-slate-400 border-slate-700' :
                      session.status === 'REJECTED' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                      'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}>
                      {session.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
