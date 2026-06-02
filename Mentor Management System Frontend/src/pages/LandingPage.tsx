/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Users, Search, Award, Star, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Selected top verified mentors
  const demoMentors = [
    {
      name: 'Sarah Kaufman',
      role: 'Senior Frontend Tech Lead at Netflix',
      experience: '8 Years',
      category: 'Web Development',
      skills: ['React', 'TypeScript', 'TailwindCSS'],
      rating: '4.9',
      reviews: 16,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'
    },
    {
      name: 'Marcus Vance',
      role: 'Principal DevOps Architect',
      experience: '12 Years',
      category: 'DevOps & Cloud',
      skills: ['Kubernetes', 'AWS', 'Docker'],
      rating: '4.8',
      reviews: 9,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-teal-500 selection:text-slate-950">
      
      {/* LANDING NAVIGATION */}
      <nav className="border-b border-slate-900 bg-slate-950 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 bg-teal-500 rounded flex items-center justify-center font-mono font-bold text-slate-950">K</span>
            <span className="text-xl font-mono font-bold tracking-tight text-slate-200">
              Mentor<span className="text-teal-400">Khet</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <Link 
                to="/dashboard" 
                id="landing-btn-dashboard"
                className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-4 py-1.5 rounded text-sm font-medium transition-colors font-mono"
              >
                Go to Console →
              </Link>
            ) : (
              <>
                <Link 
                  to="/auth" 
                  id="landing-btn-login"
                  className="text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors font-mono"
                >
                  Sign In
                </Link>
                <Link 
                  to="/auth" 
                  id="landing-btn-signup"
                  className="bg-slate-900 border border-slate-800 hover:bg-slate-800/80 text-slate-200 px-4 py-1.5 rounded text-sm font-medium transition-colors font-mono"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-24 lg:py-32 border-b border-slate-900">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-teal-500/10 text-teal-400 border border-teal-500/20 px-3 py-1 rounded-full text-xs font-mono mb-8 animate-fade-in">
            <ShieldCheck size={13} />
            <span>SECURE IDENTITY SYSTEM ACTIVATED</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-sans font-bold tracking-tight text-slate-100 mb-6">
            Connecting Ambitious Mentees with <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Verified Experts</span>
          </h1>
          
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            MentorKhet is a defense-grade mentorship network. Our strict, manual National ID (NID) approval panel ensures a spam-free, expert-level ecosystem. Learn directly from audited operators.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate(user ? '/mentors' : '/auth')}
              id="hero-btn-find"
              className="w-full sm:w-auto bg-teal-500 hover:bg-teal-400 text-slate-950 px-6 py-3 rounded text-sm font-bold transition-all flex items-center justify-center gap-2"
            >
              <Search size={16} />
              <span>Discover Verified Mentors</span>
            </button>
            <button 
              onClick={() => navigate(user ? '/dashboard' : '/auth')}
              id="hero-btn-become"
              className="w-full sm:w-auto bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 px-6 py-3 rounded text-sm font-medium transition-all flex items-center justify-center gap-2 font-mono"
            >
              <span>Apply as Verified Instructor</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="bg-slate-900 border-b border-slate-900 py-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl font-mono font-bold text-teal-400">100%</p>
            <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Identity Verified</p>
          </div>
          <div>
            <p className="text-3xl font-mono font-bold text-slate-200">12+</p>
            <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Years Avg. Exp</p>
          </div>
          <div>
            <p className="text-3xl font-mono font-bold text-slate-200">4,930+</p>
            <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Sessions Completed</p>
          </div>
          <div>
            <p className="text-3xl font-mono font-bold text-teal-400">0%</p>
            <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Scam Incident Rate</p>
          </div>
        </div>
      </section>

      {/* SECURE TRUST SYSTEM INFOGRAPHIC */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-mono text-teal-400 uppercase tracking-widest mb-3">SYSTEM DEFENSE LOGISTICS</p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-100">Our Core Trust Mandates</h2>
          <p className="text-sm text-slate-400 mt-2">How we keep learners safe from fraudulent course sellers and unqualified mentors.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="border border-slate-900 bg-slate-900/40 p-6 rounded relative">
            <span className="text-xs font-mono text-teal-500 bg-teal-500/10 px-2 py-0.5 rounded absolute top-6 right-6">STEP 01</span>
            <div className="w-10 h-10 bg-slate-900 rounded border border-slate-800 flex items-center justify-center text-teal-400 mb-6">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">National ID Matching</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every mentor applicant must submit official government National ID papers. This ensures ultimate accountability and prevents user ban evasion.
            </p>
          </div>

          <div className="border border-slate-900 bg-slate-900/40 p-6 rounded relative">
            <span className="text-xs font-mono text-teal-500 bg-teal-500/10 px-2 py-0.5 rounded absolute top-6 right-6">STEP 02</span>
            <div className="w-10 h-10 bg-slate-900 rounded border border-slate-800 flex items-center justify-center text-teal-400 mb-6">
              <Award size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">Credentials Manual Audit</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our Admin Panel manually analyzes the applicant’s portfolio, years of industry experience, and company email records before giving the status of "APPROVED".
            </p>
          </div>

          <div className="border border-slate-900 bg-slate-900/40 p-6 rounded relative">
            <span className="text-xs font-mono text-teal-500 bg-teal-500/10 px-2 py-0.5 rounded absolute top-6 right-6">STEP 03</span>
            <div className="w-10 h-10 bg-slate-900 rounded border border-slate-800 flex items-center justify-center text-teal-400 mb-6">
              <Star size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">Moderated Escrow Sessions</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mentees keep track of sessions, issue complaints instantly in case of issues, and post moderated reviews to encourage continuous high-tier interaction.
            </p>
          </div>
        </div>
      </section>

      {/* LIVE APPROVED MENTORS CARDS PREVIEW */}
      <section className="py-20 border-t border-slate-900 bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-xs font-mono text-teal-400 uppercase tracking-widest mb-3">TOP INSTRUCTION STAFF</p>
              <h2 className="text-3xl font-bold tracking-tight text-slate-100">Audited Mentors Active</h2>
            </div>
            <button 
              onClick={() => navigate(user ? '/mentors' : '/auth')}
              className="text-teal-400 hover:text-teal-300 text-sm font-medium flex items-center gap-1 group font-mono focus:outline-none"
            >
              <span>View full directory</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            {demoMentors.map((mentor, idx) => (
              <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded p-6 flex flex-col sm:flex-row gap-6 hover:border-slate-700 transition-colors">
                <img 
                  src={mentor.avatar} 
                  alt={mentor.name} 
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded bg-slate-800 object-cover border border-slate-800 flex-shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-semibold text-teal-400 font-mono bg-teal-400/5 border border-teal-400/10 px-2 py-0.5 rounded">
                      {mentor.category}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                      <Star size={11} className="fill-amber-400 stroke-none" /> {mentor.rating} ({mentor.reviews} reviews)
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-100 tracking-tight">{mentor.name}</h3>
                  <p className="text-xs text-slate-400 mb-4">{mentor.role}</p>
                  
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {mentor.skills.map(s => (
                      <span key={s} className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                        {s}
                      </span>
                    ))}
                  </div>

                  <p className="text-[11px] font-mono text-slate-500">Exp: {mentor.experience} manual evaluation score</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LANDING CTA FOOTER */}
      <section className="py-24 border-t border-slate-900 bg-slate-950 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-teal-500/5 mix-blend-color-dodge filter blur-3xl opacity-30 pointer-events-none rounded-full max-w-lg mx-auto"></div>
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl font-sans font-bold tracking-tight text-slate-100 mb-6">Empower Your System Team and Skills Securely</h2>
          <p className="text-sm text-slate-400 max-w-lg mx-auto mb-10 leading-relaxed">
            Create an account in 3 minutes. Apply as a mentee to get direct expert counseling, or submit your national ID to share authority as an approved mentor.
          </p>

          <button 
            onClick={() => navigate('/auth')}
            id="landing-cta-bottom"
            className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-8 py-3 rounded text-sm font-bold tracking-wider transition-colors inline-flex items-center gap-2 uppercase font-mono"
          >
            <span>JOIN MENTORKHET TODAY</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </section>

      {/* FOOTER GENERAL MARGIN */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 text-center">
        <p className="text-xs font-mono text-slate-600">© 2026 MENTORKHET CENTRAL CONTROL. ALL SECURITY SYSTEM DATA LOGS SECURED.</p>
        <p className="text-[10px] font-mono text-slate-700 mt-2">AUTHORIZED BY NATIONAL VERIFICATION PANEL #719-MK</p>
      </footer>

    </div>
  );
};
