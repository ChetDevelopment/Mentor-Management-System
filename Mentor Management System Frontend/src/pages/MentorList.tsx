/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { MentorProfile, SkillCategory } from '../types';
import { Search, Star, Award, ChevronRight, CheckCircle, SlidersHorizontal, Sparkles } from 'lucide-react';

export const MentorList: React.FC = () => {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState<MentorProfile[]>([]);
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSkill, setSelectedSkill] = useState<string>('ALL');

  useEffect(() => {
    const loadMentorsAndCats = async () => {
      setLoading(true);
      try {
        const mRes = await api.get('/mentors'); // Fetch approved mentors
        setMentors(mRes.data);

        const cRes = await api.get('/categories');
        setCategories(cRes.data);
      } catch (err) {
        console.error('Error fetching mentorship profiles.', err);
      } finally {
        setLoading(false);
      }
    };
    loadMentorsAndCats();
  }, []);

  // Filter criteria logic
  const filteredMentors = mentors.filter(mentor => {
    // 1. Category check
    if (selectedCategory !== 'ALL' && mentor.category !== selectedCategory) {
      return false;
    }
    // 2. Skill check
    if (selectedSkill !== 'ALL' && !mentor.skills.includes(selectedSkill)) {
      return false;
    }
    // 3. Keyword check
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const nameMatch = `${mentor.firstName} ${mentor.lastName}`.toLowerCase().includes(query);
      const bioMatch = mentor.shortDescription.toLowerCase().includes(query);
      const skillsMatch = mentor.skills.some(s => s.toLowerCase().includes(query));
      return nameMatch || bioMatch || skillsMatch;
    }
    return true;
  });

  // Collect all skills for the active category filter
  const activeSkillsList = selectedCategory === 'ALL' 
    ? Array.from(new Set(categories.flatMap(c => c.skills)))
    : categories.find(c => c.name === selectedCategory)?.skills || [];

  return (
    <div className="space-y-8 animate-fade-in" id="mentor-list-root">
      
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">Mentor Directory</h1>
        <p className="text-xs text-slate-400 font-mono mt-1">SECURED AND ACCREDITED INDUSTRY LEADERS FIRST</p>
      </div>

      {/* FILTER PANEL */}
      <div className="bg-slate-900 border border-slate-800 rounded p-4 lg:p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-stretch justify-between">
          
          {/* SEARCH INPUT */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
              <Search size={15} />
            </span>
            <input
              type="text"
              placeholder="Search by name, skills or biography keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-teal-400 rounded pl-9 pr-4 py-2 text-xs font-mono text-slate-200 outline-none transition-colors placeholder:text-slate-700"
              id="mentor-search-query"
            />
          </div>

          {/* CATEGORY SELECTOR */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-500 flex items-center gap-1.5 whitespace-nowrap">
              <SlidersHorizontal size={13} />
              <span>Category File:</span>
            </span>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSkill('ALL'); // reset nested skills
              }}
              className="bg-slate-950 border border-slate-800 text-slate-300 rounded px-3 py-2 text-xs outline-none focus:border-teal-400 font-mono"
              id="mentor-category-select"
            >
              <option value="ALL">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

        </div>

        {/* SUB-SKILL QUICK TAG CHIPS */}
        {activeSkillsList.length > 0 && (
          <div className="pt-3 border-t border-slate-850 flex items-center flex-wrap gap-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase mr-2">Quick Skill Tags:</span>
            <button
              onClick={() => setSelectedSkill('ALL')}
              className={`px-2.5 py-0.5 rounded text-[10px] font-mono border transition-colors focus:outline-none ${
                selectedSkill === 'ALL'
                  ? 'bg-teal-500/10 text-teal-400 border-teal-500/20 font-semibold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              * ALL
            </button>
            
            {activeSkillsList.map(skill => (
              <button
                key={skill}
                onClick={() => setSelectedSkill(skill)}
                className={`px-2.5 py-0.5 rounded text-[10px] font-mono border transition-colors focus:outline-none ${
                  selectedSkill === skill
                    ? 'bg-teal-500/10 text-teal-400 border-teal-500/20 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* MATCH COUNT */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-500">
        <span>Verified Files Matching query: {filteredMentors.length} profile records</span>
        {selectedCategory !== 'ALL' && (
          <span>Filtering category: <b className="text-slate-300">{selectedCategory}</b></span>
        )}
      </div>

      {/* MENTORS RESPONSE GRID AREA */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-44 bg-slate-900 border border-slate-800 rounded animate-pulse"></div>
          <div className="h-44 bg-slate-900 border border-slate-800 rounded animate-pulse"></div>
        </div>
      ) : filteredMentors.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 p-12 text-center rounded space-y-3">
          <p className="text-xs text-slate-400 font-mono">No verified instructors match your active query constraints.</p>
          <button 
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
              setSelectedSkill('ALL');
            }}
            className="text-xs text-teal-400 hover:underline font-mono"
          >
            Reset query filters
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredMentors.map((mentor) => (
            <div 
              key={mentor.id} 
              className="bg-slate-900 border border-slate-850 hover:border-slate-700 hover:bg-slate-900/85 transition-all p-5 rounded flex gap-5 group relative"
              id={`mentor-card-${mentor.id}`}
            >
              {/* Profile Avatar with Unsplash referrerPolicy */}
              <img 
                src={mentor.avatar} 
                alt={mentor.firstName} 
                className="w-14 h-14 rounded object-cover border border-slate-800 bg-slate-950 flex-shrink-0"
                referrerPolicy="no-referrer"
              />

              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-200 tracking-tight group-hover:text-teal-400 transition-colors">
                        {mentor.firstName} {mentor.lastName}
                      </h3>
                      <span className="inline-flex items-center gap-0.5 bg-teal-500/10 border border-teal-500/20 text-teal-300 rounded px-1.5 py-0.2 text-[8px] font-mono uppercase font-bold">
                        <CheckCircle size={9} /> Verified
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                      <Star size={11} className="fill-amber-400 stroke-none" />
                      <span>{mentor.rating || 'N/A'}</span>
                    </div>
                  </div>

                  <p className="text-[10px] font-mono text-teal-400/90 font-medium mb-2">{mentor.category} • {mentor.experience}Y Experience</p>
                  <p className="text-xs text-slate-450 line-clamp-2 leading-relaxed mb-4">{mentor.shortDescription}</p>

                  {/* Skills badges */}
                  <div className="flex flex-wrap gap-1.5 mb-4 max-h-[48px] overflow-hidden">
                    {mentor.skills.map(skill => (
                      <span key={skill} className="text-[9px] font-mono bg-slate-950 border border-slate-800 text-slate-400 px-2 py-0.5 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-850/60 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-slate-600">Weekly slots open</span>
                  <button
                    onClick={() => navigate(`/mentors/${mentor.id}`)}
                    className="text-xs font-mono text-teal-400 hover:text-teal-300 flex items-center gap-1 transition-colors focus:outline-none"
                    id={`btn-view-${mentor.id}`}
                  >
                    <span>Request Counsel</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
