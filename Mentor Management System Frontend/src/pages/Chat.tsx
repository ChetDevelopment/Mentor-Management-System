/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ChatMessage, User } from '../types';
import { Send, MessageSquare, ShieldAlert, UserCheck, Inbox } from 'lucide-react';

export const Chat: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activePartnerId, setActivePartnerId] = useState<string | null>(null);
  const [activePartnerName, setActivePartnerName] = useState<string>('');
  const [partners, setPartners] = useState<{ id: string; name: string; role: string; avatar: string }[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessagesAndPartners = async () => {
    try {
      // 1. Get messages
      const mRes = await api.get('/chat/messages');
      const chatMsgs: ChatMessage[] = mRes.data;
      setMessages(chatMsgs);

      // 2. Discover dialogue partners based on our local database
      const allUsers: User[] = JSON.parse(localStorage.getItem('mentorkhet_users') || '[]');
      
      // Collect IDs from messages involving current user
      const partnerIds = Array.from(new Set(
        chatMsgs.flatMap(m => [m.senderId, m.receiverId])
      )).filter(id => id !== user?.id);

      // Map matching user profiles
      const partnerList = allUsers
        .filter(u => partnerIds.includes(u.id))
        .map(u => ({
          id: u.id,
          name: `${u.firstName} ${u.lastName}`,
          role: u.role,
          avatar: u.avatar
        }));

      // If no messaging history exists, pre-populate default contact from session registry
      if (partnerList.length === 0) {
        if (user?.role === 'MENTEE') {
          // Pre-populate approved mentors
          const approvedMentors = allUsers.filter(u => u.role === 'MENTOR' && u.id !== user?.id);
          approvedMentors.forEach(m => {
            partnerList.push({
              id: m.id,
              name: `${m.firstName} ${m.lastName}`,
              role: m.role,
              avatar: m.avatar
            });
          });
        } else if (user?.role === 'MENTOR') {
          // Pre-populate default mentee
          const mentees = allUsers.filter(u => u.role === 'MENTEE');
          mentees.forEach(m => {
            partnerList.push({
              id: m.id,
              name: `${m.firstName} ${m.lastName}`,
              role: m.role,
              avatar: m.avatar
            });
          });
        }
      }

      setPartners(partnerList);

      // Auto-select first partner if none selected
      if (!activePartnerId && partnerList.length > 0) {
        setActivePartnerId(partnerList[0].id);
        setActivePartnerName(partnerList[0].name);
      }
    } catch (err) {
      console.error('Error fetching chat nodes', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMessagesAndPartners();
    }
  }, [user]);

  // Scroll to bottom helper
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activePartnerId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activePartnerId) return;

    try {
      await api.post('/chat/messages', {
        receiverId: activePartnerId,
        text: inputText
      });
      setInputText('');
      // Refresh messages
      fetchMessagesAndPartners();
    } catch (err) {
      alert('Error delivering message.');
    }
  };

  // Filter messages for active partner
  const conversation = messages.filter(m => 
    (m.senderId === user?.id && m.receiverId === activePartnerId) || 
    (m.senderId === activePartnerId && m.receiverId === user?.id)
  );

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-5 h-5 border-2 border-slate-700 border-t-teal-400 rounded-full animate-spin mb-3"></div>
        <p className="text-xs font-mono text-slate-500 font-mono">RESOLVING SECURITY CHAT ROOMS...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col lg:flex-row bg-slate-900 border border-slate-800 rounded min-h-[500px] overflow-hidden" id="chat-workspace">
      
      {/* 2496 CHAT PARTNERS SIDE DRAWER COLUMN */}
      <aside className="w-full lg:w-80 bg-slate-950 border-r border-slate-850 flex flex-col">
        <div className="p-4 border-b border-slate-850">
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
            <MessageSquare size={13} className="text-teal-400" />
            <span>Active Dialogue nodes</span>
          </p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-900" id="chat-partner-list">
          {partners.length === 0 ? (
            <p className="text-center text-xs text-slate-600 font-mono p-8">No conversation routes discovered on this node.</p>
          ) : (
            partners.map(p => (
              <button
                key={p.id}
                onClick={() => {
                  setActivePartnerId(p.id);
                  setActivePartnerName(p.name);
                }}
                className={`w-full text-left p-4 flex gap-3 transition-colors hover:bg-slate-900/50 focus:outline-none ${
                  activePartnerId === p.id ? 'bg-slate-900 border-l-2 border-teal-400' : ''
                }`}
                id={`partner-btn-${p.id}`}
              >
                <img 
                  src={p.avatar} 
                  alt={p.name} 
                  className="w-9 h-9 rounded bg-slate-800 object-cover border border-slate-800 flex-shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-300">{p.name}</p>
                  <p className="text-[9px] font-mono text-slate-500 uppercase mt-0.5">{p.role} CHANNEL</p>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* ACTIVE MULTI COMPONENT THREAD CONTAINER */}
      <section className="flex-1 flex flex-col bg-slate-900">
        {activePartnerId ? (
          <>
            {/* THREAD TOP PANEL INFO */}
            <div className="p-4 border-b border-slate-850 flex items-center justify-between bg-slate-950/40">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-teal-400 rounded-full animate-ping"></span>
                <p className="text-xs font-bold text-slate-200">{activePartnerName}</p>
              </div>
              <span className="text-[9px] font-mono text-slate-500">ENCRYPTED DOCK CHANNEL</span>
            </div>

            {/* THREAD CORE BUBBLE SCROLLER */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs" id="chat-bubble-scroller">
              {conversation.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2 py-12">
                  <Inbox size={20} className="text-slate-700" />
                  <p className="font-mono text-[10px]">No transmission packets logged. Write below to initialize.</p>
                </div>
              ) : (
                conversation.map(msg => {
                  const isSentByMe = msg.senderId === user?.id;
                  
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex flex-col ${isSentByMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`max-w-md p-3 rounded leading-normal ${
                        isSentByMe 
                          ? 'bg-teal-500 text-slate-950 rounded-br-none font-medium' 
                          : 'bg-slate-950 text-slate-200 rounded-bl-none'
                      }`}>
                        <p>{msg.text}</p>
                      </div>
                      
                      <span className="text-[8px] font-mono text-slate-500 mt-1">
                        {isSentByMe ? 'You' : msg.senderName} • {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* MESSAGE ENTRY BOX FORM */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-850 bg-slate-950/60 flex items-center gap-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your instruction or inquiry transmission package..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-2.5 text-xs font-mono text-slate-200 placeholder:text-slate-700 outline-none focus:border-teal-400"
                id="msg-input-field"
              />
              <button
                type="submit"
                id="chat-send-btn"
                className="bg-teal-500 hover:bg-teal-400 text-slate-950 p-2.5 rounded transition-colors focus:outline-none"
              >
                <Send size={15} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-2 p-12">
            <MessageSquare size={24} className="text-slate-700" />
            <p className="text-xs font-mono">Specify a dialogue partner channel in the side panel.</p>
          </div>
        )}
      </section>

    </div>
  );
};
