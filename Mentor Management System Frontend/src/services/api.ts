/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { 
  User, 
  MentorProfile, 
  MenteeProfile, 
  MentorshipSession, 
  SkillCategory, 
  Review, 
  ChatMessage, 
  SystemStats,
  VerificationStatus,
  SessionStatus
} from '../types';

// Create AXIOS instance
export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Setup Initial LocalStorage Mock DB Seeds if not present
const SEED_DATA_KEY = 'mentorkhet_db_seeded';

function getStorage<T>(key: string, fallback: T): T {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : fallback;
}

function setStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Default Seed Data
const DEFAULT_CATEGORIES: SkillCategory[] = [
  {
    id: 'cat-1',
    name: 'Web Development',
    description: 'HTML/CSS, React, Modern JS, Node.js, and Fullstack systems Architecture.',
    skills: ['React', 'Next.js', 'Node.js', 'TypeScript', 'TailwindCSS', 'GraphQL', 'Vite']
  },
  {
    id: 'cat-2',
    name: 'DevOps & Cloud',
    description: 'Infrastructure automation, continuous integration, and scalable deployment systems.',
    skills: ['Docker', 'AWS', 'Kubernetes', 'CI/CD Pipelines', 'Linux', 'Terraform', 'GCP']
  },
  {
    id: 'cat-3',
    name: 'UX/UI & Product Design',
    description: 'User research, wireframing, high-fidelity mockups, and interaction micro-animations.',
    skills: ['Figma', 'Wireframing', 'User Research', 'Prototyping', 'Design Systems', 'Micro-interactions']
  },
  {
    id: 'cat-4',
    name: 'QA Testing & Automation',
    description: 'Ensuring software fidelity through smoke testing, functional integration and automated systems.',
    skills: ['Jest', 'Cypress', 'Playwright', 'Selenium', 'Unit Testing', 'Manual Auditing']
  }
];

const DEFAULT_USERS: User[] = [
  {
    id: 'usr-admin',
    email: 'admin@mentorkhet.com',
    username: 'admin',
    role: 'ADMIN',
    firstName: 'System',
    lastName: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  },
  // Approved Mentors
  {
    id: 'usr-sarah',
    email: 'mentor.sarah@mentorkhet.com',
    username: 'sarah_dev',
    role: 'MENTOR',
    firstName: 'Sarah',
    lastName: 'Kaufman',
    phone: '+8801712345678',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'usr-marcus',
    email: 'mentor.marcus@mentorkhet.com',
    username: 'marcus_cloud',
    role: 'MENTOR',
    firstName: 'Marcus',
    lastName: 'Vance',
    phone: '+8801811223344',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
  }
  ,
  // Pending Mentors (waiting for approval)
  {
    id: 'usr-alex',
    email: 'mentor.alex@mentorkhet.com',
    username: 'alex_code',
    role: 'MENTOR',
    firstName: 'Alex',
    lastName: 'Chen',
    phone: '+8801912445566',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
  },
  // Mentees
  {
    id: 'usr-rahul',
    email: 'rahul@mentorkhet.com',
    username: 'rahul_learner',
    role: 'MENTEE',
    firstName: 'Rahul',
    lastName: 'Ahmed',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200'
  }
];

