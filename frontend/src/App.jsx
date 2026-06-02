import { useState, useEffect } from 'react';
import './App.css';
import api from './api';

const MODULES = [
  { name: 'Auth', color: '#0F3B5E', endpoints: [
    { method: 'POST', path: '/auth/register', body: { email: 'test@test.com', password: 'Pass123!', firstName: 'Test', lastName: 'User', role: 'mentee' } },
    { method: 'POST', path: '/auth/login', body: { email: 'admin@mentorkhet.com', password: 'password123' } },
    { method: 'POST', path: '/auth/forgot-password', body: { email: 'admin@mentorkhet.com' } },
    { method: 'POST', path: '/auth/logout' },
    { method: 'POST', path: '/auth/refresh-token' },
  ]},
  { name: 'Users', color: '#1A5A8A', endpoints: [
    { method: 'GET', path: '/users/profile' },
    { method: 'PUT', path: '/users/profile', body: { firstName: 'Updated' } },
    { method: 'GET', path: '/users' },
    { method: 'GET', path: '/users/:id' },
  ]},
  { name: 'Mentors', color: '#10B981', endpoints: [
    { method: 'GET', path: '/mentors' },
    { method: 'POST', path: '/mentors', body: { userId: '', title: 'Senior Dev', company: 'Google', nid: '0123456789', phone: '01234567890' } },
    { method: 'PUT', path: '/mentors/:id', body: { title: 'Lead' } },
    { method: 'POST', path: '/mentors/:id/approve' },
    { method: 'POST', path: '/mentors/:id/reject', body: { reason: 'Not qualified' } },
    { method: 'POST', path: '/mentors/:id/suspend' },
    { method: 'DELETE', path: '/mentors/:id' },
  ]},
  { name: 'Mentees', color: '#6366F1', endpoints: [
    { method: 'GET', path: '/mentees' },
    { method: 'POST', path: '/mentees', body: { userId: '', occupation: 'Student', goals: 'Learn coding' } },
    { method: 'PUT', path: '/mentees/:id', body: { occupation: 'Junior' } },
    { method: 'DELETE', path: '/mentees/:id' },
  ]},
  { name: 'Skills', color: '#F59E0B', endpoints: [
    { method: 'GET', path: '/skills' },
    { method: 'GET', path: '/skills/:id' },
    { method: 'GET', path: '/skills/category/:categoryId' },
    { method: 'POST', path: '/skills', body: { name: 'NewSkill', description: 'Test' } },
    { method: 'PUT', path: '/skills/:id', body: { name: 'Updated' } },
    { method: 'DELETE', path: '/skills/:id' },
  ]},
  { name: 'Sessions', color: '#EF4444', endpoints: [
    { method: 'GET', path: '/sessions' },
    { method: 'GET', path: '/sessions/:id' },
    { method: 'POST', path: '/sessions', body: { mentorId: '', menteeId: '', title: 'Test Session', scheduledAt: new Date(Date.now()+86400000).toISOString(), duration: 60 } },
    { method: 'PUT', path: '/sessions/:id', body: { title: 'Updated' } },
    { method: 'POST', path: '/sessions/:id/accept' },
    { method: 'POST', path: '/sessions/:id/decline' },
    { method: 'POST', path: '/sessions/:id/complete' },
    { method: 'POST', path: '/sessions/:id/cancel' },
    { method: 'POST', path: '/sessions/:id/no-show' },
    { method: 'DELETE', path: '/sessions/:id' },
  ]},
  { name: 'Matchings', color: '#EC4899', endpoints: [
    { method: 'GET', path: '/matchings' },
    { method: 'GET', path: '/matchings/:id' },
    { method: 'POST', path: '/matchings', body: { mentorId: '', menteeId: '', reason: 'Good match' } },
    { method: 'PUT', path: '/matchings/:id', body: { status: 'accepted' } },
    { method: 'DELETE', path: '/matchings/:id' },
  ]},
  { name: 'Feedback', color: '#8B5CF6', endpoints: [
    { method: 'GET', path: '/feedback' },
    { method: 'GET', path: '/feedback/:id' },
    { method: 'GET', path: '/feedback/mentor/:mentorId' },
    { method: 'POST', path: '/feedback', body: { mentorId: '', menteeId: '', rating: 5, comment: 'Great!' } },
    { method: 'PUT', path: '/feedback/:id', body: { rating: 4 } },
    { method: 'DELETE', path: '/feedback/:id' },
  ]},
  { name: 'Admin', color: '#DC2626', endpoints: [
    { method: 'GET', path: '/admin/dashboard' },
    { method: 'GET', path: '/admin/users' },
    { method: 'GET', path: '/admin/mentors' },
    { method: 'GET', path: '/admin/mentees' },
    { method: 'POST', path: '/admin/users/:id/deactivate' },
    { method: 'POST', path: '/admin/users/:id/reset-password', body: { password: 'NewPass123!' } },
    { method: 'DELETE', path: '/admin/users/:id' },
    { method: 'DELETE', path: '/admin/feedback/:id' },
  ]},
  { name: 'Notifications', color: '#0891B2', endpoints: [
    { method: 'GET', path: '/notifications' },
    { method: 'GET', path: '/notifications/unread' },
    { method: 'GET', path: '/notifications/:id' },
    { method: 'POST', path: '/notifications', body: { userId: '', title: 'Test', message: 'Hello', type: 'in_app' } },
    { method: 'PUT', path: '/notifications/:id/read' },
    { method: 'DELETE', path: '/notifications/:id' },
  ]},
  { name: 'Activity Logs', color: '#65A30D', endpoints: [
    { method: 'GET', path: '/activity-logs' },
    { method: 'GET', path: '/activity-logs/:id' },
    { method: 'POST', path: '/activity-logs', body: { action: 'create', entity: 'test', entityId: '0000', description: 'QA test' } },
  ]},
  { name: 'Resources', color: '#D97706', endpoints: [
    { method: 'GET', path: '/resources/:mentorId' },
    { method: 'POST', path: '/resources', body: { mentorId: '', title: 'Guide', type: 'document', fileUrl: 'https://x.pdf' } },
    { method: 'DELETE', path: '/resources/:id' },
  ]},
  { name: 'Availability', color: '#7C3AED', endpoints: [
    { method: 'GET', path: '/availabilities/:mentorId' },
    { method: 'GET', path: '/availabilities/:mentorId/slots?date=2026-06-15' },
    { method: 'POST', path: '/availabilities', body: { mentorId: '', date: '2026-06-15', startTime: '09:00', endTime: '17:00' } },
    { method: 'PUT', path: '/availabilities/:id', body: { startTime: '10:00' } },
    { method: 'DELETE', path: '/availabilities/:id' },
    { method: 'POST', path: '/availabilities/block', body: { mentorId: '', date: '2026-06-20' } },
  ]},
];

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [activeModule, setActiveModule] = useState('Auth');
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});
  const [editingId, setEditingId] = useState({});

  const handleLogin = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const t = res.body?.accessToken || res.data?.accessToken || res.data?.token || '';
      if (t) {
        localStorage.setItem('token', t);
        setToken(t);
      }
      return res;
    } catch (e) { throw e; }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setResults({});
  };

  const testEndpoint = async (endpoint) => {
    const key = `${endpoint.method}-${endpoint.path}`;
    setLoading(prev => ({ ...prev, [key]: true }));
    try {
      let path = endpoint.path;
      if (editingId[key]) {
        path = path.replace(/:id/, editingId[key]);
        path = path.replace(/:mentorId/, editingId[key] || 'm1');
        path = path.replace(/:categoryId/, editingId[key] || 'c1');
        path = path.replace(/:menteeId/, editingId[key] || 'e1');
      }
      let res;
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      switch (endpoint.method) {
        case 'GET': res = await api.get(path, config); break;
        case 'POST': res = await api.post(path, endpoint.body || {}, config); break;
        case 'PUT': res = await api.put(path, endpoint.body || {}, config); break;
        case 'DELETE': res = await api.delete(path, config); break;
        default: res = await api.get(path, config);
      }
      setResults(prev => ({ ...prev, [key]: { status: res.status, data: res.data, ok: true } }));
    } catch (err) {
      setResults(prev => ({
        ...prev,
        [key]: {
          status: err.response?.status || 0,
          data: err.response?.data || err.message,
          ok: false
        }
      }));
    }
    setLoading(prev => ({ ...prev, [key]: false }));
  };

  const activeModuleData = MODULES.find(m => m.name === activeModule);

  return (
    <div className="app">
      <header className="header">
        <h1>🧪 MMS API Test Dashboard</h1>
        {token ? (
          <div className="token-bar">
            <span className="token-indicator">✅ Authenticated</span>
            <button className="btn btn-small" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <LoginForm onLogin={handleLogin} setToken={setToken} />
        )}
      </header>

      <div className="layout">
        <nav className="sidebar">
          {MODULES.map(m => (
            <button
              key={m.name}
              className={`module-btn ${activeModule === m.name ? 'active' : ''}`}
              style={{ borderLeft: `4px solid ${m.color}` }}
              onClick={() => setActiveModule(m.name)}
            >
              {m.name}
            </button>
          ))}
        </nav>

        <main className="content">
          <h2 style={{ color: activeModuleData?.color }}>{activeModule} Endpoints</h2>
          <div className="endpoint-list">
            {activeModuleData?.endpoints.map((ep, i) => {
              const key = `${ep.method}-${ep.path}`;
              const res = results[key];
              const hasParam = ep.path.includes(':id') || ep.path.includes(':mentorId') || ep.path.includes(':categoryId') || ep.path.includes(':menteeId');

              return (
                <div key={i} className="endpoint-card">
                  <div className="endpoint-header">
                    <span className={`method method-${ep.method.toLowerCase()}`}>{ep.method}</span>
                    <code className="path">{ep.path}</code>
                    <button
                      className="btn btn-test"
                      onClick={() => testEndpoint(ep)}
                      disabled={loading[key]}
                    >
                      {loading[key] ? '⏳' : '▶ Test'}
                    </button>
                  </div>

                  {hasParam && (
                    <div className="param-input">
                      <label>:id/:mentorId replace with</label>
                      <input
                        value={editingId[key] || ''}
                        onChange={e => setEditingId(prev => ({ ...prev, [key]: e.target.value }))}
                        placeholder="Enter UUID..."
                      />
                    </div>
                  )}

                  {ep.body && (
                    <pre className="body-preview">{JSON.stringify(ep.body, null, 2)}</pre>
                  )}

                  {res && (
                    <div className={`result ${res.ok ? 'success' : 'error'}`}>
                      <div className="status-badge">Status: {res.status}</div>
                      <pre>{JSON.stringify(res.data, null, 2)}</pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}

function LoginForm({ onLogin, setToken }) {
  const [email, setEmail] = useState('admin@mentorkhet.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      // Try register if login fails
      try {
        const api = (await import('./api')).default;
        const role = email.includes('admin') ? 'admin' : email.includes('mentor') ? 'mentor' : 'mentee';
        const res = await api.post('/auth/register', {
          email, password, firstName: 'Test', lastName: 'User', role
        });
        const t = res.body?.accessToken || res.data?.accessToken || '';
        if (t) {
          localStorage.setItem('token', t);
          setToken(t);
          setError('');
        }
      } catch (r) {
        setError('Login & Register both failed. Is the server running?');
      }
    }
    setLoading(false);
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit" disabled={loading}>{loading ? '⏳' : '🔑 Login / Register'}</button>
      {error && <span className="login-error">{error}</span>}
    </form>
  );
}

export default App;
