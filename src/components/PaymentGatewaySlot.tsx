import React, { useState } from 'react';
import { CreditCard, Landmark, Smartphone, Zap, CheckCircle2, ShieldCheck, Sparkles, Terminal } from 'lucide-react';
import { Member } from '../types';

interface PaymentGatewaySlotProps {
  currentUser: Member;
  onSimulateSuccess: (amount: number, category: string, title: string, method: string) => void;
}

export const PaymentGatewaySlot: React.FC<PaymentGatewaySlotProps> = ({
  currentUser,
  onSimulateSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'bank' | 'momo' | 'stellar'>('bank');
  const [amount, setAmount] = useState<number>(600);
  const [purpose, setPurpose] = useState<'rent' | 'utility' | 'peer_repay'>('rent');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<{
    txId: string;
    hash: string;
    amount: number;
    method: string;
    timestamp: string;
  } | null>(null);

  const methods = [
    {
      id: 'bank',
      title: 'Direct Bank Transfer',
      desc: 'ACH, SEPA, or Local Clearing with automated settlement reconciliation',
      icon: Landmark,
      badge: 'Zero Fee',
    },
    {
      id: 'card',
      title: 'Debit / Credit Card',
      desc: 'Instant gateway tokenization (Stripe / Paystack / Flutterwave ready)',
      icon: CreditCard,
      badge: 'Instant',
    },
    {
      id: 'momo',
      title: 'Mobile Money',
      desc: 'Direct STK push & USSD integration (M-Pesa, MTN, Airtel)',
      icon: Smartphone,
      badge: 'Regional Dev Favorite',
    },
    {
      id: 'stellar',
      title: 'Stellar / Soroban Adapter',
      desc: 'Minimal cryptographic proof & settlement anchor (architecture-ready)',
      icon: Zap,
      badge: 'Open Protocol',
    },
  ];

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const generatedTx = 'TX-' + Math.random().toString(36).substring(2, 9).toUpperCase();
      const generatedHash = '0x' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const methodLabel = methods.find(m => m.id === selectedMethod)?.title || 'Gateway';

      const receipt = {
        txId: generatedTx,
        hash: generatedHash,
        amount,
        method: methodLabel,
        timestamp: new Date().toLocaleTimeString(),
      };

      setSuccessReceipt(receipt);
      setIsProcessing(false);

      const titleMap = {
        rent: 'Chamber Rent Share Settlement',
        utility: 'Shared High-Speed Fiber Internet Pool',
        peer_repay: 'Peer Bridge Repayment to Roommate',
      };

      onSimulateSuccess(amount, purpose, titleMap[purpose], methodLabel);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="space-y-1 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Modular Integration Slot</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Payment Gateway Integration
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            A dedicated slot primed for your upcoming payment gateway documentation and SDK. Test live simulated transactions and observe how verifiable evidence is instantly registered on the Trust Trail.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-dashed border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Status: Ready for Docs & SDK</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-500" />
              <span>Interactive Checkout Simulator</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Settlement Purpose
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'rent', label: 'Chamber Rent', defaultAmt: 600 },
                  { id: 'utility', label: 'Utility Share', defaultAmt: 45 },
                  { id: 'peer_repay', label: 'Peer Loan Repay', defaultAmt: 200 },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setPurpose(p.id as any);
                      setAmount(p.defaultAmt);
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                      purpose === p.id
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Payment Amount (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm font-bold text-slate-400">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2 rounded-xl text-sm font-bold font-mono border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Select Payment Rail / Provider
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {methods.map((method) => {
                  const Icon = method.icon;
                  const isSelected = selectedMethod === method.id;

                  return (
                    <div
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id as any)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-1 ring-emerald-500'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className={`p-2 rounded-lg shrink-0 ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                            {method.title}
                          </h4>
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {method.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                          {method.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <button
                id="btn-simulate-checkout"
                disabled={isProcessing}
                onClick={handleSimulatePayment}
                className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 transition-all flex items-center justify-center gap-2 shadow-md"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Authorizing with Gateway & Anchoring Trail...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authorize & Settle ${amount} with {methods.find(m => m.id === selectedMethod)?.title}</span>
                  </>
                )}
              </button>
            </div>

            {successReceipt && (
              <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/40 dark:border-emerald-800 space-y-2 text-xs text-slate-800 dark:text-slate-200 animate-in fade-in">
                <div className="flex items-center justify-between font-bold text-emerald-800 dark:text-emerald-300">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Transaction Successfully Verified & Anchored
                  </span>
                  <span className="font-mono">{successReceipt.timestamp}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                  <div>Tx ID: <span className="font-bold text-slate-900 dark:text-white">{successReceipt.txId}</span></div>
                  <div>Settled: <span className="font-bold text-emerald-600 dark:text-emerald-400">${successReceipt.amount} USD</span></div>
                  <div>Rail: <span className="text-slate-600 dark:text-slate-300">{successReceipt.method}</span></div>
                  <div>Anchor Hash: <span className="text-slate-600 dark:text-slate-300">{successReceipt.hash}</span></div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-emerald-200 dark:border-emerald-800/60">
                  ✓ Event published to chamber members. Verifiable on Trails of Trust tab.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Gateway Specification Slot
              </h3>
            </div>
            
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              When your payment-gateway document is supplied, it will link directly into this client adapter without requiring structural changes:
            </p>

            <div className="p-3 rounded-lg bg-slate-950 text-slate-200 font-mono text-[11px] space-y-1.5 overflow-x-auto">
              <div className="text-slate-500">// Hut4Devs Gateway Adapter Hook</div>
              <div><span className="text-purple-400">interface</span> <span className="text-emerald-400">GatewayPayload</span> {'{'}</div>
              <div className="pl-3">chamberId: <span className="text-amber-400">string</span>;</div>
              <div className="pl-3">actorId: <span className="text-amber-400">string</span>;</div>
              <div className="pl-3">amount: <span className="text-blue-400">number</span>;</div>
              <div className="pl-3">purpose: <span className="text-amber-400">'rent' | 'peer_support'</span>;</div>
              <div className="pl-3">webhookSignature: <span className="text-amber-400">string</span>;</div>
              <div>{'}'}</div>
            </div>

            <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
              <p>• <strong>Off-Chain Storage</strong>: PII remains encrypted</p>
              <p>• <strong>On-Chain Anchor</strong>: Hash registered to Trust Trail</p>
              <p>• <strong>Instant Webhooks</strong>: Real-time chamber status sync</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 text-xs space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-emerald-500" />
              <span>Supported Regional Rails</span>
            </h4>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
              Ready for pan-African and global corridors: Stripe, Paystack, Flutterwave, M-Pesa Daraja API, and Stellar SEP-24 / Soroban smart anchors.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