const DEFAULT_MENTORS: MentorProfile[] = [
  {
    id: 'men-sarah',
    userId: 'usr-sarah',
    firstName: 'Sarah',
    lastName: 'Kaufman',
    email: 'mentor.sarah@mentorkhet.com',
    phone: '+8801712345678',
    nationalId: 'NID-9988-776655',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    experience: 8,
    skills: ['React', 'TypeScript', 'TailwindCSS', 'Vite', 'Next.js'],
    shortDescription: 'Senior Frontend Tech Lead at Netflix. Passionate about beautiful interfaces and atomic component logic.',
    fullDescription: 'Sarah has spent the last eight years scaling web engineering tools and styling systems. At MentorKhet, she specializes in guiding junior and mid-level web developers transition into enterprise roles. Her curriculum focuses on deep React mechanics, performance optimizations, state machine architectures, and CSS design tokens.',
    category: 'Web Development',
    cvUrl: 'https://example.com/cv/sarah_kaufman.pdf',
    portfolioUrl: 'https://sarahkaufman.design',
    rating: 4.9,
    reviewCount: 16,
    verificationStatus: 'APPROVED',
    weeklySchedule: ['Monday', 'Wednesday', 'Friday'],
    availableTimeSlots: ['10:00', '14:00', '16:00', '18:00']
  },
  {
    id: 'men-marcus',
    userId: 'usr-marcus',
    firstName: 'Marcus',
    lastName: 'Vance',
    email: 'mentor.marcus@mentorkhet.com',
    phone: '+8801811223344',
    nationalId: 'NID-5544-223311',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    experience: 12,
    skills: ['Kubernetes', 'AWS', 'Docker', 'CI/CD Pipelines', 'GCP'],
    shortDescription: 'Principal DevOps Architect. Certified Kubernetes Administrator. AWS Evangelist.',
    fullDescription: 'Marcus oversees container orchestrations and deep infrastructure security. He provides elite technical mentorship on cloud infrastructure, container strategy, zero-downtime scaling, pipeline design, and cost metrics dashboards.',
    category: 'DevOps & Cloud',
    cvUrl: 'https://example.com/cv/marcus_vance.pdf',
    portfolioUrl: 'https://marcusvance.cloud',
    rating: 4.8,
    reviewCount: 9,
    verificationStatus: 'APPROVED',
    weeklySchedule: ['Tuesday', 'Thursday'],
    availableTimeSlots: ['09:00', '11:00', '15:00', '17:00']
  },
  {
    id: 'men-alex',
    userId: 'usr-alex',
    firstName: 'Alex',
    lastName: 'Chen',
    email: 'mentor.alex@mentorkhet.com',
    phone: '+8801912445566',
    nationalId: 'NID-1122-334455',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    experience: 4,
    skills: ['CI/CD Pipelines', 'Linux', 'Terraform'],
    shortDescription: 'Junior Systems Admin at Stripe. Seeking to guide juniors in local deployment cycles.',
    fullDescription: 'Alex manages deployment automations and local microservice environments. He has recently joined MentorKhet to share his struggles and strategies as an early-career engineer, giving mentees practical, fresh, and close-to-the-ground guidance on landing their first software support jobs.',
    category: 'DevOps & Cloud',
    cvUrl: 'https://example.com/cv/alex_chen.pdf',
    portfolioUrl: 'https://alechen.dev',
    rating: 0,
    reviewCount: 0,
    verificationStatus: 'PENDING',
    weeklySchedule: ['Monday', 'Thursday'],
    availableTimeSlots: ['13:00', '15:00', '19:00']
  }
];

const DEFAULT_MENTEES: MenteeProfile[] = [
  {
    id: 'mte-rahul',
    userId: 'usr-rahul',
    firstName: 'Rahul',
    lastName: 'Ahmed',
    email: 'rahul@mentorkhet.com',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    interests: ['React', 'Next.js', 'Docker'],
    learningGoals: ['Acquire full-stack developer entry competency', 'Optimize complex frontend system architectures', 'Deploy personal projects to AWS clouds'],
    completedSessionsCount: 4
  }
];

