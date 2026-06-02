import { useState, useEffect } from 'react';
import { getSessions, createSession, acceptSession, completeSession, cancelSession } from '../api';

export default function SessionsPage({ user }) {
  const [sessions, setSessions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ mentorId: '', menteeId: '', title: '', scheduledAt: '', duration: 60 });

  const load = () => getSessions().then(r => setSessions(Array.isArray(r.data) ? r.data : [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await createSession(form);
    setShowForm(false);
    setForm({ mentorId: '', menteeId: '', title: '', scheduledAt: '', duration: 60 });
    load();
  };

  const handleAction = async (id, action) => {
    if (action === 'accept') await acceptSession(id);
    if (action === 'complete') await completeSession(id);
    if (action === 'cancel') await cancelSession(id);
    load();
  };

  const statusColors = { scheduled: '#f59e0b', completed: '#10b981', cancelled: '#ef4444', pending: '#3b82f6', confirmed: '#10b981', no_show: '#64748b' };

  return (
    <div>
      <div className="page-header">
        <h1>📅 Sessions</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Close' : '+ Request Session'}
        </button>
      </div>

      {showForm && (
        <form className="session-form" onSubmit={handleCreate}>
          <input value={form.mentorId} onChange={e => setForm({...form, mentorId: e.target.value})} placeholder="Mentor ID" required />
          <input value={form.menteeId} onChange={e => setForm({...form, menteeId: e.target.value})} placeholder="Mentee ID" required />
          <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Title" required />
          <input type="datetime-local" value={form.scheduledAt} onChange={e => setForm({...form, scheduledAt: e.target.value})} required />
          <input type="number" value={form.duration} onChange={e => setForm({...form, duration: +e.target.value})} placeholder="Duration (min)" min={15} max={180} />
          <button type="submit" className="btn-primary">Create Session</button>
        </form>
      )}

      <div className="session-list">
        {sessions.map(s => (
          <div key={s.id} className="session-card">
            <div className="session-info">
              <h3>{s.title}</h3>
              <p><strong>Mentor:</strong> {s.mentorId} | <strong>Mentee:</strong> {s.menteeId}</p>
              <p><strong>When:</strong> {new Date(s.scheduledAt).toLocaleString()} | <strong>Duration:</strong> {s.duration || 60}min</p>
              <span className="status-badge" style={{ background: statusColors[s.status] || '#94a3b8' }}>{s.status}</span>
            </div>
            <div className="session-actions">
              {s.status === 'pending' && <button onClick={() => handleAction(s.id, 'accept')} className="btn-sm btn-green">Accept</button>}
              {s.status !== 'completed' && s.status !== 'cancelled' && <button onClick={() => handleAction(s.id, 'complete')} className="btn-sm btn-blue">Complete</button>}
              {s.status !== 'cancelled' && s.status !== 'completed' && <button onClick={() => handleAction(s.id, 'cancel')} className="btn-sm btn-red">Cancel</button>}
            </div>
          </div>
        ))}
        {sessions.length === 0 && <p className="empty">No sessions yet</p>}
      </div>
    </div>
  );
}
