import React, { useState, useEffect } from 'react';
import { CampusRoom } from '../../domain/roomOperations';
import { roomCommonsStore, RoomNotice } from '../../services/roomCommonsStore';
import {
  FileText,
  Plus,
  Clock,
  Sparkles,
  Tag,
  Shield,
  Zap,
  Volume2,
  Trash2,
  CheckCircle2,
} from 'lucide-react';

interface RoomCommonsProps {
  room: CampusRoom;
  isDark?: boolean;
  activeMemberName?: string;
  actingCapacity?: string;
  canPost?: boolean;
}

export const RoomCommons: React.FC<RoomCommonsProps> = ({
  room,
  isDark = false,
  activeMemberName = 'Chinedu Okeke',
  actingCapacity = 'Room Captain — Room 304',
  canPost = true,
}) => {
  const [notices, setNotices] = useState<RoomNotice[]>([]);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [category, setCategory] = useState<RoomNotice['category']>('GUIDELINE');
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  useEffect(() => {
    const loadNotices = () => {
      setNotices(roomCommonsStore.getNotices(room.id));
    };

    loadNotices();
    const unsub = roomCommonsStore.subscribe(loadNotices);
    return () => unsub();
  }, [room.id]);

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    roomCommonsStore.addNotice({
      roomId: room.id,
      roomName: room.roomNumber,
      title: title.trim(),
      content: content.trim(),
      category,
      postedBy: `${activeMemberName} (${actingCapacity})`,
    });

    setTitle('');
    setContent('');
    setShowAddForm(false);
    setSuccessBanner('Notice successfully posted to Room Commons and recorded in Room Trail.');
    setTimeout(() => setSuccessBanner(null), 5000);
  };

  const getCategoryBadge = (cat: RoomNotice['category']) => {
    switch (cat) {
      case 'GUIDELINE':
        return {
          label: 'Living Guideline',
          className: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-700',
          icon: <Volume2 className="w-3 h-3" />,
        };
      case 'SCHEDULE':
        return {
          label: 'Power & Schedule',
          className: 'bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950/60 dark:text-sky-200 dark:border-sky-700',
          icon: <Zap className="w-3 h-3" />,
        };
      case 'FACILITY':
        return {
          label: 'Facility Care',
          className: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-700',
          icon: <Trash2 className="w-3 h-3" />,
        };
      case 'ANNOUNCEMENT':
      default:
        return {
          label: 'Room Notice',
          className: 'bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950/60 dark:text-purple-200 dark:border-purple-700',
          icon: <Sparkles className="w-3 h-3" />,
        };
    }
  };

  return (
    <div id={`room-commons-${room.id}`} className="space-y-6">
      {successBanner && (
        <div
          role="status"
          className="p-4 rounded-xl border-2 border-b-3 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-100 flex items-start gap-3 shadow-xs"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm font-medium">{successBanner}</div>
        </div>
      )}

      {/* Main Commons Card */}
      <section
        aria-labelledby="room-commons-heading"
        className="h4d-card-static rounded-2xl p-5 sm:p-7 border-2 border-b-4 shadow-md backdrop-blur-md"
        style={{
          backgroundColor: isDark ? 'rgba(23, 21, 19, 0.55)' : '#FFF0D6',
          borderColor: isDark ? 'rgba(200, 141, 58, 0.35)' : '#CF9F68',
        }}
      >
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b-2 gap-3"
          style={{ borderColor: isDark ? 'rgba(200, 141, 58, 0.20)' : '#CF9F68' }}
        >
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#C46F18] dark:text-[#C88D3A]" />
              <h2
                id="room-commons-heading"
                className="text-xs sm:text-sm font-semibold uppercase tracking-wider"
                style={{ color: isDark ? '#FFF9EE' : '#432006' }}
              >
                Room Commons &amp; Living Space Guidelines
              </h2>
            </div>
            <p
              className="text-xs mt-0.5"
              style={{ color: isDark ? '#D9C4AC' : '#5A3013' }}
            >
              Collaborative agreements, quiet hours, and facility protocols established for {room.roomNumber}.
            </p>
          </div>

          {canPost && (
            <button
              type="button"
              id="btn-toggle-add-notice"
              onClick={() => setShowAddForm(!showAddForm)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border-2 border-b-3 transition-all duration-150 cursor-pointer flex items-center gap-1.5 active:translate-y-[1px] self-start sm:self-auto ${
                isDark
                  ? 'bg-[#C88D3A] text-[#241104] border-[#915B15]'
                  : 'bg-[#432006] text-[#FFF0D6] border-[#381B07]'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddForm ? 'Cancel' : 'Post Room Guideline'}</span>
            </button>
          )}
        </div>

        {/* Form to Post New Notice */}
        {showAddForm && (
          <form
            onSubmit={handleCreateNotice}
            className="p-5 mb-6 rounded-xl border-2 border-b-3 shadow-xs space-y-4"
            style={{
              backgroundColor: isDark ? 'rgba(30, 27, 24, 0.50)' : '#FAE5C5',
              borderColor: isDark ? 'rgba(200, 141, 58, 0.35)' : '#CF9F68',
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label
                  htmlFor="notice-title"
                  className="block text-xs font-bold uppercase tracking-wider mb-1"
                  style={{ color: isDark ? '#FFF9EE' : '#432006' }}
                >
                  Guideline Title
                </label>
                <input
                  id="notice-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Quiet Hours & Inverter Usage"
                  className="w-full text-xs p-2.5 rounded-lg border-2 border-b-3"
                  style={{
                    backgroundColor: isDark ? 'rgba(23, 21, 19, 0.8)' : '#FFF8EE',
                    borderColor: isDark ? 'rgba(200, 141, 58, 0.3)' : '#CF9F68',
                    color: isDark ? '#FFF9EE' : '#432006',
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="notice-category"
                  className="block text-xs font-bold uppercase tracking-wider mb-1"
                  style={{ color: isDark ? '#FFF9EE' : '#432006' }}
                >
                  Category
                </label>
                <select
                  id="notice-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-lg border-2 border-b-3"
                  style={{
                    backgroundColor: isDark ? 'rgba(23, 21, 19, 0.8)' : '#FFF8EE',
                    borderColor: isDark ? 'rgba(200, 141, 58, 0.3)' : '#CF9F68',
                    color: isDark ? '#FFF9EE' : '#432006',
                  }}
                >
                  <option value="GUIDELINE">Living Guideline</option>
                  <option value="SCHEDULE">Power &amp; Schedule</option>
                  <option value="FACILITY">Facility Care</option>
                  <option value="ANNOUNCEMENT">Room Notice</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="notice-content"
                className="block text-xs font-bold uppercase tracking-wider mb-1"
                style={{ color: isDark ? '#FFF9EE' : '#432006' }}
              >
                Detailed Guidance
              </label>
              <textarea
                id="notice-content"
                rows={3}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Specify community expectations, agreed times, or maintenance notes..."
                className="w-full text-xs p-2.5 rounded-lg border-2 border-b-3"
                style={{
                  backgroundColor: isDark ? 'rgba(23, 21, 19, 0.8)' : '#FFF8EE',
                  borderColor: isDark ? 'rgba(200, 141, 58, 0.3)' : '#CF9F68',
                  color: isDark ? '#FFF9EE' : '#432006',
                }}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border-2 border-b-3"
                style={{
                  backgroundColor: isDark ? 'rgba(42, 34, 28, 0.6)' : '#FFF0D6',
                  borderColor: isDark ? 'rgba(200, 141, 58, 0.3)' : '#CF9F68',
                  color: isDark ? '#FFF9EE' : '#432006',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                id="btn-submit-notice"
                className={`px-4 py-1.5 text-xs font-bold rounded-lg border-2 border-b-3 cursor-pointer active:translate-y-[1px] ${
                  isDark
                    ? 'bg-[#C88D3A] text-[#241104] border-[#915B15]'
                    : 'bg-[#432006] text-[#FFF0D6] border-[#381B07]'
                }`}
              >
                Publish Guideline
              </button>
            </div>
          </form>
        )}

        {/* Notices List */}
        <div className="space-y-4">
          {notices.map((notice) => {
            const badge = getCategoryBadge(notice.category);

            return (
              <article
                key={notice.id}
                id={`notice-card-${notice.id}`}
                className="h4d-card-static p-5 sm:p-6 rounded-xl border-2 border-b-3 shadow-xs backdrop-blur-xs"
                style={{
                  backgroundColor: isDark ? 'rgba(30, 27, 24, 0.45)' : '#FFF8EE',
                  borderColor: isDark ? 'rgba(200, 141, 58, 0.35)' : '#CF9F68',
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 mb-2 border-b"
                  style={{ borderColor: isDark ? 'rgba(200, 141, 58, 0.15)' : '#CF9F68' }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold border flex items-center gap-1 ${badge.className}`}
                    >
                      {badge.icon}
                      <span>{badge.label}</span>
                    </span>
                    <h3
                      className="font-serif font-bold text-sm sm:text-base"
                      style={{ color: isDark ? '#FFF9EE' : '#432006' }}
                    >
                      {notice.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#C46F18] dark:text-[#C88D3A]">
                    <Clock className="w-3 h-3" />
                    <span>
                      {new Date(notice.postedAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <p
                  className="text-xs sm:text-sm leading-relaxed"
                  style={{ color: isDark ? '#FFF9EE' : '#432006' }}
                >
                  {notice.content}
                </p>

                <div
                  className="mt-3 text-[11px] font-medium"
                  style={{ color: isDark ? '#D9C4AC' : '#5A3013' }}
                >
                  Posted by: <strong className="font-semibold">{notice.postedBy}</strong>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};
