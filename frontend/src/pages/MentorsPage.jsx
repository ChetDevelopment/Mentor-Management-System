import { useState, useEffect } from 'react';
import { getMentors, getSkills, getResources, getAvailability } from '../api';

export default function MentorsPage() {
  const [mentors, setMentors] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selected, setSelected] = useState(null);
  const [resources, setResources] = useState([]);
  const [avail, setAvail] = useState([]);

  useEffect(() => {
    getMentors().then(r => setMentors(r.data || [])).catch(() => {});
    getSkills().then(r => setSkills(r.data || [])).catch(() => {});
  }, []);

  const viewMentor = async (m) => {
    setSelected(m);
    getResources(m.id || m.userId).then(r => setResources(r.data || [])).catch(() => setResources([]));
    getAvailability(m.id || m.userId).then(r => setAvail(r.data || [])).catch(() => setAvail([]));
  };

  return (
    <div>
      <h1>👥 Mentors</h1>
      {selected ? (
        <div>
          <button className="btn-back" onClick={() => setSelected(null)}>← Back</button>
          <div className="mentor-detail">
            <h2>{selected.title || 'Mentor'} {selected.company ? `@ ${selected.company}` : ''}</h2>
            <p>{selected.shortDescription || selected.fullBio || 'No bio'}</p>
            <p><strong>Experience:</strong> {selected.yearsOfExperience || 0} years</p>
            <p><strong>Rating:</strong> {'⭐'.repeat(Math.round(selected.rating || 0))} ({selected.rating || 0})</p>
            <p><strong>Sessions:</strong> {selected.totalSessions || 0}</p>
            {resources.length > 0 && (
              <div className="section">
                <h3>📚 Resources</h3>
                {resources.map(r => <div key={r.id} className="resource-item">{r.title} - {r.type}</div>)}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mentor-grid">
          {mentors.map(m => (
            <div key={m.id} className="mentor-card" onClick={() => viewMentor(m)}>
              <h3>{m.title || 'Mentor'}</h3>
              <p className="company">{m.company || ''}</p>
              <p className="rating">⭐ {m.rating || 0} • {m.totalSessions || 0} sessions</p>
              <p className="bio">{m.shortDescription?.substring(0, 100) || 'No bio'}</p>
            </div>
          ))}
          {mentors.length === 0 && <p className="empty">No mentors found</p>}
        </div>
      )}
    </div>
  );
}
