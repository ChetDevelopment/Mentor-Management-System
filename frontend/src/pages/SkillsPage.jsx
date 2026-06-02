import { useState, useEffect } from 'react';
import { getSkills } from '../api';

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    getSkills().then(r => setSkills(r.data || [])).catch(() => {});
  }, []);

  const filtered = filter ? skills.filter(s => s.name?.toLowerCase().includes(filter.toLowerCase())) : skills;

  return (
    <div>
      <h1>🔧 Skills</h1>
      <input className="search-input" value={filter} onChange={e => setFilter(e.target.value)} placeholder="Search skills..." />
      <div className="skill-grid">
        {filtered.map(s => (
          <div key={s.id} className="skill-badge">
            {s.name} <span className="skill-cat">{s.category || 'General'}</span>
          </div>
        ))}
        {filtered.length === 0 && <p className="empty">No skills found</p>}
      </div>
    </div>
  );
}
