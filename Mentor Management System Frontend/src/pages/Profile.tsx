/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { UserCheck, ShieldCheck, HeartHandshake, Eye, ArrowRight, Save } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, updateUserInContext } = useAuth();
  
  // Settings edit state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [interests, setInterests] = useState('');
  const [learningGoals, setLearningGoals] = useState('');
  
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setPhone(user.phone || '');
      
      // Load specific attributes from profile storage safely
      if (user.role === 'MENTEE') {
        const mentees = JSON.parse(localStorage.getItem('mentorkhet_mentees') || '[]');
        const myMenteProfile = mentees.find((m: any) => m.userId === user.id);
        if (myMenteProfile) {
          setInterests(myMenteProfile.interests?.join(', ') || '');
          setLearningGoals(myMenteProfile.learningGoals?.join(', ') || '');
        }
      }
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;

    try {
      const interestsArray = interests ? interests.split(',').map(s => s.trim()).filter(Boolean) : [];
      const goalsArray = learningGoals ? learningGoals.split(',').map(s => s.trim()).filter(Boolean) : [];

      await api.put('/profile/me', {
        firstName,
        lastName,
        phone,
        interests: interestsArray,
        learningGoals: goalsArray
      });

      // Synchronize changes in client session context
      updateUserInContext({ firstName, lastName, phone });
      
      setFeedback('Resident configuration matrix saved successfully.');
      setTimeout(() => setFeedback(''), 2500);
    } catch (err) {
      alert('Error updating user configuration profile.');
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-8 animate-fade-in" id="profile-root">
      
      {/* TITLE ROW */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">Profile Settings</h1>
        <p className="text-xs text-slate-400 font-mono mt-1">Stated resident credentials and security settings</p>
      </div>

      {feedback && (
        <div className="bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs px-3 py-2 rounded font-mono" id="profile-notice">
          {feedback}
        </div>
      )}

      {/* TWO BLOCK LAYOUT */}
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        
        {/* AVATAR SUMMARY BLOCK */}
        <div className="bg-slate-900 border border-slate-800 rounded p-6 text-center space-y-4">
          <img 
            src={user.avatar} 
            alt={user.firstName} 
            className="w-20 h-20 rounded-full mx-auto bg-slate-950 object-cover border border-slate-800"
            referrerPolicy="no-referrer"
          />
          <div>
            <h3 className="text-sm font-bold text-slate-200">{user.firstName} {user.lastName}</h3>
            <p className="text-[10px] font-mono text-slate-500 mt-0.5">{user.email}</p>
          </div>

          <div className="pt-4 border-t border-slate-855 flex items-center justify-center gap-2">
            <span className="text-[10px] font-mono bg-slate-950 text-slate-400 px-2.5 py-0.5 border border-slate-855 rounded-full uppercase tracking-wider font-bold">
              {user.role} CODE
            </span>
          </div>
        </div>

        {/* SETTINGS EDITOR FORM */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded p-6" id="edit-profile-settings">
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="flex items-center gap-2 text-slate-200 border-b border-slate-850 pb-3 mb-2">
              <UserCheck size={16} className="text-teal-400" />
              <span className="text-xs font-mono tracking-tight font-bold">MUTATE CREDENTIAL SETTINGS</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5">First Name *</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded px-3 py-2 text-xs text-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5">Last Name *</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded px-3 py-2 text-xs text-slate-200 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5">Voice Contact / SMS Coordinates</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-855 focus:border-teal-500 rounded px-3 py-2 text-xs text-slate-200 font-mono outline-none"
              />
            </div>

            {/* Conditionally render mentee profile updates */}
            {user.role === 'MENTEE' && (
              <div className="pt-4 border-t border-slate-855 space-y-4" id="mentee-custom-profile">
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5">Interests (Comma separated)</label>
                  <input
                    type="text"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded px-3 py-2 text-xs text-slate-200 outline-none"
                    placeholder="e.g. React, Next.js, Kubernetes"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5">Learning Goals (Comma separated)</label>
                  <input
                    type="text"
                    value={learningGoals}
                    onChange={(e) => setLearningGoals(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded px-3 py-2 text-xs text-slate-200 outline-none"
                    placeholder="e.g. Master docker clusters, Obtain fullstack developer entry competency"
                  />
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-855 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-600">Saved profile modifications are synchronized in real-time.</span>
              
              <button
                type="submit"
                className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-6 py-2 rounded text-xs font-mono font-bold tracking-wider flex items-center gap-1.5 focus:outline-none"
              >
                <Save size={13} />
                <span>Save credentials</span>
              </button>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
};
