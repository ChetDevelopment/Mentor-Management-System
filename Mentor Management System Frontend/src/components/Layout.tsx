/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Compass, 
  Layers, 
  Calendar, 
  MessageSquare, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  FolderLock, 
  LogOut, 
  User as UserIcon,
  Bell, 
  Clock, 
  Menu, 
  X,
  Sparkles,
  FileText
} from 'lucide-react';

interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) return <>{children}</>;

  const getRoleBadgeColor = () => {
    switch (user.role) {
      case 'ADMIN': return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      case 'MENTOR': return 'bg-teal-500/10 text-teal-400 border border-teal-500/20';
      case 'MENTEE': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    }
  };

  const menuItems = {
    ADMIN: [
      { path: '/dashboard', label: 'Admin Terminal', icon: ShieldCheck },
      { path: '/admin/mentor-approvals', label: 'Mentor Approvals', icon: Sparkles, badge: 'Verifying' },
      { path: '/admin/users', label: 'User Operations', icon: Users },
      { path: '/admin/categories', label: 'Skills Registry', icon: Layers },
      { path: '/admin/reports', label: 'Mod Panel', icon: FolderLock },
    ],
    MENTOR: [
      { path: '/dashboard', label: 'Expert Console', icon: Compass },
      { path: '/sessions', label: 'Session Desk', icon: Calendar },
      { path: '/mentor/availability', label: 'My Availability', icon: Clock },
      { path: '/chat', label: 'Mentee Dialogues', icon: MessageSquare },
      { path: '/mentor/resources', label: 'Knowledge Depot', icon: FileText },
    ],
    MENTEE: [
      { path: '/dashboard', label: 'My Hub', icon: Compass },
      { path: '/mentors', label: 'Find Mentors', icon: Sparkles },
      { path: '/sessions', label: 'My Sessions', icon: Calendar },
      { path: '/chat', label: 'Mentor Chat', icon: MessageSquare },
      { path: '/mentee/progress', label: 'Goal Tracker', icon: TrendingUp },
    ]
  };

  const activeRoleItems = menuItems[user.role] || [];

  const handleLogoutClick = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans transition-all duration-150">
      
      {/* TOP HEADER BAR */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 px-4 py-3 xl:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            id="mobile-btn-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 text-slate-400 hover:text-slate-100 xl:hidden focus:outline-none"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <Link to="/" className="flex items-center gap-2">
            <span className="w-6 h-6 bg-teal-500 rounded flex items-center justify-center font-mono font-bold text-sm text-slate-950">K</span>
            <span className="text-lg font-mono font-bold tracking-tight text-slate-200">
              Mentor<span className="text-teal-400">Khet</span>
            </span>
          </Link>
          
          <span className="hidden sm:inline-block h-4 w-[1px] bg-slate-800"></span>
          
          <div className="hidden sm:flex items-center gap-2">
            <span className={`text-[10px] font-mono tracking-wider font-semibold uppercase px-2 py-0.5 rounded ${getRoleBadgeColor()}`}>
              {user.role} CORE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button id="noti-btn" className="p-1.5 text-slate-400 hover:text-slate-200 relative border border-transparent hover:border-slate-800 rounded transition-colors focus:outline-none">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-teal-400 rounded-full"></span>
          </button>
          
          <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
            <img 
              src={user.avatar} 
              alt={user.firstName}
              className="w-8 h-8 rounded bg-slate-800 object-cover border border-slate-700"
              referrerPolicy="no-referrer"
            />
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-slate-200">{user.firstName} {user.lastName}</p>
              <p className="text-[10px] font-mono text-slate-500">{user.email}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* SIDE BAR DESKTOP */}
        <aside className="hidden xl:flex flex-col w-64 bg-slate-900 border-r border-slate-800 self-stretch justify-between p-4 flex-shrink-0">
          <div className="space-y-6">
            <div className="px-2">
              <p className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">PLATFORM CONSOLE</p>
            </div>
            
            <nav className="space-y-1">
              {activeRoleItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    id={`nav-${item.path.replace(/\//g, '-')}`}
                    className={`flex items-center justify-between px-3 py-2 text-sm rounded transition-colors group ${
                      isActive 
                        ? 'bg-slate-800 text-teal-400 font-medium' 
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={16} className={isActive ? 'text-teal-400' : 'text-slate-500 group-hover:text-slate-300'} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-mono bg-teal-500/10 text-teal-300 border border-teal-500/20 px-1.5 py-0.2 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2">
            <button
              onClick={handleLogoutClick}
              id="btn-logout"
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 rounded transition-colors text-left"
            >
              <LogOut size={16} />
              <span>Disconnect Session</span>
            </button>
            <p className="text-[9px] font-mono text-slate-600 px-3">LOCAL TIMESTAMP AUDITED</p>
          </div>
        </aside>

        {/* SIDE BAR MOBILE DRAWER */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex xl:hidden" id="mobile-drawer">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)}></div>
            
            <div className="relative w-64 bg-slate-900 border-r border-slate-800 h-full flex flex-col justify-between p-4 flex-shrink-0 animate-in slide-in-from-left duration-200">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-sm font-mono font-semibold text-slate-300 uppercase">MENU OPTIONS</span>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-100 focus:outline-none"
                  >
                    <X size={18} />
                  </button>
                </div>

                <nav className="space-y-1">
                  {activeRoleItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3 py-2.5 text-sm rounded transition-colors ${
                          isActive 
                            ? 'bg-slate-800 text-teal-400 font-medium' 
                            : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={18} className={isActive ? 'text-teal-400' : 'text-slate-500'} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[9px] font-mono bg-teal-500/10 text-teal-300 border border-teal-500/20 px-1.5 py-0.2 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-2">
                <button
                  onClick={handleLogoutClick}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 rounded transition-colors text-left"
                >
                  <LogOut size={16} />
                  <span>Disconnect Session</span>
                </button>
                <p className="text-[9px] font-mono text-slate-600 px-3">SECURED AND AUDITED</p>
              </div>
            </div>
          </div>
        )}

        {/* MAIN BODY AREA */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-4 lg:p-8 flex flex-col justify-start">
          <div className="max-w-7xl w-full mx-auto flex-1 flex flex-col">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
};
