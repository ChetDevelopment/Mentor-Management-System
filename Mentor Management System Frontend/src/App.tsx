/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';

// Pages loading
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { MentorList } from './pages/MentorList';
import { MentorDetail } from './pages/MentorDetail';
import { MySessions } from './pages/MySessions';
import { Chat } from './pages/Chat';
import { Profile } from './pages/Profile';

// Mentee specific pages
import { Progress } from './pages/mentee/Progress';

// Mentor specific pages
import { Availability } from './pages/mentor/Availability';
import { Resources } from './pages/mentor/Resources';

// Admin specific pages
import { MentorApprovals } from './pages/admin/MentorApprovals';
import { UserManagement } from './pages/admin/UserManagement';
import { CategoryManagement } from './pages/admin/CategoryManagement';
import { ModPanel } from './pages/admin/ModPanel';

// Create Tanstack Query Client
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* PUBLIC PAGE PATH */}
            <Route path="/" element={<LandingPage />} />
            
            {/* SINGLE AUTH PORTAL */}
            <Route path="/auth" element={<AuthPage />} />

            {/* PROTECTED CONSOLE AREA */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* SHARED SETTINGS PROTOCOLS */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* SECURE DOCK APPOINTMENT WORKSPACE */}
            <Route
              path="/sessions"
              element={
                <ProtectedRoute>
                  <Layout>
                    <MySessions />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* DIALOG CONSOLE */}
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Chat />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* --- MENTEE LEVEL ACTIONS --- */}
            <Route
              path="/mentors"
              element={
                <ProtectedRoute allowedRoles={['MENTEE']}>
                  <Layout>
                    <MentorList />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/mentors/:id"
              element={
                <ProtectedRoute allowedRoles={['MENTEE']}>
                  <Layout>
                    <MentorDetail />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/mentee/progress"
              element={
                <ProtectedRoute allowedRoles={['MENTEE']}>
                  <Layout>
                    <Progress />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* --- MENTOR LEVEL ACTIONS --- */}
            <Route
              path="/mentor/availability"
              element={
                <ProtectedRoute allowedRoles={['MENTOR']}>
                  <Layout>
                    <Availability />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/mentor/resources"
              element={
                <ProtectedRoute allowedRoles={['MENTOR', 'MENTEE']}>
                  <Layout>
                    <Resources />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* --- ADMIN OPERATIONS LEVEL --- */}
            <Route
              path="/admin/mentor-approvals"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <Layout>
                    <MentorApprovals />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <Layout>
                    <UserManagement />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/categories"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <Layout>
                    <CategoryManagement />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <Layout>
                    <ModPanel />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* FALLBACK ROOT REDIRECT */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
