import React, { useState, useEffect } from 'react';
import { LandingView } from './components/LandingView';
import { MemberHomeView } from './components/MemberHomeView';
import { ResponsibilityDetailView } from './components/ResponsibilityDetailView';
import { AccommodationAdminView } from './components/AccommodationAdminView';
import { DEMO_ACCOMMODATION_RESPONSIBILITY } from './data/demoAccommodation';
import { AccommodationPaymentIntent } from './domain/accommodation';

type AppView = 'landing' | 'member-home' | 'responsibility-detail' | 'accommodation-admin';
type AppTheme = 'light' | 'dark';

export default function App() {
  // Theme state with localStorage persistence
  const [theme, setTheme] = useState<AppTheme>(() => {
    try {
      const savedTheme = localStorage.getItem('h4d_theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
      }
    } catch {
      // Ignore localStorage read errors in restricted sandbox
    }
    return 'light';
  });

  // Active view: 'landing' | 'member-home' | 'responsibility-detail'
  const [view, setView] = useState<AppView>('landing');

  // Prepared payment intents (H4D-FUNC-004) - Invariant: does not modify responsibility
  const [preparedIntents, setPreparedIntents] = useState<AccommodationPaymentIntent[]>([]);

  const handleIntentPrepared = (newIntent: AccommodationPaymentIntent) => {
    setPreparedIntents((prev) => [...prev, newIntent]);
  };

  // Synchronize document theme class and body background
  useEffect(() => {
    try {
      localStorage.setItem('h4d_theme', theme);
    } catch {
      // Ignore storage errors
    }

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#2F1707';
      document.body.style.color = '#FFF9EE';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#F7F1E7';
      document.body.style.color = '#5A2D0C';
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen">
      {view === 'landing' && (
        <LandingView
          isDark={isDark}
          onToggleTheme={toggleTheme}
          onEnter={() => setView('member-home')}
        />
      )}

      {view === 'member-home' && (
        <MemberHomeView
          isDark={isDark}
          responsibility={DEMO_ACCOMMODATION_RESPONSIBILITY}
          onToggleTheme={toggleTheme}
          onExitToLanding={() => setView('landing')}
          onViewResponsibilityDetails={() => setView('responsibility-detail')}
          onSwitchToAdmin={() => setView('accommodation-admin')}
        />
      )}

      {view === 'responsibility-detail' && (
        <ResponsibilityDetailView
          responsibility={DEMO_ACCOMMODATION_RESPONSIBILITY}
          isDark={isDark}
          onToggleTheme={toggleTheme}
          onBackToHome={() => setView('member-home')}
          preparedIntents={preparedIntents}
          onIntentPrepared={handleIntentPrepared}
        />
      )}

      {view === 'accommodation-admin' && (
        <AccommodationAdminView
          isDark={isDark}
          responsibilities={[DEMO_ACCOMMODATION_RESPONSIBILITY]}
          onToggleTheme={toggleTheme}
          onSwitchToFellow={() => setView('member-home')}
          onExitToLanding={() => setView('landing')}
        />
      )}
    </div>
  );
}
