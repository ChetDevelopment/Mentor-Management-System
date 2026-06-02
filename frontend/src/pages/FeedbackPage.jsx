import { useState, useEffect } from 'react';
import { getFeedback, submitFeedback } from '../api';

export default function FeedbackPage({ user }) {
  const [feedback, setFeedback] = useState([]);
  const [form, setForm] = useState({ mentorId: '', menteeId: '', rating: 5, comment: '' });

  useEffect(() => {
    getFeedback().then(r => setFeedback(Array.isArray(r.data) ? r.data : [])).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitFeedback(form);
    setForm({ mentorId: '', menteeId: '', rating: 5, comment: '' });
    getFeedback().then(r => setFeedback(Array.isArray(r.data) ? r.data : [])).catch(() => {});
  };

  return (
    <div>
      <h1>⭐ Feedback</h1>
      <form className="feedback-form" onSubmit={handleSubmit}>
        <h3>Submit Feedback</h3>
        <input value={form.mentorId} onChange={e => setForm({...form, mentorId: e.target.value})} placeholder="Mentor ID" required />
        <input value={form.menteeId} onChange={e => setForm({...form, menteeId: e.target.value})} placeholder="Mentee ID" required />
        <div className="rating-input">
          <label>Rating:</label>
          {[1,2,3,4,5].map(n => (
            <span key={n} className={`star ${form.rating >= n ? 'filled' : ''}`} onClick={() => setForm({...form, rating: n})}>⭐</span>
          ))}
        </div>
        <textarea value={form.comment} onChange={e => setForm({...form, comment: e.target.value})} placeholder="Comment (optional)" rows={3} />
        <button type="submit" className="btn-primary">Submit Feedback</button>
      </form>

      <h3 style={{marginTop: 24}}>All Feedback</h3>
      <div className="feedback-list">
        {feedback.map(f => (
          <div key={f.id} className="feedback-card">
            <p><strong>Mentor:</strong> {f.mentorId} | <strong>Rating:</strong> {'⭐'.repeat(f.rating)}</p>
            <p>{f.comment || 'No comment'}</p>
          </div>
        ))}
        {feedback.length === 0 && <p className="empty">No feedback yet</p>}
      </div>
    </div>
  );
}
