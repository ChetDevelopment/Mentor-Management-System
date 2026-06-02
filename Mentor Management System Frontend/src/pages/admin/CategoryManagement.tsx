/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { SkillCategory } from '../../types';
import { Layers, FolderPlus, Trash2, CheckCircle2, Sliders } from 'lucide-react';

export const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create Category state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [skillsCsv, setSkillsCsv] = useState('');
  
  const [feedback, setFeedback] = useState('');

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories.', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    try {
      // Split comma separated tags
      const skills = skillsCsv ? skillsCsv.split(',').map(s => s.trim()).filter(Boolean) : [];
      await api.post('/admin/categories', { name, description, skills });
      
      setName('');
      setDescription('');
      setSkillsCsv('');
      setFeedback('New Skill Domain registered successfully.');
      setTimeout(() => setFeedback(''), 2500);
      loadCategories();
    } catch (err) {
      alert('Error registering category.');
    }
  };

  const handleDeleteCategory = async (id: string, catName: string) => {
    if (!window.confirm(`Are you sure you want to delete Category "${catName}"? This may impact mentor matches.`)) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      setFeedback(`Skill Category ${catName} de-registered.`);
      setTimeout(() => setFeedback(''), 2500);
      loadCategories();
    } catch (err) {
      alert('Failed de-registering category.');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-5 h-5 border-2 border-slate-700 border-t-teal-400 rounded-full animate-spin mb-3"></div>
        <p className="text-xs font-mono text-slate-500">RETRIEVING TECHNOLOGY REGISTRIES...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in" id="admin-categories-root">
      
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">Skills Registry Workspace</h1>
        <p className="text-xs text-slate-400 font-mono mt-1">CURRICULUM CATEGORIES MATRIX AND SKILLS ASSIGNMENT</p>
      </div>

      {feedback && (
        <div className="bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs px-3 py-2 rounded font-mono" id="categories-notice">
          {feedback}
        </div>
      )}

      {/* TWO BLOCK LAYOUT */}
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        
        {/* ADD CATEGORY COMPONENT FORM */}
        <div className="bg-slate-900 border border-slate-800 rounded p-5 lg:p-6" id="add-category-box">
          <form onSubmit={handleCreateCategory} className="space-y-4">
            <div className="flex items-center gap-2 text-slate-200 border-b border-slate-850 pb-3 mb-2">
              <FolderPlus size={16} className="text-teal-400" />
              <span className="text-xs font-mono tracking-tight font-bold">ADD NEW SKILL DOMAIN</span>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5">Category Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. AI & Machine Learning"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded px-3 py-2 text-xs font-mono text-slate-200 outline-none placeholder:text-slate-700"
                id="cat-name-input"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5">Focus Summary / Description *</label>
              <textarea
                required
                placeholder="Focus summary metrics..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded px-3 py-1.5 text-xs text-slate-200 outline-none resize-none placeholder:text-slate-700"
                rows={3}
                id="cat-desc-input"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5">Expert Skills tags (Comma separated list)</label>
              <input
                type="text"
                placeholder="Python, PyTorch, Pandas, Scikit"
                value={skillsCsv}
                onChange={(e) => setSkillsCsv(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded px-3 py-2 text-xs font-mono text-slate-200 outline-none placeholder:text-slate-700"
                id="cat-skills-input"
              />
              <span className="text-[9px] font-mono text-slate-600 mt-1 block">Separate skill tags with simple commas.</span>
            </div>

            <button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 py-2.5 rounded text-xs font-mono font-bold tracking-wider transition-colors uppercase focus:outline-none"
            >
              Commit Skill Domain
            </button>
          </form>
        </div>

        {/* ACTIVE DIRECTORY TABLE LIST */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-mono tracking-wider font-bold text-slate-400 uppercase flex items-center gap-2">
            <Layers size={15} className="text-teal-400" />
            <span>ACTIVE SKILL FILES MATRIX</span>
          </h2>

          <div className="space-y-4" id="categories-grid-display">
            {categories.map((cat) => (
              <div 
                key={cat.id} 
                className="bg-slate-900 border border-slate-850 p-5 rounded space-y-3 relative group"
                id={`cat-card-${cat.id}`}
              >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-200">{cat.name}</h3>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">ID: {cat.id}</p>
                    </div>

                    <button
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      className="p-1.5 bg-slate-950 border border-slate-855 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 rounded transition-all focus:outline-none opacity-0 group-hover:opacity-100"
                      title="De-register Category File"
                      id={`delete-cat-${cat.id}`}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <p className="text-xs text-slate-350 leading-relaxed max-w-xl">{cat.description}</p>

                  <div className="pt-2 border-t border-slate-855/50 flex flex-wrap gap-1.5">
                    {cat.skills.map(s => (
                      <span key={s} className="bg-slate-950 border border-slate-855 text-teal-400/90 text-[10px] font-mono px-2 py-0.5 rounded">
                        {s}
                      </span>
                    ))}
                  </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
