import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mentorkhet_access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('mentorkhet_access_token');
      localStorage.removeItem('mentorkhet_user_profile');
      window.location.href = '/auth';
    }
    return Promise.reject(err);
  }
);

// Rewrite api methods to map frontend calls to real backend
const originalPost = api.post;
const originalGet = api.get;
const originalPut = api.put;
const originalPatch = api.patch;
const originalDelete = api.delete;

// Endpoint mapper: frontend path → backend path
const mapPath = (url: string, method: string): string => {
  const map = {
    'GET /auth/me': '/users/profile',
    'PUT /profile/me': '/users/profile',
    'POST /sessions/book': '/sessions',
    'GET /admin/stats': '/admin/dashboard',
    'POST /reviews': '/feedback',
    'GET /reviews': '/feedback',
    'GET /categories': '/skills',
  };
  const key = `${method} ${url}`;
  return map[key] || url;
};

// Map session status from backend format to frontend format
const mapSessionStatus = (status: string): string => {
  const m = { scheduled: 'PENDING', confirmed: 'ACCEPTED', completed: 'COMPLETED', cancelled: 'CANCELLED', no_show: 'CANCELLED' };
  return m[status] || status?.toUpperCase() || 'PENDING';
};

// Wrap get to map paths and transform responses
api.get = async (url: string, config?: any) => {
  const mapped = mapPath(url, 'GET');
  const res = await originalGet.call(api, mapped, config);
  return transformResponse(url, res);
};

api.post = async (url: string, data?: any, config?: any) => {
  const mapped = mapPath(url, 'POST');
  const res = await originalPost.call(api, mapped, data, config);
  return transformResponse(url, res);
};

api.put = async (url: string, data?: any, config?: any) => {
  const mapped = mapPath(url, 'PUT');
  const res = await originalPut.call(api, mapped, data, config);
  return transformResponse(url, res);
};

api.patch = async (url: string, data?: any, config?: any) => {
  // Map PATCH to our backend's POST for session status changes
  const sessionMatch = url.match(/^\/sessions\/(.+)$/);
  if (sessionMatch) {
    const sessionId = sessionMatch[1];
    const { status, notes } = data || {};
    if (status === 'COMPLETED') return originalPost.call(api, `/sessions/${sessionId}/complete`, {}, config);
    if (status === 'CANCELLED') return originalPost.call(api, `/sessions/${sessionId}/cancel`, {}, config);
    if (status === 'ACCEPTED') return originalPost.call(api, `/sessions/${sessionId}/accept`, {}, config);
    // Default: PUT to update session
    const res = await originalPut.call(api, `/sessions/${sessionId}`, data || {}, config);
    return transformResponse(url, res);
  }
  const res = await originalPatch.call(api, url, data, config);
  return transformResponse(url, res);
};

api.delete = async (url: string, config?: any) => {
  const res = await originalDelete.call(api, url, config);
  return transformResponse(url, res);
};

function transformResponse(originalUrl: string, res: any) {
  let data = res.data;

  // Backend may wrap in { data } or return array directly
  if (data && typeof data === 'object' && 'data' in data) {
    data = data.data;
  }

  // Auth responses: backend returns { user, accessToken }
  if (originalUrl === '/auth/login' || originalUrl === '/auth/register') {
    // Keep as-is, frontend expects { user, accessToken }
    return { ...res, data: res.data };
  }

  // Reviews → Feedback: frontend expects array of reviews
  if (originalUrl === '/reviews') {
    return { ...res, data: Array.isArray(data) ? data.map(r => ({
      id: r.id, mentorId: r.mentorId, menteeId: r.menteeId,
      menteeName: '', menteeAvatar: '', rating: r.rating,
      comment: r.comment || '', createdAt: r.createdAt || '',
      isApproved: true
    })) : [] };
  }

  // Mentors list: map to frontend MentorProfile format
  if (originalUrl === '/mentors' || originalUrl.match(/^\/mentors\//)) {
    if (Array.isArray(data)) {
      return { ...res, data: data.map(m => mentorToFrontend(m)) };
    }
    if (data && data.id) {
      return { ...res, data: mentorToFrontend(data) };
    }
  }

  // Sessions list: map statuses
  if (originalUrl === '/sessions') {
    if (Array.isArray(data)) {
      return { ...res, data: data.map(s => ({ ...s, status: mapSessionStatus(s.status) })) };
    }
  }

  // Categories → Skills
  if (originalUrl === '/categories') {
    return { ...res, data: Array.isArray(data) ? data.map(s => ({
      id: s.id, name: s.category || 'General',
      description: s.description || '', skills: [s.name]
    })) : [] };
  }

  return { ...res, data };
}

function mentorToFrontend(m: any) {
  return {
    id: m.id, userId: m.userId,
    firstName: m.firstName || '',
    lastName: m.lastName || '',
    email: m.email || '',
    phone: m.phone || '',
    nationalId: m.nid || '',
    avatar: m.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    experience: m.yearsOfExperience || 0,
    skills: Array.isArray(m.skills) ? m.skills : [],
    shortDescription: m.shortDescription || '',
    fullDescription: m.fullBio || '',
    category: m.title || 'General',
    cvUrl: m.cvUrl || '',
    portfolioUrl: m.portfolioUrl || '',
    rating: m.rating || 0,
    reviewCount: m.totalSessions || 0,
    verificationStatus: m.status === 'APPROVED' ? 'APPROVED' : 'PENDING',
    weeklySchedule: [],
    availableTimeSlots: [],
  };
}
