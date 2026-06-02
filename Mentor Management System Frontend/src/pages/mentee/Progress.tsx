/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { MentorshipSession } from '../../types';
import { TrendingUp, CheckCircle, FileText, Calendar, ArrowRight } from 'lucide-react';

export const Progress: React.FC = () => {
  const { user } = useAuth();
  const [completedSessions, setCompletedSessions] = useState<MentorshipSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await api.get('/sessions');
        const done = res.data.filter((s: MentorshipSession) => s.status === 'COMPLETED');
        setCompletedSessions(done);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const goals = [
    { text: 'Verify fundamental React rendering processes', target: 'Completed session with Sarah Kaufman', checked: completedSessions.length > 0 },
    { text: 'Establish Docker layers optimization parameters', target: 'Completed session with Marcus Vance', checked: completedSessions.length > 1 },
    { text: 'Demonstrate custom state management logic', target: 'Independent syllabus submission checklist', checked: completedSessions.length > 2 },
    { text: 'Deploy fully completed container pipeline', target: 'Final presentation milestones', checked: completedSessions.length > 3 }
  ];

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-5 h-5 border-2 border-slate-700 border-t-teal-400 rounded-full animate-spin mb-3"></div>
        <p className="text-xs font-mono text-slate-500">RECALLING EDUCATION PROGRESS RECORDS...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in" id="mentee-progress-root">
      
      {/* TITLE BLOCKS */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100 font-sans">Goal Tracker</h1>
        <p className="text-xs text-slate-400 font-mono mt-1">Stated learning targets and expert milestones</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        
        {/* CHECKLIST GOAL CARD */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded p-6 space-y-6">
          <div className="flex items-center gap-2 text-slate-200 border-b border-slate-850 pb-3">
            <TrendingUp size={16} className="text-teal-400" />
            <span className="text-xs font-mono font-bold uppercase">Learning agenda benchmarks</span>
          </div>

          <div className="space-y-4" id="target-goals-stack">
            {goals.map((g, idx) => (
              <div 
                key={idx} 
                className={`p-4 border rounded flex items-start gap-4 transition-colors ${
                  g.checked 
                    ? 'bg-teal-500/5 border-teal-500/25 text-slate-200' 
                    : 'bg-slate-950/60 border-slate-855 text-slate-455'
                }`}
              >
                <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center font-bold font-mono text-[10px] ${
                  g.checked ? 'bg-teal-500/10 border-teal-500/30 text-teal-400' : 'bg-slate-950 border-slate-700 text-slate-700'
                }`}>
                  {g.checked ? '✓' : ''}
                </div>
                <div>
                  <p className={`text-xs font-bold leading-none ${g.checked ? 'text-slate-100' : 'text-slate-400'}`}>{g.text}</p>
                  <p className="text-[10px] font-mono text-slate-500 mt-1.5">{g.target}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FEEDBACK DOSSIER COLUMN */}
        <div className="space-y-4">
          <h2 className="text-xs font-mono text-slate-400 uppercase tracking-widest block">Instructor feedback archives</h2>
          
          {completedSessions.length === 0 ? (
            <p className="text-xs font-mono text-slate-500 italic p-6 border border-slate-900 rounded bg-slate-900/10">No completed session logs discovered.</p>
          ) : (
            <div className="space-y-4 font-sans text-xs text-slate-300">
              {completedSessions.map(cs => (
                <div key={cs.id} className="bg-slate-900 border border-slate-855 p-4 rounded space-y-3">
                  <div className="flex justify-between items-center bg-slate-950/50 p-2 rounded text-slate-400">
                    <span className="font-bold flex items-center gap-1.5"><Calendar size={12} /> {cs.mentorName}</span>
                    <span className="font-mono text-[9px]">{cs.date}</span>
                  </div>
                  
                  {cs.notes ? (
                    <p className="italic">"{cs.notes}"</p>
                  ) : (
                    <p className="text-slate-500 italic font-mono text-[10px]">No notes archived for this appointment block.</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
