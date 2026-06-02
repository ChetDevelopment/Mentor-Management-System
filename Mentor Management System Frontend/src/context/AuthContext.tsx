/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: any) => Promise<User>;
  logout: () => void;
  updateUserInContext: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt session restoration
    const savedToken = localStorage.getItem('mentorkhet_access_token');
    const savedUserJson = localStorage.getItem('mentorkhet_user_profile');

    if (savedToken && savedUserJson) {
      try {
        const savedUser: User = JSON.parse(savedUserJson);
        setToken(savedToken);
        setUser(savedUser);
      } catch (e) {
        // Clear corrupt storage
        localStorage.removeItem('mentorkhet_access_token');
        localStorage.removeItem('mentorkhet_user_profile');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const body = response.data;
      const apiUser = body.user || body;
      const accessToken = body.accessToken || body.token || '';

      localStorage.setItem('mentorkhet_access_token', accessToken);
      localStorage.setItem('mentorkhet_user_profile', JSON.stringify(apiUser));
      setToken(accessToken);
      setUser(apiUser);
      setLoading(false);
      return apiUser;
    } catch (error: any) {
      setLoading(false);
      throw new Error(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const register = async (data: any): Promise<User> => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', data);
      const body = response.data;
      const apiUser = body.user || body;
      const accessToken = body.accessToken || body.token || '';

      localStorage.setItem('mentorkhet_access_token', accessToken);
      localStorage.setItem('mentorkhet_user_profile', JSON.stringify(apiUser));

      setToken(accessToken);
      setUser(apiUser);
      return apiUser;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Registration verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('mentorkhet_access_token');
    localStorage.removeItem('mentorkhet_user_profile');
    setToken(null);
    setUser(null);
  };

  const updateUserInContext = (updatedData: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updatedData };
      localStorage.setItem('mentorkhet_user_profile', JSON.stringify(newUser));
      setUser(newUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUserInContext }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be executed within an AuthProvider scope.');
  }
  return context;
};
