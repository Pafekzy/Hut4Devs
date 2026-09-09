import React, { useState } from 'react';
import { ShieldCheck, User, Lock, ArrowRight, Sparkles, X, Check, Laptop, Home } from 'lucide-react';
import { Member } from '../types';
import { FELLOW_MEMBERS } from '../mockData';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (member: Member) => void;
  currentMember?: Member;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  currentMember,
}) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'credentials' | 'join'>('quick');
  const [email, setEmail] = useState('alex.chen@fellowship.dev');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);

  const [newName, setNewName] = useState('');
  const [newRoom, setNewRoom] = useState('Chamber 4C');
  const [newRole, setNewRole] = useState('Backend Intern & Open Source Fellow');

  if (!isOpen) return null;

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = (email || '').trim();
    const prefix = cleanEmail.split('@')[0] || 'fellow';
    const existing = FELLOW_MEMBERS.find((m) => m.name.toLowerCase().includes(prefix.toLowerCase()));
    if (existing) {
      onLogin(existing);
    } else {
      const customUser: Member = {
        id: 'usr-' + Date.now(),
        name: prefix.replace('.', ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase()),
        role: 'Tech Fellow',
        roomNumber: 'Chamber 4B',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        joinedDate: 'Joined Today',
        stipendSchedule: 'Bi-weekly (15th & 30th)',
        stipendFrequency: 'Bi-weekly (15th & 30th)',
        nextStipendDate: 'In 3 days',
        standing: 'good',
        trustSignalsCount: 3,
      };
      onLogin(customUser);
    }
    onClose();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const customUser: Member = {
      id: 'usr-' + Date.now(),
      name: newName,
      role: newRole,
      roomNumber: newRoom,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      joinedDate: 'Joined Today',
      stipendSchedule: 'Monthly (1st)',
      stipendFrequency: 'Monthly (1st)',
      nextStipendDate: 'In 5 days',
      standing: 'good',
      trustSignalsCount: 1,
    };
    onLogin(customUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="relative px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 font-bold text-sm shadow-xs">
              🛖
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Enter Colony
                </h3>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                  Hut4Devs Auth
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Access your chamber, peer support commitments, and trust trail
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 mt-4 p-1 bg-slate-200/70 dark:bg-slate-800/70 rounded-xl text-xs">
            <button
              onClick={() => setActiveTab('quick')}
              className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-all ${
                activeTab === 'quick'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Demo Fellows
            </button>
            <button
              onClick={() => setActiveTab('credentials')}
              className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-all ${
                activeTab === 'credentials'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('join')}
              className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-all ${
                activeTab === 'join'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Join Chamber
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'quick' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Select any fellow persona to experience Hut4Devs from their exact accommodation standpoint:
              </p>

              <div className="space-y-2">
                {FELLOW_MEMBERS.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => {
                      onLogin(member);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/80 bg-slate-50 hover:bg-emerald-50/40 dark:bg-slate-950/60 dark:hover:bg-emerald-950/30 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-emerald-500"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {member.name}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                            {member.roomNumber}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                          {member.role}
                        </p>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                          Stipend: {member.stipendFrequency || member.stipendSchedule || 'Monthly'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <span>Enter</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'credentials' && (
            <form onSubmit={handleCustomLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Fellow Email or Dev Handle
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex.chen@fellowship.dev"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Passkey or Chamber Token
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>Keep session in colony cache</span>
                </label>
                <button
                  type="button"
                  onClick={() => setActiveTab('quick')}
                  className="text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Use Demo Persona
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-semibold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Sign In & Verify Cryptographic Trail</span>
              </button>
            </form>
          )}

          {activeTab === 'join' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Jordan Rivera"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Chamber / Room Assignment
                </label>
                <input
                  type="text"
                  value={newRoom}
                  onChange={(e) => setNewRoom(e.target.value)}
                  placeholder="e.g. Chamber 4B, Room 3"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Role / Fellowship Track
                </label>
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="e.g. AI Systems Fellow, Frontend Resident"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  Joining creates a peer node in Hut4Devs. No credit scores are ever computed. Your trust trail is built solely through mutual accountability.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-semibold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span>Create Chamber Profile & Enter</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/70 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Zero Human Scoring Standard</span>
          </div>
          <span>v0.9 Colony Alpha</span>
        </div>

      </div>
    </div>
  );
};
