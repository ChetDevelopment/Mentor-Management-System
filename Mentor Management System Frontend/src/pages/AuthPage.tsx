/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, UserCheck, KeyRound, ArrowRight, Sparkles, UserPlus, Info, Lock } from 'lucide-react';

// Validation Schemas
const loginSchema = z.object({
  email: z.string().email({ message: 'Enter a valid corporate or generic email.' }),
  password: z.string().min(5, { message: 'Password must be at least 5 characters.' }),
});

const registerSchema = z.object({
  role: z.enum(['MENTOR', 'MENTEE']),
  email: z.string().email({ message: 'Valid email is required.' }),
  firstName: z.string().min(2, { message: 'First name must be at least 2 letters.' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 letters.' }),
  phone: z.string().min(8, { message: 'Enter phone contacts for SMS verification.' }),
  
  // Mentee Specific Attributes (Optional in schema, conditional in UI)
  interests: z.string().optional(),
  learningGoals: z.string().optional(),

  // Mentor Specific Attributes (Optional in schema, strict conditionally in UI)
  nationalId: z.string().optional(),
  experience: z.string().optional(),
  skills: z.string().optional(),
  category: z.string().optional(),
  shortDescription: z.string().optional(),
  fullDescription: z.string().optional(),
  cvUrl: z.string().optional(),
  portfolioUrl: z.string().optional(),
});

type LoginSchemaInput = z.infer<typeof loginSchema>;
type RegisterSchemaInput = z.infer<typeof registerSchema>;

export const AuthPage: React.FC = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRegRole, setSelectedRegRole] = useState<'MENTOR' | 'MENTEE'>('MENTEE');
  const [globalError, setGlobalError] = useState('');
  const [mentorPendingFeedback, setMentorPendingFeedback] = useState<any | null>(null);

  const redirectPath = (location.state as any)?.from?.pathname || '/dashboard';

  // React Hook Form for login
  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: loginSubmitting },
    reset: resetLoginForm
  } = useForm<LoginSchemaInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  // React Hook Form for Register
  const {
    register: regRegister,
    handleSubmit: handleRegSubmit,
    formState: { errors: regErrors, isSubmitting: regSubmitting },
    reset: resetRegForm
  } = useForm<RegisterSchemaInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { 
      role: 'MENTEE',
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      category: 'Web Development'
    }
  });

  const onLoginSubmit = async (data: LoginSchemaInput) => {
    setGlobalError('');
    try {
      const loggedUser = await login(data.email, 'password123'); // Bypass password restriction in simulated DB
      
      // If user is Mentor, check if pending or approved
      if (loggedUser.role === 'MENTOR') {
        const storedMentors = JSON.parse(localStorage.getItem('mentorkhet_mentors') || '[]');
        const mProfile = storedMentors.find((m: any) => m.userId === loggedUser.id);
        if (mProfile && mProfile.verificationStatus === 'PENDING') {
          // Display pendency screen
          setMentorPendingFeedback(mProfile);
          return;
        }
      }
      navigate('/dashboard');
    } catch (err: any) {
      setGlobalError(err.message || 'Verification Error. Correct credentials incorrect.');
    }
  };

  const onRegisterSubmit = async (data: any) => {
    setGlobalError('');
    
    // Perform manual validations for Mentor
    if (selectedRegRole === 'MENTOR') {
      if (!data.nationalId) {
        setGlobalError('National ID (NID) is strictly required for Mentor verification.');
        return;
      }
      if (!data.experience || Number(data.experience) <= 0) {
        setGlobalError('Experience in years must be a valid positive integer.');
        return;
      }
      if (!data.skills) {
        setGlobalError('Skills list is mandatory to verify instruction domains.');
        return;
      }
      if (!data.shortDescription || data.shortDescription.length < 10) {
        setGlobalError('Short description is required for student search panels.');
        return;
      }
      if (!data.fullDescription || data.fullDescription.length < 30) {
        setGlobalError('Full description must explain your professional curriculum.');
        return;
      }
    }

    // Format custom arrays
    const formattedData = {
      ...data,
      role: selectedRegRole,
      skills: data.skills ? data.skills.split(',').map((s: string) => s.trim()) : [],
      interests: data.interests ? data.interests.split(',').map((s: string) => s.trim()) : [],
      learningGoals: data.learningGoals ? data.learningGoals.split(',').map((s: string) => s.trim()) : [],
    };

    try {
      const newUser = await register(formattedData);
      
      if (selectedRegRole === 'MENTOR') {
        // Show pending alert view immediately on submission!
        const storedMentors = JSON.parse(localStorage.getItem('mentorkhet_mentors') || '[]');
        const mProfile = storedMentors.find((m: any) => m.userId === newUser.id);
        setMentorPendingFeedback(mProfile || { verificationStatus: 'PENDING', firstName: data.firstName });
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setGlobalError(err.message || 'Validation Failed. Address registered.');
    }
  };

  const setAuthMode = (loginMode: boolean) => {
    setIsLogin(loginMode);
    setGlobalError('');
    setMentorPendingFeedback(null);
  };

  // PENDING VERIFICATION ALERT BOX (TRUST SCREEN)
  if (mentorPendingFeedback) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded p-6 lg:p-8 text-center" id="pending-info-box">
          <div className="w-14 h-14 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={24} />
          </div>
          
          <h2 className="text-xl font-bold text-slate-100 tracking-tight mb-2">Registration Logged!</h2>
          <p className="text-xs text-amber-400 font-mono tracking-wider uppercase mb-6">Status: Account Pending Audit</p>
          
          <div className="bg-slate-950 p-4 border border-slate-800 rounded text-left text-xs text-slate-400 space-y-3 leading-relaxed mb-6">
            <p className="font-semibold text-slate-200">Hi {mentorPendingFeedback.firstName},</p>
            <p>
              To protect mentees and prevent scams or credit forgery, **MentorKhet manual audit protocols** are active.
            </p>
            <p>
              Our board of admins is currently analyzing your National ID (**{mentorPendingFeedback.nationalId || 'Provided'}**) and listed resume credentials.
            </p>
            <p className="text-slate-500 font-mono">
              Wait time: 2 - 3 business hours. You can sign out and log back in to verify status later.
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => {
                // Return to landing page or disconnect mock session
                localStorage.removeItem('mentorkhet_access_token');
                localStorage.removeItem('mentorkhet_user_profile');
                setMentorPendingFeedback(null);
                setAuthMode(true);
              }}
              id="pending-auth-return"
              className="w-full bg-slate-800 hover:bg-slate-750 text-slate-200 py-2 rounded text-xs font-mono transition-colors"
            >
              ← Back to login
            </button>
            <p className="text-[10px] font-mono text-slate-600">AUDITED BY GLOBAL SECURITY TEAM #719-MK</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row justify-stretch items-stretch text-slate-100 selection:bg-teal-500 selection:text-slate-950">
      
      {/* COVERT SAAS INTRO PANEL */}
      <div className="hidden md:flex flex-col justify-between w-2/5 p-12 bg-slate-900 border-r border-slate-900 sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c0d10_1px,transparent_1px),linear-gradient(to_bottom,#0c0d10_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30"></div>
        <div className="relative z-10 flex items-center gap-2">
          <span className="w-6 h-6 bg-teal-500 rounded flex items-center justify-center font-mono font-bold text-xs text-slate-950">K</span>
          <span className="text-sm font-mono font-bold text-slate-200">MentorKhet Ecosystem</span>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-1.5 bg-teal-500/10 text-teal-400 border border-teal-500/10 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase">
            <ShieldCheck size={11} />
            <span>Identity Secured System</span>
          </div>
          <h2 className="text-3xl font-sans font-bold leading-tight tracking-tight text-slate-100">
            "Zero fraud, premium 1-on-1 expert advisory desk."
          </h2>
          <div className="space-y-3 font-mono text-xs text-slate-400">
            <p className="flex items-center gap-2 text-slate-300">
              <span className="text-teal-400">✓</span> Verified National ID check
            </p>
            <p className="flex items-center gap-2 text-slate-300">
              <span className="text-teal-400">✓</span> Comprehensive portfolio audits
            </p>
            <p className="flex items-center gap-2 text-slate-300">
              <span className="text-teal-400">✓</span> No unmoderated courses or spam
            </p>
          </div>
        </div>

        <div className="relative z-10 text-[9px] font-mono text-slate-600 uppercase">
          SECURE ENCRYPTED NETWORK MODULE 2496 // ID-VERIFY
        </div>
      </div>

      {/* SECURE DOCK AUTH CARD PANEL */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-16 overflow-y-auto">
        <div className="max-w-lg w-full bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded transition-all duration-150">
          
          {/* HEADER SELECTION */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-100">
                {isLogin ? 'Welcome Back' : 'Create Identity'}
              </h1>
              <p className="text-xs text-slate-400">
                {isLogin ? 'Access secure mentorship desk' : 'Register a secure account'}
              </p>
            </div>
            
            <div className="flex items-center bg-slate-950 p-1 rounded border border-slate-800">
              <button 
                onClick={() => setAuthMode(true)}
                className={`px-3 py-1 text-[11px] font-mono rounded transition-colors ${
                  isLogin ? 'bg-slate-800 text-teal-400' : 'text-slate-500 hover:text-slate-300'
                }`}
                id="btn-auth-mode-login"
              >
                LOGIN
              </button>
              <button 
                onClick={() => setAuthMode(false)}
                className={`px-3 py-1 text-[11px] font-mono rounded transition-colors ${
                  !isLogin ? 'bg-slate-800 text-teal-400' : 'text-slate-500 hover:text-slate-300'
                }`}
                id="btn-auth-mode-register"
              >
                SIGN UP
              </button>
            </div>
          </div>

          {globalError && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs px-3 py-2 rounded font-mono mb-6" id="auth-global-error">
              {globalError}
            </div>
          )}

          {/* LOGIN PATH */}
          {isLogin ? (
            <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-4" id="form-login">
              <div>
                <label className="block text-[11px] font-mono text-slate-500 uppercase tracking-widest mb-1.5">Registered Email</label>
                <input
                  type="email"
                  placeholder="name@corp.com"
                  {...loginRegister('email')}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded px-3 py-2 text-xs font-mono text-slate-200 outline-none transition-colors placeholder:text-slate-700"
                  id="login-email"
                />
                {loginErrors.email && (
                  <p className="text-[10px] text-rose-400 font-mono mt-1">{loginErrors.email.message}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-mono text-slate-500 uppercase tracking-widest">Account Password</label>
                  <span className="text-[10px] font-mono text-slate-600">Simulated bypass active</span>
                </div>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  {...loginRegister('password')}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded px-3 py-2 text-xs text-slate-200 outline-none transition-colors placeholder:text-slate-700"
                  id="login-password"
                />
                {loginErrors.password && (
                  <p className="text-[10px] text-rose-400 font-mono mt-1">{loginErrors.password.message}</p>
                )}
              </div>

              <div className="bg-slate-950/60 p-3 border border-slate-800 rounded text-[11px] text-slate-500 leading-normal mb-2 space-y-1">
                <p className="font-semibold text-slate-400 flex items-center gap-1">
                  <Info size={11} className="text-teal-400" /> Default Testing Accounts:
                </p>
                <p>• Admin Access: <b className="text-slate-400 select-all">admin@mentorkhet.com</b></p>
                <p>• Verified Expert: <b className="text-slate-400 select-all">mentor.sarah@mentorkhet.com</b></p>
                <p>• Regular Mentee: <b className="text-slate-400 select-all">rahul@mentorkhet.com</b></p>
              </div>

              <button
                type="submit"
                disabled={loginSubmitting}
                id="login-submit-btn"
                className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 py-2.5 rounded text-xs font-bold font-mono tracking-wider transition-colors flex items-center justify-center gap-1.5"
              >
                <span>VERIFY & CONNECT</span>
                <ArrowRight size={14} />
              </button>
            </form>
          ) : (
            /* REGISTER PATH */
            <form onSubmit={handleRegSubmit(onRegisterSubmit)} className="space-y-4" id="form-register">
              
              {/* ROLE SELECTION TABS */}
              <div>
                <label className="block text-[11px] font-mono text-slate-500 uppercase tracking-widest mb-1.5">Select Role Path</label>
                <div className="grid grid-cols-2 gap-3" id="role-select-box">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRegRole('MENTEE');
                      setGlobalError('');
                    }}
                    className={`p-3 border rounded text-left transition-all ${
                      selectedRegRole === 'MENTEE'
                        ? 'bg-slate-950 border-teal-500 text-teal-400 font-medium'
                        : 'bg-slate-950/40 border-slate-800 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <p className="text-xs font-bold flex items-center gap-1">
                      <UserCheck size={14} /> Mentee Account
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono mt-1">Simple pathway to book experts.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRegRole('MENTOR');
                      setGlobalError('');
                    }}
                    className={`p-3 border rounded text-left transition-all ${
                      selectedRegRole === 'MENTOR'
                        ? 'bg-slate-950 border-teal-500 text-teal-400 font-medium'
                        : 'bg-slate-950/40 border-slate-800 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <p className="text-xs font-bold flex items-center gap-1">
                      <ShieldCheck size={14} /> Mentor (Strict check)
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono mt-1">Pending approval. NID matching.</p>
                  </button>
                </div>
              </div>

              {/* SHARED GENERAL INFORMATION */}
              <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5">First name</label>
                  <input
                    type="text"
                    required
                    placeholder="Sarah"
                    {...regRegister('firstName')}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5">Last name</label>
                  <input
                    type="text"
                    required
                    placeholder="Vance"
                    {...regRegister('lastName')}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5">Email address</label>
                  <input
                    type="email"
                    required
                    placeholder="sarah@corp.com"
                    {...regRegister('email')}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5">Phone number</label>
                  <input
                    type="text"
                    required
                    placeholder="+880"
                    {...regRegister('phone')}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none font-mono"
                  />
                </div>
              </div>

              {/* PATH 2: MENTOR STRICT VERIFICATION */}
              {selectedRegRole === 'MENTOR' && (
                <div className="pt-4 border-t border-slate-800 space-y-3" id="mentor-verification-fields">
                  <div className="bg-amber-500/5 p-3 border border-amber-500/15 rounded text-[10px] text-amber-400 font-mono tracking-wide leading-relaxed">
                     NOTICE: Mentor status requires manual National ID (NID) matching. Enter coordinates exactly.
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-1">National ID (NID) *</label>
                      <input
                        type="text"
                        placeholder="NID-1122-334455"
                        {...regRegister('nationalId')}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-1">Experience (Years) *</label>
                      <input
                        type="number"
                        placeholder="5"
                        {...regRegister('experience')}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-1">Main Focus Area *</label>
                      <select
                        {...regRegister('category')}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded px-2.5 py-1.5 text-xs text-slate-300 outline-none"
                      >
                        <option value="Web Development">Web Development</option>
                        <option value="DevOps & Cloud">DevOps & Cloud</option>
                        <option value="UX/UI & Product Design">UX/UI & Product Design</option>
                        <option value="QA Testing & Automation">QA Testing & Automation</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-1">CV / Portfolio Link *</label>
                      <input
                        type="url"
                        placeholder="https://myportfolio.com"
                        {...regRegister('portfolioUrl')}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">Expert Skills (Comma separated list) *</label>
                    <input
                      type="text"
                      placeholder="React, TypeScript, Testing, Figma"
                      {...regRegister('skills')}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">One-liner Bio description *</label>
                    <input
                      type="text"
                      placeholder="Senior Engineering Lead at Netflix."
                      {...regRegister('shortDescription')}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">Full curriculum & Background details *</label>
                    <textarea
                      placeholder="Describe your corporate background and mentorship curriculum in detail..."
                      rows={3}
                      {...regRegister('fullDescription')}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none resize-none"
                    />
                  </div>
                </div>
              )}

              {/* PATH 1: MENTEE SIMPLE REGISTER */}
              {selectedRegRole === 'MENTEE' && (
                <div className="pt-4 border-t border-slate-800 space-y-3" id="mentee-details-fields">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">Interest Skills (Comma separated)</label>
                    <input
                      type="text"
                      placeholder="React, Docker, UX Design"
                      {...regRegister('interests')}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">Learning Goals & Targets</label>
                    <input
                      type="text"
                      placeholder="Land a frontend job, Prepare for Docker certified administrator"
                      {...regRegister('learningGoals')}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={regSubmitting}
                id="register-submit-btn"
                className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 py-2.5 rounded text-xs font-bold font-mono tracking-wider transition-colors flex items-center justify-center gap-1.5 mt-2"
              >
                <span>REGISTER SECURITY LOCK</span>
                <UserPlus size={14} />
              </button>
            </form>
          )}

        </div>
      </div>

    </div>
  );
};
