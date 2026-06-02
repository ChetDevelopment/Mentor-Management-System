/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { MentorProfile } from '../../types';
import { Clock, Calendar, CheckSquare, Plus, Trash2, ArrowRight } from 'lucide-react';

export const Availability: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<MentorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Schedule state modifications
  const [weeklySchedule, setWeeklySchedule] = useState<string[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  
  const [newTime, setNewTime] = useState('');
  const [feedback, setFeedback] = useState('');

  const loadProfile = async () => {
    setLoading(true);
    try {
      const mentorsRes = await api.get('/admin/mentors');
      const mentProfiles = mentorsRes.data;
      const myProfile = mentProfiles.find((m: any) => m.userId === user?.id);
      
      if (myProfile) {
        setProfile(myProfile);
        setWeeklySchedule(myProfile.weeklySchedule || []);
        setAvailableTimeSlots(myProfile.availableTimeSlots || []);
      }
    } catch (err) {
      console.error('Error fetching availability profile.', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const handleToggleDay = (day: string) => {
    if (weeklySchedule.includes(day)) {
      setWeeklySchedule(weeklySchedule.filter(d => d !== day));
    } else {
      setWeeklySchedule([...weeklySchedule, day]);
    }
  };

  const handleAddTimeSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTime) return;
    if (availableTimeSlots.includes(newTime)) {
      setNewTime('');
      return;
    }

    const updated = [...availableTimeSlots, newTime].sort();
    setAvailableTimeSlots(updated);
    setNewTime('');
  };

  const handleRemoveTimeSlot = (time: string) => {
    setAvailableTimeSlots(availableTimeSlots.filter(t => t !== time));
  };

  const handleSaveAvailability = async () => {
    if (!profile) return;
    try {
      // Patch mentor profile fields directly
      await api.put('/profile/me', {
        weeklySchedule,
        availableTimeSlots
      });
      setFeedback('Calendar availability matrix updated successfully.');
      setTimeout(() => setFeedback(''), 2500);
      loadProfile();
    } catch (err) {
      alert('Failed saving availability shifts.');
    }
  };

  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-5 h-5 border-2 border-slate-700 border-t-teal-400 rounded-full animate-spin mb-3"></div>
        <p className="text-xs font-mono text-slate-500">SYNCHRONIZING SCHEDULING COORDINATES...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-slate-900 border border-slate-800 p-8 text-center rounded space-y-4">
        <p className="text-sm font-mono text-slate-400">Mentor Profile Record is currently locked or awaits verification status.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in" id="availability-workspace">
      
      {/* TITLE ROW */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">Workforce Schedule Editor</h1>
        <p className="text-xs text-slate-400 font-mono mt-1">AVAILABLE WORK WEEKDAY AND HOUR BLOCKS MANAGED</p>
      </div>

      {feedback && (
        <div className="bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs px-3 py-2 rounded font-mono" id="availability-notice">
          {feedback}
        </div>
      )}

      {/* CORE SPLIT CONTROLS */}
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        
        {/* WEEKDAYS CONTROLS */}
        <div className="bg-slate-900 border border-slate-800 rounded p-6 space-y-6">
          <div className="flex items-center gap-2 text-slate-200 border-b border-slate-850 pb-3">
            <Calendar size={16} className="text-teal-400" />
            <span className="text-xs font-mono font-bold">AVAILABLE WORKDAYS</span>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-slate-400 font-mono mb-4">Choose the recurring weekly days you can accept student slots:</p>
            
            <div className="space-y-2" id="available-weekday-box">
              {weekdays.map(day => {
                const isSelected = weeklySchedule.includes(day);
                return (
                  <button
                    key={day}
                    onClick={() => handleToggleDay(day)}
                    className={`w-full text-left p-3 rounded border text-xs font-mono flex items-center justify-between transition-colors focus:outline-none ${
                      isSelected 
                        ? 'bg-teal-500/10 border-teal-500/20 text-teal-400 font-bold' 
                        : 'bg-slate-950 border-slate-855 text-slate-500 hover:text-slate-355'
                    }`}
                  >
                    <span>{day}</span>
                    <span>{isSelected ? 'ACTIVE' : 'BLOCKED'}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* TIME INTERVAL BLOCKS COLUMN */}
        <div className="space-y-6">
          
          {/* ASSIGN SLOT INPUT */}
          <div className="bg-slate-900 border border-slate-800 rounded p-6 space-y-4">
            <div className="flex items-center gap-2 text-slate-200 border-b border-slate-850 pb-3">
              <Clock size={16} className="text-teal-400" />
              <span className="text-xs font-mono font-bold">SECURE WORK HOUR INTERVALS</span>
            </div>

            <form onSubmit={handleAddTimeSlot} className="flex gap-2">
              <input
                type="text"
                placeholder="09:00, 14:30 or 18:00 (24h format)"
                required
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-805 rounded px-2.5 py-1.5 text-xs text-slate-200 font-mono outline-none focus:border-teal-400"
              />
              <button
                type="submit"
                className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-4 py-1.5 rounded text-xs font-mono font-bold focus:outline-none"
              >
                + ADD
              </button>
            </form>

            <div className="space-y-2 pt-2">
              <p className="text-[10px] font-mono text-slate-500">Active hours mapped for student scheduling:</p>
              
              {availableTimeSlots.length === 0 ? (
                <p className="text-center italic text-xs text-slate-600 font-mono py-4">No hours assigned.</p>
              ) : (
                <div className="grid grid-cols-3 gap-2" id="available-hours-grid">
                  {availableTimeSlots.map(time => (
                    <div 
                      key={time} 
                      className="bg-slate-950 border border-slate-855 px-2.5 py-1.5 rounded flex items-center justify-between text-xs font-mono text-slate-300 group"
                    >
                      <span>⏱ {time}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTimeSlot(time)}
                        className="text-rose-450 hover:text-rose-400 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove segment"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CRITICAL ACTIONS SAVE BAR */}
          <div className="bg-slate-900 border border-slate-800 rounded p-5 flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500">Unsaved scheduling changes do not impact candidate calendars.</span>
            
            <button
              onClick={handleSaveAvailability}
              className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-6 py-2 rounded text-xs font-mono font-bold flex items-center gap-1.5 focus:outline-none"
            >
              <span>Commit Schedule Matrix</span>
              <ArrowRight size={14} />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
