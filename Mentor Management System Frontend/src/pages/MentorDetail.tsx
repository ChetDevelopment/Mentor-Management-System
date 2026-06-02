/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MentorProfile, Review } from '../types';
import { Star, ShieldCheck, Mail, Calendar, Clock, ChevronLeft, CalendarRange, HeartHandshake, FileCheck, CheckCircle } from 'lucide-react';

export const MentorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [mentor, setMentor] = useState<MentorProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Booking states
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [bookingResponse, setBookingResponse] = useState<any | null>(null);
  const [bookingError, setBookingError] = useState('');

  // Loaded calendar dates builder (next 3 weekdays aligning with weekly schedule)
  const [dateOptions, setDateOptions] = useState<{ dayName: string; dateStr: string }[]>([]);

  useEffect(() => {
    const fetchProfileAndReview = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const mRes = await api.get(`/mentors/${id}`);
        setMentor(mRes.data);

        const rRes = await api.get('/reviews');
        const mReviews = rRes.data.filter((r: Review) => r.mentorId === id);
        setReviews(mReviews);

        // Prep booking dates (e.g., coming Monday, Wednesday, Friday)
        if (mRes.data) {
          const schedule = mRes.data.weeklySchedule || ['Monday', 'Wednesday'];
          const options: { dayName: string; dateStr: string }[] = [];
          
          let counter = 1;
          while (options.length < 3 && counter < 8) {
            const date = new Date();
            date.setDate(date.getDate() + counter);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
            
            if (schedule.includes(dayName)) {
              options.push({
                dayName,
                dateStr: date.toISOString().split('T')[0]
              });
            }
            counter++;
          }
          setDateOptions(options);
        }
      } catch (err: any) {
        console.error('Error fetching details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileAndReview();
  }, [id]);

  const handleBookingConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError('');
    setBookingResponse(null);

    if (!user) {
      navigate('/auth', { state: { from: { pathname: `/mentors/${id}` } } });
      return;
    }

    if (user.role !== 'MENTEE') {
      setBookingError('Only verified student (mentee) accounts can reserve advisory slot coordinates.');
      return;
    }

    if (!selectedDate || !selectedTime) {
      setBookingError('Please specify slot date and core time coordinate.');
      return;
    }

    try {
      const res = await api.post('/sessions/book', {
        mentorId: mentor?.id,
        date: selectedDate,
        timeSlot: selectedTime
      });
      setBookingResponse(res.data);
    } catch (err: any) {
      setBookingError(err.response?.data?.message || 'Conflict reserving slot.');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-5 h-5 border-2 border-slate-700 border-t-teal-400 rounded-full animate-spin mb-3"></div>
        <p className="text-xs font-mono text-slate-500">RECALLING INSTRUCTOR DOSSIER...</p>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="bg-slate-900 border border-slate-800 p-8 text-center rounded space-y-4">
        <p className="text-sm font-mono text-slate-400">Selected Mentor Profile is not registered or awaits verification flags.</p>
        <Link to="/mentors" className="text-xs text-teal-400 font-mono hover:underline inline-block">← Back to index</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in" id="mentor-detail-root">
      
      {/* HEADER NAVIGATION BACK */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/mentors')}
          className="text-xs font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1 focus:outline-none"
        >
          <ChevronLeft size={16} />
          <span>Back to directory</span>
        </button>
        
        <span className="text-[10px] font-mono text-slate-600">ID RECORD: {mentor.id}</span>
      </div>

      {/* TWO PANEL MAIN DISPLAY */}
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        
        {/* DOOSIER PROFILE PANEL COLUMN */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* PROFILE CARD */}
          <div className="bg-slate-900 border border-slate-800 rounded p-6 lg:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <img 
                src={mentor.avatar} 
                alt={mentor.firstName} 
                className="w-20 h-20 sm:w-24 sm:h-24 rounded object-cover border border-slate-800 bg-slate-950 flex-shrink-0"
                referrerPolicy="no-referrer"
              />
              
              <div className="space-y-2 flex-grow min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-100">{mentor.firstName} {mentor.lastName}</h1>
                  <span className="inline-flex items-center gap-0.5 bg-teal-500/10 border border-teal-500/20 text-teal-300 rounded px-2 py-0.5 text-[9px] font-mono uppercase font-bold">
                    <ShieldCheck size={9} /> ACCREDITED
                  </span>
                </div>

                <p className="text-xs text-slate-350">{mentor.shortDescription}</p>
                <p className="text-xs font-mono text-teal-400">{mentor.category} Domain</p>

                <div className="pt-2 flex items-center flex-wrap gap-4 text-xs font-mono text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Star size={13} className="fill-amber-400 stroke-none" />
                    <b className="text-slate-300">{mentor.rating}</b> ({mentor.reviewCount} Reviews)
                  </span>
                  <span>•</span>
                  <span>Exp: {mentor.experience} Years</span>
                  <span>•</span>
                  {mentor.portfolioUrl && (
                    <a 
                      href={mentor.portfolioUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-teal-400 hover:underline"
                    >
                      Portfolio →
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* CURRICULUM DESCRIPTION */}
            <div className="pt-6 border-t border-slate-850 space-y-3">
              <h2 className="text-xs font-mono text-slate-400 uppercase tracking-wider">Expertise & Syllabus Profile</h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">{mentor.fullDescription}</p>
            </div>

            {/* SKILLS TAGS */}
            <div className="pt-6 border-t border-slate-850 space-y-3">
              <h2 className="text-xs font-mono text-slate-400 uppercase tracking-wider">Verified Specializations</h2>
              <div className="flex flex-wrap gap-1.5">
                {mentor.skills.map((skill) => (
                  <span 
                    key={skill} 
                    className="bg-slate-950 border border-slate-800 text-slate-400 text-xs px-2.5 py-1 rounded font-mono"
                  >
                    💡 {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* REVIEWS DISCLOSURE */}
          <div className="space-y-4">
            <h2 className="text-xs font-mono text-slate-400 uppercase tracking-widest block">Accredited Student Feedbacks</h2>
            
            {reviews.length === 0 ? (
              <p className="text-xs font-mono text-slate-500 italic p-6 border border-slate-900 rounded bg-slate-900/10">No reviews matching index records on this node.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-slate-900 border border-slate-850 p-5 rounded space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={rev.menteeAvatar} 
                          alt={rev.menteeName}
                          className="w-7 h-7 rounded bg-slate-800 object-cover border border-slate-800"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="text-xs font-semibold text-slate-200">{rev.menteeName}</p>
                          <p className="text-[9px] font-mono text-slate-500">PEER VERIFIED AUDIT</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 text-xs text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} size={11} className="fill-current" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed italic">"{rev.comment}"</p>
                    <p className="text-[9px] font-mono text-slate-500 text-right">{new Date(rev.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* BOOKED COMPONENT CALENDAR COLUMN */}
        <div className="space-y-4">
          <h2 className="text-xs font-mono text-slate-400 uppercase tracking-widest block">Scheduling Deck</h2>

          {bookingResponse ? (
            /* BOOKING SUCCESS SCREEN */
            <div className="bg-slate-900 border border-teal-500/30 p-5 rounded text-center space-y-4" id="booking-success-box">
              <div className="w-10 h-10 bg-teal-500/15 text-teal-400 border border-teal-500/25 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-200">Session Request Dispatched!</h3>
                <p className="text-xs text-slate-400 mt-1">Status queue currently set to PENDING.</p>
              </div>
              
              <div className="bg-slate-950 p-3 border border-slate-800 rounded font-mono text-[10px] text-slate-400 text-left space-y-1.5">
                <p>• **Instructor**: {mentor.firstName} {mentor.lastName}</p>
                <p>• **Target slot**: {bookingResponse.date} at {bookingResponse.timeSlot}</p>
                <p>• **Reference ID**: {bookingResponse.id}</p>
              </div>

              <div className="space-y-2 pt-2">
                <Link 
                  to="/dashboard"
                  className="block bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-mono font-bold py-2 rounded transition-colors"
                >
                  Go to console Dashboard
                </Link>
                <button
                  onClick={() => setBookingResponse(null)}
                  className="text-[10px] font-mono text-slate-500 hover:text-slate-300"
                >
                  Book another slot
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded p-5 lg:p-6">
              <form onSubmit={handleBookingConfirm} className="space-y-4" id="form-booking-slot">
                <div className="flex items-center gap-2 text-slate-200 border-b border-slate-850 pb-3 mb-2">
                  <CalendarRange size={16} className="text-teal-400" />
                  <span className="text-xs font-mono tracking-tight font-bold">RESERVE WORK slot</span>
                </div>

                {bookingError && (
                  <p className="bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono text-[10px] px-3 py-1.5 rounded">{bookingError}</p>
                )}

                {/* DYNAMIC DATE ACCORDIONS */}
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase mb-2">Select Target Date Slot</label>
                  {dateOptions.length === 0 ? (
                    <p className="text-[10px] text-slate-500 font-mono italic">Schedule files presently locked. Try matching weekdays.</p>
                  ) : (
                    <div className="space-y-1.5" id="date-slot-choices">
                      {dateOptions.map((opt) => (
                        <button
                          key={opt.dateStr}
                          type="button"
                          onClick={() => setSelectedDate(opt.dateStr)}
                          className={`w-full text-left p-2.5 rounded border text-xs font-mono flex items-center justify-between transition-colors focus:outline-none ${
                            selectedDate === opt.dateStr
                              ? 'bg-teal-500/10 border-teal-500/20 text-teal-450 font-bold'
                              : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-750 hover:text-slate-200'
                          }`}
                        >
                          <span>{opt.dateStr}</span>
                          <span className="text-[9px] uppercase tracking-wider text-slate-500">{opt.dayName}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* TIMESLOT TICK PANEL */}
                {selectedDate && (
                  <div className="space-y-2 animate-fade-in">
                    <label className="block text-[10px] font-mono text-slate-500 uppercase">Available Time Intervals</label>
                    <div className="grid grid-cols-2 gap-2" id="time-slot-choices">
                      {mentor.availableTimeSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={`p-2 rounded border text-xs font-mono text-center transition-colors focus:outline-none ${
                            selectedTime === time
                              ? 'bg-teal-500/10 border-teal-500/20 text-teal-450 font-bold'
                              : 'bg-slate-950 border-slate-855 text-slate-500 hover:border-slate-700 hover:text-slate-355'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-850 space-y-3">
                  <p className="text-[10px] font-mono text-slate-500 leading-normal">
                    By requesting a slot, you establish an interactive dialogue on the session list. No initial billing is recorded today.
                  </p>
                  
                  <button
                    type="submit"
                    id="submit-booking-action"
                    className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 py-2.5 rounded text-xs font-bold font-mono tracking-wider transition-colors uppercase flex items-center justify-center gap-1.5 focus:outline-none"
                  >
                    <span>Reserve Time Interval</span>
                    <HeartHandshake size={14} />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
