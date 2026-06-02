import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getUnreadNotifs } from '../api';

export default function Navbar({ user, setUser }) {
  const loc = useLocation();
  const token = localStorage.getItem('token');
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (token) getUnreadNotifs().then(r => setUnread(r.data?.count || r.data?.length || 0)).catch(() => {});
  }, [loc]);

  const links = [
    { to: '/', label: '🏠 Dashboard' },
    { to: '/mentors', label: '👥 Mentors' },
    { to: '/sessions', label: '📅 Sessions' },
    { to: '/feedback', label: '⭐ Feedback' },
    { to: '/skills', label: '🔧 Skills' },
    { to: '/notifications', label: `🔔${unread > 0 ? ` (${unread})` : ''}` },
    { to: '/admin', label: '⚙️ Admin' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
  };

  if (!token || loc.pathname === '/login') return null;

  return (
    <nav className="navbar">
      <div className="nav-brand">🎓 MentorKhet</div>
      <div className="nav-links">
        {links.map(l => (
          <Link key={l.to} to={l.to} className={`nav-link ${loc.pathname === l.to ? 'active' : ''}`}>
            {l.label}
          </Link>
        ))}
      </div>
      <div className="nav-right">
        <Link to="/profile" className="nav-user">{user?.firstName || 'Profile'}</Link>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </div>
    </nav>
  );
}
