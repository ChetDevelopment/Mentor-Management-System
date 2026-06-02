/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { MentorProfile } from '../../types';
import { ShieldAlert, CheckCircle2, XCircle, ArrowUpRight, Award, FileText, Info } from 'lucide-react';

export const MentorApprovals: React.FC = () => {
  const [mentors, setMentors] = useState<MentorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');

  const loadMentors = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/mentors');
      setMentors(res.data);
    } catch (err) {
      console.error('Error fetching admin profiles queue.', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMentors();
  }, []);

  const handleUpdateVerification = async (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
    setFeedback('');
    try {
      await api.post(`/admin/mentors/${id}/verify`, { status: newStatus });
        
      setFeedback(`Candidate record ${newStatus} successfully.`);
      setTimeout(() => setFeedback(''), 2500);
      loadMentors();
    } catch (err) {
      alert('Error verifying record status.');
    }
  };

  const pendingList = mentors.filter(m => m.verificationStatus === 'PENDING');
  const actionedList = mentors.filter(m => m.verificationStatus !== 'PENDING');

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-5 h-5 border-2 border-slate-700 border-t-teal-400 rounded-full animate-spin mb-3"></div>
        <p className="text-xs font-mono text-slate-500">POLLING SECURE IDENTITY DATABASE RECORDS...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in" id="admin-approvals-root">
      
      {/* HEADER COMPONENT */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">Mentor Credential Auditing</h1>
        <p className="text-xs text-slate-400 font-mono mt-1">TRUST SYSTEMS INTEL PANEL // NATIONAL ID MATCHING SCREEN</p>
      </div>

      {feedback && (
        <div className="bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs px-3 py-2 rounded font-mono" id="approval-notice">
          {feedback}
        </div>
      )}

      {/* CORE QUEUE LIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-sm font-mono tracking-wider font-bold text-slate-300 uppercase flex items-center gap-2">
            <ShieldAlert size={16} className="text-amber-500" />
            <span>PENDING AUDIT QUEUE ({pendingList.length} files)</span>
          </h2>
          <span className="text-[10px] font-mono text-slate-655">Manual evaluation mandated</span>
        </div>

        {pendingList.length === 0 ? (
          <div className="bg-slate-900 border border-slate-850 p-12 rounded text-center space-y-2">
            <CheckCircle2 size={32} className="text-teal-450 mx-auto" />
            <p className="text-xs font-mono text-slate-350">Pending mentor applications queue is completely clear.</p>
            <p className="text-[10px] font-mono text-slate-600">All registered coaches match active verification parameters.</p>
          </div>
        ) : (
          <div className="space-y-6" id="approvals-pending-grid">
            {pendingList.map((mentor) => (
              <div 
                key={mentor.id} 
                className="bg-slate-900 border border-slate-800 rounded p-6 space-y-6"
                id={`audit-card-${mentor.id}`}
              >
                {/* 1. Profile Block */}
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <img 
                    src={mentor.avatar} 
                    alt={mentor.firstName} 
                    className="w-16 h-16 rounded bg-slate-950 object-cover border border-slate-800"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-grow min-w-0 space-y-1.5">
                    <div className="flex items-center gap-3">
                      <h3 className="text-sm font-semibold text-slate-100">{mentor.firstName} {mentor.lastName}</h3>
                      <span className="bg-slate-950 border border-slate-800 text-amber-500 text-[10px] px-2.5 py-0.5 rounded font-mono">
                        NID Match Required
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 max-w-xl">{mentor.shortDescription}</p>
                    <p className="text-xs font-mono text-teal-400">{mentor.category} Consultant</p>
                  </div>
                </div>

                {/* 2. Credentials Verification Table */}
                <div className="grid md:grid-cols-2 gap-4 bg-slate-950 p-4 border border-slate-855 rounded text-xs font-mono">
                  <div className="space-y-2.5">
                    <p className="text-slate-500 uppercase tracking-wider text-[9px]">Identity Verification File</p>
                    <p className="text-slate-300">Email Reference: <b className="text-slate-100 select-all">{mentor.email}</b></p>
                    <p className="text-slate-300">National ID (NID): <b className="text-teal-400 select-all">{mentor.nationalId}</b></p>
                    <p className="text-slate-300">Phone Code: <b className="text-slate-100">{mentor.phone}</b></p>
                  </div>
                  <div className="space-y-2.5 border-t md:border-t-0 md:border-l border-slate-855 pt-3 md:pt-0 md:pl-4">
                    <p className="text-slate-500 uppercase tracking-wider text-[9px]">Academic & Professional Audit</p>
                    <p className="text-slate-300">Experience Domain: <b className="text-slate-150">{mentor.experience} Years</b></p>
                    <p className="text-slate-300">
                      Portfolio: {mentor.portfolioUrl ? (
                        <a href={mentor.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline inline-flex items-center gap-0.5">
                          Open Profile Link <ArrowUpRight size={10} />
                        </a>
                      ) : 'None declared'}
                    </p>
                    <p className="text-slate-300">CV/Resume File: <span className="text-slate-500 italic">Self-declaration archived</span></p>
                  </div>
                </div>

                {/* 3. Syllabus check */}
                <div className="p-4 bg-slate-950/40 rounded border border-slate-855/50 space-y-2 text-xs text-slate-300 leading-normal">
                  <p className="font-semibold text-slate-250 font-mono">Syllabus details:</p>
                  <p className="italic text-slate-400 sm:text-xs">"{mentor.fullDescription}"</p>
                </div>

                {/* 4. Skills match */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  <span className="text-[10px] font-mono text-slate-500 self-center uppercase mr-2">Skills declarations:</span>
                  {mentor.skills.map(s => (
                    <span key={s} className="bg-slate-950 border border-slate-800 text-slate-400 text-[10px] font-mono px-2 py-0.5 rounded">
                      {s}
                    </span>
                  ))}
                </div>

                {/* 5. Control buttons */}
                <div className="pt-4 border-t border-slate-855 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500">I hereby verify that all National ID and portfolio coordinates match platform directives.</span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateVerification(mentor.id, 'APPROVED')}
                      id={`btn-approve-${mentor.id}`}
                      className="bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-mono font-bold px-4 py-2 rounded flex items-center gap-1 focus:outline-none"
                    >
                      <CheckCircle2 size={13} />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleUpdateVerification(mentor.id, 'REJECTED')}
                      id={`btn-reject-${mentor.id}`}
                      className="bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-mono px-4 py-2 rounded border border-slate-700 flex items-center gap-1 focus:outline-none"
                    >
                      <XCircle size={13} />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* COMPLETED REVIEWS INDEX FILE */}
      <div className="space-y-4 pt-12 border-t border-slate-900">
        <h2 className="text-sm font-mono tracking-wider font-bold text-slate-400 uppercase">AUDITED AND ACTIONED PROFILES</h2>
        <div className="bg-slate-900 border border-slate-800 rounded overflow-hidden">
          {actionedList.length === 0 ? (
            <p className="text-xs text-slate-500 font-mono text-center p-8">No actioned profiles catalogued.</p>
          ) : (
            <div className="divide-y divide-slate-855 text-xs">
              {actionedList.map((m) => (
                <div key={m.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex gap-3">
                    <img src={m.avatar} alt={m.firstName} className="w-8 h-8 rounded bg-slate-950 object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <p className="font-bold text-slate-200">{m.firstName} {m.lastName}</p>
                      <p className="text-[10px] font-mono text-slate-500">Category: {m.category} • Email: {m.email}</p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 border rounded font-mono text-[9px] uppercase ${
                    m.verificationStatus === 'APPROVED' ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' : 'bg-rose-500/10 text-rose-450 border-rose-500/20'
                  }`}>
                    {m.verificationStatus}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
