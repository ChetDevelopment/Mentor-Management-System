/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MentorshipSession } from '../types';
import { Calendar, Clock, Star, MessageSquare, Plus, FileSpreadsheet, CheckCircle, SlidersHorizontal, User } from 'lucide-react';

export const MySessions: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<MentorshipSession[]>([]);
  const [loading, setLoading] = useState(true);

  // Active filter
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'ACCEPTED' | 'COMPLETED'>('ALL');

  // Instructor notes editing
  const [activeNotesSessionId, setActiveNotesSessionId] = useState<string | null>(null);
  const [notesText, setNotesText] = useState('');

  // Mentee review editing
  const [activeReviewSession, setActiveReviewSession] = useState<MentorshipSession | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewFeedback, setReviewFeedback] = useState('');

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/sessions');
      setSessions(res.data);
    } catch (err) {
      console.error('Error fetching sessions.', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [user]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/sessions/${id}`, { status: newStatus });
      fetchSessions();
    } catch (err) {
      alert('Error patching status.');
    }
  };

  const handleSaveNotes = async (id: string) => {
    if (!notesText.trim()) return;
    try {
      await api.patch(`/sessions/${id}`, { notes: notesText });
      setActiveNotesSessionId(null);
      setNotesText('');
      fetchSessions();
    } catch (err) {
      alert('Error updating session notes.');
    }
  };

  const handlePublishReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReviewSession || !reviewComment.trim()) return;

    try {
      await api.post('/reviews', {
        mentorId: activeReviewSession.mentorId,
        rating: reviewRating,
        comment: reviewComment
      });
      
      // Update session locally to show review left or simply clear UI
      setReviewFeedback('Review registered successfully! Global ratings updated.');
      setTimeout(() => {
        setActiveReviewSession(null);
        setReviewRating(5);
        setReviewComment('');
        setReviewFeedback('');
        fetchSessions();
      }, 1500);
    } catch (err) {
      alert('Failed to publish review.');
    }
  };

  const filteredSessions = sessions.filter(s => {
    if (filter === 'ALL') return true;
    return s.status === filter;
  });

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-5 h-5 border-2 border-slate-700 border-t-teal-400 rounded-full animate-spin mb-3"></div>
        <p className="text-xs font-mono text-slate-500">SYNCHRONIZING APPOINTMENTS...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in" id="sessions-root">
      
      {/* HEADER ROW */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">Session Desk Workspace</h1>
          <p className="text-xs text-slate-400 font-mono mt-1">OPERATIONS SCHEDULE AND ADVISORY ARCHIVES</p>
        </div>

        {/* SELECTION TABS */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded" id="sessions-filter-tabs">
          {(['ALL', 'PENDING', 'ACCEPTED', 'COMPLETED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 text-[11px] font-mono rounded uppercase transition-colors focus:outline-none ${
                filter === tab ? 'bg-slate-800 text-teal-400 font-semibold' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* SESSIONS DISPLAY LIST */}
      <div className="space-y-6">
        
        {filteredSessions.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 p-12 text-center rounded space-y-2">
            <Calendar size={24} className="text-slate-600 mx-auto" />
            <p className="text-xs text-slate-450 font-mono">No appointment indexes under active status filter.</p>
          </div>
        ) : (
          <div className="space-y-4" id="sessions-grid-cards">
            {filteredSessions.map((session) => {
              const matchesUserAsMentor = user?.role === 'MENTOR';
              
              return (
                <div 
                  key={session.id} 
                  className="bg-slate-900 border border-slate-850 p-5 rounded space-y-4"
                  id={`session-item-${session.id}`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* AVATAR DETAILS */}
                    <div className="flex gap-4">
                      <img 
                        src={matchesUserAsMentor ? session.menteeAvatar : session.mentorAvatar} 
                        alt={matchesUserAsMentor ? session.menteeName : session.mentorName} 
                        className="w-11 h-11 rounded bg-slate-950 object-cover border border-slate-800 flex-shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-250">
                            {matchesUserAsMentor ? session.menteeName : session.mentorName}
                          </h3>
                          <span className="text-[9px] font-mono tracking-wider bg-slate-950 text-slate-500 px-1.5 py-0.2 rounded border border-slate-850">
                            {matchesUserAsMentor ? 'STUDENT' : 'VERIFIED INSTRUCTOR'}
                          </span>
                        </div>
                        
                        <div className="pt-1.5 flex items-center flex-wrap gap-3 font-mono text-[10px] text-teal-400">
                          <span className="flex items-center gap-1"><Calendar size={12} /> {session.date}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1"><Clock size={12} /> {session.timeSlot}</span>
                        </div>
                      </div>
                    </div>

                    {/* STATUS SHIELD & MAIN ACTION BUFFERS */}
                    <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto justify-end">
                      <span className={`text-[9px] font-mono px-2 py-0.5 border rounded uppercase ${
                        session.status === 'ACCEPTED' ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' :
                        session.status === 'COMPLETED' ? 'bg-slate-800 text-slate-400 border-slate-700' :
                        session.status === 'REJECTED' || session.status === 'CANCELLED' ? 'bg-rose-500/10 text-rose-450 border-rose-500/20' :
                        'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse'
                      }`}>
                        {session.status}
                      </span>

                      {/* Mentor responsive action buttons */}
                      {user?.role === 'MENTOR' && session.status === 'PENDING' && (
                        <div className="flex gap-1.5 pl-2">
                          <button
                            onClick={() => handleUpdateStatus(session.id, 'ACCEPTED')}
                            className="bg-teal-500 hover:bg-teal-400 text-slate-950 text-[10px] font-mono font-bold px-2.5 py-1 rounded"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(session.id, 'REJECTED')}
                            className="bg-slate-800 hover:bg-slate-750 text-slate-300 text-[10px] font-mono px-2.5 py-1 rounded border border-slate-700"
                          >
                            Decline
                          </button>
                        </div>
                      )}

                      {/* Complete option in case session is accepted */}
                      {user?.role === 'MENTOR' && session.status === 'ACCEPTED' && (
                        <button
                          onClick={() => handleUpdateStatus(session.id, 'COMPLETED')}
                          className="bg-teal-500 hover:bg-teal-400 text-slate-950 text-[10px] font-mono font-bold px-3 py-1 rounded ml-2"
                        >
                          Mark Completed
                        </button>
                      )}

                      {/* Mentee reviews button once completed */}
                      {user?.role === 'MENTEE' && session.status === 'COMPLETED' && (
                        <button
                          onClick={() => setActiveReviewSession(session)}
                          className="bg-teal-500 hover:bg-teal-400 text-slate-950 text-[10px] font-mono font-bold px-3 py-1 rounded ml-2"
                        >
                          Submit Review
                        </button>
                      )}
                    </div>
                  </div>

                  {/* ADVISORY REPORT & NOTES SECTION */}
                  {session.status === 'COMPLETED' && (
                    <div className="pt-4 border-t border-slate-855 bg-slate-950/40 p-3 rounded border border-slate-855/50 space-y-2">
                      <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <FileSpreadsheet size={13} className="text-teal-400" /> Professional advisory summary notes:
                      </p>
                      
                      {session.notes ? (
                        <p className="text-xs text-slate-300 italic">"{session.notes}"</p>
                      ) : (
                        <p className="text-xs text-slate-550 italic font-mono">No counseling notes saved for index.</p>
                      )}

                      {/* Mentor notes edit control */}
                      {user?.role === 'MENTOR' && (
                        <div className="pt-2 text-right">
                          {activeNotesSessionId === session.id ? (
                            <div className="space-y-3">
                              <textarea
                                value={notesText}
                                onChange={(e) => setNotesText(e.target.value)}
                                placeholder="Enter specific student references, homework logs, and container analysis files..."
                                className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 text-xs rounded"
                                rows={2}
                              />
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => setActiveNotesSessionId(null)}
                                  className="text-[10px] text-slate-500 hover:text-slate-350 font-mono"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleSaveNotes(session.id)}
                                  className="bg-teal-500 hover:bg-teal-400 text-slate-950 text-[10px] px-3 py-1 rounded font-mono font-bold"
                                >
                                  Commit Notes
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setActiveNotesSessionId(session.id);
                                setNotesText(session.notes || '');
                              }}
                              className="text-[10px] text-teal-400 hover:underline font-mono"
                            >
                              {session.notes ? 'Edit advisory notes' : '+ Insert syllabus notes'}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MENTEE ADVISORY REVIEW OVERLAY DIALOG */}
      {activeReviewSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs" id="review-modal-mask">
          <div className="bg-slate-900 border border-slate-800 rounded p-6 max-w-md w-full relative animate-in zoom-in-95 duration-155">
            <h3 className="text-sm font-mono tracking-wide uppercase font-bold text-slate-200 mb-2 border-b border-slate-850 pb-2">
              Share Expert Evaluation
            </h3>
            <p className="text-[11px] text-slate-400 mb-4">
              Your feedback is audited for accuracy before being assigned to live portfolios.
            </p>

            {reviewFeedback ? (
              <div className="p-4 bg-teal-500/10 border border-teal-500/20 rounded text-center text-xs text-teal-400 font-mono">
                {reviewFeedback}
              </div>
            ) : (
              <form onSubmit={handlePublishReview} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase mb-2">Review Rating Score *</label>
                  <div className="flex items-center gap-1.5" id="rating-star-selector">
                    {([1, 2, 3, 4, 5] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setReviewRating(r)}
                        className="p-1 focus:outline-none"
                      >
                        <Star 
                          size={18} 
                          className={r <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-655'} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5">Feedback Comment *</label>
                  <textarea
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Specify exactly how this instructor helped you, e.g. code optimization, NID security, Kubernetes routing..."
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2.5 text-xs rounded outline-none focus:border-teal-400"
                    rows={4}
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-850">
                  <button
                    type="button"
                    onClick={() => setActiveReviewSession(null)}
                    className="text-xs text-slate-500 hover:text-slate-350 font-mono"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-4 py-2 rounded text-xs font-mono font-bold"
                  >
                    Publish Advisory Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
