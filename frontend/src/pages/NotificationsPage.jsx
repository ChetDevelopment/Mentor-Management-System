import { useState, useEffect } from 'react';
import { getNotifications, markRead } from '../api';

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState([]);

  const load = () => getNotifications().then(r => setNotifs(Array.isArray(r.data) ? r.data : [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleRead = async (id) => {
    await markRead(id);
    load();
  };

  return (
    <div>
      <h1>🔔 Notifications</h1>
      <div className="notif-list">
        {notifs.map(n => (
          <div key={n.id} className={`notif-card ${n.isRead ? 'read' : 'unread'}`}>
            <div className="notif-content">
              <h4>{n.title}</h4>
              <p>{n.message}</p>
              <small>{new Date(n.createdAt).toLocaleString()}</small>
            </div>
            {!n.isRead && <button className="btn-sm btn-blue" onClick={() => handleRead(n.id)}>Mark Read</button>}
          </div>
        ))}
        {notifs.length === 0 && <p className="empty">No notifications</p>}
      </div>
    </div>
  );
}
