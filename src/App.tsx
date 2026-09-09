import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { ChambersView } from './components/ChambersView';
import { PeerSupportHub } from './components/PeerSupportHub';
import { VouchingHub } from './components/VouchingHub';
import { TrustTrailView } from './components/TrustTrailView';
import { RecognitionBadges } from './components/RecognitionBadges';
import { PaymentGatewaySlot } from './components/PaymentGatewaySlot';
import { RepairModal } from './components/RepairModal';
import { CreateSupportModal } from './components/CreateSupportModal';
import { RecordPaymentModal } from './components/RecordPaymentModal';
import { VerifiableStatementModal } from './components/VerifiableStatementModal';
import { ColonyMetaphorModal } from './components/ColonyMetaphorModal';
import { LoginModal } from './components/LoginModal';
import { LandingPage } from './components/LandingPage';
import { Footer } from './components/Footer';

import {
  CURRENT_USER,
  FELLOW_MEMBERS,
  INITIAL_CHAMBER,
  INITIAL_SUPPORT_ITEMS,
  INITIAL_VOUCHES,
  INITIAL_TRAIL_EVENTS,
  RECOGNITION_SIGNALS,
} from './mockData';
import { Member, PeerSupportItem, ContextualVouch, TrustTrailEvent } from './types';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('hut4devs_auth') === 'true';
  });

  const [currentUser, setCurrentUser] = useState<Member>(() => {
    const saved = localStorage.getItem('hut4devs_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
      }
    }
    return CURRENT_USER;
  });

  const [activeTab, setActiveTab] = useState<string>('chambers');
  const [chamber, setChamber] = useState(INITIAL_CHAMBER);
  const [supportItems, setSupportItems] = useState<PeerSupportItem[]>(() => {
    const saved = localStorage.getItem('hut4devs_support_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
      }
    }
    return INITIAL_SUPPORT_ITEMS;
  });
  const [vouches, setVouches] = useState<ContextualVouch[]>(() => {
    const saved = localStorage.getItem('hut4devs_vouches');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
      }
    }
    return INITIAL_VOUCHES;
  });
  const [trailEvents, setTrailEvents] = useState<TrustTrailEvent[]>(() => {
    const saved = localStorage.getItem('hut4devs_trail_events');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
      }
    }
    return INITIAL_TRAIL_EVENTS;
  });

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [colonyModalOpen, setColonyModalOpen] = useState(false);
  const [repairModalOpen, setRepairModalOpen] = useState(false);
  const [statementModalOpen, setStatementModalOpen] = useState(false);
  const [createSupportModalOpen, setCreateSupportModalOpen] = useState(false);
  const [recordPaymentModalOpen, setRecordPaymentModalOpen] = useState(false);
  const [paymentModalData, setPaymentModalData] = useState({
    amount: 600,
    category: 'rent',
    title: 'October Shared Chamber Rent',
  });

  useEffect(() => {
    localStorage.setItem('hut4devs_auth', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('hut4devs_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('hut4devs_support_items', JSON.stringify(supportItems));
  }, [supportItems]);

  useEffect(() => {
    localStorage.setItem('hut4devs_vouches', JSON.stringify(vouches));
  }, [vouches]);

  useEffect(() => {
    localStorage.setItem('hut4devs_trail_events', JSON.stringify(trailEvents));
  }, [trailEvents]);

  const handleSelectUser = (user: Member) => {
    setCurrentUser(user);
  };

  const handleLogin = (member: Member) => {
    setCurrentUser(member);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleOpenRecordPayment = (category: string, amount: number, title: string) => {
    setPaymentModalData({ category, amount, title });
    setRecordPaymentModalOpen(true);
  };

  const handleOpenPeerSupportWithCategory = (category: 'rent' | 'utilities') => {
    setActiveTab('support');
    setCreateSupportModalOpen(true);
  };

  const handleFulfillSupport = (item: PeerSupportItem) => {
    setSupportItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: 'fulfilled' } : i))
    );

    const newEvent: TrustTrailEvent = {
      id: 'evt-' + Date.now(),
      timestamp: 'Just now',
      type: 'support_provided',
      actorName: currentUser.name,
      actorAvatar: currentUser.avatar,
      title: `Peer Support Fulfill: ${item.title}`,
      details: `Provided ${item.type.toUpperCase()} support for ${item.toMemberName}. Anchored to peer mutual aid record.`,
      amount: item.amount,
      hash: '0x' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      isPrivate: false,
      verified: true,
      evidenceRef: 'AID-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
    };

    setTrailEvents((prev) => [newEvent, ...prev]);
  };

  const handleDeclineSupport = (item: PeerSupportItem) => {
    setSupportItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: 'declined' } : i))
    );
  };

  const handleCreateSupportItem = (newItem: Omit<PeerSupportItem, 'id' | 'createdAt' | 'status' | 'vouchCount'>) => {
    const item: PeerSupportItem = {
      ...newItem,
      id: 'sup-' + Date.now(),
      createdAt: 'Just now',
      status: 'open',
      vouchCount: 1,
    };
    setSupportItems((prev) => [item, ...prev]);

    const event: TrustTrailEvent = {
      id: 'evt-' + Date.now(),
      timestamp: 'Just now',
      type: 'commitment_created',
      actorName: currentUser.name,
      actorAvatar: currentUser.avatar,
      title: `Peer Support Request: ${item.title}`,
      details: `Classification: ${item.type.toUpperCase()}. Category: ${item.category}. Repayment expected: ${item.repaymentExpected ? 'Yes' : 'No'}.`,
      amount: item.amount,
      hash: '0x' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      isPrivate: false,
      verified: true,
    };
    setTrailEvents((prev) => [event, ...prev]);
  };

  const handleAddVouch = (newVouch: Omit<ContextualVouch, 'id' | 'timestamp'>) => {
    const vouch: ContextualVouch = {
      ...newVouch,
      id: 'vch-' + Date.now(),
      timestamp: 'Just now',
    };
    setVouches((prev) => [vouch, ...prev]);

    const event: TrustTrailEvent = {
      id: 'evt-' + Date.now(),
      timestamp: 'Just now',
      type: 'vouch_issued',
      actorName: currentUser.name,
      actorAvatar: currentUser.avatar,
      title: `Contextual Vouch for ${vouch.targetMemberName}`,
      details: `Context: ${vouch.context}. Confidence: ${vouch.confidenceLevel.toUpperCase()}. Commitment Ref: ${vouch.commitmentReference}.`,
      hash: '0x' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      isPrivate: false,
      verified: true,
    };
    setTrailEvents((prev) => [event, ...prev]);
  };

  const handleCommitRepair = (details: {
    commitmentTitle: string;
    difficultyReason: string;
    revisedDate: string;
    partialAmount: number;
    note: string;
  }) => {
    const event: TrustTrailEvent = {
      id: 'evt-' + Date.now(),
      timestamp: 'Just now',
      type: 'repair_completed',
      actorName: currentUser.name,
      actorAvatar: currentUser.avatar,
      title: `Repair Initiated: ${details.commitmentTitle}`,
      details: `Early notice: ${details.difficultyReason}. Revised due date agreed: ${details.revisedDate}. Partial settlement: $${details.partialAmount}.`,
      amount: details.partialAmount,
      hash: '0x' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      isPrivate: false,
      verified: true,
      repairRef: 'RP-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
    };
    setTrailEvents((prev) => [event, ...prev]);
  };

  const handleConfirmPayment = (amount: number, category: string, title: string, note: string) => {
    const event: TrustTrailEvent = {
      id: 'evt-' + Date.now(),
      timestamp: 'Just now',
      type: 'payment_recorded',
      actorName: currentUser.name,
      actorAvatar: currentUser.avatar,
      title,
      details: `Settled $${amount} via ${note}. Verified matching chamber schedule.`,
      amount,
      hash: '0x' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      isPrivate: false,
      verified: true,
      evidenceRef: 'TX-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
    };
    setTrailEvents((prev) => [event, ...prev]);
  };

  const handlePaymentSimulatorSuccess = (amount: number, category: string, title: string, method: string) => {
    handleConfirmPayment(amount, category, title, `${method} (Gateway Checkout Simulation)`);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 selection:bg-emerald-500 selection:text-white">
        
        {!isAuthenticated ? (
          <LandingPage
            onEnterApp={(member) => {
              if (member) setCurrentUser(member);
              setIsAuthenticated(true);
            }}
            onOpenLogin={() => setLoginModalOpen(true)}
            onOpenColonyModal={() => setColonyModalOpen(true)}
          />
        ) : (
          <>
            <Navbar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              currentUser={currentUser}
              allMembers={FELLOW_MEMBERS}
              onSelectUser={handleSelectUser}
              onOpenColonyModal={() => setColonyModalOpen(true)}
              onOpenLanding={() => setIsAuthenticated(false)}
              onLogout={handleLogout}
            />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {activeTab === 'chambers' && (
                <ChambersView
                  chamber={chamber}
                  currentUser={currentUser}
                  onOpenRecordPayment={handleOpenRecordPayment}
                  onOpenPeerSupport={handleOpenPeerSupportWithCategory}
                  onOpenRepairModal={() => setRepairModalOpen(true)}
                />
              )}

              {activeTab === 'support' && (
                <PeerSupportHub
                  items={supportItems}
                  currentUser={currentUser}
                  onOpenCreateSupport={() => setCreateSupportModalOpen(true)}
                  onFulfillSupport={handleFulfillSupport}
                  onDeclineSupport={handleDeclineSupport}
                />
              )}

              {activeTab === 'vouching' && (
                <VouchingHub
                  vouches={vouches}
                  currentUser={currentUser}
                  allMembers={FELLOW_MEMBERS}
                  onAddVouch={handleAddVouch}
                />
              )}

              {activeTab === 'trails' && (
                <TrustTrailView
                  events={trailEvents}
                  onOpenStatementModal={() => setStatementModalOpen(true)}
                />
              )}

              {activeTab === 'recognition' && (
                <RecognitionBadges
                  badges={RECOGNITION_SIGNALS}
                  currentUser={currentUser}
                />
              )}

              {activeTab === 'payments' && (
                <PaymentGatewaySlot
                  currentUser={currentUser}
                  onSimulateSuccess={handlePaymentSimulatorSuccess}
                />
              )}
            </main>

            <Footer
              onOpenColonyModal={() => setColonyModalOpen(true)}
              onOpenStatementModal={() => setStatementModalOpen(true)}
            />
          </>
        )}

        <LoginModal
          isOpen={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          onLogin={handleLogin}
          currentMember={currentUser}
        />

        <ColonyMetaphorModal
          isOpen={colonyModalOpen}
          onClose={() => setColonyModalOpen(false)}
        />

        <RepairModal
          isOpen={repairModalOpen}
          onClose={() => setRepairModalOpen(false)}
          currentUser={currentUser}
          onCommitRepair={handleCommitRepair}
        />

        <CreateSupportModal
          isOpen={createSupportModalOpen}
          onClose={() => setCreateSupportModalOpen(false)}
          currentUser={currentUser}
          onCreateItem={handleCreateSupportItem}
        />

        <RecordPaymentModal
          isOpen={recordPaymentModalOpen}
          onClose={() => setRecordPaymentModalOpen(false)}
          currentUser={currentUser}
          initialAmount={paymentModalData.amount}
          initialCategory={paymentModalData.category}
          initialTitle={paymentModalData.title}
          onConfirmPayment={handleConfirmPayment}
        />

        <VerifiableStatementModal
          isOpen={statementModalOpen}
          onClose={() => setStatementModalOpen(false)}
          currentUser={currentUser}
          events={trailEvents}
        />

      </div>
    </ThemeProvider>
  );
}
