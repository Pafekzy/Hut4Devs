import React, { useState } from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  FileText, 
  X, 
  Sun,
  Moon,
  Compass
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Member } from '../types';
import { FELLOW_MEMBERS } from '../mockData';
import { Hut4DevsLogo } from './Hut4DevsLogo';
import heroVisualImg from '../assets/images/fellows_supporting_1788915673951.jpg';

interface LandingPageProps {
  onEnterApp: (member?: Member) => void;
  onOpenLogin: () => void;
  onOpenColonyModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  onOpenColonyModal,
}) => {
  const currentYear = new Date().getFullYear();
  const { theme, toggleTheme } = useTheme();

  const [emailInput, setEmailInput] = useState('');
  const [selectedCohort, setSelectedCohort] = useState('Chamber 4B — Fall Fellowship 2026');
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();
    
    if (cleanEmail) {
      const matched = FELLOW_MEMBERS.find((m) => 
        m.name.toLowerCase().includes(cleanEmail.split('@')[0]) ||
        (m.handle && cleanEmail.includes(m.handle.toLowerCase()))
      );
      if (matched) {
        onEnterApp(matched);
        return;
      }
      
      const newFellow: Member = {
        id: 'usr-' + Date.now(),
        name: cleanEmail.split('@')[0].replace('.', ' ').replace(/(^\w|\s\w)/g, (c) => c.toUpperCase()),
        role: 'Tech Fellow',
        roomNumber: 'Chamber 4B',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        joinedDate: 'Joined Cohort',
        stipendSchedule: 'Bi-weekly (15th & 30th)',
        stipendFrequency: 'Bi-weekly (15th & 30th)',
        nextStipendDate: 'In 3 days',
        standing: 'good',
        trustSignalsCount: 0,
      };
      onEnterApp(newFellow);
      return;
    }

    onEnterApp(FELLOW_MEMBERS[0]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#0F2A57] dark:bg-[#0F2A57] dark:text-[#F8F9FA] transition-colors duration-300 selection:bg-[#00F0FF] selection:text-[#0F2A57]">
      
      {/* [TOP BAR / NAVIGATION] */}
      <header className="w-full border-b border-slate-200/80 dark:border-[#1E293B]/80 bg-white/95 dark:bg-[#0F2A57]/95 backdrop-blur-md sticky top-0 z-30 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* [Brand Logo] - Fixed in placeholder with uploaded Hut4Devs logo */}
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); }}
            className="flex items-center group focus:outline-none focus:ring-2 focus:ring-[#00F0FF] rounded-xl p-1 text-[#0F2A57] dark:text-[#F8F9FA] hover:opacity-90 transition-all"
            title="Hut4Devs Home"
          >
            <Hut4DevsLogo size="md" variant="full" />
          </a>

          {/* Top Bar Utilities: Theme Toggle & Colony Metaphor */}
          <div className="flex items-center gap-3">
            
            {/* Light / Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold font-mono transition-all border border-slate-200 dark:border-slate-700 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-[#1E293B] dark:hover:bg-[#1E293B]/80 dark:text-slate-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#00F0FF]"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Light and Dark Mode"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-[#00F0FF]" />
                  <span className="hidden sm:inline">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-[#0F2A57]" />
                  <span className="hidden sm:inline">Dark Mode</span>
                </>
              )}
            </button>

            {/* Minimal utility: Colony Metaphor link */}
            <button
              onClick={onOpenColonyModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-[#00F0FF] hover:bg-slate-100 dark:hover:bg-[#1E293B] border border-transparent hover:border-slate-300 dark:hover:border-[#1E293B] transition-all"
            >
              <Compass className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>Colony Manifesto</span>
            </button>

          </div>

        </div>
      </header>

      {/* [HERO VISUAL - Full width edge-to-edge, not in a box, slightly faded at the bottom] */}
      <div className="relative w-full overflow-hidden bg-[#0F2A57]">
        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[2.5/1] lg:aspect-[3/1] max-h-[480px]">
          <img
            src={heroVisualImg}
            alt="Black young adult fellows and roommates supporting each other in a cozy shared apartment living room"
            className="w-full h-full object-cover object-[center_30%]"
          />
          
          {/* Faded at the bottom - seamlessly blending side-to-side into page background in both themes */}
          <div 
            className="absolute inset-x-0 bottom-0 h-28 sm:h-36 md:h-48 pointer-events-none bg-gradient-to-b from-transparent via-[#F8F9FA]/60 to-[#F8F9FA] dark:via-[#0F2A57]/60 dark:to-[#0F2A57] transition-colors duration-300"
          />
        </div>
      </div>

      {/* [HERO SECTION] */}
      <main className="flex-1 flex flex-col py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto w-full space-y-8 text-center">
          
          {/* Main Headline - with no writeups or boxes/placeholders before it */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0F2A57] dark:text-[#F8F9FA] leading-[1.15]">
            Turning shared developer living into{' '}
            <span className="text-[#00F0FF] dark:text-[#00F0FF] underline decoration-[#00F0FF]/40 decoration-wavy">
              trails of trust
            </span>{' '}
            built by us and for us-all
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-3xl mx-auto">
            Hut4Devs helps fellows and interns coordinate shared responsibilities, support one another, and honour commitments — with evidence that holds up, and privacy that holds firm. Accommodation is where it begins, not where it ends.
          </p>

          {/* [3. LEAD CAPTURE FORM] */}
            <div className="bg-white dark:bg-[#1E293B] p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-2xl space-y-6 max-w-xl mx-auto text-left transition-colors duration-200">
              
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label htmlFor="lead-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 font-mono">
                    Fellow Email or Community Handle
                  </label>
                  <input
                    id="lead-email"
                    type="text"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="e.g. alex@cohort.dev or alexchen"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#0F2A57] border border-slate-300 dark:border-slate-600 text-[#0F2A57] dark:text-[#F8F9FA] placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:border-[#00F0FF] focus:ring-2 focus:ring-[#00F0FF]/20 transition-all font-mono"
                  />
                </div>

                <div>
                  <label htmlFor="lead-cohort" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 font-mono">
                    Active Chamber / Residency Cohort
                  </label>
                  <select
                    id="lead-cohort"
                    value={selectedCohort}
                    onChange={(e) => setSelectedCohort(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#0F2A57] border border-slate-300 dark:border-slate-600 text-[#0F2A57] dark:text-[#F8F9FA] text-sm focus:outline-none focus:border-[#00F0FF] focus:ring-2 focus:ring-[#00F0FF]/20 transition-all font-mono"
                  >
                    <option value="Chamber 4B — Fall Fellowship 2026">Chamber 4B — Fall Fellowship 2026</option>
                    <option value="Hacker House 2A — Systems & AI Cohort">Hacker House 2A — Systems & AI Cohort</option>
                    <option value="Residency Studio 7 — Open Source Fellows">Residency Studio 7 — Open Source Fellows</option>
                  </select>
                </div>

                {/* CTA Button: "[Login]" in vibrant Electric Teal (#00F0FF) / Neon Lime (#39FF14) */}
                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-xl font-extrabold text-sm uppercase tracking-wider bg-[#00F0FF] hover:bg-[#39FF14] text-[#0F2A57] flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#00F0FF]/25 hover:shadow-[#39FF14]/30 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  <span>Login</span>
                  <ArrowRight className="w-4 h-4 text-[#0F2A57]" />
                </button>
              </form>

              {/* Instant Fellow Persona Selectors for quick testing */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700/60 space-y-2">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono block">
                  Instant Demo Login: Select an active chamber fellow
                </span>
                <div className="flex flex-wrap gap-2">
                  {FELLOW_MEMBERS.map((member) => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => onEnterApp(member)}
                      className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#0F2A57] dark:hover:bg-[#0F2A57]/80 border border-slate-300 dark:border-slate-700 hover:border-[#00F0FF]/60 text-xs text-slate-700 dark:text-slate-200 transition-all hover:scale-[1.02]"
                    >
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-4 h-4 rounded-full object-cover"
                      />
                      <span className="font-semibold">{member.name.split(' ')[0]}</span>
                      <span className="text-[10px] text-[#00F0FF] font-mono">{member.roomNumber}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Guarantees Strip */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#39FF14]" />
                <span>No 3-Digit Credit Scores</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#39FF14]" />
                <span>Selective Privacy Disclosure</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#39FF14]" />
                <span>Cryptographic SHA-256 Proofs</span>
              </div>
            </div>

          </div>
      </main>

      {/* [FOOTER] */}
      <footer className="w-full border-t border-slate-200 dark:border-[#1E293B] bg-white dark:bg-[#0F2A57] py-8 px-4 sm:px-6 lg:px-8 mt-auto transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 font-mono">
          
          <div>
            © {currentYear} Hut4Devs. All rights reserved.
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPrivacyModal(true)}
              className="hover:text-[#00F0FF] transition-colors underline decoration-slate-400 dark:decoration-slate-600 hover:decoration-[#00F0FF] focus:outline-none"
            >
              Privacy Policy
            </button>
            <span className="text-slate-400 dark:text-slate-600">|</span>
            <button
              onClick={() => setShowTermsModal(true)}
              className="hover:text-[#00F0FF] transition-colors underline decoration-slate-400 dark:decoration-slate-600 hover:decoration-[#00F0FF] focus:outline-none"
            >
              Terms of Service
            </button>
          </div>

        </div>
      </footer>

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl text-[#0F2A57] dark:text-[#F8F9FA] space-y-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#00F0FF]" />
                <h3 className="text-lg font-bold font-mono text-[#0F2A57] dark:text-[#F8F9FA]">Privacy Policy</h3>
              </div>
              <button 
                onClick={() => setShowPrivacyModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                aria-label="Close Privacy Policy modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <h4 className="font-bold text-[#0F2A57] dark:text-[#00F0FF] uppercase tracking-wider text-xs font-mono">1. Selective Disclosure by Design</h4>
              <p>
                Hut4Devs operates on zero-knowledge and selective disclosure principles. You control what data is shared on any Verifiable Statement. You may redact roommate identities, internal notes, or raw monetary figures while mathematically proving 100% on-time lease fulfillment.
              </p>

              <h4 className="font-bold text-[#0F2A57] dark:text-[#00F0FF] uppercase tracking-wider text-xs font-mono">2. Zero Credit Bureau Surveillance</h4>
              <p>
                We categorically reject algorithmic scoring and third-party credit bureau reporting. Your rental and mutual aid history is never sold, licensed, or surrendered to data brokers, ad networks, or predatory agencies.
              </p>

              <h4 className="font-bold text-[#0F2A57] dark:text-[#00F0FF] uppercase tracking-wider text-xs font-mono">3. Client-Side Cryptographic Hashing</h4>
              <p>
                Trail events are anchored via SHA-256 cryptographic hashes. Tampering with any historical record invalidates the verification hash, guaranteeing transparency without centralized surveillance.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="px-5 py-2.5 rounded-xl bg-[#00F0FF] text-[#0F2A57] font-bold text-xs uppercase tracking-wider hover:bg-[#39FF14] transition-colors cursor-pointer"
              >
                Understood & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl text-[#0F2A57] dark:text-[#F8F9FA] space-y-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#39FF14]" />
                <h3 className="text-lg font-bold font-mono text-[#0F2A57] dark:text-[#F8F9FA]">Terms of Service</h3>
              </div>
              <button 
                onClick={() => setShowTermsModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                aria-label="Close Terms of Service modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <h4 className="font-bold text-[#0F2A57] dark:text-[#39FF14] uppercase tracking-wider text-xs font-mono">1. Unconditional Right to Say "No"</h4>
              <p>
                Mutual aid is strictly voluntary. Any fellow has the sovereign, unconditional right to decline any peer support request without penalty, reputational degradation, or system demerits.
              </p>

              <h4 className="font-bold text-[#0F2A57] dark:text-[#39FF14] uppercase tracking-wider text-xs font-mono">2. The Repair Protocol vs. Penalties</h4>
              <p>
                In the event of delayed internship stipends or unforeseen expense shocks, members agree to engage the Repair Protocol: proactive notice, revised clearance dates, and transparent chamber communication. Early communication is recognized as integrity, not default.
              </p>

              <h4 className="font-bold text-[#0F2A57] dark:text-[#39FF14] uppercase tracking-wider text-xs font-mono">3. Non-Custodial Infrastructure</h4>
              <p>
                Hut4Devs is coordination software, not a bank or money transmitter. We do not hold user funds in custodial accounts or levy platform take-rates on peer assistance.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <button
                onClick={() => setShowTermsModal(false)}
                className="px-5 py-2.5 rounded-xl bg-[#39FF14] text-[#0F2A57] font-bold text-xs uppercase tracking-wider hover:bg-[#00F0FF] transition-colors cursor-pointer"
              >
                Accept & Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