const DEFAULT_SESSIONS: MentorshipSession[] = [
  {
    id: 'ses-1',
    mentorId: 'men-sarah',
    mentorName: 'Sarah Kaufman',
    mentorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    menteeId: 'mte-rahul',
    menteeName: 'Rahul Ahmed',
    menteeAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    date: '2026-05-30',
    timeSlot: '14:00',
    status: 'ACCEPTED'
  },
  {
    id: 'ses-2',
    mentorId: 'men-sarah',
    mentorName: 'Sarah Kaufman',
    mentorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    menteeId: 'mte-rahul',
    menteeName: 'Rahul Ahmed',
    menteeAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    date: '2026-05-24',
    timeSlot: '16:00',
    status: 'COMPLETED',
    notes: 'Rahul presented high-quality React routing components today. We resolved local state conflicts and reviewed context boundaries. Recommended reading: React render cycle optimization.'
  },
  {
    id: 'ses-3',
    mentorId: 'men-marcus',
    mentorName: 'Marcus Vance',
    mentorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    menteeId: 'mte-rahul',
    menteeName: 'Rahul Ahmed',
    menteeAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    date: '2026-05-20',
    timeSlot: '11:00',
    status: 'COMPLETED',
    notes: 'Reviewed dockerfile layering and microservice isolation. Rahul successfully built an optimized alpine node container.'
  }
];

const DEFAULT_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    mentorId: 'men-sarah',
    menteeId: 'mte-rahul',
    menteeName: 'Rahul Ahmed',
    menteeAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    comment: 'Sarah is an absolute game-changer! She pointed out core architectural flaws in my React setup within 10 minutes and completely changed how I think about custom hooks and performance. Highly, highly recommend!',
    createdAt: '2026-05-24T18:00:00Z',
    isApproved: true
  }
];

const DEFAULT_CHAT: ChatMessage[] = [
  {
    id: 'msg-1',
    senderId: 'usr-rahul',
    senderName: 'Rahul Ahmed',
    receiverId: 'usr-sarah',
    text: 'Hey Sarah! Looking forward to our mentorship session on state modularization!',
    timestamp: '2026-05-28T07:12:00Z'
  },
  {
    id: 'msg-2',
    senderId: 'usr-sarah',
    senderName: 'Sarah Kaufman',
    receiverId: 'usr-rahul',
    text: 'Hi Rahul! Me too. Please make sure to prepare the GitHub branch link so we can review the hook definitions directly. See you soon!',
    timestamp: '2026-05-28T07:30:00Z'
  }
];

// Initialize DB safely
if (!localStorage.getItem(SEED_DATA_KEY)) {
  setStorage('mentorkhet_users', DEFAULT_USERS);
  setStorage('mentorkhet_mentors', DEFAULT_MENTORS);
  setStorage('mentorkhet_mentees', DEFAULT_MENTEES);
  setStorage('mentorkhet_categories', DEFAULT_CATEGORIES);
  setStorage('mentorkhet_sessions', DEFAULT_SESSIONS);
  setStorage('mentorkhet_reviews', DEFAULT_REVIEWS);
  setStorage('mentorkhet_chat', DEFAULT_CHAT);
  localStorage.setItem(SEED_DATA_KEY, 'true');
}

// Custom request handler with API routes intercepts (Simulated API network boundary!)
interface SimpleMockResponse {
  status: number;
  data: any;
  message?: string;
}

