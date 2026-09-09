import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Sparkles, 
  ShieldCheck, 
  Home, 
  Users, 
  CheckCircle2, 
  History, 
  CreditCard, 
  ChevronDown, 
  Check, 
  Image as ImageIcon,
  LogOut,
  ExternalLink
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Member } from '../types';
import { Hut4DevsLogo } from './Hut4DevsLogo';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: Member;
  allMembers: Member[];
  onSelectUser: (user: Member) => void;
  onOpenColonyModal: () => void;
  onOpenLanding?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  allMembers,
  onSelectUser,
  onOpenColonyModal,
  onOpenLanding,
  onLogout,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [logoInfoOpen, setLogoInfoOpen] = useState(false);

  const navItems = [
    { id: 'chambers', label: 'Chambers', icon: Home, badge: '4B' },
    { id: 'support', label: 'Peer Support', icon: Users, count: 2 },
    { id: 'vouching', label: 'Vouching', icon: ShieldCheck },
    { id: 'trails', label: 'Trails of Trust', icon: History, verified: true },
    { id: 'recognition', label: 'Recognition', icon: CheckCircle2 },
    { id: 'payments', label: 'Payment Gateway', icon: CreditCard, tag: 'Gateway Slot' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors duration-200 bg-white/90 border-slate-200/80 dark:bg-slate-950/90 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          <div className="flex items-center gap-3">
            <div 
              id="brand-logo-container"
              onClick={onOpenLanding}
              className="group flex items-center gap-2.5 px-2 py-1 rounded-xl cursor-pointer transition-transform hover:scale-[1.02] text-[#0F2A57] dark:text-[#F8F9FA]"
              title="Hut4Devs - Home"
            >
              <Hut4DevsLogo size="sm" variant="full" />
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono border-l border-slate-300 dark:border-slate-700 pl-2.5">
                <span>Chamber 4B</span>
                <span className="text-emerald-600 dark:text-emerald-400">• Active</span>
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs dark:bg-white dark:text-slate-900'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                      isActive ? 'bg-slate-700 text-slate-200 dark:bg-slate-200 dark:text-slate-800' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {item.tag && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {item.tag}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            
            {onOpenLanding && (
              <button
                id="btn-nav-landing"
                onClick={onOpenLanding}
                className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg font-medium border border-slate-200 hover:bg-slate-100 text-slate-600 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 transition-colors"
                title="View Landing Page & Philosophy"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Landing</span>
              </button>
            )}

            <button
              id="btn-colony-principles"
              onClick={onOpenColonyModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg font-medium border border-slate-200 hover:bg-slate-100 text-slate-700 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 transition-colors"
              title="View The Colony Metaphor & Principles"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Colony Manifesto</span>
            </button>

            <div className="relative">
              <button
                id="btn-user-switcher"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/80 transition-all text-left"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-emerald-500/30"
                />
                <div className="hidden sm:flex flex-col text-xs leading-tight">
                  <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[90px]">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {currentUser.roomNumber}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl shadow-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Switch Fellow Perspective
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Test actions from different chamber roles
                    </p>
                  </div>
                  <div className="py-1">
                    {allMembers.map((member) => (
                      <button
                        key={member.id}
                        onClick={() => {
                          onSelectUser(member);
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div className="text-left">
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {member.name}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              {member.role} • {member.roomNumber}
                            </p>
                          </div>
                        </div>
                        {currentUser.id === member.id && (
                          <Check className="w-4 h-4 text-emerald-500" />
                        )}
                      </button>
                    ))}
                  </div>

                  {onLogout && (
                    <div className="pt-1.5 mt-1.5 border-t border-slate-100 dark:border-slate-800 px-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log Out to Landing Page</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors shadow-xs"
              aria-label="Toggle between dark and light theme"
              title={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 transition-transform hover:-rotate-12" />
              )}
            </button>

          </div>
        </div>

        <div className="flex md:hidden overflow-x-auto py-2 gap-1 scrollbar-none border-t border-slate-100 dark:border-slate-800/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {logoInfoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Reserved Logo Asset Space
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ready for your befitting Hut4Devs official logo
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <p>
                A dedicated, responsive logo container is engineered in the navigation brand bar, landing page, and footer.
              </p>
              <div className="border-t border-slate-200 dark:border-slate-800 pt-2 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                <div>• Placement: <span className="text-emerald-500">Header Nav, Landing & Footer</span></div>
                <div>• Recommended Aspect: <span className="text-emerald-500">1:1 or 3:1 (Horizontal)</span></div>
                <div>• Format: <span className="text-emerald-500">SVG, PNG (Transparent)</span></div>
                <div>• Theme Adaptive: <span className="text-emerald-500">Supported in Dark & Light</span></div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setLogoInfoOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
