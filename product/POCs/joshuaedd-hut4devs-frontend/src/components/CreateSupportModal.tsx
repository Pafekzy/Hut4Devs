import React, { useState } from 'react';
import { SupportType, Member, PeerSupportItem } from '../types';
import { DollarSign, Heart, HandHeart, BookOpen, X } from 'lucide-react';

interface CreateSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: Member;
  defaultCategory?: 'rent' | 'utilities' | 'laptop_repair' | 'food' | 'certification';
  onCreateItem: (item: Omit<PeerSupportItem, 'id' | 'createdAt' | 'status' | 'vouchCount'>) => void;
}

export const CreateSupportModal: React.FC<CreateSupportModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  defaultCategory = 'rent',
  onCreateItem,
}) => {
  const [type, setType] = useState<SupportType>('loan');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(150);
  const [currency] = useState('USD');
  const [repaymentDueDate, setRepaymentDueDate] = useState('Next stipend arrival (28th)');
  const [category, setCategory] = useState<'rent' | 'laptop_repair' | 'utilities' | 'food' | 'certification'>(defaultCategory);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateItem({
      toMemberId: currentUser.id,
      toMemberName: currentUser.name,
      toMemberAvatar: currentUser.avatar,
      type,
      title,
      description,
      amount: type === 'mentorship' ? undefined : amount,
      currency,
      repaymentExpected: type === 'loan',
      repaymentDueDate: type === 'loan' ? repaymentDueDate : undefined,
      category,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Create Peer Support Request
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Clear terms protect relationships and eliminate misunderstandings.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Support Classification (Strict Semantic Distinction)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'loan', label: 'Loan', sub: 'Repayment expected', icon: DollarSign, color: 'text-amber-500' },
                { id: 'gift', label: 'Gift', sub: 'No repayment expected', icon: Heart, color: 'text-pink-500' },
                { id: 'contribution', label: 'Contribution', sub: 'Shared purpose (no debt)', icon: HandHeart, color: 'text-emerald-500' },
                { id: 'mentorship', label: 'Mentorship', sub: 'Skills & knowledge', icon: BookOpen, color: 'text-indigo-500' },
              ].map((t) => {
                const Icon = t.icon;
                const isSelected = type === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setType(t.id as SupportType)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-1 ring-emerald-500'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mt-0.5 ${t.color}`} />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{t.label}</span>
                      <span className="text-[10px] text-slate-400 leading-tight block">{t.sub}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Rent bridge until 28th stipend, Backup SSD pool"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
            >
              <option value="rent">Accommodation & Rent</option>
              <option value="utilities">Chamber Utilities / Internet</option>
              <option value="laptop_repair">Hardware & Laptop Repair</option>
              <option value="food">Chamber Meals / Pantry</option>
              <option value="certification">Developer Certification / Tools</option>
            </select>
          </div>

          {type !== 'mentorship' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Amount (USD)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono"
                  required
                />
              </div>

              {type === 'loan' ? (
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Repayment Window
                  </label>
                  <input
                    type="text"
                    value={repaymentDueDate}
                    onChange={(e) => setRepaymentDueDate(e.target.value)}
                    placeholder="e.g. Oct 28th (Stipend arrival)"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              ) : (
                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 pt-6">
                  <span>No repayment schedule required for {type}</span>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Context & Need Details
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the context transparently for your fellow roommates..."
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              required
            />
          </div>

          <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-[11px] text-indigo-900 dark:text-indigo-300 leading-relaxed">
            💡 "Saying NO must be safe." Fellows can decline your request freely without social friction or demerits.
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950"
            >
              Publish to Chamber
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
