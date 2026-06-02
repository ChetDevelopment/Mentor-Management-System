/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Review } from '../../types';
import { Trash2, ShieldAlert, Star, CheckCircle, Info, MessageSquareCode } from 'lucide-react';

export const ModPanel: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');

  const loadReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reviews');
      setReviews(res.data);
    } catch (err) {
      console.error('Error loading moderation queue.', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handlePurgeReview = async (id: string, author: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete / purge the review comment written by ${author}? This action is audited.`)) return;

    try {
      await api.delete(`/reviews/${id}`);
      setFeedback(`Review comment successfully purged. Peer scores recalculated.`);
      setTimeout(() => setFeedback(''), 2500);
      loadReviews();
    } catch (err) {
      alert('Error purging review comment.');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-5 h-5 border-2 border-slate-700 border-t-teal-400 rounded-full animate-spin mb-3"></div>
        <p className="text-xs font-mono text-slate-500">POLLING MODERATION DESK LOGS...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in" id="admin-reviews-root">
      
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">Feedback & Moderation Desk</h1>
        <p className="text-xs text-slate-400 font-mono mt-1">PEER REVIEW AUDIT TRAILS AND PURGING CONTROLS</p>
      </div>

      {feedback && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs px-3 py-2 rounded font-mono" id="mod-notice">
          {feedback}
        </div>
      )}

      {/* MOD QUEUE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-xs font-mono tracking-wider font-bold text-slate-400 uppercase flex items-center gap-1.5">
            <ShieldAlert size={14} className="text-rose-400" />
            <span>ACTIVE REVIEW TRAIL LOGS</span>
          </h2>
          <span className="text-[10px] font-mono text-slate-655">Action deletes review files</span>
        </div>

        {reviews.length === 0 ? (
          <div className="bg-slate-900 border border-slate-850 p-12 rounded text-center space-y-2">
            <CheckCircle size={24} className="text-teal-400 mx-auto" />
            <p className="text-xs font-mono text-slate-400">All submitted review trails clean of moderation queues.</p>
          </div>
        ) : (
          <div className="space-y-4" id="mod-reviews-stack">
            {reviews.map((rev) => (
              <div 
                key={rev.id} 
                className="bg-slate-900 border border-slate-855 p-5 rounded space-y-3 relative group hover:border-slate-700 transition-colors"
                id={`mod-item-${rev.id}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={rev.menteeAvatar} 
                      alt={rev.menteeName} 
                      className="w-9 h-9 rounded object-cover bg-slate-950 border border-slate-800"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{rev.menteeName} (Mentee Code)</h4>
                      <p className="text-[9px] font-mono text-slate-500 uppercase mt-0.5">Target Mentor ID: {rev.mentorId}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <div className="flex items-center gap-0.5 text-amber-500 text-xs font-mono">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} size={11} className="fill-current" />
                      ))}
                    </div>
                    
                    <button
                      onClick={() => handlePurgeReview(rev.id, rev.menteeName)}
                      className="bg-rose-500/5 hover:bg-rose-500/10 hover:border-rose-500/20 text-rose-450 border border-rose-500/10 p-1.5 rounded transition-all focus:outline-none"
                      title="Purge / Remove comment record"
                      id={`purge-btn-${rev.id}`}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-950/40 rounded border border-slate-855 text-xs text-slate-350 leading-relaxed italic">
                  "{rev.comment}"
                </div>

                <div className="flex items-center justify-between font-mono text-[9px] text-slate-600">
                  <span>LOG SEQUENCE ARCHIVE TOKEN: {rev.id}</span>
                  <span>Registered: {new Date(rev.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
