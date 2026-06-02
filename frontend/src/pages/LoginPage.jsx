import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../api';

export default function LoginPage({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('mentee');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const fn = isRegister ? register : login;
      const data = isRegister ? { email, password, firstName, lastName, role } : { email, password };
      const res = await fn(data);
      const t = res.data?.accessToken || res.data?.token;
      if (t) {
        localStorage.setItem('token', t);
        setUser(res.data?.user || { email });
        nav('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed. Is the server running?');
    }
    setLoading(false);
  };

  return (
    <div className="page-center">
      <div className="login-card">
        <h1>🎓 MentorKhet</h1>
        <h2>{isRegister ? 'Create Account' : 'Sign In'}</h2>
        <form onSubmit={handleSubmit}>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required minLength={6} />
          {isRegister && (
            <>
              <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First Name" required />
              <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last Name" required />
              <select value={role} onChange={e => setRole(e.target.value)}>
                <option value="mentee">Mentee</option>
                <option value="mentor">Mentor</option>
                <option value="admin">Admin</option>
              </select>
            </>
          )}
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading}>{loading ? '⏳...' : isRegister ? 'Register' : 'Login'}</button>
        </form>
        <p className="switch" onClick={() => { setIsRegister(!isRegister); setError(''); }}>
          {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
        </p>
      </div>
    </div>
  );
}
