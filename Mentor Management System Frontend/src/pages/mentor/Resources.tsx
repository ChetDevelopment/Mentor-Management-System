/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FileText, FolderPlus, Trash2, ArrowUpRight, Share2, Sparkles } from 'lucide-react';

interface ResourceItem {
  id: string;
  title: string;
  category: string;
  url: string;
  notes?: string;
  sharedBy: string; // Mentor name
  sharedAt: string;
}

export const Resources: React.FC = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [feedback, setFeedback] = useState('');

  const loadResources = () => {
    setLoading(true);
    const stored = localStorage.getItem('mentorkhet_resources');
    if (stored) {
      setResources(JSON.parse(stored));
    } else {
      // Seeds default
      const defaultResources: ResourceItem[] = [
        {
          id: 'res-1',
          title: 'Deep-dive React Fiber & Reconciliation Algorithm Overview',
          category: 'Web Development',
          url: 'https://react.dev',
          notes: 'Crucial syllabus reading mapping render reconciliations before our performance slot.',
          sharedBy: 'Sarah Kaufman',
          sharedAt: '2026-05-24T18:00:00Z'
        },
        {
          id: 'res-2',
          title: 'Docker Orchestration Stack: Container Isolation Layer Checklist',
          category: 'DevOps & Cloud',
          url: 'https://docker.com',
          notes: 'Check config parameters for microservice clusters before the container validation run.',
          sharedBy: 'Marcus Vance',
          sharedAt: '2026-05-20T11:00:00Z'
        }
      ];
      localStorage.setItem('mentorkhet_resources', JSON.stringify(defaultResources));
      setResources(defaultResources);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadResources();
  }, []);

  const handleShareResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    const newRes: ResourceItem = {
      id: `res-${Math.random().toString(36).substr(2, 9)}`,
      title,
      category,
      url,
      notes,
      sharedBy: user ? `${user.firstName} ${user.lastName}` : 'Audited Coach',
      sharedAt: new Date().toISOString()
    };

    const updated = [newRes, ...resources];
    localStorage.setItem('mentorkhet_resources', JSON.stringify(updated));
    setResources(updated);
    
    setTitle('');
    setUrl('');
    setNotes('');
    setFeedback('Knowledge asset distributed successfully.');
    setTimeout(() => setFeedback(''), 2500);
  };

  const handleDeleteResource = (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete shared resource "${name}"?`)) return;
    const updated = resources.filter(r => r.id !== id);
    localStorage.setItem('mentorkhet_resources', JSON.stringify(updated));
    setResources(updated);
    setFeedback('Knowledge asset removed.');
    setTimeout(() => setFeedback(''), 2500);
  };

  const categoriesOption = ['Web Development', 'DevOps & Cloud', 'UX/UI & Product Design', 'QA Testing & Automation'];

  const canShare = user?.role === 'MENTOR' || user?.role === 'ADMIN';

  return (
    <div className="space-y-8 animate-fade-in" id="resources-workspace">
      
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100 font-sans">Knowledge Depot</h1>
        <p className="text-xs text-slate-400 font-mono mt-1">DISTRIBUTED STUDENT SYLLABUS, REPOSITORIES AND CHALLENGE SHEETS</p>
      </div>

      {feedback && (
        <div className="bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs px-3 py-2 rounded font-mono" id="resources-notice">
          {feedback}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        
        {/* SHARE BLOCK COMPONENT */}
        {canShare ? (
          <div className="bg-slate-900 border border-slate-800 rounded p-5 lg:p-6" id="add-resource-box">
            <form onSubmit={handleShareResource} className="space-y-4">
              <div className="flex items-center gap-2 text-slate-200 border-b border-slate-850 pb-3 mb-2">
                <Share2 size={16} className="text-teal-400" />
                <span className="text-xs font-mono tracking-tight font-bold">SHARE KNOWLEDGE TO DISK</span>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5">Asset Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js App Router Architecture"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none placeholder:text-slate-700"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5">Asset Target URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/myteam/project"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded px-2.5 py-1.5 text-xs text-slate-200 font-mono outline-none placeholder:text-slate-700"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5">Branch Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded px-2.5 py-1.5 text-xs text-slate-350 outline-none"
                  >
                    {categoriesOption.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5">Teacher Summary Notes</label>
                <textarea
                  placeholder="Insert homework logs, homework reviews, specific focus coordinates..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none resize-none placeholder:text-slate-700"
                  rows={2}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 py-2.5 rounded text-xs font-mono font-bold tracking-wider uppercase transition-colors focus:outline-none"
              >
                Distribute Asset
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded p-5 text-center text-xs font-mono space-y-2">
            <span className="text-teal-400 font-bold block uppercase">Student Access Enabled</span>
            <p className="text-slate-500 leading-normal">You can download shared documents, challenge sheets, and link logs from here.</p>
          </div>
        )}

        {/* ACTIVE DEPOSITED RESOURCES LIST */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-mono tracking-wider font-bold text-slate-400 uppercase flex items-center gap-2">
            <FileText size={15} className="text-teal-400" />
            <span>ACTIVE DEPOSITED SYLLABI</span>
          </h2>

          <div className="space-y-4" id="resources-grid-display">
            {resources.length === 0 ? (
              <p className="text-center italic text-xs text-slate-600 font-mono p-8 border border-slate-900 rounded bg-slate-950/20">No knowledge assets active on this node.</p>
            ) : (
              resources.map((res) => (
                <div 
                  key={res.id} 
                  className="bg-slate-900 border border-slate-850 p-5 rounded space-y-3 relative group hover:border-slate-800 transition-colors"
                  id={`res-item-${res.id}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="bg-slate-950 border border-slate-855 text-teal-400 text-[8px] font-mono px-2 py-0.5 rounded uppercase font-bold">
                        {res.category}
                      </span>
                      <h3 className="text-sm font-bold text-slate-200 tracking-tight mt-2">{res.title}</h3>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-slate-950 border border-slate-855 text-teal-400 hover:bg-slate-850 rounded transition-colors"
                        title="Open Resource URL link"
                      >
                        <ArrowUpRight size={13} />
                      </a>

                      {canShare && (
                        <button
                          onClick={() => handleDeleteResource(res.id, res.title)}
                          className="p-1.5 bg-slate-950 border border-slate-855 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 rounded transition-all focus:outline-none opacity-0 group-hover:opacity-100"
                          title="Purge shared resource link"
                          id={`delete-res-${res.id}`}
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  {res.notes && (
                    <div className="p-3 bg-slate-950/40 rounded border border-slate-855 text-xs text-slate-450 leading-relaxed italic">
                      "{res.notes}"
                    </div>
                  )}

                  <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
                    <span>Uploaded By: <b className="text-slate-350">{res.sharedBy}</b></span>
                    <span>Date: {new Date(res.sharedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
