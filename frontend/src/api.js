import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (data) => api.post('/auth/register', data);
export const getProfile = () => api.get('/users/profile');
export const updateProfile = (data) => api.put('/users/profile', data);
export const getMentors = () => api.get('/mentors');
export const getSessions = () => api.get('/sessions');
export const createSession = (data) => api.post('/sessions', data);
export const acceptSession = (id) => api.post(`/sessions/${id}/accept`);
export const completeSession = (id) => api.post(`/sessions/${id}/complete`);
export const cancelSession = (id) => api.post(`/sessions/${id}/cancel`);
export const getFeedback = () => api.get('/feedback');
export const submitFeedback = (data) => api.post('/feedback', data);
export const getNotifications = () => api.get('/notifications');
export const getUnreadNotifs = () => api.get('/notifications/unread');
export const markRead = (id) => api.put(`/notifications/${id}/read`);
export const getAdminDashboard = () => api.get('/admin/dashboard');
export const getAdminUsers = () => api.get('/admin/users');
export const deactivateUser = (id) => api.post(`/admin/users/${id}/deactivate`);
export const getAdminMentors = () => api.get('/admin/mentors');
export const getAdminMentees = () => api.get('/admin/mentees');
export const getSkills = () => api.get('/skills');
export const getResources = (mentorId) => api.get(`/resources/${mentorId}`);
export const getAvailability = (mentorId) => api.get(`/availabilities/${mentorId}`);

export default api;
