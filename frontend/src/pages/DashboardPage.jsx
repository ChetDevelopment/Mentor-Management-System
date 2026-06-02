import { useState, useEffect } from 'react';
import { getMentors, getSessions, getNotifications, getUnreadNotifs, getFeedback } from '../api';
import { Link } from 'react-router-dom';

export default function DashboardPage({ user }) {
  const [mentors, setMentors] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [notifs, setNotifs] = useState(0);
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    getMentors().then(r => setMentors(r.data || [])).catch(() => {});
    getSessions().then(r => setSessions(Array.isArray(r.data) ? r.data : [])).catch(() => {});
    getUnreadNotifs().then(r => setNotifs(r.data?.count || r.data?.length || 0)).catch(() => {});
    getFeedback().then(r => setFeedback(Array.isArray(r.data) ? r.data : [])).catch(() => {});
  }, []);

  const cards = [
    { label: '👥 Mentors', count: mentors.length, to: '/mentors', color: '#10b981' },
    { label: '📅 Sessions', count: sessions.length, to: '/sessions', color: '#3b82f6' },
    { label: '🔔 Notifications', count: notifs, to: '/notifications', color: '#f59e0b' },
    { label: '⭐ Feedback', count: feedback.length, to: '/feedback', color: '#8b5cf6' },
  ];

  return (
    <div>
      <h1>Welcome{user?.firstName ? `, ${user.firstName}` : ''} 👋</h1>
      <div className="dashboard-cards">
        {cards.map(c => (
          <Link key={c.label} to={c.to} className="dash-card" style={{ borderTop: `4px solid ${c.color}` }}>
            <div className="dash-count">{c.count}</div>
            <div className="dash-label">{c.label}</div>
          </Link>
        ))}
      </div>
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-btns">
          <Link to="/mentors" className="action-btn">Browse Mentors</Link>
          <Link to="/sessions" className="action-btn">My Sessions</Link>
          <Link to="/feedback" className="action-btn">Give Feedback</Link>
          <Link to="/skills" className="action-btn">Browse Skills</Link>
        </div>
      </div>
    </div>
  );
}
