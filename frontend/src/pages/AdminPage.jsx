import { useState, useEffect } from 'react';
import { getAdminDashboard, getAdminUsers, getAdminMentors, getAdminMentees, deactivateUser } from '../api';

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [tab, setTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [mentees, setMentees] = useState([]);

  useEffect(() => {
    getAdminDashboard().then(r => setStats(r.data || r)).catch(() => {});
    getAdminUsers().then(r => setUsers(r.data || [])).catch(() => {});
    getAdminMentors().then(r => setMentors(r.data || [])).catch(() => {});
    getAdminMentees().then(r => setMentees(r.data || [])).catch(() => {});
  }, []);

  const handleDeactivate = async (id) => {
    await deactivateUser(id);
    getAdminUsers().then(r => setUsers(r.data || [])).catch(() => {});
  };

  const tabs = [
    { key: 'dashboard', label: '📊 Dashboard' },
    { key: 'users', label: '👥 Users' },
    { key: 'mentors', label: '👤 Mentors' },
    { key: 'mentees', label: '👤 Mentees' },
  ];

  return (
    <div>
      <h1>⚙️ Admin Panel</h1>
      <div className="admin-tabs">
        {tabs.map(t => (
          <button key={t.key} className={`tab-btn ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>{t.label}</button>
        ))}
      </div>

      {tab === 'dashboard' && stats && (
        <div className="admin-stats">
          <div className="stat-card"><h3>👥 Users</h3><p className="stat-num">{stats.totalUsers || stats.total || 0}</p></div>
          <div className="stat-card"><h3>👤 Mentors</h3><p className="stat-num">{stats.totalMentors || 0}</p></div>
          <div className="stat-card"><h3>👤 Mentees</h3><p className="stat-num">{stats.totalMentees || 0}</p></div>
          <div className="stat-card"><h3>📅 Sessions</h3><p className="stat-num">{stats.totalSessions || stats.activeSessions || 0}</p></div>
        </div>
      )}

      {tab === 'users' && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>ID</th><th>Email</th><th>Role</th><th>Active</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.id?.substring(0, 8)}...</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.isActive ? '✅' : '❌'}</td>
                  <td><button className="btn-sm btn-red" onClick={() => handleDeactivate(u.id)}>Deactivate</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'mentors' && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>ID</th><th>Title</th><th>Company</th><th>Rating</th><th>Status</th></tr></thead>
            <tbody>
              {mentors.map(m => (
                <tr key={m.id}>
                  <td>{m.id?.substring(0, 8)}...</td>
                  <td>{m.title || '-'}</td>
                  <td>{m.company || '-'}</td>
                  <td>{m.rating || 0}</td>
                  <td>{m.status || 'active'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'mentees' && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>ID</th><th>Occupation</th><th>Goals</th></tr></thead>
            <tbody>
              {mentees.map(m => (
                <tr key={m.id}>
                  <td>{m.id?.substring(0, 8)}...</td>
                  <td>{m.occupation || '-'}</td>
                  <td>{m.goals?.substring(0, 50) || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
