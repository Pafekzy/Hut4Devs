import React, { useState, useEffect } from 'react';
import { LandingView } from './components/LandingView';
import { MemberHomeView } from './components/MemberHomeView';
import { ResponsibilityDetailView } from './components/ResponsibilityDetailView';
import { AccommodationAdminView } from './components/AccommodationAdminView';
import { DEMO_ACCOMMODATION_RESPONSIBILITY } from './data/demoAccommodation';
import {
  AccommodationResponsibility,
  AccommodationPaymentIntent,
  PaymentIntentStatus,
} from './domain/accommodation';
import { ExternalPaymentProposal } from './domain/payments';
import {
  fetchAccommodationState,
  savePaymentIntent,
  subscribeToAdminStream,
} from './services/paymentClient';

type AppView = 'landing' | 'member-home' | 'responsibility-detail' | 'accommodation-admin';
type AppTheme = 'light' | 'dark';

export default function App() {
  // Theme state with localStorage persistence (UI preference only, not authoritative financial state)
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

  // Active view: 'landing' | 'member-home' | 'responsibility-detail' | 'accommodation-admin'
  const [view, setView] = useState<AppView>('landing');

  // Authoritative accommodation responsibility from PostgreSQL
  const [responsibility, setResponsibility] = useState<AccommodationResponsibility>(
    DEMO_ACCOMMODATION_RESPONSIBILITY
  );

  // Prepared payment intents (H4D-FUNC-004 & H4D-FUNC-008) - Authoritative PostgreSQL persistence
  const [preparedIntents, setPreparedIntents] = useState<AccommodationPaymentIntent[]>([]);

  // Created payment proposals (H4D-FUNC-005 & H4D-FUNC-008) - Authoritative PostgreSQL persistence
  const [paymentProposals, setPaymentProposals] = useState<ExternalPaymentProposal[]>([]);

  // Truthful error state if database is unavailable
  const [dbError, setDbError] = useState<string | null>(null);

  // Live stream connection state (H4D-FUNC-010)
  const [streamStatus, setStreamStatus] = useState<
    'connecting' | 'connected' | 'error' | 'disconnected'
  >('disconnected');

  // Initial load: Fetch authoritative persistence state from PostgreSQL
  useEffect(() => {
    let isMounted = true;
    if (typeof fetch === 'function') {
      fetchAccommodationState()
        .then((state) => {
          if (!isMounted) return;
          if (state && state.success) {
            if (state.responsibility) {
              setResponsibility(state.responsibility);
            }
            if (state.preparedIntents && state.preparedIntents.length > 0) {
              setPreparedIntents(state.preparedIntents);
            }
            if (state.paymentProposals && state.paymentProposals.length > 0) {
              setPaymentProposals(state.paymentProposals);
            }
          }
        })
        .catch(() => {});
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Real-time operational stream for Accommodation Admin (H4D-FUNC-010)
  // Receives outbox broadcast events when payment intents or proposals are created.
  useEffect(() => {
    const unsubscribe = subscribeToAdminStream(
      (event) => {
        if (event.eventType === 'accommodation.payment_intent.prepared') {
          const payload = event.data;
          if (payload && payload.intentId) {
            const incomingIntent: AccommodationPaymentIntent = {
              id: payload.intentId,
              responsibilityId: payload.responsibilityId,
              amount: Number(payload.amount),
              fulfilmentType: payload.fulfilmentType || 'PARTIAL',
              status: PaymentIntentStatus.PREPARED,
              createdAt: payload.createdAt || new Date().toISOString(),
            };
            setPreparedIntents((prev) => {
              const exists = prev.some((i) => i.id === incomingIntent.id);
              if (exists) {
                return prev.map((i) => (i.id === incomingIntent.id ? incomingIntent : i));
              }
              return [...prev, incomingIntent];
            });
          }
        } else if (event.eventType === 'accommodation.payment_proposal.created') {
          const payload = event.data;
          if (payload && payload.proposalId) {
            const incomingProposal: ExternalPaymentProposal = {
              id: payload.proposalId,
              paymentIntentId: payload.paymentIntentId,
              responsibilityId: payload.responsibilityId,
              amount: Number(payload.amount),
              currency: payload.currency || 'NGN',
              provider: payload.provider,
              providerProposalId: payload.providerProposalId || payload.proposalId,
              providerStatus: payload.providerStatus,
              isSimulated: Boolean(payload.isSimulated),
              createdAt: payload.createdAt || new Date().toISOString(),
            };
            setPaymentProposals((prev) => {
              const exists = prev.some((p) => p.id === incomingProposal.id);
              if (exists) {
                return prev.map((p) => (p.id === incomingProposal.id ? incomingProposal : p));
              }
              return [...prev, incomingProposal];
            });
          }
        }
      },
      (status) => {
        setStreamStatus(status);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const handleIntentPrepared = async (newIntent: AccommodationPaymentIntent) => {
    try {
      const res = await savePaymentIntent(newIntent);
      if (!res.success) {
        setDbError(res.error || 'Failed to persist payment intent to PostgreSQL.');
        return;
      }
      setPreparedIntents((prev) => {
        const filtered = prev.filter((i) => i.id !== newIntent.id);
        return [...filtered, newIntent];
      });
    } catch (err: any) {
      setDbError(err.message || 'Database unavailable.');
    }
  };

  const handleProposalCreated = (newProposal: ExternalPaymentProposal) => {
    setPaymentProposals((prev) => {
      const filtered = prev.filter((p) => p.id !== newProposal.id);
      return [...filtered, newProposal];
    });
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
      {dbError && (
        <aside
          role="alert"
          className="w-full bg-amber-900/20 border-b border-amber-700/40 px-4 py-2 text-center text-xs text-amber-200"
        >
          {dbError}
        </aside>
      )}

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
          responsibility={responsibility}
          onToggleTheme={toggleTheme}
          onExitToLanding={() => setView('landing')}
          onViewResponsibilityDetails={() => setView('responsibility-detail')}
          onSwitchToAdmin={() => setView('accommodation-admin')}
        />
      )}

      {view === 'responsibility-detail' && (
        <ResponsibilityDetailView
          responsibility={responsibility}
          isDark={isDark}
          onToggleTheme={toggleTheme}
          onBackToHome={() => setView('member-home')}
          preparedIntents={preparedIntents}
          onIntentPrepared={handleIntentPrepared}
          paymentProposals={paymentProposals}
          onProposalCreated={handleProposalCreated}
        />
      )}

      {view === 'accommodation-admin' && (
        <AccommodationAdminView
          isDark={isDark}
          responsibilities={[responsibility]}
          onToggleTheme={toggleTheme}
          onSwitchToFellow={() => setView('member-home')}
          onExitToLanding={() => setView('landing')}
          paymentProposals={paymentProposals}
          preparedIntents={preparedIntents}
          streamStatus={streamStatus}
        />
      )}
    </div>
  );
}
