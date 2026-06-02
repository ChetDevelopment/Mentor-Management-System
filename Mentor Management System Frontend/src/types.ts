/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'ADMIN' | 'MENTOR' | 'MENTEE';

export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type SessionStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar: string;
  isBanned?: boolean;
}

export interface MentorProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationalId: string;
  avatar: string;
  experience: number; // in years
  skills: string[];
  shortDescription: string;
  fullDescription: string;
  category: string;
  cvUrl?: string;
  portfolioUrl?: string;
  rating: number;
  reviewCount: number;
  verificationStatus: VerificationStatus;
  weeklySchedule: string[]; // ['Monday', 'Tuesday', 'Friday']
  availableTimeSlots: string[]; // ['09:00', '11:00', '14:00', '16:00']
}

export interface MenteeProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  interests: string[];
  learningGoals: string[];
  cvUrl?: string;
  completedSessionsCount: number;
}

export interface MentorshipSession {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorAvatar: string;
  menteeId: string;
  menteeName: string;
  menteeAvatar: string;
  date: string;
  timeSlot: string;
  status: SessionStatus;
  notes?: string;
  complaint?: {
    reportedBy: 'MENTEE' | 'MENTOR';
    text: string;
    createdAt: string;
    isResolved: boolean;
  };
}

export interface SkillCategory {
  id: string;
  name: string;
  description: string;
  skills: string[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  text: string;
  timestamp: string;
}

export interface Review {
  id: string;
  mentorId: string;
  menteeId: string;
  menteeName: string;
  menteeAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
  isApproved: boolean; // Moderation
}

export interface SystemStats {
  totalMentors: number;
  totalMentees: number;
  totalSessions: number;
  pendingVerifications: number;
  mostRequestedSkills: { skill: string; count: number }[];
}