const mockAPIServer = async (config: AxiosRequestConfig): Promise<SimpleMockResponse> => {
  // Simulate network latency (250ms - 500ms)
  await new Promise(resolve => setTimeout(resolve, Math.random() * 250 + 100));

  const url = config.url || '';
  const method = (config.method || 'GET').toUpperCase();
  const body = config.data ? JSON.parse(JSON.stringify(config.data)) : null;
  const headers = config.headers || {};
  
  // Extract authorization header or check active session token
  const authHeader = headers['Authorization'] as string || '';
  const token = authHeader.replace(/^Bearer\s+/, '');
  
  // Parse user from token
  let tokenUser: User | null = null;
  if (token) {
    const users: User[] = getStorage('mentorkhet_users', []);
    tokenUser = users.find(u => u.email === token) || null;
  }

  // Auth endpoints
  if (url === '/auth/login' && method === 'POST') {
    const { email, password } = body;
    const users: User[] = getStorage('mentorkhet_users', []);
    const matchingUser = users.find(u => u.email === email);
    
    if (matchingUser) {
      if (matchingUser.isBanned) {
        return { status: 403, data: null, message: 'Your account has been suspended by Admin.' };
      }
      
      // If mentor, check verification status
      if (matchingUser.role === 'MENTOR') {
        const mentors: MentorProfile[] = getStorage('mentorkhet_mentors', []);
        const mentorProfile = mentors.find(m => m.userId === matchingUser.id);
        if (mentorProfile) {
          // Allow login, the UI displays appropriate status screens
        }
      }

      return {
        status: 200,
        data: {
          user: matchingUser,
          accessToken: matchingUser.email, // Use email as mock access token
          refreshToken: `refresh_${matchingUser.id}`
        }
      };
    }
    return { status: 401, data: null, message: 'Invalid credentials. Try: admin@mentorkhet.com / mentor.sarah@mentorkhet.com / rahul@mentorkhet.com' };
  }

  if (url === '/auth/register' && method === 'POST') {
    const users: User[] = getStorage('mentorkhet_users', []);
    const alreadyExists = users.some(u => u.email === body.email);
    if (alreadyExists) {
      return { status: 400, data: null, message: 'Email already registered.' };
    }

    const { role, firstName, lastName, email, phone, experience, skills, shortDescription, fullDescription, category, interests, learningGoals, nationalId } = body;
    
    // Create broad user record
    const newUserId = `usr-${Math.random().toString(36).substr(2, 9)}`;
    const defaultAvatar = `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200`;
    
    const newUser: User = {
      id: newUserId,
      email,
      username: email.split('@')[0],
      role,
      firstName,
      lastName,
      phone,
      avatar: defaultAvatar,
    };

    users.push(newUser);
    setStorage('mentorkhet_users', users);

    if (role === 'MENTOR') {
      const mentors: MentorProfile[] = getStorage('mentorkhet_mentors', []);
      const newMentor: MentorProfile = {
        id: `men-${Math.random().toString(36).substr(2, 9)}`,
        userId: newUserId,
        firstName,
        lastName,
        email,
        phone: phone || '',
        nationalId: nationalId || 'NID-MOCK-' + Math.floor(Math.random() * 10000000),
        avatar: defaultAvatar,
        experience: Number(experience || 0),
        skills: skills || [],
        shortDescription: shortDescription || '',
        fullDescription: fullDescription || '',
        category: category || 'Web Development',
        rating: 0,
        reviewCount: 0,
        verificationStatus: 'PENDING', // Strict verification start!
        weeklySchedule: ['Monday', 'Wednesday'],
        availableTimeSlots: ['10:00', '13:00', '16:00']
      };
      
      mentors.push(newMentor);
      setStorage('mentorkhet_mentors', mentors);
    } else if (role === 'MENTEE') {
      const mentees: MenteeProfile[] = getStorage('mentorkhet_mentees', []);
      const newMentee: MenteeProfile = {
        id: `mte-${Math.random().toString(36).substr(2, 9)}`,
        userId: newUserId,
        firstName,
        lastName,
        email,
        avatar: defaultAvatar,
        interests: interests || [],
        learningGoals: learningGoals || [],
        completedSessionsCount: 0
      };

      mentees.push(newMentee);
      setStorage('mentorkhet_mentees', mentees);
    }

    return {
      status: 201,
      data: {
        user: newUser,
        accessToken: newUser.email,
        refreshToken: `refresh_${newUser.id}`
      }
    };
  }

  if (url === '/auth/refresh' && method === 'POST') {
    const { refreshToken } = body || {};
    if (!refreshToken) {
      return { status: 400, data: null, message: 'Missing refresh token.' };
    }
    const userId = refreshToken.replace(/^refresh_/, '');
    const users: User[] = getStorage('mentorkhet_users', []);
    const user = users.find(u => u.id === userId);
    if (user) {
      return {
        status: 200,
        data: {
          accessToken: user.email,
          refreshToken: refreshToken
        }
      };
    }
    return { status: 401, data: null, message: 'Invalid refresh token.' };
  }

  if (url === '/auth/me' && method === 'GET') {
    if (!tokenUser) {
      return { status: 401, data: null, message: 'Unauthorized session.' };
    }
    return { status: 200, data: tokenUser };
  }

  // Mentor profiles (Mentees looking for approved mentors)
  if (url.startsWith('/mentors') && method === 'GET') {
    const mentors: MentorProfile[] = getStorage('mentorkhet_mentors', []);
    
    // Check if looking for single mentor detail: /mentors/:id
    const parts = url.split('/');
    if (parts.length > 2) {
      const mentorId = parts[2];
      const mDetail = mentors.find(m => m.id === mentorId);
      if (mDetail) {
        return { status: 200, data: mDetail };
      }
      return { status: 404, data: null, message: 'Mentor profile not found.' };
    }

    // List approved mentors
    const approvedMentors = mentors.filter(m => m.verificationStatus === 'APPROVED');
    return { status: 200, data: approvedMentors };
  }

  // Booking a session
  if (url.startsWith('/sessions/book') && method === 'POST') {
    if (!tokenUser) return { status: 401, data: null, message: 'Missing auth token' };
    
    const mentees: MenteeProfile[] = getStorage('mentorkhet_mentees', []);
    const mentee = mentees.find(me => me.userId === tokenUser?.id);
    if (!mentee) {
      return { status: 403, data: null, message: 'Only logged in mentees can book sessions.' };
    }

    const { mentorId, date, timeSlot } = body;
    const mentors: MentorProfile[] = getStorage('mentorkhet_mentors', []);
    const mentor = mentors.find(m => m.id === mentorId);
    if (!mentor) {
      return { status: 404, data: null, message: 'Mentor not found.' };
    }

    const sessions: MentorshipSession[] = getStorage('mentorkhet_sessions', []);
    const newSession: MentorshipSession = {
      id: `ses-${Math.random().toString(36).substr(2, 9)}`,
      mentorId: mentor.id,
      mentorName: `${mentor.firstName} ${mentor.lastName}`,
      mentorAvatar: mentor.avatar,
      menteeId: mentee.id,
      menteeName: `${mentee.firstName} ${mentee.lastName}`,
      menteeAvatar: mentee.avatar,
      date,
      timeSlot,
      status: 'PENDING'
    };

    sessions.push(newSession);
    setStorage('mentorkhet_sessions', sessions);
    return { status: 201, data: newSession };
  }

  // Session retrieval
  if (url === '/sessions' && method === 'GET') {
    if (!tokenUser) return { status: 401, data: null, message: 'Unauthorized user.' };
    const sessions: MentorshipSession[] = getStorage('mentorkhet_sessions', []);
    
    if (tokenUser.role === 'ADMIN') {
      return { status: 200, data: sessions };
    }
    
    if (tokenUser.role === 'MENTOR') {
      const mentors: MentorProfile[] = getStorage('mentorkhet_mentors', []);
      const currentMentor = mentors.find(m => m.userId === tokenUser?.id);
      if (currentMentor) {
        return { status: 200, data: sessions.filter(s => s.mentorId === currentMentor.id) };
      }
      return { status: 200, data: [] };
    }

    if (tokenUser.role === 'MENTEE') {
      const mentees: MenteeProfile[] = getStorage('mentorkhet_mentees', []);
      const currentMentee = mentees.find(m => m.userId === tokenUser?.id);
      if (currentMentee) {
        return { status: 200, data: sessions.filter(s => s.menteeId === currentMentee.id) };
      }
      return { status: 200, data: [] };
    }
  }

  // Admin and users state mutations
  if (url.startsWith('/sessions/') && method === 'PATCH') {
    if (!tokenUser) return { status: 401, data: null, message: 'Unauthorized' };
    const sessionId = url.split('/')[2];
    const { status, notes } = body;

    const sessions: MentorshipSession[] = getStorage('mentorkhet_sessions', []);
    const sesIdx = sessions.findIndex(s => s.id === sessionId);

    if (sesIdx === -1) {
      return { status: 404, data: null, message: 'Session not found' };
    }

    // Status logic mutations
    const origStatus = sessions[sesIdx].status;
    sessions[sesIdx].status = status as SessionStatus;

    if (notes !== undefined) {
      sessions[sesIdx].notes = notes;
    }

    // Increment completed counter if finished
    if (status === 'COMPLETED' && origStatus !== 'COMPLETED') {
      const mentees = getStorage<MenteeProfile[]>('mentorkhet_mentees', []);
      const mIdx = mentees.findIndex(me => me.id === sessions[sesIdx].menteeId);
      if (mIdx !== -1) {
        mentees[mIdx].completedSessionsCount++;
        setStorage('mentorkhet_mentees', mentees);
      }
    }

    setStorage('mentorkhet_sessions', sessions);
    return { status: 200, data: sessions[sesIdx] };
  }

  // Add review endpoint
  if (url.startsWith('/reviews') && method === 'POST') {
    if (!tokenUser) return { status: 401, data: null, message: 'Unauthorized' };
    const { mentorId, rating, comment } = body;
    
    const mentees = getStorage<MenteeProfile[]>('mentorkhet_mentees', []);
    const mentee = mentees.find(m => m.userId === tokenUser?.id);
    if (!mentee) {
      return { status: 403, data: null, message: 'Only mentees can submit reviews.' };
    }

    const reviews = getStorage<Review[]>('mentorkhet_reviews', []);
    const newReview: Review = {
      id: `rev-${Math.random().toString(36).substr(2, 9)}`,
      mentorId,
      menteeId: mentee.id,
      menteeName: `${mentee.firstName} ${mentee.lastName}`,
      menteeAvatar: mentee.avatar,
      rating: Number(rating),
      comment,
      createdAt: new Date().toISOString(),
      isApproved: true // Auto-approved for simple mock context, but admin can purge
    };

    reviews.push(newReview);
    setStorage('mentorkhet_reviews', reviews);

    // Re-calculate mentor rating
    const mentors = getStorage<MentorProfile[]>('mentorkhet_mentors', []);
    const mIdx = mentors.findIndex(m => m.id === mentorId);
    if (mIdx !== -1) {
      const mentorReviews = reviews.filter(r => r.mentorId === mentorId);
      const avg = mentorReviews.reduce((sum, r) => sum + r.rating, 0) / mentorReviews.length;
      mentors[mIdx].rating = parseFloat(avg.toFixed(1));
      mentors[mIdx].reviewCount = mentorReviews.length;
      setStorage('mentorkhet_mentors', mentors);
    }

    return { status: 201, data: newReview };
  }

  if (url === '/reviews' && method === 'GET') {
    const reviews = getStorage<Review[]>('mentorkhet_reviews', []);
    return { status: 200, data: reviews };
  }

  if (url.startsWith('/reviews/') && method === 'DELETE') {
    if (tokenUser?.role !== 'ADMIN') return { status: 403, data: null, message: 'Admin access required' };
    const rId = url.split('/')[2];
    let reviews = getStorage<Review[]>('mentorkhet_reviews', []);
    reviews = reviews.filter(r => r.id !== rId);
    setStorage('mentorkhet_reviews', reviews);
    return { status: 200, data: { success: true } };
  }

  // Admin Endpoints
  if (url === '/admin/mentors' && method === 'GET') {
    if (tokenUser?.role !== 'ADMIN') {
      return { status: 403, data: null, message: 'Unauthorized. Admin credential required.' };
    }
    const mentors = getStorage<MentorProfile[]>('mentorkhet_mentors', []);
    return { status: 200, data: mentors };
  }

  if (url.startsWith('/admin/mentors/') && url.endsWith('/verify') && method === 'POST') {
    if (tokenUser?.role !== 'ADMIN') {
      return { status: 403, data: null, message: 'Unauthorized. Admin credential required.' };
    }
    const mentorId = url.split('/')[3];
    const { status } = body; // 'APPROVED' or 'REJECTED'

    const mentors = getStorage<MentorProfile[]>('mentorkhet_mentors', []);
    const mIdx = mentors.findIndex(m => m.id === mentorId);
    if (mIdx !== -1) {
      mentors[mIdx].verificationStatus = status as VerificationStatus;
      setStorage('mentorkhet_mentors', mentors);
      return { status: 200, data: mentors[mIdx] };
    }
    return { status: 404, data: null, message: 'Mentor profile structure not found.' };
  }

  // Admin users lists CRUD
  if (url === '/admin/users' && method === 'GET') {
    if (tokenUser?.role !== 'ADMIN') return { status: 403, data: null, message: 'Admin access required' };
    const users = getStorage<User[]>('mentorkhet_users', []);
    return { status: 200, data: users };
  }

  if (url.startsWith('/admin/users/') && method === 'PATCH') {
    if (tokenUser?.role !== 'ADMIN') return { status: 403, data: null, message: 'Admin access required' };
    const userId = url.split('/')[3];
    const users = getStorage<User[]>('mentorkhet_users', []);
    const uIdx = users.findIndex(u => u.id === userId);
    
    if (uIdx !== -1) {
      users[uIdx] = { ...users[uIdx], ...body };
      setStorage('mentorkhet_users', users);
      return { status: 200, data: users[uIdx] };
    }
    return { status: 404, data: null, message: 'User not found.' };
  }

  if (url.startsWith('/admin/users/') && method === 'DELETE') {
    if (tokenUser?.role !== 'ADMIN') return { status: 403, data: null, message: 'Admin access required' };
    const userId = url.split('/')[3];
    let users = getStorage<User[]>('mentorkhet_users', []);
    users = users.filter(u => u.id !== userId);
    setStorage('mentorkhet_users', users);
    return { status: 200, data: { success: true } };
  }

  // Admin categories
  if (url === '/categories' && method === 'GET') {
    const categories = getStorage<SkillCategory[]>('mentorkhet_categories', DEFAULT_CATEGORIES);
    return { status: 200, data: categories };
  }

  if (url === '/admin/categories' && method === 'POST') {
    if (tokenUser?.role !== 'ADMIN') return { status: 403, data: null, message: 'Admin access required' };
    const categories = getStorage<SkillCategory[]>('mentorkhet_categories', []);
    const newCat: SkillCategory = {
      id: `cat-${Math.random().toString(36).substr(2, 9)}`,
      name: body.name,
      description: body.description,
      skills: body.skills || []
    };
    categories.push(newCat);
    setStorage('mentorkhet_categories', categories);
    return { status: 201, data: newCat };
  }

  if (url.startsWith('/admin/categories/') && method === 'DELETE') {
    if (tokenUser?.role !== 'ADMIN') return { status: 403, data: null, message: 'Admin access required' };
    const catId = url.split('/')[3];
    let categories = getStorage<SkillCategory[]>('mentorkhet_categories', []);
    categories = categories.filter(c => c.id !== catId);
    setStorage('mentorkhet_categories', categories);
    return { status: 200, data: { success: true } };
  }

  // Analytics Stats API
  if (url === '/admin/stats' && method === 'GET') {
    if (tokenUser?.role !== 'ADMIN') return { status: 403, data: null, message: 'Admin access required' };
    
    const users = getStorage<User[]>('mentorkhet_users', []);
    const mentors = getStorage<MentorProfile[]>('mentorkhet_mentors', []);
    const sessions = getStorage<MentorshipSession[]>('mentorkhet_sessions', []);
    
    const stats: SystemStats = {
      totalMentors: mentors.filter(m => m.verificationStatus === 'APPROVED').length,
      totalMentees: users.filter(u => u.role === 'MENTEE').length,
      totalSessions: sessions.length,
      pendingVerifications: mentors.filter(m => m.verificationStatus === 'PENDING').length,
      mostRequestedSkills: [
        { skill: 'React', count: 18 },
        { skill: 'TypeScript', count: 15 },
        { skill: 'Kubernetes', count: 8 },
        { skill: 'Figma', count: 7 },
        { skill: 'Docker', count: 6 },
      ]
    };
    return { status: 200, data: stats };
  }

  // Chat messaging
  if (url === '/chat/messages' && method === 'GET') {
    if (!tokenUser) return { status: 401, data: null, message: 'Unauthorized' };
    const chat = getStorage<ChatMessage[]>('mentorkhet_chat', []);
    // Return messages involving current logged in user
    const userChat = chat.filter(m => m.senderId === tokenUser?.id || m.receiverId === tokenUser?.id);
    return { status: 200, data: userChat };
  }

  if (url === '/chat/messages' && method === 'POST') {
    if (!tokenUser) return { status: 401, data: null, message: 'Unauthorized' };
    const chat = getStorage<ChatMessage[]>('mentorkhet_chat', []);
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      senderId: tokenUser.id,
      senderName: `${tokenUser.firstName} ${tokenUser.lastName}`,
      receiverId: body.receiverId,
      text: body.text,
      timestamp: new Date().toISOString()
    };
    chat.push(newMsg);
    setStorage('mentorkhet_chat', chat);
    return { status: 201, data: newMsg };
  }

  // Profile management edit
  if (url === '/profile/me' && method === 'PUT') {
    if (!tokenUser) return { status: 401, data: null, message: 'Unauthorized' };
    const users = getStorage<User[]>('mentorkhet_users', []);
    const uIdx = users.findIndex(u => u.id === tokenUser?.id);
    if (uIdx !== -1) {
      users[uIdx] = { ...users[uIdx], ...body };
      setStorage('mentorkhet_users', users);
      
      // Update mentor profile if applicable
      if (tokenUser.role === 'MENTOR') {
        const mentors = getStorage<MentorProfile[]>('mentorkhet_mentors', []);
        const mIdx = mentors.findIndex(m => m.userId === tokenUser?.id);
        if (mIdx !== -1) {
          mentors[mIdx] = { ...mentors[mIdx], ...body };
          setStorage('mentorkhet_mentors', mentors);
        }
      }
      // Update mentee profile if applicable
      if (tokenUser.role === 'MENTEE') {
        const mentees = getStorage<MenteeProfile[]>('mentorkhet_mentees', []);
        const mIdx = mentees.findIndex(m => m.userId === tokenUser?.id);
        if (mIdx !== -1) {
          mentees[mIdx] = { ...mentees[mIdx], ...body };
          setStorage('mentorkhet_mentees', mentees);
        }
      }

      return { status: 200, data: users[uIdx] };
    }
  }

  return { status: 404, data: null, message: 'API Endpoint not found.' };
};

// Bind Axios interceptor to simulate real-world endpoints!
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  // Read token from localStorage dynamically
  const token = localStorage.getItem('mentorkhet_access_token');
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

// Intercept Axios adapter to run through our mock browser server!
api.defaults.adapter = async (config) => {
  try {
    const res = await mockAPIServer(config);
    if (res.status >= 200 && res.status < 300) {
      return {
        data: res.data,
        status: res.status,
        statusText: 'OK',
        headers: {},
        config: config as any,
      };
    } else {
      throw {
        response: {
          data: { message: res.message || 'Error occurred.' },
          status: res.status,
          statusText: 'Error',
          headers: {},
          config: config as any,
        }
      };
    }
  } catch (error: any) {
    if (error.response) {
      return Promise.reject(error);
    }
    return Promise.reject({
      response: {
        data: { message: error.message || 'Network error encountered.' },
        status: 500,
        statusText: 'Internal Server Error',
        headers: {},
        config: config as any,
      }
    });
  }
};
