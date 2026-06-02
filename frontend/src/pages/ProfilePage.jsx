import { useState } from 'react';
import { updateProfile } from '../api';

export default function ProfilePage({ user, setUser }) {
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [msg, setMsg] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile({ userId: user?.id, firstName, lastName, phone });
      setUser(res.data || user);
      setMsg('✅ Profile updated!');
    } catch { setMsg('❌ Update failed'); }
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="page-center">
      <div className="profile-card">
        <h1>👤 My Profile</h1>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
        <form onSubmit={handleSave}>
          <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First Name" />
          <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last Name" />
          <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" />
          <button type="submit" className="btn-primary">Save Changes</button>
        </form>
        {msg && <p className="msg">{msg}</p>}
      </div>
    </div>
  );
}
